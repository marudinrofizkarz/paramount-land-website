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

  return response;
}

export const config = {
  matcher: ["/_next/static/:path*", "/_next/image/:path*"],
};
