import { NextRequest, NextResponse } from "next/server";
import { LandingPageAnalytics } from "@/lib/landing-page-actions";

export async function POST(request: NextRequest) {
  try {
    const { landingPageId, eventType } = await request.json();

    if (!landingPageId || !eventType) {
      return NextResponse.json(
        { success: false, error: "Missing landingPageId or eventType" },
        { status: 400 }
      );
    }

    let result;
    if (eventType === "visit") {
      result = await LandingPageAnalytics.trackVisit(landingPageId);
    } else if (eventType === "conversion") {
      result = await LandingPageAnalytics.trackConversion(landingPageId);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid eventType. Use 'visit' or 'conversion'",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const landingPageId = searchParams.get("landingPageId");
    const timeRange = searchParams.get("timeRange") || "30d";

    if (!landingPageId) {
      return NextResponse.json(
        { success: false, error: "Missing landingPageId" },
        { status: 400 }
      );
    }

    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "all":
        startDate = new Date("2020-01-01"); // Far back date
        break;
    }

    const result = await LandingPageAnalytics.getAnalytics(
      landingPageId,
      timeRange === "all" ? undefined : startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
