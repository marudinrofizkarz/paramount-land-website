"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  IconGripVertical,
  IconEdit,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconChevronRight,
  IconChevronDown,
  IconSettings,
  IconChevronLeft,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MenuTreeItem } from "@/types/website-menu";
import {
  deleteWebsiteMenu,
  updateWebsiteMenu,
  getWebsiteMenus,
} from "@/lib/website-menu-actions";
import { useSweetAlert } from "@/hooks/use-sweet-alert";

interface WebsiteMenuListProps {
  initialMenus: MenuTreeItem[];
  onEditAction: (menuId: string) => void;
}

export function WebsiteMenuList({
  initialMenus,
  onEditAction,
}: WebsiteMenuListProps) {
  const [menus, setMenus] = useState<MenuTreeItem[]>(initialMenus);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { showSuccess, showError, showConfirmation } = useSweetAlert();

  // Toggle menu active status
  const toggleMenuStatus = async (menu: MenuTreeItem) => {
    try {
      const formData = new FormData();
      formData.append("title", menu.title);
      formData.append("url", menu.url || "");
      formData.append("order", menu.order.toString());
      formData.append("isActive", (!menu.isActive).toString());
      formData.append("parentId", ""); // We'll handle parent separately
      formData.append("isMegaMenu", menu.isMegaMenu.toString());
      formData.append("iconClass", menu.iconClass || "");
      formData.append("description", menu.description || "");

      const result = await updateWebsiteMenu(menu.id, formData);
      if (result.success) {
        // Refresh menus
        const { data = [], success } = await getWebsiteMenus();
        if (success) {
          setMenus(data);
        }
        toast.success(`Menu ${!menu.isActive ? "activated" : "deactivated"}`);
      } else {
        toast.error(result.message || "Failed to update menu");
      }
    } catch (error) {
      console.error("Error toggling menu status:", error);
      toast.error("An error occurred");
    }
  };

  // Handle menu deletion
  const handleDeleteMenu = async (menuId: string) => {
    try {
      const confirmation = await showConfirmation(
        "Delete Menu Item",
        "Are you sure you want to delete this menu item? This action cannot be undone and will also delete all child menu items.",
        "Yes, delete it!"
      );

      if (confirmation.isConfirmed) {
        const result = await deleteWebsiteMenu(menuId);
        if (result.success) {
          // Refresh menus
          const { data = [], success } = await getWebsiteMenus();
          if (success) {
            setMenus(data);
          }
          showSuccess("Menu deleted successfully!");
        } else {
          showError(result.message || "Failed to delete menu");
        }
      }
    } catch (error) {
      console.error("Error deleting menu:", error);
      showError("An error occurred while deleting the menu");
    }
  };

  // Toggle expanded state for menu items with children
  const toggleExpanded = (menuId: string) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  // Flatten all menus for pagination (only root level items)
  const rootMenus = menus;

  // Pagination logic
  const totalPages = Math.ceil(rootMenus.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMenus = rootMenus.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  // Render a single menu item
  const renderMenuItem = (menu: MenuTreeItem, level: number = 0) => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isExpanded = expandedMenus.has(menu.id);

    return (
      <div key={menu.id} className="space-y-2">
        <Card className="border-l-4 border-l-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Drag handle */}
                <div className="cursor-grab">
                  <IconGripVertical className="h-4 w-4 text-muted-foreground" />
                </div>

                {/* Expand/Collapse button for parents */}
                {hasChildren && (
                  <Collapsible
                    open={isExpanded}
                    onOpenChange={() => toggleExpanded(menu.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                        {isExpanded ? (
                          <IconChevronDown className="h-4 w-4" />
                        ) : (
                          <IconChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                )}

                {/* Menu content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{menu.title}</h4>
                    {menu.isMegaMenu && (
                      <Badge variant="secondary" className="text-xs">
                        Mega Menu
                      </Badge>
                    )}
                    <Badge
                      variant={menu.isActive ? "default" : "secondary"}
                      className={
                        menu.isActive
                          ? "bg-green-500 hover:bg-green-600/90 text-white"
                          : ""
                      }
                    >
                      {menu.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {menu.order && (
                      <Badge variant="outline" className="text-xs">
                        Order: {menu.order}
                      </Badge>
                    )}
                  </div>
                  {menu.url && (
                    <p className="text-sm text-muted-foreground mt-1">
                      URL: {menu.url}
                    </p>
                  )}
                  {menu.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {menu.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                {/* Toggle active status */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleMenuStatus(menu)}
                >
                  {menu.isActive ? (
                    <IconEyeOff className="h-4 w-4" />
                  ) : (
                    <IconEye className="h-4 w-4" />
                  )}
                </Button>

                {/* Edit button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditAction(menu.id)}
                >
                  <IconEdit className="h-4 w-4" />
                </Button>

                {/* Delete button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteMenu(menu.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Render children if expanded */}
        {hasChildren && (
          <Collapsible open={isExpanded}>
            <CollapsibleContent>
              <div className="ml-8 space-y-2">
                {menu.children?.map((child) =>
                  renderMenuItem(child, level + 1)
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    );
  };

  if (menus.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">
          No menus found. Create your first menu item!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Menu Structure</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const allMenuIds = new Set<string>();
              const collectIds = (items: MenuTreeItem[]) => {
                items.forEach((item) => {
                  if (item.children && item.children.length > 0) {
                    allMenuIds.add(item.id);
                    collectIds(item.children);
                  }
                });
              };
              collectIds(menus);
              setExpandedMenus(allMenuIds);
            }}
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedMenus(new Set())}
          >
            Collapse All
          </Button>
        </div>
      </div>

      {/* Menu items with pagination */}
      <div className="space-y-2">
        {currentMenus.map((menu) => renderMenuItem(menu))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, rootMenus.length)} of{" "}
            {rootMenus.length} menu items
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <IconChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const distance = Math.abs(page - currentPage);
                  return distance <= 2 || page === 1 || page === totalPages;
                })
                .reduce((acc, page, index, array) => {
                  if (index > 0 && page - array[index - 1] > 1) {
                    acc.push(
                      <span
                        key={`ellipsis-${page}`}
                        className="px-2 text-muted-foreground"
                      >
                        ...
                      </span>
                    );
                  }
                  acc.push(
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="w-8 h-8"
                    >
                      {page}
                    </Button>
                  );
                  return acc;
                }, [] as React.ReactNode[])}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <IconChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
