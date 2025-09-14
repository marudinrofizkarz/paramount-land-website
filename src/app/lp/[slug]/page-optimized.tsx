import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { OptimizedLandingPageActions } from "@/lib/optimized-landing-page-actions";
import { AnalyticsTracker } from "@/components/analytics-tracker";

// Optimized caching strategy
export const revalidate = 300; // Cache for 5 minutes instead of no caching

// Dynamic import for OptimizedLandingPageBuilder with loading
const OptimizedLandingPageBuilder = dynamic(
  () =>
    import("@/components/landing-page/optimized-landing-page-builder").then(
      (mod) => ({ default: mod.OptimizedLandingPageBuilder })
    ),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    ),
    ssr: false, // Client-side rendering for better performance
  }
);

interface LandingPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content: any[];
  status: "draft" | "published" | "archived";
  template_type: string;
  campaign_source?: string;
  target_audience?: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  tracking_code?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

interface LandingPageProps {
  params: {
    slug: string;
  };
}

// Optimized data fetching with error handling and timeout
async function getLandingPageData(slug: string) {
  try {
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 10000)
    );

    const dataPromise = OptimizedLandingPageActions.getBySlugCached(slug);

    const result = await Promise.race([dataPromise, timeoutPromise]);
    return (result as any).success ? (result as any).data : null;
  } catch (error) {
    console.error("Error fetching landing page:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: LandingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const landingPage = await getLandingPageData(slug);

  if (!landingPage || (landingPage as any).status !== "published") {
    return {
      title: "Page Not Found",
      description: "The requested landing page could not be found.",
    };
  }

  const page = landingPage as any;
  const baseTitle = page.meta_title || page.title;
  const title = baseTitle.includes("Paramount Land")
    ? baseTitle
    : `${baseTitle} | Paramount Land - Building Homes and People with Heart`;
  const description = page.meta_description || page.description || "";
  const ogImage = page.og_image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/lp/${page.slug}`,
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `/lp/${page.slug}`,
    },
  };
}

// Loading component for better UX
function LandingPageSkeleton() {
  return (
    <div className="landing-page-layout animate-pulse">
      {/* Hero section skeleton */}
      <div className="h-96 bg-gray-200 dark:bg-gray-700 mb-8"></div>

      {/* Content sections skeleton */}
      <div className="space-y-8 px-4 max-w-7xl mx-auto">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { slug } = await params;

  // Parallelize data fetching where possible
  const landingPagePromise = getLandingPageData(slug);

  const landingPage = await landingPagePromise;

  if (!landingPage || (landingPage as any).status !== "published") {
    notFound();
  }

  return (
    <div className="landing-page-layout">
      <Suspense fallback={<div className="hidden" />}>
        <AnalyticsTracker landingPageId={(landingPage as any).id.toString()} />
      </Suspense>

      <Suspense fallback={<LandingPageSkeleton />}>
        <OptimizedLandingPageBuilder
          components={(landingPage as any).content || []}
          previewMode="desktop"
          editable={false}
        />
      </Suspense>
    </div>
  );
}

// Pre-generate static paths for known landing pages (optional)
export async function generateStaticParams() {
  try {
    // Only generate for published pages
    // For now, return empty array for generateStaticParams to avoid slow build times
    // This allows dynamic rendering which is faster for landing pages
    return [];
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
