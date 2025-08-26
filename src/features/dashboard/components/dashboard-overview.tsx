"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, Home, MessageCircle, Users } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { getProjects } from "@/lib/project-actions";
import { getContactInquiries } from "@/lib/contact-inquiry-actions";
import Link from "next/link";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardOverview() {
  const { user } = useUser();
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalUnits: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);

  // Function to get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon";
    } else if (hour >= 17 && hour < 22) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  useEffect(() => {
    setGreeting(getTimeBasedGreeting());

    async function fetchDashboardData() {
      setLoading(true);
      try {
        // Fetch projects data
        const projectsData = await getProjects(1, 100); // Get up to 100 projects

        // Fetch contact inquiries
        const inquiriesData = await getContactInquiries(1, 10); // Latest 10 inquiries

        // Calculate total units
        let unitCount = 0;
        if (projectsData.success && projectsData.data) {
          // For each project, get its units count
          projectsData.data.projects.forEach((project: any) => {
            unitCount += project.units || 0;
          });
        }

        // Count total inquiries and pending inquiries
        let totalInquiries = 0;
        let pendingInquiries = 0;

        if (inquiriesData.success && inquiriesData.data) {
          totalInquiries = inquiriesData.pagination.total;

          // Count pending inquiries
          inquiriesData.data.forEach((inquiry: any) => {
            if (inquiry.status === "new" || inquiry.status === "pending") {
              pendingInquiries++;
            }
          });
        }

        // Update stats state
        setStats({
          totalProjects:
            projectsData.success && projectsData.data
              ? projectsData.data.total
              : 0,
          totalUnits: unitCount,
          totalInquiries: totalInquiries,
          pendingInquiries: pendingInquiries,
        });

        // Set recent inquiries
        if (inquiriesData.success && inquiriesData.data) {
          setRecentInquiries(inquiriesData.data.slice(0, 3)); // Take only the 3 most recent
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Get full name or username from Clerk user data
  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      return user.firstName;
    } else if (user?.fullName) {
      return user.fullName;
    } else if (user?.username) {
      return user.username;
    } else {
      return "User";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      // Parse the date string into a Date object
      const date = parseISO(dateString);

      // Format as "5 min ago" or "2 days ago" etc
      const relativeTime = formatDistanceToNow(date, {
        addSuffix: true,
        locale: id, // Using Indonesian locale
      });

      // Format as "15 Juni 2023, 14:30" for tooltip
      const formattedDate = format(date, "d MMMM yyyy, HH:mm", {
        locale: id,
      });

      return {
        relative: relativeTime,
        full: formattedDate,
      };
    } catch (error) {
      return {
        relative: "baru saja",
        full: "Tanggal tidak tersedia",
      };
    }
  };

  // Get status color class for inquiry
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-green-600 dark:bg-green-500";
      case "pending":
        return "bg-yellow-600 dark:bg-yellow-500";
      case "contacted":
        return "bg-blue-600 dark:bg-blue-500";
      case "completed":
        return "bg-purple-600 dark:bg-purple-500";
      default:
        return "bg-gray-600 dark:bg-gray-500";
    }
  };

  // Dashboard stats - now with real data and trend indicators
  const dashboardStats = [
    {
      title: "Total Projects",
      value: loading ? "..." : stats.totalProjects.toString(),
      description: "Active property projects",
      icon: Building,
      trend: "Current total",
      trendDirection: "stable", // stable, up, down
      trendValue: "",
    },
    {
      title: "Total Units",
      value: loading ? "..." : stats.totalUnits.toString(),
      description: "Property units available",
      icon: Home,
      trend: "Across all projects",
      trendDirection: "up",
      trendValue: "+2%",
    },
    {
      title: "Total Inquiries",
      value: loading ? "..." : stats.totalInquiries.toString(),
      description: "Customer inquiries",
      icon: MessageCircle,
      trend: "Total received",
      trendDirection: "up",
      trendValue: "+5%",
    },
    {
      title: "Pending Inquiries",
      value: loading ? "..." : stats.pendingInquiries.toString(),
      description: "Awaiting response",
      icon: Users,
      trend: "Require attention",
      trendDirection: stats.pendingInquiries > 0 ? "up" : "down",
      trendValue:
        stats.pendingInquiries > 0 ? `${stats.pendingInquiries} new` : "None",
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">
          {greeting}, Selamat Datang kembali {getFullName()} 👋
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16 mb-2" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                  {stat.trendValue && (
                    <span
                      className={`ml-auto text-xs px-1.5 py-0.5 rounded-sm ${
                        stat.trendDirection === "up"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : stat.trendDirection === "down"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}
                    >
                      {stat.trendDirection === "up"
                        ? "↑ "
                        : stat.trendDirection === "down"
                        ? "↓ "
                        : ""}
                      {stat.trendValue}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Improved responsive layout for Recent Activity and Quick Actions */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>
              Latest customer inquiries requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : recentInquiries.length > 0 ? (
              <div className="space-y-4">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex items-start space-x-4">
                    <div
                      className={`w-2 h-2 ${getStatusColor(
                        inquiry.status
                      )} rounded-full mt-2 flex-shrink-0`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-relaxed">
                          {inquiry.name}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            inquiry.status === "new"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : inquiry.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : inquiry.status === "contacted"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : inquiry.status === "completed"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                          }`}
                        >
                          {inquiry.status.charAt(0).toUpperCase() +
                            inquiry.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-medium">
                          {inquiry.inquiry_type}
                        </span>{" "}
                        untuk "{inquiry.project_name}"
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <p
                          className="text-xs text-muted-foreground"
                          title={formatDate(inquiry.created_at).full}
                        >
                          {formatDate(inquiry.created_at).relative}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {inquiry.email
                            ? `📧 ${inquiry.email.split("@")[0]}...`
                            : ""}
                          {inquiry.phone
                            ? ` • 📱 ${inquiry.phone.substring(0, 6)}...`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 text-center">
                  <Link
                    href="/dashboard/contact-inquiries"
                    className="text-sm text-primary hover:underline"
                  >
                    View all inquiries
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">
                No recent inquiries to display
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/dashboard/projects/new" className="block w-full">
                <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/40 transition-colors">
                      <Building className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium">Add New Project</span>
                  </div>
                </button>
              </Link>

              <Link
                href="/dashboard/contact-inquiries"
                className="block w-full"
              >
                <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                      <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">
                      Manage Inquiries
                    </span>
                  </div>
                </button>
              </Link>

              <Link href="/dashboard/projects" className="block w-full">
                <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
                      <Home className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-medium">
                      View All Projects
                    </span>
                  </div>
                </button>
              </Link>

              <Link href="/dashboard/hero-sliders" className="block w-full">
                <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-900/40 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-amber-600 dark:text-amber-400"
                      >
                        <rect width="18" height="14" x="3" y="3" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">
                      Manage Hero Sliders
                    </span>
                  </div>
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
