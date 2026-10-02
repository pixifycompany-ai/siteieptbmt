
-- profiles: admin pode atualizar, exceto superadmins, e não pode promover alguém a superadmin
CREATE POLICY "Admin can update non-superadmin profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  get_user_role(auth.uid()) = 'admin'
  AND get_user_role(id) <> 'superadmin'
)
WITH CHECK (
  get_user_role(auth.uid()) = 'admin'
  AND role <> 'superadmin'
);

-- posts
CREATE POLICY "Admin can read all posts"
ON public.posts FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admin can update all posts"
ON public.posts FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admin can delete all posts"
ON public.posts FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) = 'admin');

-- cartorios
CREATE POLICY "Admin pode inserir cartorios"
ON public.cartorios FOR INSERT TO public
WITH CHECK (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admin pode atualizar cartorios"
ON public.cartorios FOR UPDATE TO public
USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admin pode deletar cartorios"
ON public.cartorios FOR DELETE TO public
USING (get_user_role(auth.uid()) = 'admin');

-- cartorios_settings
CREATE POLICY "Admin pode inserir configurações de cartorios"
ON public.cartorios_settings FOR INSERT TO public
WITH CHECK (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admin pode atualizar configurações de cartorios"
ON public.cartorios_settings FOR UPDATE TO public
USING (get_user_role(auth.uid()) = 'admin');

-- blog_settings
CREATE POLICY "Admin can insert blog settings"
ON public.blog_settings FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admin can update blog settings"
ON public.blog_settings FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admin can delete blog settings"
ON public.blog_settings FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) = 'admin');
