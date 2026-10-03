// Gera HTML estático para as páginas do site institucional a partir do build.
// Cada rota vira dist/<rota>/index.html com o conteúdo já renderizado, título, description,
// canonical/Open Graph próprios e preload da imagem do hero. O React hidrata esse HTML no navegador.
// Rotas não pré-renderizadas (blog, admin, login…) devem cair em dist/spa.html no servidor.
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import Beasties from "beasties";

const DIST = "dist";
const SSR_ENTRY = path.resolve("dist-ssr/entry-server.js");

const { render, SEO, SITE_URL, HERO_PRELOAD } = await import(pathToFileURL(SSR_ENTRY).href);
const template = await readFile(path.join(DIST, "index.html"), "utf8");
await writeFile(path.join(DIST, "spa.html"), template);

// Embute o CSS crítico de cada página no <head> e carrega o restante de forma assíncrona
// (o CSS deixa de bloquear a primeira renderização).
const beasties = new Beasties({ path: DIST, publicPath: "/", preload: "media", pruneSource: false, logLevel: "warn" });

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const setMeta = (html, attr, key, value) =>
  html.replace(new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`), `$1${esc(value)}$2`);

for (const [route, { title, description }] of Object.entries(SEO)) {
  const body = await render(route);
  const url = SITE_URL + (route === "/" ? "/" : route);
  let html = template
    .replace("<html lang=\"pt-BR\">", "<html lang=\"pt-BR\" class=\"site-root\">")
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace('<div id="root"></div>', `<div id="root" data-prerendered="${route}">${body}</div>`);
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${esc(description)}" />`);
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "name", "twitter:title", title);
  html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/s, `$1${esc(description)}$2`);
  html = html.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/s, `$1${esc(description)}$2`);

  const hero = HERO_PRELOAD[route];
  if (hero) {
    html = html.replace(
      "</title>",
      `</title>\n    <link rel="preload" as="image" type="image/webp" fetchpriority="high" imagesrcset="${hero.srcset}" imagesizes="${hero.sizes}" />`,
    );
  }

  html = await beasties.process(html);
  // Regras que miram o próprio <html> (o beasties não as mantém no CSS crítico): raiz de 16px do
  // site e banner de cookies oculto para quem já respondeu — sem elas haveria deslocamento de layout.
  html = html.replace(
    "</title>",
    "</title>\n    <style>html.site-root{font-size:16px}html.cookie-ok [data-cookie-banner]{display:none}</style>",
  );

  // O conteúdo já vem no HTML: o JavaScript (hidratação, menus e animações de rolagem) é
  // carregado no primeiro momento ocioso após o carregamento, para não competir com o primeiro paint.
  html = html.replace(/<link rel="modulepreload"[^>]*>\s*/g, "");
  html = html.replace(
    /<script type="module" crossorigin src="([^"]+)"><\/script>/,
    (_, src) =>
      `<script>(function(){var l=function(){var s=document.createElement("script");s.type="module";s.src=${JSON.stringify("$1")};document.head.appendChild(s)};var i=function(){("requestIdleCallback" in window)?requestIdleCallback(l,{timeout:1500}):setTimeout(l,200)};document.readyState==="complete"?i():addEventListener("load",i,{once:true})})()</script>`.replace(
        "$1",
        src,
      ),
  );

  const outDir = route === "/" ? DIST : path.join(DIST, route);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "index.html"), html);
  console.log(`✓ ${route} (${(html.length / 1024).toFixed(0)} KB)`);
}

await rm("dist-ssr", { recursive: true, force: true });

// O cliente do Supabase (importado por páginas como a de cartórios) mantém um timer de renovação
// de sessão ativo no Node; encerra explicitamente quando terminar.
process.exit(0);
