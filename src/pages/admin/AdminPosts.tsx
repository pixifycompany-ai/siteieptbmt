import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Search, Plus, Eye, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const AdminPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const role = useRole();
  const isSuperadmin = role === "superadmin";

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*, profiles(full_name)")
      .order("published_at", { ascending: false, nullsFirst: false });
    setPosts(data || []);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const togglePublish = async (post: any) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    await supabase
      .from("posts")
      .update({
        status: newStatus,
        published_at: newStatus === "published" ? new Date().toISOString() : null,
      })
      .eq("id", post.id);
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else fetchPosts();
  };

  const filtered = posts
    .filter((p) => filter === "all" || p.status === filter)
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  const tabs = [
    { key: "all", label: "Todos" },
    { key: "published", label: "Publicados" },
    { key: "scheduled", label: "Agendados" },
    { key: "draft", label: "Rascunhos" },
  ];

  const statusVariant = (s: string): "published" | "scheduled" | "draft" =>
    s === "published" ? "published" : s === "scheduled" ? "scheduled" : "draft";
  const statusLabel = (s: string) =>
    s === "draft" ? "Rascunho" : s === "published" ? "Publicado" : "Agendado";

  return (
    <TooltipProvider delayDuration={200}>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-medium tracking-tight">Posts</h2>
            <p className="text-sm text-muted-foreground mt-1">Gerencie todos os posts do blog</p>
          </div>
          <Button onClick={() => navigate("/editor/novo")} size="sm">
            <Plus className="h-4 w-4" /> Novo Post
          </Button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-surface p-0.5">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs transition-colors",
                  filter === t.key
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-20 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Capa</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Título</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Autor</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Data</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow className="border-border">
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    Nenhum post encontrado
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((post) => (
                <TableRow key={post.id} className="border-border hover:bg-surface-2/60 transition-colors group">
                  <TableCell>
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        className="h-9 w-14 object-cover rounded-md border border-border"
                        alt=""
                      />
                    ) : (
                      <div className="h-9 w-14 rounded-md border border-border bg-surface-2" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-foreground max-w-md truncate">{post.title}</TableCell>
                  <TableCell className="text-muted-foreground">{post.profiles?.full_name || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(post.status)}>{statusLabel(post.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {post.published_at ? format(new Date(post.published_at), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-0.5">
                      {post.status === "published" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" asChild className="h-8 w-8">
                              <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver no blog</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => navigate(`/editor/${post.id}`)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar</TooltipContent>
                      </Tooltip>
                      <DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent>Mais ações</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => togglePublish(post)}>
                            {post.status === "published" ? "Despublicar" : "Publicar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deletePost(post.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdminPosts;
