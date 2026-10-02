
CREATE POLICY "Superadmin can update all profiles"
ON public.profiles FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) = 'superadmin')
WITH CHECK (get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Superadmin can delete profiles"
ON public.profiles FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) = 'superadmin');
