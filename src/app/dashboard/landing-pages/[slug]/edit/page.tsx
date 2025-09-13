"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconEye,
  IconGlobe,
  IconPlus,
  IconGripVertical,
  IconTrash,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconDeviceTablet,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LandingPageBuilder } from "@/components/landing-page/landing-page-builder";
import { CacheUtils } from "@/lib/cache-utils";

interface LandingPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content: LandingPageComponent[];
  status: "draft" | "published" | "archived";
  template_type: string;
  campaign_source?: string;
  target_audience?: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  tracking_code?: string;
  settings?: any;
  expires_at?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

interface LandingPageComponent {
  id: string;
  type:
    | "hero"
    | "form"
    | "features"
    | "testimonial"
    | "cta"
    | "content"
    | "gallery"
    | "pricing"
    | "faq"
    | "statistics"
    | "video"
    | "timeline"
    | "location"
    | "custom-image"
    | "copyright"
    | "footer"
    | "facilities"
    | "unit-slider"
    | "progress-slider"
    | "bank-partnership"
    | "agent-contact"
    | "title-description"
    | "location-access"
    | "promo";
  config: any;
  order: number;
}

interface ComponentTemplate {
  id: string;
  name: string;
  type: string;
  config: any;
  preview_image?: string;
  is_system: boolean;
}

