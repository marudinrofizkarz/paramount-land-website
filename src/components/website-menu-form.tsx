"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { websiteMenuSchema, WebsiteMenuFormValues } from "@/types/website-menu";
import {
  createWebsiteMenu,
  updateWebsiteMenu,
  getWebsiteMenusFlat,
} from "@/lib/website-menu-actions";
import { MenuTreeItem } from "@/types/website-menu";
import { useSweetAlert } from "@/hooks/use-sweet-alert";

interface WebsiteMenuFormProps {
  initialData?: MenuTreeItem;
  onSuccess?: () => void;
}

export function WebsiteMenuForm({
  initialData,
  onSuccess,
}: WebsiteMenuFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [parentMenus, setParentMenus] = useState<any[]>([]);
  const { showSuccess, showError } = useSweetAlert();

  const form = useForm<WebsiteMenuFormValues>({
    resolver: zodResolver(websiteMenuSchema),
    defaultValues: {
      title: initialData?.title || "",
      url: initialData?.url || "",
      order: initialData?.order || 0,
      isActive: initialData?.isActive ?? true,
      parentId: initialData?.id ? undefined : "", // Don't allow editing parent of existing menu for now
      isMegaMenu: initialData?.isMegaMenu || false,
      iconClass: initialData?.iconClass || "",
      description: initialData?.description || "",
    },
  });

  // Fetch parent menus for selection
  useEffect(() => {
    const fetchParentMenus = async () => {
      const { data = [], success } = await getWebsiteMenusFlat();
      if (success) {
        // Filter out current menu and its children to prevent circular references
        const filteredMenus = (data as any[]).filter(
          (menu: any) =>
            menu.id !== initialData?.id && menu.parentId !== initialData?.id
        );
        setParentMenus(filteredMenus);
      }
    };

    fetchParentMenus();
  }, [initialData?.id]);

  const onSubmit = async (values: WebsiteMenuFormValues) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("url", values.url || "");
      formData.append("order", values.order.toString());
      formData.append("isActive", values.isActive.toString());
      formData.append("parentId", values.parentId || "");
      formData.append("isMegaMenu", values.isMegaMenu.toString());
      formData.append("iconClass", values.iconClass || "");
      formData.append("description", values.description || "");

      const result = initialData?.id
        ? await updateWebsiteMenu(initialData.id, formData)
        : await createWebsiteMenu(formData);

      if (result.success) {
        showSuccess(
          initialData?.id
            ? "Menu updated successfully!"
            : "Menu created successfully!"
        );
        form.reset();
        onSuccess?.();
      } else {
        showError(result.message || "An error occurred while saving the menu.");
      }
    } catch (error) {
      showError("An unexpected error occurred while saving the menu.");
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          {initialData?.id ? "Edit Menu" : "Create New Menu"}
        </CardTitle>
        <CardDescription>
          {initialData?.id
            ? "Update the menu details below."
            : "Fill in the details to create a new menu item."}
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Menu title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="/about-us or https://example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty for menu items that only serve as containers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Display order (lower numbers first)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Menu</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        // Convert "root" back to empty string for the form
                        field.onChange(value === "root" ? "" : value);
                      }}
                      defaultValue={field.value || "root"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent menu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="root">
                          No Parent (Root Menu)
                        </SelectItem>
                        {parentMenus.map((menu) => (
                          <SelectItem key={menu.id} value={menu.id}>
                            {menu.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="iconClass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon Class</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="fas fa-home or lucide-home"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    CSS class for the menu icon (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Menu description (optional)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Used for mega menu descriptions or tooltips
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Whether this menu item is visible on the website
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isMegaMenu"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Mega Menu</FormLabel>
                      <FormDescription>
                        Enable mega menu layout for this item
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading
                ? "Saving..."
                : initialData?.id
                ? "Update Menu"
                : "Create Menu"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
