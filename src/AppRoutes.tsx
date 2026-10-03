import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "@/site/pages/Home";
import { isBlogHost } from "@/lib/hosts";

// Páginas do site institucional (a home entra no bundle principal; as demais sob demanda)
const Servicos = lazy(() => import("@/site/pages/Servicos"));
const Contato = lazy(() => import("@/site/pages/Contato"));
const Instituicao = lazy(() => import("@/site/pages/Instituicao"));
const Diretoria = lazy(() => import("@/site/pages/Diretoria"));
const Equipe = lazy(() => import("@/site/pages/Equipe"));
const CartoriosDeProtesto = lazy(() => import("@/site/pages/CartoriosDeProtesto"));
const Privacidade = lazy(() => import("@/site/pages/Privacidade"));

// Blog, CMS e login (com Supabase Auth) — carregados só quando usados
const BlogRoutes = lazy(() => import("@/BlogRoutes"));

const Fallback = () => <div className="min-h-screen" />;

/** Rotas do app — compartilhadas pelo navegador (BrowserRouter) e pela pré-renderização (StaticRouter). */
const AppRoutes = () =>
  // Em blog.cartoriosdeprotestomt.com.br o app inteiro é o blog/CMS (mesmos caminhos de antes).
  isBlogHost() ? (
    <Suspense fallback={<Fallback />}>
      <BlogRoutes />
    </Suspense>
  ) : (
  <Suspense fallback={<Fallback />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/servicos" element={<Servicos />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="/instituicao" element={<Instituicao />} />
      <Route path="/diretoria" element={<Diretoria />} />
      <Route path="/equipe" element={<Equipe />} />
      <Route path="/cartoriosdeprotesto" element={<CartoriosDeProtesto />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="/*" element={<BlogRoutes />} />
    </Routes>
  </Suspense>
  );

export default AppRoutes;
