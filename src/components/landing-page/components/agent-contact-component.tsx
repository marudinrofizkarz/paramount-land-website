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
  IconPhone,
  IconMail,
  IconBrandWhatsapp,
  IconUser,
  IconMapPin,
  IconClock,
  IconAward,
  IconStar,
} from "@tabler/icons-react";

interface SingleAgent {
  name: string;
  title: string;
  photo?: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  description?: string;
  experience?: string;
  specialization?: string;
  office?: string;
  schedule?: string;
  rating?: number;
}

interface LegacyAgent {
  name: string;
  position?: string;
  title?: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  photo?: string;
  description?: string;
  experience?: string;
  specialization?: string;
  office?: string;
  schedule?: string;
  rating?: number;
}

interface AgentContactComponentProps {
  id: string;
  config: {
    title?: string;
    subtitle?: string;
    agent?: SingleAgent | null;
    agents?: LegacyAgent[]; // Legacy support
    layout?: "card" | "banner" | "minimal";
    showPhoto?: boolean;
    showDescription?: boolean;
    showExperience?: boolean;
    showSpecialization?: boolean;
    showOffice?: boolean;
    showSchedule?: boolean;
    showRating?: boolean;
    backgroundColor?: string;
    primaryColor?: string;
    ctaText?: string;
    ctaWhatsappText?: string;
    ctaEmailText?: string;
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function AgentContactComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: AgentContactComponentProps) {
  // Normalize single agent config with safe defaults
  const normalizeAgent = (
    agent?: SingleAgent | null | undefined
  ): SingleAgent => {
    // Handle null, undefined, or empty agent
    if (!agent || typeof agent !== "object") {
      return {
        name: "Sales Agent",
        title: "Property Consultant",
        phone: "+62 812-0000-0000",
        photo: "/sales-avatar-fallback.jpg",
        email: "sales@paramountland.co.id",
        whatsapp: "+62 812-0000-0000",
        description:
          "Professional property consultant ready to help you find your dream property.",
        experience: "3+ tahun",
        specialization: "Residential Properties",
        office: "Paramount Land Office",
        schedule: "Sen-Jum 09:00-17:00",
        rating: 5,
      };
    }

    return {
      name: agent.name || "Sales Agent",
      title: agent.title || "Property Consultant",
      phone: agent.phone || "+62 812-0000-0000",
      photo: agent.photo || "/sales-avatar-fallback.jpg",
      email: agent.email || "sales@paramountland.co.id",
      whatsapp: agent.whatsapp || "+62 812-0000-0000",
      description:
        agent.description ||
        "Professional property consultant ready to help you find your dream property.",
      experience: agent.experience || "3+ tahun",
      specialization: agent.specialization || "Residential Properties",
      office: agent.office || "Paramount Land Office",
      schedule: agent.schedule || "Sen-Jum 09:00-17:00",
      rating: agent.rating || 5,
    };
  };

  // Ensure config is valid
  const safeConfig = config || {};

  // Handle legacy config with agents array - take the first agent
  let agentToNormalize = safeConfig.agent;
  if (
    !agentToNormalize &&
    safeConfig.agents &&
    Array.isArray(safeConfig.agents) &&
    safeConfig.agents.length > 0
  ) {
    // Convert from legacy agents array format to single agent format
    const legacyAgent = safeConfig.agents[0];
    agentToNormalize = {
      name: legacyAgent.name,
      title: legacyAgent.position || legacyAgent.title || "Property Consultant",
      phone: legacyAgent.phone,
      email: legacyAgent.email,
      whatsapp: legacyAgent.whatsapp,
      photo: legacyAgent.photo,
      description: legacyAgent.description,
      experience: legacyAgent.experience,
      specialization: legacyAgent.specialization,
      office: legacyAgent.office,
      schedule: legacyAgent.schedule,
      rating: legacyAgent.rating,
    };
  }

  const normalizedConfig = {
    ...safeConfig,
    title: safeConfig.title || "Hubungi Sales Terpercaya Kami",
    subtitle:
      safeConfig.subtitle ||
      "Dapatkan konsultasi expert dari sales in-house terbaik",
    ctaText: safeConfig.ctaText || "Hubungi Sekarang",
    ctaWhatsappText: safeConfig.ctaWhatsappText || "WhatsApp",
    ctaEmailText: safeConfig.ctaEmailText || "Email",
    agent: normalizeAgent(agentToNormalize),
    layout: safeConfig.layout || "card",
    showPhoto: safeConfig.showPhoto !== undefined ? safeConfig.showPhoto : true,
    showDescription:
      safeConfig.showDescription !== undefined
        ? safeConfig.showDescription
        : true,
    showExperience:
      safeConfig.showExperience !== undefined
        ? safeConfig.showExperience
        : true,
    showSpecialization:
      safeConfig.showSpecialization !== undefined
        ? safeConfig.showSpecialization
        : true,
    showOffice:
      safeConfig.showOffice !== undefined ? safeConfig.showOffice : true,
    showSchedule:
      safeConfig.showSchedule !== undefined ? safeConfig.showSchedule : true,
    showRating:
      safeConfig.showRating !== undefined ? safeConfig.showRating : true,
    backgroundColor: safeConfig.backgroundColor || "#ffffff",
    primaryColor: safeConfig.primaryColor || "#3b82f6",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState(normalizedConfig);

  const handleSave = () => {
    onUpdate?.(editConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditConfig(normalizedConfig);
    setIsEditing(false);
  };

  const updateAgent = (field: keyof SingleAgent, value: string | number) => {
    setEditConfig({
      ...editConfig,
      agent: { ...editConfig.agent, [field]: value },
    });
  };

  const getResponsiveClasses = () => {
    if (editable) {
      // Editor mode - use previewMode specific styling
      switch (previewMode) {
        case "mobile":
          return "px-4 py-8";
        case "tablet":
          return "px-6 py-12";
        default:
          return "px-8 py-16";
      }
    } else {
      // Public view - use responsive classes for all devices
      return "px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16";
    }
  };

  const handleContactClick = (
    type: "phone" | "email" | "whatsapp",
    value: string
  ) => {
    switch (type) {
      case "phone":
        window.open(`tel:${value}`, "_self");
        break;
      case "email":
        window.open(`mailto:${value}`, "_self");
        break;
      case "whatsapp":
        const whatsappNumber = value.replace(/[^0-9]/g, "");
        const message = encodeURIComponent(
          `Halo ${normalizedConfig.agent.name}, saya tertarik untuk mendapatkan informasi lebih lanjut.`
        );
        window.open(
          `https://wa.me/${whatsappNumber}?text=${message}`,
          "_blank"
        );
        break;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <IconStar
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
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
                <DialogTitle>Edit Sales Agent Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Section Title</Label>
                      <Input
                        id="title"
                        value={editConfig.title}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            title: e.target.value,
                          })
                        }
                        placeholder="Hubungi Sales Terpercaya Kami"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cta-text">Primary CTA Text</Label>
                      <Input
                        id="cta-text"
                        value={editConfig.ctaText}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            ctaText: e.target.value,
                          })
                        }
                        placeholder="Hubungi Sekarang"
                      />
                    </div>
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
                      placeholder="Dapatkan konsultasi expert dari sales in-house terbaik"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="layout">Layout Style</Label>
                      <Select
                        value={editConfig.layout}
                        onValueChange={(value) =>
                          setEditConfig({
                            ...editConfig,
                            layout: value as "card" | "banner" | "minimal",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Card Layout</SelectItem>
                          <SelectItem value="banner">Banner Layout</SelectItem>
                          <SelectItem value="minimal">
                            Minimal Layout
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <Input
                        id="primary-color"
                        type="color"
                        value={editConfig.primaryColor || "#3b82f6"}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            primaryColor: e.target.value,
                          })
                        }
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
                </div>

                {/* Agent Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Sales Agent Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="agent-name">Name</Label>
                      <Input
                        id="agent-name"
                        value={editConfig.agent.name}
                        onChange={(e) => updateAgent("name", e.target.value)}
                        placeholder="Sarah Wijaya"
                      />
                    </div>
                    <div>
                      <Label htmlFor="agent-title">Title/Position</Label>
                      <Input
                        id="agent-title"
                        value={editConfig.agent.title}
                        onChange={(e) => updateAgent("title", e.target.value)}
                        placeholder="Senior Sales Executive"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="agent-phone">Phone Number</Label>
                      <Input
                        id="agent-phone"
                        value={editConfig.agent.phone}
                        onChange={(e) => updateAgent("phone", e.target.value)}
                        placeholder="+62 812-3456-7890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="agent-whatsapp">
                        WhatsApp (Optional)
                      </Label>
                      <Input
                        id="agent-whatsapp"
                        value={editConfig.agent.whatsapp || ""}
                        onChange={(e) =>
                          updateAgent("whatsapp", e.target.value)
                        }
                        placeholder="+62 812-3456-7890"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="agent-email">Email (Optional)</Label>
                    <Input
                      id="agent-email"
                      value={editConfig.agent.email || ""}
                      onChange={(e) => updateAgent("email", e.target.value)}
                      placeholder="sarah@paramountland.co.id"
                    />
                  </div>

                  <div>
                    <Label htmlFor="agent-photo">Photo URL (Optional)</Label>
                    <Input
                      id="agent-photo"
                      value={editConfig.agent.photo || ""}
                      onChange={(e) => updateAgent("photo", e.target.value)}
                      placeholder="https://example.com/agent-photo.jpg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="agent-description">Description</Label>
                    <Textarea
                      id="agent-description"
                      value={editConfig.agent.description || ""}
                      onChange={(e) =>
                        updateAgent("description", e.target.value)
                      }
                      placeholder="Experienced sales professional specializing in residential properties..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="agent-experience">Experience</Label>
                      <Input
                        id="agent-experience"
                        value={editConfig.agent.experience || ""}
                        onChange={(e) =>
                          updateAgent("experience", e.target.value)
                        }
                        placeholder="8 tahun"
                      />
                    </div>
                    <div>
                      <Label htmlFor="agent-specialization">
                        Specialization
                      </Label>
                      <Input
                        id="agent-specialization"
                        value={editConfig.agent.specialization || ""}
                        onChange={(e) =>
                          updateAgent("specialization", e.target.value)
                        }
                        placeholder="Apartemen & Townhouse"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="agent-office">Office Location</Label>
                      <Input
                        id="agent-office"
                        value={editConfig.agent.office || ""}
                        onChange={(e) => updateAgent("office", e.target.value)}
                        placeholder="Paramount Land Office Jakarta"
                      />
                    </div>
                    <div>
                      <Label htmlFor="agent-schedule">Schedule</Label>
                      <Input
                        id="agent-schedule"
                        value={editConfig.agent.schedule || ""}
                        onChange={(e) =>
                          updateAgent("schedule", e.target.value)
                        }
                        placeholder="Sen-Jum 09:00-17:00, Sab 09:00-15:00"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="agent-rating">Rating (1-5)</Label>
                    <Select
                      value={editConfig.agent.rating?.toString() || "5"}
                      onValueChange={(value) =>
                        updateAgent("rating", parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ (5 Stars)</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ (4 Stars)</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ (3 Stars)</SelectItem>
                        <SelectItem value="2">⭐⭐ (2 Stars)</SelectItem>
                        <SelectItem value="1">⭐ (1 Star)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Display Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Display Options</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-photo"
                        checked={editConfig.showPhoto}
                        onCheckedChange={(checked) =>
                          setEditConfig({ ...editConfig, showPhoto: !!checked })
                        }
                      />
                      <Label htmlFor="show-photo">Show Photo</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-description"
                        checked={editConfig.showDescription}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showDescription: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-description">Show Description</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-experience"
                        checked={editConfig.showExperience}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showExperience: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-experience">Show Experience</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-specialization"
                        checked={editConfig.showSpecialization}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showSpecialization: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-specialization">
                        Show Specialization
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-office"
                        checked={editConfig.showOffice}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showOffice: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-office">Show Office</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-schedule"
                        checked={editConfig.showSchedule}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showSchedule: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-schedule">Show Schedule</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-rating"
                        checked={editConfig.showRating}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showRating: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-rating">Show Rating</Label>
                    </div>
                  </div>
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

      {/* Agent Contact Content */}
      <div
        className={`${getResponsiveClasses()} w-full`}
        style={{ backgroundColor: normalizedConfig.backgroundColor }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
              {normalizedConfig.title}
            </h2>
            {normalizedConfig.subtitle && (
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {normalizedConfig.subtitle}
              </p>
            )}
          </div>

          {/* Agent Display */}
          {normalizedConfig.layout === "banner" ? (
            // Banner Layout - Horizontal
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                {/* Agent Photo */}
                {normalizedConfig.showPhoto && (
                  <div className="flex-shrink-0">
                    {normalizedConfig.agent.photo ? (
                      <img
                        src={normalizedConfig.agent.photo}
                        alt={normalizedConfig.agent.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center shadow-lg">
                        <IconUser className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600 dark:text-gray-300" />
                      </div>
                    )}
                  </div>
                )}

                {/* Agent Info */}
                <div className="flex-grow text-center sm:text-left">
                  <div className="mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {normalizedConfig.agent.name}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">
                      {normalizedConfig.agent.title}
                    </p>

                    {normalizedConfig.showRating && (
                      <div className="flex justify-center sm:justify-start items-center gap-1 mt-2">
                        {renderStars(normalizedConfig.agent.rating || 5)}
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          ({normalizedConfig.agent.rating || 5}.0)
                        </span>
                      </div>
                    )}
                  </div>

                  {normalizedConfig.showDescription &&
                    normalizedConfig.agent.description && (
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {normalizedConfig.agent.description}
                      </p>
                    )}

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-sm">
                    {normalizedConfig.showExperience &&
                      normalizedConfig.agent.experience && (
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 dark:text-gray-400">
                          <IconAward className="h-4 w-4 text-blue-500" />
                          <span>
                            {normalizedConfig.agent.experience} pengalaman
                          </span>
                        </div>
                      )}

                    {normalizedConfig.showSpecialization &&
                      normalizedConfig.agent.specialization && (
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 dark:text-gray-400">
                          <IconStar className="h-4 w-4 text-yellow-500" />
                          <span>{normalizedConfig.agent.specialization}</span>
                        </div>
                      )}

                    {normalizedConfig.showOffice &&
                      normalizedConfig.agent.office && (
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 dark:text-gray-400">
                          <IconMapPin className="h-4 w-4 text-red-500" />
                          <span>{normalizedConfig.agent.office}</span>
                        </div>
                      )}

                    {normalizedConfig.showSchedule &&
                      normalizedConfig.agent.schedule && (
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 dark:text-gray-400">
                          <IconClock className="h-4 w-4 text-green-500" />
                          <span>{normalizedConfig.agent.schedule}</span>
                        </div>
                      )}
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() =>
                        handleContactClick(
                          "phone",
                          normalizedConfig.agent.phone
                        )
                      }
                      className="flex-1 h-12 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      style={{ backgroundColor: normalizedConfig.primaryColor }}
                    >
                      <IconPhone className="h-5 w-5 mr-2" />
                      {normalizedConfig.ctaText}
                    </Button>

                    {normalizedConfig.agent.whatsapp && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleContactClick(
                            "whatsapp",
                            normalizedConfig.agent.whatsapp!
                          )
                        }
                        className="flex-1 h-12 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 font-semibold transition-all duration-200"
                      >
                        <IconBrandWhatsapp className="h-5 w-5 mr-2" />
                        {normalizedConfig.ctaWhatsappText}
                      </Button>
                    )}

                    {normalizedConfig.agent.email && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleContactClick(
                            "email",
                            normalizedConfig.agent.email!
                          )
                        }
                        className="flex-1 h-12 border-gray-300 dark:border-gray-600 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                      >
                        <IconMail className="h-5 w-5 mr-2" />
                        {normalizedConfig.ctaEmailText}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : normalizedConfig.layout === "minimal" ? (
            // Minimal Layout - Simple and Clean
            <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
              {normalizedConfig.showPhoto && (
                <div className="mb-6">
                  {normalizedConfig.agent.photo ? (
                    <img
                      src={normalizedConfig.agent.photo}
                      alt={normalizedConfig.agent.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto shadow-md">
                      <IconUser className="h-10 w-10 text-blue-600 dark:text-gray-300" />
                    </div>
                  )}
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {normalizedConfig.agent.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {normalizedConfig.agent.title}
              </p>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  onClick={() =>
                    handleContactClick("phone", normalizedConfig.agent.phone)
                  }
                  className="text-white shadow-md hover:shadow-lg transition-all duration-200"
                  style={{ backgroundColor: normalizedConfig.primaryColor }}
                >
                  <IconPhone className="h-4 w-4 mr-2" />
                  {normalizedConfig.ctaText}
                </Button>

                {normalizedConfig.agent.whatsapp && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleContactClick(
                        "whatsapp",
                        normalizedConfig.agent.whatsapp!
                      )
                    }
                    className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                  >
                    <IconBrandWhatsapp className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                )}
              </div>
            </div>
          ) : (
            // Card Layout - Default
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
              {/* Agent Photo */}
              {normalizedConfig.showPhoto && (
                <div className="text-center mb-6">
                  {normalizedConfig.agent.photo ? (
                    <img
                      src={normalizedConfig.agent.photo}
                      alt={normalizedConfig.agent.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto shadow-lg border-4 border-white dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto shadow-lg">
                      <IconUser className="h-12 w-12 text-blue-600 dark:text-gray-300" />
                    </div>
                  )}
                </div>
              )}

              {/* Agent Info */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {normalizedConfig.agent.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium mb-3">
                  {normalizedConfig.agent.title}
                </p>

                {normalizedConfig.showRating && (
                  <div className="flex justify-center items-center gap-1 mb-4">
                    {renderStars(normalizedConfig.agent.rating || 5)}
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      ({normalizedConfig.agent.rating || 5}.0)
                    </span>
                  </div>
                )}

                {normalizedConfig.showDescription &&
                  normalizedConfig.agent.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {normalizedConfig.agent.description}
                    </p>
                  )}

                {/* Additional Info */}
                <div className="space-y-2 mb-6 text-sm">
                  {normalizedConfig.showExperience &&
                    normalizedConfig.agent.experience && (
                      <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                        <IconAward className="h-4 w-4 text-blue-500" />
                        <span>
                          {normalizedConfig.agent.experience} pengalaman
                        </span>
                      </div>
                    )}

                  {normalizedConfig.showSpecialization &&
                    normalizedConfig.agent.specialization && (
                      <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                        <IconStar className="h-4 w-4 text-yellow-500" />
                        <span>{normalizedConfig.agent.specialization}</span>
                      </div>
                    )}

                  {normalizedConfig.showOffice &&
                    normalizedConfig.agent.office && (
                      <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                        <IconMapPin className="h-4 w-4 text-red-500" />
                        <span>{normalizedConfig.agent.office}</span>
                      </div>
                    )}

                  {normalizedConfig.showSchedule &&
                    normalizedConfig.agent.schedule && (
                      <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                        <IconClock className="h-4 w-4 text-green-500" />
                        <span>{normalizedConfig.agent.schedule}</span>
                      </div>
                    )}
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() =>
                    handleContactClick("phone", normalizedConfig.agent.phone)
                  }
                  className="w-full h-12 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{ backgroundColor: normalizedConfig.primaryColor }}
                >
                  <IconPhone className="h-5 w-5 mr-2" />
                  {normalizedConfig.ctaText}
                </Button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {normalizedConfig.agent.whatsapp && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleContactClick(
                          "whatsapp",
                          normalizedConfig.agent.whatsapp!
                        )
                      }
                      className="h-10 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 font-medium transition-all duration-200"
                    >
                      <IconBrandWhatsapp className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}

                  {normalizedConfig.agent.email && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleContactClick(
                          "email",
                          normalizedConfig.agent.email!
                        )
                      }
                      className="h-10 border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      <IconMail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!normalizedConfig.agent.name && (
            <div className="text-center py-12">
              <IconUser className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                No sales agent configured
              </p>
              {editable && (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Click the settings button to configure the sales agent
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
