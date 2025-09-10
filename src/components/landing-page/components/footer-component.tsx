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
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconBrandTiktok,
} from "@tabler/icons-react";

interface FooterSection {
  title: string;
  links: Array<{
    label: string;
    url: string;
  }>;
}

interface SocialMedia {
  platform: string;
  url: string;
  icon: string;
}

interface FooterComponentProps {
  id: string;
  config: {
    companyName: string;
    description?: string;
    logo?: string;
    address?: string;
    phone?: string;
    email?: string;
    sections: FooterSection[];
    socialMedia: SocialMedia[];
    backgroundColor?: string;
    textColor?: string;
    showDivider?: boolean;
    layout: "columns" | "stacked";
    columns: number;
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

const socialIcons = {
  facebook: IconBrandFacebook,
  instagram: IconBrandInstagram,
  twitter: IconBrandTwitter,
  linkedin: IconBrandLinkedin,
  youtube: IconBrandYoutube,
  tiktok: IconBrandTiktok,
};

export function FooterComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: FooterComponentProps) {
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

  const addSection = () => {
    setEditConfig({
      ...editConfig,
      sections: [...editConfig.sections, { title: "", links: [] }],
    });
  };

  const updateSection = (
    index: number,
    field: keyof FooterSection,
    value: any
  ) => {
    const newSections = [...editConfig.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setEditConfig({ ...editConfig, sections: newSections });
  };

  const removeSection = (index: number) => {
    const newSections = [...editConfig.sections];
    newSections.splice(index, 1);
    setEditConfig({ ...editConfig, sections: newSections });
  };

  const addSectionLink = (sectionIndex: number) => {
    const newSections = [...editConfig.sections];
    newSections[sectionIndex].links.push({ label: "", url: "" });
    setEditConfig({ ...editConfig, sections: newSections });
  };

  const updateSectionLink = (
    sectionIndex: number,
    linkIndex: number,
    field: "label" | "url",
    value: string
  ) => {
    const newSections = [...editConfig.sections];
    newSections[sectionIndex].links[linkIndex] = {
      ...newSections[sectionIndex].links[linkIndex],
      [field]: value,
    };
    setEditConfig({ ...editConfig, sections: newSections });
  };

  const removeSectionLink = (sectionIndex: number, linkIndex: number) => {
    const newSections = [...editConfig.sections];
    newSections[sectionIndex].links.splice(linkIndex, 1);
    setEditConfig({ ...editConfig, sections: newSections });
  };

  const addSocialMedia = () => {
    setEditConfig({
      ...editConfig,
      socialMedia: [
        ...editConfig.socialMedia,
        { platform: "facebook", url: "", icon: "facebook" },
      ],
    });
  };

  const updateSocialMedia = (
    index: number,
    field: keyof SocialMedia,
    value: string
  ) => {
    const newSocialMedia = [...editConfig.socialMedia];
    newSocialMedia[index] = { ...newSocialMedia[index], [field]: value };
    setEditConfig({ ...editConfig, socialMedia: newSocialMedia });
  };

  const removeSocialMedia = (index: number) => {
    const newSocialMedia = [...editConfig.socialMedia];
    newSocialMedia.splice(index, 1);
    setEditConfig({ ...editConfig, socialMedia: newSocialMedia });
  };

  const getResponsiveClasses = () => {
    if (editable) {
      // Editor mode - use previewMode specific styling
      switch (previewMode) {
        case "mobile":
          return "px-4 py-8";
        case "tablet":
          return "px-6 py-10";
        default:
          return "px-8 py-12";
      }
    } else {
      // Public view - use responsive classes for all devices
      return "px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12";
    }
  };

  const getGridColumns = () => {
    if (editable) {
      // Editor mode - use previewMode specific grid
      if (previewMode === "mobile") return "grid-cols-1";
      if (previewMode === "tablet") return "grid-cols-2";
      return `grid-cols-${Math.min(config.columns, 4)}`;
    } else {
      // Public view - use responsive grid classes
      const columns = Math.min(config.columns, 4);
      if (columns === 1) return "grid-cols-1";
      if (columns === 2) return "grid-cols-1 sm:grid-cols-2";
      if (columns === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    }
  };

  const renderSocialIcon = (platform: string) => {
    const IconComponent =
      socialIcons[platform as keyof typeof socialIcons] || IconBrandFacebook;
    return <IconComponent className="h-6 w-6" />;
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
                <DialogTitle>Edit Footer</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Company Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Company Information</h3>

                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={editConfig.companyName}
                      onChange={(e) =>
                        setEditConfig({
                          ...editConfig,
                          companyName: e.target.value,
                        })
                      }
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editConfig.description || ""}
                      onChange={(e) =>
                        setEditConfig({
                          ...editConfig,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief company description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      id="logo"
                      value={editConfig.logo || ""}
                      onChange={(e) =>
                        setEditConfig({ ...editConfig, logo: e.target.value })
                      }
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={editConfig.address || ""}
                      onChange={(e) =>
                        setEditConfig({
                          ...editConfig,
                          address: e.target.value,
                        })
                      }
                      placeholder="Company address"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editConfig.phone || ""}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+62 123 456 7890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={editConfig.email || ""}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            email: e.target.value,
                          })
                        }
                        placeholder="info@company.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Sections */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Footer Sections</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSection}
                    >
                      Add Section
                    </Button>
                  </div>

                  {editConfig.sections.map((section, sectionIndex) => (
                    <div
                      key={sectionIndex}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <Input
                          placeholder="Section Title"
                          value={section.title}
                          onChange={(e) =>
                            updateSection(sectionIndex, "title", e.target.value)
                          }
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeSection(sectionIndex)}
                        >
                          Remove Section
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Links</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSectionLink(sectionIndex)}
                          >
                            Add Link
                          </Button>
                        </div>

                        {section.links.map((link, linkIndex) => (
                          <div key={linkIndex} className="flex gap-2">
                            <Input
                              placeholder="Label"
                              value={link.label}
                              onChange={(e) =>
                                updateSectionLink(
                                  sectionIndex,
                                  linkIndex,
                                  "label",
                                  e.target.value
                                )
                              }
                            />
                            <Input
                              placeholder="URL"
                              value={link.url}
                              onChange={(e) =>
                                updateSectionLink(
                                  sectionIndex,
                                  linkIndex,
                                  "url",
                                  e.target.value
                                )
                              }
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                removeSectionLink(sectionIndex, linkIndex)
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Media */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Social Media</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSocialMedia}
                    >
                      Add Social Media
                    </Button>
                  </div>

                  {editConfig.socialMedia.map((social, index) => (
                    <div key={index} className="flex gap-2">
                      <Select
                        value={social.platform}
                        onValueChange={(value) =>
                          updateSocialMedia(index, "platform", value)
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="URL"
                        value={social.url}
                        onChange={(e) =>
                          updateSocialMedia(index, "url", e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSocialMedia(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Layout Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Layout Settings</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="layout">Layout</Label>
                      <Select
                        value={editConfig.layout}
                        onValueChange={(value) =>
                          setEditConfig({
                            ...editConfig,
                            layout: value as "columns" | "stacked",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="columns">Columns</SelectItem>
                          <SelectItem value="stacked">Stacked</SelectItem>
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bg-color">Background Color</Label>
                      <Input
                        id="bg-color"
                        type="color"
                        value={editConfig.backgroundColor || "#1f2937"}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            backgroundColor: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="text-color">Text Color</Label>
                      <Input
                        id="text-color"
                        type="color"
                        value={editConfig.textColor || "#ffffff"}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            textColor: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-divider"
                      checked={editConfig.showDivider || false}
                      onCheckedChange={(checked) =>
                        setEditConfig({ ...editConfig, showDivider: !!checked })
                      }
                    />
                    <Label htmlFor="show-divider">Show Top Divider</Label>
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

      {/* Footer Content */}
      <footer
        className={`${getResponsiveClasses()} ${
          config.showDivider
            ? "border-t border-gray-200 dark:border-gray-700"
            : ""
        } w-full`}
        style={{
          backgroundColor: config.backgroundColor || "#1f2937",
          color: config.textColor || "#ffffff",
        }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div
            className={`grid gap-6 sm:gap-8 ${
              config.layout === "columns" ? getGridColumns() : "grid-cols-1"
            }`}
          >
            {/* Company Info Section */}
            <div className="space-y-3 sm:space-y-4 col-span-1 sm:col-span-1">
              {config.logo && (
                <div className="mb-4">
                  <img
                    src={config.logo}
                    alt={config.companyName}
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                </div>
              )}

              <h3 className="text-base sm:text-lg font-semibold text-white dark:text-gray-100">
                {config.companyName}
              </h3>

              {config.description && (
                <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-400 leading-relaxed max-w-sm">
                  {config.description}
                </p>
              )}

              {/* Contact Info */}
              <div className="space-y-2 text-xs sm:text-sm">
                {config.address && (
                  <div className="flex items-start gap-2 text-gray-300 dark:text-gray-400">
                    <IconMapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                    <span className="leading-relaxed">{config.address}</span>
                  </div>
                )}
                {config.phone && (
                  <div className="flex items-center gap-2 text-gray-300 dark:text-gray-400">
                    <IconPhone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    <a
                      href={`tel:${config.phone}`}
                      className="hover:text-white dark:hover:text-gray-200 transition-colors"
                    >
                      {config.phone}
                    </a>
                  </div>
                )}
                {config.email && (
                  <div className="flex items-center gap-2 text-gray-300 dark:text-gray-400">
                    <IconMail className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    <a
                      href={`mailto:${config.email}`}
                      className="hover:text-white dark:hover:text-gray-200 transition-colors break-all"
                    >
                      {config.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Social Media */}
              {config.socialMedia.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {config.socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-800/50 dark:bg-gray-700/50 hover:bg-gray-700/70 dark:hover:bg-gray-600/70 transition-all duration-200 text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-gray-200"
                      aria-label={`Follow us on ${social.platform}`}
                    >
                      {renderSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Sections */}
            {config.sections.map((section, index) => (
              <div key={index} className="space-y-3 sm:space-y-4">
                <h4 className="text-sm sm:text-base font-semibold text-white dark:text-gray-100 border-b border-gray-700 dark:border-gray-600 pb-2">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-200 block py-1 hover:translate-x-1 transform"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer Bottom Section */}
          <div className="mt-8 pt-6 border-t border-gray-700 dark:border-gray-600">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                © {new Date().getFullYear()} {config.companyName}. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
