// Gera um resumo curto (até 200 caracteres, pt-BR) para um post do blog.
//
// Usa o Claude (Anthropic) quando o segredo ANTHROPIC_API_KEY está configurado no Supabase:
//   supabase secrets set ANTHROPIC_API_KEY=...
// Sem a chave — ou se a API falhar — cai num resumo extrativo (primeiras frases do texto),
// para o botão "gerar resumo" do editor sempre funcionar.
import Anthropic from "npm:@anthropic-ai/sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_CHARS = 200;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

/** Resumo sem IA: primeiras frases que cabem em 200 caracteres, cortando em palavra inteira. */
function extractiveExcerpt(text: string): string {
  if (text.length <= MAX_CHARS) return text;
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
  let out = "";
  for (const s of sentences) {
    if ((out + s).trim().length > MAX_CHARS) break;
    out += s;
  }
  if (out.trim()) return out.trim();
  const cut = text.slice(0, MAX_CHARS - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).trim() + "…";
}

async function aiExcerpt(apiKey: string, text: string): Promise<string | null> {
  const client = new Anthropic({ apiKey });
  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 4000,
    output_config: { effort: "low" },
    // Se o modelo recusar por política, o servidor refaz a requisição em outro modelo.
    betas: ["server-side-fallback-2026-07-01"],
    // deno-lint-ignore no-explicit-any
    fallbacks: "default" as any,
    system:
      "Você cria resumos curtos para posts de blog de um instituto de cartórios de protesto. " +
      `Escreva em português do Brasil, com no máximo ${MAX_CHARS} caracteres, tom informativo e neutro. ` +
      "Responda apenas com o texto do resumo, sem aspas nem comentários.",
    messages: [{ role: "user", content: `Resuma o post abaixo:\n\n${text}` }],
  });

  if (response.stop_reason === "refusal") return null;
  const block = response.content.find((b) => b.type === "text");
  const excerpt = block && block.type === "text" ? block.text.trim() : "";
  if (!excerpt) return null;
  return excerpt.length > MAX_CHARS ? extractiveExcerpt(excerpt) : excerpt;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { content } = await req.json();
    if (!content || typeof content !== "string") return json({ error: "content is required" }, 400);

    // Texto puro (sem HTML) para a IA e para o resumo extrativo.
    const plainText = content.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!plainText) return json({ excerpt: "" });

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (apiKey) {
      try {
        const excerpt = await aiExcerpt(apiKey, plainText);
        if (excerpt) return json({ excerpt });
      } catch (e) {
        if (e instanceof Anthropic.RateLimitError) {
          console.warn("generate-excerpt: limite de requisições da API, usando resumo extrativo");
        } else if (e instanceof Anthropic.APIError) {
          console.error(`generate-excerpt: erro da API ${e.status}:`, e.message);
        } else {
          console.error("generate-excerpt: falha ao chamar a IA:", e);
        }
      }
    }

    return json({ excerpt: extractiveExcerpt(plainText) });
  } catch (e) {
    console.error("generate-excerpt error:", e);
    return json({ error: e instanceof Error ? e.message : "Erro desconhecido" }, 500);
  }
});
