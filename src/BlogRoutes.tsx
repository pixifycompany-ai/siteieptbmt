import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/guards/ProtectedRoute";

// Rotas do blog, CMS e autenticação. Este módulo (com o SDK do Supabase, login, toasts e
// tooltips) só é carregado quando o visitante entra numa dessas rotas — o site fica leve.
const BlogList = lazy(() => import("@/pages/blog/BlogList"));
const BlogPost = lazy(() => import("@/pages/blog/BlogPost"));
const CartoriosList = lazy(() => import("@/pages/cartorios/CartoriosList"));
const Login = lazy(() => import("@/pages/Login"));
const ChangePassword = lazy(() => import("@/pages/ChangePassword"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Widgets (carregados em iframe — devem entrar leves)
const Widget = lazy(() => import("@/pages/Widget"));
const CartoriosWidget = lazy(() => import("@/pages/cartorios/CartoriosWidget"));

// Editor e admin
const EditorDashboard = lazy(() => import("@/pages/editor/EditorDashboard"));
const PostEditor = lazy(() => import("@/pages/editor/PostEditor"));
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminPosts = lazy(() => import("@/pages/admin/AdminPosts"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
const AdminProfile = lazy(() => import("@/pages/admin/AdminProfile"));
const AdminCartorios = lazy(() => import("@/pages/admin/AdminCartorios"));
const AdminCartoriosSettings = lazy(() => import("@/pages/admin/AdminCartoriosSettings"));

const Fallback = () => <div className="min-h-screen" />;

const BlogRoutes = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AuthProvider>
      <Suspense fallback={<Fallback />}>
        <Routes>
          {/* Raiz do subdomínio do blog → lista de posts (como no Lovable) */}
          <Route path="/" element={<Navigate to="/blog" replace />} />

          {/* Blog público */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/widget" element={<Widget />} />
          <Route path="/cartorios" element={<CartoriosList />} />
          <Route path="/cartorios/widget" element={<CartoriosWidget />} />
          <Route path="/login" element={<Login />} />
          <Route path="/alterar-senha" element={<ChangePassword />} />

          {/* Editor (colaborador + superadmin) */}
          <Route path="/editor" element={<ProtectedRoute><EditorDashboard /></ProtectedRoute>} />
          <Route path="/editor/:id" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />

          {/* Admin (superadmin only) */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="usuarios" element={<ProtectedRoute requiredSection="usuarios"><AdminUsers /></ProtectedRoute>} />
            <Route path="configuracoes" element={<ProtectedRoute requiredSection="configuracoes"><AdminSettings /></ProtectedRoute>} />
            <Route path="cartorios" element={<ProtectedRoute requiredSection="cartorios"><AdminCartorios /></ProtectedRoute>} />
            <Route path="cartorios/configuracoes" element={<ProtectedRoute requiredSection="cartorios_config"><AdminCartoriosSettings /></ProtectedRoute>} />
            <Route path="perfil" element={<AdminProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  </TooltipProvider>
);

export default BlogRoutes;
