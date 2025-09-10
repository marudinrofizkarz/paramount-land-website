"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconArrowLeft,
  IconEdit,
  IconGlobe,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconDeviceTablet,
  IconShare,
  IconSettings,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LandingPageBuilder } from "@/components/landing-page/landing-page-builder";
import { CacheUtils, RealTimeSync } from "@/lib/cache-utils";

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

interface PreviewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PreviewLandingPagePage({ params }: PreviewPageProps) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  useEffect(() => {
    fetchLandingPage();

    // Start auto-sync for real-time updates
    RealTimeSync.startAutoSync(
      resolvedParams.slug,
      (newPage) => {
        setLandingPage(newPage);
        setLastUpdated(newPage.updated_at);

        // Show notification that content was updated
        toast.success("Preview updated with latest changes!", {
          duration: 2000,
          description: "Content changes detected from edit page",
        });
      },
      (error) => {
        console.warn("Auto-sync error:", error);
      },
      2000 // Check every 2 seconds
    );

    // Cleanup auto-sync on unmount
    return () => {
      RealTimeSync.stopAutoSync(resolvedParams.slug);
    };
  }, [resolvedParams.slug]);

  const fetchLandingPage = async () => {
    try {
      const data = await CacheUtils.fetchLandingPageBySlug(resolvedParams.slug);
      setLandingPage(data.data);
      setLastUpdated(data.data.updated_at); // Track when content was last updated
    } catch (error) {
      console.error("Error fetching landing page:", error);
      toast.error("Failed to load landing page");
      router.push("/dashboard/landing-pages");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!landingPage) return;

    setPublishing(true);
    try {
      const response = await fetch(
        `/api/landing-pages/${landingPage.id}/publish`,
        {
          method: "POST",
        }
      );

      if (!response.ok) throw new Error("Failed to publish landing page");

      toast.success("Landing page published successfully!");
      fetchLandingPage(); // Refresh data
    } catch (error) {
      console.error("Error publishing landing page:", error);
      toast.error("Failed to publish landing page");
    } finally {
      setPublishing(false);
    }
  };

  const handleShare = async () => {
    if (!landingPage) return;

    const url =
      landingPage.status === "published"
        ? `${window.location.origin}/lp/${landingPage.slug}`
        : `${window.location.origin}/dashboard/landing-pages/${landingPage.slug}/preview`;

    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Published
          </Badge>
        );
      case "draft":
        return (
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
          >
            Draft
          </Badge>
        );
      case "archived":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          >
            Archived
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
          >
            {status}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!landingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Landing Page Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The landing page you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/dashboard/landing-pages">Back to Landing Pages</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-accent"
            >
              <Link href="/dashboard/landing-pages">
                <IconArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-foreground">
                  {landingPage.title}
                </h1>
                {getStatusBadge(landingPage.status)}
                {/* Real-time sync indicator */}
                <Badge
                  variant="outline"
                  className="text-xs bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Live Sync
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Preview your landing page before publishing • Auto-syncing with
                edit changes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Preview Mode Toggle */}
            <div className="flex items-center border border-border rounded-lg p-1 bg-card">
              <Button
                variant={previewMode === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode("desktop")}
                className="hover:bg-accent"
              >
                <IconDeviceDesktop className="h-4 w-4" />
              </Button>
              <Button
                variant={previewMode === "tablet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode("tablet")}
                className="hover:bg-accent"
              >
                <IconDeviceTablet className="h-4 w-4" />
              </Button>
              <Button
                variant={previewMode === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode("mobile")}
                className="hover:bg-accent"
              >
                <IconDeviceMobile className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={handleShare}
              className="border-border hover:bg-accent"
            >
              <IconShare className="mr-2 h-4 w-4" />
              Share
            </Button>

            <Button
              variant="outline"
              asChild
              className="border-border hover:bg-accent"
            >
              <Link href={`/dashboard/landing-pages/${landingPage.slug}/edit`}>
                <IconEdit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>

            {landingPage.status === "draft" && (
              <Button onClick={handlePublish} disabled={publishing}>
                <IconGlobe className="mr-2 h-4 w-4" />
                {publishing ? "Publishing..." : "Publish"}
              </Button>
            )}

            {landingPage.status === "published" && (
              <Button
                variant="outline"
                asChild
                className="border-border hover:bg-accent"
              >
                <Link href={`/lp/${landingPage.slug}`} target="_blank">
                  <IconGlobe className="mr-2 h-4 w-4" />
                  View Live
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-muted/30 overflow-hidden">
        <div className="h-[calc(100vh-73px)] overflow-auto">
          <div className="p-4">
            <div
              className="mx-auto bg-card shadow-lg border border-border"
              style={{
                width: getPreviewWidth(),
                minHeight: "600px",
                transition: "width 0.3s ease",
              }}
            >
              {/* Meta Tags Preview (only visible in preview) */}
              {(landingPage.meta_title || landingPage.meta_description) && (
                <div className="border-b border-border bg-blue-50 dark:bg-blue-950 p-4 text-sm">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    SEO Preview
                  </h3>
                  {landingPage.meta_title && (
                    <div className="text-blue-800 dark:text-blue-200">
                      <strong>Title:</strong> {landingPage.meta_title}
                    </div>
                  )}
                  {landingPage.meta_description && (
                    <div className="text-blue-700 dark:text-blue-300 mt-1">
                      <strong>Description:</strong>{" "}
                      {landingPage.meta_description}
                    </div>
                  )}
                </div>
              )}

              {/* Landing Page Content */}
              <LandingPageBuilder
                components={landingPage.content}
                previewMode={previewMode}
                editable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
