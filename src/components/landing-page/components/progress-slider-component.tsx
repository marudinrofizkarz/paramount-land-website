"use client";

import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  IconSettings,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconTrash,
  IconCalendar,
  IconProgress,
} from "@tabler/icons-react";

interface ProgressItem {
  title: string;
  description: string;
  date: string;
  percentage: number;
  image?: string;
  status: "completed" | "in-progress" | "upcoming";
}

interface ProgressSliderComponentProps {
  id: string;
  config: {
    title: string;
    subtitle?: string;
    progressItems: ProgressItem[];
    autoPlay: boolean;
    autoPlaySpeed: number;
    showProgressBar: boolean;
    showPercentage: boolean;
    showNavigationDots: boolean;
    showNavigationArrows: boolean;
    backgroundColor?: string;
    accentColor?: string;
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function ProgressSliderComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: ProgressSliderComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState(config);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSave = () => {
    onUpdate?.(editConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditConfig(config);
    setIsEditing(false);
  };

  const addProgressItem = () => {
    setEditConfig({
      ...editConfig,
      progressItems: [
        ...editConfig.progressItems,
        {
          title: "",
          description: "",
          date: "",
          percentage: 0,
          image: "",
          status: "upcoming",
        },
      ],
    });
  };

  const updateProgressItem = (
    index: number,
    field: keyof ProgressItem,
    value: any
  ) => {
    const newItems = [...editConfig.progressItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditConfig({ ...editConfig, progressItems: newItems });
  };

  const removeProgressItem = (index: number) => {
    const newItems = [...editConfig.progressItems];
    newItems.splice(index, 1);
    setEditConfig({ ...editConfig, progressItems: newItems });
  };

  const getItemsPerSlide = () => {
    switch (previewMode) {
      case "mobile":
        return 1;
      case "tablet":
        return 2;
      default:
        return 3;
    }
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

  const getTotalSlides = () => {
    const itemsPerSlide = getItemsPerSlide();
    return Math.ceil(config.progressItems.length / itemsPerSlide);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % getTotalSlides());
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + getTotalSlides()) % getTotalSlides());
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto play effect
  useEffect(() => {
    if (config.autoPlay && config.progressItems.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, config.autoPlaySpeed * 1000);

      return () => clearInterval(interval);
    }
  }, [
    config.autoPlay,
    config.autoPlaySpeed,
    currentSlide,
    config.progressItems.length,
  ]);

  const getCurrentItems = () => {
    const itemsPerSlide = getItemsPerSlide();
    const startIndex = currentSlide * itemsPerSlide;
    return config.progressItems.slice(startIndex, startIndex + itemsPerSlide);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      default:
        return "Upcoming";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
                <DialogTitle>Edit Progress Slider</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Settings</h3>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editConfig.title}
                      onChange={(e) =>
                        setEditConfig({ ...editConfig, title: e.target.value })
                      }
                      placeholder="Construction Progress"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Textarea
                      id="subtitle"
                      value={editConfig.subtitle || ""}
                      onChange={(e) =>
                        setEditConfig({
                          ...editConfig,
                          subtitle: e.target.value,
                        })
                      }
                      placeholder="Track our development milestones"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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

                    <div>
                      <Label htmlFor="accent-color">Accent Color</Label>
                      <Input
                        id="accent-color"
                        type="color"
                        value={editConfig.accentColor || "#3b82f6"}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            accentColor: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Slider Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Slider Settings</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="auto-play"
                        checked={editConfig.autoPlay}
                        onCheckedChange={(checked) =>
                          setEditConfig({ ...editConfig, autoPlay: !!checked })
                        }
                      />
                      <Label htmlFor="auto-play">Auto Play</Label>
                    </div>

                    <div>
                      <Label htmlFor="auto-play-speed">
                        Auto Play Speed (seconds)
                      </Label>
                      <Input
                        id="auto-play-speed"
                        type="number"
                        min="1"
                        max="10"
                        value={editConfig.autoPlaySpeed}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            autoPlaySpeed: parseInt(e.target.value) || 3,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-progress-bar"
                        checked={editConfig.showProgressBar}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showProgressBar: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-progress-bar">
                        Show Progress Bar
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-percentage"
                        checked={editConfig.showPercentage}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showPercentage: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-percentage">Show Percentage</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-dots"
                        checked={editConfig.showNavigationDots}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showNavigationDots: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-dots">Show Navigation Dots</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-arrows"
                        checked={editConfig.showNavigationArrows}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showNavigationArrows: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-arrows">
                        Show Navigation Arrows
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Progress Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Progress Items</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addProgressItem}
                    >
                      <IconPlus className="h-4 w-4 mr-2" />
                      Add Progress Item
                    </Button>
                  </div>

                  {editConfig.progressItems.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                          Progress Item {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeProgressItem(index)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={item.title}
                            onChange={(e) =>
                              updateProgressItem(index, "title", e.target.value)
                            }
                            placeholder="Foundation Complete"
                          />
                        </div>

                        <div>
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={item.date}
                            onChange={(e) =>
                              updateProgressItem(index, "date", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <Label>Percentage</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={item.percentage}
                            onChange={(e) =>
                              updateProgressItem(
                                index,
                                "percentage",
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label>Status</Label>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              updateProgressItem(
                                index,
                                "status",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) =>
                            updateProgressItem(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Progress description"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label>Image URL (Optional)</Label>
                        <Input
                          value={item.image || ""}
                          onChange={(e) =>
                            updateProgressItem(index, "image", e.target.value)
                          }
                          placeholder="https://example.com/progress-image.jpg"
                        />
                      </div>
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

      {/* Progress Slider Content */}
      <div
        className={`${getResponsiveClasses()}`}
        style={{ backgroundColor: config.backgroundColor }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {config.title}
            </h2>
            {config.subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {config.subtitle}
              </p>
            )}
          </div>

          {/* Slider Container */}
          <div className="relative">
            {/* Navigation Arrows */}
            {config.showNavigationArrows && getTotalSlides() > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:border-gray-600 shadow-lg"
                  onClick={prevSlide}
                >
                  <IconChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:border-gray-600 shadow-lg"
                  onClick={nextSlide}
                >
                  <IconChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                </Button>
              </>
            )}

            {/* Progress Items Grid */}
            <div
              className={`grid gap-6 ${
                previewMode === "mobile"
                  ? "grid-cols-1"
                  : previewMode === "tablet"
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
            >
              {getCurrentItems().map((item, index) => (
                <div
                  key={`${currentSlide}-${index}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Progress Image */}
                  {item.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Progress Info */}
                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusText(item.status)}
                      </span>
                      {config.showPercentage && (
                        <span
                          className="text-2xl font-bold"
                          style={{ color: config.accentColor }}
                        >
                          {item.percentage}%
                        </span>
                      )}
                    </div>

                    {/* Title and Date */}
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {item.title}
                      </h3>
                      {item.date && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <IconCalendar className="h-4 w-4" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {item.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {item.description}
                      </p>
                    )}

                    {/* Progress Bar */}
                    {config.showProgressBar && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">
                            Progress
                          </span>
                          <span className="font-medium">
                            {item.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: config.accentColor,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            {config.showNavigationDots && getTotalSlides() > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: getTotalSlides() }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide
                        ? "bg-blue-600"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {config.progressItems.length === 0 && (
            <div className="text-center py-12">
              <IconProgress className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No progress items added yet
              </p>
              {editable && (
                <p className="text-sm text-gray-400 mt-2">
                  Click the settings button to add progress items
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
