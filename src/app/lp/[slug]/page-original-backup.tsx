import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LandingPageBuilder } from "@/components/landing-page/landing-page-builder";
import { LandingPageActions } from "@/lib/landing-page-actions";
import { AnalyticsTracker } from "@/components/analytics-tracker";

// Force dynamic rendering to prevent stale cache on public pages
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

async function getLandingPageData(slug: string) {
  try {
    const result = await LandingPageActions.getBySlug(slug);
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
