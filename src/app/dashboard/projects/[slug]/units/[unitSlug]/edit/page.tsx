"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { getUnitBySlug, updateUnit } from "@/lib/unit-actions";
import { getProjectBySlug } from "@/lib/project-actions";
import { slugify } from "@/lib/utils";

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
  UploadCloud,
  X,
  Trash2,
  Save,
  Loader2,
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
  Home,
  Ruler,
  MapPin,
  Shield,
} from "lucide-react";

export default function EditUnitPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const projectSlug = params.slug as string;
  const unitSlug = params.unitSlug as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [unit, setUnit] = useState<any>(null);

  // Enhanced form state to match new unit form
  const [unitName, setUnitName] = useState("");
  const [unitSlugState, setUnitSlugState] = useState("");
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
  const [status, setStatus] = useState("available");

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

  // Auto-generate slug from name
  useEffect(() => {
    if (unitName) {
      setUnitSlugState(slugify(unitName));
    }
  }, [unitName]);

  // Fetch unit data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        if (!projectSlug || !unitSlug) {
          toast({
            title: "Error",
            description: "Missing required parameters",
            variant: "destructive",
          });
          router.push("/dashboard/projects");
          return;
        }

        // Fetch project data
        const projectResponse = await getProjectBySlug(projectSlug);
        if (!projectResponse.success || !projectResponse.data) {
          toast({
            title: "Error",
            description: projectResponse.message || "Project not found",
            variant: "destructive",
          });
          router.push("/dashboard/projects");
          return;
        }
        setProject(projectResponse.data);

        // Fetch unit data
        const unitResponse = await getUnitBySlug(projectSlug, unitSlug);
        if (!unitResponse.success || !unitResponse.unit) {
          toast({
            title: "Error",
            description: unitResponse.error || "Unit not found",
            variant: "destructive",
          });
          router.push(`/dashboard/projects/${projectSlug}/units`);
          return;
        }

        const unitData = unitResponse.unit;
        setUnit(unitData);

        // Populate form data
        setUnitName(unitData.name || "");
        setUnitSlugState(unitData.slug || "");
        setMainImage(unitData.main_image || "");
        setMainImagePreview(unitData.main_image || "");

        // Parse dimensions
        if (unitData.dimensions) {
          const dimParts = unitData.dimensions.split("x");
          if (dimParts.length === 2) {
            setDimensions({
              length: dimParts[0].trim().replace("m", ""),
              width: dimParts[1].trim().replace("m", ""),
            });
          }
        }

        setLandArea(unitData.land_area || "");
        setBuildingArea(unitData.building_area || "");
        setSalePrice(unitData.sale_price || "");
        setBedrooms(unitData.bedrooms || "");
        setBathrooms(unitData.bathrooms || "");
        setCarports(unitData.carports || "");
        // Handle floors data properly
        if (unitData.floors) {
          // Check if floors is 1, 2, or something else (custom)
          if (unitData.floors === "1" || unitData.floors === "2") {
            setFloors(unitData.floors);
          } else {
            setFloors("custom");
            setCustomFloors(unitData.floors);
          }
        } else {
          setFloors("1");
        }
        setCertification(unitData.certification || "SHGB");
        setStatus(unitData.status || "available");

        // Parse facilities - handle both string and array formats
        if (unitData.facilities) {
          try {
            // Handle if facilities is already an array or needs parsing from string
            const facilitiesArray = Array.isArray(unitData.facilities)
              ? unitData.facilities
              : JSON.parse(unitData.facilities);

            const facilitiesList = Array.isArray(facilitiesArray)
              ? facilitiesArray
              : [];
            console.log("Facilities loaded:", facilitiesList);
            setFacilities(facilitiesList);
          } catch (error) {
            console.error("Error parsing facilities:", error);
            setFacilities([]);
          }
        }

        // Parse gallery images - handle both string and array formats
        if (unitData.gallery_images) {
          try {
            // Handle if gallery_images is already an array or needs parsing from string
            const galleryArray = Array.isArray(unitData.gallery_images)
              ? unitData.gallery_images
              : JSON.parse(unitData.gallery_images);

            const images = Array.isArray(galleryArray) ? galleryArray : [];
            console.log("Gallery images loaded:", images);
            setGalleryImages(images);
            setGalleryImagePreviews(images);
          } catch (error) {
            console.error("Error parsing gallery images:", error);
            setGalleryImages([]);
            setGalleryImagePreviews([]);
          }
        }

        // Set editor content
        if (editor && unitData.description) {
          editor.commands.setContent(unitData.description);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load unit data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (projectSlug && unitSlug) {
      fetchData();
    }
  }, [projectSlug, unitSlug, router, toast, editor]);

  // Handle file uploads for main image
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

  // Enhanced function to remove gallery images (works for both new uploads and existing images)
  const removeGalleryImage = (index: number) => {
    setGalleryImagePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setGalleryImages((prev) => {
      const newImages = [...prev];
      if (index < newImages.length) {
        newImages.splice(index, 1);
      }
      return newImages;
    });

    // Also remove from files array if it's a newly added image
    setGalleryImageFiles((prev) => {
      const newFiles = [...prev];
      // Only attempt to remove from files if it's a new upload
      if (index < newFiles.length) {
        newFiles.splice(index, 1);
      }
      return newFiles;
    });
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
    setSubmitting(true);

    try {
      // Create a FormData object for submission
      const formData = new FormData();
      formData.append("name", unitName);
      formData.append("slug", unitSlugState);
      formData.append("type", unitName);
      formData.append("salePrice", salePrice);
      formData.append("description", editor?.getHTML() || "");
      formData.append("address", "");
      formData.append(
        "dimensions",
        `${dimensions.length}m x ${dimensions.width}m`
      );
      formData.append("landArea", landArea);
      formData.append("buildingArea", buildingArea);
      formData.append("bedrooms", bedrooms);
      formData.append("bathrooms", bathrooms);
      formData.append("carports", carports);
      formData.append("status", status);

      // Handle floors selection
      if (floors === "custom") {
        formData.append("floors", customFloors);
      } else {
        formData.append("floors", floors);
      }

      // Add facilities - ensure it's properly formatted as JSON string
      formData.append("facilities", JSON.stringify(facilities));
      formData.append("certification", certification);

      // Add main image - handle both new uploads and existing images
      if (mainImagePreview) {
        // If it's a data URL (new upload), send it as is
        if (mainImagePreview.startsWith("data:")) {
          formData.append("mainImage", mainImagePreview);
        } else {
          // If it's an existing URL, store it as current main image
          formData.append("currentMainImage", mainImagePreview);
        }
      }

      // Add gallery images - preserve existing images and add any new uploads
      // Store all gallery images from galleryImagePreviews
      formData.append(
        "currentGalleryImages",
        JSON.stringify(
          galleryImagePreviews.filter((img) => !img.startsWith("data:"))
        )
      );

      // Then add any new gallery images (those starting with data:)
      galleryImagePreviews.forEach((preview, index) => {
        if (preview.startsWith("data:")) {
          formData.append(`galleryImage${index}`, preview);
        } else {
          // Send existing URLs too for consistency
          formData.append(`galleryImage${index}`, preview);
        }
      });

      // Add project information for revalidation
      if (project?.id) {
        formData.append("projectId", project.id);
        formData.append("projectSlug", projectSlug);
      }

      // Add unit ID
      if (unit?.id) {
        formData.append("unitId", unit.id);
      }

      console.log("Submitting unit data:", {
        name: unitName,
        floors: floors === "custom" ? customFloors : floors,
        facilities: facilities.length,
        status,
        mainImage: mainImagePreview ? "Set" : "Not set",
        galleryImages: galleryImagePreviews.length,
      });

      const result = await updateUnit(unit.id, formData);

      if (result.success) {
        toast({
          title: "✅ Berhasil!",
          description:
            "Unit telah berhasil diperbarui. Perubahan akan terlihat di halaman website dalam beberapa detik.",
          duration: 5000,
        });
        router.push(`/dashboard/projects/${projectSlug}/units`);
      } else {
        toast({
          title: "Error",
          description:
            result.error || "Failed to update unit. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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
        <div className="w-px h-6 bg-border mx-1" />
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
        <div className="w-px h-6 bg-border mx-1" />
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

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
        </div>

        <Card className="mb-8 animate-pulse">
          <CardHeader>
            <div className="h-8 w-1/3 bg-muted rounded mb-2" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-1/4 bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Unit: {unit?.name}</h1>
        <p className="text-muted-foreground">
          Project: {project?.name} | Location: {project?.location}
        </p>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="dimensions" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Dimensions
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Media
            </TabsTrigger>
            <TabsTrigger
              value="description"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Description
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the basic details for this unit.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unitName">Unit Name</Label>
                    <Input
                      id="unitName"
                      value={unitName}
                      onChange={(e) => setUnitName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitSlug">Unit Slug</Label>
                    <Input
                      id="unitSlug"
                      value={unitSlugState}
                      onChange={(e) => setUnitSlugState(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price (IDR)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dimensions Tab */}
          <TabsContent value="dimensions">
            <Card>
              <CardHeader>
                <CardTitle>Dimensions & Features</CardTitle>
                <CardDescription>
                  Update the physical specifications of this unit.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">Length (m)</Label>
                    <Input
                      id="length"
                      type="number"
                      value={dimensions.length}
                      onChange={(e) =>
                        setDimensions((prev) => ({
                          ...prev,
                          length: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (m)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={dimensions.width}
                      onChange={(e) =>
                        setDimensions((prev) => ({
                          ...prev,
                          width: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="landArea">Land Area (m²)</Label>
                    <Input
                      id="landArea"
                      type="number"
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buildingArea">Building Area (m²)</Label>
                    <Input
                      id="buildingArea"
                      type="number"
                      value={buildingArea}
                      onChange={(e) => setBuildingArea(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carports">Carports</Label>
                    <Input
                      id="carports"
                      type="number"
                      value={carports}
                      onChange={(e) => setCarports(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Floors</Label>
                    <RadioGroup value={floors} onValueChange={setFloors}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="floors-1" />
                        <Label htmlFor="floors-1">1 Floor</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="floors-2" />
                        <Label htmlFor="floors-2">2 Floors</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="floors-custom" />
                        <Label htmlFor="floors-custom">Custom</Label>
                      </div>
                    </RadioGroup>
                    {floors === "custom" && (
                      <Input
                        placeholder="Enter number of floors"
                        value={customFloors}
                        onChange={(e) => setCustomFloors(e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certification">Certification</Label>
                    <Select
                      value={certification}
                      onValueChange={setCertification}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select certification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SHGB">SHGB</SelectItem>
                        <SelectItem value="SHM">SHM</SelectItem>
                        <SelectItem value="HGB">HGB</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Media & Gallery</CardTitle>
                <CardDescription>
                  Upload and manage images for this unit.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Image */}
                <div className="space-y-2">
                  <Label>Main Image</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                    {mainImagePreview ? (
                      <div className="relative">
                        <Image
                          src={mainImagePreview}
                          alt="Main image preview"
                          width={200}
                          height={150}
                          className="rounded-lg object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setMainImagePreview("");
                            setMainImageFile(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div className="mt-4">
                          <Label
                            htmlFor="main-image"
                            className="cursor-pointer"
                          >
                            <span className="mt-2 block text-sm font-medium text-muted-foreground">
                              Click to upload main image
                            </span>
                          </Label>
                          <Input
                            id="main-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleMainImageChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gallery Images */}
                <div className="space-y-2">
                  <Label>Gallery Images</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                    <div className="text-center mb-4">
                      <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-4">
                        <Label
                          htmlFor="gallery-images"
                          className="cursor-pointer"
                        >
                          <span className="mt-2 block text-sm font-medium text-muted-foreground">
                            Click to upload additional gallery images
                          </span>
                        </Label>
                        <Input
                          id="gallery-images"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleGalleryImageChange}
                        />
                      </div>
                    </div>
                    {galleryImagePreviews.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {galleryImagePreviews.map((preview, index) => (
                          <div key={`gallery-${index}`} className="relative">
                            <div className="relative w-full h-24">
                              <Image
                                src={preview}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                style={{ objectFit: "cover" }}
                                className="rounded-lg"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => removeGalleryImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground mt-4">
                        No gallery images added yet
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Description Tab */}
          <TabsContent value="description">
            <Card>
              <CardHeader>
                <CardTitle>Description & Facilities</CardTitle>
                <CardDescription>
                  Add detailed description and select facilities.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rich Text Editor */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <div className="border rounded-md">
                    <EditorToolbar />
                    <EditorContent
                      editor={editor}
                      className="min-h-[200px] p-3 border-t border-input focus-within:outline-none"
                    />
                  </div>
                </div>

                {/* Facilities */}
                <div className="space-y-4">
                  <Label>Facilities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {commonFacilities.map((facility) => (
                      <div
                        key={facility}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={facility}
                          checked={facilities.includes(facility)}
                          onCheckedChange={() => toggleFacility(facility)}
                        />
                        <Label htmlFor={facility} className="text-sm">
                          {facility}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {/* Custom Facility */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom facility"
                      value={customFacility}
                      onChange={(e) => setCustomFacility(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomFacility();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCustomFacility}
                    >
                      Add
                    </Button>
                  </div>

                  {/* Selected Facilities */}
                  {facilities.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Selected Facilities:
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {facilities.map((facility, index) => (
                          <div
                            key={index}
                            className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1"
                          >
                            {facility}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Buttons */}
        <Card className="mt-6">
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(`/dashboard/projects/${projectSlug}/units`)
              }
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
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
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
