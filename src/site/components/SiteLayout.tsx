import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CookieBanner from "./CookieBanner";
import { useResetThemeForPublic } from "@/contexts/ThemeContext";

type Props = {
  children: ReactNode;
  title: string;
  description?: string;
  /** fundo da página atrás das seções */
  background?: string;
};

const DEFAULT_DESCRIPTION =
  "Protesto de títulos com segurança jurídica em Mato Grosso. Consulta gratuita, envio eletrônico e cancelamento nos 79 cartórios do estado.";

/**
 * Casca das páginas institucionais. O blog usa `html { font-size: 14.4px }`;
 * aqui voltamos a 16px para manter as medidas do site original.
 */
const SiteLayout = ({ children, title, description = DEFAULT_DESCRIPTION, background = "#eff2f5" }: Props) => {
  const { pathname } = useLocation();
  useResetThemeForPublic();

  useEffect(() => {
    document.documentElement.classList.add("site-root");
    return () => document.documentElement.classList.remove("site-root");
  }, []);

  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [title, description]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="site min-h-screen" style={{ background }}>
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default SiteLayout;

/** Pílula pequena acima dos títulos de seção ("Soluções para você", "FAQ"...). */
export const SectionBadge = ({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "blue" | "dark" }) => {
  const styles = {
    light: "bg-[#eff2f5] text-[#0061ff]",
    blue: "bg-[#0061ff] text-white",
    dark: "bg-[#2a2d33] text-[#eff2f5]",
  }[tone];
  return (
    <span className={`inline-flex h-6 items-center rounded-full px-3 text-[10px] font-light leading-none ${styles}`}>
      {children}
    </span>
  );
};
