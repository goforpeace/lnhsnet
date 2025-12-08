
"use client";

import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, useUser } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import type { CallRequest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, MoreHorizontal, CheckCircle, Trash2, StickyNote, Edit, X } from 'lucide-react';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function CallRequestsPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [selectedRequest, setSelectedRequest] = useState<CallRequest | null>(null);
  const [notes, setNotes] = useState('');
  const [isNoteSaving, setNoteSaving] = useState(false);
  const [isEditingNote, setEditingNote] = useState(false);

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

  const handleRowClick = (req: CallRequest) => {
    setSelectedRequest(req);
    setNotes(req.notes || '');
    setEditingNote(false); // Always start in view mode
  };

  const handleSaveNote = async () => {
    if (!firestore || !selectedRequest) return;
    setNoteSaving(true);
    const requestDoc = doc(firestore, 'call_requests', selectedRequest.id);
    await updateDocumentNonBlocking(requestDoc, { notes });
    setNoteSaving(false);
    setEditingNote(false); // Go back to view mode
    // We don't close the dialog, just update the state
    setSelectedRequest(prev => prev ? { ...prev, notes } : null);
  };
  
  const handleCloseDialog = () => {
    setSelectedRequest(null);
    setEditingNote(false);
  }

  const getStatusVariant = (status: CallRequest['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'New': return 'destructive';
        case 'Contacted': return 'secondary';
        case 'Closed': return 'default';
        default: return 'outline';
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Call Back Requests</h1>
          <p className="text-muted-foreground">Follow up with potential clients who requested a call.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Incoming Requests</CardTitle>
            <CardDescription>A list of all call back requests received. Click a row to view or add notes.</CardDescription>
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
                    <TableRow key={req.id} onClick={() => handleRowClick(req)} className="cursor-pointer">
                      <TableCell className="font-medium">{req.name}</TableCell>
                      <TableCell>{req.phone}</TableCell>
                      <TableCell>
                        <Button variant="link" asChild className='p-0 h-auto' onClick={(e) => e.stopPropagation()}>
                          <Link href={`/project/${req.projectId}`}>{req.projectName}</Link>
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
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}><MoreHorizontal className="h-4 w-4" /></Button>
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

       <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Notes for {selectedRequest?.name}</DialogTitle>
                <DialogDescription>
                  For the project: {selectedRequest?.projectName}
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {isEditingNote ? (
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Edit Notes</Label>
                    <Textarea 
                        id="notes" 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add your notes here..."
                        rows={6}
                        autoFocus
                    />
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-semibold">Current Note:</h4>
                  <div className='p-4 bg-muted/50 rounded-md min-h-[100px] text-sm text-muted-foreground whitespace-pre-wrap'>
                    {selectedRequest?.notes || "No notes yet. Click 'Edit Note' to add one."}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className='sm:justify-between'>
              {isEditingNote ? (
                <>
                  <Button variant="ghost" onClick={() => setEditingNote(false)}>Cancel</Button>
                  <Button onClick={handleSaveNote} disabled={isNoteSaving}>
                    {isNoteSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Note
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setEditingNote(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {selectedRequest?.notes ? 'Edit Note' : 'Add Note'}
                  </Button>
                  <Button variant="secondary" onClick={handleCloseDialog}>
                    <X className="mr-2 h-4 w-4"/>
                    Close
                  </Button>
                </>
              )}
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
