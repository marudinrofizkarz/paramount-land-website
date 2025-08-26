import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Tambahkan header cache untuk aset statis
  if (request.nextUrl.pathname.startsWith("/_next/static")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  // Tambahkan header cache untuk gambar
  if (request.nextUrl.pathname.startsWith("/_next/image")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=86400, stale-while-revalidate=31536000"
    );
  }

  // Tambahkan header cache untuk halaman publik (beranda, proyek, halaman statis)
  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/home" ||
    request.nextUrl.pathname.startsWith("/projects/") ||
    request.nextUrl.pathname.startsWith("/news/") ||
    request.nextUrl.pathname === "/about" ||
    request.nextUrl.pathname === "/contact" ||
    request.nextUrl.pathname === "/sitemap-page"
  ) {
    // Menggunakan stale-while-revalidate untuk mempercepat pemuatan dan tetap mendapatkan konten segar
    response.headers.set(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=3600"
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/_next/static/:path*",
    "/_next/image/:path*",
    "/",
    "/home",
    "/projects/:path*",
    "/news/:path*",
    "/about",
    "/contact",
    "/sitemap-page",
  ],
};
