"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface SchemaScriptProps {
  schema: any;
}

export function SchemaScript({ schema }: SchemaScriptProps) {
  return (
    <Script
      id="schema-script"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

import { getBaseUrl } from "@/lib/utils/url";

export function OrganizationSchemaScript() {
  const baseUrl = getBaseUrl();
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Paramount Land",
    url: baseUrl,
    logo: "https://www.rizalparamountland.com/images/paramount-logo-dark.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+6281387118533",
      contactType: "customer service",
    },
    sameAs: [
      "https://www.facebook.com/rizalparamountland",
      "https://www.instagram.com/rizalparamountland",
    ],
    description:
      "Paramount Land - Building Homes and People with Heart. Premium property developer in Indonesia focused on creating meaningful living spaces and communities.",
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      strategy="afterInteractive"
    />
  );
}
