"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
  columnCount: number;
  rowCount?: number;
  searchableColumnCount?: number;
  filterableColumnCount?: number;
  cellWidths?: string[];
  withPagination?: boolean;
  shrinkZero?: boolean;
}

export function DataTableSkeleton({
  columnCount,
  rowCount = 10,
  searchableColumnCount = 1,
  filterableColumnCount = 0,
  cellWidths = ["auto"],
  withPagination = true,
  shrinkZero = false,
}: DataTableSkeletonProps) {
  return (
    <div className="w-full space-y-3 overflow-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between space-x-2 overflow-auto p-1">
        <div className="flex flex-1 items-center space-x-2">
          {searchableColumnCount > 0 &&
            Array.from({ length: searchableColumnCount }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-40 lg:w-60" />
            ))}
          {filterableColumnCount > 0 &&
            Array.from({ length: filterableColumnCount }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 border-dashed" />
            ))}
        </div>
        <Skeleton className="ml-auto h-7 w-16" />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableHead
                  key={i}
                  style={{
                    width: cellWidths[i],
                    minWidth: shrinkZero ? cellWidths[i] : "auto",
                  }}
                >
                  <Skeleton className="h-6 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {withPagination && (
        <div className="flex items-center justify-between px-2">
          <Skeleton className="h-4 w-40" />
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="hidden h-7 w-7 lg:block" />
              <Skeleton className="h-7 w-7" />
              <Skeleton className="h-7 w-7" />
              <Skeleton className="hidden h-7 w-7 lg:block" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
