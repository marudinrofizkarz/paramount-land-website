import { NextResponse } from "next/server";
import { getUnitsByProjectId } from "@/lib/unit-actions";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // Get project ID from slug first
    const projectResult = await fetch(`/api/projects/${slug}`);
    const projectData = await projectResult.json();

    if (!projectData.success) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const projectId = projectData.project.id;
    const result = await getUnitsByProjectId(projectId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        units: result.units,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch units" },
      { status: 500 }
    );
  }
}
