"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TabsContent,
} from "@/components/ui/tabs";
import { websiteSettingsSchema, WebsiteSettingsFormValues, WebsiteSettings } from "@/types/website-settings";
import { updateWebsiteSettings } from "@/lib/website-settings-actions";
import { useSweetAlert } from "@/hooks/use-sweet-alert";
import { Save, Globe, Image, Phone, Share2, Search, Shield, Settings } from "lucide-react";

interface WebsiteSettingsFormProps {
  initialSettings: WebsiteSettings;
  onUpdate?: (updatedSettings: WebsiteSettings) => void;
}

export function WebsiteSettingsForm({
  initialSettings,
  onUpdate,
}: WebsiteSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useSweetAlert();

  const form = useForm<WebsiteSettingsFormValues>({
    resolver: zodResolver(websiteSettingsSchema),
    defaultValues: {
      siteTitle: initialSettings.siteTitle || "",
      siteDescription: initialSettings.siteDescription || "",
      siteFavicon: initialSettings.siteFavicon || "",
      logoLight: initialSettings.logoLight || "",
      logoDark: initialSettings.logoDark || "",
      logoFooter: initialSettings.logoFooter || "",
      address: initialSettings.address || "",
      phoneNumber: initialSettings.phoneNumber || "",
      whatsappNumber: initialSettings.whatsappNumber || "",
      email: initialSettings.email || "",
      facebookUrl: initialSettings.facebookUrl || "",
      instagramUrl: initialSettings.instagramUrl || "",
      twitterUrl: initialSettings.twitterUrl || "",
      linkedinUrl: initialSettings.linkedinUrl || "",
      youtubeUrl: initialSettings.youtubeUrl || "",
      tiktokUrl: initialSettings.tiktokUrl || "",
      metaKeywords: initialSettings.metaKeywords || "",
      metaAuthor: initialSettings.metaAuthor || "",
      ogImage: initialSettings.ogImage || "",
      copyrightText: initialSettings.copyrightText || "",
      footerDescription: initialSettings.footerDescription || "",
      googleAnalyticsId: initialSettings.googleAnalyticsId || "",
      googleTagManagerId: initialSettings.googleTagManagerId || "",
      facebookPixelId: initialSettings.facebookPixelId || "",
      businessHours: initialSettings.businessHours || "",
      maintenanceMode: initialSettings.maintenanceMode || false,
      maintenanceMessage: initialSettings.maintenanceMessage || "",
    },
  });

  const onSubmit = async (values: WebsiteSettingsFormValues) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      
      // Append all form values
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const result = await updateWebsiteSettings(formData);

      if (result.success) {
        showSuccess("Success!", result.message);
        
        // Update the settings with new values
        const updatedSettings: WebsiteSettings = {
          ...initialSettings,
          ...values,
          updatedAt: new Date().toISOString(),
        };
        
        onUpdate?.(updatedSettings);
      } else {
        showError("Error!", result.message);
      }
    } catch (error) {
      console.error("Error updating website settings:", error);
      showError("Error!", "Failed to update website settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic website information and identity settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="siteTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Website Title" {...field} />
                    </FormControl>
                    <FormDescription>
                      The main title of your website that appears in browser tabs and search results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="siteDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of your website"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description that appears in search engine results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="siteFavicon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favicon URL</FormLabel>
                    <FormControl>
                      <Input 
                        type="url"
                        placeholder="https://example.com/favicon.ico"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL to your website's favicon (small icon in browser tabs).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Settings Tab */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Branding & Logos
              </CardTitle>
              <CardDescription>
                Upload and manage your website logos and branding assets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="logoLight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Light Mode Logo URL</FormLabel>
                    <FormControl>
                      <Input 
                        type="url"
                        placeholder="https://example.com/logo-light.png"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Logo displayed in light theme mode.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="logoDark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dark Mode Logo URL</FormLabel>
                    <FormControl>
                      <Input 
                        type="url"
                        placeholder="https://example.com/logo-dark.png"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Logo displayed in dark theme mode.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="logoFooter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Footer Logo URL</FormLabel>
                    <FormControl>
                      <Input 
                        type="url"
                        placeholder="https://example.com/logo-footer.png"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional logo for the website footer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Manage your business contact details and location information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Your business address"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="contact@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Social Media Links
              </CardTitle>
              <CardDescription>
                Add links to your social media profiles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="facebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <Input 
                          type="url"
                          placeholder="https://facebook.com/yourpage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input 
                          type="url"
                          placeholder="https://instagram.com/yourprofile"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="twitterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter URL</FormLabel>
                      <FormControl>
                        <Input 
                          type="url"
                          placeholder="https://twitter.com/yourhandle"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input 
                          type="url"
                          placeholder="https://linkedin.com/company/yourcompany"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="youtubeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube URL</FormLabel>
                      <FormControl>
                        <Input 
                          type="url"
                          placeholder="https://youtube.com/c/yourchannel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tiktokUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TikTok URL</FormLabel>
                      <FormControl>
                        <Input 
                          type="url"
                          placeholder="https://tiktok.com/@yourusername"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                SEO Settings
              </CardTitle>
              <CardDescription>
                Optimize your website for search engines.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="metaKeywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Keywords</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="keyword1, keyword2, keyword3"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated keywords for SEO (optional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="metaAuthor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Author information for meta tags.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ogImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Open Graph Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        type="url"
                        placeholder="https://example.com/og-image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Image displayed when your website is shared on social media.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="copyrightText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Copyright Text</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="© 2024 Your Company. All rights reserved."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="footerDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Footer Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description for the footer section"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Analytics & Tracking
              </CardTitle>
              <CardDescription>
                Configure analytics and tracking codes for your website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="googleAnalyticsId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Analytics ID</FormLabel>
                    <FormControl>
                      <Input placeholder="G-XXXXXXXXXX" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your Google Analytics measurement ID.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="googleTagManagerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Tag Manager ID</FormLabel>
                    <FormControl>
                      <Input placeholder="GTM-XXXXXXX" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your Google Tag Manager container ID.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="facebookPixelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook Pixel ID</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789012345" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your Facebook Pixel ID for tracking conversions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Maintenance Mode
              </CardTitle>
              <CardDescription>
                Control website maintenance mode and display custom messages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Enable Maintenance Mode
                      </FormLabel>
                      <FormDescription>
                        When enabled, visitors will see a maintenance page instead of your website.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maintenanceMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maintenance Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="We're currently performing scheduled maintenance. Please check back soon!"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Custom message displayed during maintenance mode.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Hours (JSON)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder='{"monday": {"open": "09:00", "close": "17:00", "closed": false}}'
                        className="resize-none font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Business hours in JSON format for structured data.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}