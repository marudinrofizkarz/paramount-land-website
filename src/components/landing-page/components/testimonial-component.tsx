"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconSettings, IconStar } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  name: string;
  position: string;
  content: string;
  avatar: string;
  rating: number;
}

interface TestimonialComponentProps {
  id: string;
  config: {
    title: string;
    testimonials: Testimonial[];
    layout: "carousel" | "grid";
    autoPlay: boolean;
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function TestimonialComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: TestimonialComponentProps) {
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
        return "px-4 py-8";
      case "tablet":
        return "px-6 py-12";
      default:
        return "px-8 py-16";
    }
  };

  const getGridColumns = () => {
    if (previewMode === "mobile") return "grid-cols-1";
    if (previewMode === "tablet") return "grid-cols-2";
    return "grid-cols-3";
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <IconStar
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
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
                <DialogTitle>Edit Testimonials</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="testimonials-title">Title</Label>
                  <Input
                    id="testimonials-title"
                    value={editConfig.title}
                    onChange={(e) =>
                      setEditConfig({ ...editConfig, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Testimonials</Label>
                  <p className="text-sm text-muted-foreground">
                    Testimonial editing interface would be implemented here
                  </p>
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

      {/* Testimonials Content */}
      <div className={`bg-gray-50 dark:bg-gray-900 ${getResponsiveClasses()}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {config.title}
            </h2>
          </div>

          <div className={`grid gap-8 ${getGridColumns()}`}>
            {config.testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="mb-4">{renderStars(testimonial.rating)}</div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
