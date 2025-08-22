"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";

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
  DialogTrigger,
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
import { websiteMenuSchema, WebsiteMenuFormValues } from "@/types/website-menu";
import {
  createWebsiteMenu,
  getWebsiteMenusFlat,
} from "@/lib/website-menu-actions";
import { useSweetAlert } from "@/hooks/use-sweet-alert";

interface AddMenuDialogProps {
  onSuccess?: () => void;
}

export function AddMenuDialog({ onSuccess }: AddMenuDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parentMenus, setParentMenus] = useState<any[]>([]);
  const { showSuccess, showError } = useSweetAlert();

  const form = useForm<WebsiteMenuFormValues>({
    resolver: zodResolver(websiteMenuSchema),
    defaultValues: {
      title: "",
      url: "",
      order: 0,
      isActive: true,
      parentId: "none",
      isMegaMenu: false,
      iconClass: "",
      description: "",
    },
  });

  // Fetch parent menus for selection
  useEffect(() => {
    if (open) {
      const fetchParentMenus = async () => {
        const { data = [], success } = await getWebsiteMenusFlat();
        if (success) {
          setParentMenus(data as any[]);
        }
      };

      fetchParentMenus();
    }
  }, [open]);

  const onSubmit = async (values: WebsiteMenuFormValues) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("url", values.url || "");
      formData.append("order", values.order.toString());
      formData.append("isActive", values.isActive.toString());
      formData.append(
        "parentId",
        values.parentId === "none" ? "" : values.parentId || ""
      );
      formData.append("isMegaMenu", values.isMegaMenu.toString());
      formData.append("iconClass", values.iconClass || "");
      formData.append("description", values.description || "");

      const result = await createWebsiteMenu(formData);

      if (result.success) {
        showSuccess("Menu created successfully!");
        form.reset();
        setOpen(false);
        onSuccess?.();
      } else {
        showError(result.message || "Failed to create menu");
      }
    } catch (error) {
      showError("An unexpected error occurred");
      console.error("Error creating menu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add New Menu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Menu</DialogTitle>
          <DialogDescription>
            Create a new menu item for your website navigation.
          </DialogDescription>
        </DialogHeader>

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
                        defaultValue={field.value}
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

              {/* Icon Class Field */}
              {/* <FormField
                control={form.control}
                name="iconClass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Class</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., fas fa-home, lucide-home"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      CSS class for menu icon (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Description Field */}
              {/* <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter menu description (optional)"
                        {...field}
                        className="w-full resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

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
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
              >
                {isLoading ? "Creating..." : "Create Menu"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
