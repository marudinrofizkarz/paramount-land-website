"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconSettings, IconExternalLink } from "@tabler/icons-react";

interface HeroComponentProps {
  id: string;
  config: {
    title: string;
    subtitle: string;
    backgroundImage?: string;
    backgroundColor?: string;
    ctaText: string;
    ctaAction: string;
    ctaUrl?: string;
    overlay?: boolean;
    textAlign: "left" | "center" | "right";
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function HeroComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: HeroComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState(config);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSave = () => {
    onUpdate?.(editConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditConfig(config);
    setIsEditing(false);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      setEditConfig({
        ...editConfig,
        backgroundImage: data.url,
      });
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeBackgroundImage = () => {
    setEditConfig({
      ...editConfig,
      backgroundImage: undefined,
    });
  };

  const getResponsiveClasses = () => {
    switch (previewMode) {
      case "mobile":
        return "px-4 py-12 text-sm";
      case "tablet":
        return "px-6 py-16 text-base";
      default:
        return "px-8 py-20 text-lg";
    }
  };

  return (
    <div className="relative group">
      {/* Edit Button (shown on hover when editable) */}
      {editable && onUpdate && (
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <IconSettings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Hero Section</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editConfig.title}
                    onChange={(e) =>
                      setEditConfig({ ...editConfig, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Textarea
                    id="subtitle"
                    value={editConfig.subtitle}
                    onChange={(e) =>
                      setEditConfig({ ...editConfig, subtitle: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                {/* Background Image Upload */}
                <div className="space-y-3">
                  <Label>Background</Label>

                  {/* Image Upload Section */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Background Image
                    </Label>
                    {editConfig.backgroundImage ? (
                      <div className="space-y-2">
                        <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                          <img
                            src={editConfig.backgroundImage}
                            alt="Background preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeBackgroundImage}
                          >
                            Remove Image
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="bg-image-upload"
                            disabled={uploading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document
                                .getElementById("bg-image-upload")
                                ?.click()
                            }
                            disabled={uploading}
                          >
                            {uploading ? "Uploading..." : "Change Image"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="bg-image-upload"
                          disabled={uploading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("bg-image-upload")?.click()
                          }
                          disabled={uploading}
                          className="w-full"
                        >
                          {uploading
                            ? "Uploading..."
                            : "Upload Background Image"}
                        </Button>
                      </div>
                    )}

                    {uploadError && (
                      <p className="text-sm text-red-500">{uploadError}</p>
                    )}
                  </div>

                  {/* Background Color Section (only shown if no image) */}
                  {!editConfig.backgroundImage && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Background Color
                      </Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={editConfig.backgroundColor || "#ffffff"}
                          onChange={(e) =>
                            setEditConfig({
                              ...editConfig,
                              backgroundColor: e.target.value,
                            })
                          }
                          className="w-12 h-9 border border-gray-300 rounded cursor-pointer"
                        />
                        <Input
                          value={editConfig.backgroundColor || "#ffffff"}
                          onChange={(e) =>
                            setEditConfig({
                              ...editConfig,
                              backgroundColor: e.target.value,
                            })
                          }
                          placeholder="#ffffff"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="cta-text">Button Text</Label>
                  <Input
                    id="cta-text"
                    value={editConfig.ctaText}
                    onChange={(e) =>
                      setEditConfig({ ...editConfig, ctaText: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="cta-url">Button URL (optional)</Label>
                  <Input
                    id="cta-url"
                    value={editConfig.ctaUrl || ""}
                    onChange={(e) =>
                      setEditConfig({ ...editConfig, ctaUrl: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>Save</Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Hero Content */}
      <div
        className={`relative min-h-[400px] flex items-center justify-center ${getResponsiveClasses()}`}
        style={{
          ...(config.backgroundImage
            ? {
                backgroundImage: `url(${config.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                backgroundColor: config.backgroundColor || "#667eea",
                background:
                  config.backgroundColor ||
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }),
        }}
      >
        {/* Overlay */}
        {config.overlay && (
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        )}

        {/* Content */}
        <div
          className={`relative z-10 max-w-4xl mx-auto text-white text-${config.textAlign}`}
        >
          <h1
            className={`font-bold mb-4 ${
              previewMode === "mobile"
                ? "text-2xl"
                : previewMode === "tablet"
                ? "text-3xl"
                : "text-5xl"
            }`}
          >
            {config.title}
          </h1>
          <p
            className={`mb-8 opacity-90 ${
              previewMode === "mobile"
                ? "text-base"
                : previewMode === "tablet"
                ? "text-lg"
                : "text-xl"
            }`}
          >
            {config.subtitle}
          </p>
          <Button
            size={previewMode === "mobile" ? "default" : "lg"}
            className="bg-white text-gray-900 hover:bg-gray-100"
            onClick={() => {
              if (config.ctaAction === "external" && config.ctaUrl) {
                window.open(config.ctaUrl, "_blank");
              } else if (config.ctaAction === "scroll-to-form") {
                // Scroll to form section
                const formElement = document.querySelector(
                  '[data-component-type="form"]'
                );
                formElement?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            {config.ctaText}
            {config.ctaAction === "external" && (
              <IconExternalLink className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
