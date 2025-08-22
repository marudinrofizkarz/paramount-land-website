"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Plus,
  Building,
  Home,
  ArrowLeft,
  Edit,
  Eye,
  Trash2,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { getProjectBySlug } from "@/lib/project-actions";
import { getUnitsByProjectIdPaginated, deleteUnit } from "@/lib/unit-actions";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function ProjectUnitsPage() {
  const router = useRouter();
  const params = useParams();
  const projectSlug = params.slug as string;
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [project, setProject] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUnits, setTotalUnits] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [unitToDelete, setUnitToDelete] = useState<any>(null);
  const [deletingUnit, setDeletingUnit] = useState(false);

  // Fetch data with pagination
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch project details
        const projectResponse = await getProjectBySlug(projectSlug);

        if (!projectResponse.data) {
          toast({
            title: "Error",
            description: "Project not found",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        setProject(projectResponse.data);

        // Fetch units for the project with pagination
        const unitsResponse = await getUnitsByProjectIdPaginated(
          projectResponse.data.id,
          currentPage,
          itemsPerPage,
          statusFilter
        );

        if (unitsResponse.success) {
          setUnits(unitsResponse.units || []);
          setTotalPages(unitsResponse.totalPages || 1);
          setTotalUnits(unitsResponse.totalUnits || 0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch project data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (projectSlug) {
      fetchData();
    }
  }, [projectSlug, currentPage, itemsPerPage, statusFilter, toast]);

  // Handle unit deletion
  const handleDeleteUnit = async () => {
    if (!unitToDelete) return;

    try {
      setDeletingUnit(true);

      const response = await deleteUnit(unitToDelete.id, project.id);

      if (response.success) {
        toast({
          title: "Success",
          description: "Unit deleted successfully",
        });

        // Refresh units data
        const unitsResponse = await getUnitsByProjectIdPaginated(
          project.id,
          currentPage,
          itemsPerPage,
          statusFilter
        );

        if (unitsResponse.success) {
          setUnits(unitsResponse.units || []);
          setTotalPages(unitsResponse.totalPages || 1);
          setTotalUnits(unitsResponse.totalUnits || 0);
        }

        setUnitToDelete(null);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete unit",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting unit:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setDeletingUnit(false);
    }
  };

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

  // Filter units based on search query
  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
        </div>

        {/* Loading skeleton for stats cards - hidden on mobile */}
        {!isMobile && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-8 w-12 bg-muted animate-pulse rounded" />
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Loading skeleton for table */}
        <div className="border rounded-lg">
          <div className="h-12 bg-muted animate-pulse" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-t bg-muted/20 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground">
            The project you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header and Navigation - Removed Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project?.name} - Units</h1>
          <p className="text-muted-foreground">{project?.location}</p>
        </div>
        <Button
          onClick={() =>
            router.push(`/dashboard/projects/${projectSlug}/units/new`)
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Unit
        </Button>
      </div>

      {/* Stats Cards - Hidden on mobile */}
      {!isMobile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Units
              </CardTitle>
              <p className="text-2xl font-bold">{totalUnits}</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Available Units
              </CardTitle>
              <p className="text-2xl font-bold text-green-600">
                {units.filter((unit) => unit.status === "available").length}
              </p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Reserved Units
              </CardTitle>
              <p className="text-2xl font-bold text-yellow-600">
                {units.filter((unit) => unit.status === "reserved").length}
              </p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Sold Units
              </CardTitle>
              <p className="text-2xl font-bold text-red-600">
                {units.filter((unit) => unit.status === "sold").length}
              </p>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-grow flex flex-col sm:flex-row gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search units..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <div className="border rounded-lg">
        {isMobile ? (
          // Mobile Card Layout
          <div className="divide-y">
            {filteredUnits.length === 0 ? (
              <div className="text-center py-12">
                <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Units Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "No units match your search criteria."
                    : "There are no units for this project yet."}
                </p>
                <Button
                  onClick={() =>
                    router.push(`/dashboard/projects/${projectSlug}/units/new`)
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Unit
                </Button>
              </div>
            ) : (
              filteredUnits.map((unit) => (
                <div key={unit.id} className="p-4 space-y-3">
                  {/* Unit Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0">
                        {unit.main_image ? (
                          <Image
                            src={unit.main_image}
                            alt={unit.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Home className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">{unit.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {unit.dimensions}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getBadgeVariant(unit.status)}>
                      {getStatusText(unit.status)}
                    </Badge>
                  </div>

                  {/* Unit Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Land Area:</span>
                      <p className="font-medium">{unit.land_area} m²</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Building:</span>
                      <p className="font-medium">{unit.building_area} m²</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t">
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(unit.sale_price)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        router.push(
                          `/dashboard/projects/${projectSlug}/units/${unit.slug}`
                        )
                      }
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        router.push(
                          `/dashboard/projects/${projectSlug}/units/${unit.slug}/edit`
                        )
                      }
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-none p-2"
                      onClick={() => setUnitToDelete(unit)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Desktop Table Layout
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Dimensions</TableHead>
                <TableHead>Land Area</TableHead>
                <TableHead>Building Area</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Units Found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? "No units match your search criteria."
                        : "There are no units for this project yet."}
                    </p>
                    <Button
                      onClick={() =>
                        router.push(`/dashboard/projects/${projectSlug}/units/new`)
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Unit
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell>
                      <div className="w-16 h-16 rounded-lg overflow-hidden relative">
                        {unit.main_image ? (
                          <Image
                            src={unit.main_image}
                            alt={unit.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Home className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{unit.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>{unit.dimensions}</TableCell>
                    <TableCell>{unit.land_area} m²</TableCell>
                    <TableCell>{unit.building_area} m²</TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(unit.sale_price)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(unit.status)}>
                        {getStatusText(unit.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/projects/${projectSlug}/units/${unit.slug}`}
                              className="flex items-center"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Unit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/projects/${projectSlug}/units/${unit.slug}/edit`}
                              className="flex items-center"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Unit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setUnitToDelete(unit)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Unit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={currentPage === pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                (pageNumber === 2 && currentPage > 3) ||
                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <span className="flex h-9 w-9 items-center justify-center text-sm">
                      ...
                    </span>
                  </PaginationItem>
                );
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!unitToDelete}
        onOpenChange={(open) => !open && setUnitToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {unitToDelete?.name}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUnitToDelete(null)}
              disabled={deletingUnit}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUnit}
              disabled={deletingUnit}
            >
              {deletingUnit ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
