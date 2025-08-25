"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  icon: string;
  bgColor: string;
  featured_image?: string;
  slug: string; // Tambahkan properti slug
}

interface NewsSliderProps {
  newsData: NewsItem[];
}

export function NewsSlider({ newsData }: NewsSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Use media query hook to detect mobile screens
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Calculate cards per view based on screen size
  const updateCardsPerView = useCallback(() => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) {
        setCardsPerView(1);
      } else if (width < 768) {
        setCardsPerView(2);
      } else if (width < 1024) {
        setCardsPerView(3);
      } else {
        setCardsPerView(4);
      }
    }
  }, []);

  // Calculate max index based on current cards per view
  const maxIndex = Math.max(0, newsData.length - cardsPerView);

  // Update slider position
  const updateSliderPosition = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const cardWidth = 320; // Fixed card width
    const gap = 24; // Gap between cards
    const slideWidth = cardWidth + gap;
    const translateX = -(currentIndex * slideWidth);

    slider.style.transform = `translateX(${translateX}px)`;
  }, [currentIndex]);

  // Touch event handling for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);

    // Pause auto-sliding during touch interaction
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const difference = touchStart - touchEnd;

    // Minimum swipe distance required
    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        // Swipe left, go to next slide
        if (currentIndex < maxIndex) {
          handleNextClick();
        }
      } else {
        // Swipe right, go to previous slide
        if (currentIndex > 0) {
          handlePrevClick();
        }
      }
    }

    // Resume auto-sliding after touch interaction on mobile
    if (isMobile && newsData.length > 1 && !autoplayTimerRef.current) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= maxIndex) {
            return 0;
          } else {
            return prevIndex + 1;
          }
        });
      }, 4500);
    }
  };

  // Handle previous button click
  const handlePrevClick = useCallback(() => {
    if (isTransitioning || currentIndex <= 0) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => Math.max(0, prev - 1));

    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentIndex, isTransitioning]);

  // Handle next button click
  const handleNextClick = useCallback(() => {
    if (isTransitioning || currentIndex >= maxIndex) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentIndex, maxIndex, isTransitioning]);

  // Initialize and handle resize
  useEffect(() => {
    updateCardsPerView();

    const handleResize = () => {
      updateCardsPerView();
      // Reset to first slide on resize to avoid layout issues
      setCurrentIndex(0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateCardsPerView]);

  // Update slider position when currentIndex changes
  useEffect(() => {
    updateSliderPosition();
  }, [updateSliderPosition]);

  // Reset index if it exceeds maxIndex (e.g., after resize)
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex]);

  // Auto-slide functionality for mobile
  useEffect(() => {
    if (isMobile && newsData.length > 1) {
      // Clear any existing timer
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }

      // Set up auto-sliding on mobile
      autoplayTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= maxIndex) {
            return 0; // Loop back to the beginning
          } else {
            return prevIndex + 1;
          }
        });
      }, 4500); // Auto-slide every 4.5 seconds (slightly different from projects to avoid synchronized sliding)
    } else if (autoplayTimerRef.current) {
      // Clear timer when not on mobile
      clearInterval(autoplayTimerRef.current);
    }

    // Clean up timer on unmount
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isMobile, maxIndex, newsData.length]);

  return (
    <section
      id="news-updates"
      className="w-full py-12 md:py-24 lg:py-32 bg-muted/40"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
            News & Updates
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-lg">
            Stay informed with the latest news, updates, and insights from our
            developments
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end mb-6">
          <div className="flex gap-2">
            <button
              onClick={handlePrevClick}
              disabled={currentIndex === 0 || isTransitioning}
              className={`flex items-center justify-center w-10 h-10 bg-background border border-border rounded-full transition-all duration-200 shadow-sm ${
                currentIndex === 0 || isTransitioning
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-muted hover:shadow-md"
              }`}
              aria-label="Previous news"
            >
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNextClick}
              disabled={currentIndex >= maxIndex || isTransitioning}
              className={`flex items-center justify-center w-10 h-10 bg-background border border-border rounded-full transition-all duration-200 shadow-sm ${
                currentIndex >= maxIndex || isTransitioning
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-muted hover:shadow-md"
              }`}
              aria-label="Next news"
            >
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* News Slider */}
        <div
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={sliderRef}
            className="flex gap-6 transition-transform duration-500 ease-in-out"
            style={{ width: `${newsData.length * (320 + 24)}px` }}
          >
            {newsData.map((news) => (
              <div
                key={news.id}
                className="flex-none w-80 bg-background rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className={`h-48 ${news.bgColor} flex items-center justify-center relative overflow-hidden`}
                >
                  {news.featured_image ? (
                    <Image
                      src={news.featured_image}
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-6xl opacity-30">{news.icon}</div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                      {news.category}
                    </span>
                    <span>•</span>
                    <span>{news.date}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {news.description}
                  </p>
                  <Link
                    href={`/news/${news.slug}`} // Ubah dari "#" ke path dengan slug
                    className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 500);
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              } ${isMobile ? "relative" : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {isMobile && index === currentIndex && (
                <span className="absolute inset-0 bg-primary/30 rounded-full animate-ping"></span>
              )}
            </button>
          ))}

          {/* Mobile auto-slide indicator */}
          {isMobile && (
            <div className="ml-2 flex items-center">
              <span className="text-xs text-muted-foreground">
                Auto-sliding
              </span>
              <div className="ml-1 w-4 h-4 relative">
                <svg
                  className="w-4 h-4 animate-spin text-primary"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/news" // Ubah dari "#" ke halaman daftar berita
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
          >
            View All News & Updates
          </Link>
        </div>
      </div>
    </section>
  );
}
