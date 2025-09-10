"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconEye,
  IconClick,
  IconTrendingUp,
  IconCalendar,
} from "@tabler/icons-react";

interface AnalyticsData {
  landingPageId: string;
  landingPageTitle?: string;
  landingPageSlug?: string;
  visits: number;
  conversions: number;
  conversionRate: number;
  lastVisit: string | null;
  lastConversion: string | null;
}

interface AnalyticsOverviewProps {
  landingPages: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
}

export function AnalyticsOverview({ landingPages }: AnalyticsOverviewProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">(
    "30d"
  );

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, landingPages]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const data: AnalyticsData[] = [];

      // Calculate date range
      const endDate = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case "7d":
          startDate.setDate(endDate.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(endDate.getDate() - 30);
          break;
        case "90d":
          startDate.setDate(endDate.getDate() - 90);
          break;
        case "all":
          startDate = new Date("2020-01-01"); // Far back date
          break;
      }

      for (const page of landingPages) {
        try {
          const params = new URLSearchParams();
          params.append("landingPageId", page.id);
          params.append("timeRange", timeRange);

          const response = await fetch(`/api/analytics?${params}`);
          const analyticsResult = await response.json();

          if (analyticsResult.success && analyticsResult.data) {
            const rows = analyticsResult.data as any[];

            // Process the raw data to get summaries
            const visits = rows.filter(
              (row: any) => row.event_type === "visit"
            ).length;
            const conversions = rows.filter(
              (row: any) => row.event_type === "conversion"
            ).length;

            const visitRows = rows.filter(
              (row: any) => row.event_type === "visit"
            );
            const conversionRows = rows.filter(
              (row: any) => row.event_type === "conversion"
            );

            const lastVisit =
              visitRows.length > 0 ? visitRows[0].created_at : null;
            const lastConversion =
              conversionRows.length > 0 ? conversionRows[0].created_at : null;

            data.push({
              landingPageId: page.id,
              landingPageTitle: page.title,
              landingPageSlug: page.slug,
              visits,
              conversions,
              conversionRate: visits > 0 ? (conversions / visits) * 100 : 0,
              lastVisit,
              lastConversion,
            });
          } else {
            // No data found, add empty entry
            data.push({
              landingPageId: page.id,
              landingPageTitle: page.title,
              landingPageSlug: page.slug,
              visits: 0,
              conversions: 0,
              conversionRate: 0,
              lastVisit: null,
              lastConversion: null,
            });
          }
        } catch (error) {
          console.error(`Error fetching analytics for ${page.title}:`, error);
          // Add empty entry on error
          data.push({
            landingPageId: page.id,
            landingPageTitle: page.title,
            landingPageSlug: page.slug,
            visits: 0,
            conversions: 0,
            conversionRate: 0,
            lastVisit: null,
            lastConversion: null,
          });
        }
      }

      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalVisits = analyticsData.reduce((sum, data) => sum + data.visits, 0);
  const totalConversions = analyticsData.reduce(
    (sum, data) => sum + data.conversions,
    0
  );
  const overallConversionRate =
    totalVisits > 0 ? (totalConversions / totalVisits) * 100 : 0;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "7d":
        return "Last 7 days";
      case "30d":
        return "Last 30 days";
      case "90d":
        return "Last 90 days";
      case "all":
        return "All time";
      default:
        return "Last 30 days";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Landing Page Analytics</h2>
          <p className="text-muted-foreground">
            Track performance and conversions for your landing pages
          </p>
        </div>

        <Select
          value={timeRange}
          onValueChange={(value: any) => setTimeRange(value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <IconEye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalVisits.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {getTimeRangeLabel(timeRange)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Conversions
            </CardTitle>
            <IconClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalConversions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Form submissions</p>
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
            <div className="text-2xl font-bold">
              {overallConversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Landing Page Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Landing Page</TableHead>
                  <TableHead className="text-center">Visits</TableHead>
                  <TableHead className="text-center">Conversions</TableHead>
                  <TableHead className="text-center">Conv. Rate</TableHead>
                  <TableHead className="text-center">Last Visit</TableHead>
                  <TableHead className="text-center">Last Conversion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No analytics data available
                    </TableCell>
                  </TableRow>
                ) : (
                  analyticsData
                    .sort((a, b) => b.visits - a.visits)
                    .map((data) => (
                      <TableRow key={data.landingPageId}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {data.landingPageTitle}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              /lp/{data.landingPageSlug}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{data.visits}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              data.conversions > 0 ? "default" : "secondary"
                            }
                          >
                            {data.conversions}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              data.conversionRate >= 5
                                ? "default"
                                : data.conversionRate >= 2
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {data.conversionRate.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {formatDate(data.lastVisit)}
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {formatDate(data.lastConversion)}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
