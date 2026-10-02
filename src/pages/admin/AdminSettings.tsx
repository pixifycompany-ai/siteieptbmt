import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useBlogSettings, defaultSettings, hexToRgba, type BlogSettings } from "@/hooks/useBlogSettings";
import { ArrowUpRight } from "lucide-react";

const AdminSettings = () => {
  const { data: savedSettings } = useBlogSettings();
  const [settings, setSettings] = useState<BlogSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (savedSettings) setSettings(savedSettings);
  }, [savedSettings]);

  const update = (key: keyof BlogSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    const { id, updated_at, ...rest } = settings;
    const { error } = await supabase.from("blog_settings").update(rest).eq("id", id);
    setSaving(false);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else toast({ title: "Configurações salvas!" });
  };

  const resetDefaults = () => setSettings({ ...defaultSettings, id: settings.id, updated_at: settings.updated_at });

  const ColorPickerWithOpacity = ({ label, colorField, opacityField }: { label: string; colorField: keyof BlogSettings; opacityField: keyof BlogSettings }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-foreground text-sm">{label}</Label>
        <div className="flex items-center gap-2">
          <input type="color" value={settings[colorField] as string} onChange={e => update(colorField, e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-border bg-transparent" />
          <Input value={settings[colorField] as string} onChange={e => update(colorField, e.target.value)} className="w-24 text-xs" />
        </div>
      </div>
      <div className="flex items-center gap-3 pl-2">
        <Label className="text-muted-foreground text-xs whitespace-nowrap">Opacidade ({Math.round((settings[opacityField] as number) * 100)}%)</Label>
        <Slider
          value={[settings[opacityField] as number]}
          onValueChange={([v]) => update(opacityField, v)}
          min={0} max={1} step={0.01}
          className="flex-1"
        />
      </div>
    </div>
  );

  const s = settings;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-medium text-foreground">Configurações Visuais</h2>
        <p className="text-sm text-muted-foreground mt-1">Personalize a aparência do blog e widgets públicos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-foreground font-medium">Geral</h3>
              <div className="flex items-center justify-between gap-4">
                <Label className="text-muted-foreground text-sm">URL da página inicial</Label>
                <Input
                  value={settings.homepage_url}
                  onChange={e => update("homepage_url", e.target.value)}
                  placeholder="https://seusite.com"
                  className="w-64 text-xs"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-5">
              <h3 className="text-foreground font-medium">Cores do Card</h3>
              <ColorPickerWithOpacity label="Fundo do card" colorField="card_bg_color" opacityField="card_bg_opacity" />
              <ColorPickerWithOpacity label="Cor do título" colorField="card_title_color" opacityField="card_title_opacity" />
              <ColorPickerWithOpacity label="Cor da data" colorField="card_date_color" opacityField="card_date_opacity" />
              <ColorPickerWithOpacity label="Fundo do botão" colorField="card_button_bg_color" opacityField="card_button_bg_opacity" />
              <ColorPickerWithOpacity label="Texto do botão" colorField="card_button_text_color" opacityField="card_button_text_opacity" />
              <ColorPickerWithOpacity label="Overlay do hover" colorField="card_hover_overlay_color" opacityField="card_hover_overlay_opacity" />
              <ColorPickerWithOpacity label="Ícone do hover" colorField="card_hover_icon_color" opacityField="card_hover_icon_opacity" />
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-5">
              <h3 className="text-foreground font-medium">Cores da página (Blog & Widget)</h3>
              <ColorPickerWithOpacity label="Fundo da página" colorField="page_bg_color" opacityField="page_bg_opacity" />
              <ColorPickerWithOpacity label="Texto do cabeçalho" colorField="header_text_color" opacityField="header_text_opacity" />
              <ColorPickerWithOpacity label="Fundo da busca" colorField="search_bg_color" opacityField="search_bg_opacity" />
              <ColorPickerWithOpacity label="Texto da busca" colorField="search_text_color" opacityField="search_text_opacity" />
              <ColorPickerWithOpacity label="Destaque dos filtros" colorField="filter_accent_color" opacityField="filter_accent_opacity" />
              <ColorPickerWithOpacity label='Botão "Carregar mais" e paginação' colorField="load_more_text_color" opacityField="load_more_text_opacity" />
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-foreground font-medium">Border Radius</h3>
              <div>
                <Label className="text-muted-foreground text-sm">Card ({settings.card_border_radius}px)</Label>
                <Slider value={[settings.card_border_radius]} onValueChange={([v]) => update("card_border_radius", v)} max={32} step={1} className="mt-2" />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Imagem ({settings.card_image_radius}px)</Label>
                <Slider value={[settings.card_image_radius]} onValueChange={([v]) => update("card_image_radius", v)} max={32} step={1} className="mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-5">
              <h3 className="text-foreground font-medium">Borda e sombra do card</h3>
              <ColorPickerWithOpacity label="Cor da borda" colorField="card_border_color" opacityField="card_border_opacity" />
              <div>
                <Label className="text-muted-foreground text-sm">Espessura da borda ({settings.card_border_width}px)</Label>
                <Slider value={[settings.card_border_width]} onValueChange={([v]) => update("card_border_width", v)} min={0} max={8} step={1} className="mt-2" />
              </div>
              <ColorPickerWithOpacity label="Cor da sombra" colorField="card_shadow_color" opacityField="card_shadow_opacity" />
              <div>
                <Label className="text-muted-foreground text-sm">Intensidade da sombra ({settings.card_shadow_size})</Label>
                <Slider value={[settings.card_shadow_size]} onValueChange={([v]) => update("card_shadow_size", v)} min={0} max={40} step={1} className="mt-2" />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={saveSettings} disabled={saving} className="flex-1">
              {saving ? "Salvando..." : "Salvar configurações"}
            </Button>
            <Button onClick={resetDefaults} variant="outline">
              Restaurar padrões
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h3 className="text-foreground font-medium">Preview ao vivo</h3>
          <div
            className="relative overflow-hidden cursor-pointer transition-transform duration-250"
            style={{
              borderRadius: `${s.card_border_radius}px`,
              background: hexToRgba(s.card_bg_color, s.card_bg_opacity),
              transform: hovered ? "scale(1.02)" : "scale(1)",
              border: `${s.card_border_width}px solid ${hexToRgba(s.card_border_color, s.card_border_opacity)}`,
              boxShadow: s.card_shadow_size > 0
                ? `0 ${s.card_shadow_size / 2}px ${s.card_shadow_size}px ${s.card_shadow_size / 8}px ${hexToRgba(s.card_shadow_color, s.card_shadow_opacity)}`
                : "none",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div style={{ borderRadius: `${s.card_image_radius}px`, overflow: "hidden", margin: "12px 12px 0" }}>
              <img
                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=340&fit=crop"
                alt="Preview"
                className="w-full aspect-video object-cover"
              />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg leading-tight mb-3 line-clamp-3" style={{ color: hexToRgba(s.card_title_color, s.card_title_opacity) }}>
                Exemplo de título do post para preview
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: hexToRgba(s.card_date_color, s.card_date_opacity) }}>
                  Postado em 07/04/2026 às 14:30h
                </span>
                <span
                  className="text-xs font-bold px-3 py-1.5"
                  style={{
                    background: hexToRgba(s.card_button_bg_color, s.card_button_bg_opacity),
                    color: hexToRgba(s.card_button_text_color, s.card_button_text_opacity),
                    borderRadius: "999px",
                  }}
                >
                  LER MAIS +
                </span>
              </div>
            </div>

            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-250"
              style={{
                background: hexToRgba(s.card_hover_overlay_color, s.card_hover_overlay_opacity),
                opacity: hovered ? 1 : 0,
                borderRadius: `${s.card_border_radius}px`,
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                style={{ background: hexToRgba(s.card_hover_icon_color, s.card_hover_icon_opacity) }}
              >
                <ArrowUpRight className="h-6 w-6 text-white" />
              </div>
              <p className="text-white font-bold text-sm">Ler matéria completa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
