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

interface AgentContactComponentProps {
  id: string;
  config: {
    title: string;
    subtitle?: string;
    agent: SingleAgent;
    layout: "card" | "banner" | "minimal";
    showPhoto: boolean;
    showDescription: boolean;
    showExperience: boolean;
    showSpecialization: boolean;
    showOffice: boolean;
    showSchedule: boolean;
    showRating: boolean;
    backgroundColor?: string;
    primaryColor?: string;
    ctaText: string;
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
  // Normalize config to ensure all properties are defined
  const normalizeAgent = (agent: Agent): Agent => ({
    name: agent.name || "",
    title: agent.title || "",
    phone: agent.phone || "",
    photo: agent.photo || "",
    email: agent.email || "",
    whatsapp: agent.whatsapp || "",
    description: agent.description || "",
  });

  const normalizedConfig = {
    ...config,
    title: config.title || "",
    subtitle: config.subtitle || "",
    ctaText: config.ctaText || "",
    agents: config.agents.map(normalizeAgent),
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

  const addAgent = () => {
    setEditConfig({
      ...editConfig,
      agents: [
        ...editConfig.agents,
        {
          name: "",
          title: "",
          photo: "",
          phone: "",
          email: "",
          whatsapp: "",
          description: "",
        },
      ],
    });
  };

  const updateAgent = (index: number, field: keyof Agent, value: string) => {
    const newAgents = [...editConfig.agents];
    newAgents[index] = { ...newAgents[index], [field]: value };
    setEditConfig({ ...editConfig, agents: newAgents });
  };

  const removeAgent = (index: number) => {
    const newAgents = [...editConfig.agents];
    newAgents.splice(index, 1);
    setEditConfig({ ...editConfig, agents: newAgents });
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
        const whatsappNumber = value.replace(/[^\d]/g, "");
        window.open(`https://wa.me/${whatsappNumber}`, "_blank");
        break;
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
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Agent Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
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
                      placeholder="Contact Our Agents"
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
                      placeholder="Get expert advice from our property consultants"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cta-text">CTA Button Text</Label>
                    <Input
                      id="cta-text"
                      value={editConfig.ctaText || ""}
                      onChange={(e) =>
                        setEditConfig({
                          ...editConfig,
                          ctaText: e.target.value,
                        })
                      }
                      placeholder="Contact Now"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="layout">Layout</Label>
                      <Select
                        value={editConfig.layout}
                        onValueChange={(value) =>
                          setEditConfig({
                            ...editConfig,
                            layout: value as "grid" | "list",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid</SelectItem>
                          <SelectItem value="list">List</SelectItem>
                        </SelectContent>
                      </Select>
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

                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-photos"
                        checked={editConfig.showPhotos}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showPhotos: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-photos">Show Photos</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-descriptions"
                        checked={editConfig.showDescriptions}
                        onCheckedChange={(checked) =>
                          setEditConfig({
                            ...editConfig,
                            showDescriptions: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="show-descriptions">
                        Show Descriptions
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Agents */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Agents</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addAgent}
                    >
                      <IconPlus className="h-4 w-4 mr-2" />
                      Add Agent
                    </Button>
                  </div>

                  {editConfig.agents.map((agent, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Agent {index + 1}</h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeAgent(index)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={agent.name || ""}
                            onChange={(e) =>
                              updateAgent(index, "name", e.target.value)
                            }
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <Label>Title</Label>
                          <Input
                            value={agent.title || ""}
                            onChange={(e) =>
                              updateAgent(index, "title", e.target.value)
                            }
                            placeholder="Senior Property Consultant"
                          />
                        </div>

                        <div>
                          <Label>Phone</Label>
                          <Input
                            value={agent.phone || ""}
                            onChange={(e) =>
                              updateAgent(index, "phone", e.target.value)
                            }
                            placeholder="+62 812 3456 7890"
                          />
                        </div>

                        <div>
                          <Label>WhatsApp (Optional)</Label>
                          <Input
                            value={agent.whatsapp || ""}
                            onChange={(e) =>
                              updateAgent(index, "whatsapp", e.target.value)
                            }
                            placeholder="+62 812 3456 7890"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Email (Optional)</Label>
                        <Input
                          value={agent.email || ""}
                          onChange={(e) =>
                            updateAgent(index, "email", e.target.value)
                          }
                          placeholder="john@company.com"
                        />
                      </div>

                      <div>
                        <Label>Photo URL (Optional)</Label>
                        <Input
                          value={agent.photo || ""}
                          onChange={(e) =>
                            updateAgent(index, "photo", e.target.value)
                          }
                          placeholder="https://example.com/agent-photo.jpg"
                        />
                      </div>

                      <div>
                        <Label>Description (Optional)</Label>
                        <Textarea
                          value={agent.description || ""}
                          onChange={(e) =>
                            updateAgent(index, "description", e.target.value)
                          }
                          placeholder="Agent bio and expertise"
                          rows={2}
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

      {/* Agent Contact Content */}
      <div
        className={`${getResponsiveClasses()}`}
        style={{ backgroundColor: normalizedConfig.backgroundColor }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {normalizedConfig.title}
            </h2>
            {normalizedConfig.subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {normalizedConfig.subtitle}
              </p>
            )}
          </div>

          {/* Agents Display */}
          {normalizedConfig.layout === "list" ? (
            <div className="space-y-6">
              {normalizedConfig.agents.map((agent, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Agent Photo */}
                    {normalizedConfig.showPhotos && (
                      <div className="flex-shrink-0">
                        {agent.photo ? (
                          <img
                            src={agent.photo}
                            alt={agent.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <IconUser className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Agent Info */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {agent.title}
                      </p>

                      {normalizedConfig.showDescriptions &&
                        agent.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {agent.description}
                          </p>
                        )}

                      {/* Contact Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleContactClick("phone", agent.phone)
                          }
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <IconPhone className="h-4 w-4 mr-2" />
                          Call
                        </Button>

                        {agent.whatsapp && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleContactClick("whatsapp", agent.whatsapp!)
                            }
                            className="border-green-500 text-green-600 hover:bg-green-50"
                          >
                            <IconBrandWhatsapp className="h-4 w-4 mr-2" />
                            WhatsApp
                          </Button>
                        )}

                        {agent.email && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleContactClick("email", agent.email!)
                            }
                          >
                            <IconMail className="h-4 w-4 mr-2" />
                            Email
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-6 ${getGridColumns()}`}>
              {normalizedConfig.agents.map((agent, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center"
                >
                  {/* Agent Photo */}
                  {normalizedConfig.showPhotos && (
                    <div className="mb-4">
                      {agent.photo ? (
                        <img
                          src={agent.photo}
                          alt={agent.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto">
                          <IconUser className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Agent Info */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {agent.title}
                  </p>

                  {normalizedConfig.showDescriptions && agent.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {agent.description}
                    </p>
                  )}

                  {/* Contact Buttons */}
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      onClick={() => handleContactClick("phone", agent.phone)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <IconPhone className="h-4 w-4 mr-2" />
                      {normalizedConfig.ctaText}
                    </Button>

                    <div className="flex gap-2">
                      {agent.whatsapp && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleContactClick("whatsapp", agent.whatsapp!)
                          }
                          className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                        >
                          <IconBrandWhatsapp className="h-4 w-4" />
                        </Button>
                      )}

                      {agent.email && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleContactClick("email", agent.email!)
                          }
                          className="flex-1"
                        >
                          <IconMail className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {normalizedConfig.agents.length === 0 && (
            <div className="text-center py-12">
              <IconUser className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No agents added yet
              </p>
              {editable && (
                <p className="text-sm text-gray-400 mt-2">
                  Click the settings button to add agents
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
