
-- Tabela cartorios
CREATE TABLE public.cartorios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_cartorio TEXT NOT NULL,
  nome_tabeliao TEXT,
  localidades TEXT,
  endereco TEXT,
  telefones TEXT[] NOT NULL DEFAULT '{}',
  email TEXT,
  instagram_url TEXT,
  whatsapp_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cartorios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cartorios são visíveis para todos"
  ON public.cartorios FOR SELECT
  USING (true);

CREATE POLICY "Superadmin pode inserir cartorios"
  ON public.cartorios FOR INSERT
  WITH CHECK (public.get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Superadmin pode atualizar cartorios"
  ON public.cartorios FOR UPDATE
  USING (public.get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Superadmin pode deletar cartorios"
  ON public.cartorios FOR DELETE
  USING (public.get_user_role(auth.uid()) = 'superadmin');

CREATE TRIGGER update_cartorios_updated_at
  BEFORE UPDATE ON public.cartorios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela cartorios_settings (singleton)
CREATE TABLE public.cartorios_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  widget_bg_color TEXT NOT NULL DEFAULT '#EFEFEF',
  widget_bg_opacity NUMERIC NOT NULL DEFAULT 1,
  card_bg_color TEXT NOT NULL DEFAULT '#2A2D3E',
  card_bg_opacity NUMERIC NOT NULL DEFAULT 1,
  card_title_color TEXT NOT NULL DEFAULT '#00D4D4',
  card_title_opacity NUMERIC NOT NULL DEFAULT 1,
  card_text_color TEXT NOT NULL DEFAULT '#FFFFFF',
  card_text_opacity NUMERIC NOT NULL DEFAULT 1,
  card_subtitle_color TEXT NOT NULL DEFAULT '#FFFFFF',
  card_subtitle_opacity NUMERIC NOT NULL DEFAULT 1,
  card_label_color TEXT NOT NULL DEFAULT '#FFFFFF',
  card_divider_color TEXT NOT NULL DEFAULT '#00D4D4',
  card_divider_opacity NUMERIC NOT NULL DEFAULT 1,
  card_icon_color TEXT NOT NULL DEFAULT '#00D4D4',
  card_icon_opacity NUMERIC NOT NULL DEFAULT 1,
  card_social_bg_color TEXT NOT NULL DEFAULT '#00D4D4',
  card_social_bg_opacity NUMERIC NOT NULL DEFAULT 1,
  card_border_radius INTEGER NOT NULL DEFAULT 24,
  homepage_url TEXT NOT NULL DEFAULT '/',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cartorios_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Configurações de cartorios são visíveis para todos"
  ON public.cartorios_settings FOR SELECT
  USING (true);

CREATE POLICY "Superadmin pode inserir configurações de cartorios"
  ON public.cartorios_settings FOR INSERT
  WITH CHECK (public.get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Superadmin pode atualizar configurações de cartorios"
  ON public.cartorios_settings FOR UPDATE
  USING (public.get_user_role(auth.uid()) = 'superadmin');

CREATE TRIGGER update_cartorios_settings_updated_at
  BEFORE UPDATE ON public.cartorios_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed singleton
INSERT INTO public.cartorios_settings (id) VALUES (gen_random_uuid());
