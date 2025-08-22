"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useState, ReactNode } from "react";
import { createProject } from "@/lib/actions";
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
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import useMultistepForm from "@/hooks/use-multistep-form";
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
  ChevronRight,
  ChevronLeft,
  Check,
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
      {pending ? "Creating Project..." : "Create Project"}
    </Button>
  );
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

// Form step components
function BasicInformationStep({
  projectName,
  setProjectName,
  slug,
  state,
}: {
  projectName: string;
  setProjectName: (name: string) => void;
  slug: string;
  state: any;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Basic Information
        </CardTitle>
        <CardDescription>Essential details about your project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <div className="space-y-2 w-full">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              name="name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Serene Meadows Residence"
              className="w-full"
              required
            />
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="text-sm font-medium text-destructive" key={error}>
                  {error}
                </p>
              ))}
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="slug">Project Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              disabled
              className="bg-muted w-full"
              placeholder="Auto-generated from project name"
            />
            <p className="text-xs text-muted-foreground">
              URL: /projects/{slug || "project-slug"}
            </p>
          </div>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="description">Project Description *</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your project in detail, highlighting key features and unique selling points..."
            className="min-h-[120px] w-full"
            required
          />
          {state.errors?.description &&
            state.errors.description.map((error: string) => (
              <p className="text-sm font-medium text-destructive" key={error}>
                {error}
              </p>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LocationPricingStep() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location & Pricing
        </CardTitle>
        <CardDescription>
          Location details and pricing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 w-full">
        <div className="space-y-2 w-full">
          <Label htmlFor="location">Project Address *</Label>
          <Textarea
            id="location"
            name="location"
            placeholder="Complete address including street, city, province, postal code..."
            className="min-h-[80px] w-full"
            required
          />
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="startingPrice">Starting Price *</Label>
          <div className="relative w-full">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="startingPrice"
              name="startingPrice"
              type="text"
              placeholder="e.g., 850000000"
              className="pl-10 w-full"
              onInput={(e) => {
                // Format number with thousand separators for display
                const target = e.target as HTMLInputElement;
                const value = target.value.replace(/\D/g, "");
                target.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }}
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Enter price in IDR (commas will be added automatically)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function AdditionalInfoStep() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Additional Information
        </CardTitle>
        <CardDescription>
          Extra details and advantages of your project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 w-full">
        <div className="space-y-2 w-full">
          <Label htmlFor="brochureUrl">Project Brochure URL</Label>
          <div className="relative w-full">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="brochureUrl"
              name="brochureUrl"
              type="url"
              placeholder="https://example.com/project-brochure.pdf"
              className="pl-10 w-full"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Link to downloadable project brochure (PDF format recommended)
          </p>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="locationAdvantages">Location Advantages</Label>
          <Textarea
            id="locationAdvantages"
            name="locationAdvantages"
            placeholder="Describe the strategic advantages of this location (e.g., near schools, shopping centers, transportation hubs, etc.)"
            className="min-h-[100px] w-full"
          />
          <p className="text-xs text-muted-foreground">
            Highlight what makes this location special and convenient
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function MediaAssetsStep({
  youtubeUrl,
  setYoutubeUrl,
  youtubeEmbedUrl,
  galleryImages,
  addGalleryImage,
  removeGalleryImage,
  updateGalleryImage,
}: {
  youtubeUrl: string;
  setYoutubeUrl: (url: string) => void;
  youtubeEmbedUrl: string;
  galleryImages: string[];
  addGalleryImage: () => void;
  removeGalleryImage: (index: number) => void;
  updateGalleryImage: (index: number, url: string) => void;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Media Assets
        </CardTitle>
        <CardDescription>
          Visual content to showcase your project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 w-full">
        <div className="space-y-2 w-full">
          <Label htmlFor="mainImage">Main Project Image *</Label>
          <Input
            id="mainImage"
            name="mainImage"
            type="url"
            placeholder="https://example.com/main-image.jpg"
            className="w-full"
            required
          />
          <p className="text-xs text-muted-foreground">
            Primary image that will be displayed as the project hero image
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

        <div className="space-y-2 w-full">
          <Label htmlFor="youtubeUrl">YouTube Video URL</Label>
          <div className="space-y-3 w-full">
            <Input
              id="youtubeUrl"
              name="youtubeUrl"
              type="url"
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full"
            />
            {youtubeEmbedUrl && (
              <div className="aspect-video w-full">
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
            Add a YouTube video to showcase your project virtually
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectForm() {
  const initialState = { message: undefined, errors: {} };
  const [state, dispatch] = useActionState(createProject, initialState);
  const { toast } = useToast();
  const { showError } = useSweetAlert();

  // Form state
  const [projectName, setProjectName] = useState("");
  const [slug, setSlug] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Step indicator states
  const [isBasicValid, setIsBasicValid] = useState(false);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [isMediaValid, setIsMediaValid] = useState(false);

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

  // Define the form steps
  const { steps, currentStepIndex, step, isFirstStep, isLastStep, next, back } =
    useMultistepForm([
      <BasicInformationStep
        key="basic"
        projectName={projectName}
        setProjectName={setProjectName}
        slug={slug}
        state={state}
      />,
      <LocationPricingStep key="location" />,
      <MediaAssetsStep
        key="media"
        youtubeUrl={youtubeUrl}
        setYoutubeUrl={setYoutubeUrl}
        youtubeEmbedUrl={youtubeEmbedUrl}
        galleryImages={galleryImages}
        addGalleryImage={addGalleryImage}
        removeGalleryImage={removeGalleryImage}
        updateGalleryImage={updateGalleryImage}
      />,
      <AdditionalInfoStep key="additional" />,
    ]);

  // Auto-generate slug when project name changes
  useEffect(() => {
    if (projectName) {
      setSlug(generateSlug(projectName));
    }
  }, [projectName]);

  // Update YouTube embed URL when URL changes
  useEffect(() => {
    if (youtubeUrl) {
      const embedUrl = getYouTubeEmbedUrl(youtubeUrl);
      setYoutubeEmbedUrl(embedUrl);
    } else {
      setYoutubeEmbedUrl("");
    }
  }, [youtubeUrl]);

  useEffect(() => {
    if (state.message) {
      showError(state.message);
    }
  }, [state, showError]);

  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header */}
      <div className="space-y-2 w-full">
        <h1 className="text-3xl font-bold font-headline">Create New Project</h1>
        <p className="text-muted-foreground">
          Fill in the comprehensive details to showcase your property project
          effectively
        </p>
      </div>

      {/* Progress indicator */}
      <div className="w-full">
        <div className="flex justify-between mb-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`flex items-center ${index > 0 ? "ml-2" : ""}`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStepIndex === index
                    ? "bg-primary text-primary-foreground border-primary"
                    : currentStepIndex > index
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-muted border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {currentStepIndex > index ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStepIndex > index ? "bg-primary/50" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Basic Information</span>
          <span>Location & Pricing</span>
          <span>Media Assets</span>
          <span>Additional Info</span>
        </div>
      </div>

      <form action={dispatch} className="w-full">
        {/* Current step content */}
        <div className="mb-6">{step}</div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={back}
            disabled={isFirstStep}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {isLastStep ? (
              <SubmitButton />
            ) : (
              <Button type="button" onClick={next}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
