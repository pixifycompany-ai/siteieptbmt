import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "lucide-react";
import { formatPostDate } from "@/lib/formatDate";
import { estimateReadingTime } from "@/lib/readingTime";
import { hexToRgba, type BlogSettings } from "@/lib/blogSettings";

interface Props {
  post: any;
  settings: BlogSettings;
  targetTop?: boolean;
  priority?: boolean;
}

// Add Supabase storage on-the-fly transformations to keep card images small
const optimizeImage = (url: string | null | undefined, width = 600): string | undefined => {
  if (!url) return undefined;
  if (!url.includes("supabase") || !url.includes("/storage/v1/object/")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}width=${width}&quality=75`;
};

const BlogCard = ({ post, settings, targetTop, priority }: Props) => {
  const [hovered, setHovered] = useState(false);
  const s = settings;
  const url = `/blog/${post.slug}`;
  const readTime = post.content ? estimateReadingTime(post.content) : null;

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    targetTop ? (
      <a href={url} target="_top" className="block">{children}</a>
    ) : (
      <Link to={url} className="block">{children}</Link>
    );

  const postTags: string[] = post.tags || [];

  const borderColor = hexToRgba(s.card_border_color ?? "#000000", s.card_border_opacity ?? 0);
  const shadow = (s.card_shadow_size ?? 0) > 0
    ? `0 ${(s.card_shadow_size ?? 0) / 2}px ${s.card_shadow_size}px ${(s.card_shadow_size ?? 0) / 8}px ${hexToRgba(s.card_shadow_color ?? "#000000", s.card_shadow_opacity ?? 0.1)}`
    : "none";

  return (
    <Wrapper>
      <div
        className="relative overflow-hidden cursor-pointer transition-transform duration-250 flex flex-col h-full"
        style={{
          borderRadius: `${s.card_border_radius}px`,
          background: hexToRgba(s.card_bg_color, s.card_bg_opacity),
          transform: hovered ? "scale(1.02)" : "scale(1)",
          border: `${s.card_border_width ?? 0}px solid ${borderColor}`,
          boxShadow: shadow,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ borderRadius: `${s.card_image_radius}px`, overflow: "hidden", margin: "8px 8px 0" }} className="md:!m-[12px_12px_0]">
          {post.cover_image ? (
            <img
              src={optimizeImage(post.cover_image)}
              alt={post.title}
              className="w-full aspect-video object-cover"
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              {...(priority ? { fetchPriority: "high" as any } : {})}
            />
          ) : (
            <div className="w-full aspect-video bg-muted" />
          )}
        </div>
        <div className="p-3 md:p-4 flex flex-col flex-1">
          {postTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {postTags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: hexToRgba(s.filter_accent_color, s.filter_accent_opacity * 0.2),
                    color: hexToRgba(s.filter_accent_color, s.filter_accent_opacity * 0.85),
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h3 className="font-bold text-lg leading-tight mb-3 line-clamp-3 min-h-0 md:min-h-[3.75rem]" style={{ color: hexToRgba(s.card_title_color, s.card_title_opacity) }}>
            {post.title}
          </h3>
          <div className="mt-auto">
            <span className="text-xs" style={{ color: hexToRgba(s.card_date_color, s.card_date_opacity) }}>
              {post.published_at ? formatPostDate(post.published_at) : ""}
            </span>
            {readTime && (
              <span className="flex items-center gap-1 text-xs mt-1" style={{ color: hexToRgba(s.card_date_color, s.card_date_opacity) }}>
                <Clock className="h-3 w-3" />
                {readTime} min. de leitura
              </span>
            )}
          </div>
          <div className="flex items-center justify-end mt-2">
            <span
              className="text-xs font-light px-3 py-1.5"
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
          className="absolute inset-0 hidden md:flex flex-col items-center justify-center transition-opacity duration-250"
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
          <p className="text-white font-normal text-sm">Ler matéria completa</p>
        </div>
      </div>
    </Wrapper>
  );
};

export default BlogCard;
