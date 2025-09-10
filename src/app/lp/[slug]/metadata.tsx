import { Metadata } from "next";

interface LandingPageProps {
  params: {
    slug: string;
  };
}

async function getLandingPageData(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9003";
    const response = await fetch(`${baseUrl}/api/landing-pages/slug/${slug}`, {
      cache: "no-store", // Ensure we always get fresh data
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching landing page metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: LandingPageProps): Promise<Metadata> {
  const landingPage = await getLandingPageData(params.slug);

  if (!landingPage || landingPage.status !== "published") {
    return {
      title: "Page Not Found",
      description: "The requested landing page could not be found.",
    };
  }

  const baseTitle = landingPage.meta_title || landingPage.title;
  const title = baseTitle.includes("Paramount Land")
    ? baseTitle
    : `${baseTitle} | Paramount Land - Building Homes and People with Heart`;
  const description =
    landingPage.meta_description || landingPage.description || "";
  const ogImage = landingPage.og_image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/lp/${landingPage.slug}`,
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `/lp/${landingPage.slug}`,
    },
  };
}
