"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getPublicProjectsPaginated } from "@/lib/project-actions";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Building2, Home, Filter, Grid, List } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  slug: string;
  location: string;
  status: string;
  units: number;
  startingPrice: number;
  maxPrice: number;
  completion: number;
  mainImage: string;
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProjectsPageContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header projects={[]} />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-primary"></div>
          <p>Loading projects...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ProjectsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParam = searchParams.get("type");
  const pageParam = searchParams.get("page");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(typeParam || "all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(parseInt(pageParam || "1"));
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [projectsPerPage] = useState(12);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (typeParam) {
      setActiveTab(typeParam);
    }
  }, [typeParam]);

  const fetchProjects = async (page = 1, type?: string) => {
    try {
      setLoading(true);
      const response = await getPublicProjectsPaginated(
        page,
        projectsPerPage,
        type === "all" ? undefined : type
      );

      if (response.success && response.data) {
        setProjects(response.data.projects);
        setTotalPages(response.data.totalPages);
        setTotalProjects(response.data.total);
        setError(null);
      } else {
        setError("Failed to load projects");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    if (activeTab !== "all") {
      params.set("type", activeTab);
    }
    router.push(`/projects?${params.toString()}`);
    fetchProjects(page, activeTab);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    const params = new URLSearchParams();
    params.set("page", "1");
    if (tab !== "all") {
      params.set("type", tab);
    }
    router.push(`/projects?${params.toString()}`);
    fetchProjects(1, tab);
  };

  const filteredProjects = projects.filter((project) => {
    if (activeTab === "all") return true;
    return project.status === activeTab;
  });

  const residentialCount = projects.filter(
    (p) => p.status === "residential"
  ).length;
  const commercialCount = projects.filter(
    (p) => p.status === "commercial"
  ).length;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header projects={[]} />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-primary"></div>
            <p>Loading projects...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header projects={[]} />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-red-500 mb-6">{error}</p>
            <Button onClick={() => fetchProjects()}>Try Again</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header projects={[]} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${
                  activeTab === "residential"
                    ? "https://res.cloudinary.com/dx7xttb8a/image/upload/v1754477030/projects/hwbcymcep10eyevqmj2a.jpg"
                    : activeTab === "commercial"
                    ? "https://res.cloudinary.com/dx7xttb8a/image/upload/v1754476429/projects/gallery/pjd2bultz7fwndj8njql.jpg"
                    : "https://res.cloudinary.com/dx7xttb8a/image/upload/v1754477030/projects/hwbcymcep10eyevqmj2a.jpg"
                })`,
              }}
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white drop-shadow-lg">
                Our Projects
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md">
                Discover our premium developments designed for modern living and
                business excellence
              </p>

              {/* Breadcrumb */}
              <nav className="flex items-center justify-center space-x-2 text-sm text-white/80">
                <Link
                  href="/"
                  className="hover:text-white transition-colors drop-shadow-sm"
                >
                  Home
                </Link>
                <span>/</span>
                <span className="text-white drop-shadow-sm">Projects</span>
              </nav>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            {/* Filter Tabs and View Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">All</span>
                    <Badge variant="secondary" className="ml-1">
                      {projects.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="residential"
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">Residential</span>
                    <Badge variant="secondary" className="ml-1">
                      {residentialCount}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="commercial"
                    className="flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Commercial</span>
                    <Badge variant="secondary" className="ml-1">
                      {commercialCount}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex items-center gap-2"
                >
                  <Grid className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex items-center gap-2"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </Button>
              </div>
            </div>

            {/* Projects Grid/List */}
            {projects.length > 0 ? (
              <>
                <div
                  className={`${
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-6"
                  }`}
                >
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className={viewMode === "list" ? "w-full" : ""}
                    >
                      <ProjectCard project={project} viewMode={viewMode} />
                    </div>
                  ))}
                </div>

                {/* Modern Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              currentPage > 1 &&
                              handlePageChange(currentPage - 1)
                            }
                            className={
                              currentPage <= 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {[...Array(totalPages)].map((_, i) => {
                          const pageNumber = i + 1;
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 &&
                              pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={pageNumber}>
                                <PaginationLink
                                  onClick={() => handlePageChange(pageNumber)}
                                  isActive={currentPage === pageNumber}
                                  className="cursor-pointer"
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          } else if (
                            (pageNumber === 2 && currentPage > 3) ||
                            (pageNumber === totalPages - 1 &&
                              currentPage < totalPages - 2)
                          ) {
                            return (
                              <PaginationItem key={pageNumber}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              currentPage < totalPages &&
                              handlePageChange(currentPage + 1)
                            }
                            className={
                              currentPage >= totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}

                {/* Results Info */}
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * projectsPerPage + 1} to{" "}
                  {Math.min(currentPage * projectsPerPage, totalProjects)} of{" "}
                  {totalProjects} projects
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    {activeTab === "residential" ? (
                      <Home className="w-8 h-8 text-muted-foreground" />
                    ) : activeTab === "commercial" ? (
                      <Building2 className="w-8 h-8 text-muted-foreground" />
                    ) : (
                      <Filter className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No {activeTab === "all" ? "" : activeTab} projects found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {activeTab === "all"
                      ? "No projects are available at the moment."
                      : `No ${activeTab} projects are available at the moment.`}
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/projects/new">Add New Project</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
