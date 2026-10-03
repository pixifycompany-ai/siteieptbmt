import { useQuery } from "@tanstack/react-query";
import { restSelect } from "@/lib/supabaseRest";
import { defaultSettings, type BlogSettings } from "@/lib/blogSettings";
import BlogCard from "@/components/blog/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";

const POST_FIELDS = "id,title,slug,excerpt,cover_image,published_at,tags,source";

/**
 * Últimas notícias do blog — substitui o iframe do widget que o Framer embutia.
 * Mesma consulta e mesmo card do /widget, renderizados direto na página.
 */
const NewsGrid = ({ limit = 6 }: { limit?: number }) => {
  // Mesmas consultas do widget do blog, via REST (sem o SDK do Supabase no carregamento da home).
  const { data: settings } = useQuery({
    queryKey: ["blog-settings-rest"],
    queryFn: async () => (await restSelect<BlogSettings>("blog_settings", { select: "*", limit: "1" }))[0],
    staleTime: 5 * 60 * 1000,
  });
  const s = settings || defaultSettings;

  const { data: posts, isLoading } = useQuery({
    queryKey: ["latest-posts", limit],
    queryFn: () =>
      restSelect<Record<string, unknown> & { id: string }>("posts", {
        select: POST_FIELDS,
        status: "eq.published",
        published_at: `lte.${new Date().toISOString()}`,
        order: "published_at.desc",
        limit: String(limit),
      }),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-6 md:px-6 md:pt-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="space-y-3 overflow-hidden rounded-2xl">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="space-y-3 p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="mt-4 h-4 w-1/3" />
                </div>
              </div>
            ))
          : (posts ?? []).map((post) => <BlogCard key={post.id} post={post} settings={s} />)}
      </div>
    </div>
  );
};

export default NewsGrid;
