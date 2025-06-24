-- Step 0: Clean up the previous, now obsolete, tagging system.
DROP TABLE IF EXISTS public.entity_tags;
DROP TABLE IF EXISTS public.tags;
DROP FUNCTION IF EXISTS get_tags_for_entity;

-- Step 1: Add a JSONB column to the CHARACTERS table for specific attribute tags.
ALTER TABLE public.characters
ADD COLUMN IF NOT EXISTS attribute_tags JSONB DEFAULT '{"physical_attributes": [], "cosmetic_symbology": [], "animal_form": []}'::jsonb;

-- Step 2: Create a central table for the new global "Color Keys"
CREATE TABLE public.color_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL DEFAULT '#808080', -- Stores hex codes
    description TEXT,
    user_id UUID REFERENCES auth.users(id)
);
ALTER TABLE public.color_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Color Keys are viewable by all." ON public.color_keys FOR SELECT USING (true);
CREATE POLICY "Admins can manage Color Keys." ON public.color_keys FOR ALL USING (get_my_role() = 'admin');

-- Step 3: Create the association table to link Color Keys to any entity
CREATE TABLE public.entity_color_keys (
    key_id UUID NOT NULL REFERENCES public.color_keys(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL,
    entity_type TEXT NOT NULL, -- 'character', 'scene', or 'chapter'
    PRIMARY KEY (key_id, entity_id, entity_type)
);
ALTER TABLE public.entity_color_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Key links are viewable by all." ON public.entity_color_keys FOR SELECT USING (true);
CREATE POLICY "Admins and Editors can manage key links." ON public.entity_color_keys FOR ALL USING (get_my_role() IN ('admin', 'editor')); 