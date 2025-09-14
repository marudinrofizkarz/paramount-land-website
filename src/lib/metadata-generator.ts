import { LandingPageComponent } from "@/lib/landing-page-actions";

// Generate OG Image URL berdasarkan content landing page
export function generateOGImageUrl(
  slug: string,
  title: string,
  components: LandingPageComponent[]
): string {
  // Cari hero component untuk mendapatkan background image
  const heroComponent = components.find((comp) => comp.type === "hero");
  let backgroundImage = "";

  if (heroComponent?.config?.backgroundImage) {
    backgroundImage = encodeURIComponent(heroComponent.config.backgroundImage);
  }

  // Fallback ke default Paramount Land image
  if (!backgroundImage) {
    backgroundImage = encodeURIComponent(
      "https://res.cloudinary.com/paramount-land/image/upload/v1/og-images/default-og-image.jpg"
    );
  }

  // Generate title untuk OG image
  const ogTitle = encodeURIComponent(title);

  // Generate URL menggunakan Cloudinary atau service lain untuk dynamic OG image
  return `https://res.cloudinary.com/paramount-land/image/upload/w_1200,h_630,c_fill,q_auto,f_auto/l_text:arial_48_bold:${ogTitle},co_white,g_south_west,x_50,y_100/l_text:arial_24:Paramount Land - Building Homes and People with Heart,co_rgb:f0f0f0,g_south_west,x_50,y_50/${backgroundImage}`;
}

// Generate metadata untuk social sharing yang optimal
export function generateSocialMetadata(slug: string, landingPageData: any) {
  const title =
    landingPageData.meta_title ||
    landingPageData.title ||
    `${slug
      .split("-")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")}`;

  const description =
    landingPageData.meta_description ||
    landingPageData.description ||
    "Discover premium residential properties by Paramount Land - Building Homes and People with Heart";

  // Generate OG image dari content
  const ogImage =
    landingPageData.og_image ||
    generateOGImageUrl(slug, title, landingPageData.content || []);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://paramountland.co.id";
  const canonicalUrl = `${baseUrl}/lp/${slug}`;

  return {
    title: title.includes("Paramount Land")
      ? title
      : `${title} | Paramount Land`,
    description,
    keywords: `paramount land, ${slug.replace(
      "-",
      " "
    )}, residential property, premium homes, real estate indonesia`,
    openGraph: {
      title: title.includes("Paramount Land")
        ? title
        : `${title} | Paramount Land`,
      description,
      type: "website" as const,
      url: canonicalUrl,
      siteName: "Paramount Land",
      locale: "id_ID",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: title.includes("Paramount Land")
        ? title
        : `${title} | Paramount Land`,
      description,
      images: [ogImage],
      creator: "@ParamountLand",
      site: "@ParamountLand",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      // WhatsApp specific
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:type": "image/jpeg",
      // Facebook specific
      "fb:app_id": process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
      // Additional SEO
      "theme-color": "#1e40af",
      "msapplication-TileColor": "#1e40af",
    },
  };
}

// Generate structured data untuk SEO yang lebih baik
export function generateStructuredData(slug: string, landingPageData: any) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://paramountland.co.id";

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: landingPageData.title,
    description: landingPageData.description,
    url: `${baseUrl}/lp/${slug}`,
    provider: {
      "@type": "Organization",
      name: "Paramount Land",
      url: baseUrl,
      logo: `${baseUrl}/images/paramount-land-logo.png`,
      sameAs: [
        "https://www.facebook.com/ParamountLand",
        "https://www.instagram.com/paramountland",
        "https://www.youtube.com/channel/ParamountLand",
        "https://www.linkedin.com/company/paramount-land",
      ],
    },
    mainEntity: {
      "@type": "RealEstateAgent",
      name: "Paramount Land",
      address: {
        "@type": "PostalAddress",
        addressCountry: "ID",
        addressLocality: "Jakarta",
      },
      telephone: "+62-21-xxx-xxxx",
    },
  };
}
