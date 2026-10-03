import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { extensionFor, imageToWebp } from "@/lib/imageToWebp";

interface Props {
  coverImage: string;
  onCoverChange: (url: string) => void;
}

const CoverUpload = ({ coverImage, onCoverChange }: Props) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const upload = async (original: File) => {
    setUploading(true);
    const file = await imageToWebp(original);
    const name = `${Date.now()}.${extensionFor(file)}`;
    const { error } = await supabase.storage
      .from("blog-covers")
      .upload(name, file, { contentType: file.type, cacheControl: "31536000" });
    if (error) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
    } else {
      const { data } = supabase.storage.from("blog-covers").getPublicUrl(name);
      onCoverChange(data.publicUrl);
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  return (
    <div>
      <Label className="text-xs text-muted-foreground">Imagem de capa</Label>
      {coverImage ? (
        <div className="relative mt-2">
          <img src={coverImage} alt="Capa" className="w-full aspect-video object-cover rounded-lg" />
          <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-6 w-6" onClick={() => onCoverChange("")}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {uploading ? "Enviando..." : "Arraste ou clique para enviar"}
          </p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && upload(e.target.files[0])} />
        </div>
      )}
    </div>
  );
};

export default CoverUpload;
