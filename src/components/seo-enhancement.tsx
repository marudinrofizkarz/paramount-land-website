"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";
import { getBaseUrl } from "@/lib/utils/url";

interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string;
}

export function Seo({
  title = "Paramount Land - Building Homes and People with Heart",
  description = "Paramount Land - developer properti premium di Indonesia dengan fokus pada hunian berkualitas dan properti komersial.",
  canonical,
  ogImage = "https://res.cloudinary.com/dx7xttb8a/image/upload/v1755585343/Rizal_ok36fo.jpg",
  noIndex = false,
  keywords = "properti premium, developer properti, Paramount Land, rumah mewah, investasi properti",
}: SeoProps) {
  const pathname = usePathname();
  const baseUrl = getBaseUrl();
  const canonicalUrl = canonical || `${baseUrl}${pathname}`;

  return (
    <Head>
      {/* Additional SEO tags not covered by Next.js Metadata API */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta name="author" content="Paramount Land" />

      {/* Additional social media tags */}
      <meta property="og:site_name" content="Paramount Land" />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:site" content="@paramountland" />
      <meta property="twitter:domain" content="rizalparamountland.com" />

      {/* Facebook specific */}
      <meta property="fb:app_id" content="your-facebook-app-id" />

      {/* Structured data for local business - Can be adjusted as needed */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Paramount Land",
            image: ogImage,
            url: baseUrl,
            telephone: "+6281387118533",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Paramount Skyline, Gading Serpong",
              addressLocality: "Tangerang",
              postalCode: "15310",
              addressCountry: "ID",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: -6.2405,
              longitude: 106.6184,
            },
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ],
              opens: "09:00",
              closes: "17:00",
            },
          }),
        }}
      />
    </Head>
  );
}
