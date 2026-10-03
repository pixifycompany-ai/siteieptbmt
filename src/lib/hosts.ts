// Domínios do projeto: o site institucional e o blog/CMS rodam do mesmo código,
// separados pelo hostname.
export const SITE_ORIGIN = "https://www.cartoriosdeprotestomt.com.br";
export const BLOG_ORIGIN = "https://blog.cartoriosdeprotestomt.com.br";

/** True quando o app está sendo servido em blog.cartoriosdeprotestomt.com.br. */
export const isBlogHost = () => typeof window !== "undefined" && window.location.hostname.startsWith("blog.");

/**
 * Link para uma página do blog a partir do site. Em produção aponta para o subdomínio do blog;
 * em desenvolvimento (localhost) usa o caminho local, onde site e blog convivem.
 * Depende só do modo de build, então o HTML pré-renderizado e o navegador geram o mesmo link.
 */
export const blogUrl = (path: string) => (import.meta.env.PROD ? BLOG_ORIGIN + path : path);

/** Define o <link rel="canonical"> da página atual do blog (no subdomínio do blog). */
export const setBlogCanonical = (path: string) => {
  if (typeof document === "undefined") return;
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = BLOG_ORIGIN + path;
};
