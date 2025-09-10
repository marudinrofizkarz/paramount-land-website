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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileUploader } from "@/components/file-uploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconChevronLeft,
  IconChevronRight,
  IconX,
  IconMaximize,
  IconEdit,
  IconPlus,
  IconTrash,
  IconGripVertical,
  IconUpload,
  IconLink,
} from "@tabler/icons-react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

interface GalleryConfig {
  title?: string;
  subtitle?: string;
  layout: "grid" | "slider" | "masonry";
  columns: 2 | 3 | 4 | 5;
  spacing: "small" | "medium" | "large";
  showCaptions: boolean;
  autoplay?: boolean;
  autoplaySpeed?: number;
  images: GalleryImage[];
  className?: string;
}

interface GalleryComponentProps {
  id: string;
  config: GalleryConfig;
  onUpdate?: (config: GalleryConfig) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function GalleryComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: GalleryComponentProps) {
  // Normalize config to ensure all properties are defined
  const normalizedConfig: GalleryConfig = {
    title: config.title || "",
    subtitle: config.subtitle || "",
    layout: config.layout || "grid",
    columns: config.columns || 3,
    spacing: config.spacing || "medium",
    showCaptions: config.showCaptions ?? true,
    autoplay: config.autoplay ?? false,
    autoplaySpeed: config.autoplaySpeed || 3000,
    images: config.images || [],
    className: config.className || "",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [editConfig, setEditConfig] = useState<GalleryConfig>(normalizedConfig);
  const [uploadMode, setUploadMode] = useState<"upload" | "url">("upload");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    console.log(`[Gallery ${id}] Config updated:`, config);
    setEditConfig(normalizedConfig);
  }, [config, id]);

  // Auto-responsive columns based on screen size
  const getResponsiveColumns = () => {
    if (previewMode === "mobile") return 1;
    if (previewMode === "tablet") return Math.min(normalizedConfig.columns, 2);
    return normalizedConfig.columns;
  };

  const handleSave = () => {
    // Ensure all images are properly saved with valid URLs
    const configToSave = {
      ...editConfig,
      images: editConfig.images.filter(
        (img) => img.url && img.url.trim() !== ""
      ),
    };
    onUpdate?.(configToSave);
    setIsEditing(false);
  };

  // Simulate file upload - in real app, you would upload to your server/cloud storage
  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would upload to your server and get back URLs
      // Convert files to data URLs for proper serialization
      const newImages: GalleryImage[] = [];

      // Process each file asynchronously with proper error handling
      const filePromises = files.map((file, index) => {
        return new Promise<GalleryImage>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            if (dataUrl) {
              resolve({
                id: `img-${Date.now()}-${index}`,
                url: dataUrl,
                alt: file.name.split(".")[0] || `Image ${index + 1}`,
                caption: "",
              });
            } else {
              reject(new Error(`Failed to read file: ${file.name}`));
            }
          };
          reader.onerror = (error) => {
            console.error("FileReader error:", error);
            reject(error);
          };
          reader.readAsDataURL(file);
        });
      });

      const processedImages = await Promise.all(filePromises);

      setEditConfig((prevConfig) => ({
        ...prevConfig,
        images: [...prevConfig.images, ...processedImages],
      }));

      setUploadedFiles([]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageAdd = () => {
    const newImage: GalleryImage = {
      id: `img-${Date.now()}`,
      url: "",
      alt: "",
      caption: "",
    };
    setEditConfig({
      ...editConfig,
      images: [...editConfig.images, newImage],
    });
  };

  const handleImageUpdate = (
    index: number,
    field: keyof GalleryImage,
    value: string
  ) => {
    const updatedImages = editConfig.images.map((img, i) =>
      i === index ? { ...img, [field]: value } : img
    );
    setEditConfig({ ...editConfig, images: updatedImages });
  };

  const handleImageRemove = (index: number) => {
    const updatedImages = editConfig.images.filter((_, i) => i !== index);
    setEditConfig({ ...editConfig, images: updatedImages });
  };

  const handleBulkUpload = () => {
    // Create multiple placeholder images for bulk upload demo
    const newImages: GalleryImage[] = Array.from({ length: 5 }, (_, i) => ({
      id: `img-bulk-${Date.now()}-${i}`,
      url: `https://picsum.photos/400/300?random=${Date.now() + i}`,
      alt: `Sample image ${editConfig.images.length + i + 1}`,
      caption: `Beautiful property image ${editConfig.images.length + i + 1}`,
    }));

    setEditConfig({
      ...editConfig,
      images: [...editConfig.images, ...newImages],
    });
  };

  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...editConfig.images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    setEditConfig({ ...editConfig, images: newImages });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === normalizedConfig.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? normalizedConfig.images.length - 1 : prev - 1
    );
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const getSpacingClass = () => {
    switch (normalizedConfig.spacing) {
      case "small":
        return "gap-2";
      case "large":
        return "gap-8";
      default:
        return "gap-4";
    }
  };

  const renderGridLayout = () => {
    const columns = getResponsiveColumns();
    const gridColsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
    };
    const gridCols = gridColsMap[columns] || "grid-cols-3";

    return (
      <div className={`grid ${gridCols} ${getSpacingClass()}`}>
        {normalizedConfig.images.map((image, index) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 aspect-square cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => openLightbox(index)}
          >
            {image.url ? (
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-sm">No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <IconMaximize className="h-5 w-5 text-white" />
            </div>
            {normalizedConfig.showCaptions && image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSliderLayout = () => {
    if (normalizedConfig.images.length === 0) {
      return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center">
          <span className="text-gray-400">No images to display</span>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {normalizedConfig.images.map((image, index) => (
              <div key={image.id} className="w-full flex-shrink-0 relative">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => openLightbox(index)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span>No Image</span>
                    </div>
                  )}
                  {normalizedConfig.showCaptions && image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white">{image.caption}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:border-gray-600 shadow-lg"
          onClick={prevImage}
        >
          <IconChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-200" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:border-gray-600 shadow-lg"
          onClick={nextImage}
        >
          <IconChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-200" />
        </Button>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {normalizedConfig.images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? "bg-primary" : "bg-gray-300"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>
    );
  };

  if (editable && isEditing) {
    return (
      <div className="border-2 border-dashed border-primary p-6 rounded-lg bg-blue-50/50 dark:bg-blue-950/50">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Edit Gallery</h3>
              <p className="text-sm text-gray-500">
                {editConfig.images.length} image(s) • {editConfig.layout} layout
                • {editConfig.columns} columns
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editConfig.title || ""}
                onChange={(e) =>
                  setEditConfig({ ...editConfig, title: e.target.value })
                }
                placeholder="Gallery title"
              />
            </div>

            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={editConfig.subtitle || ""}
                onChange={(e) =>
                  setEditConfig({ ...editConfig, subtitle: e.target.value })
                }
                placeholder="Gallery subtitle"
              />
            </div>

            <div>
              <Label htmlFor="layout">Layout</Label>
              <Select
                value={editConfig.layout}
                onValueChange={(value: "grid" | "slider" | "masonry") =>
                  setEditConfig({ ...editConfig, layout: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="slider">Slider</SelectItem>
                  <SelectItem value="masonry">Masonry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="columns">Columns</Label>
              <Select
                value={editConfig.columns.toString()}
                onValueChange={(value) =>
                  setEditConfig({
                    ...editConfig,
                    columns: parseInt(value) as 2 | 3 | 4 | 5,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                  <SelectItem value="5">5 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Images Management */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Images</Label>
              <div className="flex items-center gap-2">
                <Tabs
                  value={uploadMode}
                  onValueChange={(value) =>
                    setUploadMode(value as "upload" | "url")
                  }
                  className="w-auto"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="upload"
                      className="flex items-center gap-1"
                    >
                      <IconUpload className="h-3 w-3" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger
                      value="url"
                      className="flex items-center gap-1"
                    >
                      <IconLink className="h-3 w-3" />
                      URL
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Upload Mode */}
            {uploadMode === "upload" && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <FileUploader
                    value={uploadedFiles}
                    onValueChange={setUploadedFiles}
                    onUpload={handleFileUpload}
                    maxFiles={10}
                    maxSize={1024 * 1024 * 5} // 5MB
                    accept={{ "image/*": [] }}
                    multiple
                    disabled={isUploading}
                    className="border-0 bg-transparent"
                  />
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 flex justify-center">
                      <Button
                        onClick={() => handleFileUpload(uploadedFiles)}
                        disabled={isUploading}
                        className="w-full"
                      >
                        {isUploading
                          ? "Uploading..."
                          : `Upload ${uploadedFiles.length} Image(s)`}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={handleBulkUpload}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <IconUpload className="h-3 w-3" />
                    Demo: Add 5 Sample Images
                  </Button>
                  {editConfig.images.length > 0 && (
                    <Button
                      onClick={() =>
                        setEditConfig({ ...editConfig, images: [] })
                      }
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <IconTrash className="h-3 w-3" />
                      Clear All
                    </Button>
                  )}
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Drag & drop multiple images or click to browse. Max 5MB per
                  file.
                </p>
              </div>
            )}

            {/* URL Mode */}
            {uploadMode === "url" && (
              <div className="space-y-4">
                <Button
                  onClick={handleImageAdd}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <IconPlus className="h-4 w-4 mr-2" />
                  Add Image URL
                </Button>
              </div>
            )}

            {/* Existing Images */}
            {editConfig.images.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">
                  Current Images ({editConfig.images.length})
                </h4>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {editConfig.images.map((image, index) => (
                    <div
                      key={image.id}
                      className="border rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50 group hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconGripVertical className="h-4 w-4 text-gray-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="text-sm font-medium">
                            Image {index + 1}
                          </span>
                          {image.url && (
                            <Badge variant="secondary" className="text-xs">
                              {image.url.startsWith("blob:")
                                ? "Uploaded"
                                : "URL"}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            onClick={() => openLightbox(index)}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            disabled={!image.url}
                          >
                            <IconMaximize className="h-3 w-3" />
                          </Button>
                          <Button
                            onClick={() => handleImageRemove(index)}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <IconTrash className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Image Preview */}
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 relative group">
                          {image.url ? (
                            <>
                              <img
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => openLightbox(index)}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <IconMaximize className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <IconUpload className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          {uploadMode === "url" && (
                            <div>
                              <Label className="text-xs">Image URL</Label>
                              <Input
                                value={image.url}
                                onChange={(e) =>
                                  handleImageUpdate(
                                    index,
                                    "url",
                                    e.target.value
                                  )
                                }
                                placeholder="https://example.com/image.jpg"
                                className="h-8 text-xs"
                              />
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Alt Text</Label>
                              <Input
                                value={image.alt}
                                onChange={(e) =>
                                  handleImageUpdate(
                                    index,
                                    "alt",
                                    e.target.value
                                  )
                                }
                                placeholder="Image description"
                                className="h-8 text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Caption</Label>
                              <Input
                                value={image.caption || ""}
                                onChange={(e) =>
                                  handleImageUpdate(
                                    index,
                                    "caption",
                                    e.target.value
                                  )
                                }
                                placeholder="Optional caption"
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                          {image.url && (
                            <div className="text-xs text-gray-500 truncate">
                              {image.url.startsWith("blob:")
                                ? "✓ Uploaded file"
                                : `🔗 ${image.url}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-16 px-4 ${normalizedConfig.className || ""}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(normalizedConfig.title || normalizedConfig.subtitle) && (
          <div className="text-center mb-12">
            {normalizedConfig.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {normalizedConfig.title}
              </h2>
            )}
            {normalizedConfig.subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {normalizedConfig.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Gallery Content */}
        {normalizedConfig.layout === "slider"
          ? renderSliderLayout()
          : renderGridLayout()}

        {/* Edit Button */}
        {editable && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Gallery
            </Button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>
              Gallery Image {currentImageIndex + 1} of{" "}
              {normalizedConfig.images.length}
            </DialogTitle>
            <DialogDescription>
              {normalizedConfig.images[currentImageIndex]?.alt ||
                "Gallery image viewer"}
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-full h-full">
            <Button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10"
              variant="outline"
              size="icon"
            >
              <IconX className="h-4 w-4" />
            </Button>

            {normalizedConfig.images.length > 0 && (
              <>
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <img
                    src={normalizedConfig.images[currentImageIndex]?.url}
                    alt={normalizedConfig.images[currentImageIndex]?.alt}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {normalizedConfig.images.length > 1 && (
                  <>
                    <Button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:border-gray-600 shadow-lg"
                      variant="outline"
                      size="icon"
                    >
                      <IconChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                    </Button>
                    <Button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:border-gray-600 shadow-lg"
                      variant="outline"
                      size="icon"
                    >
                      <IconChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                    </Button>
                  </>
                )}

                {normalizedConfig.showCaptions &&
                  normalizedConfig.images[currentImageIndex]?.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                      <p className="text-center">
                        {normalizedConfig.images[currentImageIndex].caption}
                      </p>
                    </div>
                  )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
