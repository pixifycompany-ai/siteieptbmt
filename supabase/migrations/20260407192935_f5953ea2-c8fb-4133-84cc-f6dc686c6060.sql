-- Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role text NOT NULL DEFAULT 'colaborador' CHECK (role IN ('superadmin', 'colaborador')),
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Security definer function for role checks (now profiles exists)
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = _user_id
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Superadmin can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Posts table
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  excerpt text,
  cover_image text,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts" ON public.posts
  FOR SELECT USING (status = 'published' AND published_at <= now());

CREATE POLICY "Authors can read own posts" ON public.posts
  FOR SELECT TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Superadmin can read all posts" ON public.posts
  FOR SELECT TO authenticated
  USING (public.get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Authenticated users can create posts" ON public.posts
  FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update own draft posts" ON public.posts
  FOR UPDATE TO authenticated
  USING (author_id = auth.uid() AND status != 'published');

CREATE POLICY "Superadmin can update all posts" ON public.posts
  FOR UPDATE TO authenticated
  USING (public.get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Superadmin can delete all posts" ON public.posts
  FOR DELETE TO authenticated
  USING (public.get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Authors can delete own draft posts" ON public.posts
  FOR DELETE TO authenticated
  USING (author_id = auth.uid() AND status = 'draft');

-- Blog settings table
CREATE TABLE public.blog_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_bg_color text NOT NULL DEFAULT '#FFFFFF',
  card_title_color text NOT NULL DEFAULT '#111111',
  card_date_color text NOT NULL DEFAULT '#666666',
  card_button_bg_color text NOT NULL DEFAULT '#111111',
  card_button_text_color text NOT NULL DEFAULT '#FFFFFF',
  card_border_radius integer NOT NULL DEFAULT 16,
  card_image_radius integer NOT NULL DEFAULT 16,
  card_hover_overlay_color text NOT NULL DEFAULT '#1a1a2e',
  card_hover_icon_color text NOT NULL DEFAULT '#00D4D4',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read blog settings" ON public.blog_settings
  FOR SELECT USING (true);

CREATE POLICY "Superadmin can insert blog settings" ON public.blog_settings
  FOR INSERT TO authenticated
  WITH CHECK (public.get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Superadmin can update blog settings" ON public.blog_settings
  FOR UPDATE TO authenticated
  USING (public.get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Superadmin can delete blog settings" ON public.blog_settings
  FOR DELETE TO authenticated
  USING (public.get_user_role(auth.uid()) = 'superadmin');

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_settings_updated_at
  BEFORE UPDATE ON public.blog_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'colaborador'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for blog covers
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-covers', 'blog-covers', true);

CREATE POLICY "Anyone can view blog covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-covers');

CREATE POLICY "Authenticated users can upload blog covers" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-covers');

CREATE POLICY "Authenticated users can update blog covers" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-covers');

CREATE POLICY "Authenticated users can delete blog covers" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'blog-covers');

-- Insert default blog settings row
INSERT INTO public.blog_settings (id) VALUES (gen_random_uuid());