interface EditPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function EditLandingPagePage({ params }: EditPageProps) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  // Form data
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [templateType, setTemplateType] = useState("custom");
  const [targetAudience, setTargetAudience] = useState("");
  const [campaignSource, setCampaignSource] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  // Components
  const [components, setComponents] = useState<LandingPageComponent[]>([]);
  const [componentTemplates, setComponentTemplates] = useState<
    ComponentTemplate[]
  >([]);
  const [activeTab, setActiveTab] = useState("builder");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchLandingPage();
    fetchComponentTemplates();
  }, [resolvedParams.slug]);

  const fetchLandingPage = async () => {
    try {
      const data = await CacheUtils.fetchLandingPageBySlug(resolvedParams.slug);
      const page = data.data;
      setLandingPage(page);

      // Populate form fields
      setTitle(page.title);
      setSlug(page.slug);
      setDescription(page.description || "");
      setMetaTitle(page.meta_title || "");
      setMetaDescription(page.meta_description || "");
      setOgImage(page.og_image || "");
      setTemplateType(page.template_type || "custom");
      setTargetAudience(page.target_audience || "");
      setCampaignSource(page.campaign_source || "");
      setTrackingCode(page.tracking_code || "");
      setExpiresAt(page.expires_at || "");
      setComponents(page.content || []);
    } catch (error) {
      console.error("Error fetching landing page:", error);
      toast.error("Failed to load landing page");
      router.push("/dashboard/landing-pages");
    } finally {
      setLoading(false);
    }
  };

  const fetchComponentTemplates = async () => {
    try {
      const data = await CacheUtils.fetchComponentTemplates();
      setComponentTemplates(data.data || []);
    } catch (error) {
      console.error("Error fetching component templates:", error);
      toast.error("Failed to load component templates");
    }
  };

  const addComponent = (template: ComponentTemplate) => {
    const newComponent: LandingPageComponent = {
      id: `${template.type}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      type: template.type as LandingPageComponent["type"],
      config: JSON.parse(JSON.stringify(template.config)), // Deep clone template config
      order: components.length,
    };
    console.log(`[EditPage] Adding component:`, newComponent);
    setComponents([...components, newComponent]);
    toast.success(`${template.name} added to page`);
  };

  const updateComponent = (id: string, config: any) => {
    console.log(`[EditPage] Updating component ${id} with config:`, config);

    // Deep clone the config to prevent reference issues
    const clonedConfig = JSON.parse(JSON.stringify(config));

    setComponents((prevComponents) =>
      prevComponents.map((comp) =>
        comp.id === id ? { ...comp, config: clonedConfig } : comp
      )
    );
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter((comp) => comp.id !== id));
    toast.success("Component removed");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({ ...item, order: index }));
      });
    }
  };

  const cleanComponentData = (component: LandingPageComponent): LandingPageComponent => {
    // Deep clone the component
    const cleaned = JSON.parse(JSON.stringify(component));
    
    // For custom-image components, validate image URLs
    if (component.type === "custom-image" && component.config) {
      const config = component.config;
      
      // Remove data URLs that are too large (over 1MB)
      if (config.desktopImage && config.desktopImage.startsWith("data:")) {
        const sizeInBytes = (config.desktopImage.length * 3) / 4; // Approximate size
        if (sizeInBytes > 1024 * 1024) { // 1MB limit
          console.warn("Desktop image data URL too large, removing...");
          cleaned.config.desktopImage = "";
        }
      }
      
      if (config.mobileImage && config.mobileImage.startsWith("data:")) {
        const sizeInBytes = (config.mobileImage.length * 3) / 4;
        if (sizeInBytes > 1024 * 1024) { // 1MB limit
          console.warn("Mobile image data URL too large, removing...");
          cleaned.config.mobileImage = "";
        }
      }
      
      // Remove any File objects or other non-serializable data
      Object.keys(cleaned.config).forEach(key => {
        const value = cleaned.config[key];
        if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'File') {
          console.warn(`Removing File object from config.${key}`);
          delete cleaned.config[key];
        }
      });
    }
    
    return cleaned;
  };

  const handleSave = async (status?: "draft" | "published") => {
    if (!title || !slug) {
      await Swal.fire({
        title: "Input Tidak Lengkap",
        text: "Mohon isi Judul dan URL Slug sebelum menyimpan landing page.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (!landingPage) return;

    setSaving(true);
    try {
      // Clean component data before saving
      const cleanedComponents = components.map(cleanComponentData);
      
      const updateData: any = {
        title,
        slug,
        description,
        content: cleanedComponents,
        meta_title: metaTitle,
        meta_description: metaDescription,
        og_image: ogImage,
        template_type: templateType,
        target_audience: targetAudience,
        campaign_source: campaignSource,
        tracking_code: trackingCode,
        expires_at: expiresAt || undefined,
        settings: {
          theme: "default",
          colors: {
            primary: "#007bff",
            secondary: "#6c757d",
            accent: "#28a745",
          },
        },
      };

      if (status) {
        updateData.status = status;
      }

      // Validate data can be serialized
      try {
        JSON.stringify(updateData);
      } catch (serializationError) {
        console.error("Data serialization error:", serializationError);
        await Swal.fire({
          title: "Data Error",
          text: "Some uploaded files or data cannot be saved. Please ensure all images are properly uploaded to Cloudinary before publishing.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      const response = await CacheUtils.updateLandingPage(
        landingPage.id,
        updateData
      );

      if (!response.success) {
        const error = response;

        // Handle specific error for duplicate slug
        if (error.error?.includes("slug already exists")) {
          await Swal.fire({
            title: "URL Slug Sudah Digunakan!",
            html: `
              <div class="text-left">
                <p class="mb-3">URL slug <strong>"${slug}"</strong> sudah digunakan oleh landing page lain.</p>
                <p class="mb-2"><strong>Saran:</strong></p>
                <ul class="list-disc list-inside text-sm space-y-1">
                  <li><code>${slug}-updated</code></li>
                  <li><code>${slug}-${new Date().getFullYear()}</code></li>
                  <li><code>${slug}-v2</code></li>
                  <li><code>${slug}-${templateType}</code></li>
                </ul>
                <p class="mt-3 text-xs text-gray-600">Silakan gunakan slug yang berbeda dan coba lagi.</p>
              </div>
            `,
            icon: "error",
            confirmButtonText: "Ubah Slug",
            confirmButtonColor: "#3085d6",
            showCancelButton: true,
            cancelButtonText: "Batal",
            cancelButtonColor: "#6c757d",
            width: 500,
          }).then((result) => {
            if (result.isConfirmed) {
              // Focus on slug input to help user change it
              const slugInput = document.getElementById("slug");
              if (slugInput) {
                slugInput.focus();
                (slugInput as HTMLInputElement).select();
              }
            }
          });
          return;
        }

        throw new Error(error.error || "Failed to update landing page");
      }

      // Success notification
      await Swal.fire({
        title: "Berhasil!",
        text: `Landing page berhasil ${
          status === "published" ? "dipublikasikan" : "disimpan"
        }.`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#28a745",
        timer: 3000,
        timerProgressBar: true,
      });

      if (status === "published") {
        router.push(`/dashboard/landing-pages/${slug}/preview`);
      } else {
        fetchLandingPage(); // Refresh data
      }
    } catch (error: any) {
      console.error("Error saving landing page:", error);

      // Generic error handling with SweetAlert
      await Swal.fire({
        title: "Terjadi Kesalahan",
        text:
          error.message || "Gagal menyimpan landing page. Silakan coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setSaving(false);
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
                  Edit: {landingPage.title}
                </h1>
                {getStatusBadge(landingPage.status)}
              </div>
              <p className="text-sm text-muted-foreground">
                Modify your landing page content and settings
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
              asChild
              className="border-border hover:bg-accent"
            >
              <Link
                href={`/dashboard/landing-pages/${landingPage.slug}/preview`}
              >
                <IconEye className="mr-2 h-4 w-4" />
                Preview
              </Link>
            </Button>

            <Button
              onClick={() => handleSave()}
              disabled={saving}
              variant="outline"
              className="border-border hover:bg-accent"
            >
              <IconDeviceFloppy className="mr-2 h-4 w-4" />
              Save Draft
            </Button>

            <Button onClick={() => handleSave("published")} disabled={saving}>
              <IconGlobe className="mr-2 h-4 w-4" />
              {landingPage.status === "published"
                ? "Update & Publish"
                : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Settings & Components */}
        <div className="w-80 bg-card border-r border-border overflow-y-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-background"
              >
                Settings
              </TabsTrigger>
              <TabsTrigger
                value="components"
                className="data-[state=active]:bg-background"
              >
                Components
              </TabsTrigger>
              <TabsTrigger
                value="builder"
                className="data-[state=active]:bg-background"
              >
                Builder
              </TabsTrigger>
            </TabsList>

            {/* Settings Tab */}
            <TabsContent value="settings" className="p-4 space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-foreground">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Landing page title"
                    className="bg-background border-border"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Secara otomatis akan ditambahkan suffix "| Paramount Land -
                    Building Homes and People with Heart" (kecuali sudah
                    mengandung "Paramount Land")
                  </p>
                </div>

                <div>
                  <Label htmlFor="slug" className="text-foreground">
                    URL Slug *
                  </Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-slug"
                    className="bg-background border-border"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Will be accessible at: /lp/{slug}
                  </p>
                </div>

                <div>
                  <Label htmlFor="description" className="text-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the landing page"
                    rows={3}
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="template-type" className="text-foreground">
                    Template Type
                  </Label>
                  <Select value={templateType} onValueChange={setTemplateType}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="custom">Custom</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="property">Property</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="campaign-source" className="text-foreground">
                    Campaign Source
                  </Label>
                  <Select
                    value={campaignSource}
                    onValueChange={setCampaignSource}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="google-ads">Google Ads</SelectItem>
                      <SelectItem value="facebook-ads">Facebook Ads</SelectItem>
                      <SelectItem value="tiktok-ads">TikTok Ads</SelectItem>
                      <SelectItem value="instagram-ads">
                        Instagram Ads
                      </SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="target-audience" className="text-foreground">
                    Target Audience
                  </Label>
                  <Input
                    id="target-audience"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., First-time buyers, Investors"
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="meta-title" className="text-foreground">
                    Meta Title
                  </Label>
                  <Input
                    id="meta-title"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="SEO title (optional - akan menggunakan Title jika kosong)"
                    className="bg-background border-border"
                  />
                  {(metaTitle || title) && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                      <span className="font-medium text-blue-900 dark:text-blue-100">
                        Preview Title:{" "}
                      </span>
                      <span className="text-blue-700 dark:text-blue-300">
                        {(() => {
                          const displayTitle = metaTitle || title;
                          return displayTitle.includes("Paramount Land")
                            ? displayTitle
                            : `${displayTitle} | Paramount Land - Building Homes and People with Heart`;
                        })()}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="meta-description" className="text-foreground">
                    Meta Description
                  </Label>
                  <Textarea
                    id="meta-description"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="SEO description"
                    rows={3}
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="tracking-code" className="text-foreground">
                    Tracking Code
                  </Label>
                  <Textarea
                    id="tracking-code"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="Google Analytics, Facebook Pixel, etc."
                    rows={3}
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="expires-at" className="text-foreground">
                    Expires At
                  </Label>
                  <Input
                    id="expires-at"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Components Tab */}
            <TabsContent value="components" className="p-4">
              <div className="space-y-3">
                <h3 className="font-medium text-foreground">
                  Component Library
                </h3>
                {componentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-background border border-border rounded-lg p-3 cursor-pointer hover:shadow-md hover:bg-accent transition-all"
                    onClick={() => addComponent(template)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm text-foreground">
                          {template.name}
                        </h4>
                        <p className="text-xs text-muted-foreground capitalize">
                          {template.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {template.is_system && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-muted text-muted-foreground"
                          >
                            System
                          </Badge>
                        )}
                        <IconPlus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Builder Tab */}
            <TabsContent value="builder" className="p-4">
              <div className="space-y-3">
                <h3 className="font-medium text-foreground">Page Components</h3>
                {components.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No components added yet. Switch to Components tab to add
                    some.
                  </p>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={components.map((c) => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {components.map((component) => (
                        <SortableComponentItem
                          key={component.id}
                          component={component}
                          onRemove={removeComponent}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content - Preview */}
        <div className="flex-1 bg-muted/30 overflow-hidden">
          <div className="h-full overflow-auto">
            <div className="p-4">
              <div
                className="mx-auto bg-card shadow-lg border border-border"
                style={{
                  width: getPreviewWidth(),
                  minHeight: "600px",
                  transition: "width 0.3s ease",
                }}
              >
                <LandingPageBuilder
                  components={components}
                  onUpdateComponentAction={updateComponent}
                  previewMode={previewMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sortable Component Item for Builder Tab
function SortableComponentItem({
  component,
  onRemove,
}: {
  component: LandingPageComponent;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-background border border-border rounded-lg p-3 flex items-center justify-between hover:bg-accent transition-colors"
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:text-foreground"
        >
          <IconGripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <h4 className="font-medium text-sm capitalize text-foreground">
            {component.type}
          </h4>
          <p className="text-xs text-muted-foreground">
            {component.config?.title || "Untitled"}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(component.id)}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <IconTrash className="h-4 w-4" />
      </Button>
    </div>
  );
}
