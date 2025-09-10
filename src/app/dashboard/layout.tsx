import AppSidebar from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ActiveThemeProvider } from "@/components/active-theme";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import packageJson from "../../../package.json";

export const metadata: Metadata = {
  title:
    "Admin Dashboard | Paramount Land - Building Homes and People with Heart",
  description:
    "Admin dashboard for managing Paramount Land properties, inquiries, news, and website settings",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  // Get the active theme from cookies
  const activeTheme = cookieStore.get("active_theme")?.value || "default";

  return (
    <ActiveThemeProvider initialTheme={activeTheme}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex h-screen w-full overflow-hidden dashboard-layout">
          <AppSidebar />
          <SidebarInset className="flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
            <footer className="border-t py-4 px-4 md:px-6 text-center text-xs text-muted-foreground bg-background shrink-0">
              <p>
                © {new Date().getFullYear()} Paramount Land. All rights
                reserved. • App Version: {packageJson.version}
              </p>
            </footer>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ActiveThemeProvider>
  );
}
