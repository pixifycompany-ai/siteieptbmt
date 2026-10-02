import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useRole } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Clock, FileEdit, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ published: 0, scheduled: 0, drafts: 0, collaborators: 0 });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const role = useRole();
  const isSuperadmin = role === "superadmin";

  const fetchData = async () => {
    let query = supabase.from("posts").select("*").order("created_at", { ascending: false });
    if (!isSuperadmin && user) {
      query = query.eq("author_id", user.id);
    }
    const { data: posts } = await query;
    const { data: profiles } = isSuperadmin
      ? await supabase.from("profiles").select("*")
      : { data: [] };

    if (posts) {
      setStats({
        published: posts.filter((p) => p.status === "published").length,
        scheduled: posts.filter((p) => p.status === "scheduled").length,
        drafts: posts.filter((p) => p.status === "draft").length,
        collaborators: profiles?.filter((p) => p.role === "colaborador").length || 0,
      });
      setRecentPosts(posts.slice(0, 5));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const togglePublish = async (post: any) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("posts")
      .update({
        status: newStatus,
        published_at: newStatus === "published" ? new Date().toISOString() : null,
      })
      .eq("id", post.id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else fetchData();
  };

  const kpis = [
    { label: "Publicados", value: stats.published, icon: FileText },
    { label: "Agendados", value: stats.scheduled, icon: Clock },
    { label: "Rascunhos", value: stats.drafts, icon: FileEdit },
    ...(isSuperadmin ? [{ label: "Colaboradores", value: stats.collaborators, icon: Users }] : []),
  ];

  const statusVariant = (s: string): "published" | "scheduled" | "draft" =>
    s === "published" ? "published" : s === "scheduled" ? "scheduled" : "draft";

  const statusLabel = (s: string) =>
    s === "draft" ? "Rascunho" : s === "published" ? "Publicado" : "Agendado";

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl">
      <div>
        <h2 className="text-[22px] font-medium tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Visão geral do conteúdo</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-border bg-card hover:bg-surface transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-medium tracking-tight">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="border-b border-border py-4">
          <CardTitle className="text-sm font-medium">Posts recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Título</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Data</TableHead>
                {isSuperadmin && (
                  <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium text-right">
                    Ação
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPosts.length === 0 && (
                <TableRow className="border-border">
                  <TableCell colSpan={isSuperadmin ? 4 : 3} className="text-center text-muted-foreground py-10">
                    Nenhum post ainda
                  </TableCell>
                </TableRow>
              )}
              {recentPosts.map((post) => (
                <TableRow key={post.id} className="border-border hover:bg-surface-2/60 transition-colors">
                  <TableCell className="font-medium text-foreground">{post.title}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(post.status)}>{statusLabel(post.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(post.created_at), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  {isSuperadmin && (
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => togglePublish(post)} className="h-8 text-xs">
                        {post.status === "published" ? "Despublicar" : "Publicar"}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
