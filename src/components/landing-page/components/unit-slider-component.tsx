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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  IconSettings,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconTrash,
  IconBed,
  IconBath,
  IconRuler,
} from "@tabler/icons-react";
import { FileUploader } from "@/components/file-uploader";

interface UnitType {
  name: string;
  type: string;
  image: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  description: string;
  features: string[];
}

interface UnitSliderComponentProps {
  id: string;
  config: {
    title: string;
    subtitle?: string;
    units: UnitType[];
    autoPlay: boolean;
    autoPlaySpeed: number;
    showPriceLabel: boolean;
    priceLabel: string;
    showNavigationDots: boolean;
    showNavigationArrows: boolean;
    backgroundColor?: string;
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function UnitSliderComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: UnitSliderComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState(config);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sync editConfig with prop changes
  useEffect(() => {
    console.log(`[UnitSlider ${id}] Config updated:`, config);
    setEditConfig(config);
  }, [config, id]);

  const handleSave = () => {
    // Ensure all images are properly saved
    const configToSave = {
      ...editConfig,
      units: editConfig.units.map((unit) => ({
        ...unit,
        image: unit.image || "", // Ensure image field is never undefined
      })),
    };
    console.log(`[UnitSlider ${id}] Saving config:`, configToSave);
    onUpdate?.(configToSave);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditConfig(config);
    setIsEditing(false);
  };

  const addUnit = () => {
    setEditConfig({
      ...editConfig,
      units: [
        ...editConfig.units,
        {
          name: "",
          type: "",
          image: "",
          price: "",
          bedrooms: 2,
          bathrooms: 1,
          area: "",
          description: "",
          features: [],
        },
      ],
    });
  };

  const updateUnit = (index: number, field: keyof UnitType, value: any) => {
    setEditConfig((prevConfig) => {
      const newUnits = [...prevConfig.units];
      newUnits[index] = { ...newUnits[index], [field]: value };
      return { ...prevConfig, units: newUnits };
    });
  };

  const removeUnit = (index: number) => {
    const newUnits = [...editConfig.units];
    newUnits.splice(index, 1);
    setEditConfig({ ...editConfig, units: newUnits });
  };

  const addFeature = (unitIndex: number) => {
    const newUnits = [...editConfig.units];
    newUnits[unitIndex].features.push("");
    setEditConfig({ ...editConfig, units: newUnits });
  };

  const updateFeature = (
    unitIndex: number,
    featureIndex: number,
    value: string
  ) => {
    const newUnits = [...editConfig.units];
    newUnits[unitIndex].features[featureIndex] = value;
    setEditConfig({ ...editConfig, units: newUnits });
  };

  const removeFeature = (unitIndex: number, featureIndex: number) => {
    const newUnits = [...editConfig.units];
    newUnits[unitIndex].features.splice(featureIndex, 1);
    setEditConfig({ ...editConfig, units: newUnits });
  };

  const getItemsPerSlide = () => {
    // This will be handled by CSS grid responsive classes instead
    return config.units.length;
  };

  const getTotalSlides = () => {
    const itemsPerSlide = getItemsPerSlide();
    return Math.ceil(config.units.length / itemsPerSlide);
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
    if (config.autoPlay && config.units.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, config.autoPlaySpeed * 1000);

      return () => clearInterval(interval);
    }
  }, [
    config.autoPlay,
    config.autoPlaySpeed,
    currentSlide,
    config.units.length,
  ]);

  const getCurrentUnits = () => {
    const itemsPerSlide = getItemsPerSlide();
    const startIndex = currentSlide * itemsPerSlide;
    return config.units.slice(startIndex, startIndex + itemsPerSlide);
  };

  const formatPrice = (price: string) => {
    // Simple price formatting
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto mx-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle>Edit Unit Slider</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 sm:space-y-6">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Settings</h3>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editConfig.title || ""}
                      onChange={(e) =>
                        setEditConfig({ ...editConfig, title: e.target.value })
                      }
                      placeholder="Unit Types"
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
                      placeholder="Choose your perfect home"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="price-label">Price Label</Label>
                    <Input
                      id="price-label"
                      value={editConfig.priceLabel || ""}
                      onChange={(e) =>
                        setEditConfig({
                          ...editConfig,
                          priceLabel: e.target.value,
                        })
                      }
                      placeholder="Starting from"
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

                {/* Slider Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Slider Settings</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        value={editConfig.autoPlaySpeed || 3}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            autoPlaySpeed: parseInt(e.target.value) || 3,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-price-label"
                        checked={editConfig.showPriceLabel}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showPriceLabel: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-price-label">Show Price Label</Label>
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

                {/* Units */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Unit Types</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addUnit}
                    >
                      <IconPlus className="h-4 w-4 mr-2" />
                      Add Unit
                    </Button>
                  </div>

                  {editConfig.units.map((unit, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Unit {index + 1}</h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeUnit(index)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={unit.name || ""}
                            onChange={(e) =>
                              updateUnit(index, "name", e.target.value)
                            }
                            placeholder="Studio Apartment"
                          />
                        </div>

                        <div>
                          <Label>Type</Label>
                          <Input
                            value={unit.type || ""}
                            onChange={(e) =>
                              updateUnit(index, "type", e.target.value)
                            }
                            placeholder="Studio"
                          />
                        </div>

                        <div>
                          <Label>Price</Label>
                          <Input
                            value={unit.price || ""}
                            onChange={(e) =>
                              updateUnit(index, "price", e.target.value)
                            }
                            placeholder="1,200,000,000"
                          />
                        </div>

                        <div>
                          <Label>Area</Label>
                          <Input
                            value={unit.area || ""}
                            onChange={(e) =>
                              updateUnit(index, "area", e.target.value)
                            }
                            placeholder="45 m²"
                          />
                        </div>

                        <div>
                          <Label>Bedrooms</Label>
                          <Input
                            type="number"
                            min="0"
                            value={unit.bedrooms || 0}
                            onChange={(e) =>
                              updateUnit(
                                index,
                                "bedrooms",
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label>Bathrooms</Label>
                          <Input
                            type="number"
                            min="0"
                            value={unit.bathrooms || 0}
                            onChange={(e) =>
                              updateUnit(
                                index,
                                "bathrooms",
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Unit Image</Label>
                        <FileUploader
                          accept={{
                            "image/*": [
                              ".png",
                              ".jpg",
                              ".jpeg",
                              ".gif",
                              ".webp",
                            ],
                          }}
                          maxFiles={1}
                          maxSize={5 * 1024 * 1024}
                          onUpload={async (files: File[]) => {
                            if (files.length > 0) {
                              try {
                                // Convert file to data URL for proper serialization
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  const dataUrl = e.target?.result as string;
                                  if (dataUrl) {
                                    updateUnit(index, "image", dataUrl);
                                  }
                                };
                                reader.onerror = (error) => {
                                  console.error("Error reading file:", error);
                                };
                                reader.readAsDataURL(files[0]);
                              } catch (error) {
                                console.error("Error processing file:", error);
                              }
                            }
                          }}
                          className="w-full"
                        />
                        {unit.image && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Current: </span>
                            <span className="truncate">
                              {typeof unit.image === "string"
                                ? unit.image.split("/").pop()
                                : unit.image}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={unit.description || ""}
                          onChange={(e) =>
                            updateUnit(index, "description", e.target.value)
                          }
                          placeholder="Unit description"
                          rows={2}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Features</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addFeature(index)}
                          >
                            Add Feature
                          </Button>
                        </div>
                        {unit.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex gap-2 mb-2">
                            <Input
                              value={feature || ""}
                              onChange={(e) =>
                                updateFeature(
                                  index,
                                  featureIndex,
                                  e.target.value
                                )
                              }
                              placeholder="Feature name"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFeature(index, featureIndex)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
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

      {/* Unit Slider Content */}
      <div
        className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
        style={{ backgroundColor: config.backgroundColor }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
              {config.title}
            </h2>
            {config.subtitle && (
              <p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:border-gray-600 shadow-lg"
                  onClick={prevSlide}
                >
                  <IconChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:border-gray-600 shadow-lg"
                  onClick={nextSlide}
                >
                  <IconChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                </Button>
              </>
            )}

            {/* Units Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {getCurrentUnits().map((unit, index) => (
                <div
                  key={`${currentSlide}-${index}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
                >
                  {/* Unit Image */}
                  {unit.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={unit.image}
                        alt={unit.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Unit Info */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold leading-tight text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                        {unit.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {unit.type}
                      </p>
                    </div>

                    {/* Unit Specs */}
                    <div className="flex items-center flex-wrap gap-3 sm:gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <IconBed className="h-4 w-4" />
                        <span>{unit.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconBath className="h-4 w-4" />
                        <span>{unit.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconRuler className="h-4 w-4" />
                        <span>{unit.area}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {unit.description && (
                      <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {unit.description}
                      </p>
                    )}

                    {/* Features */}
                    {unit.features.length > 0 && (
                      <div className="mb-4 flex-1">
                        <div className="flex flex-wrap gap-2">
                          {unit.features
                            .slice(0, 3)
                            .map((feature, featureIndex) => (
                              <span
                                key={featureIndex}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          {unit.features.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                              +{unit.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
                      {config.showPriceLabel && (
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                          {config.priceLabel}
                        </p>
                      )}
                      <p className="text-xl sm:text-2xl font-bold leading-tight text-blue-600 dark:text-blue-400 tracking-tight">
                        Rp {formatPrice(unit.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            {config.showNavigationDots && getTotalSlides() > 1 && (
              <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
                {Array.from({ length: getTotalSlides() }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide
                        ? "bg-blue-600"
                        : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                    }`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {config.units.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No unit types added yet
              </p>
              {editable && (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Click the settings button to add unit types
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
