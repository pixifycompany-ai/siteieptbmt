import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useRole } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/slugify";
import { ThemeProvider } from "@/contexts/ThemeContext";
import TiptapEditor from "@/components/editor/TiptapEditor";
import CoverUpload from "@/components/editor/CoverUpload";
import PdfAttachments, { type Attachment } from "@/components/editor/PdfAttachments";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ArrowLeft, Clock, Sparkles, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const PostEditorInner = () => {
  const { id } = useParams();
  const isNew = !id || id === "novo";
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = useRole();
  const isSuperadmin = role === "superadmin";
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [status, setStatus] = useState("draft");
  const [source, setSource] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [scheduledHour, setScheduledHour] = useState("12");
  const [scheduledMinute, setScheduledMinute] = useState("00");
  const [saving, setSaving] = useState(false);
  const [slugManual, setSlugManual] = useState(false);
  const [generatingExcerpt, setGeneratingExcerpt] = useState(false);
  const [displayAuthorId, setDisplayAuthorId] = useState<string>("");
  const [profiles, setProfiles] = useState<Array<{ id: string; full_name: string | null }>>([]);

  useEffect(() => {
    if (isSuperadmin) {
      supabase
        .from("profiles")
        .select("id, full_name")
        .order("full_name", { ascending: true })
        .then(({ data }) => setProfiles(data || []));
    }
  }, [isSuperadmin]);

  useEffect(() => {
    if (!isNew && id) {
      supabase.from("posts").select("*").eq("id", id).single().then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setSlug(data.slug);
          setExcerpt(data.excerpt || "");
          setContent(data.content || "");
          setCoverImage(data.cover_image || "");
          setAttachments((((data as any).attachments as Attachment[]) || []));
          setStatus(data.status);
          setSource((data as any).source || "");
          setTags((data as any).tags || []);
          setDisplayAuthorId((data as any).display_author_id || data.author_id || "");
          if (data.published_at) {
            const d = new Date(data.published_at);
            setScheduledDate(d);
            setScheduledHour(String(d.getHours()).padStart(2, "0"));
            setScheduledMinute(String(d.getMinutes()).padStart(2, "0"));
          }
          setSlugManual(true);
        }
      });
    }
  }, [id, isNew]);

  useEffect(() => {
    if (!slugManual) setSlug(slugify(title));
  }, [title, slugManual]);

  const getScheduledDateTime = (): Date | null => {
    if (!scheduledDate) return null;
    const d = new Date(scheduledDate);
    d.setHours(parseInt(scheduledHour), parseInt(scheduledMinute), 0, 0);
    return d;
  };

  const isScheduledInFuture = (): boolean => {
    const dt = getScheduledDateTime();
    if (!dt) return false;
    return dt.getTime() > Date.now();
  };

  const addTag = (value: string) => {
    const tag = value.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const generateExcerpt = async () => {
    if (!content.trim()) {
      toast({ title: "Escreva o conteúdo antes de gerar o resumo", variant: "destructive" });
      return;
    }
    setGeneratingExcerpt(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-excerpt", {
        body: { content },
      });
      if (error) throw error;
      if (data?.excerpt) {
        setExcerpt(data.excerpt);
        toast({ title: "Resumo gerado com sucesso!" });
      } else {
        toast({ title: "Não foi possível gerar o resumo", variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Erro ao gerar resumo", description: e.message, variant: "destructive" });
    } finally {
      setGeneratingExcerpt(false);
    }
  };

  const save = async (newStatus: string) => {
    if (!user || !title.trim() || !slug.trim()) {
      toast({ title: "Preencha o título", variant: "destructive" });
      return;
    }

    if (newStatus === "scheduled") {
      if (!isScheduledInFuture()) {
        toast({ title: "Selecione uma data/hora futura para agendar", variant: "destructive" });
        return;
      }
    }

    setSaving(true);

    let publishedAt: string | null = null;
    if (newStatus === "published") {
      const scheduled = getScheduledDateTime();
      publishedAt = scheduled ? scheduled.toISOString() : new Date().toISOString();
    } else if (newStatus === "scheduled") {
      publishedAt = getScheduledDateTime()!.toISOString();
    }

    const postData: any = {
      title,
      slug,
      excerpt,
      content,
      cover_image: coverImage,
      status: newStatus,
      published_at: publishedAt,
      source: source || null,
      tags,
      attachments,
    };
    if (isSuperadmin) {
      postData.display_author_id = displayAuthorId || null;
    }

    let error;
    if (isNew) {
      postData.author_id = user.id;
      if (isSuperadmin && !postData.display_author_id) {
        postData.display_author_id = user.id;
      }
      ({ error } = await supabase.from("posts").insert(postData));
    } else {
      ({ error } = await supabase.from("posts").update(postData).eq("id", id));
    }

    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      const msgs: Record<string, string> = {
        draft: "Rascunho salvo",
        published: "Post publicado!",
        scheduled: `Post agendado para ${format(getScheduledDateTime()!, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
      };
      toast({ title: msgs[newStatus] || "Salvo" });
      navigate("/admin/posts");
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-14 border-b border-border px-6 flex items-center gap-4 bg-background sticky top-0 z-10">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/posts")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
        <h1 className="text-sm font-medium">
          {isNew ? "Novo Post" : "Editar Post"}
        </h1>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Editor - 70% */}
        <div className="flex-1 lg:w-[70%] p-6 space-y-6">
          <div>
            <Input
              value={title}
              onChange={e => { setTitle(e.target.value); if (!slugManual) setSlug(slugify(e.target.value)); }}
              placeholder="Título do post"
              className="text-3xl font-medium border-0 px-0 bg-transparent focus-visible:ring-0 h-auto py-2 placeholder:text-muted-foreground/60"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Slug</Label>
            <Input
              value={slug}
              onChange={e => { setSlug(e.target.value); setSlugManual(true); }}
              className="text-sm mt-1"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-xs text-muted-foreground">Resumo ({excerpt.length}/200)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateExcerpt}
                disabled={generatingExcerpt || !content.trim()}
                className="h-7 text-xs gap-1"
              >
                {generatingExcerpt ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                Criar resumo com IA
              </Button>
            </div>
            <Textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value.slice(0, 200))}
              placeholder="Breve resumo do post..."
              className="resize-none bg-surface-2 border-border"
              rows={3}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Conteúdo</Label>
            <TiptapEditor content={content} onChange={setContent} />
          </div>
          <PdfAttachments attachments={attachments} onChange={setAttachments} />
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Fonte (opcional)</Label>
            <Input
              value={source}
              onChange={e => setSource(e.target.value)}
              placeholder="Ex: https://exemplo.com ou Nome da Fonte"
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Informe um link ou o nome da fonte. Se for uma URL, será exibida como hiperlink no post.
            </p>
          </div>
        </div>

        {/* Sidebar - 30% */}
        <div className="lg:w-[30%] border-l border-border bg-surface p-6 space-y-6">
          <CoverUpload coverImage={coverImage} onCoverChange={setCoverImage} />

          <div>
            <Label className="text-xs text-muted-foreground">Status</Label>
            <p className="mt-1.5">
              <Badge variant={status === "draft" ? "draft" : status === "published" ? "published" : "scheduled"}>
                {status === "draft" ? "Rascunho" : status === "published" ? "Publicado" : "Agendado"}
              </Badge>
            </p>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-xs text-muted-foreground">Tags</Label>
            <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1 text-xs">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-0.5 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => tagInput.trim() && addTag(tagInput)}
              placeholder="Digite e pressione Enter"
              className="text-sm"
            />
          </div>

          {isSuperadmin && (
            <div>
              <Label className="text-xs text-muted-foreground">Autor exibido no post</Label>
              <Select value={displayAuthorId} onValueChange={setDisplayAuthorId}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecionar autor" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.full_name || "(sem nome)"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Define quem aparece como autor na página pública do post.
              </p>
            </div>
          )}

          <div>
            <Label className="text-xs text-muted-foreground">Agendar publicação</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left mt-1.5 font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} locale={ptBR} className="pointer-events-auto" />
              </PopoverContent>
            </Popover>

            {scheduledDate && (
              <div className="flex items-center gap-2 mt-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Select value={scheduledHour} onValueChange={setScheduledHour}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map(h => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground font-medium">:</span>
                <Select value={scheduledMinute} onValueChange={setScheduledMinute}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <Button className="w-full" variant="outline" onClick={() => save("draft")} disabled={saving}>
              Salvar rascunho
            </Button>
            <Button className="w-full" onClick={() => save("published")} disabled={saving}>
              {status === "published" ? "Salvar alterações" : "Publicar"}
            </Button>
            {scheduledDate && isScheduledInFuture() && (
              <Button className="w-full" variant="secondary" onClick={() => save("scheduled")} disabled={saving}>
                <Clock className="h-4 w-4 mr-2" />
                Programar publicação
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PostEditor = () => (
  <ThemeProvider>
    <PostEditorInner />
  </ThemeProvider>
);

export default PostEditor;
