// Entrada do subdomínio blog.cartoriosdeprotestomt.com.br (blog-app.html): só o blog/CMS,
// sem o código do site institucional.
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import BlogRoutes from "@/BlogRoutes";
import "@fontsource/kanit/latin-300.css";
import "@fontsource/kanit/latin-400.css";
import "@fontsource/kanit/latin-500.css";
import "./index.css";

// A lista de posts é a página mais visitada: o chunk dela começa a baixar junto com o app.
if (/^\/(blog\/?)?$/.test(window.location.pathname)) import("@/pages/blog/BlogList");

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <BlogRoutes />
    </BrowserRouter>
  </QueryClientProvider>,
);
