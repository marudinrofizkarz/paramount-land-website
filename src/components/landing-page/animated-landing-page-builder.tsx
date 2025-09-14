"use client";

import React from "react";
import { LandingPageComponent } from "@/lib/landing-page-actions";
import { LandingPageBuilder } from "@/components/landing-page/landing-page-builder";
import { AnimatedLandingPageComponent } from "@/components/scroll-animation";

interface AnimatedLandingPageBuilderProps {
  components: LandingPageComponent[];
  onUpdateComponentAction?: (id: string, config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
  projectId?: string;
  projectName?: string;
}

// Enhanced wrapper yang menambahkan animasi pada setiap komponen
export function AnimatedLandingPageBuilder({
  components,
  onUpdateComponentAction,
  previewMode,
  editable = false,
  projectId,
  projectName,
}: AnimatedLandingPageBuilderProps) {
  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  // Jika tidak ada komponen, return empty state tanpa animasi
  if (components.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-center p-8">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Start Building Your Landing Page
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Add components from the sidebar to create your landing page
          </p>
          <div className="text-sm text-gray-400 dark:text-gray-500">
            Try adding a Hero section first, then a Contact Form
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {sortedComponents.map((component, index) => {
        // Skip animasi untuk hero section (first component) agar langsung muncul
        if (index === 0 && component.type === "hero") {
          return (
            <LandingPageBuilder
              key={component.id}
              components={[component]}
              onUpdateComponentAction={onUpdateComponentAction}
              previewMode={previewMode}
              editable={editable}
              projectId={projectId}
              projectName={projectName}
            />
          );
        }

        // Tambahkan animasi untuk komponen lainnya
        return (
          <AnimatedLandingPageComponent key={component.id} index={index - 1}>
            <LandingPageBuilder
              components={[component]}
              onUpdateComponentAction={onUpdateComponentAction}
              previewMode={previewMode}
              editable={editable}
              projectId={projectId}
              projectName={projectName}
            />
          </AnimatedLandingPageComponent>
        );
      })}
    </div>
  );
}

// Komponen alternatif untuk performance yang lebih baik
export function OptimizedAnimatedLandingPageBuilder({
  components,
  onUpdateComponentAction,
  previewMode,
  editable = false,
  projectId,
  projectName,
}: AnimatedLandingPageBuilderProps) {
  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  // Detect jika user prefer reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (components.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-center p-8">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Start Building Your Landing Page
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Add components from the sidebar to create your landing page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {sortedComponents.map((component, index) => {
        // Jika user prefer reduced motion atau komponen pertama, skip animasi
        if (prefersReducedMotion || index === 0) {
          return (
            <LandingPageBuilder
              key={component.id}
              components={[component]}
              onUpdateComponentAction={onUpdateComponentAction}
              previewMode={previewMode}
              editable={editable}
              projectId={projectId}
              projectName={projectName}
            />
          );
        }

        // Tambahkan animasi ringan untuk komponen lainnya
        return (
          <AnimatedLandingPageComponent
            key={component.id}
            index={Math.min(index - 1, 2)} // Limit variasi animasi untuk consistency
          >
            <LandingPageBuilder
              components={[component]}
              onUpdateComponentAction={onUpdateComponentAction}
              previewMode={previewMode}
              editable={editable}
              projectId={projectId}
              projectName={projectName}
            />
          </AnimatedLandingPageComponent>
        );
      })}
    </div>
  );
}
