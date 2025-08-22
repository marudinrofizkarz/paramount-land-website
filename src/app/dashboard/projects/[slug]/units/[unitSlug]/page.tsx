"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { getUnitBySlug } from "@/lib/unit-actions";
import { getProjectBySlug } from "@/lib/project-actions";
import { ArrowLeft, Edit, ChevronLeft, ChevronRight } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
// Remove carousel import since we're using a simple gallery
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UnitDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const projectSlug = params.slug as string;
  const unitSlug = params.unitSlug as string;

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [unit, setUnit] = useState<any>(null);

  // Fetch unit data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch project data
        const projectResponse = await getProjectBySlug(projectSlug);
        if (!projectResponse.success || !projectResponse.data) {
          toast({
            title: "Error",
            description: "Project not found",
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
            description: "Unit not found",
            variant: "destructive",
          });
          router.push(`/dashboard/projects/${projectSlug}/units`);
          return;
        }

        setUnit(unitResponse.unit);
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
  }, [projectSlug, unitSlug, router, toast]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(parseInt(price));
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "reserved":
        return "secondary";
      case "sold":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "reserved":
        return "Reserved";
      case "sold":
        return "Sold";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
          </div>
        </div>

        <div className="aspect-video w-full bg-muted animate-pulse rounded-lg mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-1/2 bg-muted animate-pulse rounded" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-full bg-muted animate-pulse rounded"
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-2/3 bg-muted rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 w-full bg-muted rounded" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Unit Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The unit you are looking for does not exist or has been removed.
        </p>
        <Button
          onClick={() =>
            router.push(`/dashboard/projects/${projectSlug}/units`)
          }
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Units
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{unit.name}</h1>
            <p className="text-muted-foreground">
              Project: {project?.name} | Location: {project?.location}
            </p>
          </div>
        </div>
        <Button
          onClick={() =>
            router.push(
              `/dashboard/projects/${projectSlug}/units/${unitSlug}/edit`
            )
          }
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Unit
        </Button>
      </div>

      {/* Main Image and Gallery */}
      <div className="mb-8">
        <div className="aspect-video relative rounded-lg overflow-hidden">
          {unit.main_image ? (
            <Image
              src={unit.main_image}
              alt={unit.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
          <Badge
            variant={getBadgeVariant(unit.status)}
            className="absolute top-4 right-4 text-sm px-3 py-1"
          >
            {getStatusText(unit.status)}
          </Badge>
        </div>

        {/* Gallery thumbnails */}
        {unit.gallery_images && unit.gallery_images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {unit.gallery_images
              .slice(0, 4)
              .map((image: string, index: number) => (
                <div
                  key={index}
                  className="aspect-video relative rounded overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`${unit.name} - Gallery ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Unit Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description and Features */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Unit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Dimensions</p>
                  <p className="font-medium">{unit.dimensions}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Land Area</p>
                  <p className="font-medium">{unit.land_area} m²</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Building Area</p>
                  <p className="font-medium">{unit.building_area} m²</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium text-primary">
                    {formatPrice(unit.sale_price)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Carports</p>
                  <p className="font-medium">{unit.carports || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Floors</p>
                  <p className="font-medium">{unit.floors || "-"}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Certification
                </p>
                <p className="font-medium">{unit.certification}</p>
              </div>

              {unit.facilities && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    Facilities
                  </p>
                  <p className="font-medium">{unit.facilities}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p>{unit.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Summary Card */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-xl">{unit.name}</CardTitle>
              <CardDescription>
                {project?.name} • {project?.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-bold text-lg text-primary">
                  {formatPrice(unit.sale_price)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={getBadgeVariant(unit.status)}>
                  {getStatusText(unit.status)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Land Area</span>
                <span>{unit.land_area} m²</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Building Area</span>
                <span>{unit.building_area} m²</span>
              </div>


            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() =>
                  router.push(
                    `/dashboard/projects/${projectSlug}/units/${unitSlug}/edit`
                  )
                }
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Unit
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
