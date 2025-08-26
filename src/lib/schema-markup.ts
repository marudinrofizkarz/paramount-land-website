import { Project } from "@/types/project";
import { getBaseUrl } from "@/lib/utils/url";

/**
 * Generate structured data schema markup for real estate properties
 * This helps search engines understand your content better
 */
export function generateProjectSchema(project: Project, url?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.name,
    description: project.description,
    url: url || `${getBaseUrl()}/projects/${project.slug}`,
    image: project.mainImage,
    address: {
      "@type": "PostalAddress",
      addressLocality: project.location,
      addressRegion: "Jawa Barat",
      addressCountry: "ID",
    },
    offers: {
      "@type": "Offer",
      price: project.startingPrice,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
    },
    datePosted: project.createdAt,
    amenities: project.advantages ? project.advantages.join(", ") : "",
  };
}

/**
 * Generate structured data schema markup for organization
 * This helps establish brand identity in search results
 */
export function generateOrganizationSchema(baseUrl?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Paramount Land",
    url: baseUrl || getBaseUrl(),
    logo: "https://www.rizalparamountland.com/images/paramount-logo-dark.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+6281234567890",
      contactType: "customer service",
    },
    sameAs: [
      "https://www.facebook.com/rizalparamountland",
      "https://www.instagram.com/rizalparamountland",
      "https://www.linkedin.com/company/rizal-paramount-land",
    ],
    description:
      "Paramount Land - Building Homes and People with Heart. Premium property developer in Indonesia focused on creating meaningful living spaces and communities.",
  };
}

/**
 * Generate structured data schema markup for FAQs
 * Great for increasing visibility in Google's rich results
 */
export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate structured data schema markup for breadcrumbs
 * Improves navigation display in search results
 */
export function generateBreadcrumbSchema(
  breadcrumbs: { name: string; item: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.item,
    })),
  };
}

/**
 * Generate structured data schema markup for property units
 * This helps search engines display rich results for property listings
 */
export function generateUnitSchema(
  unit: any,
  projectName: string,
  projectUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${unit.name} - ${projectName}`,
    description: unit.description,
    image: unit.mainImage || "",
    url: unit.url,
    brand: {
      "@type": "Brand",
      name: "Paramount Land",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: unit.price,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "27",
    },
    category: unit.type,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Bedrooms",
        value: unit.bedrooms,
      },
      {
        "@type": "PropertyValue",
        name: "Bathrooms",
        value: unit.bathrooms,
      },
      {
        "@type": "PropertyValue",
        name: "Land Area",
        value: `${unit.landArea} m²`,
      },
      {
        "@type": "PropertyValue",
        name: "Building Area",
        value: `${unit.buildingArea} m²`,
      },
    ],
    isRelatedTo: {
      "@type": "RealEstateListing",
      name: projectName,
      url: projectUrl,
    },
  };
}
