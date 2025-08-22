"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProjectById, updateProject } from "@/lib/project-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSweetAlert } from "@/hooks/use-sweet-alert";
import {
  Building2,
  MapPin,
  Camera,
  DollarSign,
  FileText,
  Video,
  Star,
  Upload,
  X,
  Loader2,
  ArrowLeft,
  Save,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProjectEditForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { showSuccess, showError } = useSweetAlert();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [units, setUnits] = useState(0);
  const [startingPrice, setStartingPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [completion, setCompletion] = useState(0);
  const [advantages, setAdvantages] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");

  // File state
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>(
    []
  );
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>(
    []
  );
  const [brochureUrl, setBrochureUrl] = useState("");

  // Load project data
  useEffect(() => {
    let isMounted = true;

    async function loadProject() {
      if (!isInitialLoad) return; // Only load on initial mount

      try {
        setIsLoading(true);
        const response = await getProjectById(projectId);

        if (!isMounted) return;

        if (response.success) {
          const projectData = response.data;
          setProject(projectData);

          // Set form fields
          setName(projectData.name);
          setSlug(projectData.slug);
          setDescription(projectData.description || "");
          setLocation(projectData.location);
          setStatus(projectData.status);
          setUnits(projectData.units);
          setStartingPrice(projectData.startingPrice);
          setMaxPrice(projectData.maxPrice || "");
          setCompletion(projectData.completion);
          setYoutubeLink(projectData.youtubeLink || "");

          // Set advantages as multiline text
          if (projectData.advantages && Array.isArray(projectData.advantages)) {
            setAdvantages(projectData.advantages.join("\n"));
          }

          // Set image previews
          if (projectData.mainImage) {
            setMainImagePreview(projectData.mainImage);
          }

          if (
            projectData.galleryImages &&
            Array.isArray(projectData.galleryImages)
          ) {
            setExistingGalleryImages(projectData.galleryImages);
          }

          // Set brochure info
          if (projectData.brochureUrl) {
            setBrochureUrl(projectData.brochureUrl);
          }

          // Mark initial load as complete
          setIsInitialLoad(false);
        } else {
          if (isMounted) {
            showError("Failed to load project data");
            router.push("/dashboard/projects");
          }
        }
      } catch (error) {
        console.error("Error loading project:", error);
        if (isMounted) {
          showError("An error occurred while loading project data");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (isInitialLoad) {
      loadProject();
    }

    // Cleanup function to prevent state updates after unmounting
    return () => {
      isMounted = false;
    };
  }, [projectId, router, showError, isInitialLoad]);

  // Handle main image change
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle gallery image change
  const handleGalleryImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setGalleryImages((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setGalleryImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // Handle brochure URL change
  const handleBrochureUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrochureUrl(e.target.value);
  };

  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(galleryImagePreviews[index]);
    setGalleryImagePreviews(galleryImagePreviews.filter((_, i) => i !== index));
  };

  // Remove existing gallery image
  const removeExistingGalleryImage = (index: number) => {
    setExistingGalleryImages(
      existingGalleryImages.filter((_, i) => i !== index)
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (isSaving) return;

    setIsSaving(true);

    try {
      const formData = new FormData();

      // Add text fields
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("status", status);
      formData.append("units", units.toString());
      formData.append("startingPrice", startingPrice);
      formData.append("maxPrice", maxPrice);
      formData.append("completion", completion.toString());
      formData.append("youtubeLink", youtubeLink);

      // Add retained gallery images
      existingGalleryImages.forEach((url) => {
        formData.append("existingGalleryImages", url);
      });

      // Process advantages
      const advantagesList = advantages
        .split("\n")
        .filter((line) => line.trim() !== "");

      advantagesList.forEach((advantage) => {
        formData.append("advantages", advantage);
      });

      // Add files if selected
      if (mainImage) {
        formData.append("mainImage", mainImage);
      }

      if (galleryImages.length > 0) {
        galleryImages.forEach((image) => {
          formData.append("galleryImages", image);
        });
      }

      // Add brochure URL to form data
      formData.append("brochureUrl", brochureUrl);

      // Submit form
      const result = await updateProject(projectId, formData);

      if (result.success) {
        showSuccess("Project updated successfully");
        router.push("/dashboard/projects");
      } else {
        throw new Error(result.message || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      showError(
        error instanceof Error ? error.message : "Failed to update project"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading project data...</span>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Edit Project: {name}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="location">Location & Pricing</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="additional">Additional Details</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        // Only auto-update slug if it was empty or derived from the name
                        if (!slug || slug === slugify(name)) {
                          setSlug(slugify(e.target.value));
                        }
                      }}
                      placeholder="e.g., Serene Meadows Residence"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Project Slug</Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="Auto-generated from project name"
                    />
                    <p className="text-xs text-muted-foreground">
                      URL: /projects/{slug || "project-slug"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project in detail..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="status">Type Project *</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="units">Number of Units *</Label>
                    <Input
                      id="units"
                      type="number"
                      value={units}
                      onChange={(e) => setUnits(parseInt(e.target.value) || 0)}
                      min={1}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location & Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location Address *</Label>
                  <Textarea
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Full address of the project"
                    className="min-h-[80px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startingPrice">Starting Price *</Label>
                    <Input
                      id="startingPrice"
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(e.target.value)}
                      placeholder="e.g., 500000000"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum price for a unit in IDR
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxPrice">Maximum Price</Label>
                    <Input
                      id="maxPrice"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="e.g., 1000000000"
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum price for a unit in IDR (optional)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="completion">Completion Percentage</Label>
                  <Input
                    id="completion"
                    type="number"
                    value={completion}
                    onChange={(e) =>
                      setCompletion(parseInt(e.target.value) || 0)
                    }
                    min={0}
                    max={100}
                  />
                  <p className="text-xs text-muted-foreground">
                    Current completion status (0-100%)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Media Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="mainImage">Main Project Image</Label>
                  <div className="flex items-start space-x-4">
                    {mainImagePreview && (
                      <div className="relative w-40 h-40 border rounded-md overflow-hidden">
                        <Image
                          src={mainImagePreview}
                          alt="Main image preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        id="mainImage"
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended size: 1200x800px, max 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="galleryImages">Gallery Images</Label>
                  <Input
                    id="galleryImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Add multiple images to the project gallery. Max 10 images,
                    5MB each.
                  </p>

                  {/* Existing gallery images */}
                  {existingGalleryImages.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">
                        Existing Gallery Images
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                        {existingGalleryImages.map((url, index) => (
                          <div
                            key={`existing-${index}`}
                            className="relative group"
                          >
                            <div className="relative w-full h-24 border rounded-md overflow-hidden">
                              <Image
                                src={url}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExistingGalleryImage(index)}
                              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New gallery images previews */}
                  {galleryImagePreviews.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">
                        New Gallery Images
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                        {galleryImagePreviews.map((preview, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <div className="relative w-full h-24 border rounded-md overflow-hidden">
                              <Image
                                src={preview}
                                alt={`New gallery image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brochureUrl">
                    Project Brochure (PDF Link)
                  </Label>
                  <Input
                    id="brochureUrl"
                    type="url"
                    value={brochureUrl}
                    onChange={handleBrochureUrlChange}
                    placeholder="https://example.com/your-brochure.pdf"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a direct link to your PDF brochure (Google Drive,
                    Dropbox, etc.)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtubeLink">YouTube Video Link</Label>
                  <Input
                    id="youtubeLink"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="e.g., https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Link to a YouTube video showcasing the project
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="advantages">Project Advantages</Label>
                  <Textarea
                    id="advantages"
                    value={advantages}
                    onChange={(e) => setAdvantages(e.target.value)}
                    placeholder="List each advantage on a new line..."
                    className="min-h-[150px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    List key advantages or selling points of the project, one
                    per line
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}

// Helper function to generate slug from title
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
