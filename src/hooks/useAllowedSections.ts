import { useAuth, useRole } from "@/contexts/AuthContext";

// Default sections every colaborador sees if no specific permissions are set
const DEFAULT_COLABORADOR_SECTIONS = ["dashboard", "posts", "perfil"];

export type SectionId =
  | "dashboard"
  | "posts"
  | "cartorios"
  | "cartorios_config"
  | "usuarios"
  | "configuracoes"
  | "perfil";

export const useAllowedSections = () => {
  const { profile } = useAuth();
  const role = useRole() as string | null;

  const allowed: string[] = (profile as any)?.allowed_sections ?? [];
  const effective = allowed.length > 0 ? allowed : DEFAULT_COLABORADOR_SECTIONS;

  const canAccess = (section: SectionId) => {
    if (role === "superadmin" || role === "admin") return true;
    return effective.includes(section);
  };

  return { canAccess, isSuperadmin: role === "superadmin", isAdmin: role === "admin" };
};
