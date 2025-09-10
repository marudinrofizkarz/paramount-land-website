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
import {
  IconSettings,
  IconMapPin,
  IconCar,
  IconPlane,
  IconTrain,
  IconBus,
  IconBuildingStore,
  IconSchool,
  IconHospital,
  IconPlus,
  IconTrash,
  IconClock,
  IconRoute,
} from "@tabler/icons-react";

interface AccessPoint {
  name: string;
  type: "car" | "public_transport" | "walking" | "airport" | "train" | "bus";
  distance: string;
  time: string;
  description?: string;
  icon: string;
}

interface NearbyLocation {
  name: string;
  type:
    | "shopping"
    | "school"
    | "hospital"
    | "restaurant"
    | "office"
    | "recreation";
  distance: string;
  description?: string;
  icon: string;
}

interface LocationAccessComponentProps {
  id: string;
  config: {
    title: string;
    subtitle?: string;
    address: string;
    mapUrl?: string;
    showMap: boolean;
    accessPoints: AccessPoint[];
    nearbyLocations: NearbyLocation[];
    backgroundColor?: string;
    showAccessPoints: boolean;
    showNearbyLocations: boolean;
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

const transportIcons = {
  car: IconCar,
  public_transport: IconBus,
  walking: IconRoute,
  airport: IconPlane,
  train: IconTrain,
  bus: IconBus,
};

const locationIcons = {
  shopping: IconBuildingStore,
  school: IconSchool,
  hospital: IconHospital,
  restaurant: IconBuildingStore,
  office: IconBuildingStore,
  recreation: IconMapPin,
};

export function LocationAccessComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: LocationAccessComponentProps) {
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

  const addAccessPoint = () => {
    setEditConfig({
      ...editConfig,
      accessPoints: [
        ...editConfig.accessPoints,
        {
          name: "",
          type: "car",
          distance: "",
          time: "",
          description: "",
          icon: "car",
        },
      ],
    });
  };

  const updateAccessPoint = (
    index: number,
    field: keyof AccessPoint,
    value: any
  ) => {
    const newAccessPoints = [...editConfig.accessPoints];
    newAccessPoints[index] = { ...newAccessPoints[index], [field]: value };
    setEditConfig({ ...editConfig, accessPoints: newAccessPoints });
  };

  const removeAccessPoint = (index: number) => {
    const newAccessPoints = [...editConfig.accessPoints];
    newAccessPoints.splice(index, 1);
    setEditConfig({ ...editConfig, accessPoints: newAccessPoints });
  };

  const addNearbyLocation = () => {
    setEditConfig({
      ...editConfig,
      nearbyLocations: [
        ...editConfig.nearbyLocations,
        {
          name: "",
          type: "shopping",
          distance: "",
          description: "",
          icon: "shopping",
        },
      ],
    });
  };

  const updateNearbyLocation = (
    index: number,
    field: keyof NearbyLocation,
    value: any
  ) => {
    const newLocations = [...editConfig.nearbyLocations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setEditConfig({ ...editConfig, nearbyLocations: newLocations });
  };

  const removeNearbyLocation = (index: number) => {
    const newLocations = [...editConfig.nearbyLocations];
    newLocations.splice(index, 1);
    setEditConfig({ ...editConfig, nearbyLocations: newLocations });
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
    switch (previewMode) {
      case "mobile":
        return "grid-cols-1";
      case "tablet":
        return "grid-cols-2";
      default:
        return "grid-cols-3";
    }
  };

  const renderTransportIcon = (iconName: string) => {
    const IconComponent =
      transportIcons[iconName as keyof typeof transportIcons] || IconCar;
    return (
      <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
    );
  };

  const renderLocationIcon = (iconName: string) => {
    const IconComponent =
      locationIcons[iconName as keyof typeof locationIcons] || IconMapPin;
    return (
      <IconComponent className="h-6 w-6 text-green-600 dark:text-green-400" />
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
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Location Access</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editConfig.title}
                      onChange={(e) =>
                        setEditConfig({ ...editConfig, title: e.target.value })
                      }
                      placeholder="Location & Access"
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
                      placeholder="Strategic location with easy access"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={editConfig.address}
                      onChange={(e) =>
                        setEditConfig({
                          ...editConfig,
                          address: e.target.value,
                        })
                      }
                      placeholder="Property address"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="map-url">Google Maps URL (Optional)</Label>
                    <Input
                      id="map-url"
                      value={editConfig.mapUrl || ""}
                      onChange={(e) =>
                        setEditConfig({ ...editConfig, mapUrl: e.target.value })
                      }
                      placeholder="https://maps.google.com/..."
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

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-map"
                        checked={editConfig.showMap}
                        onCheckedChange={(checked) =>
                          setEditConfig({ ...editConfig, showMap: !!checked })
                        }
                      />
                      <Label htmlFor="show-map">Show Map</Label>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-access"
                        checked={editConfig.showAccessPoints}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showAccessPoints: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-access">Show Access Points</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-nearby"
                        checked={editConfig.showNearbyLocations}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showNearbyLocations: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-nearby">Show Nearby Locations</Label>
                    </div>
                  </div>
                </div>

                {/* Access Points */}
                {editConfig.showAccessPoints && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Access Points</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addAccessPoint}
                      >
                        <IconPlus className="h-4 w-4 mr-2" />
                        Add Access Point
                      </Button>
                    </div>

                    {editConfig.accessPoints.map((point, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            Access Point {index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeAccessPoint(index)}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={point.name}
                              onChange={(e) =>
                                updateAccessPoint(index, "name", e.target.value)
                              }
                              placeholder="Soekarno-Hatta Airport"
                            />
                          </div>

                          <div>
                            <Label>Type</Label>
                            <Select
                              value={point.type}
                              onValueChange={(value) => {
                                updateAccessPoint(index, "type", value);
                                updateAccessPoint(index, "icon", value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="car">Car</SelectItem>
                                <SelectItem value="public_transport">
                                  Public Transport
                                </SelectItem>
                                <SelectItem value="walking">Walking</SelectItem>
                                <SelectItem value="airport">Airport</SelectItem>
                                <SelectItem value="train">Train</SelectItem>
                                <SelectItem value="bus">Bus</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Distance</Label>
                            <Input
                              value={point.distance}
                              onChange={(e) =>
                                updateAccessPoint(
                                  index,
                                  "distance",
                                  e.target.value
                                )
                              }
                              placeholder="15 km"
                            />
                          </div>

                          <div>
                            <Label>Travel Time</Label>
                            <Input
                              value={point.time}
                              onChange={(e) =>
                                updateAccessPoint(index, "time", e.target.value)
                              }
                              placeholder="25 minutes"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Description (Optional)</Label>
                          <Textarea
                            value={point.description || ""}
                            onChange={(e) =>
                              updateAccessPoint(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Additional information"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Nearby Locations */}
                {editConfig.showNearbyLocations && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Nearby Locations
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addNearbyLocation}
                      >
                        <IconPlus className="h-4 w-4 mr-2" />
                        Add Location
                      </Button>
                    </div>

                    {editConfig.nearbyLocations.map((location, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Location {index + 1}</h4>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeNearbyLocation(index)}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={location.name}
                              onChange={(e) =>
                                updateNearbyLocation(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="Grand Indonesia Mall"
                            />
                          </div>

                          <div>
                            <Label>Type</Label>
                            <Select
                              value={location.type}
                              onValueChange={(value) => {
                                updateNearbyLocation(index, "type", value);
                                updateNearbyLocation(index, "icon", value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="shopping">
                                  Shopping
                                </SelectItem>
                                <SelectItem value="school">School</SelectItem>
                                <SelectItem value="hospital">
                                  Hospital
                                </SelectItem>
                                <SelectItem value="restaurant">
                                  Restaurant
                                </SelectItem>
                                <SelectItem value="office">Office</SelectItem>
                                <SelectItem value="recreation">
                                  Recreation
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Distance</Label>
                            <Input
                              value={location.distance}
                              onChange={(e) =>
                                updateNearbyLocation(
                                  index,
                                  "distance",
                                  e.target.value
                                )
                              }
                              placeholder="500 m"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Description (Optional)</Label>
                          <Textarea
                            value={location.description || ""}
                            onChange={(e) =>
                              updateNearbyLocation(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Additional information"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

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

      {/* Location Access Content */}
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
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                {config.subtitle}
              </p>
            )}

            {/* Address */}
            <div className="flex items-start justify-center gap-2 text-gray-600 dark:text-gray-300">
              <IconMapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-left">{config.address}</p>
            </div>

            {/* Map Link */}
            {config.mapUrl && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => window.open(config.mapUrl, "_blank")}
                >
                  <IconMapPin className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
              </div>
            )}
          </div>

          {/* Content Grid */}
          <div
            className={`grid gap-8 ${
              previewMode === "mobile"
                ? "grid-cols-1"
                : "grid-cols-1 lg:grid-cols-2"
            }`}
          >
            {/* Access Points */}
            {config.showAccessPoints && config.accessPoints.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Transportation Access
                </h3>
                <div className="space-y-4">
                  {config.accessPoints.map((point, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {renderTransportIcon(point.icon)}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {point.name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                            <div className="flex items-center gap-1">
                              <IconRoute className="h-4 w-4" />
                              <span>{point.distance}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <IconClock className="h-4 w-4" />
                              <span>{point.time}</span>
                            </div>
                          </div>
                          {point.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {point.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Locations */}
            {config.showNearbyLocations &&
              config.nearbyLocations.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                    Nearby Locations
                  </h3>
                  <div className="space-y-4">
                    {config.nearbyLocations.map((location, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {renderLocationIcon(location.icon)}
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {location.name}
                            </h4>
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 mb-2">
                              <IconRoute className="h-4 w-4" />
                              <span>{location.distance}</span>
                            </div>
                            {location.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {location.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Empty State */}
          {(!config.showAccessPoints || config.accessPoints.length === 0) &&
            (!config.showNearbyLocations ||
              config.nearbyLocations.length === 0) && (
              <div className="text-center py-12">
                <IconMapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No location information added yet
                </p>
                {editable && (
                  <p className="text-sm text-gray-400 mt-2">
                    Click the settings button to add access points and nearby
                    locations
                  </p>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
