ALTER TABLE public.cartorios_settings
  ADD COLUMN IF NOT EXISTS card_width integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS card_min_height integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS card_social_radius integer NOT NULL DEFAULT 9999,
  ADD COLUMN IF NOT EXISTS card_social_position text NOT NULL DEFAULT 'left';