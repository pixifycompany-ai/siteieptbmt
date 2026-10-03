import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BlogSettings } from "@/lib/blogSettings";
import { takePrefetch } from "@/lib/blogPrefetch";

export { defaultSettings, hexToRgba, type BlogSettings } from "@/lib/blogSettings";

export const useBlogSettings = () => {
  return useQuery({
    queryKey: ["blog-settings"],
    queryFn: async () => {
      const pre = await takePrefetch<BlogSettings>("settings");
      if (pre?.[0]) return pre[0];
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
