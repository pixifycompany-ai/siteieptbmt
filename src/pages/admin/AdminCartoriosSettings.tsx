import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartoriosSettings, defaultCartoriosSettings, CartoriosSettings, hexToRgba } from "@/hooks/useCartoriosSettings";
import CartorioCard from "@/components/cartorios/CartorioCard";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const sample = {
  id: "preview",
  nome_cartorio: "1º Tabelionato de Notas e Protesto de Letras e Títulos",
  nome_tabeliao: "Maria da Silva",
  localidades: "Cuiabá, Várzea Grande e Região Metropolitana",
  endereco: "Av. Historiador Rubens de Mendonça, 1856 - Bosque da Saúde, Cuiabá - MT, 78050-000",
  telefones: ["(65) 3000-0000", "(65) 99999-0000"],
  email: "contato@cartorio.com.br",
  instagram_url: "https://instagram.com",
  whatsapp_url: "https://wa.me/5500000000000",
};

const ColorRow = ({ label, color, opacity, onColor, onOpacity, withOpacity = true }: any) => (
  <div className="space-y-1.5">
    <Label className="text-sm text-foreground">{label}</Label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={color}
        onChange={(e) => onColor(e.target.value)}
        className="h-9 w-12 rounded cursor-pointer bg-transparent border border-border"
      />
      <Input value={color} onChange={(e) => onColor(e.target.value)} className="text-sm flex-1" />
      {withOpacity && (
        <div className="flex items-center gap-2 w-32">
          <input type="range" min={0} max={1} step={0.05} value={opacity} onChange={(e) => onOpacity(parseFloat(e.target.value))} className="flex-1 accent-primary" />
          <span className="text-xs text-muted-foreground w-8 text-right">{Math.round(opacity * 100)}%</span>
        </div>
      )}
    </div>
  </div>
);

const AdminCartoriosSettings = () => {
  const { data } = useCartoriosSettings();
  const qc = useQueryClient();
  const [s, setS] = useState<CartoriosSettings>(defaultCartoriosSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setS(data);
  }, [data]);

  const update = (k: keyof CartoriosSettings, v: any) => setS({ ...s, [k]: v });

  const handleSave = async () => {
    if (!s.id) return;
    setSaving(true);
    const { id, updated_at, ...payload } = s;
    const { error } = await (supabase as any).from("cartorios_settings").update(payload).eq("id", id);
    setSaving(false);
    if (error) toast.error("Erro ao salvar");
    else {
      toast.success("Configurações salvas!");
      qc.invalidateQueries({ queryKey: ["cartorios-settings"] });
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[22px] font-medium tracking-tight">Configurações dos Cartórios</h2>
          <p className="text-sm text-muted-foreground mt-1">Personalize a aparência do widget</p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border py-4">
            <CardTitle className="text-sm font-medium">Estilo</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <ColorRow label="Fundo do Widget" color={s.widget_bg_color} opacity={s.widget_bg_opacity}
              onColor={(v: string) => update("widget_bg_color", v)} onOpacity={(v: number) => update("widget_bg_opacity", v)} />
            <ColorRow label="Fundo do Card" color={s.card_bg_color} opacity={s.card_bg_opacity}
              onColor={(v: string) => update("card_bg_color", v)} onOpacity={(v: number) => update("card_bg_opacity", v)} />
            <ColorRow label="Título do Card" color={s.card_title_color} opacity={s.card_title_opacity}
              onColor={(v: string) => update("card_title_color", v)} onOpacity={(v: number) => update("card_title_opacity", v)} />
            <ColorRow label="Subtítulo (Tabelião)" color={s.card_subtitle_color} opacity={s.card_subtitle_opacity}
              onColor={(v: string) => update("card_subtitle_color", v)} onOpacity={(v: number) => update("card_subtitle_opacity", v)} />
            <ColorRow label="Texto do Card" color={s.card_text_color} opacity={s.card_text_opacity}
              onColor={(v: string) => update("card_text_color", v)} onOpacity={(v: number) => update("card_text_opacity", v)} />
            <ColorRow label="Labels (ENDEREÇO, etc)" color={s.card_label_color} opacity={1}
              onColor={(v: string) => update("card_label_color", v)} onOpacity={() => {}} withOpacity={false} />
            <ColorRow label="Divisor" color={s.card_divider_color} opacity={s.card_divider_opacity}
              onColor={(v: string) => update("card_divider_color", v)} onOpacity={(v: number) => update("card_divider_opacity", v)} />
            <ColorRow label="Ícones" color={s.card_icon_color} opacity={s.card_icon_opacity}
              onColor={(v: string) => update("card_icon_color", v)} onOpacity={(v: number) => update("card_icon_opacity", v)} />
            <ColorRow label="Fundo dos botões sociais" color={s.card_social_bg_color} opacity={s.card_social_bg_opacity}
              onColor={(v: string) => update("card_social_bg_color", v)} onOpacity={(v: number) => update("card_social_bg_opacity", v)} />

            <div className="space-y-1.5">
              <Label className="text-sm text-foreground">Border radius do card ({s.card_border_radius}px)</Label>
              <input type="range" min={0} max={48} step={1} value={s.card_border_radius}
                onChange={(e) => update("card_border_radius", parseInt(e.target.value))} className="w-full accent-primary" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-foreground">
                Largura do card ({s.card_width === 0 ? "automática" : `${s.card_width}px`})
              </Label>
              <input type="range" min={0} max={600} step={10} value={s.card_width}
                onChange={(e) => update("card_width", parseInt(e.target.value))} className="w-full accent-primary" />
              <p className="text-xs text-muted-foreground">Use 0 para largura automática (grid 3 colunas).</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-foreground">
                Altura mínima do card ({s.card_min_height === 0 ? "automática" : `${s.card_min_height}px`})
              </Label>
              <input type="range" min={0} max={800} step={10} value={s.card_min_height}
                onChange={(e) => update("card_min_height", parseInt(e.target.value))} className="w-full accent-primary" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-foreground">
                Border radius dos botões sociais ({s.card_social_radius >= 9999 ? "círculo" : `${s.card_social_radius}px`})
              </Label>
              <input type="range" min={0} max={9999} step={1} value={s.card_social_radius}
                onChange={(e) => update("card_social_radius", parseInt(e.target.value))} className="w-full accent-primary" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-foreground">Posição dos botões sociais</Label>
              <div className="flex gap-2">
                {(["left", "right"] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => update("card_social_position", pos)}
                    className={cn(
                      "flex-1 py-2 rounded-md text-sm border transition-colors",
                      s.card_social_position === pos
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                    )}
                  >
                    {pos === "left" ? "Esquerda" : "Direita"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-foreground">Espaçamento entre cards ({s.card_gap}px)</Label>
              <input type="range" min={0} max={80} step={1} value={s.card_gap}
                onChange={(e) => update("card_gap", parseInt(e.target.value))} className="w-full accent-primary" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-foreground">URL da homepage (botão voltar)</Label>
              <Input value={s.homepage_url} onChange={(e) => update("homepage_url", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div>
          <p className="text-sm text-muted-foreground mb-3">Preview ao vivo</p>
          <div className="rounded-xl p-6 border border-border" style={{ background: hexToRgba(s.widget_bg_color, s.widget_bg_opacity) }}>
            <CartorioCard cartorio={sample as any} settings={s} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCartoriosSettings;
