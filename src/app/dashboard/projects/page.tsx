import { Metadata } from "next";
import { ProjectsTable } from "@/features/projects/components/projects-table-db";

export const metadata: Metadata = {
  title: "Projects | Paramount Land",
  description: "Manage your property projects",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <p className="text-muted-foreground">
          Manage your property development projects
        </p>
      </div>
      <ProjectsTable />
    </div>
  );
}
