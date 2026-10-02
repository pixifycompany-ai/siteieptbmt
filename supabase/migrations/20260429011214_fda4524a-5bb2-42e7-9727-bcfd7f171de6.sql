-- 1. Borda e sombra configuráveis
ALTER TABLE public.blog_settings
  ADD COLUMN IF NOT EXISTS card_border_color text NOT NULL DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS card_border_opacity real NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS card_border_width integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS card_shadow_color text NOT NULL DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS card_shadow_opacity real NOT NULL DEFAULT 0.1,
  ADD COLUMN IF NOT EXISTS card_shadow_size integer NOT NULL DEFAULT 0;

-- 2. Index para a query mais quente
CREATE INDEX IF NOT EXISTS posts_published_idx
  ON public.posts (published_at DESC)
  WHERE status = 'published';

-- 3. Manutenção diária
CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.daily_maintenance()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.posts
   WHERE status = 'draft'
     AND author_id IS NULL
     AND created_at < now() - interval '30 days';
END;
$$;

-- Remove agendamento anterior (idempotência)
DO $$
BEGIN
  PERFORM cron.unschedule('daily-maintenance');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'daily-maintenance',
  '0 6 * * *',
  $$ SELECT public.daily_maintenance();
     VACUUM (ANALYZE) public.posts;
     VACUUM (ANALYZE) public.cartorios;
     VACUUM (ANALYZE) public.blog_settings;
     VACUUM (ANALYZE) public.cartorios_settings;
     VACUUM (ANALYZE) public.profiles; $$
);