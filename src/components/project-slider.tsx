"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ProjectCard } from "@/components/project-card";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ProjectSliderProps {
  projects: any[];
  type: "residential" | "commercial";
}

export function ProjectSlider({ projects = [], type }: ProjectSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Use media query hook to detect mobile screens
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Calculate max index based on cards per view
  const maxIndex = Math.max(0, Math.ceil(projects.length / cardsPerView) - 1);

  // Update cards per view based on screen size
  const updateCardsPerView = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) {
      setCardsPerView(1); // Mobile: 1 card per view
    } else if (width < 1024) {
      setCardsPerView(2); // Tablet: 2 cards per view
    } else {
      setCardsPerView(3); // Desktop: 3 cards per view
    }
  }, []);

  // Update slider position
  const updateSliderPosition = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const cardWidth = 320; // Fixed card width
    const gap = 24; // Gap between cards
    const translateX = -currentIndex * cardsPerView * (cardWidth + gap);

    const carouselContent = slider.querySelector("[data-carousel-content]");
    if (carouselContent) {
      (
        carouselContent as HTMLElement
      ).style.transform = `translateX(${translateX}px)`;
    }
  }, [currentIndex, cardsPerView]);

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
    if (isMobile && projects.length > 1 && !autoplayTimerRef.current) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= maxIndex) {
            return 0;
          } else {
            return prevIndex + 1;
          }
        });
      }, 4000);
    }
  };

  // Handle previous click
  const handlePrevClick = useCallback(() => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  }, [currentIndex, isTransitioning]);

  // Handle next click
  const handleNextClick = useCallback(() => {
    if (currentIndex < maxIndex && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  }, [currentIndex, maxIndex, isTransitioning]);

  // Update cards per view on resize
  useEffect(() => {
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, [updateCardsPerView]);

  // Update slider position when currentIndex or cardsPerView changes
  useEffect(() => {
    updateSliderPosition();
  }, [updateSliderPosition]);

  // Auto-slide functionality for mobile
  useEffect(() => {
    if (isMobile && projects.length > 1) {
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
      }, 4000); // Auto-slide every 4 seconds
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
  }, [isMobile, maxIndex, projects.length]);

  if (projects.length === 0) {
    return null;
  }

  const linkHref =
    type === "residential"
      ? "/projects?type=residential"
      : "/projects?type=commercial";
  const linkText =
    type === "residential"
      ? "Lihat Semua Proyek Residensial"
      : "Lihat Semua Proyek Komersial";

  return (
    <div className="w-full">
      {/* Navigation Buttons */}
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center gap-2">
          <Link
            href={linkHref}
            className="text-primary border border-primary hover:bg-primary/5 text-sm font-medium inline-flex items-center gap-1 transition-colors duration-200 px-3 py-1.5 rounded-md"
          >
            Selengkapnya
          </Link>
          <button
            onClick={handlePrevClick}
            disabled={currentIndex === 0 || isTransitioning}
            className={`flex items-center justify-center w-10 h-10 bg-background border border-border rounded-full transition-all duration-200 shadow-sm ${
              currentIndex === 0 || isTransitioning
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-muted hover:shadow-md"
            }`}
            aria-label="Previous projects"
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
            aria-label="Next projects"
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

      {/* Slider Container */}
      <div
        className="relative overflow-hidden"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          data-carousel-content
          className="flex gap-6 transition-transform duration-500 ease-in-out"
          style={{ width: `${projects.length * (320 + 24)}px` }}
        >
          {projects.map((project) => (
            <div key={project.id} className="flex-none w-80">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
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
            <span className="text-xs text-muted-foreground">Auto-sliding</span>
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
    </div>
  );
}
