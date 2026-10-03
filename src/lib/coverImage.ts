// Capas dos posts em tamanho de card, geradas pelo Supabase (render/image): o navegador escolhe
// a largura certa pelo srcset e recebe WebP. O script inline do blog-app.html repete esta regra
// para pré-carregar a primeira capa — mantenha os dois iguais.
export const COVER_WIDTHS = [400, 640, 800, 1080];
export const COVER_SIZES = "(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw";

const OBJECT_PATH = "/storage/v1/object/public/";
const RENDER_PATH = "/storage/v1/render/image/public/";

const canTransform = (url: string) => url.includes(OBJECT_PATH) && !url.includes("?");

export const coverSrc = (url: string | null | undefined, width = 640): string | undefined => {
  if (!url) return undefined;
  if (!canTransform(url)) return url;
  return `${url.replace(OBJECT_PATH, RENDER_PATH)}?width=${width}&quality=75`;
};

export const coverSrcSet = (url: string | null | undefined): string | undefined => {
  if (!url || !canTransform(url)) return undefined;
  return COVER_WIDTHS.map((w) => `${coverSrc(url, w)} ${w}w`).join(", ");
};
