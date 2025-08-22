import { ProjectForm } from "@/components/project-form-new";

export default function NewProjectPage() {
  return (
    <div className="w-full h-auto p-4 md:p-6 lg:p-8">
      <div className="max-w-none w-full">
        <ProjectForm />
      </div>
    </div>
  );
}
