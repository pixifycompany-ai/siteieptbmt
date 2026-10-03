// Leitura pública e leve da API REST do Supabase (PostgREST), sem carregar o SDK completo.
// Usada pelo site institucional para dados públicos (ex.: últimas notícias na home).
const URL_BASE = import.meta.env.VITE_SUPABASE_URL as string;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export async function restSelect<T>(table: string, query: Record<string, string>): Promise<T[]> {
  const params = new URLSearchParams(query);
  const res = await fetch(`${URL_BASE}/rest/v1/${table}?${params}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase ${table}: ${res.status}`);
  return res.json();
}
