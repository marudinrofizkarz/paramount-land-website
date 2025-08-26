"use client";

import Head from "next/head";
import Script from "next/script";

interface ExplicitMetadataTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

/**
 * Component to add explicit meta tags for social media sharing
 * This is a backup in case Next.js metadata is not working properly for social media sharing
 */
export function ExplicitMetadataTags({
  title = "Paramount Land - Developer Properti Premium",
  description = "Paramount Land - developer properti premium di Indonesia dengan fokus pada hunian berkualitas dan properti komersial.",
  image = "https://res.cloudinary.com/dwqiuq8cq/image/upload/v1755585343/Rizal_ok36fo.jpg",
  url = "https://www.rizalparamountland.com",
  type = "website",
}: ExplicitMetadataTagsProps) {
  return (
    <>
      <Head>
        {/* Essential Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Head>

      {/* Add schema.org data as JSON-LD */}
      <Script
        id="schema-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Paramount Land",
            url: "https://www.rizalparamountland.com",
            logo: "https://www.rizalparamountland.com/images/paramount-logo-dark.png",
            image: image,
            description: description,
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+6281387118533",
              email: "rijal.sutanto@paramount-land.com",
              contactType: "customer service",
            },
          }),
        }}
      />
    </>
  );
}
