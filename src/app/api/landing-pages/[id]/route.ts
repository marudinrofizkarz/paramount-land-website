import { NextRequest, NextResponse } from "next/server";
import { LandingPageActions } from "@/lib/landing-page-actions";
import { getServerUser } from "@/lib/auth-server";

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/landing-pages/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Get current user
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const result = await LandingPageActions.getById(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    // Add cache control headers to prevent stale data
    const response = NextResponse.json({
      data: result.data,
      success: true,
    });

    // Disable caching for dynamic content
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Error in GET /api/landing-pages/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/landing-pages/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Get current user
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = await params;

    // Get existing landing page to verify it exists
    const existing = await LandingPageActions.getById(id);
    if (!existing.success) {
      return NextResponse.json(
        { error: "Landing page not found" },
        { status: 404 }
      );
    }

    const existingData = existing.data as any;
    // Check ownership - compare with username or email
    if (
      existingData.created_by !== user.username &&
      existingData.created_by !== user.email
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if slug is being changed and if new slug already exists
    if (body.slug && body.slug !== existingData.slug) {
      const slugCheck = await LandingPageActions.getBySlug(body.slug);
      if (slugCheck.success) {
        return NextResponse.json(
          {
            error: "A landing page with this slug already exists",
          },
          { status: 409 }
        );
      }
    }

    // Clean and validate content before saving
    const cleanContent = (content: any[]): any[] => {
      if (!Array.isArray(content)) return [];

      return content.map((component: any) => {
        const cleanedComponent = { ...component };

        // For custom-image components, validate image URLs
        if (component.type === "custom-image" && component.config) {
          const config = { ...component.config };

          // Remove data URLs as they cause serialization issues
          if (config.desktopImage && config.desktopImage.startsWith("data:")) {
            console.warn("Removing data URL from desktopImage before saving");
            config.desktopImage = "";
          }

          if (config.mobileImage && config.mobileImage.startsWith("data:")) {
            console.warn("Removing data URL from mobileImage before saving");
            config.mobileImage = "";
          }

          cleanedComponent.config = config;
        }

        return cleanedComponent;
      });
    };

    // Prepare update data
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.content !== undefined) {
      updateData.content = cleanContent(body.content);
    }
    if (body.meta_title !== undefined) updateData.meta_title = body.meta_title;
    if (body.meta_description !== undefined)
      updateData.meta_description = body.meta_description;
    if (body.og_image !== undefined) updateData.og_image = body.og_image;
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === "published" && !existingData.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }
    if (body.template_type !== undefined)
      updateData.template_type = body.template_type;
    if (body.target_audience !== undefined)
      updateData.target_audience = body.target_audience;
    if (body.campaign_source !== undefined)
      updateData.campaign_source = body.campaign_source;
    if (body.tracking_code !== undefined)
      updateData.tracking_code = body.tracking_code;
    if (body.settings !== undefined) updateData.settings = body.settings;
    if (body.expires_at !== undefined) updateData.expires_at = body.expires_at;

    // Validate that the data can be serialized before saving
    try {
      JSON.stringify(updateData);
    } catch (serializationError) {
      console.error("Serialization error:", serializationError);
      return NextResponse.json(
        {
          error:
            "Data contains invalid content that cannot be saved. Please check uploaded images and try again.",
        },
        { status: 400 }
      );
    }

    const result = await LandingPageActions.update(id, updateData);

    if (!result.success) {
      console.error("Database update failed:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Add cache control headers to ensure no caching of update response
    const response = NextResponse.json({
      success: true,
      message: "Landing page updated successfully",
      timestamp: new Date().toISOString(), // Add timestamp for cache busting
    });

    // Disable caching for update response
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Error in PUT /api/landing-pages/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/landing-pages/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Get current user
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get existing landing page to verify it exists
    const existing = await LandingPageActions.getById(id);
    if (!existing.success) {
      return NextResponse.json(
        { error: "Landing page not found" },
        { status: 404 }
      );
    }

    const existingData = existing.data as any;
    // Check ownership - compare with username or email
    if (
      existingData.created_by !== user.username &&
      existingData.created_by !== user.email
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await LandingPageActions.delete(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Landing page deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/landing-pages/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
