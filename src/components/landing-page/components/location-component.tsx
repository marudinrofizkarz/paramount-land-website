"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconEdit,
  IconMapPin,
  IconPhone,
  IconMail,
  IconClock,
  IconExternalLink,
  IconMap2,
  IconNavigation,
} from "@tabler/icons-react";

interface LocationInfo {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  hours?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface LocationConfig {
  title?: string;
  subtitle?: string;
  showMap?: boolean;
  mapType: "openstreetmap" | "google" | "embed";
  mapUrl?: string;
  embedCode?: string;
  locations: LocationInfo[];
  showContactInfo?: boolean;
  mapHeight?: number;
  className?: string;
}

interface LocationComponentProps {
  id: string;
  config: LocationConfig;
  onUpdate?: (config: LocationConfig) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function LocationComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: LocationComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState<LocationConfig>(config);

  useEffect(() => {
    setEditConfig(config);
  }, [config]);

  const handleSave = () => {
    onUpdate?.(editConfig);
    setIsEditing(false);
  };

  const handleLocationAdd = () => {
    const newLocation: LocationInfo = {
      id: `location-${Date.now()}`,
      name: "New Location",
      address: "Address here",
      phone: "",
      email: "",
      hours: "",
      coordinates: {
        lat: -6.2088,
        lng: 106.8456,
      },
    };
    setEditConfig({
      ...editConfig,
      locations: [...editConfig.locations, newLocation],
    });
  };

  const handleLocationUpdate = (
    index: number,
    field: keyof LocationInfo,
    value: any
  ) => {
    const updatedLocations = editConfig.locations.map((location, i) =>
      i === index ? { ...location, [field]: value } : location
    );
    setEditConfig({ ...editConfig, locations: updatedLocations });
  };

  const handleLocationRemove = (index: number) => {
    const updatedLocations = editConfig.locations.filter((_, i) => i !== index);
    setEditConfig({ ...editConfig, locations: updatedLocations });
  };

  const generateOpenStreetMapUrl = (location: LocationInfo) => {
    if (!location.coordinates) return "#";
    const { lat, lng } = location.coordinates;
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15#map=15/${lat}/${lng}`;
  };

  const generateGoogleMapsUrl = (location: LocationInfo) => {
    if (location.coordinates) {
      const { lat, lng } = location.coordinates;
      return `https://www.google.com/maps?q=${lat},${lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location.address
    )}`;
  };

  const getDirectionsUrl = (location: LocationInfo) => {
    if (location.coordinates) {
      const { lat, lng } = location.coordinates;
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      location.address
    )}`;
  };

  const renderMap = () => {
    if (!config.showMap) return null;

    const mapHeight = config.mapHeight || 400;

    if (config.mapType === "embed" && config.embedCode) {
      return (
        <div
          className="w-full rounded-lg overflow-hidden"
          style={{ height: `${mapHeight}px` }}
          dangerouslySetInnerHTML={{ __html: config.embedCode }}
        />
      );
    }

    if (config.mapUrl) {
      return (
        <div
          className="w-full rounded-lg overflow-hidden"
          style={{ height: `${mapHeight}px` }}
        >
          <iframe
            src={config.mapUrl}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      );
    }

    // Default OpenStreetMap embed for first location
    if (config.locations.length > 0 && config.locations[0].coordinates) {
      const { lat, lng } = config.locations[0].coordinates;
      const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
        lng - 0.01
      },${lat - 0.01},${lng + 0.01},${
        lat + 0.01
      }&layer=mapnik&marker=${lat},${lng}`;

      return (
        <div
          className="w-full rounded-lg overflow-hidden"
          style={{ height: `${mapHeight}px` }}
        >
          <iframe
            src={osmEmbedUrl}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <div
        className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
        style={{ height: `${mapHeight}px` }}
      >
        <div className="text-center">
          <IconMap2 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">Map not configured</p>
        </div>
      </div>
    );
  };

