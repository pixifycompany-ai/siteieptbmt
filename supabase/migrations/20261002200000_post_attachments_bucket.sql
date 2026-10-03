-- Consolida no Supabase o que o Lovable criou fora das migrations versionadas:
-- coluna de anexos dos posts (antes em drizzle/) e o bucket privado de PDFs com suas regras.

ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS attachments jsonb NOT NULL DEFAULT '[]'::jsonb;

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-attachments', 'blog-attachments', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can read blog attachments" ON storage.objects;
CREATE POLICY "Public can read blog attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-attachments');

DROP POLICY IF EXISTS "Authenticated can upload blog attachments" ON storage.objects;
CREATE POLICY "Authenticated can upload blog attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-attachments');

DROP POLICY IF EXISTS "Authenticated can update blog attachments" ON storage.objects;
CREATE POLICY "Authenticated can update blog attachments"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'blog-attachments');

DROP POLICY IF EXISTS "Authenticated can delete blog attachments" ON storage.objects;
CREATE POLICY "Authenticated can delete blog attachments"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'blog-attachments');
