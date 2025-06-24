-- Step 1: Create the main 'notes' table
CREATE TABLE public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_pinned_globally BOOLEAN NOT NULL DEFAULT false, -- For the creator's own dashboard
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all notes." ON public.notes FOR ALL USING (get_my_role() = 'admin');


-- Step 2: Create the table to manage pinning notes to other users' dashboards
CREATE TABLE public.note_assignments (
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- The user receiving the pinned note
    assigned_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- The admin who assigned it
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (note_id, user_id)
);
ALTER TABLE public.note_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see notes assigned to them." ON public.note_assignments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage note assignments." ON public.note_assignments FOR ALL USING (get_my_role() = 'admin'); 