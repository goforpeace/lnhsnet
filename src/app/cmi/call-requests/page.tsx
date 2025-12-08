
"use client";

import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, useUser } from '@/firebase';
import { collection, query, orderBy, doc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore';
import type { CallRequest, Note } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, MoreHorizontal, CheckCircle, Trash2, X, PlusCircle, Edit } from 'lucide-react';
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
  const [editingNote, setEditingNote] = useState<{ note: Note; text: string } | null>(null);
  
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
    setEditingNote(null);
  };

  const handleSaveNote = async () => {
    if (!firestore || !selectedRequest || !newNote.trim()) return;
  
    setNoteSaving(true);
  
    const requestDoc = doc(firestore, 'call_requests', selectedRequest.id);
    const noteToAdd = {
      text: newNote,
      createdAt: Timestamp.now(), 
    };
  
    updateDocumentNonBlocking(requestDoc, { 
      notes: arrayUnion(noteToAdd) 
    }).then(() => {
      setSelectedRequest(prev => {
        if (!prev) return null;
        const existingNotes = prev.notes || [];
        return { ...prev, notes: [...existingNotes, noteToAdd] };
      });
      setNewNote('');
    }).catch(error => {
      console.error("Error saving note:", error);
    }).finally(() => {
      setNoteSaving(false);
    });
  };

  const handleUpdateNote = async () => {
    if (!firestore || !selectedRequest || !editingNote) return;

    const originalNote = editingNote.note;
    const updatedText = editingNote.text;

    if (originalNote.text === updatedText) {
        setEditingNote(null);
        return;
    }

    const requestDoc = doc(firestore, 'call_requests', selectedRequest.id);

    // To "update" an item in a Firestore array, we remove the old one and add the new one.
    const updatedNote = { ...originalNote, text: updatedText };
    
    // First, optimistically update the local state for immediate feedback
    setSelectedRequest(prev => {
      if (!prev || !prev.notes) return prev;
      return {
        ...prev,
        notes: prev.notes.map(note => note.createdAt.isEqual(originalNote.createdAt) ? updatedNote : note)
      };
    });
    setEditingNote(null);


    // Then, perform the non-blocking database update
    try {
        await updateDocumentNonBlocking(requestDoc, {
            notes: arrayRemove(originalNote)
        });
        await updateDocumentNonBlocking(requestDoc, {
            notes: arrayUnion(updatedNote)
        });
    } catch (error) {
        console.error("Error updating note:", error);
        // If the update fails, revert the local state
        setSelectedRequest(prev => {
          if (!prev || !prev.notes) return prev;
          return {
            ...prev,
            notes: prev.notes.map(note => note.createdAt.isEqual(updatedNote.createdAt) ? originalNote : note)
          };
        });
    }
  };
  
  const handleCloseDialog = () => {
    setSelectedRequest(null);
    setEditingNote(null);
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
                <div>
                    <Label htmlFor="new-note" className="font-semibold">Add a New Note</Label>
                    <Textarea 
                        id="new-note" 
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a new note..."
                        rows={3}
                        className="mt-2"
                    />
                    <Button onClick={handleSaveNote} disabled={isNoteSaving || !newNote.trim()} size="sm" className="mt-2">
                        {isNoteSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className='mr-2 h-4 w-4' />}
                        Add Note
                    </Button>
                </div>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-4">
                    <h4 className="font-semibold text-md">Note History</h4>
                    <div className='space-y-4'>
                        {sortedNotes.length > 0 ? (
                            sortedNotes.map((note, index) => (
                                <div key={index} className='p-4 bg-muted/50 rounded-lg text-sm border group relative'>
                                    {editingNote?.note.createdAt.isEqual(note.createdAt) ? (
                                        <div className='space-y-2'>
                                            <Textarea
                                                value={editingNote.text}
                                                onChange={(e) => setEditingNote({...editingNote, text: e.target.value})}
                                                rows={3}
                                            />
                                            <div className='flex justify-end gap-2'>
                                                <Button variant="ghost" size="sm" onClick={() => setEditingNote(null)}>Cancel</Button>
                                                <Button size="sm" onClick={handleUpdateNote}>Save</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className='whitespace-pre-wrap'>{note.text}</p>
                                            <p className='text-xs text-muted-foreground mt-2 text-right'>
                                                {note.createdAt?.toDate ? format(note.createdAt.toDate(), "MMM d, yyyy 'at' h:mm a") : 'Saving...'}
                                            </p>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className='absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity'
                                                onClick={() => setEditingNote({note, text: note.text})}>
                                                <Edit className='h-4 w-4'/>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className='p-8 text-center text-muted-foreground bg-muted/50 rounded-lg border'>
                                No notes yet. Add one to start the conversation log.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <DialogFooter className='sm:justify-end border-t pt-4'>
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

    