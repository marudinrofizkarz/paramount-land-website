import { getProjectBySlug, getPublicProjects } from "@/lib/project-actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ImageGallery } from "@/components/image-gallery";
import {
  Building2,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  FileText,
  Home,
  ChevronRight,
  Camera,
  Youtube,
  Users2,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { UnitList } from "@/components/unit-list";
import { ContactInquiryModal } from "@/components/contact-inquiry-modal";
import { SalesAvatar } from "@/components/sales-avatar";
import { ContactButtons } from "@/components/contact-buttons";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProjectPageProps) {
  // Ensure params is awaited by destructuring it in a new const
  const { slug } = await Promise.resolve(params);
  const projectResponse = await getProjectBySlug(slug);
  const project = projectResponse.success ? projectResponse.data : null;

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} | Paramount Land`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // Ensure params is awaited by destructuring it in a new const
  const { slug } = await Promise.resolve(params);
  const projectResponse = await getProjectBySlug(slug);
  const project = projectResponse.success ? projectResponse.data : null;

  const projectsResponse = await getPublicProjects();
  const allProjects = projectsResponse.success ? projectsResponse.data : [];

  if (!project) {
    notFound();
  }

  // Format currency
  const formatCurrency = (value: string) => {
    if (!value) return "";
    const number = parseInt(value);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Format price range
  const priceRange = () => {
    const start = formatCurrency(project.startingPrice);
    if (project.maxPrice) {
      return `${start} - ${formatCurrency(project.maxPrice)}`;
    }
    return `From ${start}`;
  };

  // Get YouTube video ID
  const getYouTubeId = (url: string) => {
    if (!url) return null;

    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYouTubeId(project.youtubeLink);

  return (
    <div className="flex flex-col min-h-screen">
      <Header projects={allProjects} />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] bg-muted">
          {project.mainImage ? (
            <Image
              src={project.mainImage}
              alt={project.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted">
              <Building2 className="h-24 w-24 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex items-end">
            <div className="container px-4 sm:px-6 py-8 md:py-12">
              <div className="max-w-3xl">
                <Badge className="mb-4 text-sm px-3 py-1">
                  {project.status.charAt(0).toUpperCase() +
                    project.status.slice(1)}
                </Badge>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                  {project.name}
                </h1>
                <p className="flex items-center text-white/90 mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  {project.location}
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-md">
                    <p className="text-xs text-white/70">Starting Price</p>
                    <p className="text-white font-semibold">
                      {formatCurrency(project.startingPrice)}
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-md">
                    <p className="text-xs text-white/70">Units Available</p>
                    <p className="text-white font-semibold">{project.units}</p>
                  </div>
                  {/* Completion card removed as requested */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="bg-muted/50 border-b">
          <div className="container px-4 sm:px-6 py-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link
                href="/#projects"
                className="hover:text-primary transition-colors"
              >
                Projects
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-foreground">{project.name}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container px-4 sm:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="overview" className="w-full">
                <div className="overflow-x-auto pb-2">
                  <TabsList className="w-full min-w-[300px] mb-4">
                    <TabsTrigger value="overview" className="flex-1">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="gallery" className="flex-1">
                      Gallery
                    </TabsTrigger>
                    {youtubeId && (
                      <TabsTrigger value="video" className="flex-1">
                        Video
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      Project Overview
                    </h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {project.description}
                    </p>
                  </div>

                  {project.advantages && project.advantages.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">Key Advantages</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.advantages.map(
                          (advantage: string, i: number) => (
                            <div key={i} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <p>{advantage}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="gallery">
                  <h2 className="text-2xl font-bold mb-4">Project Gallery</h2>
                  <ImageGallery
                    images={project.galleryImages || []}
                    alt={project.name}
                  />
                </TabsContent>

                {youtubeId && (
                  <TabsContent value="video">
                    <h2 className="text-2xl font-bold mb-4">Project Video</h2>
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title={`${project.name} Video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      ></iframe>
                    </div>
                  </TabsContent>
                )}
              </Tabs>

              {/* Unit Types Section - Moved outside of tabs */}
              <div className="mt-12 pt-8 border-t">
                <UnitList
                  projectId={project.id}
                  projectSlug={project.slug}
                  projectLocation={project.location}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sales Contact Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Users2 className="h-5 w-5 mr-2 text-primary" />
                    Info Sales
                  </h3>

                  <div className="flex items-center space-x-4">
                    <SalesAvatar
                      imagePath="https://res.cloudinary.com/dwqiuq8cq/image/upload/v1755585343/Rizal_ok36fo.jpg"
                      fallbackPath="/sales-avatar-fallback.jpg"
                      alt="Sales Representative"
                    />
                    <div>
                      <h4 className="font-semibold">Rijal Sutanto</h4>
                      <p className="text-sm text-muted-foreground">
                        Sales In House Paramount
                      </p>
                    </div>
                  </div>

                  <ContactButtons
                    phoneNumber="081387118533"
                    whatsappNumber="6281387118533"
                    whatsappMessage={`Halo, saya tertarik dengan project ${project.name}. Boleh saya tahu informasi lebih lanjut?`}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      Pricing Information
                    </h3>
                    <p className="text-lg font-semibold">{priceRange()}</p>
                    <p className="text-sm text-muted-foreground">
                      Price may vary depending on unit type and location
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Home className="h-5 w-5 mr-2 text-primary" />
                      Project Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium">
                          {project.status.charAt(0).toUpperCase() +
                            project.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Units
                        </span>
                        <span className="font-medium">{project.units}</span>
                      </div>
                      {/* Completion information removed as requested */}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    {project.brochureUrl && (
                      <Button className="w-full" variant="outline" asChild>
                        <a
                          href={project.brochureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Download Brochure
                        </a>
                      </Button>
                    )}

                    <ContactInquiryModal
                      projectId={project.id}
                      projectName={project.name}
                      projectSlug={project.slug}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Location
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {project.location}
                  </p>

                  {/* Google Map integration - using standard Google Maps URL embed */}
                  <div className="relative aspect-[4/3] bg-muted rounded-md overflow-hidden">
                    <iframe
                      title={`${project.name} location map`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        project.location
                      )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
