import { NextRequest, NextResponse } from "next/server";
import { LandingPageActions } from "@/lib/landing-page-actions";
import { getServerUser } from "@/lib/auth-server";

// GET /api/landing-pages
export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const campaign_source = searchParams.get("campaign_source") || undefined;
    const search = searchParams.get("search") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 10;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : 0;

    const filters = {
      status,
      campaign_source,
      search,
      limit,
      offset,
      created_by: user.username || user.email, // Use username or email instead of ID
    };

    // Get total count for pagination
    const countResult = await LandingPageActions.getCount(filters);
    const totalItems = countResult.success ? countResult.count : 0;

    // Get paginated data
    const result = await LandingPageActions.getAll(filters);

    console.log("LandingPageActions.getAll result:", result);

    if (!result.success) {
      console.error("LandingPageActions.getAll failed:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return NextResponse.json({
      data: result.data,
      pagination: {
        total: totalItems,
        page: currentPage,
        limit,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error in GET /api/landing-pages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/landing-pages
export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const {
      title,
      slug,
      content,
      status = "draft",
      template_type = "custom",
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        {
          error: "Missing required fields: title, slug, content",
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPage = await LandingPageActions.getBySlug(slug);
    if (existingPage.success) {
      return NextResponse.json(
        {
          error: "A landing page with this slug already exists",
        },
        { status: 409 }
      );
    }

    const landingPageData = {
      title,
      slug,
      description: body.description,
      content,
      meta_title: body.meta_title,
      meta_description: body.meta_description,
      og_image: body.og_image,
      status,
      template_type,
      target_audience: body.target_audience,
      campaign_source: body.campaign_source,
      tracking_code: body.tracking_code,
      settings: body.settings || {},
      published_at:
        status === "published" ? new Date().toISOString() : undefined,
      expires_at: body.expires_at,
      created_by: user.username || user.email, // Use username or email as fallback
    };

    const result = await LandingPageActions.create(landingPageData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(
      {
        id: result.id,
        success: true,
        message: "Landing page created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/landing-pages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
