"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Edit2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { websiteMenuSchema, WebsiteMenuFormValues, MenuTreeItem } from "@/types/website-menu";
import {
  updateWebsiteMenu,
  getWebsiteMenusFlat,
  getWebsiteMenu,
} from "@/lib/website-menu-actions";
import { useSweetAlert } from "@/hooks/use-sweet-alert";

interface EditMenuDialogProps {
  menuId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditMenuDialog({ menuId, open, onOpenChange, onSuccess }: EditMenuDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Tambahkan state baru untuk proses submit
  const [parentMenus, setParentMenus] = useState<any[]>([]);
  const [menuData, setMenuData] = useState<MenuTreeItem | null>(null);
  const { showSuccess, showError } = useSweetAlert();

  const form = useForm<WebsiteMenuFormValues>({
    resolver: zodResolver(websiteMenuSchema),
    defaultValues: {
      title: "",
      url: "",
      order: 0,
      isActive: true,
      parentId: "",
      isMegaMenu: false,
      iconClass: "",
      description: "",
    },
  });

  // Fetch menu data when dialog opens
  useEffect(() => {
    if (open && menuId) {
      const fetchMenuData = async () => {
        try {
          setIsLoading(true);
          const result = await getWebsiteMenu(menuId);
          if (result.success && result.data) {
            const menu = result.data;
            setMenuData(menu);
            
            // Reset form with menu data
            form.reset({
              title: menu.title,
              url: menu.url || "",
              order: menu.order,
              isActive: menu.isActive,
              parentId: menu.parentId || "",
              isMegaMenu: menu.isMegaMenu,
              iconClass: menu.iconClass || "",
              description: menu.description || "",
            });
          } else {
            console.error("Failed to load menu data");
            onOpenChange(false);
          }
        } catch (error) {
          console.error("Error fetching menu data:", error);
          onOpenChange(false);
        } finally {
          setIsLoading(false);
        }
      };

      fetchMenuData();
    } else if (!open) {
      // Reset form and loading state when dialog closes
      setIsLoading(false);
      setIsSubmitting(false);
      setMenuData(null);
      // Reset form ke default values
      form.reset({
        title: "",
        url: "",
        order: 0,
        isActive: true,
        parentId: "",
        isMegaMenu: false,
        iconClass: "",
        description: "",
      });
    }
  }, [open, menuId]); // Hanya gunakan open dan menuId sebagai dependency

  // Fetch parent menus for selection
  useEffect(() => {
    if (open) {
      const fetchParentMenus = async () => {
        try {
          const { data = [], success } = await getWebsiteMenusFlat();
          if (success) {
            // Filter out current menu and its children to prevent circular references
            const filteredMenus = (data as any[]).filter(
              (menu: any) => menu.id !== menuId && menu.parentId !== menuId
            );
            setParentMenus(filteredMenus);
          }
        } catch (error) {
          console.error("Error fetching parent menus:", error);
        }
      };

      fetchParentMenus();
    }
  }, [open, menuId]);

  const onSubmit = async (values: WebsiteMenuFormValues) => {
    if (!menuId) return;
    
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("url", values.url || "");
      formData.append("order", values.order.toString());
      formData.append("isActive", values.isActive.toString());
      // Ubah nilai "none" menjadi string kosong
      formData.append("parentId", values.parentId === "none" ? "" : (values.parentId || ""));
      formData.append("isMegaMenu", values.isMegaMenu.toString());
      formData.append("iconClass", values.iconClass || "");
      formData.append("description", values.description || "");

      const result = await updateWebsiteMenu(menuId, formData);

      if (result.success) {
        showSuccess("Menu updated successfully!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        showError(result.message || "Failed to update menu");
      }
    } catch (error) {
      console.error("Error updating menu:", error);
      showError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false); // Reset state isSubmitting setelah selesai
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>
            Update the menu details below.
          </DialogDescription>
        </DialogHeader>

        {isLoading && !menuData ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4">
                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (Nama Menu) *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter menu title"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* URL Field */}
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter URL (e.g., /about, https://example.com)"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Order Field */}
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
                              field.onChange(Number(e.target.value))
                            }
                            className="w-full"
                          />
                        </FormControl>
                        <FormDescription>
                          Display order (lower numbers appear first)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Parent Menu Field */}
                  <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Menu</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select parent menu (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">
                              No Parent (Top Level)
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Active Switch */}
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>Enable this menu item</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Mega Menu Switch */}
                  <FormField
                    control={form.control}
                    name="isMegaMenu"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Mega Menu</FormLabel>
                          <FormDescription>
                            Enable mega menu layout
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                {/* // Pada bagian render button update */}
                <Button
                  type="submit"
                  disabled={isSubmitting} // Gunakan isSubmitting bukan isLoading
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                >
                  {isSubmitting ? "Updating..." : "Update Menu"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}