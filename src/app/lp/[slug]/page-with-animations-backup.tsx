import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { OptimizedAnimatedLandingPageBuilder } from "@/components/landing-page/animated-landing-page-builder";
import { LandingPageActions } from "@/lib/landing-page-actions";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import {
  generateSocialMetadata,
  generateStructuredData,
} from "@/lib/metadata-generator";

// Optimized caching - enable static generation when possible
export const revalidate = 300; // Cache for 5 minutes

interface LandingPageProps {
  params: {
    slug: string;
  };
}

// Faster data fetching without timeout complexity
async function getLandingPageData(slug: string) {
  try {
    console.log(`Fetching landing page data for: ${slug}`);
    const result = await LandingPageActions.getBySlug(slug);
    console.log(
      `Result for ${slug}:`,
      result.success ? "SUCCESS" : result.error
    );
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error fetching landing page:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: LandingPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    // Fetch landing page data for complete metadata
    const landingPage = await getLandingPageData(slug);

    if (landingPage && (landingPage as any).status === "published") {
      // Generate rich metadata dengan OG image dan social tags
      return generateSocialMetadata(slug, landingPage);
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  // Fallback metadata jika gagal fetch data
  return {
    title: `${slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")} | Paramount Land`,
    description:
      "Discover premium residential properties by Paramount Land - Building Homes and People with Heart",
    openGraph: {
      title: `${slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")} | Paramount Land`,
      description:
        "Discover premium residential properties by Paramount Land - Building Homes and People with Heart",
      type: "website",
      url: `/lp/${slug}`,
      images: [
        {
          url: "https://res.cloudinary.com/paramount-land/image/upload/v1/og-images/default-og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Paramount Land",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")} | Paramount Land`,
      description:
        "Discover premium residential properties by Paramount Land - Building Homes and People with Heart",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { slug } = await params;
  const landingPage = await getLandingPageData(slug);

  if (!landingPage || (landingPage as any).status !== "published") {
    notFound();
  }

  // Generate structured data untuk SEO
  const structuredData = generateStructuredData(slug, landingPage);

  return (
    <div className="landing-page-layout">
      {/* Structured Data untuk SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <AnalyticsTracker landingPageId={(landingPage as any).id.toString()} />
      <OptimizedAnimatedLandingPageBuilder
        components={(landingPage as any).content || []}
        previewMode="desktop"
        editable={false}
      />
    </div>
  );
}
