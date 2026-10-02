import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type Attachment = { name: string; url: string; path: string; size: number };

interface Props {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
}

const MAX_FILES = 5;
const MAX_SIZE = 10 * 1024 * 1024;

const sanitize = (name: string) =>
  name
    .replace(/\.pdf$/i, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/(^-|-$)+/g, "") || "arquivo";

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const PdfAttachments = ({ attachments, onChange }: Props) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFiles = async (fileList: FileList) => {
    let files = Array.from(fileList);

    const invalid = files.filter(
      f => f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")
    );
    if (invalid.length) {
      toast({ title: "Apenas arquivos PDF são aceitos", variant: "destructive" });
      files = files.filter(f => !invalid.includes(f));
    }

    const tooBig = files.filter(f => f.size > MAX_SIZE);
    if (tooBig.length) {
      toast({
        title: "Arquivo muito grande",
        description: `Tamanho máximo: 10 MB por arquivo (${tooBig.map(f => f.name).join(", ")})`,
        variant: "destructive",
      });
      files = files.filter(f => !tooBig.includes(f));
    }

    const remaining = MAX_FILES - attachments.length;
    if (files.length > remaining) {
      toast({
        title: `Máximo de ${MAX_FILES} anexos por post`,
        description: `Apenas ${remaining > 0 ? remaining : 0} arquivo(s) foi(ram) enviado(s).`,
        variant: "destructive",
      });
      files = files.slice(0, Math.max(0, remaining));
    }

    if (!files.length) return;

    setUploading(true);
    const uploaded: Attachment[] = [];
    for (const file of files) {
      const path = `${Date.now()}-${sanitize(file.name)}.pdf`;
      const { error } = await supabase.storage
        .from("blog-attachments")
        .upload(path, file, { contentType: "application/pdf" });
      if (error) {
        toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
        continue;
      }
      const { data: signed } = await supabase.storage
        .from("blog-attachments")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      const url =
        signed?.signedUrl ||
        supabase.storage.from("blog-attachments").getPublicUrl(path).data.publicUrl;
      uploaded.push({ name: file.name, url, path, size: file.size });
    }
    setUploading(false);
    if (uploaded.length) onChange([...attachments, ...uploaded]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const remove = async (item: Attachment) => {
    onChange(attachments.filter(a => a.path !== item.path));
    try {
      await supabase.storage.from("blog-attachments").remove([item.path]);
    } catch {
      /* ignora erro de remoção */
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <Label className="text-xs text-muted-foreground">
        Anexos PDF ({attachments.length}/{MAX_FILES})
      </Label>

      {attachments.length > 0 && (
        <ul className="mt-2 space-y-2">
          {attachments.map(a => (
            <li
              key={a.path}
              className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2"
            >
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate text-sm">{a.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{formatSize(a.size)}</span>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs underline text-muted-foreground hover:text-foreground"
              >
                abrir
              </a>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 shrink-0"
                onClick={() => remove(a)}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {attachments.length < MAX_FILES && (
        <div
          className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {uploading ? "Enviando..." : "Arraste ou clique para enviar PDFs (até 10 MB cada)"}
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={e => e.target.files?.length && handleFiles(e.target.files)}
          />
        </div>
      )}
    </div>
  );
};

export default PdfAttachments;
