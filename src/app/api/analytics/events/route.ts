import { NextRequest, NextResponse } from "next/server";

// Simple event tracking for WhatsApp clicks and other CTAs
export async function POST(request: NextRequest) {
  try {
    const { eventType, trackingId, utmParams, timestamp } =
      await request.json();

    // Log event (you can enhance this to store in database)
    console.log(`Event tracked: ${eventType}`, {
      trackingId,
      utmParams,
      timestamp,
      userAgent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
    });

    // Here you could store to database for detailed analytics
    // await storeEvent({ eventType, trackingId, utmParams, timestamp });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Event tracking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track event" },
      { status: 500 }
    );
  }
}
