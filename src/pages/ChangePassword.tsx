import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useRole } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, refreshProfile } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({ title: "Senha muito curta", description: "Mínimo de 6 caracteres.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Senhas não conferem", description: "Digite a mesma senha nos dois campos.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    const { error: authError } = await supabase.auth.updateUser({ password });
    if (authError) {
      toast({ title: "Erro", description: authError.message, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ must_change_password: false } as any)
      .eq("id", user!.id);

    if (profileError) {
      toast({ title: "Erro", description: profileError.message, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    await refreshProfile();

    toast({ title: "Senha alterada com sucesso!" });
    navigate("/admin", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-xl font-medium tracking-tight">Alterar Senha</CardTitle>
          <p className="text-sm text-muted-foreground">
            Por segurança, defina uma nova senha antes de continuar.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar nova senha</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Definir nova senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
