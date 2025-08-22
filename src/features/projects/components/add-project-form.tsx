"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { X, Loader2, Upload, Plus, Trash2 } from "lucide-react";
import { slugify } from "@/lib/utils";

// Interface for project data
interface ProjectFormData {
  name: string;
  slug: string;
  location: string;
  mainImage: File | null;
  galleryImages: File[];
  startingPrice: string;
  brochureFile: File | null;
  youtubeLink: string;
  advantages: string[];
}

export function AddProjectForm({
  onClose,
  onSubmit,
}: {
  onClose?: () => void;
  onSubmit?: (data: ProjectFormData) => void;
}) {
  // Initial form state
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    slug: "",
    location: "",
    mainImage: null,
    galleryImages: [],
    startingPrice: "",
    brochureFile: null,
    youtubeLink: "",
    advantages: [""],
  });

  const [loading, setLoading] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [youtubeEmbedLink, setYoutubeEmbedLink] = useState<string | null>(null);
  const [brochureName, setBrochureName] = useState<string | null>(null);

  // Generate slug from name
  useEffect(() => {
    if (formData.name) {
      setFormData((prev) => ({
        ...prev,
        slug: slugify(prev.name),
      }));
    }
  }, [formData.name]);

  // Convert YouTube link to embed link
  useEffect(() => {
    if (formData.youtubeLink) {
      const videoId = extractYouTubeVideoId(formData.youtubeLink);
      if (videoId) {
        setYoutubeEmbedLink(`https://www.youtube.com/embed/${videoId}`);
      } else {
        setYoutubeEmbedLink(null);
      }
    } else {
      setYoutubeEmbedLink(null);
    }
  }, [formData.youtubeLink]);

  // Handle text input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle main image upload
  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        mainImage: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle gallery images upload
  const handleGalleryImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...newFiles],
      }));

      // Create previews
      const newPreviews: string[] = [];
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === newFiles.length) {
            setGalleryPreviews((prev) => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle brochure file upload
  const handleBrochureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        brochureFile: file,
      }));
      setBrochureName(file.name);
    }
  };

  // Handle removing a gallery image
  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle removing the brochure
  const removeBrochure = () => {
    setFormData((prev) => ({
      ...prev,
      brochureFile: null,
    }));
    setBrochureName(null);
  };

  // Handle removing the main image
  const removeMainImage = () => {
    setFormData((prev) => ({
      ...prev,
      mainImage: null,
    }));
    setMainImagePreview(null);
  };

  // Handle advantages
  const addAdvantage = () => {
    setFormData((prev) => ({
      ...prev,
      advantages: [...prev.advantages, ""],
    }));
  };

  const removeAdvantage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      advantages: prev.advantages.filter((_, i) => i !== index),
    }));
  };

  const handleAdvantageChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newAdvantages = [...prev.advantages];
      newAdvantages[index] = value;
      return {
        ...prev,
        advantages: newAdvantages,
      };
    });
  };

  // Helper function to extract YouTube video ID
  const extractYouTubeVideoId = (url: string): string | null => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real application, you would send this data to your backend
      // For now, we'll just simulate a delay and call the onSubmit callback
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (onSubmit) onSubmit(formData);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full border-0 shadow-none">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add New Project</CardTitle>
              <CardDescription>
                Create a new property development project
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => onClose && onClose()}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 overflow-y-auto max-h-[60vh] pb-6">
          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Project Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter project name"
                required
              />
            </div>

            {/* Project Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Auto-generated from project name
              </p>
            </div>

            {/* Project Location */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">
                Location <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter project location/address"
                required
              />
            </div>

            {/* Main Image */}
            <div className="space-y-2">
              <Label>
                Main Image <span className="text-red-500">*</span>
              </Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
                {mainImagePreview ? (
                  <div className="relative">
                    <img
                      src={mainImagePreview}
                      alt="Main project"
                      className="max-h-36 sm:max-h-48 mx-auto object-contain rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={removeMainImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Click to upload main project image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG or WebP (max. 5MB)
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleMainImageChange}
                      required={!formData.mainImage}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Starting Price */}
            <div className="space-y-2">
              <Label htmlFor="startingPrice">
                Starting Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startingPrice"
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleInputChange}
                placeholder="e.g., Rp 850 juta"
                required
              />
            </div>

            {/* Gallery Images */}
            <div className="space-y-2 md:col-span-2">
              <Label>Gallery Images</Label>
              <div className="border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={preview}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 rounded-full"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-md hover:bg-muted cursor-pointer">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-2">
                      Add Photo
                    </span>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleGalleryImagesChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Brochure File */}
            <div className="space-y-2">
              <Label>Brochure PDF</Label>
              <div className="border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 transition-colors">
                {brochureName ? (
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm truncate">{brochureName}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={removeBrochure}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Click to upload brochure
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF file (max. 10MB)
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleBrochureChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* YouTube Link */}
            <div className="space-y-2">
              <Label htmlFor="youtubeLink">YouTube Video Link</Label>
              <Input
                id="youtubeLink"
                name="youtubeLink"
                value={formData.youtubeLink}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {youtubeEmbedLink && (
                <div className="mt-2 aspect-video max-h-32 sm:max-h-48">
                  <iframe
                    src={youtubeEmbedLink}
                    className="w-full h-full rounded-md"
                    title="YouTube video"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            {/* Project Advantages */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <Label>Location Advantages</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAdvantage}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Advantage
                </Button>
              </div>
              <div className="space-y-2">
                {formData.advantages.map((advantage, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={advantage}
                      onChange={(e) =>
                        handleAdvantageChange(index, e.target.value)
                      }
                      placeholder={`Advantage #${index + 1}`}
                    />
                    {formData.advantages.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAdvantage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t px-4 sm:px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onClose && onClose()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Project
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
