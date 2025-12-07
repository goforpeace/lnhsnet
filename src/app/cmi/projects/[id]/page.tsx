
"use client";

import { ProjectForm } from "@/components/admin/project-form";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import type { Project } from "@/lib/types";
import { doc } from "firebase/firestore";
import { notFound, useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProjectPage() {
  const firestore = useFirestore();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const projectRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'projects', id) : null),
    [firestore, id]
  );
  const { data: project, isLoading } = useDoc<Project>(projectRef);


  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-1/2" />
        <div className="space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!project && !isLoading) {
    notFound();
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground">Modify the details for "{project?.title}".</p>
      </div>
      {project && <ProjectForm formType="edit" project={project} />}
    </div>
  );
}
