ALTER TABLE public.blog_settings
  ADD COLUMN card_bg_opacity real NOT NULL DEFAULT 1,
  ADD COLUMN card_title_opacity real NOT NULL DEFAULT 1,
  ADD COLUMN card_date_opacity real NOT NULL DEFAULT 1,
  ADD COLUMN card_button_bg_opacity real NOT NULL DEFAULT 1,
  ADD COLUMN card_button_text_opacity real NOT NULL DEFAULT 1,
  ADD COLUMN card_hover_overlay_opacity real NOT NULL DEFAULT 0.9,
  ADD COLUMN card_hover_icon_opacity real NOT NULL DEFAULT 1;