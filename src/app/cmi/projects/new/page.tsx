import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Add New Project</h1>
        <p className="text-muted-foreground">Fill out the form below to create a new project.</p>
      </div>
      <ProjectForm formType="create" />
    </div>
  );
}
