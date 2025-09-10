"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Filter,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  updateInquiryStatus,
  deleteInquiry,
} from "@/lib/contact-inquiry-actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface ContactInquiry {
  id: string;
  project_id: string;
  project_name: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
  unit_slug: string | null;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
}

interface ContactInquiriesTableProps {
  inquiries: ContactInquiry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  currentStatus: string;
}

export function ContactInquiriesTable({
  inquiries,
  pagination,
  currentStatus,
}: ContactInquiriesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const router = useRouter();

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="default" className="bg-blue-500">
            New
          </Badge>
        );
      case "contacted":
        return (
          <Badge variant="default" className="bg-orange-500">
            Contacted
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="default" className="bg-green-500">
            Closed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getInquiryTypeBadge = (type: string) => {
    switch (type) {
      case "general":
        return <Badge variant="outline">General</Badge>;
      case "pricing":
        return <Badge variant="outline">Pricing</Badge>;
      case "visit":
        return <Badge variant="outline">Visit</Badge>;
      case "unit_specific":
        return <Badge variant="outline">Unit Specific</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const result = await updateInquiryStatus(id, newStatus);
    if (result.success) {
      toast({
        title: "Status Updated",
        description: "Inquiry status has been updated successfully.",
      });
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      const result = await deleteInquiry(id);
      if (result.success) {
        toast({
          title: "Inquiry Deleted",
          description: "The inquiry has been deleted successfully.",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete inquiry.",
          variant: "destructive",
        });
      }
    }
  };

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.project_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name, email, or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select
          value={currentStatus}
          onValueChange={(value) => {
            const params = new URLSearchParams();
            if (value !== "all") params.set("status", value);
            router.push(`/dashboard/contact-inquiries?${params.toString()}`);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-muted-foreground">
                    No inquiries found
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredInquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{inquiry.name}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {inquiry.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {inquiry.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{inquiry.project_name}</div>
                      {inquiry.unit_slug && (
                        <div className="text-sm text-muted-foreground">
                          Unit: {inquiry.unit_slug}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getInquiryTypeBadge(inquiry.inquiry_type)}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="space-y-2">
                      {inquiry.message && (
                        <div className="text-sm">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-3 w-3 text-muted-foreground" />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-auto font-normal"
                              onClick={() => toggleRowExpansion(inquiry.id)}
                            >
                              {expandedRows.has(inquiry.id) ? (
                                <>
                                  <ChevronUp className="h-3 w-3 mr-1" />
                                  Hide message
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3 w-3 mr-1" />
                                  View message
                                </>
                              )}
                            </Button>
                          </div>
                          {expandedRows.has(inquiry.id) && (
                            <div className="mt-2 p-2 bg-muted rounded-sm">
                              <pre className="text-xs whitespace-pre-wrap font-sans">
                                {inquiry.message}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                      {!inquiry.message && (
                        <div className="text-xs text-muted-foreground italic">
                          No message provided
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(inquiry.created_at), "MMM dd, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(inquiry.id, "contacted")
                          }
                          disabled={inquiry.status === "contacted"}
                        >
                          Mark as Contacted
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(inquiry.id, "closed")
                          }
                          disabled={inquiry.status === "closed"}
                        >
                          Mark as Closed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(inquiry.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} inquiries
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => {
                const params = new URLSearchParams();
                params.set("page", String(pagination.page - 1));
                if (currentStatus !== "all")
                  params.set("status", currentStatus);
                router.push(
                  `/dashboard/contact-inquiries?${params.toString()}`
                );
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => {
                const params = new URLSearchParams();
                params.set("page", String(pagination.page + 1));
                if (currentStatus !== "all")
                  params.set("status", currentStatus);
                router.push(
                  `/dashboard/contact-inquiries?${params.toString()}`
                );
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
