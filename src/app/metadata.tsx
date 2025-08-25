import type { Metadata } from "next";

const defaultImage =
  "https://res.cloudinary.com/dx7xttb8a/image/upload/v1754146325/logo_xhylzg.jpg";

export const siteConfig = {
  name: "Paramount Land",
  description: "Building Homes and People with Heart",
  url: "", // Will be determined by the hostname in deployment
  ogImage: defaultImage,
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = {
    icon: defaultImage,
    shortcut: defaultImage,
    apple: defaultImage,
  },
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: Record<string, string>;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@paramountland",
    },
    icons,
    metadataBase: new URL("https://paramount-land.com"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
