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
  MessageSquare,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

function Logo() {
  const { resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("https://res.cloudinary.com/dx7xttb8a/image/upload/v1754146325/logo_xhylzg.jpg");
  const [isMounted, setIsMounted] = useState(false);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Always use the Cloudinary logo URL
      setLogoSrc("https://res.cloudinary.com/dx7xttb8a/image/upload/v1754146325/logo_xhylzg.jpg");
    }
  }, [isMounted]);

  if (!isMounted) {
    return <div className="w-[150px] h-[40px]" />; // Placeholder to prevent layout shift
  }

  return (
    <div className="flex items-center justify-center">
      {/* Full logo when sidebar is expanded */}
      <div className={isCollapsed ? "hidden" : "block"}>
        <Image
          src={logoSrc}
          alt="Paramount Land logo"
          width={150}
          height={40}
          className="h-auto w-auto max-h-[40px] max-w-[150px] object-contain"
          priority
          unoptimized
        />
      </div>

      {/* Compact logo when sidebar is collapsed */}
      <div className={isCollapsed ? "flex items-center justify-center w-full" : "hidden"}>
        <Image
          src={logoSrc}
          alt="Paramount Land icon"
          width={40}
          height={40}
          className="w-10 h-10 object-contain rounded-sm"
          priority
          unoptimized
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
        <div className="flex items-center justify-center p-2">
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
