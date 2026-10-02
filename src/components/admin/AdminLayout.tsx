import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useAuth, useRole } from "@/contexts/AuthContext";
import { useAllowedSections, type SectionId } from "@/hooks/useAllowedSections";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/admin/ThemeToggle";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  User,
  Building2,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const allNavItems: Array<{ id: SectionId; label: string; icon: any; path: string; end?: boolean }> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin", end: true },
  { id: "posts", label: "Posts", icon: FileText, path: "/admin/posts" },
  { id: "cartorios", label: "Cartórios", icon: Building2, path: "/admin/cartorios", end: true },
  { id: "cartorios_config", label: "Config. Cartórios", icon: Palette, path: "/admin/cartorios/configuracoes" },
  { id: "usuarios", label: "Usuários", icon: Users, path: "/admin/usuarios" },
  { id: "configuracoes", label: "Configurações", icon: Settings, path: "/admin/configuracoes" },
  { id: "perfil", label: "Meu Perfil", icon: User, path: "/admin/perfil" },
];

const titleByPath: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/posts": "Posts",
  "/admin/cartorios": "Cartórios",
  "/admin/cartorios/configuracoes": "Configurações dos Cartórios",
  "/admin/usuarios": "Usuários",
  "/admin/configuracoes": "Configurações",
  "/admin/perfil": "Meu Perfil",
};

const AdminLayoutInner = () => {
  const { signOut, user } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => data && setProfile(data));
  }, [user]);

  const { canAccess } = useAllowedSections();
  const navItems = allNavItems.filter((item) => canAccess(item.id));
  const pageTitle = titleByPath[location.pathname] || "Painel";
  const initials = (profile?.full_name || user?.email || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-60 flex flex-col bg-surface border-r border-border">
        <div className="px-6 py-5 border-b border-border">
          <h1 className="text-base font-medium tracking-tight">Blog CMS</h1>
          <p className="text-[11px] mt-0.5 text-muted-foreground uppercase tracking-wider">
            {role === "superadmin" ? "Superadmin" : (role as string) === "admin" ? "Admin" : "Editor"}
          </p>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-surface-2 text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-2/60"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary" />
                  )}
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-2 border-t border-border">
          <button
            onClick={async () => {
              await signOut();
              navigate("/login");
            }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-surface-2/60 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 shrink-0 px-6 border-b border-border flex items-center justify-between bg-background">
          <h2 className="text-sm font-medium text-foreground">{pageTitle}</h2>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
                <Avatar className="h-8 w-8 border border-border">
                  {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
                  <AvatarFallback className="text-xs bg-surface-2 text-foreground">{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium truncate">{profile?.full_name || "Usuário"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/admin/perfil")}>
                  <User className="h-4 w-4" /> Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    navigate("/login");
                  }}
                >
                  <LogOut className="h-4 w-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-background">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const AdminLayout = () => (
  <ThemeProvider>
    <AdminLayoutInner />
  </ThemeProvider>
);

export default AdminLayout;
