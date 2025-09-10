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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  IconEdit,
  IconPlayerPlay,
  IconX,
  IconExternalLink,
  IconVideo,
  IconPhoto,
} from "@tabler/icons-react";

interface VideoConfig {
  title?: string;
  subtitle?: string;
  type: "youtube" | "vimeo" | "direct" | "embed";
  videoId?: string;
  videoUrl?: string;
  embedCode?: string;
  thumbnailUrl?: string;
  autoplay?: boolean;
  showControls?: boolean;
  aspectRatio: "16:9" | "4:3" | "1:1" | "21:9";
  maxWidth?: string;
  description?: string;
  className?: string;
}

interface VideoComponentProps {
  id: string;
  config: VideoConfig;
  onUpdate?: (config: VideoConfig) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function VideoComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: VideoComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState<VideoConfig>(config);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [thumbnailUploadError, setThumbnailUploadError] = useState<
    string | null
  >(null);

  useEffect(() => {
    setEditConfig(config);
  }, [config]);

  const handleSave = () => {
    onUpdate?.(editConfig);
    setIsEditing(false);
  };

  const extractVideoId = (url: string, type: "youtube" | "vimeo") => {
    if (type === "youtube") {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    } else if (type === "vimeo") {
      const regExp =
        /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/)|(video\/))?([0-9]+)/;
      const match = url.match(regExp);
      return match ? match[6] : null;
    }
    return null;
  };

  const getYoutubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const getVimeoThumbnail = (videoId: string) => {
    // Note: Vimeo requires API call for thumbnails, using placeholder for demo
    return `https://vumbnail.com/${videoId}.jpg`;
  };

  const getVideoThumbnail = () => {
    if (config.thumbnailUrl) return config.thumbnailUrl;

    if (config.type === "youtube" && config.videoId) {
      return getYoutubeThumbnail(config.videoId);
    } else if (config.type === "vimeo" && config.videoId) {
      return getVimeoThumbnail(config.videoId);
    }

    return "/api/placeholder/640/360";
  };

  const handleThumbnailUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setThumbnailUploadError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setThumbnailUploadError("Image size must be less than 5MB");
      return;
    }

    setUploadingThumbnail(true);
    setThumbnailUploadError(null);

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
        thumbnailUrl: data.url,
      });
    } catch (error) {
      console.error("Upload error:", error);
      setThumbnailUploadError("Failed to upload thumbnail. Please try again.");
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const removeThumbnail = () => {
    setEditConfig({
      ...editConfig,
      thumbnailUrl: undefined,
    });
  };

  const getAspectRatioClass = () => {
    switch (config.aspectRatio) {
      case "4:3":
        return "aspect-[4/3]";
      case "1:1":
        return "aspect-square";
      case "21:9":
        return "aspect-[21/9]";
      default:
        return "aspect-video"; // 16:9
    }
  };

  const getEmbedUrl = () => {
    if (config.type === "youtube" && config.videoId) {
      const params = new URLSearchParams();
      if (config.autoplay) params.append("autoplay", "1");
      if (!config.showControls) params.append("controls", "0");
      params.append("rel", "0");
      params.append("modestbranding", "1");

      return `https://www.youtube.com/embed/${
        config.videoId
      }?${params.toString()}`;
    } else if (config.type === "vimeo" && config.videoId) {
      const params = new URLSearchParams();
      if (config.autoplay) params.append("autoplay", "1");
      if (!config.showControls) params.append("controls", "0");
      params.append("title", "0");
      params.append("byline", "0");
      params.append("portrait", "0");

      return `https://player.vimeo.com/video/${
        config.videoId
      }?${params.toString()}`;
    }

    return config.videoUrl;
  };

  const handleUrlChange = (url: string) => {
    setEditConfig({ ...editConfig, videoUrl: url });

    // Auto-detect video type and extract ID
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = extractVideoId(url, "youtube");
      if (videoId) {
        setEditConfig({
          ...editConfig,
          type: "youtube",
          videoUrl: url,
          videoId: videoId,
        });
      }
    } else if (url.includes("vimeo.com")) {
      const videoId = extractVideoId(url, "vimeo");
      if (videoId) {
        setEditConfig({
          ...editConfig,
          type: "vimeo",
          videoUrl: url,
          videoId: videoId,
        });
      }
    } else {
      setEditConfig({
        ...editConfig,
        type: "direct",
        videoUrl: url,
      });
    }
  };

  const renderVideoPlayer = () => {
    if (!isPlaying && !config.autoplay) {
      return (
        <div
          className={`relative ${getAspectRatioClass()} bg-gray-900 rounded-lg overflow-hidden cursor-pointer group`}
          onClick={() => setIsPlaying(true)}
        >
          <img
            src={getVideoThumbnail()}
            alt={config.title || "Video thumbnail"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
            <div className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-4 transition-colors shadow-lg">
              <IconPlayerPlay className="h-8 w-8 text-gray-900 dark:text-gray-100 ml-1" />
            </div>
          </div>
          {config.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 hidden md:block">
              <h3 className="text-white font-semibold text-lg">
                {config.title}
              </h3>
              {config.description && (
                <p className="text-white/80 text-sm mt-1">
                  {config.description}
                </p>
              )}
            </div>
          )}
        </div>
      );
    }

    if (config.type === "embed" && config.embedCode) {
      return (
        <div
          className={`${getAspectRatioClass()} rounded-lg overflow-hidden`}
          dangerouslySetInnerHTML={{ __html: config.embedCode }}
        />
      );
    }

    if (config.type === "direct" && config.videoUrl) {
      return (
        <div className={`${getAspectRatioClass()} rounded-lg overflow-hidden`}>
          <video
            src={config.videoUrl}
            controls={config.showControls}
            autoPlay={config.autoplay}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    const embedUrl = getEmbedUrl();
    if (!embedUrl) {
      return (
        <div
          className={`${getAspectRatioClass()} bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center`}
        >
          <div className="text-center">
            <IconVideo className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No video configured</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`${getAspectRatioClass()} rounded-lg overflow-hidden`}>
        <iframe
          src={embedUrl}
          title={config.title || "Video"}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };

  if (editable && isEditing) {
    return (
      <div className="border-2 border-dashed border-primary p-6 rounded-lg bg-blue-50/50 dark:bg-blue-950/50">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit Video</h3>
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

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editConfig.title || ""}
                  onChange={(e) =>
                    setEditConfig({ ...editConfig, title: e.target.value })
                  }
                  placeholder="Video title"
                />
              </div>

              <div>
                <Label htmlFor="type">Video Type</Label>
                <Select
                  value={editConfig.type}
                  onValueChange={(
                    value: "youtube" | "vimeo" | "direct" | "embed"
                  ) => setEditConfig({ ...editConfig, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="vimeo">Vimeo</SelectItem>
                    <SelectItem value="direct">Direct URL</SelectItem>
                    <SelectItem value="embed">Custom Embed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="subtitle">Description</Label>
              <Textarea
                id="subtitle"
                value={editConfig.description || ""}
                onChange={(e) =>
                  setEditConfig({ ...editConfig, description: e.target.value })
                }
                placeholder="Video description"
                rows={2}
              />
            </div>

            {editConfig.type === "embed" ? (
              <div>
                <Label htmlFor="embed">Embed Code</Label>
                <Textarea
                  id="embed"
                  value={editConfig.embedCode || ""}
                  onChange={(e) =>
                    setEditConfig({ ...editConfig, embedCode: e.target.value })
                  }
                  placeholder="<iframe src='...' ...></iframe>"
                  rows={4}
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="url">Video URL</Label>
                <Input
                  id="url"
                  value={editConfig.videoUrl || ""}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {editConfig.videoId && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Video ID detected: {editConfig.videoId}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label>Custom Thumbnail</Label>

                {/* Thumbnail Upload Section */}
                {editConfig.thumbnailUrl ? (
                  <div className="space-y-2">
                    <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                      <img
                        src={editConfig.thumbnailUrl}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeThumbnail}
                      >
                        Remove Thumbnail
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                        id="thumbnail-upload"
                        disabled={uploadingThumbnail}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("thumbnail-upload")?.click()
                        }
                        disabled={uploadingThumbnail}
                      >
                        {uploadingThumbnail
                          ? "Uploading..."
                          : "Change Thumbnail"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      id="thumbnail-upload"
                      disabled={uploadingThumbnail}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("thumbnail-upload")?.click()
                      }
                      disabled={uploadingThumbnail}
                      className="w-full"
                    >
                      {uploadingThumbnail
                        ? "Uploading..."
                        : "Upload Custom Thumbnail"}
                    </Button>
                    <p className="text-xs text-gray-500">
                      Optional. If not provided, auto-generated thumbnail will
                      be used.
                    </p>
                  </div>
                )}

                {thumbnailUploadError && (
                  <p className="text-sm text-red-500">{thumbnailUploadError}</p>
                )}
              </div>

              <div>
                <Label htmlFor="aspect">Aspect Ratio</Label>
                <Select
                  value={editConfig.aspectRatio}
                  onValueChange={(value: "16:9" | "4:3" | "1:1" | "21:9") =>
                    setEditConfig({ ...editConfig, aspectRatio: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                    <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="21:9">21:9 (Ultrawide)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editConfig.autoplay || false}
                  onChange={(e) =>
                    setEditConfig({ ...editConfig, autoplay: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm">Autoplay</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editConfig.showControls !== false}
                  onChange={(e) =>
                    setEditConfig({
                      ...editConfig,
                      showControls: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span className="text-sm">Show Controls</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-16 px-4 ${config.className || ""}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header - Hidden on mobile */}
        {(config.title || config.subtitle) && (
          <div className="text-center mb-8 hidden md:block">
            {config.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {config.title}
              </h2>
            )}
            {config.subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {config.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Video Player */}
        <div
          className="mx-auto"
          style={{ maxWidth: config.maxWidth || "100%" }}
        >
          {renderVideoPlayer()}
        </div>

        {/* Description - Hidden on mobile */}
        {config.description && !config.title && (
          <div className="mt-6 text-center hidden md:block">
            <p className="text-gray-600 dark:text-gray-300">
              {config.description}
            </p>
          </div>
        )}

        {/* Edit Button */}
        {editable && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Video
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
