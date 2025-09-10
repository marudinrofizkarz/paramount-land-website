import { NextRequest, NextResponse } from "next/server";
import { ComponentTemplateActions } from "@/lib/landing-page-actions";
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

// GET /api/landing-pages/components
export async function GET(request: NextRequest) {
  try {
    // TODO: Re-enable authentication when Clerk is properly configured
    // const user = await verifyAuth(request);
    // if (!user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || undefined;

    const result = await ComponentTemplateActions.getAll(type);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      data: result.data,
      success: true,
    });
  } catch (error) {
    console.error("Error in GET /api/landing-pages/components:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/landing-pages/components
export async function POST(request: NextRequest) {
  try {
    // TODO: Re-enable authentication when Clerk is properly configured
    // const user = await verifyAuth(request);
    // if (!user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await request.json();

    // Validate required fields
    const { name, type, config } = body;

    if (!name || !type || !config) {
      return NextResponse.json(
        {
          error: "Missing required fields: name, type, config",
        },
        { status: 400 }
      );
    }

    const componentData = {
      name,
      type,
      config,
      preview_image: body.preview_image,
      is_system: false,
      created_by: "system", // user.id,
    };

    const result = await ComponentTemplateActions.create(componentData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(
      {
        id: (result as any).id,
        success: true,
        message: "Component template created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/landing-pages/components:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
