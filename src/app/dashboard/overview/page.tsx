import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Overview | Paramount Land",
  description: "Overview dashboard for Paramount Land property management",
};

export default function DashboardOverviewPage() {
  // Redirect to main dashboard page since overview is now the default
  redirect("/dashboard");
}
