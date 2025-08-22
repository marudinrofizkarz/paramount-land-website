import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

// Map of path segments to more user-friendly names
const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  projects: "Projects",
  new: "New Project",
  product: "Products",
  profile: "Profile",
  kanban: "Kanban Board",
  overview: "Overview",
  // Add more mappings as needed
};

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Add home as the first breadcrumb
    const result: BreadcrumbItem[] = [
      {
        label: "Home",
        href: "/",
        isCurrent: pathname === "/",
      },
    ];

    if (pathname === "/") {
      return result;
    }

    const segments = pathname.split("/").filter(Boolean);

    segments.forEach((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const isCurrent = index === segments.length - 1;

      // Use the mapping if available, otherwise format the segment
      const label =
        labelMap[segment] ||
        segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      result.push({
        label,
        href,
        isCurrent,
      });
    });

    return result;
  }, [pathname]);

  return breadcrumbs;
}
