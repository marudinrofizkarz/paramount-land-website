'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Car, ArrowRight, Loader2, Square } from "lucide-react";
import { getUnitsByProjectId } from "@/lib/unit-actions";

interface UnitSidebarCardsProps {
  projectId: string;
  projectSlug: string;
  currentUnitSlug: string;
  projectName: string;
}

export function UnitSidebarCards({ 
  projectId, 
  projectSlug, 
  currentUnitSlug, 
  projectName 
}: UnitSidebarCardsProps) {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const result = await getUnitsByProjectId(projectId);
        if (result.success && result.units) {
          // Filter out current unit and limit to 3 units
          const otherUnits = result.units
            .filter(unit => unit.slug !== currentUnitSlug)
            .slice(0, 3);
          setUnits(otherUnits);
        }
      } catch (error) {
        console.error('Error fetching units:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [projectId, currentUnitSlug]);

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

  // Status mapping function
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return { text: 'Available', variant: 'default' as const };
      case 'draft':
        return { text: 'Reserved', variant: 'outline' as const };
      case 'sold':
        return { text: 'Sold', variant: 'destructive' as const };
      default:
        return { text: status, variant: 'default' as const };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground mb-4">
          Tidak ada unit lain tersedia
        </p>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/projects/${projectSlug}`}>
            Lihat Semua Unit
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Unit Cards */}
      <div className="space-y-3">
        {units.map((unit) => {
          const statusDisplay = getStatusDisplay(unit.status);
          
          return (
            <Card key={unit.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-0">
                <div className="flex">
                  {/* Image */}
                  <div className="w-20 h-20 relative flex-shrink-0">
                    {unit.main_image ? (
                      <Image
                        src={unit.main_image}
                        alt={unit.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Home className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute top-1 left-1">
                      <Badge
                        variant={statusDisplay.variant}
                        className="text-xs px-1 py-0"
                      >
                        {statusDisplay.text}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-3">
                    <h4 className="font-medium text-sm mb-1 line-clamp-1">
                      {unit.name}
                    </h4>
                    
                    {/* Specs */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      {unit.land_area && (
                        <div className="flex items-center">
                          <Square className="h-3 w-3 mr-1" />
                          <span>{unit.land_area}m²</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Price */}
                    <p className="font-semibold text-primary text-sm mb-2">
                      {formatCurrency(unit.sale_price)}
                    </p>
                    
                    {/* View Button */}
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm"
                      className="w-full h-7 text-xs"
                    >
                      <Link href={`/projects/${projectSlug}/units/${unit.slug}`}>
                        Lihat Detail
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* View All Button */}
      <Button variant="outline" className="w-full" asChild>
        <Link href={`/projects/${projectSlug}`}>
          Lihat Semua Unit <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}