DROP POLICY "Authors can update own draft posts" ON public.posts;
CREATE POLICY "Authors can update own posts" ON public.posts FOR UPDATE TO authenticated USING (author_id = auth.uid());