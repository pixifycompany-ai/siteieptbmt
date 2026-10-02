import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useBlogSettings, defaultSettings, hexToRgba } from "@/hooks/useBlogSettings";
import { useResetThemeForPublic } from "@/contexts/ThemeContext";
import BlogCard from "@/components/blog/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";

const POST_FIELDS = "id,title,slug,excerpt,cover_image,published_at,tags,source";
const REFRESH_MS = 60 * 60 * 1000; // 60 min

const Widget = () => {
  useResetThemeForPublic();
  const [posts, setPosts] = useState<any[] | null>(null);
  const lastFetchRef = useRef<number>(0);
  const { data: settings, isLoading: settingsLoading } = useBlogSettings();
  const s = settings || defaultSettings;

  const fetchPosts = async () => {
    lastFetchRef.current = Date.now();
    const { data } = await supabase
      .from("posts")
      .select(POST_FIELDS)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(6);
    setPosts(data || []);
  };

  useEffect(() => {
    fetchPosts();
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastFetchRef.current < REFRESH_MS) return;
      fetchPosts();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const loading = posts === null || settingsLoading;

  const pageBg = hexToRgba(s.page_bg_color, s.page_bg_opacity);
  const loadMore = hexToRgba(s.load_more_text_color, s.load_more_text_opacity);
  const loadMoreBorder = hexToRgba(s.load_more_text_color, s.load_more_text_opacity * 0.3);

  return (
    <div style={{ background: pageBg, minHeight: "100%" }}>
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-8 md:px-6 md:pt-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-2xl overflow-hidden">
                <Skeleton className="w-full aspect-video rounded-lg" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, idx) => (
                <BlogCard key={post.id} post={post} settings={s} targetTop priority={idx < 3} />
              ))}
            </div>
            {posts.length > 0 && (
              <div className="flex justify-center mt-8">
                <a
                  href="/blog"
                  target="_top"
                  className="px-6 py-2.5 border font-light text-sm rounded-full hover:bg-white/10 transition-colors"
                  style={{ color: loadMore, borderColor: loadMoreBorder }}
                >
                  Carregar mais
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Widget;
