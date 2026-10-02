import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Cartorio } from "@/components/cartorios/CartorioCard";
import { sortByCity } from "@/lib/sortCartorios";

type Genero = "tabeliao" | "tabelia" | "ambos";

type Form = {
  nome_cartorio: string;
  nome_tabeliao: string;
  tabeliao_genero: Genero;
  localidades: string;
  endereco: string;
  telefones: string[];
  email: string;
  instagram_url: string;
  whatsapp_url: string;
  site_url: string;
};

const empty: Form = {
  nome_cartorio: "",
  nome_tabeliao: "",
  tabeliao_genero: "tabeliao",
  localidades: "",
  endereco: "",
  telefones: [""],
  email: "",
  instagram_url: "",
  whatsapp_url: "",
  site_url: "",
};

const AdminCartorios = () => {
  const [list, setList] = useState<Cartorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Cartorio | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("cartorios")
      .select("*");
    setList(sortByCity((data as Cartorio[]) || []));
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (c: Cartorio) => {
    setEditing(c);
    setForm({
      nome_cartorio: c.nome_cartorio,
      nome_tabeliao: c.nome_tabeliao || "",
      tabeliao_genero: (c.tabeliao_genero as Genero) || "tabeliao",
      localidades: c.localidades || "",
      endereco: c.endereco || "",
      telefones: c.telefones && c.telefones.length > 0 ? c.telefones : [""],
      email: c.email || "",
      instagram_url: c.instagram_url || "",
      whatsapp_url: c.whatsapp_url || "",
      site_url: (c as any).site_url || "",
    });
    setOpen(true);
  };

  const updateTel = (i: number, v: string) => {
    const next = [...form.telefones];
    next[i] = v;
    setForm({ ...form, telefones: next });
  };

  const addTel = () => {
    if (form.telefones.length >= 3) return;
    setForm({ ...form, telefones: [...form.telefones, ""] });
  };

  const removeTel = (i: number) => {
    const next = form.telefones.filter((_, idx) => idx !== i);
    setForm({ ...form, telefones: next.length ? next : [""] });
  };

  const handleSave = async () => {
    if (!form.nome_cartorio.trim()) {
      toast.error("Nome do cartório é obrigatório");
      return;
    }
    setSaving(true);

    const payload = {
      nome_cartorio: form.nome_cartorio.trim(),
      nome_tabeliao: form.nome_tabeliao.trim() || null,
      tabeliao_genero: form.tabeliao_genero,
      localidades: form.localidades.trim() || null,
      endereco: form.endereco.trim() || null,
      telefones: form.telefones.map((t) => t.trim()).filter(Boolean),
      email: form.email.trim() || null,
      instagram_url: form.instagram_url.trim() || null,
      whatsapp_url: form.whatsapp_url.trim() || null,
      site_url: form.site_url.trim() || null,
    };

    let error;
    if (editing) {
      ({ error } = await (supabase as any).from("cartorios").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await (supabase as any).from("cartorios").insert(payload));
    }

    setSaving(false);

    if (error) {
      toast.error("Erro ao salvar: " + error.message);
      return;
    }
    toast.success(editing ? "Cartório atualizado!" : "Cartório criado!");
    setOpen(false);
    fetch();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await (supabase as any).from("cartorios").delete().eq("id", deleteId);
    if (error) toast.error("Erro ao excluir");
    else {
      toast.success("Cartório excluído");
      fetch();
    }
    setDeleteId(null);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-medium tracking-tight">Cartórios</h2>
            <p className="text-sm text-muted-foreground mt-1">Cadastre e gerencie cartórios</p>
          </div>
          <Button onClick={openNew} size="sm">
            <Plus className="h-4 w-4" /> Novo cartório
          </Button>
        </div>

        <Card className="border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Nome do cartório</th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Localidades</th>
                <th className="px-4 py-3 w-32 text-right text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">
                    Nenhum cartório cadastrado
                  </td>
                </tr>
              ) : (
                list.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface-2/60 transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{c.nome_cartorio}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.localidades || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-0.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(c)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 hover:text-destructive"
                              onClick={() => setDeleteId(c.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Excluir</TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>

        {/* Dialog criar/editar */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar cartório" : "Novo cartório"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nome do cartório *</Label>
                <Input value={form.nome_cartorio} onChange={(e) => setForm({ ...form, nome_cartorio: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Nome do tabelião / tabeliã</Label>
                <Input value={form.nome_tabeliao} onChange={(e) => setForm({ ...form, nome_tabeliao: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Como exibir no card</Label>
                <RadioGroup
                  value={form.tabeliao_genero}
                  onValueChange={(v) => setForm({ ...form, tabeliao_genero: v as Genero })}
                  className="flex flex-col gap-2"
                >
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <RadioGroupItem value="tabeliao" id="g-tabeliao" />
                    <span>Tabelião</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <RadioGroupItem value="tabelia" id="g-tabelia" />
                    <span>Tabeliã</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <RadioGroupItem value="ambos" id="g-ambos" />
                    <span>Ambos (Tabeliã/Tabelião)</span>
                  </label>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Localidades que abrange a comarca</Label>
                <Textarea value={form.localidades} onChange={(e) => setForm({ ...form, localidades: e.target.value })} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Textarea value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Telefones (até 3)</Label>
                <div className="space-y-2">
                  {form.telefones.map((t, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={t} onChange={(e) => updateTel(i, e.target.value)} placeholder="(00) 0000-0000" />
                      {form.telefones.length > 1 && (
                        <Button size="icon" variant="ghost" type="button" onClick={() => removeTel(i)} className="shrink-0">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {form.telefones.length < 3 && (
                    <Button size="sm" variant="outline" type="button" onClick={addTel}>
                      <Plus className="h-3 w-3" /> Adicionar telefone
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>URL Instagram</Label>
                <Input
                  value={form.instagram_url}
                  onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>URL WhatsApp</Label>
                <Input
                  value={form.whatsapp_url}
                  onChange={(e) => setForm({ ...form, whatsapp_url: e.target.value })}
                  placeholder="https://wa.me/55..."
                />
              </div>
              <div className="space-y-2">
                <Label>URL Site</Label>
                <Input
                  value={form.site_url}
                  onChange={(e) => setForm({ ...form, site_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmação exclusão */}
        <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir cartório?</AlertDialogTitle>
              <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};

export default AdminCartorios;
