"use client";

import React, { useState } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  IconSettings,
  IconMapPin,
  IconShieldCheck,
  IconHome,
  IconTrendingUp,
  IconPlus,
  IconTrash,
  IconStar,
  IconUsers,
  IconAward,
  IconClock,
  IconPhone,
  IconMail,
  IconEdit,
} from "@tabler/icons-react";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesComponentProps {
  id: string;
  config: {
    title: string;
    features: Feature[];
    layout: "grid" | "list";
    columns: number;
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

const iconMap = {
  "map-pin": IconMapPin,
  "shield-check": IconShieldCheck,
  home: IconHome,
  "trending-up": IconTrendingUp,
  star: IconStar,
  users: IconUsers,
  award: IconAward,
  clock: IconClock,
  phone: IconPhone,
  mail: IconMail,
};

const iconOptions = [
  { value: "map-pin", label: "Location" },
  { value: "shield-check", label: "Security" },
  { value: "home", label: "Home" },
  { value: "trending-up", label: "Growth" },
  { value: "star", label: "Star" },
  { value: "users", label: "Users" },
  { value: "award", label: "Award" },
  { value: "clock", label: "Time" },
  { value: "phone", label: "Phone" },
  { value: "mail", label: "Mail" },
];

export function FeaturesComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: FeaturesComponentProps) {
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

  const addFeature = () => {
    const newFeature: Feature = {
      icon: "home",
      title: "New Feature",
      description: "Feature description",
    };
    setEditConfig({
      ...editConfig,
      features: [...editConfig.features, newFeature],
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = editConfig.features.filter((_, i) => i !== index);
    setEditConfig({
      ...editConfig,
      features: newFeatures,
    });
  };

  const updateFeature = (
    index: number,
    field: keyof Feature,
    value: string
  ) => {
    const newFeatures = editConfig.features.map((feature, i) =>
      i === index ? { ...feature, [field]: value } : feature
    );
    setEditConfig({
      ...editConfig,
      features: newFeatures,
    });
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
    // For responsive design (public pages), use Tailwind responsive classes
    const columns = Math.min(config.columns || 2, 4);

    if (editable) {
      // In editor mode, use previewMode
      if (previewMode === "mobile") return "grid-cols-1";
      if (previewMode === "tablet") return "grid-cols-2";
      return `grid-cols-${columns}`;
    } else {
      // In public pages, use responsive classes
      if (columns === 1) return "grid-cols-1";
      if (columns === 2) return "grid-cols-1 md:grid-cols-2";
      if (columns === 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    }
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || IconHome;
    return (
      <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Features Section</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* General Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="features-title">Section Title</Label>
                    <Input
                      id="features-title"
                      value={editConfig.title}
                      onChange={(e) =>
                        setEditConfig({ ...editConfig, title: e.target.value })
                      }
                      placeholder="Features section title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="columns">Columns (Desktop)</Label>
                    <Select
                      value={editConfig.columns?.toString() || "2"}
                      onValueChange={(value) =>
                        setEditConfig({
                          ...editConfig,
                          columns: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Column</SelectItem>
                        <SelectItem value="2">2 Columns</SelectItem>
                        <SelectItem value="3">3 Columns</SelectItem>
                        <SelectItem value="4">4 Columns</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Features List */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label>Features</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFeature}
                    >
                      <IconPlus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {editConfig.features.map((feature, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Feature {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFeature(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label>Icon</Label>
                            <Select
                              value={feature.icon}
                              onValueChange={(value) =>
                                updateFeature(index, "icon", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {iconOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Title</Label>
                            <Input
                              value={feature.title}
                              onChange={(e) =>
                                updateFeature(index, "title", e.target.value)
                              }
                              placeholder="Feature title"
                            />
                          </div>

                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={feature.description}
                              onChange={(e) =>
                                updateFeature(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Feature description"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {editConfig.features.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No features added yet. Click "Add Feature" to get started.
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Features Content */}
      <div className={`bg-white dark:bg-gray-900 ${getResponsiveClasses()}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {config.title}
            </h2>
          </div>

          <div className={`grid gap-8 ${getGridColumns()}`}>
            {config.features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-center mb-4">
                  {renderIcon(feature.icon)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
