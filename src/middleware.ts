import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
// Clerk akan menangani autentikasi dan proteksi rute
// Pengaturan untuk membatasi user harus dilakukan di dashboard Clerk dengan:
// 1. Menonaktifkan sign-up
// 2. Menonaktifkan social logins (Google, dll)
// 3. Menggunakan Allow List untuk email yang diizinkan

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Semua rute dashboard memerlukan autentikasi
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
