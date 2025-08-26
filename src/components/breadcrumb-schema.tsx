"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { getBaseUrl } from "@/lib/utils/url";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchemaScript({ items }: { items: BreadcrumbItem[] }) {
  const baseUrl = getBaseUrl();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      strategy="afterInteractive"
    />
  );
}
