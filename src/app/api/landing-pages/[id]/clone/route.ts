import { NextRequest, NextResponse } from "next/server";
import { LandingPageActions } from "@/lib/landing-page-actions";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Utility function to verify JWT token and get user
async function verifyAuth(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// POST /api/landing-pages/[id]/clone
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    // TODO: Re-enable authentication when Clerk is properly configured
    // const user = await verifyAuth(request);
    // if (!user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await request.json();
    const { title, slug } = body;

    if (!title || !slug) {
      return NextResponse.json(
        {
          error: "Missing required fields: title, slug",
        },
        { status: 400 }
      );
    }

    // Get existing landing page to verify it exists
    const existing = await LandingPageActions.getById(id);
    if (!existing.success) {
      return NextResponse.json(
        { error: "Landing page not found" },
        { status: 404 }
      );
    }

    const existingData = existing.data as any;
    // TODO: Re-enable ownership check when auth is working
    // if (existingData.created_by !== user.id) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    // Check if slug already exists
    const slugCheck = await LandingPageActions.getBySlug(slug);
    if (slugCheck.success) {
      return NextResponse.json(
        {
          error: "A landing page with this slug already exists",
        },
        { status: 409 }
      );
    }

    const result = await LandingPageActions.clone(id, title, slug);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Get the full cloned landing page data to return slug
    const clonedData = await LandingPageActions.getById((result as any).id);

    return NextResponse.json(
      {
        id: (result as any).id,
        slug: clonedData.success ? (clonedData.data as any).slug : slug,
        success: true,
        message: "Landing page cloned successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/landing-pages/[id]/clone:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
