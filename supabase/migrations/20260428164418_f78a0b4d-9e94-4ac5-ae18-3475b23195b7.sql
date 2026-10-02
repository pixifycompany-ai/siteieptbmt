ALTER TABLE public.blog_settings
  ADD COLUMN IF NOT EXISTS page_bg_color text NOT NULL DEFAULT '#0061FF',
  ADD COLUMN IF NOT EXISTS page_bg_opacity real NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS header_text_color text NOT NULL DEFAULT '#FFFFFF',
  ADD COLUMN IF NOT EXISTS header_text_opacity real NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS search_bg_color text NOT NULL DEFAULT '#FFFFFF',
  ADD COLUMN IF NOT EXISTS search_bg_opacity real NOT NULL DEFAULT 0.1,
  ADD COLUMN IF NOT EXISTS search_text_color text NOT NULL DEFAULT '#FFFFFF',
  ADD COLUMN IF NOT EXISTS search_text_opacity real NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS filter_accent_color text NOT NULL DEFAULT '#FFFFFF',
  ADD COLUMN IF NOT EXISTS filter_accent_opacity real NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS load_more_text_color text NOT NULL DEFAULT '#FFFFFF',
  ADD COLUMN IF NOT EXISTS load_more_text_opacity real NOT NULL DEFAULT 1;