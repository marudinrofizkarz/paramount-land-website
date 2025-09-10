"use client";

import React from "react";
import { LandingPageComponent } from "@/lib/landing-page-actions";
import { HeroComponent } from "@/components/landing-page/components/hero-component";
import { FormComponent } from "@/components/landing-page/components/form-component";
import { FeaturesComponent } from "@/components/landing-page/components/features-component";
import { TestimonialComponent } from "@/components/landing-page/components/testimonial-component";
import { CTAComponent } from "@/components/landing-page/components/cta-component";
import { ContentComponent } from "@/components/landing-page/components/content-component";
import { GalleryComponent } from "@/components/landing-page/components/gallery-component";
import { PricingComponent } from "@/components/landing-page/components/pricing-component";
import { FAQComponent } from "@/components/landing-page/components/faq-component";
import { StatisticsComponent } from "@/components/landing-page/components/statistics-component";
import { VideoComponent } from "@/components/landing-page/components/video-component";
import { TimelineComponent } from "@/components/landing-page/components/timeline-component";
import { LocationComponent } from "@/components/landing-page/components/location-component";
import { CustomImageComponent } from "@/components/landing-page/components/custom-image-component";
import { CopyrightComponent } from "@/components/landing-page/components/copyright-component";
import { FooterComponent } from "@/components/landing-page/components/footer-component";
import { FacilitiesComponent } from "@/components/landing-page/components/facilities-component";
import { UnitSliderComponent } from "@/components/landing-page/components/unit-slider-component";
import { ProgressSliderComponent } from "@/components/landing-page/components/progress-slider-component";
import { BankPartnershipComponent } from "@/components/landing-page/components/bank-partnership-component";
import { AgentContactComponent } from "@/components/landing-page/components/agent-contact-component";
import { TitleDescriptionComponent } from "@/components/landing-page/components/title-description-component";
import { LocationAccessComponent } from "@/components/landing-page/components/location-access-component";
import { PromoComponent } from "@/components/landing-page/components/promo-component";

interface LandingPageBuilderProps {
  components: LandingPageComponent[];
  onUpdateComponentAction?: (id: string, config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
  projectId?: string;
  projectName?: string;
}

export function LandingPageBuilder({
  components,
  onUpdateComponentAction,
  previewMode,
  editable = true,
  projectId,
  projectName,
}: LandingPageBuilderProps) {
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

    switch (component.type) {
      case "hero":
        return <HeroComponent key={component.id} {...commonProps} />;
      case "form":
        return (
          <FormComponent
            key={component.id}
            {...commonProps}
            projectId={projectId}
            projectName={projectName}
          />
        );
      case "features":
        return <FeaturesComponent key={component.id} {...commonProps} />;
      case "testimonial":
        return <TestimonialComponent key={component.id} {...commonProps} />;
      case "cta":
        return <CTAComponent key={component.id} {...commonProps} />;
      case "content":
        return <ContentComponent key={component.id} {...commonProps} />;
      case "gallery":
        return <GalleryComponent key={component.id} {...commonProps} />;
      case "pricing":
        return <PricingComponent key={component.id} {...commonProps} />;
      case "faq":
        return <FAQComponent key={component.id} {...commonProps} />;
      case "statistics":
        return <StatisticsComponent key={component.id} {...commonProps} />;
      case "video":
        return <VideoComponent key={component.id} {...commonProps} />;
      case "timeline":
        return <TimelineComponent key={component.id} {...commonProps} />;
      case "location":
        return <LocationComponent key={component.id} {...commonProps} />;
      case "custom-image":
        return <CustomImageComponent key={component.id} {...commonProps} />;
      case "copyright":
        return <CopyrightComponent key={component.id} {...commonProps} />;
      case "footer":
        return <FooterComponent key={component.id} {...commonProps} />;
      case "facilities":
        return <FacilitiesComponent key={component.id} {...commonProps} />;
      case "unit-slider":
        return <UnitSliderComponent key={component.id} {...commonProps} />;
      case "progress-slider":
        return <ProgressSliderComponent key={component.id} {...commonProps} />;
      case "bank-partnership":
        return <BankPartnershipComponent key={component.id} {...commonProps} />;
      case "agent-contact":
        return <AgentContactComponent key={component.id} {...commonProps} />;
      case "title-description":
        return (
          <TitleDescriptionComponent key={component.id} {...commonProps} />
        );
      case "location-access":
        return <LocationAccessComponent key={component.id} {...commonProps} />;
      case "promo":
        return <PromoComponent key={component.id} {...commonProps} />;
      default:
        return (
          <div
            key={component.id}
            className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center text-gray-500 dark:text-gray-400"
          >
            Unknown component type: {component.type}
          </div>
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
