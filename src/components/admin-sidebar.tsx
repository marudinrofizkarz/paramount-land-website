"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BrainCircuit,
  Building,
  ImageIcon,
  MessageSquare, // Tambahkan icon untuk Contact Inquiries
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

function Logo() {
  const { resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState(
    "https://www.paramount-land.com/lib/images/paramount-land-logo.png"
  );
  const [isMounted, setIsMounted] = useState(false);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // For debugging
  useEffect(() => {
    console.log("Sidebar state:", state);
    console.log("isCollapsed:", isCollapsed);
  }, [state, isCollapsed]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setLogoSrc(
        resolvedTheme === "dark"
          ? "https://res.cloudinary.com/diyyyav1i/image/upload/v1754036143/paramount-light_ta1kve.png"
          : "https://www.paramount-land.com/lib/images/paramount-land-logo.png"
      );
    }
  }, [resolvedTheme, isMounted]);

  if (!isMounted) {
    return <div className="w-[150px] h-[40px]" />; // Placeholder to prevent layout shift
  }

  return (
    <div className="flex items-center">
      {/* Full logo when sidebar is expanded */}
      <div className={isCollapsed ? "hidden" : "block"}>
        <Image
          src={logoSrc}
          alt="Paramount Land logo"
          width={150}
          height={40}
          priority
        />
      </div>

      {/* Compact logo when sidebar is collapsed */}
      <div className={isCollapsed ? "block" : "hidden"}>
        <Image
          src="https://res.cloudinary.com/dx7xttb8a/image/upload/v1754146325/logo_xhylzg.jpg"
          alt="Paramount Land icon"
          width={40}
          height={40}
          className="rounded-md"
          priority
        />
      </div>
    </div>
  );
}
function SidebarContent() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { setOpenMobile } = useSidebar();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center p-2">
          <Link href="/" className="inline-flex items-center">
            <Logo />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem onClick={() => setOpenMobile(false)}>
          <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
            <Link href="/dashboard">
              <LayoutDashboard />
              Dashboard
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem onClick={() => setOpenMobile(false)}>
          <SidebarMenuButton
            asChild
            isActive={isActive("/dashboard/hero-sliders")}
          >
            <Link href="/dashboard/hero-sliders">
              <ImageIcon />
              Hero Sliders
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem onClick={() => setOpenMobile(false)}>
          <SidebarMenuButton
            asChild
            isActive={
              isActive("/dashboard/projects") ||
              pathname.startsWith("/dashboard/projects")
            }
          >
            <Link href="/dashboard/projects">
              <Building />
              Projects
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem onClick={() => setOpenMobile(false)}>
          <SidebarMenuButton
            asChild
            isActive={
              isActive("/dashboard/contact-inquiries") ||
              pathname.startsWith("/dashboard/contact-inquiries")
            }
          >
            <Link href="/dashboard/contact-inquiries">
              <MessageSquare />
              Contact Inquiries
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem onClick={() => setOpenMobile(false)}>
          <SidebarMenuButton
            asChild
            isActive={isActive("/dashboard/ai/suggest-layout")}
          >
            <Link href="/dashboard/ai/suggest-layout">
              <BrainCircuit />
              Layout AI
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent />
    </Sidebar>
  );
}
