import { Navigate } from "react-router-dom";
import { useAuth, useRole } from "@/contexts/AuthContext";
import { useAllowedSections, type SectionId } from "@/hooks/useAllowedSections";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "superadmin" | "colaborador";
  requiredSection?: SectionId;
}

const ProtectedRoute = ({ children, requiredRole, requiredSection }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const role = useRole();
  const { canAccess } = useAllowedSections();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if ((profile as any)?.must_change_password) {
    return <Navigate to="/alterar-senha" replace />;
  }

  if (requiredRole === "superadmin" && role !== "superadmin") {
    return <Navigate to="/admin" replace />;
  }

  if (requiredSection && !canAccess(requiredSection)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
