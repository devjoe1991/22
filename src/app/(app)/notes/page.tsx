import { createClient } from "@/lib/supabase/server";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { NotesClient } from "./NotesClient";
import { redirect } from "next/navigation";

export default async function NotesPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Fetch all notes with their assignments, and all users who can be assigned notes
    const [notesData, usersData] = await Promise.all([
        (supabase as any).from('notes').select('*, note_assignments(user_id)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, username').neq('role', 'viewer')
    ]);
    
    return (
        <div className="p-8">
            <RoleGuard allowedRoles={['admin']} redirect>
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">Notes Management</h1>
                    <p className="text-muted-foreground">Create, pin, and assign notes to your team.</p>
                </header>
                <NotesClient notes={notesData.data || []} users={usersData.data || []} currentUserId={user.id} />
            </RoleGuard>
        </div>
    );
} 