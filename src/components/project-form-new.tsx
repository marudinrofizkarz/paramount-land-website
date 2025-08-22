"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useState, ReactNode } from "react";
import { createProject } from "@/lib/project-actions";
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
import { useRouter } from "next/navigation";
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
  Loader2,
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
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        "Create Project"
      )}
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
  setSlug,
  description,
  setDescription,
  status,
  setStatus,
  units,
  setUnits,
  errors,
}: {
  projectName: string;
  setProjectName: (name: string) => void;
  slug: string;
  setSlug: (slug: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  status: string;
  setStatus: (status: string) => void;
  units: number;
  setUnits: (units: number) => void;
  errors: any;
}) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setProjectName(name);
    setSlug(generateSlug(name));
  };

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
              onChange={handleNameChange}
              placeholder="e.g., Serene Meadows Residence"
              className="w-full"
              required
            />
            {errors?.name && (
              <p className="text-sm font-medium text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="slug">Project Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full"
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project in detail, highlighting key features and unique selling points..."
            className="min-h-[120px] w-full"
            required
          />
          {errors?.description && (
            <p className="text-sm font-medium text-destructive">
              {errors.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
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
              name="units"
              type="number"
              min={1}
              value={units}
              onChange={(e) => setUnits(parseInt(e.target.value))}
              className="w-full"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LocationPricingStep({
  location,
  setLocation,
  startingPrice,
  setStartingPrice,
  maxPrice,
  setMaxPrice,
  completion,
  setCompletion,
  errors,
}: {
  location: string;
  setLocation: (location: string) => void;
  startingPrice: string;
  setStartingPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  completion: number;
  setCompletion: (completion: number) => void;
  errors: any;
}) {
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
          <Label htmlFor="location">Project Location *</Label>
          <Textarea
            id="location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Complete address including street, city, province, postal code..."
            className="min-h-[80px] w-full"
            required
          />
          {errors?.location && (
            <p className="text-sm font-medium text-destructive">
              {errors.location}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2 w-full">
            <Label htmlFor="startingPrice">Starting Price *</Label>
            <div className="relative w-full">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="startingPrice"
                name="startingPrice"
                type="text"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="e.g., Rp 850M"
                className="pl-10 w-full"
                required
              />
            </div>
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="maxPrice">Maximum Price</Label>
            <div className="relative w-full">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="maxPrice"
                name="maxPrice"
                type="text"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g., Rp 1.2B"
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="completion">Completion Progress: {completion}%</Label>
          <input
            id="completion"
            type="range"
            min="0"
            max="100"
            value={completion}
            onChange={(e) => setCompletion(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MediaAssetsStep({
  mainImage,
  setMainImage,
  galleryImages,
  setGalleryImages,
  youtubeLink,
  setYoutubeLink,
  brochureUrl,
  setBrochureUrl,
  errors,
}: {
  mainImage: File | null;
  setMainImage: (file: File | null) => void;
  galleryImages: File[];
  setGalleryImages: (files: File[]) => void;
  youtubeLink: string;
  setYoutubeLink: (url: string) => void;
  brochureUrl: string;
  setBrochureUrl: (url: string) => void;
  errors: any;
}) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Generate preview URLs when gallery images change
  useEffect(() => {
    const urls = galleryImages.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Cleanup
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryImages]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  const handleGalleryImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setGalleryImages(Array.from(e.target.files));
    }
  };

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
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="w-full"
            required
          />
          {mainImage && (
            <div className="mt-2 relative aspect-video w-full max-w-md overflow-hidden rounded-lg border border-muted">
              <img
                src={URL.createObjectURL(mainImage)}
                alt="Main image preview"
                className="object-cover w-full h-full"
              />
            </div>
          )}
          {errors?.mainImage && (
            <p className="text-sm font-medium text-destructive">
              {errors.mainImage}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="galleryImages">Gallery Images</Label>
          </div>
          <Input
            id="galleryImages"
            name="galleryImages"
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryImagesChange}
            className="w-full"
          />
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-video overflow-hidden rounded-lg border border-muted"
                >
                  <img
                    src={url}
                    alt={`Gallery image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="youtubeLink">YouTube Video URL</Label>
          <Input
            id="youtubeLink"
            name="youtubeLink"
            type="url"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Add a YouTube video to showcase your project virtually
          </p>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="brochureUrl">Project Brochure (PDF Link)</Label>
          <Input
            id="brochureUrl"
            name="brochureUrl"
            type="url"
            value={brochureUrl}
            onChange={(e) => setBrochureUrl(e.target.value)}
            placeholder="https://example.com/your-brochure.pdf"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Enter a direct link to your PDF brochure (Google Drive, Dropbox,
            etc.)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function AdditionalInfoStep({
  advantages,
  setAdvantages,
}: {
  advantages: string;
  setAdvantages: (advantages: string) => void;
}) {
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
          <Label htmlFor="advantages">Location Advantages</Label>
          <Textarea
            id="advantages"
            name="advantages"
            value={advantages}
            onChange={(e) => setAdvantages(e.target.value)}
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

export function ProjectForm() {
  const { toast } = useToast();
  const { showError, showSuccess } = useSweetAlert();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Form state
  const [projectName, setProjectName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("residential");
  const [units, setUnits] = useState(1);
  const [location, setLocation] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [completion, setCompletion] = useState(0);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [brochureUrl, setBrochureUrl] = useState("");
  const [advantages, setAdvantages] = useState("");

  // Define the form steps
  const { steps, currentStepIndex, step, isFirstStep, isLastStep, next, back } =
    useMultistepForm([
      <BasicInformationStep
        key="basic"
        projectName={projectName}
        setProjectName={setProjectName}
        slug={slug}
        setSlug={setSlug}
        description={description}
        setDescription={setDescription}
        status={status}
        setStatus={setStatus}
        units={units}
        setUnits={setUnits}
        errors={errors}
      />,
      <LocationPricingStep
        key="location"
        location={location}
        setLocation={setLocation}
        startingPrice={startingPrice}
        setStartingPrice={setStartingPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        completion={completion}
        setCompletion={setCompletion}
        errors={errors}
      />,
      <MediaAssetsStep
        key="media"
        mainImage={mainImage}
        setMainImage={setMainImage}
        galleryImages={galleryImages}
        setGalleryImages={setGalleryImages}
        youtubeLink={youtubeLink}
        setYoutubeLink={setYoutubeLink}
        brochureUrl={brochureUrl}
        setBrochureUrl={setBrochureUrl}
        errors={errors}
      />,
      <AdditionalInfoStep
        key="additional"
        advantages={advantages}
        setAdvantages={setAdvantages}
      />,
    ]);

  // Validate current step
  const validateCurrentStep = () => {
    let isValid = true;
    const newErrors: any = {};

    if (currentStepIndex === 0) {
      if (!projectName) {
        newErrors.name = "Project name is required";
        isValid = false;
      }
      if (!description) {
        newErrors.description = "Description is required";
        isValid = false;
      }
    } else if (currentStepIndex === 1) {
      if (!location) {
        newErrors.location = "Location is required";
        isValid = false;
      }
      if (!startingPrice) {
        newErrors.startingPrice = "Starting price is required";
        isValid = false;
      }
    } else if (currentStepIndex === 2) {
      if (!mainImage) {
        newErrors.mainImage = "Main image is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle next step
  const handleNext = () => {
    if (validateCurrentStep()) {
      next();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate required files
      if (!mainImage) {
        throw new Error("Main project image is required");
      }

      const formData = new FormData();

      // Add text fields
      formData.append("name", projectName);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("status", status);
      formData.append("units", units.toString());
      formData.append("location", location);
      formData.append("startingPrice", startingPrice);
      formData.append("maxPrice", maxPrice);
      formData.append("completion", completion.toString());
      formData.append("youtubeLink", youtubeLink);

      // Process advantages
      const advantagesList = advantages
        .split("\n")
        .filter((line) => line.trim() !== "");

      advantagesList.forEach((advantage) => {
        formData.append("advantages", advantage);
      });

      // Add files
      if (mainImage) {
        console.log(
          `Adding main image: ${mainImage.name}, ${mainImage.size} bytes`
        );
        formData.append("mainImage", mainImage);
      }

      if (galleryImages.length > 0) {
        console.log(`Adding ${galleryImages.length} gallery images`);
        galleryImages.forEach((image, index) => {
          console.log(
            `Gallery image ${index + 1}: ${image.name}, ${image.size} bytes`
          );
          formData.append("galleryImages", image);
        });
      }

      // Add brochure URL directly
      if (brochureUrl) {
        console.log(`Adding brochure URL: ${brochureUrl}`);
        formData.append("brochureUrl", brochureUrl);
      }

      // Submit form with improved error handling
      console.log("Submitting form data to server...");
      const result = await createProject(formData);

      if (result.success) {
        showSuccess("Project created successfully");
        router.push("/dashboard/projects");
      } else {
        throw new Error(result.message || "Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);

      // Use the SweetAlert hook for showing errors
      showError(
        error instanceof Error ? error.message : "Failed to create project"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-none space-y-6 overflow-visible">
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

      <form onSubmit={handleSubmit} className="w-full">
        {/* Current step content */}
        <div className="mb-6">{step}</div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={back}
            disabled={isFirstStep || isSubmitting}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {isLastStep ? (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
              >
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
