"use client";

import React, { useState, useRef, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { IconSettings, IconUpload, IconX } from "@tabler/icons-react";
import { toast } from "sonner";

interface CustomImageComponentProps {
  id: string;
  config: {
    title?: string;
    description?: string;
    desktopImage?: string;
    mobileImage?: string;
    altText?: string;
    clickAction?: "none" | "link" | "popup";
    linkUrl?: string;
    height?: "auto" | "small" | "medium" | "large" | "full";
    objectFit?: "cover" | "contain" | "fill";
    showOverlay?: boolean;
    overlayText?: string;
    textPosition?: "top" | "center" | "bottom" | "overlay";
    textAlign?: "left" | "center" | "right";
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function CustomImageComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: CustomImageComponentProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Migrate old 'image' property to 'desktopImage' for backward compatibility
  const migratedConfig = React.useMemo(() => {
    const migrated = { ...config };
    if ((migrated as any).image && !migrated.desktopImage) {
      migrated.desktopImage = (migrated as any).image;
    }
    return migrated;
  }, [config]);

  const [editConfig, setEditConfig] = useState(migratedConfig);
  const [uploading, setUploading] = useState(false);
  const desktopFileRef = useRef<HTMLInputElement>(null);
  const mobileFileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    // Clean the config before saving
    const cleanedConfig = { ...editConfig };

    // Remove any data URLs before saving
    if (
      cleanedConfig.desktopImage &&
      cleanedConfig.desktopImage.startsWith("data:")
    ) {
      toast.error(
        "Desktop image contains temporary data. Please upload the image properly."
      );
      return;
    }

    if (
      cleanedConfig.mobileImage &&
      cleanedConfig.mobileImage.startsWith("data:")
    ) {
      toast.error(
        "Mobile image contains temporary data. Please upload the image properly."
      );
      return;
    }

    // Validate serialization
    try {
      JSON.stringify(cleanedConfig);
    } catch (error) {
      console.error("Config serialization error:", error);
      toast.error("Configuration contains invalid data. Please try again.");
      return;
    }

    onUpdate?.(cleanedConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    const migrated = { ...config };
    if ((migrated as any).image && !migrated.desktopImage) {
      migrated.desktopImage = (migrated as any).image;
    }
    setEditConfig(migrated);
    setIsEditing(false);
  };

  // Sync editConfig when config changes
  useEffect(() => {
    const migrated = { ...config };
    if ((migrated as any).image && !migrated.desktopImage) {
      migrated.desktopImage = (migrated as any).image;
    }
    setEditConfig(migrated);
  }, [config]);

  const handleImageUpload = async (file: File, type: "desktop" | "mobile") => {
    if (!file) return;

    // Validate file size before upload (4MB limit)
    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      toast.error("Ukuran file maksimal 4MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipe file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEditConfig({
          ...editConfig,
          [type === "desktop" ? "desktopImage" : "mobileImage"]: data.url,
        });
        toast.success("Gambar berhasil diupload!");
        return;
      }

      // Handle API errors with proper error messages
      if (data.message) {
        toast.error(data.message);
      } else if (response.status === 413) {
        toast.error("Ukuran file terlalu besar. Maksimal 4MB");
      } else if (response.status === 408) {
        toast.error("Upload timeout. Coba dengan file yang lebih kecil");
      } else {
        toast.error("Gagal mengupload gambar. Silakan coba lagi");
      }

      // If primary upload fails, try direct Cloudinary as fallback
      const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (cloudinaryCloudName) {
        try {
          const cloudinaryFormData = new FormData();
          cloudinaryFormData.append("file", file);
          cloudinaryFormData.append("upload_preset", "ml_default");

          const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
            {
              method: "POST",
              body: cloudinaryFormData,
            }
          );

          if (cloudinaryResponse.ok) {
            const cloudinaryData = await cloudinaryResponse.json();
            setEditConfig({
              ...editConfig,
              [type === "desktop" ? "desktopImage" : "mobileImage"]:
                cloudinaryData.secure_url,
            });
            toast.success("Gambar berhasil diupload via Cloudinary!");
            return;
          }
        } catch (cloudinaryError) {
          console.error("Cloudinary upload failed:", cloudinaryError);
        }
      }

      // Show error message instead of using data URL
      toast.error(
        "Gagal mengupload gambar ke server. Silakan coba dengan file yang lebih kecil atau format yang berbeda."
      );

      // Don't use data URLs as they cause serialization issues when saving
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Terjadi kesalahan saat mengupload gambar");
    } finally {
      setUploading(false);
    }
  };

  const getHeightClass = () => {
    switch (config.height) {
      case "small":
        return "h-48 md:h-64"; // 192px mobile, 256px desktop
      case "medium":
        return "h-64 md:h-96"; // 256px mobile, 384px desktop
      case "large":
        return "h-96 md:h-[32rem]"; // 384px mobile, 512px desktop
      case "full":
        return "h-screen";
      default:
        return "h-auto min-h-[300px] md:min-h-[400px]"; // Auto with minimum height
    }
  };

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice = window.matchMedia("(max-width: 768px)").matches;
      setIsMobile(isMobileDevice);
    };

    checkDevice();

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  const getCurrentImage = () => {
    // Use migrated config that has desktopImage from old 'image' property
    const workingConfig = { ...migratedConfig };

    // In editor mode, use previewMode prop for preview
    if (editable) {
      if (previewMode === "mobile" && workingConfig.mobileImage) {
        return workingConfig.mobileImage;
      }
      // Support both old 'image' property and new 'desktopImage' property for backward compatibility
      return (
        workingConfig.desktopImage ||
        (workingConfig as any).image ||
        "/placeholder.svg"
      );
    }

    // In public view, use actual device detection
    if (isMobile && workingConfig.mobileImage) {
      return workingConfig.mobileImage;
    }
    // Support both old 'image' property and new 'desktopImage' property for backward compatibility
    return (
      workingConfig.desktopImage ||
      (workingConfig as any).image ||
      "/placeholder.svg"
    );
  };

  const handleImageClick = () => {
    if (migratedConfig.clickAction === "link" && migratedConfig.linkUrl) {
      window.open(migratedConfig.linkUrl, "_blank");
    }
  };

  return (
    <div className="relative group">
      {/* Edit Button */}
      {editable && onUpdate && (
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <IconSettings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Custom Image</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Basic Info */}
                <div>
                  <Label htmlFor="title">Title (Optional)</Label>
                  <Input
                    id="title"
                    value={editConfig.title || ""}
                    onChange={(e) =>
                      setEditConfig({ ...editConfig, title: e.target.value })
                    }
                    placeholder="Image title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={editConfig.description || ""}
                    onChange={(e) =>
                      setEditConfig({
                        ...editConfig,
                        description: e.target.value,
                      })
                    }
                    placeholder="Image description"
                    rows={2}
                  />
                </div>

                {/* Desktop Image Upload */}
                <div>
                  <Label>Desktop/Tablet Image</Label>
                  <div className="space-y-2">
                    <input
                      ref={desktopFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, "desktop");
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => desktopFileRef.current?.click()}
                      disabled={uploading}
                      className="w-full"
                    >
                      <IconUpload className="mr-2 h-4 w-4" />
                      {uploading ? "Uploading..." : "Upload Desktop Image"}
                    </Button>
                    {editConfig.desktopImage && (
                      <div className="relative">
                        <img
                          src={editConfig.desktopImage}
                          alt="Desktop preview"
                          className="w-full h-20 object-cover rounded border"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1"
                          onClick={() =>
                            setEditConfig({ ...editConfig, desktopImage: "" })
                          }
                        >
                          <IconX className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Image Upload */}
                <div>
                  <Label>Mobile Image</Label>
                  <div className="space-y-2">
                    <input
                      ref={mobileFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, "mobile");
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => mobileFileRef.current?.click()}
                      disabled={uploading}
                      className="w-full"
                    >
                      <IconUpload className="mr-2 h-4 w-4" />
                      {uploading ? "Uploading..." : "Upload Mobile Image"}
                    </Button>
                    {editConfig.mobileImage && (
                      <div className="relative">
                        <img
                          src={editConfig.mobileImage}
                          alt="Mobile preview"
                          className="w-full h-20 object-cover rounded border"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1"
                          onClick={() =>
                            setEditConfig({ ...editConfig, mobileImage: "" })
                          }
                        >
                          <IconX className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Alt Text */}
                <div>
                  <Label htmlFor="alt-text">Alt Text</Label>
                  <Input
                    id="alt-text"
                    value={editConfig.altText || ""}
                    onChange={(e) =>
                      setEditConfig({ ...editConfig, altText: e.target.value })
                    }
                    placeholder="Describe the image for accessibility"
                  />
                </div>

                {/* Height Setting */}
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Select
                    value={editConfig.height || "medium"}
                    onValueChange={(value) =>
                      setEditConfig({
                        ...editConfig,
                        height: value as
                          | "auto"
                          | "small"
                          | "medium"
                          | "large"
                          | "full",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">
                        Auto (Natural Height)
                      </SelectItem>
                      <SelectItem value="small">
                        Small (192px mobile, 256px desktop)
                      </SelectItem>
                      <SelectItem value="medium">
                        Medium (256px mobile, 384px desktop)
                      </SelectItem>
                      <SelectItem value="large">
                        Large (384px mobile, 512px desktop)
                      </SelectItem>
                      <SelectItem value="full">Full Screen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Text Position */}
                <div>
                  <Label htmlFor="text-position">Text Position</Label>
                  <Select
                    value={editConfig.textPosition || "overlay"}
                    onValueChange={(value) =>
                      setEditConfig({
                        ...editConfig,
                        textPosition: value as
                          | "top"
                          | "center"
                          | "bottom"
                          | "overlay",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Above Image</SelectItem>
                      <SelectItem value="overlay">Overlay on Image</SelectItem>
                      <SelectItem value="center">Center on Image</SelectItem>
                      <SelectItem value="bottom">Bottom on Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Text Alignment */}
                <div>
                  <Label htmlFor="text-align">Text Alignment</Label>
                  <Select
                    value={editConfig.textAlign || "center"}
                    onValueChange={(value) =>
                      setEditConfig({
                        ...editConfig,
                        textAlign: value as "left" | "center" | "right",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Object Fit */}
                <div>
                  <Label htmlFor="object-fit">Object Fit</Label>
                  <Select
                    value={editConfig.objectFit || "cover"}
                    onValueChange={(value) =>
                      setEditConfig({
                        ...editConfig,
                        objectFit: value as "cover" | "contain" | "fill",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cover">Cover</SelectItem>
                      <SelectItem value="contain">Contain</SelectItem>
                      <SelectItem value="fill">Fill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Click Action */}
                <div>
                  <Label htmlFor="click-action">Click Action</Label>
                  <Select
                    value={editConfig.clickAction || "none"}
                    onValueChange={(value) =>
                      setEditConfig({
                        ...editConfig,
                        clickAction: value as "none" | "link" | "popup",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="link">Open Link</SelectItem>
                      <SelectItem value="popup">Open Popup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Show Overlay Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-overlay">Show Custom Overlay</Label>
                  <Switch
                    id="show-overlay"
                    checked={editConfig.showOverlay || false}
                    onCheckedChange={(checked) =>
                      setEditConfig({
                        ...editConfig,
                        showOverlay: checked,
                      })
                    }
                  />
                </div>

                {/* Overlay Text (if overlay is enabled) */}
                {editConfig.showOverlay && (
                  <div>
                    <Label htmlFor="overlay-text">Overlay Text</Label>
                    <Input
                      id="overlay-text"
                      value={editConfig.overlayText || ""}
                      onChange={(e) =>
                        setEditConfig({
                          ...editConfig,
                          overlayText: e.target.value,
                        })
                      }
                      placeholder="Text to display over the image"
                    />
                  </div>
                )}

                {/* Link URL (if click action is link) */}
                {editConfig.clickAction === "link" && (
                  <div>
                    <Label htmlFor="link-url">Link URL</Label>
                    <Input
                      id="link-url"
                      value={editConfig.linkUrl || ""}
                      onChange={(e) =>
                        setEditConfig({
                          ...editConfig,
                          linkUrl: e.target.value,
                        })
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                )}

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

      {/* Image Content */}
      <div className="relative w-full">
        {/* Title and Description - Top Position */}
        {(migratedConfig.title || migratedConfig.description) &&
          migratedConfig.textPosition === "top" && (
            <div className="w-full bg-white dark:bg-gray-900 py-6 md:py-8">
              <div
                className={`max-w-6xl mx-auto px-4 text-${
                  migratedConfig.textAlign || "center"
                }`}
              >
                {migratedConfig.title && (
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {migratedConfig.title}
                  </h2>
                )}
                {migratedConfig.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    {migratedConfig.description}
                  </p>
                )}
              </div>
            </div>
          )}

        {/* Image Display */}
        {getCurrentImage() ? (
          <div className="relative w-full overflow-hidden">
            {migratedConfig.mobileImage &&
            (migratedConfig.desktopImage || (migratedConfig as any).image) &&
            !editable ? (
              <picture>
                <source
                  media="(max-width: 768px)"
                  srcSet={migratedConfig.mobileImage}
                />
                <img
                  src={
                    migratedConfig.desktopImage || (migratedConfig as any).image
                  }
                  alt={
                    migratedConfig.altText ||
                    migratedConfig.title ||
                    "Custom image"
                  }
                  className={`w-full ${getHeightClass()} object-${
                    migratedConfig.objectFit || "cover"
                  } ${
                    migratedConfig.clickAction === "link"
                      ? "cursor-pointer hover:scale-105 transition-transform duration-300"
                      : ""
                  }`}
                  onClick={handleImageClick}
                />
              </picture>
            ) : (
              <img
                src={getCurrentImage()}
                alt={
                  migratedConfig.altText ||
                  migratedConfig.title ||
                  "Custom image"
                }
                className={`w-full ${getHeightClass()} object-${
                  migratedConfig.objectFit || "cover"
                } ${
                  migratedConfig.clickAction === "link"
                    ? "cursor-pointer hover:scale-105 transition-transform duration-300"
                    : ""
                }`}
                onClick={handleImageClick}
              />
            )}

            {/* Title and Description - Overlay Position */}
            {(migratedConfig.title || migratedConfig.description) &&
              migratedConfig.textPosition === "overlay" && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70 flex items-center justify-center">
                  <div
                    className={`text-center px-4 text-${
                      migratedConfig.textAlign || "center"
                    }`}
                  >
                    {migratedConfig.title && (
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                        {migratedConfig.title}
                      </h2>
                    )}
                    {migratedConfig.description && (
                      <p className="text-white/90 text-sm md:text-base drop-shadow-lg">
                        {migratedConfig.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

            {/* Title and Description - Center Position */}
            {(migratedConfig.title || migratedConfig.description) &&
              migratedConfig.textPosition === "center" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div
                    className={`text-center px-4 text-${
                      migratedConfig.textAlign || "center"
                    }`}
                  >
                    {migratedConfig.title && (
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                        {migratedConfig.title}
                      </h2>
                    )}
                    {migratedConfig.description && (
                      <p className="text-white/90 text-sm md:text-base drop-shadow-lg">
                        {migratedConfig.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

            {/* Title and Description - Bottom Position */}
            {(migratedConfig.title || migratedConfig.description) &&
              migratedConfig.textPosition === "bottom" && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
                  <div
                    className={`py-6 md:py-8 px-4 text-${
                      migratedConfig.textAlign || "center"
                    }`}
                  >
                    {migratedConfig.title && (
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
                        {migratedConfig.title}
                      </h2>
                    )}
                    {migratedConfig.description && (
                      <p className="text-white/90 text-sm md:text-base">
                        {migratedConfig.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

            {/* Custom Overlay Text */}
            {migratedConfig.showOverlay && migratedConfig.overlayText && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold text-center px-4 drop-shadow-lg">
                  {migratedConfig.overlayText}
                </h3>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full min-h-[200px] md:min-h-[300px] lg:min-h-[400px] bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center">
            <IconUpload className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center px-4 text-sm md:text-base">
              No image uploaded yet
            </p>
            {editable && (
              <p className="text-xs md:text-sm text-gray-400 mt-2 text-center px-4">
                Click the settings button to upload images
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
