
"use client";

import { useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { Project } from '@/lib/types';
import { ProjectForm } from '@/components/admin/project-form';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firestore || !params.id) {
        setIsLoading(false);
        return;
    };

    const fetchProject = async () => {
      try {
        const projectRef = doc(firestore, 'projects', params.id);
        const docSnap = await getDoc(projectRef);

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          setError('Project not found.');
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError('Failed to load project.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [firestore, params.id]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    notFound();
  }
  
  if (!project) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground">Update the details for "{project.title}".</p>
      </div>
      <ProjectForm formType="edit" project={project} />
    </div>
  );
}
