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
import { IconSettings } from "@tabler/icons-react";

interface CopyrightComponentProps {
  id: string;
  config: {
    companyName: string;
    year?: string;
    additionalText?: string;
    showYear: boolean;
    showAllRightsReserved: boolean;
    textAlign: "left" | "center" | "right";
    textSize: "small" | "medium" | "large";
    textColor?: string;
    backgroundColor?: string;
    showBorder?: boolean;
    customStyles?: React.CSSProperties;
    customClasses?: string;
    links?: Array<{
      label: string;
      url: string;
    }>;
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function CopyrightComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: CopyrightComponentProps) {
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

  const addLink = () => {
    setEditConfig({
      ...editConfig,
      links: [...(editConfig.links || []), { label: "", url: "" }],
    });
  };

  const updateLink = (index: number, field: "label" | "url", value: string) => {
    const newLinks = [...(editConfig.links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setEditConfig({ ...editConfig, links: newLinks });
  };

  const removeLink = (index: number) => {
    const newLinks = [...(editConfig.links || [])];
    newLinks.splice(index, 1);
    setEditConfig({ ...editConfig, links: newLinks });
  };

  const getResponsiveClasses = () => {
    switch (previewMode) {
      case "mobile":
        return "px-4 py-4";
      case "tablet":
        return "px-6 py-6";
      default:
        return "px-8 py-8";
    }
  };

  const getTextSizeClass = () => {
    switch (config.textSize) {
      case "small":
        return "text-xs";
      case "large":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  const getCurrentYear = () => {
    return config.year || new Date().getFullYear().toString();
  };

  const generateCopyrightText = () => {
    let text = "";

    if (config.showYear) {
      text += `© ${getCurrentYear()} `;
    } else {
      text += "© ";
    }

    text += config.companyName;

    if (config.showAllRightsReserved) {
      text += ". All rights reserved.";
    }

    if (config.additionalText) {
      text += ` ${config.additionalText}`;
    }

    return text;
  };

  const getDynamicContainerClasses = () => {
    const hasCustomBg =
      config.backgroundColor && config.backgroundColor !== "transparent";
    const hasCustomText = config.textColor;

    if (hasCustomBg || hasCustomText) {
      return "";
    }

    // Default classes with dark mode support
    return "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300";
  };

  const getDynamicContainerStyles = () => {
    const hasCustomBg =
      config.backgroundColor && config.backgroundColor !== "transparent";
    const hasCustomText = config.textColor;

    if (hasCustomBg || hasCustomText) {
      return {
        backgroundColor: config.backgroundColor,
        color: config.textColor,
      };
    }

    return {};
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
                <DialogTitle>Edit Copyright</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Company Name */}
                <div>
                  <Label htmlFor="company-name">Company Name *</Label>
                  <Input
                    id="company-name"
                    value={editConfig.companyName}
                    onChange={(e) =>
                      setEditConfig({
                        ...editConfig,
                        companyName: e.target.value,
                      })
                    }
                    placeholder="Your Company Name"
                  />
                </div>

                {/* Year */}
                <div>
                  <Label htmlFor="year">Year (Optional)</Label>
                  <Input
                    id="year"
                    value={editConfig.year || ""}
                    onChange={(e) =>
                      setEditConfig({ ...editConfig, year: e.target.value })
                    }
                    placeholder={new Date().getFullYear().toString()}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to use current year automatically
                  </p>
                </div>

                {/* Additional Text */}
                <div>
                  <Label htmlFor="additional-text">Additional Text</Label>
                  <Textarea
                    id="additional-text"
                    value={editConfig.additionalText || ""}
                    onChange={(e) =>
                      setEditConfig({
                        ...editConfig,
                        additionalText: e.target.value,
                      })
                    }
                    placeholder="Any additional copyright text"
                    rows={2}
                  />
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-year"
                      checked={editConfig.showYear}
                      onCheckedChange={(checked) =>
                        setEditConfig({ ...editConfig, showYear: !!checked })
                      }
                    />
                    <Label htmlFor="show-year">Show Year</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-rights"
                      checked={editConfig.showAllRightsReserved}
                      onCheckedChange={(checked) =>
                        setEditConfig({
                          ...editConfig,
                          showAllRightsReserved: !!checked,
                        })
                      }
                    />
                    <Label htmlFor="show-rights">
                      Show "All rights reserved"
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-border"
                      checked={editConfig.showBorder || false}
                      onCheckedChange={(checked) =>
                        setEditConfig({ ...editConfig, showBorder: !!checked })
                      }
                    />
                    <Label htmlFor="show-border">Show Top Border</Label>
                  </div>
                </div>

                {/* Text Alignment */}
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

                {/* Text Size */}
                <div>
                  <Label htmlFor="text-size">Text Size</Label>
                  <Select
                    value={editConfig.textSize}
                    onValueChange={(value) =>
                      setEditConfig({
                        ...editConfig,
                        textSize: value as "small" | "medium" | "large",
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
                    </SelectContent>
                  </Select>
                </div>

                {/* Background Color */}
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

                {/* Text Color */}
                <div>
                  <Label htmlFor="text-color">Text Color</Label>
                  <Input
                    id="text-color"
                    type="color"
                    value={editConfig.textColor || "#000000"}
                    onChange={(e) =>
                      setEditConfig({
                        ...editConfig,
                        textColor: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Links */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Legal Links</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addLink}
                    >
                      Add Link
                    </Button>
                  </div>
                  {editConfig.links?.map((link, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Label"
                        value={link.label}
                        onChange={(e) =>
                          updateLink(index, "label", e.target.value)
                        }
                      />
                      <Input
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) =>
                          updateLink(index, "url", e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeLink(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
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

      {/* Copyright Content */}
      <div
        className={`${getResponsiveClasses()} ${getDynamicContainerClasses()} ${
          config.showBorder
            ? "border-t border-gray-200 dark:border-gray-700"
            : ""
        } ${config.customClasses || ""}`}
        style={{
          ...getDynamicContainerStyles(),
          ...config.customStyles,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className={`text-${config.textAlign} ${getTextSizeClass()}`}>
            {/* Main Copyright Text */}
            <div className="mb-2">
              <span>{generateCopyrightText()}</span>
            </div>

            {/* Legal Links */}
            {config.links && config.links.length > 0 && (
              <div
                className={`flex flex-wrap gap-4 mt-2 ${
                  previewMode === "mobile"
                    ? "justify-center"
                    : `justify-${config.textAlign}`
                }`}
              >
                {config.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
