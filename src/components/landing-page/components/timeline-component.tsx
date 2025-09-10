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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileUploader } from "@/components/file-uploader";
import {
  IconEdit,
  IconPlus,
  IconTrash,
  IconCheck,
  IconClock,
  IconCalendar,
  IconMapPin,
  IconBuilding,
  IconUsers,
  IconTool,
  IconUpload,
} from "@tabler/icons-react";

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  status: "completed" | "current" | "upcoming";
  icon?: string;
  image?: string;
  progress?: number;
}

interface TimelineConfig {
  title?: string;
  subtitle?: string;
  layout: "vertical" | "horizontal";
  showProgress?: boolean;
  showImages?: boolean;
  showDates?: boolean;
  items: TimelineItem[];
  className?: string;
}

interface TimelineComponentProps {
  id: string;
  config: TimelineConfig;
  onUpdate?: (config: TimelineConfig) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

const iconMap = {
  check: IconCheck,
  clock: IconClock,
  calendar: IconCalendar,
  "map-pin": IconMapPin,
  building: IconBuilding,
  users: IconUsers,
  tool: IconTool,
};

export function TimelineComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: TimelineComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState<TimelineConfig>(config);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    console.log(`[Timeline ${id}] Config updated:`, config);
    setEditConfig(config);
  }, [config, id]);

  const handleSave = () => {
    // Ensure all images are properly saved
    const configToSave = {
      ...editConfig,
      items: editConfig.items.map((item) => ({
        ...item,
        image: item.image || undefined, // Keep image field consistent
      })),
    };
    onUpdate?.(configToSave);
    setIsEditing(false);
  };

  const handleItemAdd = () => {
    const newItem: TimelineItem = {
      id: `timeline-${Date.now()}`,
      title: "New Milestone",
      description: "Description of this milestone",
      date: new Date().toISOString().split("T")[0],
      status: "upcoming",
      icon: "clock",
      progress: 0,
    };
    setEditConfig({
      ...editConfig,
      items: [...editConfig.items, newItem],
    });
  };

  const handleItemUpdate = (
    index: number,
    field: keyof TimelineItem,
    value: any
  ) => {
    setEditConfig((prevConfig) => {
      const updatedItems = prevConfig.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return { ...prevConfig, items: updatedItems };
    });
  };

  const handleItemRemove = (index: number) => {
    const updatedItems = editConfig.items.filter((_, i) => i !== index);
    setEditConfig({ ...editConfig, items: updatedItems });
  };

  const handleImageUpload = async (files: File[], index: number) => {
    if (files.length === 0) return;

    setUploadingIndex(index);
    try {
      // Simulate upload delay - in production, upload to your server/cloud storage
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Convert file to data URL for proper serialization
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          handleItemUpdate(index, "image", dataUrl);
        }
        setUploadingIndex(null);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setUploadingIndex(null);
      };
      reader.readAsDataURL(files[0]);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadingIndex(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-green-100 dark:bg-green-900",
          text: "text-green-800 dark:text-green-200",
          border: "border-green-500",
          dot: "bg-green-500",
        };
      case "current":
        return {
          bg: "bg-blue-100 dark:bg-blue-900",
          text: "text-blue-800 dark:text-blue-200",
          border: "border-blue-500",
          dot: "bg-blue-500",
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-600 dark:text-gray-400",
          border: "border-gray-300",
          dot: "bg-gray-300",
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderVerticalTimeline = () => {
    return (
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>

        <div className="space-y-8">
          {config.items.map((item, index) => {
            const IconComponent =
              iconMap[item.icon as keyof typeof iconMap] || IconClock;
            const colors = getStatusColor(item.status);

            return (
              <div key={item.id} className="relative flex items-start">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${colors.border} bg-white dark:bg-gray-900`}
                >
                  <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                </div>

                {/* Content */}
                <div className="ml-6 flex-1">
                  <Card
                    className={`border-2 ${colors.border} ${
                      item.status === "current" ? "shadow-lg" : "shadow-sm"
                    } hover:shadow-md transition-shadow`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <IconComponent className={`h-5 w-5 ${colors.text}`} />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                        </div>
                        <Badge
                          className={`${colors.bg} ${colors.text} border-0`}
                        >
                          {item.status}
                        </Badge>
                      </div>

                      {config.showDates && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <IconCalendar className="h-4 w-4" />
                          {formatDate(item.date)}
                        </div>
                      )}

                      {item.description && (
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {item.description}
                        </p>
                      )}

                      {config.showProgress && item.progress !== undefined && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span>Progress</span>
                            <span>{item.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${colors.dot}`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {config.showImages && item.image && (
                        <div className="mt-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderHorizontalTimeline = () => {
    if (previewMode === "mobile") {
      return renderVerticalTimeline();
    }

    return (
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-12 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600"></div>

        <div className="flex justify-between relative">
          {config.items.map((item, index) => {
            const IconComponent =
              iconMap[item.icon as keyof typeof iconMap] || IconClock;
            const colors = getStatusColor(item.status);

            return (
              <div
                key={item.id}
                className="flex flex-col items-center max-w-xs"
              >
                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${colors.border} bg-white dark:bg-gray-900 mb-4`}
                >
                  <IconComponent className={`h-5 w-5 ${colors.text}`} />
                </div>

                {/* Content */}
                <Card
                  className={`w-full border-2 ${colors.border} ${
                    item.status === "current" ? "shadow-lg" : "shadow-sm"
                  } hover:shadow-md transition-shadow`}
                >
                  <CardContent className="p-4 text-center">
                    <div className="mb-2">
                      <Badge
                        className={`${colors.bg} ${colors.text} border-0 mb-2`}
                      >
                        {item.status}
                      </Badge>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {item.title}
                      </h3>
                    </div>

                    {config.showDates && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {formatDate(item.date)}
                      </div>
                    )}

                    {item.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-xs mb-3">
                        {item.description}
                      </p>
                    )}

                    {config.showProgress && item.progress !== undefined && (
                      <div className="mb-3">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {item.progress}%
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${colors.dot}`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {config.showImages && item.image && (
                      <div className="mt-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-24 object-cover rounded"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (editable && isEditing) {
    return (
      <div className="border-2 border-dashed border-primary p-6 rounded-lg bg-blue-50/50 dark:bg-blue-950/50">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit Timeline</h3>
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

          {/* General Settings */}
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
                  placeholder="Timeline title"
                />
              </div>

              <div>
                <Label htmlFor="layout">Layout</Label>
                <Select
                  value={editConfig.layout}
                  onValueChange={(value: "vertical" | "horizontal") =>
                    setEditConfig({ ...editConfig, layout: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vertical">Vertical</SelectItem>
                    <SelectItem value="horizontal">Horizontal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={editConfig.subtitle || ""}
                onChange={(e) =>
                  setEditConfig({ ...editConfig, subtitle: e.target.value })
                }
                placeholder="Timeline subtitle"
                rows={2}
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editConfig.showProgress || false}
                  onChange={(e) =>
                    setEditConfig({
                      ...editConfig,
                      showProgress: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span className="text-sm">Show Progress</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editConfig.showImages || false}
                  onChange={(e) =>
                    setEditConfig({
                      ...editConfig,
                      showImages: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span className="text-sm">Show Images</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editConfig.showDates !== false}
                  onChange={(e) =>
                    setEditConfig({
                      ...editConfig,
                      showDates: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span className="text-sm">Show Dates</span>
              </label>
            </div>
          </div>

          {/* Timeline Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Timeline Items</Label>
              <Button onClick={handleItemAdd} size="sm" variant="outline">
                <IconPlus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {editConfig.items.map((item, index) => (
                <Card key={item.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Item {index + 1}
                      </span>
                      <Button
                        onClick={() => handleItemRemove(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={item.title}
                          onChange={(e) =>
                            handleItemUpdate(index, "title", e.target.value)
                          }
                          placeholder="Milestone title"
                        />
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={item.date}
                          onChange={(e) =>
                            handleItemUpdate(index, "date", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={item.description || ""}
                        onChange={(e) =>
                          handleItemUpdate(index, "description", e.target.value)
                        }
                        placeholder="Item description"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label>Status</Label>
                        <Select
                          value={item.status}
                          onValueChange={(
                            value: "completed" | "current" | "upcoming"
                          ) => handleItemUpdate(index, "status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="current">Current</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <Select
                          value={item.icon || "clock"}
                          onValueChange={(value) =>
                            handleItemUpdate(index, "icon", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="check">Check</SelectItem>
                            <SelectItem value="clock">Clock</SelectItem>
                            <SelectItem value="calendar">Calendar</SelectItem>
                            <SelectItem value="map-pin">Location</SelectItem>
                            <SelectItem value="building">Building</SelectItem>
                            <SelectItem value="users">Users</SelectItem>
                            <SelectItem value="tool">Tool</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Progress (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={item.progress || 0}
                          onChange={(e) =>
                            handleItemUpdate(
                              index,
                              "progress",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {editConfig.showImages && (
                      <div>
                        <Label>Timeline Image</Label>
                        <div className="space-y-3">
                          <FileUploader
                            maxFiles={1}
                            maxSize={1024 * 1024 * 4}
                            accept={{ "image/*": [] }}
                            onUpload={(files) =>
                              handleImageUpload(files, index)
                            }
                            disabled={uploadingIndex === index}
                          />
                          {item.image && (
                            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  Current Image
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Click upload to replace
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleItemUpdate(index, "image", "")
                                }
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-16 px-4 ${config.className || ""}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(config.title || config.subtitle) && (
          <div className="text-center mb-12">
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

        {/* Timeline Content */}
        {config.layout === "horizontal"
          ? renderHorizontalTimeline()
          : renderVerticalTimeline()}

        {/* Edit Button */}
        {editable && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Timeline
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
