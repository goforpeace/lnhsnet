import { ProjectForm } from "@/components/admin/project-form";
import { projects } from "@/lib/data";
import { notFound } from "next/navigation";

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground">Modify the details for "{project.title}".</p>
      </div>
      <ProjectForm formType="edit" project={project} />
    </div>
  );
}
