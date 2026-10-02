import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { defaultSettings, useBlogSettings } from "@/hooks/useBlogSettings";
import BlogCard from "@/components/blog/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";

const POST_FIELDS = "id,title,slug,excerpt,cover_image,published_at,tags,source";

/**
 * Últimas notícias do blog — substitui o iframe do widget que o Framer embutia.
 * Mesma consulta e mesmo card do /widget, renderizados direto na página.
 */
const NewsGrid = ({ limit = 6, showLoadMore = true }: { limit?: number; showLoadMore?: boolean }) => {
  const { data: settings } = useBlogSettings();
  const s = settings || defaultSettings;

  const { data: posts, isLoading } = useQuery({
    queryKey: ["latest-posts", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(POST_FIELDS)
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-6 md:px-6 md:pt-8">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="space-y-3 overflow-hidden rounded-2xl">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="mt-4 h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(posts ?? []).map((post, idx) => (
              <BlogCard key={post.id} post={post} settings={s} priority={idx < 3} />
            ))}
          </div>
          {showLoadMore && (posts?.length ?? 0) > 0 && (
            <div className="mt-8 flex justify-center">
              <Link
                to="/blog"
                className="rounded-full border border-[#2a2d33]/20 px-6 py-2.5 text-sm font-light text-[#2a2d33] transition-colors hover:bg-[#2a2d33] hover:text-white"
              >
                Carregar mais
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsGrid;
