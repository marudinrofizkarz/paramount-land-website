"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";

import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { heroSliderSchema, HeroSliderFormValues } from "@/types/hero-slider";
import { createHeroSlider, updateHeroSlider } from "@/lib/hero-slider-actions";
import { useSweetAlert } from "@/hooks/use-sweet-alert";

interface HeroSliderFormProps {
  initialData?: HeroSliderFormValues & { id?: string };
  onSuccess?: () => void;
}

export function HeroSliderForm({
  initialData,
  onSuccess,
}: HeroSliderFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [desktopImagePreview, setDesktopImagePreview] = useState(
    initialData?.desktopImage || ""
  );
  const [mobileImagePreview, setMobileImagePreview] = useState(
    initialData?.mobileImage || ""
  );
  const { showSuccess, showError } = useSweetAlert();

  // Initialize form with initial data or default values
  const form = useForm<HeroSliderFormValues>({
    resolver: zodResolver(heroSliderSchema),
    defaultValues: initialData || {
      title: "",
      subtitle: "",
      order: 0,
      isActive: true,
      desktopImage: "",
      mobileImage: "",
      linkUrl: "",
      linkText: "",
    },
  });

  // Handle desktop image upload
  const handleDesktopImageUpload = useCallback(
    (file: File) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setDesktopImagePreview(event.target.result as string);
            form.setValue("desktopImage", event.target.result as string);
            resolve();
          }
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    },
    [form]
  );

  // Handle mobile image upload
  const handleMobileImageUpload = useCallback(
    (file: File) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setMobileImagePreview(event.target.result as string);
            form.setValue("mobileImage", event.target.result as string);
            resolve();
          }
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    },
    [form]
  );

  // Handle form submission
  const onSubmit = async (values: HeroSliderFormValues) => {
    try {
      setIsLoading(true);

      // Create FormData for server action
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value?.toString() || "");
      });

      // Call the appropriate server action
      const result = initialData?.id
        ? await updateHeroSlider(initialData.id, formData)
        : await createHeroSlider(formData);

      if (result.success) {
        showSuccess(
          initialData?.id
            ? "Hero slider updated successfully!"
            : "Hero slider created successfully!"
        );
        onSuccess?.();

        // Reset form if creating a new slider
        if (!initialData?.id) {
          form.reset();
          setDesktopImagePreview("");
          setMobileImagePreview("");
        }
      } else {
        showError(result.message || "Failed to save hero slider");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showError("An unexpected error occurred while saving the hero slider");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>
          {initialData?.id ? "Edit Hero Slider" : "Add New Hero Slider"}
        </CardTitle>
        <CardDescription>
          Manage hero slider content for your homepage. Upload both desktop and
          mobile images.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter slider title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Order */}
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Lower numbers appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Subtitle */}
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter subtitle or description (optional)"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Desktop Image Upload */}
            <FormField
              control={form.control}
              name="desktopImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desktop Image (1920×1080 recommended)</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <FileUploader
                        accept={{ "image/*": [] }}
                        maxSize={1024 * 1024 * 5} // 5MB
                        onUpload={async (files) => {
                          if (files.length > 0) {
                            await handleDesktopImageUpload(files[0]);
                          }
                        }}
                      />
                      {desktopImagePreview && (
                        <div className="relative h-[200px] w-full overflow-hidden rounded-md border">
                          <Image
                            src={desktopImagePreview}
                            alt="Desktop image preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    This image will be shown on desktop devices
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mobile Image Upload */}
            <FormField
              control={form.control}
              name="mobileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Image (768×1024 recommended)</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <FileUploader
                        accept={{ "image/*": [] }}
                        maxSize={1024 * 1024 * 3} // 3MB
                        onUpload={async (files) => {
                          if (files.length > 0) {
                            await handleMobileImageUpload(files[0]);
                          }
                        }}
                      />
                      {mobileImagePreview && (
                        <div className="relative h-[200px] w-full overflow-hidden rounded-md border">
                          <Image
                            src={mobileImagePreview}
                            alt="Mobile image preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    This image will be shown on mobile devices
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Link URL */}
              <FormField
                control={form.control}
                name="linkUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link URL (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/page"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Link Text */}
              <FormField
                control={form.control}
                name="linkText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Text (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Learn More"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Active Status */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Show this slider on the website
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : initialData?.id
                ? "Update Slider"
                : "Create Slider"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
