import { getContactInquiries } from "@/lib/contact-inquiry-actions";
import { ContactInquiriesTable } from "@/components/contact-inquiries-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Clock, CheckCircle } from "lucide-react";

interface ContactInquiriesPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
  }>;
}

export default async function ContactInquiriesPage({ searchParams }: ContactInquiriesPageProps) {
  // Await searchParams sebelum mengakses propertinya
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const status = params.status || 'all';
  
  const inquiriesResponse = await getContactInquiries(page, 10, status);
  const inquiries = inquiriesResponse.success ? inquiriesResponse.data : [];
  const pagination = inquiriesResponse.pagination;

  // Get stats
  const allInquiries = await getContactInquiries(1, 1000);
  const allData = allInquiries.success ? allInquiries.data : [];
  
  const stats = {
    total: allData.length,
    new: allData.filter(i => i.status === 'new').length,
    contacted: allData.filter(i => i.status === 'contacted').length,
    closed: allData.filter(i => i.status === 'closed').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Inquiries</h1>
        <p className="text-muted-foreground">
          Manage customer inquiries and follow up on leads
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time inquiries
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.contacted}</div>
            <p className="text-xs text-muted-foreground">
              Being followed up
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.closed}</div>
            <p className="text-xs text-muted-foreground">
              Successfully closed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inquiries Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Inquiries</CardTitle>
          <CardDescription>
            View and manage customer inquiries from your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactInquiriesTable 
            inquiries={inquiries} 
            pagination={pagination}
            currentStatus={status}
          />
        </CardContent>
      </Card>
    </div>
  );
}