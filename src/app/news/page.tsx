import { getPublishedNews } from "@/lib/news-actions";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export const metadata = {
  title: "News & Updates | Paramount Land",
  description: "Stay informed with the latest news, updates, and insights from our developments",
};

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const newsResponse = await getPublishedNews(currentPage);
  const allNews = newsResponse.success ? newsResponse.data : [];
  const pagination = newsResponse.success ? newsResponse.pagination : { total: 0, page: 1, limit: 9, totalPages: 1 };

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted/30 py-12 md:py-24">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Updates</h1>
              <p className="text-xl text-muted-foreground">
                Stay informed with the latest news, updates, and insights from our developments
              </p>
            </div>
          </div>
        </section>

        {/* News List */}
        <section className="py-12 md:py-16">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {allNews.map((news) => (
                <Link 
                  key={news.id} 
                  href={`/news/${news.slug}`}
                  className="group block bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="aspect-video relative overflow-hidden">
                    {news.featured_image ? (
                      <Image
                        src={news.featured_image}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className={`w-full h-full ${news.bg_color} flex items-center justify-center`}>
                        <div className="text-6xl opacity-30">{news.icon || '📰'}</div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Badge variant="secondary">{news.category}</Badge>
                      <span>•</span>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(news.published_at || news.created_at)}</span>
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {news.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-3">
                      {news.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {allNews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No news available at the moment.</p>
              </div>
            )}
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination className="mt-12">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href={currentPage > 1 ? `/news?page=${currentPage - 1}` : '#'}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === pagination.totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink 
                            href={`/news?page=${pageNumber}`}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      (pageNumber === 2 && currentPage > 3) ||
                      (pageNumber === pagination.totalPages - 1 && currentPage < pagination.totalPages - 2)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href={currentPage < pagination.totalPages ? `/news?page=${currentPage + 1}` : '#'}
                      className={currentPage >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}