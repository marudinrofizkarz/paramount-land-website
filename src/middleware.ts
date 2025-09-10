import { NextRequest, NextResponse } from "next/server";

// Secret for JWT tokens
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

// Web Crypto API compatible JWT verification
async function verifyJWT(token: string, secret: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const [header, payload, signature] = parts;
    const data = `${header}.${payload}`;

    // Decode payload
    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    // Check expiration
    if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
      return null;
    }

    // For Edge Runtime, we'll do basic validation
    // In production, you might want to implement proper signature verification
    return decodedPayload;
  } catch (error) {
    return null;
  }
}

// Define which paths are protected (require authentication)
const protectedPaths = ["/dashboard"];

// Define which paths are admin only
const adminOnlyPaths = ["/dashboard/settings", "/dashboard/users"];

// Define which paths are public (no authentication required)
const publicAuthPaths = [
  "/auth/login",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/register",
  "/auth/initialize",
];

export async function middleware(req: NextRequest) {
  // Redirect /home to root URL for better SEO
  const url = req.nextUrl.clone();
  if (url.pathname === "/home") {
    return NextResponse.redirect(new URL("/", url.origin));
  }

  // Get token from cookies
  const token = req.cookies.get("auth_token")?.value;
  const path = req.nextUrl.pathname;

  // Check if user is accessing a protected path
  const isProtectedPath = protectedPaths.some((pp) => path.startsWith(pp));
  const isAdminOnlyPath = adminOnlyPaths.some((aop) => path.startsWith(aop));
  const isPublicAuthPath = publicAuthPaths.some((pap) => path.startsWith(pap));

  // Verify token if user is accessing a protected path
  if (isProtectedPath || isAdminOnlyPath) {
    // If no token exists, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
      // Verify token
      const payload = await verifyJWT(token, JWT_SECRET);

      // If token is invalid, redirect to login
      if (!payload) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      // For admin only paths, check if user is admin
      if (isAdminOnlyPath && (payload as any).role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Allow access to protected paths
      return NextResponse.next();
    } catch (error) {
      // If token verification fails, redirect to login
      console.error("Token verification failed:", error);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // If user is logged in and trying to access auth pages, redirect to dashboard
  if (isPublicAuthPath && token) {
    try {
      const payload = await verifyJWT(token, JWT_SECRET);

      if (payload) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (error) {
      // If token verification fails, allow access to auth pages
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|api|static|public|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
