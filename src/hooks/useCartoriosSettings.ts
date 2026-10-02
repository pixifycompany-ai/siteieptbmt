import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CartoriosSettings = {
  id: string;
  widget_bg_color: string;
  widget_bg_opacity: number;
  card_bg_color: string;
  card_bg_opacity: number;
  card_title_color: string;
  card_title_opacity: number;
  card_text_color: string;
  card_text_opacity: number;
  card_subtitle_color: string;
  card_subtitle_opacity: number;
  card_label_color: string;
  card_divider_color: string;
  card_divider_opacity: number;
  card_icon_color: string;
  card_icon_opacity: number;
  card_social_bg_color: string;
  card_social_bg_opacity: number;
  card_border_radius: number;
  card_width: number;
  card_min_height: number;
  card_social_radius: number;
  card_social_position: "left" | "right";
  card_gap: number;
  homepage_url: string;
  updated_at: string;
};

export const defaultCartoriosSettings: CartoriosSettings = {
  id: "",
  widget_bg_color: "#EFEFEF",
  widget_bg_opacity: 1,
  card_bg_color: "#2A2D3E",
  card_bg_opacity: 1,
  card_title_color: "#00D4D4",
  card_title_opacity: 1,
  card_text_color: "#FFFFFF",
  card_text_opacity: 1,
  card_subtitle_color: "#FFFFFF",
  card_subtitle_opacity: 1,
  card_label_color: "#FFFFFF",
  card_divider_color: "#00D4D4",
  card_divider_opacity: 1,
  card_icon_color: "#00D4D4",
  card_icon_opacity: 1,
  card_social_bg_color: "#00D4D4",
  card_social_bg_opacity: 1,
  card_border_radius: 24,
  card_width: 0,
  card_min_height: 0,
  card_social_radius: 9999,
  card_social_position: "left",
  card_gap: 24,
  homepage_url: "/",
  updated_at: "",
};

export function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const useCartoriosSettings = () => {
  return useQuery({
    queryKey: ["cartorios-settings"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("cartorios_settings")
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return data as CartoriosSettings;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
