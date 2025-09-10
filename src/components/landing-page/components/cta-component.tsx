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

interface CTAComponentProps {
  id: string;
  config: {
    title: string;
    subtitle: string;
    primaryButton: {
      text: string;
      action: string;
      url?: string;
    };
    secondaryButton?: {
      text: string;
      action: string;
      url?: string;
    };
    backgroundColor: string;
    textColor: string;
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function CTAComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: CTAComponentProps) {
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
        return "px-4 py-12 text-center";
      case "tablet":
        return "px-6 py-16 text-center";
      default:
        return "px-8 py-20 text-center";
    }
  };

  const handleButtonClick = (button: { action: string; url?: string }) => {
    if (button.action === "external" && button.url) {
      window.open(button.url, "_blank");
    } else if (button.action === "scroll-to-form") {
      const formElement = document.querySelector(
        '[data-component-type="form"]'
      );
      formElement?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getBgClass = () => {
    switch (config.backgroundColor) {
      case "primary":
        return "bg-blue-600";
      case "secondary":
        return "bg-gray-600";
      case "success":
        return "bg-green-600";
      case "warning":
        return "bg-yellow-600";
      case "danger":
        return "bg-red-600";
      default:
        return "bg-blue-600";
    }
  };

  const getTextClass = () => {
    switch (config.textColor) {
      case "white":
        return "text-white";
      case "black":
        return "text-black";
      default:
        return "text-white";
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
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Call to Action</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cta-title">Title</Label>
                  <Input
                    id="cta-title"
                    value={editConfig.title}
                    onChange={(e) =>
                      setEditConfig({ ...editConfig, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="cta-subtitle">Subtitle</Label>
                  <Textarea
                    id="cta-subtitle"
                    value={editConfig.subtitle}
                    onChange={(e) =>
                      setEditConfig({ ...editConfig, subtitle: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="primary-button-text">
                    Primary Button Text
                  </Label>
                  <Input
                    id="primary-button-text"
                    value={editConfig.primaryButton.text}
                    onChange={(e) =>
                      setEditConfig({
                        ...editConfig,
                        primaryButton: {
                          ...editConfig.primaryButton,
                          text: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="primary-button-url">Primary Button URL</Label>
                  <Input
                    id="primary-button-url"
                    value={editConfig.primaryButton.url || ""}
                    onChange={(e) =>
                      setEditConfig({
                        ...editConfig,
                        primaryButton: {
                          ...editConfig.primaryButton,
                          url: e.target.value,
                        },
                      })
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

      {/* CTA Content */}
      <div
        className={`${getBgClass()} ${getTextClass()} ${getResponsiveClasses()}`}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className={`font-bold mb-4 ${
              previewMode === "mobile"
                ? "text-2xl"
                : previewMode === "tablet"
                ? "text-3xl"
                : "text-4xl"
            }`}
          >
            {config.title}
          </h2>
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size={previewMode === "mobile" ? "default" : "lg"}
              className="bg-white text-gray-900 hover:bg-gray-100"
              onClick={() => handleButtonClick(config.primaryButton)}
            >
              {config.primaryButton.text}
              {config.primaryButton.action === "external" && (
                <IconExternalLink className="ml-2 h-4 w-4" />
              )}
            </Button>

            {config.secondaryButton && (
              <Button
                size={previewMode === "mobile" ? "default" : "lg"}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900"
                onClick={() => handleButtonClick(config.secondaryButton!)}
              >
                {config.secondaryButton.text}
                {config.secondaryButton.action === "external" && (
                  <IconExternalLink className="ml-2 h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
