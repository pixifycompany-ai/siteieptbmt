import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useBlogSettings, defaultSettings } from "@/hooks/useBlogSettings";
import { useResetThemeForPublic } from "@/contexts/ThemeContext";
import BlogCard from "@/components/blog/BlogCard";
import { formatPostDate } from "@/lib/formatDate";
import { estimateReadingTime } from "@/lib/readingTime";
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, FileText, ExternalLink } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DOMPurify from "dompurify";

const formatFileSize = (bytes: number) =>
  !bytes
    ? ""
    : bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const BlogPost = () => {
  useResetThemeForPublic();
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [prevPost, setPrevPost] = useState<any>(null);
  const [nextPost, setNextPost] = useState<any>(null);
  const { data: settings } = useBlogSettings();
  const s = settings || defaultSettings;

  useEffect(() => {
    if (post?.title) document.title = `${post.title} | Cartórios de Protesto MT`;
  }, [post?.title]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*, profiles(full_name, avatar_url)")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      if (data) {
        setPost(data);

        // Fetch full author profile including job_title
        const displayId = (data as any).display_author_id || data.author_id;
        if (displayId) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, job_title")
            .eq("id", displayId)
            .single();
          setAuthor(profile);
        }

        const now = new Date().toISOString();

        const { data: prev } = await supabase
          .from("posts")
          .select("slug, title")
          .eq("status", "published")
          .lte("published_at", now)
          .lt("published_at", data.published_at)
          .order("published_at", { ascending: false })
          .limit(1)
          .single();
        setPrevPost(prev || null);

        const { data: next } = await supabase
          .from("posts")
          .select("slug, title")
          .eq("status", "published")
          .lte("published_at", now)
          .gt("published_at", data.published_at)
          .order("published_at", { ascending: true })
          .limit(1)
          .single();
        setNextPost(next || null);

        const { data: rel } = await supabase
          .from("posts")
          .select("*")
          .eq("status", "published")
          .neq("id", data.id)
          .lte("published_at", now)
          .order("published_at", { ascending: false })
          .limit(3);
        setRelated(rel || []);
      }
    };
    fetchData();
  }, [slug]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post?.title || "";
  const readTime = post?.content ? estimateReadingTime(post.content) : null;

  const authorInitials = author?.full_name
    ? author.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  if (!post) return <div className="flex min-h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between">
          <Link to="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar ao blog
          </Link>
          <a href={s.homepage_url} className="text-sm text-muted-foreground hover:text-foreground">Voltar para a página inicial</a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 mt-6 md:mt-8">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full rounded-xl object-cover aspect-video"
          />
        ) : (
          <div className="w-full rounded-xl bg-muted aspect-video" />
        )}
      </div>

      <article className="max-w-3xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4">
          {post.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {post.published_at && formatPostDate(post.published_at)}
        </p>
        {readTime && (
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1 mb-8">
            <Clock className="h-3.5 w-3.5" />
            {readTime} min. de leitura
          </p>
        )}
        {!readTime && <div className="mb-8" />}

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || "") }}
        />

        {Array.isArray(post.attachments) && post.attachments.length > 0 && (
          <div className="mt-10">
            <h2 className="text-base font-semibold mb-3">Documentos anexos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {post.attachments.map((a: any) => (
                <a
                  key={a.path || a.url}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors"
                >
                  <FileText className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(a.size)}</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      Abrir PDF <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {post.source && (
          <p className="mt-8 text-sm text-muted-foreground">
            Fonte:{" "}
            {post.source.startsWith("http") ? (
              <a href={post.source} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                {post.source}
              </a>
            ) : (
              <span>{post.source}</span>
            )}
          </p>
        )}

        {/* Author card */}
        {author && (
          <div className="mt-10 flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
            <Avatar className="h-12 w-12">
              {author.avatar_url && <AvatarImage src={author.avatar_url} />}
              <AvatarFallback className="text-sm">{authorInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{author.full_name}</p>
              {author.job_title && (
                <p className="text-xs text-muted-foreground">{author.job_title}</p>
              )}
            </div>
          </div>
        )}

        {/* Share buttons */}
        <div className="mt-10 flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Compartilhe em</span>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="Compartilhar no X"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="Compartilhar no Facebook"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="Compartilhar no WhatsApp"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>
      </article>

      {/* Prev/Next navigation */}
      {(prevPost || nextPost) && (
        <div className="max-w-3xl mx-auto px-4 md:px-6 pb-8">
          <div className="border-t pt-6 flex items-center justify-between">
            {prevPost ? (
              <Link to={`/blog/${prevPost.slug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
              </Link>
            ) : <span />}
            {nextPost ? (
              <Link to={`/blog/${nextPost.slug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span>Próximo</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : <span />}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 border-t">
          <h2 className="text-2xl font-medium mb-6">Próximos posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map(r => <BlogCard key={r.id} post={r} settings={s} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;
