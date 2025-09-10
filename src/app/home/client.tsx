"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSliderSection } from "@/components/hero-slider-section";
import { ProjectSlider } from "@/components/project-slider";
import { NewsSlider } from "@/components/news-slider";
import { SalesInHouseSection } from "@/components/sales-in-house-section";
import { FaqSection } from "@/components/faq-section";
import { useEffect, useState } from "react";
import type { Project as LibProject } from "@/lib/types";
import type { Project as HeaderProject } from "@/types/project";
import { ExplicitMetadataTags } from "@/components/explicit-metadata-tags";

// API response NewsItem
interface NewsItemResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  published_at: string;
  icon?: string;
  bg_color?: string;
  featured_image?: string;
  slug: string;
}

// NewsSlider expects this format
interface NewsDisplayItem {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  icon: string;
  bgColor: string;
  featured_image?: string;
  slug: string;
}

// Conversion function to transform LibProject to HeaderProject
const convertToHeaderProject = (
  project: LibProject,
  projectType: "residential" | "commercial"
): HeaderProject => {
  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    location: project.location,
    description: project.description,
    status: projectType,
    units: project.units?.length || 0,
    startingPrice: project.startingPrice,
    maxPrice: undefined,
    completion: 0, // Default value, should be properly set if available
    mainImage: project.mainImage,
    galleryImages: project.galleryImages || [],
    brochureUrl: project.brochureUrl,
    youtubeLink: project.youtubeUrl,
    advantages: [], // Default value, should be properly set if available
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export default function HomeClient({
  initialResidentialProjects,
  initialCommercialProjects,
  initialNews,
}: {
  initialResidentialProjects: any;
  initialCommercialProjects: any;
  initialNews: any;
}) {
  const [residentialProjects, setResidentialProjects] = useState<LibProject[]>(
    []
  );
  const [commercialProjects, setCommercialProjects] = useState<LibProject[]>(
    []
  );
  const [newsData, setNewsData] = useState<NewsDisplayItem[]>([]);
  const [allProjects, setAllProjects] = useState<HeaderProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);

      // Process residential projects data from props
      if (
        initialResidentialProjects &&
        initialResidentialProjects.success &&
        initialResidentialProjects.data
      ) {
        const residentialProjectsData =
          initialResidentialProjects.data as LibProject[];
        setResidentialProjects(residentialProjectsData);
      }

      // Process commercial projects data from props
      if (
        initialCommercialProjects &&
        initialCommercialProjects.success &&
        initialCommercialProjects.data
      ) {
        const commercialProjectsData =
          initialCommercialProjects.data as LibProject[];
        setCommercialProjects(commercialProjectsData);
      }

      // Combine all projects for header
      const allProjectsData = [];

      if (
        initialResidentialProjects &&
        initialResidentialProjects.success &&
        initialResidentialProjects.data
      ) {
        const residentialData = initialResidentialProjects.data.map(
          (project: LibProject) =>
            convertToHeaderProject(project, "residential")
        );
        allProjectsData.push(...residentialData);
      }

      if (
        initialCommercialProjects &&
        initialCommercialProjects.success &&
        initialCommercialProjects.data
      ) {
        const commercialData = initialCommercialProjects.data.map(
          (project: LibProject) => convertToHeaderProject(project, "commercial")
        );
        allProjectsData.push(...commercialData);
      }

      setAllProjects(allProjectsData);

      // Process news data from props
      if (initialNews && initialNews.success && initialNews.data) {
        const newsItems = initialNews.data.map((item: NewsItemResponse) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          date: item.published_at
            ? new Date(item.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "No date",
          icon: item.icon || "📰",
          bgColor: item.bg_color || "bg-gray-100 dark:bg-gray-800",
          featured_image: item.featured_image,
          slug: item.slug || item.id,
        }));
        setNewsData(newsItems);
      }

      setError(null);
    } catch (err) {
      console.error("Error processing initial data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [initialResidentialProjects, initialCommercialProjects, initialNews]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header projects={[]} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {/* Spinner modern dengan efek pulse */}
            <div className="relative mx-auto mb-4 w-16 h-16">
              <div
                className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75"
                style={{ animationDuration: "1.5s" }}
              ></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary/80 border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              </div>
            </div>

            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header projects={[]} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ExplicitMetadataTags
        title="Paramount Land - Building Homes and People with Hearts"
        description="Paramount Land - developer properti premium di Indonesia dengan fokus pada hunian berkualitas dan properti komersial."
        image="https://res.cloudinary.com/dwqiuq8cq/image/upload/v1755585343/Rizal_ok36fo.jpg"
        url="https://www.rizalparamountland.com"
      />
      <Header projects={allProjects} />
      <main className="flex-1">
        <HeroSliderSection />

        {/* Commercial Projects Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Commercial Projects
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Explore our innovative commercial developments for business
                excellence
              </p>
            </div>

            {commercialProjects.length > 0 ? (
              <ProjectSlider projects={commercialProjects} type="commercial" />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No commercial projects available at the moment.
                </p>
                <p className="text-sm text-muted-foreground">
                  <Link
                    href="/dashboard"
                    className="text-primary hover:underline"
                  >
                    Go to dashboard to add a project
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Residential Projects Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Residential Projects
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Discover our premium residential developments designed for
                modern living
              </p>
            </div>

            {residentialProjects.length > 0 ? (
              <ProjectSlider
                projects={residentialProjects}
                type="residential"
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No residential projects available at the moment.
                </p>
                <p className="text-sm text-muted-foreground">
                  <Link
                    href="/dashboard"
                    className="text-primary hover:underline"
                  >
                    Go to dashboard to add a project
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Sales In House Section */}
        <SalesInHouseSection />

        {/* Use NewsSlider Component with real data */}
        <NewsSlider newsData={newsData} />

        {/* FAQ Section for SEO */}
        <FaqSection
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about Paramount Land projects and services"
          faqs={[
            {
              question: "What type of properties does Paramount Land develop?",
              answer:
                "Paramount Land develops premium residential and commercial properties in strategic locations across Indonesia. Our portfolio includes residential estates, apartments, office buildings, and integrated mixed-use developments designed to meet modern living and business needs.",
            },
            {
              question:
                "How do I schedule a site visit to a Paramount Land project?",
              answer:
                "You can schedule a site visit by contacting our sales team directly through the 'Schedule a Consultation' form on our website, or by calling our sales representatives at +6281387118533. We offer both physical site visits and virtual tours for your convenience.",
            },
            {
              question:
                "What payment options are available for Paramount Land properties?",
              answer:
                "Paramount Land offers flexible payment options including installment plans, bank financing through our partner banks, and developer financing for qualified buyers. Contact our sales team for detailed information about payment schemes for specific projects.",
            },
            {
              question: "Does Paramount Land offer investment properties?",
              answer:
                "Yes, many of our properties are excellent investment opportunities with strong potential for capital appreciation and rental yields. Our commercial projects in particular are designed with investors in mind, offering strategic locations and modern facilities.",
            },
            {
              question:
                "What amenities are typically included in Paramount Land residential projects?",
              answer:
                "Our residential projects typically include amenities such as landscaped gardens, swimming pools, fitness centers, children's play areas, 24/7 security, and smart home features. Specific amenities vary by project, so please check individual project pages for details.",
            },
            {
              question:
                "How can I stay updated about new Paramount Land projects and promotions?",
              answer:
                "You can subscribe to our newsletter through our website, follow us on social media platforms (@paramountland), or contact our sales team to be added to our mailing list for updates on new launches, special promotions, and exclusive events.",
            },
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}
