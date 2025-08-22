import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    slug: string;
    location: string;
    status: string;
    units: number;
    startingPrice: number;
    maxPrice?: number;
    completion: number;
    mainImage: string;
  };
  viewMode?: 'grid' | 'list';
}

export function ProjectCard({ project, viewMode = 'grid' }: ProjectCardProps) {
  // Format currency
  const formatCurrency = (value?: string) => {
    if (!value) return "";
    const number = parseInt(value);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative md:w-80 h-64 md:h-auto">
            <Image
              src={project.mainImage || "/placeholder-project.jpg"}
              alt={project.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4">
              <Badge 
                variant={project.status === 'residential' ? 'default' : 'secondary'}
                className="bg-black/80 text-white hover:bg-black/90 border-0"
              >
                {project.status === 'residential' ? 'Residential' : 'Commercial'}
              </Badge>
            </div>
          </div>
          
          {/* Content Section */}
          <CardContent className="flex-1 p-6">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{project.location}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Units</p>
                    <p className="font-medium">{project.units} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completion</p>
                    <p className="font-medium">{project.completion}%</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Start From</p>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(project.startingPrice)}
                  </p>
                </div>
                
                <Button asChild>
                  <Link href={`/projects/${project.slug}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  // Grid view - Improved responsive layout
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl h-full mx-auto w-full max-w-sm">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          {project.mainImage ? (
            <Image
              src={project.mainImage}
              alt={project.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Building2 className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge
              variant="secondary"
              className="bg-black/80 text-white hover:bg-black/90 border-0"
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        <CardTitle className="font-headline text-lg lg:text-xl mb-2 line-clamp-2">
          {project.name}
        </CardTitle>

        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{project.location}</span>
        </div>

        {project.description && (
          <CardDescription className="flex-1 mb-4 text-sm line-clamp-3">
            {project.description.substring(0, 100)}
            {project.description.length > 100 && "..."}
          </CardDescription>
        )}

        <div className="mt-auto pt-4 border-t space-y-3">
          <div>
            {project.startingPrice && (
              <p className="font-semibold text-primary text-sm lg:text-base">
                Start From {formatCurrency(project.startingPrice)}
              </p>
            )}
          </div>
          
          {/* Improved responsive button */}
          <Button asChild size="sm" variant="outline" className="w-full justify-center">
            <Link href={`/projects/${project.slug}`} className="flex items-center gap-1">
              <span className="text-xs lg:text-sm">View Details</span>
              <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
