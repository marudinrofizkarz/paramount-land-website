"use client";

import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconSettings, IconSend } from "@tabler/icons-react";
import { toast } from "sonner";
import { submitContactInquiry } from "@/lib/contact-inquiry-actions";
import { useSweetAlert } from "@/hooks/use-sweet-alert";

interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

interface FormComponentProps {
  id: string;
  config: {
    title: string;
    fields: FormField[];
    submitText: string;
    successMessage: string;
    style: "modern" | "classic" | "minimal";
    projectId?: string;
    projectName?: string;
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
  projectId?: string;
  projectName?: string;
}

export function FormComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
  projectId,
  projectName,
}: FormComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState(config);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError, showLoading, hideLoading } = useSweetAlert();

  const handleSave = () => {
    onUpdate?.(editConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditConfig(config);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = config.fields.filter((field) => field.required);
    const missingFields = requiredFields.filter(
      (field) => !formData[field.name]
    );

    if (missingFields.length > 0) {
      showError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    showLoading("Submitting your inquiry...");

    try {
      // Prepare the inquiry data
      const inquiryData = {
        name: formData.name || formData.full_name || "Unknown",
        email: formData.email || formData.email_address || "",
        phone: formData.phone || formData.phone_number || "",
        message: buildMessage(formData),
        inquiryType: determineInquiryType(formData),
        projectId: projectId || config.projectId || "general_inquiries",
        projectName:
          projectName || config.projectName || "Landing Page Inquiry",
      };

      // Submit to database
      const result = await submitContactInquiry(inquiryData);

      hideLoading();

      if (result.success) {
        showSuccess(config.successMessage);
        setFormData({});

        // Track conversion if available globally
        if (typeof window !== "undefined" && (window as any).trackConversion) {
          (window as any).trackConversion();
        }

        // Enhanced Google Ads conversion tracking
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "conversion", {
            send_to: "AW-CONVERSION_ID/CONVERSION_LABEL", // Replace with actual conversion ID
            value: 1.0,
            currency: "IDR",
          });

          (window as any).gtag("event", "generate_lead", {
            currency: "IDR",
            value: 1.0,
          });
        }
      } else {
        showError(result.error || "Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      hideLoading();
      showError("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to build message from form data
  const buildMessage = (data: Record<string, string>) => {
    let message = "";

    // Add structured information
    Object.entries(data).forEach(([key, value]) => {
      if (
        value &&
        ![
          "name",
          "full_name",
          "email",
          "email_address",
          "phone",
          "phone_number",
        ].includes(key)
      ) {
        const fieldConfig = config.fields.find((f) => f.name === key);
        const label =
          fieldConfig?.label || key.charAt(0).toUpperCase() + key.slice(1);
        message += `${label}: ${value}\n`;
      }
    });

    return message.trim() || "No additional information provided";
  };

  // Helper function to determine inquiry type
  const determineInquiryType = (data: Record<string, string>) => {
    if (data.property_type) return "property_interest";
    if (data.budget || data.budget_range) return "pricing";
    if (data.visit_request || data.schedule_visit) return "visit";
    return "general";
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const getFormWidth = () => {
    switch (previewMode) {
      case "mobile":
        return "w-full";
      case "tablet":
        return "max-w-lg mx-auto";
      default:
        return "max-w-xl mx-auto";
    }
  };

  const renderFormField = (field: FormField) => {
    const fieldProps = {
      id: field.name,
      name: field.name,
      required: field.required,
      value: formData[field.name] || "",
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => handleInputChange(field.name, e.target.value),
      className: "w-full",
    };

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            {...fieldProps}
            rows={4}
            placeholder={`Enter your ${field.label.toLowerCase()}`}
          />
        );
      case "select":
        return (
          <Select
            value={formData[field.name] || ""}
            onValueChange={(value) => handleInputChange(field.name, value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={`Select ${field.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            {...fieldProps}
            type={field.type}
            placeholder={`Enter your ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className="relative group" data-component-type="form">
      {/* Edit Button */}
      {editable && onUpdate && (
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <IconSettings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Contact Form</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="form-title">Title</Label>
                  <Input
                    id="form-title"
                    value={editConfig.title}
                    onChange={(e) =>
                      setEditConfig({ ...editConfig, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="submit-text">Submit Button Text</Label>
                  <Input
                    id="submit-text"
                    value={editConfig.submitText}
                    onChange={(e) =>
                      setEditConfig({
                        ...editConfig,
                        submitText: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="success-message">Success Message</Label>
                  <Textarea
                    id="success-message"
                    value={editConfig.successMessage}
                    onChange={(e) =>
                      setEditConfig({
                        ...editConfig,
                        successMessage: e.target.value,
                      })
                    }
                    rows={2}
                  />
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

      {/* Form Content */}
      <div className={`bg-gray-50 dark:bg-gray-900 ${getResponsiveClasses()}`}>
        <div className={getFormWidth()}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
              {config.title}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {config.fields.map((field) => (
                <div key={field.name}>
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>
                  {renderFormField(field)}
                </div>
              ))}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                size={previewMode === "mobile" ? "default" : "lg"}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <>
                    <IconSend className="mr-2 h-4 w-4" />
                    {config.submitText}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
