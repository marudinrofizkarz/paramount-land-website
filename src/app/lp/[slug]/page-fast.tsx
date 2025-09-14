import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LandingPageBuilder } from "@/components/landing-page/landing-page-builder";
import { LandingPageActions } from "@/lib/landing-page-actions";
import { AnalyticsTracker } from "@/components/analytics-tracker";

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

  // Simplified metadata without complex data fetching
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
