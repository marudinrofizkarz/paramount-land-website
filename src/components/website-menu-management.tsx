"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { WebsiteMenuTable } from "./website-menu-table";
import { AddMenuDialog } from "./add-menu-dialog";
import { EditMenuDialog } from "./edit-menu-dialog";
import { ErrorBoundary, MenuErrorFallback } from "./error-boundary";
import { getWebsiteMenus } from "@/lib/website-menu-actions";
import { MenuTreeItem } from "@/types/website-menu";

interface WebsiteMenuManagementProps {
  initialMenus: MenuTreeItem[];
}

export function WebsiteMenuManagement({
  initialMenus = [],
}: WebsiteMenuManagementProps) {
  const [menus, setMenus] = useState<MenuTreeItem[]>(initialMenus);
  const [editMenuId, setEditMenuId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Memoized refresh function
  const refreshMenus = React.useCallback(async () => {
    try {
      const { data = [], success } = await getWebsiteMenus();
      if (success && Array.isArray(data)) {
        setMenus(data);
      } else {
        console.error("Failed to refresh menus: Invalid data format");
      }
    } catch (error) {
      console.error("Error refreshing menus:", error);
    }
  }, []);

  // Handle successful add menu
  const handleAddSuccess = React.useCallback(() => {
    refreshMenus();
  }, [refreshMenus]);

  // Handle edit menu action
  const handleEditAction = React.useCallback((menuId: string) => {
    setEditMenuId(menuId);
    setIsEditDialogOpen(true);
  }, []);

  // Handle edit dialog close
  const handleEditDialogOpenChange = React.useCallback((open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setEditMenuId(null);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Website Menu Management</h1>
          <p className="text-muted-foreground">
            Manage website navigation menus with support for mega menus and nested structure.
          </p>
        </div>
        <AddMenuDialog onSuccess={handleAddSuccess} />
      </div>

      <div className="w-full">
        <ErrorBoundary fallback={MenuErrorFallback}>
          <WebsiteMenuTable initialData={menus} onEditAction={handleEditAction} />
        </ErrorBoundary>
      </div>

      <EditMenuDialog 
        menuId={editMenuId}
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogOpenChange}
        onSuccess={refreshMenus}
      />
    </div>
  );
}
