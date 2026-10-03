// Consultas que o script inline do blog-app.html dispara antes do JavaScript do blog terminar
// de baixar (lista de posts e configurações). Cada uma é consumida uma única vez.
type Prefetch = {
  settings?: Promise<unknown[]>;
  posts?: Promise<unknown[]>;
};

declare global {
  interface Window {
    __blogPrefetch?: Prefetch;
  }
}

export async function takePrefetch<T>(key: keyof Prefetch): Promise<T[] | null> {
  if (typeof window === "undefined" || !window.__blogPrefetch?.[key]) return null;
  const pending = window.__blogPrefetch[key]!;
  delete window.__blogPrefetch[key];
  try {
    return (await pending) as T[];
  } catch {
    return null;
  }
}
