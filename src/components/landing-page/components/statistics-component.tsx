"use client";

import React, { useState, useEffect, useRef } from "react";
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
import {
  IconEdit,
  IconPlus,
  IconTrash,
  IconTrendingUp,
  IconUsers,
  IconBuilding,
  IconAward,
  IconTarget,
  IconChartPie,
} from "@tabler/icons-react";

interface StatisticItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon?: string;
  description?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

interface StatisticsConfig {
  title?: string;
  subtitle?: string;
  layout: "grid" | "horizontal" | "cards";
  columns: 2 | 3 | 4 | 5;
  animate?: boolean;
  animationDuration?: number;
  items: StatisticItem[];
  backgroundColor?: string;
  className?: string;
}

interface StatisticsComponentProps {
  id: string;
  config: StatisticsConfig;
  onUpdate?: (config: StatisticsConfig) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

const iconMap = {
  "trending-up": IconTrendingUp,
  users: IconUsers,
  building: IconBuilding,
  award: IconAward,
  target: IconTarget,
  "chart-pie": IconChartPie,
};

// Counter animation hook
function useCounter(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * (end - start) + start));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, start, isVisible]);

  return { count, ref };
}

export function StatisticsComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: StatisticsComponentProps) {
  // Normalize config to ensure all properties are defined
  const normalizedConfig: StatisticsConfig = {
    title: config.title || "",
    subtitle: config.subtitle || "",
    layout: config.layout || "grid",
    columns: config.columns || 3,
    animate: config.animate ?? true,
    animationDuration: config.animationDuration || 2000,
    items: config.items || [],
    backgroundColor: config.backgroundColor || "",
    className: config.className || "",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] =
    useState<StatisticsConfig>(normalizedConfig);

  useEffect(() => {
    setEditConfig(normalizedConfig);
  }, [config]);

  const handleSave = () => {
    onUpdate?.(editConfig);
    setIsEditing(false);
  };

  const handleItemAdd = () => {
    const newItem: StatisticItem = {
      id: `stat-${Date.now()}`,
      label: "New Statistic",
      value: 100,
      suffix: "",
      prefix: "",
      icon: "trending-up",
      description: "",
      color: "blue",
    };
    setEditConfig({
      ...editConfig,
      items: [...editConfig.items, newItem],
    });
  };

  const handleItemUpdate = (
    index: number,
    field: keyof StatisticItem,
    value: any
  ) => {
    const updatedItems = editConfig.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setEditConfig({ ...editConfig, items: updatedItems });
  };

  const handleItemRemove = (index: number) => {
    const updatedItems = editConfig.items.filter((_, i) => i !== index);
    setEditConfig({ ...editConfig, items: updatedItems });
  };

  const getResponsiveColumns = () => {
    if (previewMode === "mobile") return 1;
    if (previewMode === "tablet") return Math.min(normalizedConfig.columns, 2);
    return normalizedConfig.columns;
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case "green":
        return {
          bg: "bg-green-100 dark:bg-green-900",
          text: "text-green-600 dark:text-green-400",
          border: "border-green-200 dark:border-green-700",
        };
      case "purple":
        return {
          bg: "bg-purple-100 dark:bg-purple-900",
          text: "text-purple-600 dark:text-purple-400",
          border: "border-purple-200 dark:border-purple-700",
        };
      case "orange":
        return {
          bg: "bg-orange-100 dark:bg-orange-900",
          text: "text-orange-600 dark:text-orange-400",
          border: "border-orange-200 dark:border-orange-700",
        };
      case "red":
        return {
          bg: "bg-red-100 dark:bg-red-900",
          text: "text-red-600 dark:text-red-400",
          border: "border-red-200 dark:border-red-700",
        };
      default:
        return {
          bg: "bg-blue-100 dark:bg-blue-900",
          text: "text-blue-600 dark:text-blue-400",
          border: "border-blue-200 dark:border-blue-700",
        };
    }
  };

  const StatItem = ({ item }: { item: StatisticItem }) => {
    const { count, ref } = useCounter(
      item.value,
      normalizedConfig.animationDuration || 2000
    );
    const IconComponent =
      iconMap[item.icon as keyof typeof iconMap] || IconTrendingUp;
    const colors = getColorClasses(item.color);

    return (
      <div ref={ref} className="text-center group">
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colors.bg} ${colors.text} mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <IconComponent className="h-6 w-6" />
        </div>
        <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {item.prefix}
          {normalizedConfig.animate ? count : item.value}
          {item.suffix}
        </div>
        <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
          {item.label}
        </div>
        {item.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {item.description}
          </p>
        )}
      </div>
    );
  };

  const renderGridLayout = () => {
    const columns = getResponsiveColumns();
    const gridColsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
    };
    const gridCols = gridColsMap[columns] || "grid-cols-1";

    return (
      <div className={`grid ${gridCols} gap-8`}>
        {normalizedConfig.items.map((item) => (
          <StatItem key={item.id} item={item} />
        ))}
      </div>
    );
  };

  const renderCardsLayout = () => {
    const columns = getResponsiveColumns();
    const gridColsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
    };
    const gridCols = gridColsMap[columns] || "grid-cols-1";

    return (
      <div className={`grid ${gridCols} gap-6`}>
        {normalizedConfig.items.map((item) => {
          const colors = getColorClasses(item.color);
          return (
            <Card
              key={item.id}
              className={`p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 ${colors.border}`}
            >
              <CardContent className="p-0">
                <StatItem item={item} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderHorizontalLayout = () => {
    return (
      <div className="flex flex-col md:flex-row justify-center items-center divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
        {normalizedConfig.items.map((item, index) => (
          <div
            key={item.id}
            className={`px-8 py-6 ${index === 0 ? "md:pl-0" : ""} ${
              index === normalizedConfig.items.length - 1 ? "md:pr-0" : ""
            }`}
          >
            <StatItem item={item} />
          </div>
        ))}
      </div>
    );
  };

  if (editable && isEditing) {
    return (
      <div className="border-2 border-dashed border-primary p-6 rounded-lg bg-blue-50/50 dark:bg-blue-950/50">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit Statistics</h3>
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
                  placeholder="Statistics title"
                />
              </div>

              <div>
                <Label htmlFor="layout">Layout</Label>
                <Select
                  value={editConfig.layout}
                  onValueChange={(value: "grid" | "horizontal" | "cards") =>
                    setEditConfig({ ...editConfig, layout: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="cards">Cards</SelectItem>
                    <SelectItem value="horizontal">Horizontal</SelectItem>
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

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editConfig.animate || false}
                    onChange={(e) =>
                      setEditConfig({
                        ...editConfig,
                        animate: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Animate counters</span>
                </label>
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
                placeholder="Statistics subtitle"
                rows={2}
              />
            </div>
          </div>

          {/* Statistics Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Statistics Items</Label>
              <Button onClick={handleItemAdd} size="sm" variant="outline">
                <IconPlus className="h-4 w-4 mr-2" />
                Add Statistic
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {editConfig.items.map((item, index) => (
                <Card key={item.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Stat {index + 1}
                      </span>
                      <Button
                        onClick={() => handleItemRemove(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={item.label}
                          onChange={(e) =>
                            handleItemUpdate(index, "label", e.target.value)
                          }
                          placeholder="Statistic label"
                        />
                      </div>
                      <div>
                        <Label>Value</Label>
                        <Input
                          type="number"
                          value={item.value}
                          onChange={(e) =>
                            handleItemUpdate(
                              index,
                              "value",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="100"
                        />
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <Select
                          value={item.icon || "trending-up"}
                          onValueChange={(value) =>
                            handleItemUpdate(index, "icon", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="trending-up">
                              Trending Up
                            </SelectItem>
                            <SelectItem value="users">Users</SelectItem>
                            <SelectItem value="building">Building</SelectItem>
                            <SelectItem value="award">Award</SelectItem>
                            <SelectItem value="target">Target</SelectItem>
                            <SelectItem value="chart-pie">Chart</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label>Prefix</Label>
                        <Input
                          value={item.prefix || ""}
                          onChange={(e) =>
                            handleItemUpdate(index, "prefix", e.target.value)
                          }
                          placeholder="$"
                        />
                      </div>
                      <div>
                        <Label>Suffix</Label>
                        <Input
                          value={item.suffix || ""}
                          onChange={(e) =>
                            handleItemUpdate(index, "suffix", e.target.value)
                          }
                          placeholder="+"
                        />
                      </div>
                      <div>
                        <Label>Color</Label>
                        <Select
                          value={item.color || "blue"}
                          onValueChange={(
                            value:
                              | "blue"
                              | "green"
                              | "purple"
                              | "orange"
                              | "red"
                          ) => handleItemUpdate(index, "color", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="purple">Purple</SelectItem>
                            <SelectItem value="orange">Orange</SelectItem>
                            <SelectItem value="red">Red</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Input
                        value={item.description || ""}
                        onChange={(e) =>
                          handleItemUpdate(index, "description", e.target.value)
                        }
                        placeholder="Optional description"
                      />
                    </div>
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
    <section
      className={`py-16 px-4 ${normalizedConfig.className || ""}`}
      style={{ backgroundColor: normalizedConfig.backgroundColor }}
    >
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

        {/* Statistics Content */}
        {normalizedConfig.layout === "horizontal" && renderHorizontalLayout()}
        {normalizedConfig.layout === "cards" && renderCardsLayout()}
        {normalizedConfig.layout === "grid" && renderGridLayout()}

        {/* Edit Button */}
        {editable && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Statistics
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
