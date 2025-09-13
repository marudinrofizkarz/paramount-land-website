import { NextResponse } from "next/server";
import { getUnitBySlug } from "@/lib/unit-actions";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string; unitSlug: string }> }
) {
  try {
    const { slug, unitSlug } = await context.params;
    const result = await getUnitBySlug(slug, unitSlug);

    if (result.success) {
      return NextResponse.json({
        success: true,
        unit: result.unit,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch unit" },
      { status: 500 }
    );
  }
}
