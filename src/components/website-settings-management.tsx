"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebsiteSettingsForm } from "./website-settings-form";
import { WebsiteSettings } from "@/types/website-settings";
import { Settings, Globe, Image, Phone, Share2, Search, Shield } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface WebsiteSettingsManagementProps {
  initialSettings: WebsiteSettings;
}

export function WebsiteSettingsManagement({
  initialSettings,
}: WebsiteSettingsManagementProps) {
  const [settings, setSettings] = useState<WebsiteSettings>(initialSettings);

  const handleSettingsUpdate = (updatedSettings: WebsiteSettings) => {
    setSettings(updatedSettings);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Website Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your website's appearance, contact information, and SEO settings.
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        {/* Mobile: Scrollable tabs */}
        <div className="md:hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-max">
              <TabsTrigger value="general" className="flex items-center gap-2 px-3">
                <Globe className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="branding" className="flex items-center gap-2 px-3">
                <Image className="h-4 w-4" />
                <span>Branding</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2 px-3">
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2 px-3">
                <Share2 className="h-4 w-4" />
                <span>Social</span>
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2 px-3">
                <Search className="h-4 w-4" />
                <span>SEO</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 px-3">
                <Shield className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="flex items-center gap-2 px-3">
                <Settings className="h-4 w-4" />
                <span>Maintenance</span>
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:block">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Branding</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">SEO</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Maintenance</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6">
          <WebsiteSettingsForm 
            initialSettings={settings} 
            onUpdate={handleSettingsUpdate}
          />
        </div>
      </Tabs>
    </div>
  );
}