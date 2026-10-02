CREATE POLICY "Public can read blog attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-attachments');

CREATE POLICY "Authenticated can upload blog attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-attachments');

CREATE POLICY "Authenticated can update blog attachments"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'blog-attachments');

CREATE POLICY "Authenticated can delete blog attachments"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'blog-attachments');