import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useBlogSettings, defaultSettings, hexToRgba } from "@/hooks/useBlogSettings";
import { useResetThemeForPublic } from "@/contexts/ThemeContext";
import BlogCard from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, SlidersHorizontal, X } from "lucide-react";

const BlogList = () => {
  useResetThemeForPublic();
  useEffect(() => {
    document.title = "Notícias | Cartórios de Protesto MT";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", "Notícias sobre protesto de títulos, cartórios de Mato Grosso e o IEPTB-MT.");
  }, []);
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { data: settings } = useBlogSettings();
  const s = settings || defaultSettings;
  const PER_PAGE = 10;

  // Fetch all unique tags
  useEffect(() => {
    const fetchTags = async () => {
      const { data } = await supabase
        .from("posts")
        .select("tags")
        .eq("status", "published")
        .lte("published_at", new Date().toISOString());
      if (data) {
        const tagSet = new Set<string>();
        data.forEach((p: any) => {
          (p.tags || []).forEach((t: string) => tagSet.add(t));
        });
        setAllTags(Array.from(tagSet).sort());
      }
    };
    fetchTags();
  }, []);

  const fetchPosts = async () => {
    let query = supabase
      .from("posts")
      .select("id,title,slug,excerpt,cover_image,published_at,tags,source")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    if (dateFilter) {
      const now = new Date();
      let from: Date | null = null;
      if (dateFilter === "week") {
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateFilter === "month") {
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateFilter === "year") {
        from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      }
      if (from) {
        query = query.gte("published_at", from.toISOString());
      }
    }

    if (selectedTags.length > 0) {
      query = query.contains("tags", selectedTags);
    }

    query = query.range(page * PER_PAGE, (page + 1) * PER_PAGE - 1);

    const { data } = await query;
    if (data) {
      setPosts(data);
      setHasMore(data.length === PER_PAGE);
    }
  };

  useEffect(() => { fetchPosts(); }, [page, search, dateFilter, selectedTags]);

  const handleSearch = () => {
    setPage(0);
    setSearch(searchInput);
  };

  const toggleTag = (tag: string) => {
    setPage(0);
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const clearFilters = () => {
    setPage(0);
    setSearch("");
    setSearchInput("");
    setDateFilter("");
    setSelectedTags([]);
  };

  const hasActiveFilters = search || dateFilter || selectedTags.length > 0;

  const pageBg = hexToRgba(s.page_bg_color, s.page_bg_opacity);
  const headerColor = hexToRgba(s.header_text_color, s.header_text_opacity);
  const headerColorMuted = hexToRgba(s.header_text_color, s.header_text_opacity * 0.7);
  const headerBorder = hexToRgba(s.header_text_color, s.header_text_opacity * 0.2);
  const searchBg = hexToRgba(s.search_bg_color, s.search_bg_opacity);
  const searchBorder = hexToRgba(s.search_text_color, s.search_text_opacity * 0.2);
  const searchText = hexToRgba(s.search_text_color, s.search_text_opacity);
  const searchPlaceholder = hexToRgba(s.search_text_color, s.search_text_opacity * 0.4);
  const accent = hexToRgba(s.filter_accent_color, s.filter_accent_opacity);
  const accentSoft = hexToRgba(s.filter_accent_color, s.filter_accent_opacity * 0.2);
  const accentBorder = hexToRgba(s.filter_accent_color, s.filter_accent_opacity * 0.3);
  const loadMore = hexToRgba(s.load_more_text_color, s.load_more_text_opacity);
  const loadMoreMuted = hexToRgba(s.load_more_text_color, s.load_more_text_opacity * 0.7);

  return (
    <div className="min-h-screen" style={{ background: pageBg }}>
      <header
        className="px-4 py-3 md:px-6 md:py-4 flex items-center justify-between border-b"
        style={{ borderColor: headerBorder }}
      >
        <Link to="/blog" className="text-xl font-bold" style={{ color: headerColor }}>Blog</Link>
        <a href={s.homepage_url} className="text-sm hover:opacity-100 transition-opacity" style={{ color: headerColorMuted }}>
          Voltar para a página inicial
        </a>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: searchPlaceholder }} />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Procurar posts..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border text-sm focus:outline-none transition-colors blog-search-input"
              style={{
                background: searchBg,
                borderColor: searchBorder,
                color: searchText,
                ['--ph-color' as any]: searchPlaceholder,
              }}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearch}
            className="hidden md:inline-flex rounded-full px-4 hover:bg-white/10"
            style={{ color: loadMore }}
          >
            Buscar
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/10"
                style={{
                  color: loadMore,
                  background: hasActiveFilters ? accentSoft : "transparent",
                }}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end" style={{ background: pageBg, borderColor: accentBorder, color: loadMore }}>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: loadMoreMuted }}>Período</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { value: "week", label: "Última semana" },
                      { value: "month", label: "Último mês" },
                      { value: "year", label: "Último ano" },
                    ].map(opt => {
                      const active = dateFilter === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => { setPage(0); setDateFilter(active ? "" : opt.value); }}
                          className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                          style={{
                            background: active ? accent : "transparent",
                            color: active ? pageBg : loadMoreMuted,
                            borderColor: active ? accent : accentBorder,
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {allTags.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: loadMoreMuted }}>Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {allTags.map(tag => {
                        const active = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                            style={{
                              background: active ? accent : "transparent",
                              color: active ? pageBg : loadMoreMuted,
                              borderColor: active ? accent : accentBorder,
                            }}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs underline" style={{ color: loadMoreMuted }}>
                    Limpar filtros
                  </button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {search && (
              <Badge className="border-0 gap-1" style={{ background: accentSoft, color: loadMore }}>
                "{search}"
                <button onClick={() => { setSearch(""); setSearchInput(""); setPage(0); }}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {dateFilter && (
              <Badge className="border-0 gap-1" style={{ background: accentSoft, color: loadMore }}>
                {dateFilter === "week" ? "Última semana" : dateFilter === "month" ? "Último mês" : "Último ano"}
                <button onClick={() => { setDateFilter(""); setPage(0); }}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedTags.map(tag => (
              <Badge key={tag} className="border-0 gap-1" style={{ background: accentSoft, color: loadMore }}>
                {tag}
                <button onClick={() => toggleTag(tag)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} settings={s} />
          ))}
        </div>
        {posts.length === 0 && (
          <p className="text-center py-12" style={{ color: loadMoreMuted }}>Nenhum post encontrado.</p>
        )}
        {(page > 0 || hasMore) && (
          <div className="flex justify-center gap-4 mt-8">
            {page > 0 && <button onClick={() => setPage(p => p - 1)} className="text-sm hover:underline" style={{ color: loadMore }}>← Anterior</button>}
            {hasMore && <button onClick={() => setPage(p => p + 1)} className="text-sm hover:underline" style={{ color: loadMore }}>Próxima →</button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
