'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

  // Calculate cards per view based on screen size
  const updateCardsPerView = useCallback(() => {
    if (typeof window !== 'undefined') {
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

  // Handle previous button click
  const handlePrevClick = useCallback(() => {
    if (isTransitioning || currentIndex <= 0) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prev => Math.max(0, prev - 1));
    
    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentIndex, isTransitioning]);

  // Handle next button click
  const handleNextClick = useCallback(() => {
    if (isTransitioning || currentIndex >= maxIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    
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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
            Stay informed with the latest news, updates, and insights from our developments
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
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-muted hover:shadow-md'
              }`}
              aria-label="Previous news"
            >
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextClick}
              disabled={currentIndex >= maxIndex || isTransitioning}
              className={`flex items-center justify-center w-10 h-10 bg-background border border-border rounded-full transition-all duration-200 shadow-sm ${
                currentIndex >= maxIndex || isTransitioning
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-muted hover:shadow-md'
              }`}
              aria-label="Next news"
            >
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* News Slider */}
        <div className="relative overflow-hidden">
          <div 
            ref={sliderRef} 
            className="flex gap-6 transition-transform duration-500 ease-in-out"
            style={{ width: `${newsData.length * (320 + 24)}px` }}
          >
            {newsData.map((news) => (
              <div key={news.id} className="flex-none w-80 bg-background rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className={`h-48 ${news.bgColor} flex items-center justify-center relative overflow-hidden`}>
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
                  ? 'bg-primary w-6'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
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