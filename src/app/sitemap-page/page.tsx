import { getPublicProjects } from "@/lib/project-actions";
import { getPublishedNews } from "@/lib/news-actions";
import Link from "next/link";
import { constructMetadata } from "../metadata";
import type { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Sitemap | Paramount Land - Developer Properti Premium",
  description:
    "Temukan semua halaman di website Paramount Land untuk navigasi yang lebih mudah. Jelajahi proyek properti premium, artikel berita, dan informasi kontak.",
  keywords:
    "sitemap Paramount Land, peta situs, navigasi website properti, daftar halaman Paramount Land",
  noIndex: true, // We don't want search engines to index the HTML sitemap
});

export default async function SitemapPage() {
  // Fetch public projects
  const projectsResponse = await getPublicProjects();
  const projects = projectsResponse.success ? projectsResponse.data : [];

  // Fetch published news
  const newsResponse = await getPublishedNews();
  const news = newsResponse.success ? newsResponse.data : [];

  // Group projects by type
  const residentialProjects = projects.filter(
    (p: any) => p.status === "residential"
  );
  const commercialProjects = projects.filter(
    (p: any) => p.status === "commercial"
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Sitemap</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Main Pages */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">
            Halaman Utama
          </h2>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-primary hover:underline">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/#projects" className="text-primary hover:underline">
                Proyek Properti
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-primary hover:underline">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-primary hover:underline">
                Hubungi Kami
              </Link>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4 mt-8 pb-2 border-b">
            Informasi
          </h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/privacy-policy"
                className="text-primary hover:underline"
              >
                Kebijakan Privasi
              </Link>
            </li>
            <li>
              <Link
                href="/terms-of-service"
                className="text-primary hover:underline"
              >
                Syarat dan Ketentuan
              </Link>
            </li>
          </ul>
        </div>

        {/* Projects */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">
            Proyek Residensial
          </h2>
          <ul className="space-y-2">
            {residentialProjects.length > 0 ? (
              residentialProjects.map((project: any) => (
                <li key={project.id}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-primary hover:underline"
                  >
                    {project.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">
                Tidak ada proyek residensial saat ini
              </li>
            )}
          </ul>

          <h2 className="text-2xl font-semibold mb-4 mt-8 pb-2 border-b">
            Proyek Komersial
          </h2>
          <ul className="space-y-2">
            {commercialProjects.length > 0 ? (
              commercialProjects.map((project: any) => (
                <li key={project.id}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-primary hover:underline"
                  >
                    {project.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">
                Tidak ada proyek komersial saat ini
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* News */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">
          Berita & Updates
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {news && news.length > 0 ? (
            news.map((item: any) => (
              <div key={item.id}>
                <Link
                  href={`/news/${item.slug}`}
                  className="text-primary hover:underline"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {item.published_at
                    ? new Date(item.published_at).toLocaleDateString("id-ID")
                    : "Tanggal tidak tersedia"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">Tidak ada berita saat ini</p>
          )}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Juga tersedia dalam format{" "}
          <a href="/sitemap.xml" className="text-primary hover:underline">
            XML Sitemap
          </a>{" "}
          untuk mesin pencari.
        </p>
      </div>
    </div>
  );
}
