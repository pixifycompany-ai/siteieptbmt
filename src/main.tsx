import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
// Fontes hospedadas no próprio site (subconjunto latino cobre o português) — sem bloqueio do Google Fonts.
import "@fontsource/kanit/latin-200.css";
import "@fontsource/kanit/latin-300.css";
import "@fontsource/kanit/latin-400.css";
import "@fontsource/kanit/latin-500.css";
import "@fontsource/kanit/latin-600.css";
import "@fontsource/kanit/latin-700.css";
import "@fontsource/figtree/latin-600.css";
import "./index.css";

const root = document.getElementById("root")!;

// Páginas do site chegam pré-renderizadas (ver scripts/prerender.mjs): o React apenas as hidrata.
// As demais rotas (blog, admin…) são renderizadas no navegador.
if (root.dataset.prerendered === window.location.pathname) {
  hydrateRoot(root, <App />);
} else {
  root.textContent = "";
  createRoot(root).render(<App />);
}
