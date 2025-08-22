"use client";

import * as React from "react";
import { ChevronDown, MoreHorizontal, Loader2 } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MenuTreeItem } from "@/types/website-menu";
import { useSweetAlert } from "@/hooks/use-sweet-alert";
import { toast } from "sonner";
import {
  deleteWebsiteMenu,
  updateWebsiteMenu,
  getWebsiteMenus,
} from "@/lib/website-menu-actions";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Card, CardContent } from "@/components/ui/card";

interface WebsiteMenuTableProps {
  initialData: MenuTreeItem[];
  onEditAction: (menuId: string) => void;
}

export function WebsiteMenuTable({
  initialData,
  onEditAction,
}: WebsiteMenuTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<MenuTreeItem[]>(initialData);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { showSuccess, showError, showConfirmation } = useSweetAlert();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Update data when initialData changes
  React.useEffect(() => {
    setData(initialData);
    setError(null);
  }, [initialData]);

  // Set default column visibility based on screen size
  React.useEffect(() => {
    if (isMobile) {
      setColumnVisibility({
        select: false,
        parentTitle: false,
        url: false,
        order: false,
      });
    } else {
      setColumnVisibility({});
    }
  }, [isMobile]);

  // Check for selected rows to show bulk actions
  const selectedRowsCount = Object.keys(rowSelection).length;
  const showBulkActions = selectedRowsCount > 0;

  // Flatten menu tree for table display
  const flattenMenus = (menus: MenuTreeItem[], parentTitle = ""): any[] => {
    return menus.reduce((acc: any[], menu) => {
      const flatMenu = {
        ...menu,
        parentTitle,
        hasChildren: menu.children.length > 0,
      };
      return [...acc, flatMenu, ...flattenMenus(menu.children, menu.title)];
    }, []);
  };

  const refreshData = async () => {
    try {
      const { data = [], success } = await getWebsiteMenus();
      if (success) {
        setData(data);
        setError(null);
      } else {
        setError("Failed to refresh menu data");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      setError("An error occurred while refreshing data");
    }
  };

  const toggleMenuStatus = async (menu: MenuTreeItem) => {
    if (isLoading) return; // Prevent multiple clicks
    
    try {
      setIsLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append("title", menu.title);
      formData.append("url", menu.url || "");
      formData.append("order", menu.order.toString());
      formData.append("isActive", (!menu.isActive).toString());
      formData.append("parentId", "");
      formData.append("isMegaMenu", menu.isMegaMenu.toString());
      formData.append("iconClass", menu.iconClass || "");
      formData.append("description", menu.description || "");

      const result = await updateWebsiteMenu(menu.id, formData);
      if (result.success) {
        await refreshData();
        toast.success(`Menu ${!menu.isActive ? "activated" : "deactivated"}`);
      } else {
        const errorMessage = result.message || "Failed to update menu";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error toggling menu status:", error);
      const errorMessage = "An unexpected error occurred while updating menu";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMenu = async (menuId: string) => {
    if (isLoading) return; // Prevent multiple clicks
    
    try {
      const confirmation = await showConfirmation(
        "Delete Menu Item",
        "Are you sure you want to delete this menu item? This action cannot be undone and will also delete all child menu items.",
        "Yes, delete it!"
      );

      if (confirmation.isConfirmed) {
        setIsLoading(true);
        setError(null);
        
        const result = await deleteWebsiteMenu(menuId);
        if (result.success) {
          await refreshData();
          showSuccess("Menu item deleted successfully");
        } else {
          const errorMessage = result.message || "Failed to delete menu";
          setError(errorMessage);
          showError(errorMessage);
        }
      }
    } catch (error) {
      console.error("Error deleting menu:", error);
      const errorMessage = "An unexpected error occurred while deleting menu";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (isLoading) return; // Prevent multiple clicks
    
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toast.error("No items selected for deletion");
      return;
    }

    try {
      const confirmation = await showConfirmation(
        `Delete ${selectedRows.length} Menu Items`,
        `Are you sure you want to delete ${selectedRows.length} menu items? This action cannot be undone and will also delete all child menu items.`,
        "Yes, delete them!"
      );

      if (confirmation.isConfirmed) {
        setIsLoading(true);
        setError(null);

        // Get array of IDs to delete
        const idsToDelete = selectedRows.map((row) => row.original.id);

        // Sequential deletion for better error handling
        let hasErrors = false;
        let deletedCount = 0;
        
        for (const id of idsToDelete) {
          try {
            const result = await deleteWebsiteMenu(id);
            if (result.success) {
              deletedCount++;
            } else {
              hasErrors = true;
              console.error(`Failed to delete menu with ID: ${id}`, result.message);
            }
          } catch (error) {
            hasErrors = true;
            console.error(`Error deleting menu with ID: ${id}`, error);
          }
        }

        // Refresh data
        await refreshData();
        
        // Clear selections
        setRowSelection({});

        if (hasErrors) {
          const errorMessage = `${deletedCount} of ${idsToDelete.length} items deleted. Some items could not be deleted.`;
          setError(errorMessage);
          showError(errorMessage);
        } else {
          showSuccess(`${deletedCount} menu items deleted successfully`);
        }
      }
    } catch (error) {
      console.error("Error bulk deleting menus:", error);
      const errorMessage = "An unexpected error occurred during bulk deletion";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Menu Title
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const indent = row.original.parentTitle ? "pl-6" : "";
        return (
          <div className={indent}>
            {row.original.title}
            {row.original.hasChildren && (
              <Badge variant="outline" className="ml-2">
                Has Children
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "parentTitle",
      header: "Parent Menu",
      cell: ({ row }) => row.original.parentTitle || "-",
    },
    {
      accessorKey: "url",
      header: "URL",
      cell: ({ row }) => row.getValue("url") || "-",
    },
    {
      accessorKey: "order",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Order
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <div className="flex items-center gap-2">
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={isActive ? "bg-green-500 hover:bg-green-600/90" : ""}
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
            {row.original.isMegaMenu && (
              <Badge variant="secondary" className="text-xs">
                Mega Menu
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const menu = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEditAction(menu.id)}>
                Edit Menu
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleMenuStatus(menu)}>
                {menu.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteMenu(menu.id)}
              >
                Delete Menu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: flattenMenus(data),
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
        {showBulkActions ? (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Actions ({table.getFilteredSelectedRowModel().rows.length})
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => table.toggleAllRowsSelected(true)}
                >
                  Select All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => table.toggleAllRowsSelected(false)}
                >
                  Deselect All
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={handleBulkDelete}
                >
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.toggleAllRowsSelected(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="relative w-full sm:w-auto">
            <Input
              placeholder="Search menus..."
              value={
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="pl-8 w-full sm:w-[250px]"
            />
            <span className="absolute left-2.5 top-2.5 text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </span>
          </div>
        )}

        {!isMobile && !showBulkActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                View
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {isLoading && (
        <div className="w-full flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
      )}

      {!isLoading && (
        <>
          {isMobile ? (
            // Mobile view - Card list instead of table
            <div className="grid gap-4">
              {flattenMenus(data).map((menu) => (
                <Card key={menu.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start gap-2">
                          <Checkbox
                            checked={table
                              .getRowModel()
                              .rows.find((row) => row.original.id === menu.id)
                              ?.getIsSelected()}
                            onCheckedChange={(value) => {
                              table
                                .getRowModel()
                                .rows.find((row) => row.original.id === menu.id)
                                ?.toggleSelected(!!value);
                            }}
                            aria-label="Select row"
                            className="mt-1"
                          />
                          <div>
                            <h3 className="font-medium">{menu.title}</h3>
                            {menu.parentTitle && (
                              <p className="text-xs text-muted-foreground">
                                Parent: {menu.parentTitle}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={menu.isActive ? "default" : "secondary"}
                          className={
                            menu.isActive
                              ? "bg-green-500 hover:bg-green-600/90"
                              : ""
                          }
                        >
                          {menu.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="flex justify-end gap-2 mt-3 border-t pt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditAction(menu.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant={menu.isActive ? "destructive" : "default"}
                          onClick={() => toggleMenuStatus(menu)}
                        >
                          {menu.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {flattenMenus(data).length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                  No menus found.
                </div>
              )}
            </div>
          ) : (
            // Desktop view - Full table
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No menus found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
      {!isLoading && (
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 py-4">
          <div className="text-muted-foreground text-sm">
            {isMobile ? (
              <>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </>
            ) : (
              <>
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            {!isMobile && (
              <span className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
