"use client";

import React, { lazy, Suspense } from "react";
import { LandingPageComponent } from "@/lib/landing-page-actions";

// Lazy load components to reduce initial bundle size
const HeroComponent = lazy(() =>
  import("@/components/landing-page/components/hero-component").then((m) => ({
    default: m.HeroComponent,
  }))
);

const FormComponent = lazy(() =>
  import("@/components/landing-page/components/form-component").then((m) => ({
    default: m.FormComponent,
  }))
);

const GalleryComponent = lazy(() =>
  import("@/components/landing-page/components/gallery-component").then(
    (m) => ({
      default: m.GalleryComponent,
    })
  )
);

const CustomImageComponent = lazy(() =>
  import("@/components/landing-page/components/custom-image-component").then(
    (m) => ({
      default: m.CustomImageComponent,
    })
  )
);

const FeaturesComponent = lazy(() =>
  import("@/components/landing-page/components/features-component").then(
    (m) => ({
      default: m.FeaturesComponent,
    })
  )
);

const CTAComponent = lazy(() =>
  import("@/components/landing-page/components/cta-component").then((m) => ({
    default: m.CTAComponent,
  }))
);

// Load other components dynamically based on usage
const loadComponent = (type: string) => {
  switch (type) {
    case "testimonial":
      return lazy(() =>
        import(
          "@/components/landing-page/components/testimonial-component"
        ).then((m) => ({
          default: m.TestimonialComponent,
        }))
      );
    case "content":
      return lazy(() =>
        import("@/components/landing-page/components/content-component").then(
          (m) => ({
            default: m.ContentComponent,
          })
        )
      );
    case "pricing":
      return lazy(() =>
        import("@/components/landing-page/components/pricing-component").then(
          (m) => ({
            default: m.PricingComponent,
          })
        )
      );
    case "faq":
      return lazy(() =>
        import("@/components/landing-page/components/faq-component").then(
          (m) => ({
            default: m.FAQComponent,
          })
        )
      );
    case "statistics":
      return lazy(() =>
        import(
          "@/components/landing-page/components/statistics-component"
        ).then((m) => ({
          default: m.StatisticsComponent,
        }))
      );
    case "video":
      return lazy(() =>
        import("@/components/landing-page/components/video-component").then(
          (m) => ({
            default: m.VideoComponent,
          })
        )
      );
    case "timeline":
      return lazy(() =>
        import("@/components/landing-page/components/timeline-component").then(
          (m) => ({
            default: m.TimelineComponent,
          })
        )
      );
    case "location":
      return lazy(() =>
        import("@/components/landing-page/components/location-component").then(
          (m) => ({
            default: m.LocationComponent,
          })
        )
      );
    case "copyright":
      return lazy(() =>
        import("@/components/landing-page/components/copyright-component").then(
          (m) => ({
            default: m.CopyrightComponent,
          })
        )
      );
    case "footer":
      return lazy(() =>
        import("@/components/landing-page/components/footer-component").then(
          (m) => ({
            default: m.FooterComponent,
          })
        )
      );
    case "facilities":
      return lazy(() =>
        import(
          "@/components/landing-page/components/facilities-component"
        ).then((m) => ({
          default: m.FacilitiesComponent,
        }))
      );
    case "unit-slider":
      return lazy(() =>
        import(
          "@/components/landing-page/components/unit-slider-component"
        ).then((m) => ({
          default: m.UnitSliderComponent,
        }))
      );
    case "progress-slider":
      return lazy(() =>
        import(
          "@/components/landing-page/components/progress-slider-component"
        ).then((m) => ({
          default: m.ProgressSliderComponent,
        }))
      );
    case "bank-partnership":
      return lazy(() =>
        import(
          "@/components/landing-page/components/bank-partnership-component"
        ).then((m) => ({
          default: m.BankPartnershipComponent,
        }))
      );
    case "agent-contact":
      return lazy(() =>
        import(
          "@/components/landing-page/components/agent-contact-component"
        ).then((m) => ({
          default: m.AgentContactComponent,
        }))
      );
    case "title-description":
      return lazy(() =>
        import(
          "@/components/landing-page/components/title-description-component"
        ).then((m) => ({
          default: m.TitleDescriptionComponent,
        }))
      );
    case "location-access":
      return lazy(() =>
        import(
          "@/components/landing-page/components/location-access-component"
        ).then((m) => ({
          default: m.LocationAccessComponent,
        }))
      );
    case "promo":
      return lazy(() =>
        import("@/components/landing-page/components/promo-component").then(
          (m) => ({
            default: m.PromoComponent,
          })
        )
      );
    default:
      return null;
  }
};

interface OptimizedLandingPageBuilderProps {
  components: LandingPageComponent[];
  onUpdateComponentAction?: (id: string, config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
  projectId?: string;
  projectName?: string;
}

// Component loading skeleton
function ComponentSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
    </div>
  );
}

function DynamicComponent({
  component,
  commonProps,
  projectId,
  projectName,
}: {
  component: LandingPageComponent;
  commonProps: any;
  projectId?: string;
  projectName?: string;
}) {
  const LazyComponent = loadComponent(component.type);

  if (!LazyComponent) {
    return (
      <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center text-gray-500 dark:text-gray-400">
        Unknown component type: {component.type}
      </div>
    );
  }

  return (
    <Suspense fallback={<ComponentSkeleton />}>
      <LazyComponent
        {...commonProps}
        {...(component.type === "form" ? { projectId, projectName } : {})}
      />
    </Suspense>
  );
}

export function OptimizedLandingPageBuilder({
  components,
  onUpdateComponentAction,
  previewMode,
  editable = true,
  projectId,
  projectName,
}: OptimizedLandingPageBuilderProps) {
  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  const renderComponent = (component: LandingPageComponent) => {
    const commonProps = {
      id: component.id,
      config: component.config,
      onUpdate: editable
        ? (config: any) => onUpdateComponentAction?.(component.id, config)
        : undefined,
      previewMode,
      editable,
    };

    // Render critical components (hero, form) immediately
    switch (component.type) {
      case "hero":
        return (
          <Suspense key={component.id} fallback={<ComponentSkeleton />}>
            <HeroComponent {...commonProps} />
          </Suspense>
        );
      case "form":
        return (
          <Suspense key={component.id} fallback={<ComponentSkeleton />}>
            <FormComponent
              {...commonProps}
              projectId={projectId}
              projectName={projectName}
            />
          </Suspense>
        );
      case "gallery":
        return (
          <Suspense key={component.id} fallback={<ComponentSkeleton />}>
            <GalleryComponent {...commonProps} />
          </Suspense>
        );
      case "custom-image":
        return (
          <Suspense key={component.id} fallback={<ComponentSkeleton />}>
            <CustomImageComponent {...commonProps} />
          </Suspense>
        );
      case "features":
        return (
          <Suspense key={component.id} fallback={<ComponentSkeleton />}>
            <FeaturesComponent {...commonProps} />
          </Suspense>
        );
      case "cta":
        return (
          <Suspense key={component.id} fallback={<ComponentSkeleton />}>
            <CTAComponent {...commonProps} />
          </Suspense>
        );
      default:
        // Lazy load other components
        return (
          <DynamicComponent
            key={component.id}
            component={component}
            commonProps={commonProps}
            projectId={projectId}
            projectName={projectName}
          />
        );
    }
  };

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
      {sortedComponents.map((component) => renderComponent(component))}
    </div>
  );
}
