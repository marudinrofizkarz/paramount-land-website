import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LandingPageBuilder } from "@/components/landing-page/landing-page-builder";
import { LandingPageActions } from "@/lib/landing-page-actions";
import { AnalyticsTracker } from "@/components/analytics-tracker";

// Ultra-fast configuration - maximum performance
export const revalidate = 60; // Shorter cache for faster updates
export const dynamic = "auto";

interface LandingPageProps {
  params: {
    slug: string;
  };
}

// Ultra-fast data fetching with minimal processing
async function getLandingPageData(slug: string) {
  try {
    const result = await LandingPageActions.getBySlug(slug);
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error fetching landing page:", error);
    return null;
  }
}

// Minimal metadata for faster loading
export async function generateMetadata({
  params,
}: LandingPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Fast title generation without complex processing
  const title = `${slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")} | Paramount Land`;

  const description =
    "Discover premium residential properties by Paramount Land - Building Homes and People with Heart";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/lp/${slug}`,
      images: [
        {
          url: "https://res.cloudinary.com/paramount-land/image/upload/c_fill,w_1200,h_630/v1/og-images/paramount-land-og.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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

  return (
    <div className="landing-page-layout">
      <AnalyticsTracker landingPageId={(landingPage as any).id.toString()} />
      <LandingPageBuilder
        components={(landingPage as any).content || []}
        previewMode="desktop"
        editable={false}
      />
    </div>
  );
}
