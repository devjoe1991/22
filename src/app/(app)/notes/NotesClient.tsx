'use client';

import { useState, useTransition, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { createNote, deleteNote, toggleGlobalPin, assignNoteToUser, unassignNoteFromUser } from '@/app/actions/notes-actions';
import { toast } from 'sonner';
import { Pin, PinOff, Trash2, UserPlus } from 'lucide-react';

// Define types based on expected data shape
type Note = {
    id: string;
    content: string;
    is_pinned_globally: boolean;
    created_at: string;
    note_assignments: { user_id: string }[];
};
type User = {
    id: string;
    username: string | null;
};
type NotesClientProps = {
    notes: Note[];
    users: User[];
    currentUserId: string;
};

function CreateNoteForm() {
    const formRef = useRef<HTMLFormElement>(null);
    return (
        <form 
            ref={formRef}
            action={async (formData) => {
                await createNote(formData);
                formRef.current?.reset();
            }} 
            className="space-y-4"
        >
            <Textarea name="content" placeholder="Write a new note..." required className="min-h-[100px]" />
            <Button type="submit">Create Note</Button>
        </form>
    )
}

function AssignUserModal({ note, users, onAssign, onUnassign, isPending }: { note: Note, users: User[], onAssign: (userId: string) => void, onUnassign: (userId: string) => void, isPending: boolean }) {
    const assignedUserIds = new Set(note.note_assignments.map(a => a.user_id));
    return (
         <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm"><UserPlus className="h-4 w-4 mr-2" /> Assign</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Note to User</DialogTitle>
                </DialogHeader>
                <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandList className="max-h-[300px]">
                        <CommandEmpty>No users found.</CommandEmpty>
                        <CommandGroup>
                            {users.map(user => {
                                const isAssigned = assignedUserIds.has(user.id);
                                return (
                                    <CommandItem key={user.id} onSelect={() => isAssigned ? onUnassign(user.id) : onAssign(user.id)}>
                                        <span className={`mr-2 h-2 w-2 rounded-full ${isAssigned ? 'bg-green-500' : 'bg-transparent border'}`}></span>
                                        {user.username}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    )
}

export function NotesClient({ notes, users, currentUserId }: NotesClientProps) {
    const [isPending, startTransition] = useTransition();

    const handleAction = (action: () => Promise<any>) => {
        startTransition(async () => {
            const result = await action();
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Action completed successfully!");
            }
        });
    };
    
    const pinnedNotes = notes.filter(n => n.is_pinned_globally);

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader><CardTitle>Create a New Note</CardTitle></CardHeader>
                    <CardContent>
                        <CreateNoteForm />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2 space-y-8">
                {pinnedNotes.length > 0 && (
                     <section>
                        <h2 className="text-2xl font-semibold mb-4">Your Pinned Notes</h2>
                        <div className="space-y-4">
                            {pinnedNotes.map(note => <NoteCard key={note.id} note={note} users={users} handleAction={handleAction} isPending={isPending} />)}
                        </div>
                    </section>
                )}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">All Notes</h2>
                    <div className="space-y-4">
                        {notes.map(note => <NoteCard key={note.id} note={note} users={users} handleAction={handleAction} isPending={isPending} />)}
                    </div>
                </section>
            </div>
        </div>
    );
}

function NoteCard({ note, users, handleAction, isPending }: { note: Note, users: User[], handleAction: (action: () => Promise<any>) => void, isPending: boolean}) {
    return (
        <Card>
            <CardContent className="p-4">
                <p className="mb-4">{note.content}</p>
                <div className="flex items-center justify-end gap-2 border-t pt-3">
                    <Button variant="ghost" size="sm" onClick={() => handleAction(() => toggleGlobalPin(note.id, note.is_pinned_globally))}>
                        {note.is_pinned_globally ? <PinOff className="h-4 w-4 mr-2 text-red-500" /> : <Pin className="h-4 w-4 mr-2" />}
                        {note.is_pinned_globally ? 'Unpin' : 'Pin'}
                    </Button>
                    <AssignUserModal 
                        note={note} 
                        users={users} 
                        onAssign={(userId) => handleAction(() => assignNoteToUser(note.id, userId))}
                        onUnassign={(userId) => handleAction(() => unassignNoteFromUser(note.id, userId))}
                        isPending={isPending}
                    />
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleAction(() => deleteNote(note.id))}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
} 