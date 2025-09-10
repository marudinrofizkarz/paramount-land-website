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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { IconSettings, IconEye, IconAlignCenter } from "@tabler/icons-react";

interface TitleDescriptionComponentProps {
  id: string;
  config: {
    title: string;
    subtitle?: string;
    description?: string;
    titleSize: "small" | "medium" | "large" | "xl";
    textAlign: "left" | "center" | "right";
    titleColor?: string;
    subtitleColor?: string;
    descriptionColor?: string;
    backgroundColor?: string;
    showSubtitle: boolean;
    showDescription: boolean;
    titleFont: "default" | "serif" | "mono";
    spacing: "compact" | "normal" | "relaxed";
    maxWidth: "full" | "container" | "narrow";
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function TitleDescriptionComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: TitleDescriptionComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState(config);

  const handleSave = () => {
    onUpdate?.(editConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditConfig(config);
    setIsEditing(false);
  };

  const getResponsiveClasses = () => {
    switch (previewMode) {
      case "mobile":
        return "px-4 py-6";
      case "tablet":
        return "px-6 py-8";
      default:
        return "px-8 py-12";
    }
  };

  const getTitleSizeClass = () => {
    const baseSizes = {
      small: "text-xl md:text-2xl",
      medium: "text-2xl md:text-3xl",
      large: "text-3xl md:text-4xl",
      xl: "text-4xl md:text-5xl",
    };

    // Adjust for mobile
    if (previewMode === "mobile") {
      return {
        small: "text-lg",
        medium: "text-xl",
        large: "text-2xl",
        xl: "text-3xl",
      }[config.titleSize];
    }

    return baseSizes[config.titleSize];
  };

  const getSubtitleSizeClass = () => {
    if (previewMode === "mobile") {
      return "text-base";
    }
    return "text-lg md:text-xl";
  };

  const getDescriptionSizeClass = () => {
    if (previewMode === "mobile") {
      return "text-sm";
    }
    return "text-base";
  };

  const getFontClass = () => {
    switch (config.titleFont) {
      case "serif":
        return "font-serif";
      case "mono":
        return "font-mono";
      default:
        return "font-sans";
    }
  };

  const getSpacingClass = () => {
    switch (config.spacing) {
      case "compact":
        return "space-y-2";
      case "relaxed":
        return "space-y-8";
      default:
        return "space-y-4";
    }
  };

  const getMaxWidthClass = () => {
    switch (config.maxWidth) {
      case "narrow":
        return "max-w-2xl mx-auto";
      case "container":
        return "max-w-4xl mx-auto";
      default:
        return "w-full";
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
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Title & Description</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Content</h3>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editConfig.title}
                      onChange={(e) =>
                        setEditConfig({ ...editConfig, title: e.target.value })
                      }
                      placeholder="Enter your title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={editConfig.subtitle || ""}
                      onChange={(e) =>
                        setEditConfig({
                          ...editConfig,
                          subtitle: e.target.value,
                        })
                      }
                      placeholder="Enter subtitle"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editConfig.description || ""}
                      onChange={(e) =>
                        setEditConfig({
                          ...editConfig,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter description"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Display Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Display Options</h3>

                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-subtitle"
                        checked={editConfig.showSubtitle}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showSubtitle: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-subtitle">Show Subtitle</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-description"
                        checked={editConfig.showDescription}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showDescription: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-description">Show Description</Label>
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Typography</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title-size">Title Size</Label>
                      <Select
                        value={editConfig.titleSize}
                        onValueChange={(value) =>
                          setEditConfig({
                            ...editConfig,
                            titleSize: value as
                              | "small"
                              | "medium"
                              | "large"
                              | "xl",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="xl">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="text-align">Text Alignment</Label>
                      <Select
                        value={editConfig.textAlign}
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

                    <div>
                      <Label htmlFor="title-font">Title Font</Label>
                      <Select
                        value={editConfig.titleFont}
                        onValueChange={(value) =>
                          setEditConfig({
                            ...editConfig,
                            titleFont: value as "default" | "serif" | "mono",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">
                            Default (Sans)
                          </SelectItem>
                          <SelectItem value="serif">Serif</SelectItem>
                          <SelectItem value="mono">Monospace</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="spacing">Spacing</Label>
                      <Select
                        value={editConfig.spacing}
                        onValueChange={(value) =>
                          setEditConfig({
                            ...editConfig,
                            spacing: value as "compact" | "normal" | "relaxed",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="relaxed">Relaxed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="max-width">Max Width</Label>
                    <Select
                      value={editConfig.maxWidth}
                      onValueChange={(value) =>
                        setEditConfig({
                          ...editConfig,
                          maxWidth: value as "full" | "container" | "narrow",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Width</SelectItem>
                        <SelectItem value="container">Container</SelectItem>
                        <SelectItem value="narrow">Narrow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Colors</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title-color">Title Color</Label>
                      <Input
                        id="title-color"
                        type="color"
                        value={editConfig.titleColor || "#000000"}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            titleColor: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="subtitle-color">Subtitle Color</Label>
                      <Input
                        id="subtitle-color"
                        type="color"
                        value={editConfig.subtitleColor || "#666666"}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            subtitleColor: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="description-color">
                        Description Color
                      </Label>
                      <Input
                        id="description-color"
                        type="color"
                        value={editConfig.descriptionColor || "#666666"}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            descriptionColor: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="bg-color">Background Color</Label>
                      <Input
                        id="bg-color"
                        type="color"
                        value={editConfig.backgroundColor || "#ffffff"}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            backgroundColor: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
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

      {/* Title Description Content */}
      <div
        className={`${getResponsiveClasses()}`}
        style={{ backgroundColor: config.backgroundColor }}
      >
        <div className={`${getMaxWidthClass()}`}>
          <div className={`text-${config.textAlign} ${getSpacingClass()}`}>
            {/* Title */}
            <h2
              className={`${getTitleSizeClass()} font-bold ${getFontClass()}`}
              style={{ color: config.titleColor }}
            >
              {config.title}
            </h2>

            {/* Subtitle */}
            {config.showSubtitle && config.subtitle && (
              <h3
                className={`${getSubtitleSizeClass()} font-medium`}
                style={{ color: config.subtitleColor }}
              >
                {config.subtitle}
              </h3>
            )}

            {/* Description */}
            {config.showDescription && config.description && (
              <div
                className={`${getDescriptionSizeClass()} leading-relaxed`}
                style={{ color: config.descriptionColor }}
              >
                {config.description.split("\n").map((paragraph, index) => (
                  <p key={index} className={index > 0 ? "mt-4" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!config.title && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-gray-400">
            <IconEye className="h-12 w-12 mx-auto mb-4" />
            <p>No title set</p>
            {editable && (
              <p className="text-sm mt-2">
                Click the settings button to add title and description
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
