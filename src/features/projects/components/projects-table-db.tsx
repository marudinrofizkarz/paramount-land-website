"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ProjectListItem, PaginatedProjects } from "@/types/project";
import { getProjects, deleteProject } from "@/lib/project-actions";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Inline Pagination components
const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);

const PaginationContent = ({
  className,
  ...props
}: React.ComponentProps<"ul">) => (
  <ul
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
);

const PaginationItem = ({
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li className={cn("", className)} {...props} />
);

const PaginationLink = ({
  className,
  isActive,
  ...props
}: {
  className?: string;
  isActive?: boolean;
} & React.ComponentProps<"a">) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium",
      {
        "border-primary bg-primary text-primary-foreground": isActive,
        "border-input bg-background hover:bg-accent hover:text-accent-foreground":
          !isActive,
      },
      className
    )}
    {...props}
  />
);

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<"a">) => (
  <a
    aria-label="Go to previous page"
    className={cn(
      "flex h-9 items-center gap-1 px-4 rounded-md border border-input bg-background pl-2.5 hover:bg-accent hover:text-accent-foreground",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </a>
);

const PaginationNext = ({ className, ...props }: React.ComponentProps<"a">) => (
  <a
    aria-label="Go to next page"
    className={cn(
      "flex h-9 items-center gap-1 px-4 rounded-md border border-input bg-background pr-2.5 hover:bg-accent hover:text-accent-foreground",
      className
    )}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </a>
);

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case "residential":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    case "commercial":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100";
    // Keep these for backward compatibility with existing data
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    case "planning":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    case "construction":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
    case "completed":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
  }
};

export function ProjectsTable() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaginatedProjects | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const fetchProjects = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getProjects(page);
      if (response.success) {
        setData(response.data as PaginatedProjects);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load projects",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      const response = await deleteProject(projectToDelete);
      if (response.success) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
        // Refresh the projects list
        fetchProjects(currentPage);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete project",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Property Projects</CardTitle>
            <Button asChild size={isMobile ? "sm" : "default"}>
              <Link href="/dashboard/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                {isMobile ? "Add" : "Add Project"}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <div className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="h-4 w-32 bg-muted rounded mb-2" />
                      <div className="h-3 w-24 bg-muted rounded" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="h-4 w-16 bg-muted rounded mb-1" />
                      <div className="h-3 w-24 bg-muted rounded" />
                    </div>

                    <div className="text-center">
                      <div className="h-6 w-20 bg-muted rounded mb-1" />
                      <div className="h-3 w-16 bg-muted rounded" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-muted rounded-full" />
                      <div className="h-8 w-8 bg-muted rounded-full" />
                      <div className="h-8 w-8 bg-muted rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : data?.projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No projects found</p>
              <Button asChild>
                <Link href="/dashboard/projects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Project
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {data?.projects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "border rounded-lg hover:bg-muted/50 transition-colors",
                      isMobile ? "p-3" : "p-4"
                    )}
                  >
                    {isMobile ? (
                      // Mobile Layout - Vertical Stack
                      <div className="space-y-3">
                        {/* Header with image and title */}
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0">
                            {project.mainImage ? (
                              <Image
                                src={project.mainImage}
                                alt={project.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                <Building className="h-4 w-4 text-primary" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{project.name}</h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {project.location}
                            </p>
                          </div>
                          {/* Mobile Actions Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem asChild>
                                <Link href={`/projects/${project.slug}`} className="flex items-center">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Project
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/projects/${project.slug}/units`} className="flex items-center">
                                  <Settings className="mr-2 h-4 w-4" />
                                  Manage Units
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/projects/edit/${project.id}`} className="flex items-center">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Project
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(project.id)}
                                className="flex items-center text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Project
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Mobile Info Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Units</p>
                            <p className="font-medium">{project.units}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <Badge className={cn(getStatusColor(project.status), "text-xs")}>
                              {project.status}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Price</p>
                            <p className="font-medium text-xs truncate">
                              {project.startingPrice}
                              {project.maxPrice ? ` - ${project.maxPrice}` : ""}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Progress</p>
                            <p className="font-medium">{project.completion}%</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Desktop Layout - Horizontal
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                            {project.mainImage ? (
                              <Image
                                src={project.mainImage}
                                alt={project.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                <Building className="h-5 w-5 text-primary" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{project.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {project.location}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {project.units} Units
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {project.startingPrice}
                              {project.maxPrice ? ` - ${project.maxPrice}` : ""}
                            </p>
                          </div>

                          <div className="text-center">
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {project.completion}% Complete
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/projects/${project.slug}`}>
                                      <Eye className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Project</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link
                                      href={`/dashboard/projects/${project.slug}/units`}
                                    >
                                      <Settings className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Manage Units</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link
                                      href={`/dashboard/projects/edit/${project.id}`}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit Project</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteClick(project.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete Project</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {data && data.totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(
                              e: React.MouseEvent<HTMLAnchorElement>
                            ) => {
                              e.preventDefault();
                              handlePageChange(currentPage - 1);
                            }}
                          />
                        </PaginationItem>
                      )}

                      {Array.from({ length: data.totalPages }).map((_, i) => {
                        const page = i + 1;

                        // Display first page, last page, and pages around current page
                        if (
                          page === 1 ||
                          page === data.totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                isActive={page === currentPage}
                                onClick={(
                                  e: React.MouseEvent<HTMLAnchorElement>
                                ) => {
                                  e.preventDefault();
                                  handlePageChange(page);
                                }}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }

                        // Add ellipsis for skipped pages
                        if (
                          (page === 2 && currentPage > 3) ||
                          (page === data.totalPages - 1 &&
                            currentPage < data.totalPages - 2)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }

                        return null;
                      })}

                      {currentPage < data.totalPages && (
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(
                              e: React.MouseEvent<HTMLAnchorElement>
                            ) => {
                              e.preventDefault();
                              handlePageChange(currentPage + 1);
                            }}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Mobile-optimized Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className={cn(isMobile && "max-w-[90vw]")}>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className={cn(isMobile && "flex-col space-y-2")}>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className={cn(isMobile && "w-full")}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className={cn(isMobile && "w-full")}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
