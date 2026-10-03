import { useEffect, useState } from "react";
import { extensionFor, imageToWebp } from "@/lib/imageToWebp";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UserPlus, Pencil, Trash2, KeyRound } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, useRole } from "@/contexts/AuthContext";

const SECTION_OPTIONS: { id: string; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "posts", label: "Posts" },
  { id: "cartorios", label: "Cartórios" },
  { id: "cartorios_config", label: "Config. Cartórios" },
  { id: "usuarios", label: "Usuários" },
  { id: "configuracoes", label: "Configurações" },
  { id: "perfil", label: "Meu Perfil" },
];

const AdminUsers = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [createEmail, setCreateEmail] = useState("");
  const [createName, setCreateName] = useState("");
  const [createRole, setCreateRole] = useState("colaborador");
  const [createPwd, setCreatePwd] = useState("");
  const [createPwdConfirm, setCreatePwdConfirm] = useState("");
  const [createSections, setCreateSections] = useState<string[]>(["dashboard", "posts", "perfil"]);
  const [creating, setCreating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editJobTitle, setEditJobTitle] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState("");
  const [editAllowedSections, setEditAllowedSections] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Password dialog
  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwdValue, setPwdValue] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");
  const [pwdRequireChange, setPwdRequireChange] = useState(true);
  const [pwdSaving, setPwdSaving] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  const callerRole = useRole() as string | null;

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const list = data || [];
    setProfiles(callerRole === "admin" ? list.filter((p: any) => p.role !== "superadmin") : list);
  };

  useEffect(() => {
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callerRole]);

  const openEdit = (profile: any) => {
    setSelectedUser(profile);
    setEditName(profile.full_name || "");
    setEditJobTitle(profile.job_title || "");
    setEditRole(profile.role);
    setEditAvatarPreview(profile.avatar_url || "");
    setEditAvatarFile(null);
    setEditAllowedSections(profile.allowed_sections || []);
    setEditOpen(true);
  };

  const openDelete = (profile: any) => {
    setSelectedUser(profile);
    setDeleteOpen(true);
  };

  const openPwd = (profile: any) => {
    setSelectedUser(profile);
    setPwdValue("");
    setPwdConfirm("");
    setPwdRequireChange(true);
    setPwdOpen(true);
  };

  const toggleSection = (id: string, checked: boolean) => {
    setEditAllowedSections((prev) =>
      checked ? [...prev, id] : prev.filter((s) => s !== id)
    );
  };

  const savePassword = async () => {
    if (!selectedUser) return;
    if (pwdValue.length < 6) {
      toast({ title: "Senha muito curta", description: "Mínimo 6 caracteres.", variant: "destructive" });
      return;
    }
    if (pwdValue !== pwdConfirm) {
      toast({ title: "Senhas não conferem", variant: "destructive" });
      return;
    }
    setPwdSaving(true);
    const res = await supabase.functions.invoke("set-user-password", {
      body: { user_id: selectedUser.id, new_password: pwdValue, require_change: pwdRequireChange },
    });
    setPwdSaving(false);
    if (res.error) {
      toast({ title: "Erro", description: res.error.message, variant: "destructive" });
    } else {
      toast({ title: "Senha definida com sucesso!" });
      setPwdOpen(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditAvatarFile(file);
      setEditAvatarPreview(URL.createObjectURL(file));
    }
  };

  const saveEdit = async () => {
    if (!selectedUser) return;
    setSaving(true);

    let avatarUrl = selectedUser.avatar_url;

    if (editAvatarFile) {
      const file = await imageToWebp(editAvatarFile, { maxSize: 512 });
      const path = `${selectedUser.id}.${extensionFor(file)}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) {
        toast({ title: "Erro no upload", description: uploadError.message, variant: "destructive" });
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: editName || null,
        job_title: editJobTitle || null,
        role: editRole,
        avatar_url: avatarUrl,
        allowed_sections: editRole === "superadmin" ? [] : editAllowedSections,
      } as any)
      .eq("id", selectedUser.id);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Perfil atualizado!" });
      setEditOpen(false);
      fetchProfiles();
    }
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setDeleting(true);

    const res = await supabase.functions.invoke("delete-user", {
      body: { user_id: selectedUser.id },
    });

    if (res.error) {
      toast({ title: "Erro ao excluir", description: res.error.message, variant: "destructive" });
    } else {
      toast({ title: "Usuário excluído!" });
      setDeleteOpen(false);
      fetchProfiles();
    }
    setDeleting(false);
  };

  const toggleCreateSection = (id: string, checked: boolean) => {
    setCreateSections((prev) => (checked ? [...prev, id] : prev.filter((s) => s !== id)));
  };

  const createUser = async () => {
    if (!/^\S+@\S+\.\S+$/.test(createEmail)) {
      toast({ title: "Email inválido", variant: "destructive" });
      return;
    }
    if (createPwd.length < 6) {
      toast({ title: "Senha muito curta", description: "Mínimo 6 caracteres.", variant: "destructive" });
      return;
    }
    if (createPwd !== createPwdConfirm) {
      toast({ title: "Senhas não conferem", variant: "destructive" });
      return;
    }
    setCreating(true);
    const res = await supabase.functions.invoke("create-user", {
      body: {
        email: createEmail,
        password: createPwd,
        full_name: createName,
        role: createRole,
        allowed_sections: createRole === "colaborador" ? createSections : [],
      },
    });
    setCreating(false);
    if (res.error) {
      toast({ title: "Erro ao criar usuário", description: res.error.message, variant: "destructive" });
    } else {
      toast({ title: "Usuário criado!", description: "O usuário precisará trocar a senha no primeiro login." });
      setCreateOpen(false);
      setCreateEmail("");
      setCreateName("");
      setCreatePwd("");
      setCreatePwdConfirm("");
      setCreateRole("colaborador");
      setCreateSections(["dashboard", "posts", "perfil"]);
      fetchProfiles();
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-medium tracking-tight">Usuários</h2>
            <p className="text-sm text-muted-foreground mt-1">Crie e gerencie usuários da plataforma</p>
          </div>
          {(callerRole === "superadmin" || callerRole === "admin") && (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-4 w-4" /> Criar usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Criar usuário</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} placeholder="email@exemplo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome completo</Label>
                    <Input value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="Nome do usuário" />
                  </div>
                  <div className="space-y-2">
                    <Label>Função</Label>
                    <Select value={createRole} onValueChange={setCreateRole}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {callerRole === "superadmin" && <SelectItem value="superadmin">Superadmin</SelectItem>}
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="colaborador">Colaborador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Senha de primeiro acesso</Label>
                      <Input type="password" value={createPwd} onChange={(e) => setCreatePwd(e.target.value)} placeholder="Mínimo 6 caracteres" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirmar senha</Label>
                      <Input type="password" value={createPwdConfirm} onChange={(e) => setCreatePwdConfirm(e.target.value)} />
                    </div>
                  </div>
                  {createRole === "colaborador" && (
                    <div className="space-y-2">
                      <Label>Acesso ao painel</Label>
                      <div className="grid grid-cols-2 gap-2 rounded-md border border-border p-3">
                        {SECTION_OPTIONS.map((opt) => (
                          <label key={opt.id} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={createSections.includes(opt.id)}
                              onCheckedChange={(c) => toggleCreateSection(opt.id, !!c)}
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    O usuário será obrigado a trocar a senha no primeiro login.
                  </p>
                  <Button onClick={createUser} disabled={creating} className="w-full">
                    {creating ? "Criando..." : "Criar usuário"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-12"></TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Nome</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Cargo</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Função</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Criado em</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((p) => (
                <TableRow key={p.id} className="border-border hover:bg-surface-2/60 transition-colors">
                  <TableCell>
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src={p.avatar_url || undefined} />
                      <AvatarFallback className="text-[11px] bg-surface-2">{getInitials(p.full_name)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{p.full_name || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{p.job_title || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={p.role === "superadmin" ? "published" : "outline"}>{p.role}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(p.created_at), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => openEdit(p)} className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar</TooltipContent>
                      </Tooltip>
                      {!(callerRole === "admin" && p.role === "superadmin") && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" onClick={() => openPwd(p)} className="h-8 w-8">
                              <KeyRound className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Definir senha</TooltipContent>
                        </Tooltip>
                      )}
                      {p.id !== user?.id && callerRole === "superadmin" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openDelete(p)}
                              className="h-8 w-8 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Excluir</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border border-border">
                  <AvatarImage src={editAvatarPreview || undefined} />
                  <AvatarFallback className="bg-surface-2">{getInitials(editName)}</AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="avatar-upload" className="cursor-pointer text-sm text-primary hover:underline">
                    Alterar avatar
                  </Label>
                  <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nome de exibição</Label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Cargo / Profissão</Label>
                <Input value={editJobTitle} onChange={(e) => setEditJobTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Função</Label>
                <Select value={editRole} onValueChange={setEditRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {callerRole === "superadmin" && <SelectItem value="superadmin">Superadmin</SelectItem>}
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="colaborador">Colaborador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Acesso ao painel</Label>
                {editRole === "superadmin" ? (
                  <p className="text-xs text-muted-foreground">Superadmin tem acesso total a todas as seções.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 rounded-md border border-border p-3">
                    {SECTION_OPTIONS.map((opt) => (
                      <label key={opt.id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={editAllowedSections.includes(opt.id)}
                          onCheckedChange={(c) => toggleSection(opt.id, !!c)}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={saveEdit} disabled={saving} className="w-full">
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Password Dialog */}
        <Dialog open={pwdOpen} onOpenChange={setPwdOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Definir senha {selectedUser?.full_name ? `de ${selectedUser.full_name}` : ""}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nova senha</Label>
                <Input
                  type="password"
                  value={pwdValue}
                  onChange={(e) => setPwdValue(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="space-y-2">
                <Label>Confirmar senha</Label>
                <Input
                  type="password"
                  value={pwdConfirm}
                  onChange={(e) => setPwdConfirm(e.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={pwdRequireChange}
                  onCheckedChange={(c) => setPwdRequireChange(!!c)}
                />
                Exigir troca no próximo login
              </label>
              <Button onClick={savePassword} disabled={pwdSaving} className="w-full">
                {pwdSaving ? "Salvando..." : "Salvar senha"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir <strong>{selectedUser?.full_name || "este usuário"}</strong>? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Excluindo..." : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};

export default AdminUsers;
