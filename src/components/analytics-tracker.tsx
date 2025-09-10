"use client";

import { useEffect, useRef } from "react";

interface AnalyticsTrackerProps {
  landingPageId: string;
}

export function AnalyticsTracker({ landingPageId }: AnalyticsTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Track visit only once per page load
    if (!hasTracked.current && landingPageId) {
      trackVisit(landingPageId).catch((error: any) => {
        console.error("Error tracking visit:", error);
      });

      hasTracked.current = true;
    }
  }, [landingPageId]);

  // Track visit function using API
  const trackVisit = async (landingPageId: string) => {
    try {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          landingPageId,
          eventType: "visit",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to track visit");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to track visit");
      }
    } catch (error) {
      console.error("Error tracking visit:", error);
    }
  };

  // Track conversion when form is submitted
  const trackConversion = async () => {
    try {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          landingPageId,
          eventType: "conversion",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to track conversion");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to track conversion");
      }
    } catch (error) {
      console.error("Error tracking conversion:", error);
    }
  };

  // Expose trackConversion globally for form components
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).trackConversion = trackConversion;
    }
  }, [landingPageId]);

  return null; // This component doesn't render anything
}
