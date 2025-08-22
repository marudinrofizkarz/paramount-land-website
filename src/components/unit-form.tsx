"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useRef, useState } from "react";
import { createUnit } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
  Home,
  Ruler,
  Bath,
  Bed,
  Car,
  Shield,
} from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      className="w-full md:w-auto"
      disabled={pending}
    >
      {pending ? "Adding Unit..." : "Add Unit"}
    </Button>
  );
}

interface UnitFormProps {
  projectSlug: string;
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// YouTube URL validation and embed conversion
function getYouTubeEmbedUrl(url: string): string {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
}

export function UnitForm({ projectSlug }: UnitFormProps) {
  const initialState = { message: undefined, errors: {}, success: undefined };
  const createUnitWithSlug = createUnit.bind(null, projectSlug);
  const [state, dispatch] = useActionState(createUnitWithSlug, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  // Form states
  const [unitName, setUnitName] = useState("");
  const [slug, setSlug] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [floorCount, setFloorCount] = useState<string>("");
  const [customFloor, setCustomFloor] = useState("");

  // Auto-generate slug when unit name changes
  useEffect(() => {
    if (unitName) {
      setSlug(generateSlug(unitName));
    }
  }, [unitName]);

  // Update YouTube embed URL when URL changes
  useEffect(() => {
    if (youtubeUrl) {
      const embedUrl = getYouTubeEmbedUrl(youtubeUrl);
      setYoutubeEmbedUrl(embedUrl);
    } else {
      setYoutubeEmbedUrl("");
    }
  }, [youtubeUrl]);

  // Handle gallery image addition
  const addGalleryImage = () => {
    setGalleryImages([...galleryImages, ""]);
  };

  // Handle gallery image removal
  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  // Handle gallery image URL change
  const updateGalleryImage = (index: number, url: string) => {
    const newImages = [...galleryImages];
    newImages[index] = url;
    setGalleryImages(newImages);
  };

  useEffect(() => {
    if (state.message) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
    if (state.success) {
      toast({
        title: "Success!",
        description: "New unit has been added.",
      });
      formRef.current?.reset();
      // Reset all states
      setUnitName("");
      setSlug("");
      setYoutubeUrl("");
      setYoutubeEmbedUrl("");
      setGalleryImages([]);
      setFloorCount("");
      setCustomFloor("");
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Add New Unit</h1>
        <p className="text-muted-foreground">
          Create a comprehensive unit profile with detailed specifications and
          media
        </p>
      </div>

      <form ref={formRef} action={dispatch} className="space-y-8">
        {/* Basic Unit Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Basic Unit Information
            </CardTitle>
            <CardDescription>
              Essential details about this unit type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Unit Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  placeholder="e.g., 2-Bedroom Deluxe Villa"
                  required
                />
                {state.errors?.name && (
                  <p className="text-sm font-medium text-destructive">
                    {state.errors.name[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Unit Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  disabled
                  className="bg-muted"
                  placeholder="Auto-generated from unit name"
                />
                <p className="text-xs text-muted-foreground">
                  URL: /units/{slug || "unit-slug"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Unit Type *</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
                {state.errors?.type && (
                  <p className="text-sm font-medium text-destructive">
                    {state.errors.type[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="salePrice"
                    name="salePrice"
                    type="text"
                    placeholder="e.g., 650000000"
                    className="pl-10"
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      const value = target.value.replace(/\D/g, "");
                      target.value = value.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      );
                    }}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Sale price in IDR (commas will be added automatically)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Unit Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Detailed description of the unit, highlighting key features and amenities..."
                className="min-h-[120px]"
                required
              />
              {state.errors?.description && (
                <p className="text-sm font-medium text-destructive">
                  {state.errors.description[0]}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location & Dimensions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Location & Dimensions
            </CardTitle>
            <CardDescription>
              Physical specifications and location details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">Unit Address *</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Complete address including unit number, building, street..."
                className="min-h-[80px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dimensions">
                  Dimensions (Length x Width) *
                </Label>
                <Input
                  id="dimensions"
                  name="dimensions"
                  placeholder="e.g., 10m x 15m"
                  required
                />
                {state.errors?.dimensions && (
                  <p className="text-sm font-medium text-destructive">
                    {state.errors.dimensions[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="landArea">Land Area (m²) *</Label>
                <Input
                  id="landArea"
                  name="landArea"
                  type="number"
                  placeholder="e.g., 150"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buildingArea">Building Area (m²) *</Label>
                <Input
                  id="buildingArea"
                  name="buildingArea"
                  type="number"
                  placeholder="e.g., 120"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unit Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Unit Specifications
            </CardTitle>
            <CardDescription>
              Detailed specifications and features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  Bedrooms
                </Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  min="0"
                  placeholder="e.g., 3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="flex items-center gap-2">
                  <Bath className="h-4 w-4" />
                  Bathrooms
                </Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  min="0"
                  placeholder="e.g., 2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carports" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Carports
                </Label>
                <Input
                  id="carports"
                  name="carports"
                  type="number"
                  min="0"
                  placeholder="e.g., 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floors">Floors</Label>
                <Select
                  value={floorCount}
                  onValueChange={setFloorCount}
                  name="floors"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select floors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Floor</SelectItem>
                    <SelectItem value="2">2 Floors</SelectItem>
                    <SelectItem value="3">3 Floors</SelectItem>
                    <SelectItem value="4">4 Floors</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {floorCount === "custom" && (
                  <Input
                    name="customFloors"
                    value={customFloor}
                    onChange={(e) => setCustomFloor(e.target.value)}
                    placeholder="Enter custom floor count"
                    type="number"
                    min="1"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facilities">Facilities & Amenities</Label>
              <Textarea
                id="facilities"
                name="facilities"
                placeholder="List all facilities and amenities (e.g., Swimming pool, Gym, Garden, Security, etc.)"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="certification"
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Certification *
              </Label>
              <Select name="certification" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select certification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SHM">
                    SHM (Sertifikat Hak Milik)
                  </SelectItem>
                  <SelectItem value="SHGB">
                    SHGB (Sertifikat Hak Guna Bangunan)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Media Assets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Media Assets
            </CardTitle>
            <CardDescription>
              Visual content to showcase this unit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mainImage">Main Unit Image *</Label>
              <Input
                id="mainImage"
                name="mainImage"
                type="url"
                placeholder="https://example.com/unit-main-image.jpg"
                required
              />
              <p className="text-xs text-muted-foreground">
                Primary image that will be displayed as the unit hero image
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Gallery Images</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGalleryImage}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
              </div>

              {galleryImages.map((image, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    name={`galleryImage${index}`}
                    type="url"
                    placeholder={`Gallery image ${index + 1} URL`}
                    value={image}
                    onChange={(e) => updateGalleryImage(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGalleryImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {galleryImages.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No gallery images added yet. Click "Add Image" to start adding
                  images.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube Video URL</Label>
              <div className="space-y-3">
                <Input
                  id="youtubeUrl"
                  name="youtubeUrl"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
                {youtubeEmbedUrl && (
                  <div className="aspect-video w-full max-w-2xl">
                    <iframe
                      src={youtubeEmbedUrl}
                      title="YouTube video preview"
                      className="w-full h-full rounded-lg border"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Add a YouTube video to showcase this unit virtually
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Additional Information
            </CardTitle>
            <CardDescription>Extra details and documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="brochureUrl">Unit Brochure URL</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="brochureUrl"
                  name="brochureUrl"
                  type="url"
                  placeholder="https://example.com/unit-brochure.pdf"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Link to downloadable unit brochure (PDF format recommended)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
