"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconPlus,
  IconSearch,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconCopy,
  IconExternalLink,
  IconFileText,
  IconTrendingUp,
  IconGlobe,
  IconChevronLeft,
  IconChevronRight,
  IconChartBar,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { AnalyticsOverview } from "@/components/analytics/analytics-overview";

interface LandingPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: "draft" | "published" | "archived";
  template_type: string;
  campaign_source?: string;
  target_audience?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

interface PaginationData {
  data: LandingPage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function LandingPagesPage() {
  const router = useRouter();
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pages");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLandingPages();
  }, [currentPage, searchTerm]);

  const fetchLandingPages = async () => {
    try {
      console.log("fetchLandingPages called");
      const params = new URLSearchParams();

      // Add pagination parameters
      params.append("limit", itemsPerPage.toString());
      params.append("offset", ((currentPage - 1) * itemsPerPage).toString());

      if (searchTerm) params.append("search", searchTerm);

      const url = `/api/landing-pages?${params}`;
      console.log("Fetching from URL:", url);

      const response = await fetch(url);
      console.log("Fetch response status:", response.status);

      if (!response.ok) throw new Error("Failed to fetch landing pages");

      const data = await response.json();
      console.log("Fetch response data:", data);

      setLandingPages(data.data || []);

      // Update pagination info if API returns it
      if (data.pagination) {
        setTotalItems(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      } else {
        // Fallback: calculate from data length
        setTotalItems(data.data?.length || 0);
        setTotalPages(Math.ceil((data.data?.length || 0) / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching landing pages:", error);
      toast.error("Failed to load landing pages");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchLandingPages();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/landing-pages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete landing page");

      toast.success("Landing page deleted successfully");
      fetchLandingPages();
    } catch (error) {
      console.error("Error deleting landing page:", error);
      toast.error("Failed to delete landing page");
    }
    setDeleteDialogOpen(false);
    setPageToDelete(null);
  };

  const handleClone = async (page: LandingPage) => {
    try {
      const newTitle = `${page.title} (Copy)`;
      const newSlug = `${page.slug}-copy-${Date.now()}`;

      const response = await fetch(`/api/landing-pages/${page.id}/clone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, slug: newSlug }),
      });

      if (!response.ok) throw new Error("Failed to clone landing page");

      const data = await response.json();
      toast.success("Landing page cloned successfully");
      router.push(`/dashboard/landing-pages/${data.slug}/edit`);
    } catch (error) {
      console.error("Error cloning landing page:", error);
      toast.error("Failed to clone landing page");
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const response = await fetch(`/api/landing-pages/${id}/publish`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to publish landing page");

      toast.success("Landing page published successfully");
      fetchLandingPages();
    } catch (error) {
      console.error("Error publishing landing page:", error);
      toast.error("Failed to publish landing page");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
            Published
          </Badge>
        );
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "archived":
        return <Badge variant="destructive">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case "google-ads":
        return "🔍";
      case "facebook-ads":
        return "📘";
      case "tiktok-ads":
        return "🎵";
      default:
        return "🌐";
    }
  };

  const filteredPages = landingPages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation from all loaded pages
  const stats = {
    total: totalItems,
    published: landingPages.filter((p) => p.status === "published").length,
    drafts: landingPages.filter((p) => p.status === "draft").length,
    archived: landingPages.filter((p) => p.status === "archived").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Landing Pages</h1>
          <p className="text-muted-foreground">
            Create and manage high-converting landing pages for your campaigns
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/landing-pages/new")}>
          <IconPlus className="mr-2 h-4 w-4" />
          Create Landing Page
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <IconFileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All landing pages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <IconGlobe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
            <p className="text-xs text-muted-foreground">Live landing pages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <IconEdit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drafts}</div>
            <p className="text-xs text-muted-foreground">Work in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Pages and Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pages">Landing Pages</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6">
          {/* Search Bar */}
          <Card>
            <CardHeader>
              <CardTitle>Search Landing Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search landing pages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Button onClick={handleSearch} variant="outline">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Landing Pages Table */}
          <Card>
            <CardHeader>
              <CardTitle>Landing Pages</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredPages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No landing pages found
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push("/dashboard/landing-pages/new")}
                  >
                    Create your first landing page
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPages.map((page) => (
                      <TableRow key={page.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{page.title}</div>
                            <div className="text-sm text-muted-foreground">
                              /{page.slug}
                            </div>
                            {page.description && (
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {page.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(page.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{getSourceIcon(page.campaign_source)}</span>
                            <span className="capitalize">
                              {page.campaign_source || "organic"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {page.target_audience || "General"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {formatDistanceToNow(new Date(page.updated_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <IconDots className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {page.status === "published" && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/lp/${page.slug}`}
                                    target="_blank"
                                    className="flex items-center"
                                  >
                                    <IconExternalLink className="mr-2 h-4 w-4" />
                                    View Live
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/landing-pages/${page.slug}/preview`}
                                  className="flex items-center"
                                >
                                  <IconEye className="mr-2 h-4 w-4" />
                                  Preview
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/landing-pages/${page.slug}/edit`}
                                  className="flex items-center"
                                >
                                  <IconEdit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleClone(page)}
                              >
                                <IconCopy className="mr-2 h-4 w-4" />
                                Clone
                              </DropdownMenuItem>
                              {page.status === "draft" && (
                                <DropdownMenuItem
                                  onClick={() => handlePublish(page.id)}
                                >
                                  <IconGlobe className="mr-2 h-4 w-4" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => {
                                  setPageToDelete(page.id);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-destructive"
                              >
                                <IconTrash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages} ({totalItems} total
                    items)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <IconChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <IconChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconChartBar className="h-5 w-5" />
                Landing Page Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsOverview
                landingPages={landingPages.map((page) => ({
                  id: page.id,
                  title: page.title,
                  slug: page.slug,
                }))}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              landing page and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pageToDelete && handleDelete(pageToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
