
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Trash2, Edit, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking, writeBatchNonBlocking } from "@/firebase";
import { collection, query, doc, writeBatch } from "firebase/firestore";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";


const getStatusVariant = (status: Project['status']): "default" | "secondary" | "destructive" => {
    switch (status) {
        case 'Completed': return 'default';
        case 'Ongoing': return 'secondary';
        case 'Upcoming': return 'destructive';
        default: return 'default';
    }
};

export default function ProjectsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  
  const projectsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "projects")) : null),
    [firestore]
  );
  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  const handleDeleteProject = (id: string) => {
      if (!firestore) return;
      deleteDocumentNonBlocking(doc(firestore, "projects", id));
  }

  const handleFeatureToggle = (projectToFeature: Project) => {
    if (!firestore || !projects) return;

    startTransition(() => {
      const batch = writeBatch(firestore);
      
      // Un-feature any currently featured project
      projects.forEach(p => {
        if (p.isFeatured && p.id !== projectToFeature.id) {
          const projectRef = doc(firestore, 'projects', p.id);
          batch.update(projectRef, { isFeatured: false });
        }
      });

      // Toggle the selected project's featured status
      const projectRef = doc(firestore, 'projects', projectToFeature.id);
      batch.update(projectRef, { isFeatured: !projectToFeature.isFeatured });
      
      // Commit the batch
      writeBatchNonBlocking(batch)
        .then(() => {
          toast({
            title: "Success",
            description: `Project featured status has been updated.`
          });
        })
        .catch((error) => {
           toast({
            variant: "destructive",
            title: "Error",
            description: "Could not update the featured project."
          });
          console.error("Error updating featured project:", error);
        });
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your company's projects.</p>
        </div>
        <Button asChild>
          <Link href="/cmi/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
          <CardDescription>
            A list of all projects. Toggle the switch to feature a project on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Floors</TableHead>
                <TableHead>Land Area</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  </TableCell>
                </TableRow>
              ) : (
                projects?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                        checked={!!project.isFeatured}
                        onCheckedChange={() => handleFeatureToggle(project)}
                        disabled={isPending}
                        aria-label="Toggle featured project"
                    />
                  </TableCell>
                  <TableCell>{project.totalFloors}</TableCell>
                  <TableCell>{project.landArea}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/cmi/projects/edit/${project.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteProject(project.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
