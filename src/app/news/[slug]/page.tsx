import { getNewsBySlug, getPublishedNews } from "@/lib/news-actions";
import { getPublicProjects } from "@/lib/project-actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { ChevronRight, Calendar, Tag, Share2, Facebook, Twitter, Linkedin, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CopyLinkButton } from "@/components/copy-link-button";

interface NewsPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata untuk SEO
export async function generateMetadata({ params }: NewsPageProps) {
  const { slug } = await Promise.resolve(params);
  const newsResponse = await getNewsBySlug(slug);
  const news = newsResponse.success ? newsResponse.data : null;

  if (!news) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${news.title} | Paramount Land`,
    description: news.description,
    openGraph: {
      title: `${news.title} | Paramount Land`,
      description: news.description,
      images: news.featured_image ? [news.featured_image] : [],
      type: 'article',
      publishedTime: news.published_at,
      modifiedTime: news.updated_at,
      section: news.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: news.description,
      images: news.featured_image ? [news.featured_image] : [],
    }
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { slug } = await Promise.resolve(params);
  const newsResponse = await getNewsBySlug(slug);
  const news = newsResponse.success ? newsResponse.data : null;

  // Ambil semua berita untuk navigasi header
  const newsListResponse = await getPublishedNews();
  const allNews = newsListResponse.success ? newsListResponse.data : [];
  
  // Tambahkan ini untuk mengambil data proyek
  const projectsResponse = await getPublicProjects();
  const projects = projectsResponse.success ? projectsResponse.data : [];

  if (!news) {
    notFound();
  }

  // Format tanggal publikasi
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // URL untuk berbagi
  const shareUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://paramount-land.com/news/${slug}`;

  return (
    <div className="flex flex-col min-h-screen">
      <Header projects={projects} />
      <main className="flex-1">
        {/* Hero Section dengan Featured Image */}
        <section className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
          {news.featured_image ? (
            <Image
              src={news.featured_image}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className={`w-full h-full ${news.bg_color} flex items-center justify-center`}>
              {/* <div className="text-8xl opacity-30">{news.icon || '📰'}</div> */}
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-end">
            <div className="container mx-auto px-4 pb-12">
              <Badge className="mb-4">{news.category}</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
                {news.title}
              </h1>
              <div className="flex items-center text-white/80 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(news.published_at || news.created_at)}</span>
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
                href="/#news"
                className="hover:text-primary transition-colors"
              >
                News & Updates
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-foreground truncate max-w-[200px]">{news.title}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-xl text-muted-foreground mb-8">
                  {news.description}
                </div>
                <div dangerouslySetInnerHTML={{ __html: news.content || '' }} />
              </div>

              {/* Share Section */}
              <div className="pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Share2 className="h-5 w-5 mr-2" />
                  Bagikan Artikel
                </h3>
                <div className="flex flex-wrap gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" asChild>
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Share on Facebook"
                          >
                            <Facebook className="h-4 w-4" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share on Facebook</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" asChild>
                          <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(news.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Share on Twitter"
                          >
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share on Twitter</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" asChild>
                          <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Share on LinkedIn"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share on LinkedIn</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* // Di bagian tombol share */}
                  <TooltipProvider>
                    <Tooltip>
                      <CopyLinkButton shareUrl={shareUrl} />
                      <TooltipContent>
                        <p>Copy link</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Kategori</h3>
                  <Badge className="mr-2 mb-2">{news.category}</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Artikel Terkait</h3>
                  <div className="space-y-4">
                    {allNews && allNews.length > 0 ? (
                      allNews
                        .filter(item => item.id !== news.id && item.category === news.category)
                        .slice(0, 3)
                        .map(item => (
                          <div key={item.id} className="group">
                            <Link href={`/news/${item.slug}`} className="block">
                              <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                                {item.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatDate(item.published_at || item.created_at)}
                              </p>
                            </Link>
                            <Separator className="mt-3" />
                          </div>
                        ))
                    ) : (
                      <p className="text-muted-foreground">Tidak ada artikel terkait.</p>
                    )}
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