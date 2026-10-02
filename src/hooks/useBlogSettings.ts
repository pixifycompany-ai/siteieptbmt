import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type BlogSettings = Tables<"blog_settings">;

export const defaultSettings: BlogSettings = {
  id: "",
  card_bg_color: "#FFFFFF",
  card_bg_opacity: 1,
  card_title_color: "#111111",
  card_title_opacity: 1,
  card_date_color: "#666666",
  card_date_opacity: 1,
  card_button_bg_color: "#111111",
  card_button_bg_opacity: 1,
  card_button_text_color: "#FFFFFF",
  card_button_text_opacity: 1,
  card_border_radius: 16,
  card_image_radius: 16,
  card_hover_overlay_color: "#1a1a2e",
  card_hover_overlay_opacity: 0.9,
  card_hover_icon_color: "#00D4D4",
  card_hover_icon_opacity: 1,
  homepage_url: "/",
  page_bg_color: "#0061FF",
  page_bg_opacity: 1,
  header_text_color: "#FFFFFF",
  header_text_opacity: 1,
  search_bg_color: "#FFFFFF",
  search_bg_opacity: 0.1,
  search_text_color: "#FFFFFF",
  search_text_opacity: 1,
  filter_accent_color: "#FFFFFF",
  filter_accent_opacity: 1,
  load_more_text_color: "#FFFFFF",
  load_more_text_opacity: 1,
  card_border_color: "#000000",
  card_border_opacity: 0,
  card_border_width: 0,
  card_shadow_color: "#000000",
  card_shadow_opacity: 0.1,
  card_shadow_size: 0,
  updated_at: "",
};

export function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const useBlogSettings = () => {
  return useQuery({
    queryKey: ["blog-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_settings")
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return data as BlogSettings;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
