"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  Bed,
  Bath,
  Car,
  ArrowRight,
  Loader2,
  MapPin,
  Square,
} from "lucide-react";
import { getUnitsByProjectId } from "@/lib/unit-actions";

interface UnitListProps {
  projectId: string;
  projectSlug: string;
  projectLocation?: string; // Tambahkan prop untuk lokasi project
}

export function UnitList({
  projectId,
  projectSlug,
  projectLocation,
}: UnitListProps) {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUnits() {
      try {
        setLoading(true);
        const response = await getUnitsByProjectId(projectId);

        if (response.success && response.units) {
          setUnits(response.units);
          setError(null);
        } else {
          setError("Failed to load units");
        }
      } catch (err) {
        console.error("Error fetching units:", err);
        setError("Failed to load units");
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      fetchUnits();
    }
  }, [projectId]);

  // Format currency
  const formatCurrency = (value: string) => {
    if (!value) return "";
    const number = parseInt(value);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Add status mapping function
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "active":
        return { text: "Available", value: "available" };
      case "draft":
        return { text: "Reserved", value: "reserved" };
      case "sold":
        return { text: "Sold", value: "sold" };
      default:
        return { text: status, value: status };
    }
  };

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p>Loading unit types...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          No unit types available for this project.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Available Unit Types</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <Card
            key={unit.id}
            className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            <div className="aspect-video relative">
              {unit.main_image ? (
                <Image
                  src={unit.main_image}
                  alt={unit.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Home className="h-12 w-12 text-muted-foreground/40" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <Badge
                  variant="secondary"
                  className="bg-black/70 text-white hover:bg-black/70"
                >
                  {getStatusDisplay(unit.status).text}
                </Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-3 line-clamp-2 h-14">
                {unit.name}
              </h3>

              {/* Location with MapPin icon */}
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <MapPin className="h-4 w-4 mr-1 text-primary" />
                <span>{projectLocation || "Lokasi Strategis"}</span>
              </div>

              {/* Type and Dimensions */}
              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">
                    Type:
                  </span>
                  <span className="ml-2">{unit.dimensions}</span>
                </div>

                {/* Land and Building Area without icons */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-muted-foreground">
                      LT:
                    </span>
                    <span className="ml-1">{unit.land_area} m²</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-muted-foreground">
                      LB:
                    </span>
                    <span className="ml-1">{unit.building_area} m²</span>
                  </div>
                </div>
              </div>

              {/* Room specifications */}
              <div className="flex flex-wrap gap-3 mb-4">
                {unit.bedrooms && (
                  <div className="flex items-center text-sm bg-muted/50 px-2 py-1 rounded-md">
                    <Bed className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{unit.bedrooms} BR</span>
                  </div>
                )}
                {unit.bathrooms && (
                  <div className="flex items-center text-sm bg-muted/50 px-2 py-1 rounded-md">
                    <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{unit.bathrooms} BA</span>
                  </div>
                )}
                {unit.carports && (
                  <div className="flex items-center text-sm bg-muted/50 px-2 py-1 rounded-md">
                    <Car className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{unit.carports} Carport</span>
                  </div>
                )}
              </div>

              {/* Price and View Details Button */}
              <div className="flex flex-col gap-3 pt-4 border-t">
                <p className="font-bold text-lg text-primary">
                  {formatCurrency(unit.sale_price)}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  <Link href={`/projects/${projectSlug}/units/${unit.slug}`}>
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
