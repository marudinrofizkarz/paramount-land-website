"use client";

import React from "react";
import { useState, useRef, useEffect, useActionState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { createUnit } from "@/lib/unit-actions";
import { getProjectBySlug } from "@/lib/project-actions";
import useMultistepForm from "@/hooks/use-multistep-form";
import { slugify } from "@/lib/utils";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Rich Text Editor
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import { Link as TiptapLink } from "@tiptap/extension-link";
import { Image as TiptapImage } from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

// Icons
import {
  Building2,
  Camera,
  DollarSign,
  Bed,
  Bath,
  Car,
  LayoutGrid,
  Check,
  ChevronRight,
  ChevronLeft,
  UploadCloud,
  X,
  Trash2,
  Info,
  Save,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link as LinkIcon,
  ImageIcon,
  FileText,
  ArrowLeft,
  Home,
  Ruler,
  MapPin,
  Shield,
} from "lucide-react";

// Initialize form state
const initialState = {
  errors: {},
  message: null,
  success: false,
};

export default function NewUnitPage() {
  const router = useRouter();
  const params = useParams();
  const projectSlug = params.slug as string;
  const { toast } = useToast();

  // Project state
  const [project, setProject] = useState<any>(null);
  const [projectLoading, setProjectLoading] = useState(true);

  // Form state
  const [unitName, setUnitName] = useState("");
  const [unitSlug, setUnitSlug] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>(
    []
  );
  const [dimensions, setDimensions] = useState({ length: "", width: "" });
  const [landArea, setLandArea] = useState("");
  const [buildingArea, setBuildingArea] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [carports, setCarports] = useState("");
  const [floors, setFloors] = useState("1");
  const [customFloors, setCustomFloors] = useState("");
  const [certification, setCertification] = useState("SHGB");
  const [facilities, setFacilities] = useState<string[]>([]);
  const [customFacility, setCustomFacility] = useState("");
  const [promo, setPromo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editor for rich text description
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      TiptapLink.configure({ openOnClick: false }),
      TiptapImage,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TextStyle,
      Color,
    ],
    content: "<p>Describe this unit type...</p>",
    immediatelyRender: false,
  });

  // Common facilities for selection
  const commonFacilities = [
    "Swimming Pool",
    "Garden",
    "Playground",
    "Security",
    "Club House",
    "Gym",
    "Smart Home",
    "CCTV",
    "High Ceiling",
    "Private Pool",
  ];

  // Server action with form state
  const [state, formAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      // Add projectId to formData since createUnit expects it
      if (project?.id) {
        formData.append("projectId", project.id);
      }
      return createUnit(formData);
    },
    initialState
  );

  // Auto-generate slug from name
  useEffect(() => {
    if (unitName) {
      setUnitSlug(slugify(unitName));
    }
  }, [unitName]);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectBySlug(projectSlug);
        if (response.success && response.data) {
          setProject(response.data);
        } else {
          toast({
            title: "Error",
            description: response.message || "Project not found",
            variant: "destructive",
          });
          router.push("/dashboard/projects");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to load project data",
          variant: "destructive",
        });
      } finally {
        setProjectLoading(false);
      }
    };

    fetchProject();
  }, [projectSlug, router, toast]);

  // Steps metadata
  const stepsMetadata = [
    {
      id: "basic-info",
      name: "Basic Information",
      icon: <Home className="h-5 w-5" />,
    },
    {
      id: "dimensions",
      name: "Dimensions & Features",
      icon: <Ruler className="h-5 w-5" />,
    },
    {
      id: "media",
      name: "Media & Gallery",
      icon: <Camera className="h-5 w-5" />,
    },
    {
      id: "description",
      name: "Description & Facilities",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "review",
      name: "Review & Submit",
      icon: <Check className="h-5 w-5" />,
    },
  ];

  // Set up multistep form with simple divs as placeholders
  const { currentStepIndex, step, isFirstStep, isLastStep, back, next, goTo } =
    useMultistepForm([
      <div key="basic-info">Basic Info Step</div>,
      <div key="dimensions">Dimensions Step</div>,
      <div key="media">Media Step</div>,
      <div key="description">Description Step</div>,
      <div key="review">Review Step</div>,
    ]); // Handle file uploads for main image
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file uploads for gallery images
  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setGalleryImageFiles((prev) => [...prev, ...newFiles]);

      const readers = newFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((results) => {
        setGalleryImagePreviews((prev) => [...prev, ...results]);
      });
    }
  };

  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    setGalleryImageFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle facility selection
  const toggleFacility = (facility: string) => {
    setFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  // Add custom facility
  const addCustomFacility = () => {
    if (customFacility.trim()) {
      setFacilities((prev) => [...prev, customFacility.trim()]);
      setCustomFacility("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create a FormData object for submission
    const formData = new FormData();
    formData.append("name", unitName);
    formData.append("slug", unitSlug);
    formData.append("type", unitName); // Using name as type for now
    formData.append("salePrice", salePrice);
    formData.append("description", editor?.getHTML() || "");
    formData.append("address", ""); // We're using project location
    formData.append(
      "dimensions",
      `${dimensions.length}m x ${dimensions.width}m`
    );
    formData.append("landArea", landArea);
    formData.append("buildingArea", buildingArea);
    formData.append("bedrooms", bedrooms);
    formData.append("bathrooms", bathrooms);
    formData.append("carports", carports);

    // Handle floors selection
    if (floors === "custom") {
      formData.append("floors", "custom");
      formData.append("customFloors", customFloors);
    } else {
      formData.append("floors", floors);
    }

    formData.append("facilities", JSON.stringify(facilities));
    formData.append("certification", certification);

    // Add promo if available
    if (promo) {
      formData.append("promo", promo);
    }

    // Add main image
    if (mainImagePreview) {
      formData.append("mainImage", mainImagePreview);
    }

    // Add gallery images
    galleryImagePreviews.forEach((preview, index) => {
      formData.append(`galleryImage${index}`, preview);
    });

    // Submit the form
    try {
      // Add project ID to formData
      if (project?.id) {
        formData.append("projectId", project.id);
      }

      const result = await createUnit(formData);

      if (result.success) {
        toast({
          title: "Success!",
          description: "Unit has been created successfully.",
        });
        router.push(`/dashboard/projects/${projectSlug}/units`);
      } else {
        toast({
          title: "Error",
          description:
            result.error || "Failed to create unit. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Editor toolbar component
  const EditorToolbar = () => {
    if (!editor) return null;

    return (
      <div className="border border-input rounded-t-md p-1 bg-muted/50 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-muted" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-muted" : ""}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <div className="h-6 border-l mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "bg-muted" : ""}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={editor.isActive({ textAlign: "center" }) ? "bg-muted" : ""}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "bg-muted" : ""}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <div className="h-6 border-l mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-muted" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-muted" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Show loading state while fetching project data
  if (projectLoading) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Units
          </div>
          <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <div className="mb-8">
        <Link
          href={`/dashboard/projects/${projectSlug}/units`}
          className="flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Units
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add New Unit Type</h1>
        <p className="text-muted-foreground">
          Create a new unit type for project: {projectSlug}
        </p>
      </div>

      <div className="mb-8">
        <Progress
          value={((currentStepIndex + 1) / stepsMetadata.length) * 100}
          className="h-2"
        />

        <div className="mt-4 grid grid-cols-5 gap-1 md:gap-2">
          {stepsMetadata.map((s: any, i: number) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`flex items-center justify-center p-2 md:p-3 rounded-md transition-colors ${
                i === currentStepIndex
                  ? "bg-primary text-primary-foreground"
                  : i < currentStepIndex
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <div className="flex flex-col items-center md:flex-row md:items-center">
                <div
                  className={`${
                    i < currentStepIndex ? "" : "mb-1 md:mb-0 md:mr-2"
                  }`}
                >
                  {i < currentStepIndex ? (
                    <Check className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <span className="block md:hidden">
                      {React.cloneElement(s.icon, { className: "h-4 w-4" })}
                    </span>
                  )}
                  <span className="hidden md:block">
                    {React.cloneElement(s.icon, { className: "h-5 w-5" })}
                  </span>
                </div>
                <span className="text-xs md:text-sm font-medium md:inline">
                  <span className="block md:hidden">{i + 1}</span>
                  <span className="hidden md:block">{s.name}</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {currentStepIndex === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details for this unit type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="unitName">
                    Unit Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="unitName"
                    placeholder="e.g. Type A, Luxury Villa, etc."
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    required
                  />
                  {state.error && (
                    <p className="text-sm text-red-500">{state.error}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitSlug">
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="unitSlug"
                    placeholder="unit-slug"
                    value={unitSlug}
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-generated from unit name
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salePrice">
                    Sale Price <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="salePrice"
                      placeholder="e.g. 1,500,000,000"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {state.error && (
                    <p className="text-sm text-red-500">{state.error}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certification">
                    Certification <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={certification}
                    onValueChange={setCertification}
                  >
                    <SelectTrigger id="certification">
                      <SelectValue placeholder="Select certification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SHGB">
                        SHGB (Hak Guna Bangunan)
                      </SelectItem>
                      <SelectItem value="SHM">SHM (Hak Milik)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={next}
                disabled={!unitName || !salePrice}
              >
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Dimensions & Features */}
        {currentStepIndex === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Dimensions & Features</CardTitle>
              <CardDescription>
                Add specifications and features of this unit type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>
                    Dimensions (Length × Width){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Input
                        placeholder="Length"
                        value={dimensions.length}
                        onChange={(e) =>
                          setDimensions({
                            ...dimensions,
                            length: e.target.value,
                          })
                        }
                        required
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        m
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="Width"
                        value={dimensions.width}
                        onChange={(e) =>
                          setDimensions({
                            ...dimensions,
                            width: e.target.value,
                          })
                        }
                        required
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        m
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="landArea">
                      Land Area <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="landArea"
                        placeholder="e.g. 120"
                        value={landArea}
                        onChange={(e) => setLandArea(e.target.value)}
                        required
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        m²
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buildingArea">
                      Building Area <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="buildingArea"
                        placeholder="e.g. 90"
                        value={buildingArea}
                        onChange={(e) => setBuildingArea(e.target.value)}
                        required
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        m²
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger id="bedrooms">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Select value={bathrooms} onValueChange={setBathrooms}>
                    <SelectTrigger id="bathrooms">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carports">Carports</Label>
                  <Select value={carports} onValueChange={setCarports}>
                    <SelectTrigger id="carports">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floors">Floors</Label>
                  <Select value={floors} onValueChange={setFloors}>
                    <SelectTrigger id="floors">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>

                  {floors === "custom" && (
                    <Input
                      placeholder="Specify number of floors"
                      value={customFloors}
                      onChange={(e) => setCustomFloors(e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={back}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                type="button"
                onClick={next}
                disabled={
                  !dimensions.length ||
                  !dimensions.width ||
                  !landArea ||
                  !buildingArea
                }
              >
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Media & Gallery */}
        {currentStepIndex === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Media & Gallery</CardTitle>
              <CardDescription>
                Upload images to showcase this unit type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>
                  Main Image <span className="text-red-500">*</span>
                </Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
                  {mainImagePreview ? (
                    <div className="relative w-full max-w-md mx-auto">
                      <Image
                        src={mainImagePreview}
                        alt="Main unit image preview"
                        width={500}
                        height={300}
                        className="rounded-md object-cover aspect-video"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => {
                          setMainImageFile(null);
                          setMainImagePreview("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Drag & drop your main image here, or
                      </p>
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 w-full cursor-pointer"
                          onChange={handleMainImageChange}
                          required={!mainImagePreview}
                        />
                        <Button type="button" variant="secondary" size="sm">
                          Browse Files
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Recommended: 1200×800px, max 2MB
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <Label>Gallery Images (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
                  <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Drag & drop your gallery images here, or
                  </p>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="absolute inset-0 opacity-0 w-full cursor-pointer"
                      onChange={handleGalleryImageChange}
                    />
                    <Button type="button" variant="secondary" size="sm">
                      Browse Files
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Select multiple images to upload. Max 10 images.
                  </p>
                </div>

                {galleryImagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {galleryImagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative rounded-md overflow-hidden aspect-video"
                      >
                        <Image
                          src={preview}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={back}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button type="button" onClick={next} disabled={!mainImagePreview}>
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 4: Description & Facilities */}
        {currentStepIndex === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Description & Facilities</CardTitle>
              <CardDescription>
                Add a detailed description and available facilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>
                  Description <span className="text-red-500">*</span>
                </Label>
                <div className="border rounded-md overflow-hidden">
                  <EditorToolbar />
                  <EditorContent
                    editor={editor}
                    className="prose prose-sm max-w-none p-3 min-h-[200px] focus:outline-none"
                  />
                </div>
                {state.error && (
                  <p className="text-sm text-red-500">{state.error}</p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <Label>Unit Promo</Label>
                <Textarea
                  placeholder="Enter special promotion details here (e.g., 'Limited Time Offer: 10% Off', 'Free Interior Package', etc.)"
                  className="min-h-[100px]"
                  id="promo"
                  name="promo"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  If left empty, no promo section will appear on the unit page
                </p>
              </div>

              <div className="space-y-4">
                <Label>Facilities</Label>
                <div className="border rounded-md p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {commonFacilities.map((facility) => (
                      <div
                        key={facility}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`facility-${facility}`}
                          checked={facilities.includes(facility)}
                          onCheckedChange={() => toggleFacility(facility)}
                        />
                        <label
                          htmlFor={`facility-${facility}`}
                          className="text-sm cursor-pointer"
                        >
                          {facility}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="customFacility" className="text-sm">
                      Add Custom Facility
                    </Label>
                    <div className="flex mt-1 gap-2">
                      <Input
                        id="customFacility"
                        placeholder="e.g. Home Theater"
                        value={customFacility}
                        onChange={(e) => setCustomFacility(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addCustomFacility}
                        disabled={!customFacility.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {facilities.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm">Selected Facilities</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {facilities.map((facility) => (
                          <div
                            key={facility}
                            className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
                          >
                            {facility}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1"
                              onClick={() => toggleFacility(facility)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={back}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                type="button"
                onClick={next}
                disabled={
                  !editor?.getHTML() ||
                  editor?.getHTML() === "<p>Describe this unit type...</p>"
                }
              >
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 5: Review & Submit */}
        {currentStepIndex === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>
                Review all information before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium text-lg mb-4">
                    Basic Information
                  </h3>
                  <dl className="space-y-2">
                    <div className="flex flex-col">
                      <dt className="text-sm text-muted-foreground">
                        Unit Name
                      </dt>
                      <dd className="font-medium">{unitName}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-sm text-muted-foreground">Slug</dt>
                      <dd className="font-medium">{unitSlug}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-sm text-muted-foreground">
                        Sale Price
                      </dt>
                      <dd className="font-medium">{salePrice}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-sm text-muted-foreground">
                        Certification
                      </dt>
                      <dd className="font-medium">{certification}</dd>
                    </div>
                  </dl>

                  <h3 className="font-medium text-lg mt-6 mb-4">
                    Dimensions & Features
                  </h3>
                  <dl className="space-y-2">
                    <div className="flex flex-col">
                      <dt className="text-sm text-muted-foreground">
                        Dimensions
                      </dt>
                      <dd className="font-medium">
                        {dimensions.length}m × {dimensions.width}m
                      </dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-sm text-muted-foreground">
                        Land Area
                      </dt>
                      <dd className="font-medium">{landArea} m²</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-sm text-muted-foreground">
                        Building Area
                      </dt>
                      <dd className="font-medium">{buildingArea} m²</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <dt className="text-sm text-muted-foreground">
                          Bedrooms
                        </dt>
                        <dd className="font-medium">{bedrooms || "-"}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm text-muted-foreground">
                          Bathrooms
                        </dt>
                        <dd className="font-medium">{bathrooms || "-"}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm text-muted-foreground">
                          Carports
                        </dt>
                        <dd className="font-medium">{carports || "-"}</dd>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-sm text-muted-foreground">Floors</dt>
                      <dd className="font-medium">
                        {floors === "custom" ? customFloors : floors}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-4">Media</h3>
                  {mainImagePreview ? (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Main Image
                      </p>
                      <div className="relative rounded-md overflow-hidden aspect-video">
                        <Image
                          src={mainImagePreview}
                          alt="Main unit image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No main image uploaded
                    </p>
                  )}

                  {galleryImagePreviews.length > 0 && (
                    <>
                      <p className="text-sm text-muted-foreground mt-4 mb-2">
                        Gallery Images ({galleryImagePreviews.length})
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {galleryImagePreviews
                          .slice(0, 6)
                          .map((preview, index) => (
                            <div
                              key={index}
                              className="relative rounded-md overflow-hidden aspect-square"
                            >
                              <Image
                                src={preview}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        {galleryImagePreviews.length > 6 && (
                          <div className="relative rounded-md overflow-hidden aspect-square bg-muted/80 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              +{galleryImagePreviews.length - 6} more
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <h3 className="font-medium text-lg mt-6 mb-4">Promo</h3>
                  {promo ? (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-md">
                      <p className="text-sm">{promo}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No promo specified
                    </p>
                  )}

                  <h3 className="font-medium text-lg mt-6 mb-4">Facilities</h3>
                  {facilities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {facilities.map((facility) => (
                        <div
                          key={facility}
                          className="bg-muted px-2 py-1 rounded-md text-sm"
                        >
                          {facility}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No facilities selected
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Ready to submit?</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please review all information before submitting. Once
                      submitted, this unit type will be associated with the
                      project and can be viewed by visitors.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={back}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Unit Type
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </form>
    </div>
  );
}
