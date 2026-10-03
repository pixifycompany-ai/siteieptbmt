// Ponto de entrada da pré-renderização (usado só no build — ver scripts/prerender.mjs).
import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "@/AppRoutes";
import { srcSet } from "@/site/data";

export { SEO, SITE_URL } from "@/site/seo";

/** Imagem principal (LCP) de cada página, pré-carregada no <head>. */
export const HERO_PRELOAD: Record<string, { srcset: string; sizes: string }> = {
  "/": { srcset: srcSet("l02yOJdgGRdf1I3Vrawzmx2k"), sizes: "100vw" },
  "/servicos": { srcset: srcSet("xV0iRaFgKTyEwbvhVGw5aMHZtCc"), sizes: "100vw" },
  "/diretoria": { srcset: srcSet("Pv3Hm52MF3lS2X5Sp3L5a93Y"), sizes: "280px" },
};

/** Renderiza uma rota em HTML, aguardando as páginas carregadas sob demanda (lazy). */
export function render(url: string): Promise<string> {
  const queryClient = new QueryClient();
  return new Promise((resolve, reject) => {
    let html = "";
    const sink = new Writable({
      write(chunk, _encoding, callback) {
        html += chunk.toString();
        callback();
      },
    });
    sink.on("finish", () => resolve(html));
    const { pipe } = renderToPipeableStream(
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </QueryClientProvider>,
      {
        onAllReady: () => pipe(sink),
        onShellError: reject,
        onError: reject,
      },
    );
  });
}
