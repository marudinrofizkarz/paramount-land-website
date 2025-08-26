"use client";

import { useEffect } from "react";

/**
 * CoreWebVitals is a component that helps optimize Core Web Vitals metrics
 * by implementing performance optimizations like:
 * 1. LCP (Largest Contentful Paint) optimizations
 * 2. CLS (Cumulative Layout Shift) prevention
 * 3. FID/INP (First Input Delay / Interaction to Next Paint) improvements
 */
export function CoreWebVitals() {
  useEffect(() => {
    // 1. Hint to the browser which resources are important
    if ("connection" in navigator) {
      // Using any because NetworkInformation is not fully typed in standard lib
      const connection = (navigator as any).connection;

      // Prevent unnecessary resource fetching on slow connections
      if (
        connection &&
        (connection.saveData === true ||
          (typeof connection.effectiveType === "string" &&
            (connection.effectiveType.includes("2g") ||
              connection.effectiveType.includes("slow"))))
      ) {
        // If on slow connection, we can disable preloading of non-critical resources
        document.querySelectorAll("link[rel=preload]").forEach((link) => {
          if (
            link.getAttribute("as") !== "font" &&
            link.getAttribute("as") !== "style"
          ) {
            link.setAttribute("rel", "prefetch");
          }
        });
      }
    }

    // 2. Optimize LCP by warming up connections
    const warmupConnections = () => {
      // Create a list of domains to warm up
      const domains = [
        "https://res.cloudinary.com",
        "https://www.googletagmanager.com",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
      ];

      domains.forEach((domain) => {
        const hint = document.createElement("link");
        hint.rel = "preconnect";
        hint.href = domain;
        hint.crossOrigin = "anonymous";
        document.head.appendChild(hint);

        // Also add DNS prefetch as fallback
        const dns = document.createElement("link");
        dns.rel = "dns-prefetch";
        dns.href = domain;
        document.head.appendChild(dns);
      });
    };

    // 3. Improve FID/INP by registering early for events
    const registerEarlyEvents = () => {
      // This helps reduce input delay by "warming up" the event system
      const eventTypes = [
        "click",
        "mousedown",
        "keydown",
        "touchstart",
        "pointerdown",
      ];
      const captureOptions = { passive: true, capture: true };

      const handler = () => {
        // Remove the listeners once any one of them is triggered
        eventTypes.forEach((type) => {
          document.removeEventListener(type, handler, captureOptions);
        });
      };

      eventTypes.forEach((type) => {
        document.addEventListener(type, handler, captureOptions);
      });
    };

    // 4. Prevent layout shifts by pre-allocating space for dynamic elements
    const preventLayoutShifts = () => {
      // Add CSS to prevent layout shifts from images
      const style = document.createElement("style");
      style.textContent = `
        img, video {
          aspect-ratio: attr(width) / attr(height);
          height: auto;
        }
        
        .image-container {
          overflow: hidden;
          position: relative;
        }
        
        @media (prefers-reduced-motion: no-preference) {
          .animate-fade-in {
            animation: fadeIn 0.5s ease forwards;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Run optimizations
    warmupConnections();
    registerEarlyEvents();
    preventLayoutShifts();

    // Optimize font loading
    document.fonts.ready.then(() => {
      document.documentElement.classList.add("fonts-loaded");
    });

    // Report Core Web Vitals to analytics (if needed)
    if ("web-vitals" in window) {
      import("web-vitals").then(({ onCLS, onLCP, onTTFB, onINP }) => {
        onCLS((metric: { value: number }) => console.log("CLS:", metric.value));
        onLCP((metric: { value: number }) => console.log("LCP:", metric.value));
        onTTFB((metric: { value: number }) =>
          console.log("TTFB:", metric.value)
        );
        onINP((metric: { value: number }) => console.log("INP:", metric.value));
      });
    }

    // Cleanup
    return () => {
      // Any cleanup logic if needed
    };
  }, []);

  // This component doesn't render anything
  return null;
}
