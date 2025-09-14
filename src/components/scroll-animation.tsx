"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "zoomIn";
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

export function ScrollAnimation({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  className = "",
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, threshold]);

  const getAnimationClasses = () => {
    const baseClasses = "transition-all ease-out";
    const durationClass = `duration-${duration}`;

    if (!isVisible) {
      switch (animation) {
        case "fadeIn":
          return `${baseClasses} ${durationClass} opacity-0`;
        case "slideUp":
          return `${baseClasses} ${durationClass} opacity-0 translate-y-8`;
        case "slideLeft":
          return `${baseClasses} ${durationClass} opacity-0 translate-x-8`;
        case "slideRight":
          return `${baseClasses} ${durationClass} opacity-0 -translate-x-8`;
        case "zoomIn":
          return `${baseClasses} ${durationClass} opacity-0 scale-95`;
        default:
          return `${baseClasses} ${durationClass} opacity-0`;
      }
    }

    return `${baseClasses} ${durationClass} opacity-100 translate-x-0 translate-y-0 scale-100`;
  };

  return (
    <div ref={elementRef} className={`${getAnimationClasses()} ${className}`}>
      {children}
    </div>
  );
}

// Komponen wrapper untuk landing page components
export function AnimatedLandingPageComponent({
  children,
  index = 0,
}: {
  children: React.ReactNode;
  index?: number;
}) {
  // Variasi animasi berdasarkan index untuk variety
  const animations = [
    "fadeIn",
    "slideUp",
    "slideLeft",
    "slideRight",
    "zoomIn",
  ] as const;
  const animation = animations[index % animations.length];

  return (
    <ScrollAnimation
      animation={animation}
      delay={index * 100} // Stagger animation
      duration={600}
      threshold={0.1}
    >
      {children}
    </ScrollAnimation>
  );
}

// Hook untuk lazy loading images dengan intersection observer
export function useLazyImage(src: string) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return {
    imgRef,
    src: imageSrc,
    isLoaded,
    onLoad: handleLoad,
  };
}
