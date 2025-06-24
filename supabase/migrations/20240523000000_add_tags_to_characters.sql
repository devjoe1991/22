ALTER TABLE public.characters
ADD COLUMN tags JSONB DEFAULT '{}'::jsonb; 