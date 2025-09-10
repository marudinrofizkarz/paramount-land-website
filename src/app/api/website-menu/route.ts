import { getPublicWebsiteMenus } from "@/lib/website-menu-actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getPublicWebsiteMenus();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching website menus:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch website menus" },
      { status: 500 }
    );
  }
}