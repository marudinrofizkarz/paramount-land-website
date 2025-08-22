import { Metadata } from "next";
import ProjectEditForm from "@/components/project-edit-form";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edit Project | Paramount Land",
  description: "Edit your property project details",
};

// Add dynamic flag to prevent automatic data fetching
export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  // Ensure params is awaited by destructuring it in a new const
  const { id } = await Promise.resolve(params);

  return (
    <div className="space-y-6">
      <div className="container">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="p-8 text-center">Loading project data...</div>
        }
      >
        <ProjectEditForm projectId={id} />
      </Suspense>
    </div>
  );
}
