
"use client";

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, useUser } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import type { CallRequest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, MoreHorizontal, CheckCircle, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function CallRequestsPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const callRequestsQuery = useMemoFirebase(
    () => firestore && user ? query(collection(firestore, 'call_requests'), orderBy('submissionDate', 'desc')) : null,
    [firestore, user]
  );
  const { data: callRequests, isLoading } = useCollection<CallRequest>(callRequestsQuery);

  const updateStatus = (id: string, status: CallRequest['status']) => {
    if (!firestore) return;
    const requestDoc = doc(firestore, 'call_requests', id);
    updateDocumentNonBlocking(requestDoc, { status });
  };

  const getStatusVariant = (status: CallRequest['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'New': return 'destructive';
        case 'Contacted': return 'secondary';
        case 'Closed': return 'default';
        default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Call Back Requests</h1>
        <p className="text-muted-foreground">Follow up with potential clients who requested a call.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incoming Requests</CardTitle>
          <CardDescription>A list of all call back requests received.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
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
              ) : callRequests && callRequests.length > 0 ? (
                callRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.name}</TableCell>
                    <TableCell>{req.phone}</TableCell>
                    <TableCell>
                      <Button variant="link" asChild className='p-0 h-auto'>
                        <Link href={`/projects/${req.projectId}`}>{req.projectName}</Link>
                      </Button>
                    </TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(req.status)}>{req.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {req.submissionDate ? formatDistanceToNow(req.submissionDate.toDate(), { addSuffix: true }) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {req.status === 'New' && (
                             <DropdownMenuItem onClick={() => updateStatus(req.id, 'Contacted')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Contacted
                            </DropdownMenuItem>
                          )}
                          {req.status === 'Contacted' && (
                            <DropdownMenuItem onClick={() => updateStatus(req.id, 'Closed')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Closed
                            </DropdownMenuItem>
                          )}
                           <DropdownMenuSeparator />
                           <DropdownMenuItem onClick={() => updateStatus(req.id, 'Closed')} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No call requests yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
