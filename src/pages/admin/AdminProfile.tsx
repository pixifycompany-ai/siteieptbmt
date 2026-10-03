import { useEffect, useState } from "react";
import { extensionFor, imageToWebp } from "@/lib/imageToWebp";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useRole } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Camera, Copy, Check } from "lucide-react";
import { ThemeToggle } from "@/components/admin/ThemeToggle";

const AdminProfile = () => {
  const { user } = useAuth();
  const role = useRole();
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCart, setCopiedCart] = useState(false);

  const widgetUrl = `${window.location.origin}/widget`;
  const cartoriosWidgetUrl = `${window.location.origin}/cartorios/widget`;

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, job_title, avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name || "");
          setJobTitle((data as any).job_title || "");
          setAvatarUrl(data.avatar_url || null);
        }
      });
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const original = e.target.files?.[0];
    if (!original || !user) return;
    setUploading(true);
    const file = await imageToWebp(original, { maxSize: 512 });
    const path = `${user.id}/avatar.${extensionFor(file)}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      toast.error("Erro ao enviar imagem");
      setUploading(false);
      return;
    }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(pub.publicUrl + "?t=" + Date.now());
    setUploading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    if (!fullName.trim()) {
      toast.error("Nome de exibição é obrigatório");
      return;
    }
    setSaving(true);

    let cleanAvatar = avatarUrl;
    if (cleanAvatar) cleanAvatar = cleanAvatar.split("?")[0];

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        avatar_url: cleanAvatar,
      } as any)
      .eq("id", user.id);

    await supabase
      .from("profiles")
      .update({ job_title: jobTitle.trim() || null } as any)
      .eq("id", user.id);

    setSaving(false);
    if (error) toast.error("Erro ao salvar");
    else toast.success("Perfil atualizado!");
  };

  const handleCopyWidget = () => {
    navigator.clipboard.writeText(widgetUrl);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCartorios = () => {
    navigator.clipboard.writeText(cartoriosWidgetUrl);
    setCopiedCart(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopiedCart(false), 2000);
  };

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl">
      <div>
        <h2 className="text-[22px] font-medium tracking-tight">Meu Perfil</h2>
        <p className="text-sm text-muted-foreground mt-1">Atualize suas informações pessoais</p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="border-b border-border py-4">
          <CardTitle className="text-sm font-medium">Identidade</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <Avatar className="h-20 w-20 border border-border">
                {avatarUrl && <AvatarImage src={avatarUrl} />}
                <AvatarFallback className="text-lg bg-surface-2 text-foreground">{initials || "?"}</AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center bg-foreground/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Camera className="h-5 w-5 text-background" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            </div>
            <div className="text-sm text-muted-foreground">Clique para alterar o avatar</div>
          </div>

          <div className="space-y-2">
            <Label>Nome de exibição *</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Cargo / Profissão</Label>
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Ex: Jornalista, Editor" />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar perfil"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="border-b border-border py-4">
          <CardTitle className="text-sm font-medium">Aparência do painel</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Tema</p>
            <p className="text-xs text-muted-foreground mt-1">Claro, escuro ou siga o sistema</p>
          </div>
          <ThemeToggle />
        </CardContent>
      </Card>

      {role === "superadmin" && (
        <>
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border py-4">
              <CardTitle className="text-sm font-medium">Widget — Blog</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <p className="text-sm text-muted-foreground">
                Use este link para incorporar os posts do blog via iframe no seu site externo.
              </p>
              <div className="flex items-center gap-2">
                <Input readOnly value={widgetUrl} className="text-sm flex-1" />
                <Button variant="outline" size="icon" onClick={handleCopyWidget} className="shrink-0">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="p-3 rounded-lg bg-surface border border-border">
                <p className="text-xs text-muted-foreground mb-1.5">Código para embed:</p>
                <code className="text-xs text-foreground break-all">
                  {`<iframe src="${widgetUrl}" width="100%" height="800" frameborder="0"></iframe>`}
                </code>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border py-4">
              <CardTitle className="text-sm font-medium">Widget — Cartórios</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <p className="text-sm text-muted-foreground">
                Use este link para incorporar a listagem de cartórios via iframe no seu site externo.
              </p>
              <div className="flex items-center gap-2">
                <Input readOnly value={cartoriosWidgetUrl} className="text-sm flex-1" />
                <Button variant="outline" size="icon" onClick={handleCopyCartorios} className="shrink-0">
                  {copiedCart ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="p-3 rounded-lg bg-surface border border-border">
                <p className="text-xs text-muted-foreground mb-1.5">Código para embed:</p>
                <code className="text-xs text-foreground break-all">
                  {`<iframe src="${cartoriosWidgetUrl}" width="100%" height="900" frameborder="0"></iframe>`}
                </code>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminProfile;
