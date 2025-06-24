ALTER TABLE public.characters
ADD COLUMN IF NOT EXISTS filter_tags JSONB DEFAULT '{"physical_attributes": [], "cosmetic_symbology": [], "animal_form": []}'::jsonb; 