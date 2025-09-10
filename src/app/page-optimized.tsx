import { Suspense } from "react";
import { constructMetadata } from "./metadata";
import { Metadata } from "next";
import { getPublicProjects } from "@/lib/project-actions";
import { getPublishedNews } from "@/lib/news-actions";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProjectSlider } from "@/components/project-slider";
import { NewsSlider } from "@/components/news-slider";
import { SalesInHouseSection } from "@/components/sales-in-house-section";
import { FaqSection } from "@/components/faq-section";
import { ExplicitMetadataTags } from "@/components/explicit-metadata-tags";
import { ServerHeroSlider } from "@/components/server-hero-slider";
import Link from "next/link";
import type { Project as LibProject } from "@/lib/types";
import type { Project as HeaderProject } from "@/types/project";

// ISR - Revalidate setiap 10 menit untuk data yang jarang berubah
export const revalidate = 600;

// Metadata optimized for SEO
export const metadata: Metadata = constructMetadata({
  title: "Paramount Land - Building Homes and People with Heart",
  description:
    "Paramount Land - developer properti premium di Indonesia dengan fokus pada hunian berkualitas dan properti komersial. Temukan rumah idaman dan investasi properti terbaik di lokasi strategis.",
  keywords:
    "properti premium, perumahan, properti komersial, investasi properti, developer properti, rumah dijual, Paramount Land, properti Indonesia, rumah mewah, properti strategis",
  image:
    "https://res.cloudinary.com/dx7xttb8a/image/upload/v1754146325/logo_xhylzg.jpg",
});

// Loading components
function ProjectsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-muted animate-pulse rounded-lg h-64"></div>
      ))}
    </div>
  );
}

function NewsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-muted animate-pulse rounded-lg h-32"></div>
      ))}
    </div>
  );
}

// Conversion function
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
    completion: 0,
    mainImage: project.mainImage,
    galleryImages: project.galleryImages || [],
    brochureUrl: project.brochureUrl,
    youtubeLink: project.youtubeUrl,
    advantages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Server component untuk commercial projects
async function CommercialProjectsSection() {
  try {
    const commercialResponse = await getPublicProjects(undefined, "commercial");
    const commercialProjects = commercialResponse?.success
      ? (commercialResponse.data as LibProject[])
      : [];

    return (
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
    );
  } catch (error) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 text-center">
          <p className="text-muted-foreground">
            Failed to load commercial projects.
          </p>
        </div>
      </section>
    );
  }
}

// Server component untuk residential projects
async function ResidentialProjectsSection() {
  try {
    const residentialResponse = await getPublicProjects(
      undefined,
      "residential"
    );
    const residentialProjects = residentialResponse?.success
      ? (residentialResponse.data as LibProject[])
      : [];

    return (
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
              Residential Projects
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Discover our premium residential developments designed for modern
              living
            </p>
          </div>

          {residentialProjects.length > 0 ? (
            <ProjectSlider projects={residentialProjects} type="residential" />
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
    );
  } catch (error) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 text-center">
          <p className="text-muted-foreground">
            Failed to load residential projects.
          </p>
        </div>
      </section>
    );
  }
}

// Server component untuk news
async function NewsSection() {
  try {
    const newsResponse = await getPublishedNews();
    const newsData =
      newsResponse.success && newsResponse.data
        ? newsResponse.data.map((news: any) => ({
            id: news.id,
            title: news.title,
            description: news.description,
            category: news.category,
            date: news.published_at
              ? new Date(news.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "No date",
            icon: news.icon || "📰",
            bgColor: news.bg_color || "bg-gray-100 dark:bg-gray-800",
            featured_image: news.featured_image,
            slug: news.slug || news.id,
          }))
        : [];

    return <NewsSlider newsData={newsData} />;
  } catch (error) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 text-center">
          <p className="text-muted-foreground">Failed to load news.</p>
        </div>
      </section>
    );
  }
}

// Header data fetch
async function HeaderWithData() {
  try {
    const [residentialResponse, commercialResponse] = await Promise.all([
      getPublicProjects(undefined, "residential"),
      getPublicProjects(undefined, "commercial"),
    ]);

    const residentialData =
      residentialResponse?.success && residentialResponse.data
        ? residentialResponse.data.map((project) =>
            convertToHeaderProject(
              project as unknown as LibProject,
              "residential"
            )
          )
        : [];

    const commercialData =
      commercialResponse?.success && commercialResponse.data
        ? commercialResponse.data.map((project) =>
            convertToHeaderProject(
              project as unknown as LibProject,
              "commercial"
            )
          )
        : [];

    const allProjects = [...residentialData, ...commercialData];

    return <Header projects={allProjects} />;
  } catch (error) {
    return <Header projects={[]} />;
  }
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <ExplicitMetadataTags
        title="Paramount Land - Building Homes and People with Hearts"
        description="Paramount Land - developer properti premium di Indonesia dengan fokus pada hunian berkualitas dan properti komersial."
        image="https://res.cloudinary.com/dwqiuq8cq/image/upload/v1755585343/Rizal_ok36fo.jpg"
        url="https://www.rizalparamountland.com"
      />

      <Suspense fallback={<Header projects={[]} />}>
        <HeaderWithData />
      </Suspense>

      <main className="flex-1">
        {/* Hero Slider - Prioritas tertinggi */}
        <Suspense
          fallback={
            <section className="w-full">
              <div className="relative w-full bg-muted h-[50vh] md:h-[60vh] flex items-center justify-center animate-pulse">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted-foreground/20 rounded-full animate-pulse"></div>
                  <p className="text-muted-foreground">Loading slider...</p>
                </div>
              </div>
            </section>
          }
        >
          <ServerHeroSlider />
        </Suspense>

        {/* Commercial Projects */}
        <Suspense
          fallback={
            <section className="w-full py-12 md:py-24 lg:py-32">
              <div className="container mx-auto px-4 md:px-8 lg:px-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">
                    Commercial Projects
                  </h2>
                </div>
                <ProjectsLoadingSkeleton />
              </div>
            </section>
          }
        >
          <CommercialProjectsSection />
        </Suspense>

        {/* Residential Projects */}
        <Suspense
          fallback={
            <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
              <div className="container mx-auto px-4 md:px-8 lg:px-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">
                    Residential Projects
                  </h2>
                </div>
                <ProjectsLoadingSkeleton />
              </div>
            </section>
          }
        >
          <ResidentialProjectsSection />
        </Suspense>

        {/* Sales In House Section - Static component */}
        <SalesInHouseSection />

        {/* News Section */}
        <Suspense
          fallback={
            <section className="w-full py-12 md:py-24 lg:py-32">
              <div className="container mx-auto px-4 md:px-8 lg:px-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Latest News</h2>
                </div>
                <NewsLoadingSkeleton />
              </div>
            </section>
          }
        >
          <NewsSection />
        </Suspense>

        {/* FAQ Section - Static component */}
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
