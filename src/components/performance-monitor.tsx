"use client";

import { useEffect } from "react";

export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== "undefined" && "performance" in window) {
      // Measure First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            console.log("FCP:", entry.startTime);
            // Kirim ke analytics jika diperlukan
          }
        }
      });
      fcpObserver.observe({ entryTypes: ["paint"] });

      // Measure Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log("LCP:", entry.startTime);
          // Kirim ke analytics jika diperlukan
        }
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // Measure Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        console.log("CLS:", clsValue);
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });

      // Measure First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log("FID:", (entry as any).processingStart - entry.startTime);
        }
      });
      fidObserver.observe({ entryTypes: ["first-input"] });

      // Cleanup observers
      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
      };
    }
  }, []);

  return null;
}
