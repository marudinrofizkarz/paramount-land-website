import type { Metadata } from "next";

const defaultImage =
  "https://res.cloudinary.com/dx7xttb8a/image/upload/v1755585343/Rizal_ok36fo.jpg";

export const siteConfig = {
  name: "Paramount Land",
  description: "Building Homes and People with Heart",
  url: "https://www.rizalparamountland.com",
  ogImage: defaultImage,
};

export function constructMetadata({
  title = "Paramount Land - Building Homes and People with Heart",
  description = "Paramount Land - developer properti premium di Indonesia dengan fokus pada hunian berkualitas dan properti komersial.",
  image = defaultImage, // Use the new default image
  icons = "/favicon.ico",
  noIndex = false,
  keywords = "properti premium, developer properti, Paramount Land, rumah mewah, investasi properti, perumahan Jakarta, properti Tangerang, Serpong, rumah dijual, apartemen Jakarta, hunian mewah, property investment",
  canonical = "https://www.rizalparamountland.com",
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  keywords?: string;
  canonical?: string;
} = {}): Metadata {
  return {
    title,
    description,
    keywords,
    applicationName: "Paramount Land",
    referrer: "origin-when-cross-origin",
    authors: [
      { name: "Paramount Land", url: "https://www.rizalparamountland.com" },
    ],
    creator: "Paramount Land",
    publisher: "Paramount Land",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    category: "real estate",
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      siteName: siteConfig.name,
      locale: "id_ID",
      url: canonical,
      countryName: "Indonesia",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@paramountland",
      site: "@paramountland",
    },
    icons,
    metadataBase: new URL("https://www.rizalparamountland.com"),
    alternates: {
      canonical: canonical,
      languages: {
        "id-ID": "https://www.rizalparamountland.com",
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
      nocache: noIndex,
    },
    verification: {
      google: "iilDtlHRAusuqtSUfbBo3GEax7WaGEWCJgb74QkcwbU", // Search Console verification code
      other: {
        "facebook-domain-verification": ["your-facebook-verification-code"], // Add your actual code
        "yandex-verification": ["your-yandex-verification-code"], // Optional, add if needed
      },
    },
    appleWebApp: {
      capable: true,
      title: "Paramount Land",
      statusBarStyle: "black-translucent",
    },
  };
}
