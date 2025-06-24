-- Step 0: Create a helper function to get the role of the current user
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 1: Create a central table for all tags
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL DEFAULT '#808080', -- Default to gray, stores hex codes like #FFD700
    description TEXT, -- Optional description for the tag's meaning
    user_id UUID REFERENCES auth.users(id)
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Step 2: Create a polymorphic association table to link tags to any entity
CREATE TABLE public.entity_tags (
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL,
    entity_type TEXT NOT NULL, -- Will store 'character', 'scene', or 'chapter'
    PRIMARY KEY (tag_id, entity_id, entity_type)
);
ALTER TABLE public.entity_tags ENABLE ROW LEVEL SECURITY;

-- Step 3: Define Row Level Security Policies
-- Policies for 'tags' table
CREATE POLICY "Tags are viewable by all authenticated users." ON public.tags FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage all tags." ON public.tags FOR ALL USING (get_my_role() = 'admin');

-- Policies for 'entity_tags' table
CREATE POLICY "Entity-tag links are viewable by all." ON public.entity_tags FOR SELECT USING (true);
CREATE POLICY "Editors and Admins can link and unlink tags." ON public.entity_tags FOR ALL USING (get_my_role() IN ('admin', 'editor')); 