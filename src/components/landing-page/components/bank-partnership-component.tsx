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
import { FileUploader } from "@/components/file-uploader";
import {
  IconSettings,
  IconPlus,
  IconTrash,
  IconBuildingBank,
  IconUpload,
} from "@tabler/icons-react";

interface Bank {
  name: string;
  logo: string;
  description?: string;
  website?: string;
}

interface BankPartnershipComponentProps {
  id: string;
  config: {
    title: string;
    subtitle?: string;
    banks: Bank[];
    backgroundColor?: string;
    showDescription: boolean;
    layout: "grid" | "carousel";
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function BankPartnershipComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: BankPartnershipComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState(config);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  // Sync editConfig with prop changes
  useEffect(() => {
    console.log(`[BankPartnership ${id}] Config updated:`, config);
    setEditConfig(config);
  }, [config, id]);

  const handleSave = () => {
    // Ensure all logos are properly saved
    const configToSave = {
      ...editConfig,
      banks: editConfig.banks.map((bank) => ({
        ...bank,
        logo: bank.logo || "", // Ensure logo field is never undefined
      })),
    };
    onUpdate?.(configToSave);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditConfig(config);
    setIsEditing(false);
  };

  const addBank = () => {
    setEditConfig({
      ...editConfig,
      banks: [
        ...editConfig.banks,
        { name: "", logo: "", description: "", website: "" },
      ],
    });
  };

  const updateBank = (index: number, field: keyof Bank, value: string) => {
    setEditConfig((prevConfig) => {
      const newBanks = [...prevConfig.banks];
      newBanks[index] = { ...newBanks[index], [field]: value };
      return { ...prevConfig, banks: newBanks };
    });
  };

  const removeBank = (index: number) => {
    const newBanks = [...editConfig.banks];
    newBanks.splice(index, 1);
    setEditConfig({ ...editConfig, banks: newBanks });
  };

  const handleLogoUpload = async (files: File[], index: number) => {
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
          updateBank(index, "logo", dataUrl);
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

  const getResponsiveClasses = () => {
    // Always use responsive classes instead of previewMode
    return "px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16";
  };

  const getGridColumns = () => {
    // Use proper responsive grid classes
    return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4";
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
                  Edit Bank Partnership
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
                      placeholder="Banking Partners"
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
                      placeholder="Trusted financial partners for your property investment"
                      rows={2}
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

                {/* Banks */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Banking Partners
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addBank}
                    >
                      <IconPlus className="h-4 w-4 mr-2" />
                      Add Bank
                    </Button>
                  </div>

                  {editConfig.banks.map((bank, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          Bank {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeBank(index)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label>Bank Name</Label>
                          <Input
                            value={bank.name}
                            onChange={(e) =>
                              updateBank(index, "name", e.target.value)
                            }
                            placeholder="Bank Mandiri"
                          />
                        </div>

                        <div>
                          <Label>Website URL</Label>
                          <Input
                            value={bank.website || ""}
                            onChange={(e) =>
                              updateBank(index, "website", e.target.value)
                            }
                            placeholder="https://bankmandiri.co.id"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Logo</Label>
                        <div className="space-y-3">
                          <FileUploader
                            maxFiles={1}
                            maxSize={1024 * 1024 * 4}
                            accept={{ "image/*": [] }}
                            onUpload={(files) => handleLogoUpload(files, index)}
                            disabled={uploadingIndex === index}
                          />
                          {bank.logo && (
                            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                              <img
                                src={bank.logo}
                                alt={bank.name}
                                className="w-12 h-12 object-contain rounded"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  Current Logo
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Click upload to replace
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => updateBank(index, "logo", "")}
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label>Description (Optional)</Label>
                        <Textarea
                          value={bank.description || ""}
                          onChange={(e) =>
                            updateBank(index, "description", e.target.value)
                          }
                          placeholder="Bank description or special offers"
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

      {/* Bank Partnership Content */}
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

          {/* Banks Grid */}
          <div className={`grid gap-4 sm:gap-6 ${getGridColumns()}`}>
            {config.banks.map((bank, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg dark:hover:shadow-gray-900/25 transition-all duration-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[120px] sm:min-h-[140px] md:min-h-[160px] flex flex-col border border-gray-100 dark:border-gray-700"
                onClick={() =>
                  bank.website && window.open(bank.website, "_blank")
                }
              >
                {bank.logo ? (
                  <div className="flex items-center justify-center h-12 sm:h-16 mb-3 sm:mb-4 flex-grow">
                    <img
                      src={bank.logo}
                      alt={bank.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-12 sm:h-16 mb-3 sm:mb-4 flex-grow">
                    <IconBuildingBank className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500" />
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2 line-clamp-2">
                    {bank.name}
                  </h3>
                  {config.showDescription && bank.description && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {bank.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {config.banks.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <IconBuildingBank className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4">
                No banking partners added yet
              </p>
              {editable && (
                <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2 px-4">
                  Click the settings button to add banking partners
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
