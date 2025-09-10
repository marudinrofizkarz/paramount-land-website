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

interface RouteParams {
  params: {
    id: string;
  };
}

// POST /api/landing-pages/[id]/publish
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Re-enable authentication when Clerk is properly configured
    // const user = await verifyAuth(request);
    // if (!user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Get existing landing page to verify it exists
    const existing = await LandingPageActions.getById(params.id);
    if (!existing.success) {
      return NextResponse.json(
        { error: "Landing page not found" },
        { status: 404 }
      );
    }

    // TODO: Re-enable ownership check when auth is working
    // const existingData = existing.data as any;
    // if (existingData.created_by !== user.id) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const result = await LandingPageActions.publish(params.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Landing page published successfully",
    });
  } catch (error) {
    console.error("Error in POST /api/landing-pages/[id]/publish:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
