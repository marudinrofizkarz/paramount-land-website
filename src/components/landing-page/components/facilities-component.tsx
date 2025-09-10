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
import { FileUploader } from "@/components/file-uploader";
import {
  IconSettings,
  IconSwimming,
  IconCar,
  IconBuildingStore,
  IconTrees,
  IconUsers,
  IconShieldCheck,
  IconWifi,
  IconCamera,
  IconBarbell,
  IconPool,
  IconHome,
  IconPlus,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";

interface Facility {
  name: string;
  description: string;
  icon: string;
  image?: string;
}

interface FacilitiesComponentProps {
  id: string;
  config: {
    title: string;
    subtitle?: string;
    facilities: Facility[];
    layout: "grid" | "list" | "cards";
    columns: number;
    showIcons: boolean;
    showImages: boolean;
    backgroundColor?: string;
    cardStyle: "flat" | "shadow" | "border";
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

const facilityIcons = {
  swimming: IconSwimming,
  parking: IconCar,
  shopping: IconBuildingStore,
  garden: IconTrees,
  playground: IconUsers,
  security: IconShieldCheck,
  wifi: IconWifi,
  cctv: IconCamera,
  gym: IconBarbell,
  pool: IconPool,
  clubhouse: IconHome,
};

export function FacilitiesComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: FacilitiesComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState(config);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleSave = () => {
    onUpdate?.(editConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditConfig(config);
    setIsEditing(false);
  };

  const addFacility = () => {
    setEditConfig({
      ...editConfig,
      facilities: [
        ...editConfig.facilities,
        { name: "", description: "", icon: "swimming", image: "" },
      ],
    });
  };

  const updateFacility = (
    index: number,
    field: keyof Facility,
    value: string
  ) => {
    const newFacilities = [...editConfig.facilities];
    newFacilities[index] = { ...newFacilities[index], [field]: value };
    setEditConfig({ ...editConfig, facilities: newFacilities });
  };

  const removeFacility = (index: number) => {
    const newFacilities = [...editConfig.facilities];
    newFacilities.splice(index, 1);
    setEditConfig({ ...editConfig, facilities: newFacilities });
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
        updateFacility(index, "image", dataUrl);
        setUploadingIndex(null);
      };
      reader.readAsDataURL(files[0]);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadingIndex(null);
    }
  };

  const getResponsiveClasses = () => {
    // Always use responsive classes instead of previewMode
    return "px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16";
  };

  const getGridColumns = () => {
    // Use proper responsive grid classes based on config.columns
    const columns = Math.min(config.columns, 4);
    if (columns === 2) {
      return "grid-cols-1 sm:grid-cols-2";
    } else if (columns === 3) {
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    } else if (columns === 4) {
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  };

  const renderIcon = (iconName: string) => {
    const IconComponent =
      facilityIcons[iconName as keyof typeof facilityIcons] || IconHome;
    return (
      <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
    );
  };

  const getCardClasses = () => {
    const base =
      "bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 transition-all duration-300 min-h-[200px] sm:min-h-[220px] flex flex-col";

    switch (config.cardStyle) {
      case "shadow":
        return `${base} shadow-lg hover:shadow-xl dark:hover:shadow-gray-900/25`;
      case "border":
        return `${base} border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400`;
      default:
        return `${base} hover:bg-gray-50 dark:hover:bg-gray-700`;
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
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 mx-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-gray-100">
                  Edit Facilities
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 sm:space-y-6">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Basic Settings
                  </h3>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editConfig.title}
                      onChange={(e) =>
                        setEditConfig({ ...editConfig, title: e.target.value })
                      }
                      placeholder="Facilities & Amenities"
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
                      placeholder="Discover world-class facilities"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Layout Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Layout Settings
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="layout">Layout</Label>
                      <Select
                        value={editConfig.layout}
                        onValueChange={(value) =>
                          setEditConfig({
                            ...editConfig,
                            layout: value as "grid" | "list" | "cards",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid</SelectItem>
                          <SelectItem value="list">List</SelectItem>
                          <SelectItem value="cards">Cards</SelectItem>
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
                            columns: parseInt(value),
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
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="card-style">Card Style</Label>
                      <Select
                        value={editConfig.cardStyle}
                        onValueChange={(value) =>
                          setEditConfig({
                            ...editConfig,
                            cardStyle: value as "flat" | "shadow" | "border",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flat">Flat</SelectItem>
                          <SelectItem value="shadow">Shadow</SelectItem>
                          <SelectItem value="border">Border</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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

                {/* Facilities */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Facilities
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFacility}
                    >
                      <IconPlus className="h-4 w-4 mr-2" />
                      Add Facility
                    </Button>
                  </div>

                  {editConfig.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          Facility {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFacility(index)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={facility.name}
                            onChange={(e) =>
                              updateFacility(index, "name", e.target.value)
                            }
                            placeholder="Swimming Pool"
                          />
                        </div>

                        <div>
                          <Label>Icon</Label>
                          <Select
                            value={facility.icon}
                            onValueChange={(value) =>
                              updateFacility(index, "icon", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="swimming">
                                Swimming Pool
                              </SelectItem>
                              <SelectItem value="parking">Parking</SelectItem>
                              <SelectItem value="shopping">
                                Shopping Center
                              </SelectItem>
                              <SelectItem value="garden">Garden</SelectItem>
                              <SelectItem value="playground">
                                Playground
                              </SelectItem>
                              <SelectItem value="security">Security</SelectItem>
                              <SelectItem value="wifi">WiFi</SelectItem>
                              <SelectItem value="cctv">CCTV</SelectItem>
                              <SelectItem value="gym">Gym</SelectItem>
                              <SelectItem value="pool">Pool</SelectItem>
                              <SelectItem value="clubhouse">
                                Clubhouse
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={facility.description}
                          onChange={(e) =>
                            updateFacility(index, "description", e.target.value)
                          }
                          placeholder="Facility description"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label>Facility Image (Optional)</Label>
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
                          {facility.image && (
                            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                              <img
                                src={facility.image}
                                alt={facility.name}
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
                                  updateFacility(index, "image", "")
                                }
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
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

      {/* Facilities Content */}
      <div
        className={`px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 ${
          config.backgroundColor ? "" : "bg-white dark:bg-gray-900"
        }`}
        style={{
          backgroundColor: config.backgroundColor || undefined,
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
              {config.title}
            </h2>
            {config.subtitle && (
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
                {config.subtitle}
              </p>
            )}
          </div>

          {/* Facilities Grid */}
          {config.layout === "list" ? (
            <div className="space-y-4 sm:space-y-6">
              {config.facilities.map((facility, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
                >
                  {config.showIcons && (
                    <div className="flex-shrink-0 self-center sm:self-start">
                      {renderIcon(facility.icon)}
                    </div>
                  )}
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {facility.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-3">
                      {facility.description}
                    </p>
                  </div>
                  {facility.image && config.showImages && (
                    <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:block">
                      <img
                        src={facility.image}
                        alt={facility.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-4 sm:gap-6 ${getGridColumns()}`}>
              {config.facilities.map((facility, index) => (
                <div key={index} className={getCardClasses()}>
                  {facility.image && config.showImages ? (
                    <div className="mb-3 sm:mb-4 flex-grow">
                      <img
                        src={facility.image}
                        alt={facility.name}
                        className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    config.showIcons && (
                      <div className="flex justify-center mb-3 sm:mb-4 flex-grow items-center">
                        {renderIcon(facility.icon)}
                      </div>
                    )
                  )}

                  <div className="text-center mt-auto">
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                      {facility.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-3">
                      {facility.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {config.facilities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No facilities added yet
              </p>
              {editable && (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Click the settings button to add facilities
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