  const renderLocationCards = () => {
    return (
      <div
        className={`grid gap-6 ${
          config.locations.length === 1
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {config.locations.map((location, index) => (
          <Card key={location.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {location.name}
                  </h3>
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <IconMapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span className="text-sm">{location.address}</span>
                  </div>
                </div>
              </div>

              {config.showContactInfo && (
                <div className="space-y-3 mb-4">
                  {location.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <IconPhone className="h-4 w-4 text-gray-400" />
                      <a
                        href={`tel:${location.phone}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        {location.phone}
                      </a>
                    </div>
                  )}

                  {location.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <IconMail className="h-4 w-4 text-gray-400" />
                      <a
                        href={`mailto:${location.email}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        {location.email}
                      </a>
                    </div>
                  )}

                  {location.hours && (
                    <div className="flex items-center gap-2 text-sm">
                      <IconClock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {location.hours}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    window.open(generateGoogleMapsUrl(location), "_blank")
                  }
                >
                  <IconMap2 className="h-4 w-4 mr-2" />
                  View Map
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    window.open(getDirectionsUrl(location), "_blank")
                  }
                >
                  <IconNavigation className="h-4 w-4 mr-2" />
                  Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (editable && isEditing) {
    return (
      <div className="border-2 border-dashed border-primary p-6 rounded-lg bg-blue-50/50 dark:bg-blue-950/50">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit Location</h3>
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
                  placeholder="Location title"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editConfig.showMap || false}
                    onChange={(e) =>
                      setEditConfig({
                        ...editConfig,
                        showMap: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Show Map</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editConfig.showContactInfo !== false}
                    onChange={(e) =>
                      setEditConfig({
                        ...editConfig,
                        showContactInfo: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Show Contact Info</span>
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
                placeholder="Location subtitle"
                rows={2}
              />
            </div>

            {editConfig.showMap && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Map Type</Label>
                    <select
                      value={editConfig.mapType}
                      onChange={(e) =>
                        setEditConfig({
                          ...editConfig,
                          mapType: e.target.value as
                            | "openstreetmap"
                            | "google"
                            | "embed",
                        })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="openstreetmap">OpenStreetMap</option>
                      <option value="google">Google Maps</option>
                      <option value="embed">Custom Embed</option>
                    </select>
                  </div>

                  <div>
                    <Label>Map Height (px)</Label>
                    <Input
                      type="number"
                      value={editConfig.mapHeight || 400}
                      onChange={(e) =>
                        setEditConfig({
                          ...editConfig,
                          mapHeight: parseInt(e.target.value) || 400,
                        })
                      }
                      placeholder="400"
                    />
                  </div>
                </div>

                {editConfig.mapType === "embed" ? (
                  <div>
                    <Label>Embed Code</Label>
                    <Textarea
                      value={editConfig.embedCode || ""}
                      onChange={(e) =>
                        setEditConfig({
                          ...editConfig,
                          embedCode: e.target.value,
                        })
                      }
                      placeholder="<iframe src='...' ...></iframe>"
                      rows={3}
                    />
                  </div>
                ) : (
                  editConfig.mapType === "google" && (
                    <div>
                      <Label>Google Maps URL</Label>
                      <Input
                        value={editConfig.mapUrl || ""}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            mapUrl: e.target.value,
                          })
                        }
                        placeholder="https://www.google.com/maps/embed?pb=..."
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Locations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Locations</Label>
              <Button onClick={handleLocationAdd} size="sm" variant="outline">
                <IconMapPin className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {editConfig.locations.map((location, index) => (
                <Card key={location.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Location {index + 1}
                      </span>
                      <Button
                        onClick={() => handleLocationRemove(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <IconMapPin className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={location.name}
                          onChange={(e) =>
                            handleLocationUpdate(index, "name", e.target.value)
                          }
                          placeholder="Location name"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={location.phone || ""}
                          onChange={(e) =>
                            handleLocationUpdate(index, "phone", e.target.value)
                          }
                          placeholder="+62 xxx xxx xxx"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Address</Label>
                      <Textarea
                        value={location.address}
                        onChange={(e) =>
                          handleLocationUpdate(index, "address", e.target.value)
                        }
                        placeholder="Full address"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={location.email || ""}
                          onChange={(e) =>
                            handleLocationUpdate(index, "email", e.target.value)
                          }
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <Label>Hours</Label>
                        <Input
                          value={location.hours || ""}
                          onChange={(e) =>
                            handleLocationUpdate(index, "hours", e.target.value)
                          }
                          placeholder="Mon-Fri 9AM-5PM"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Latitude</Label>
                        <Input
                          type="number"
                          step="any"
                          value={location.coordinates?.lat || ""}
                          onChange={(e) =>
                            handleLocationUpdate(index, "coordinates", {
                              ...location.coordinates,
                              lat: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="-6.2088"
                        />
                      </div>
                      <div>
                        <Label>Longitude</Label>
                        <Input
                          type="number"
                          step="any"
                          value={location.coordinates?.lng || ""}
                          onChange={(e) =>
                            handleLocationUpdate(index, "coordinates", {
                              ...location.coordinates,
                              lng: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="106.8456"
                        />
                      </div>
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

        {/* Map */}
        {config.showMap && <div className="mb-12">{renderMap()}</div>}

        {/* Marketing Gallery Office Info */}
        <div className="text-center">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <IconMapPin className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Marketing Gallery
              </h3>
            </div>

            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center justify-center gap-2">
                <IconMapPin className="h-4 w-4 flex-shrink-0" />
                <span>Lokasi Project - Hubungi untuk info lengkap</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <IconPhone className="h-4 w-4 flex-shrink-0" />
                <a
                  href="tel:+6282123456789"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  +62 821-2345-6789
                </a>
              </div>

              <div className="flex items-center justify-center gap-2">
                <IconClock className="h-4 w-4 flex-shrink-0" />
                <span>Senin - Minggu: 09:00 - 17:00</span>
              </div>
            </div>

            <Button
              className="mt-4 w-full"
              onClick={() => {
                if (
                  config.locations.length > 0 &&
                  config.locations[0].coordinates
                ) {
                  const { lat, lng } = config.locations[0].coordinates;
                  window.open(
                    `https://maps.google.com/?q=${lat},${lng}`,
                    "_blank"
                  );
                }
              }}
            >
              <IconNavigation className="h-4 w-4 mr-2" />
              Lihat di Maps
            </Button>
          </div>
        </div>

        {/* Edit Button */}
        {editable && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Location
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
