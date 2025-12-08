
"use client";

import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, useUser } from '@/firebase';
import { collection, query, orderBy, doc, arrayUnion, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { CallRequest, Note } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, MoreHorizontal, CheckCircle, Trash2, X, PlusCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function CallRequestsPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [selectedRequest, setSelectedRequest] = useState<CallRequest | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isNoteSaving, setNoteSaving] = useState(false);
  
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
    setNewNote('');
  };

  const handleSaveNote = async () => {
    if (!firestore || !selectedRequest || !newNote.trim()) return;
    
    setNoteSaving(true);
    
    const requestDoc = doc(firestore, 'call_requests', selectedRequest.id);
    const noteToAdd = {
      text: newNote,
      createdAt: serverTimestamp(),
    };
  
    // Perform the non-blocking update
    updateDocumentNonBlocking(requestDoc, { 
      notes: arrayUnion(noteToAdd) 
    }).then(() => {
        // Optimistically update the UI only after the request is sent
        const optimisticNote: Note = {
          text: newNote,
          createdAt: Timestamp.now(), // Use a client-side timestamp for immediate display
        };
    
        setSelectedRequest(prev => {
          if (!prev) return null;
          const existingNotes = prev.notes || [];
          return { ...prev, notes: [...existingNotes, optimisticNote] };
        });
    
        setNewNote('');
    }).catch((error) => {
        console.error("Error saving note:", error);
    }).finally(() => {
        setNoteSaving(false);
    });
  };
  
  const handleCloseDialog = () => {
    setSelectedRequest(null);
  }

  const getStatusVariant = (status: CallRequest['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'New': return 'destructive';
        case 'Contacted': return 'secondary';
        case 'Closed': return 'default';
        default: return 'outline';
    }
  };

  const sortedNotes = useMemo(() => {
    if (!selectedRequest?.notes) return [];
    return [...selectedRequest.notes].sort((a, b) => {
      const timeA = a.createdAt?.toDate?.()?.getTime() || 0;
      const timeB = b.createdAt?.toDate?.()?.getTime() || 0;
      return timeB - timeA;
    });
  }, [selectedRequest]);

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
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Notes for {selectedRequest?.name}</DialogTitle>
                <DialogDescription>
                  Log of communications for project: {selectedRequest?.projectName}
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="new-note">Add a New Note</Label>
                    <Textarea 
                        id="new-note" 
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Type your new note here..."
                        rows={3}
                    />
                    <div className='flex justify-end'>
                        <Button onClick={handleSaveNote} disabled={isNoteSaving || !newNote.trim()} size="sm">
                            {isNoteSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <PlusCircle className='mr-2 h-4 w-4' />
                            Save Note
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">Note History</h4>
                    <div className='max-h-64 overflow-y-auto space-y-4 pr-2'>
                        {sortedNotes.length > 0 ? (
                            sortedNotes.map((note, index) => (
                                <div key={index} className='p-3 bg-muted/50 rounded-md text-sm'>
                                    <p className='whitespace-pre-wrap'>{note.text}</p>
                                    <p className='text-xs text-muted-foreground mt-2 text-right'>
                                        {note.createdAt?.toDate ? format(note.createdAt.toDate(), "MMM d, yyyy 'at' h:mm a") : 'Just now'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className='p-4 text-center text-muted-foreground bg-muted/50 rounded-md'>
                                No notes yet. Add one above.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <DialogFooter className='sm:justify-end'>
                  <Button variant="secondary" onClick={handleCloseDialog}>
                    <X className="mr-2 h-4 w-4"/>
                    Close
                  </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
