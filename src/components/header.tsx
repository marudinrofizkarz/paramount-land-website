"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Menu } from "lucide-react";
import React, { useState, useEffect } from "react";
import type { Project } from "@/lib/types";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "next-themes";
import { WebsiteNavigation, useWebsiteMenus } from "./website-navigation"; // Import WebsiteNavigation dan useWebsiteMenus

export function Header({ projects }: { projects: Project[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  // Referensi langsung ke logo lokal untuk performa yang lebih baik
  const lightLogoSrc = "/images/paramount-logo-light.png"; // Simpan logo di folder public
  const darkLogoSrc = "/images/paramount-logo-dark.png"; // Simpan logo di folder public

  const [logoSrc, setLogoSrc] = useState(lightLogoSrc);
  const [isMounted, setIsMounted] = useState(false);
  const { menus, loading: menusLoading } = useWebsiteMenus(); // Tambahkan hook useWebsiteMenus

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setLogoSrc(resolvedTheme === "dark" ? darkLogoSrc : lightLogoSrc);
    }
  }, [resolvedTheme, isMounted]);

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center"></div>
      </header>
    );
  }

  // Render mobile menu item
  const renderMobileMenuItem = (menu: any) => {
    const hasChildren = menu.children && menu.children.length > 0;

    if (hasChildren) {
      return (
        <AccordionItem
          key={menu.id}
          value={menu.id}
          className="border-b border-gray-100 dark:border-gray-800 mobile-menu-item"
        >
          <AccordionTrigger className="text-sm font-medium py-4 px-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
            {menu.title}
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="flex flex-col space-y-3 pl-4 pr-2">
              {menu.children.map((child: any) => {
                const hasGrandchildren =
                  child.children && child.children.length > 0;

                if (hasGrandchildren) {
                  return (
                    <div
                      key={child.id}
                      className="space-y-2 mobile-submenu rounded-lg p-3"
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100 py-2 border-b border-gray-100 dark:border-gray-800">
                        {child.title}
                      </div>
                      <div className="pl-3 space-y-2">
                        {child.children.map((grandChild: any) => (
                          <Link
                            key={grandChild.id}
                            href={grandChild.url || "#"}
                            className="block text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 py-1.5 transition-colors duration-200"
                            onClick={() => setIsOpen(false)}
                          >
                            {grandChild.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={child.id}
                    href={child.url || "#"}
                    className="block text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 py-2 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {child.title}
                    {child.description && (
                      <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {child.description}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    }

    return (
      <div
        key={menu.id}
        className="border-b border-gray-100 dark:border-gray-800 last:border-b-0 mobile-menu-item"
      >
        <Link
          href={menu.url || "#"}
          className="block py-4 px-2 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          onClick={() => setIsOpen(false)}
        >
          {menu.title}
        </Link>
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="inline-block">
            <Image
              src={logoSrc}
              alt="Paramount Land logo"
              width={150}
              height={40}
              className="transition-all duration-200 hover:opacity-90"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Ganti nav dengan WebsiteNavigation */}
          <div className="hidden md:block flex-grow">
            <WebsiteNavigation className="flex items-center space-x-6 text-sm font-medium" />
          </div>
          <ModeToggle />

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0 w-[350px] sm:w-[400px]">
                <SheetTitle className="sr-only">
                  Mobile Navigation Menu
                </SheetTitle>
                <div className="flex items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                  <Link
                    href="/"
                    className="flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <Image
                      src={logoSrc}
                      alt="Paramount Land logo"
                      width={150}
                      height={40}
                      className="mr-2 h-auto w-auto max-h-[40px] max-w-[150px] object-contain"
                    />
                  </Link>
                </div>
                <div className="flex flex-col h-[calc(100vh-6rem)] overflow-y-auto">
                  <div className="flex-1 py-4">
                    {/* Gunakan menu dari hook useWebsiteMenus */}
                    {!menusLoading && menus.length > 0 ? (
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full px-2"
                      >
                        {menus.map((menu) => renderMobileMenuItem(menu))}
                      </Accordion>
                    ) : (
                      <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        {menusLoading ? (
                          <div className="space-y-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                          </div>
                        ) : (
                          "No menu items available"
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      © 2025 Paramount Land. All rights reserved.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
