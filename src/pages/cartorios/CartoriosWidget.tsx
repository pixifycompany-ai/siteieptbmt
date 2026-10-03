import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCartoriosSettings, defaultCartoriosSettings, hexToRgba } from "@/hooks/useCartoriosSettings";
import { useResetThemeForPublic } from "@/contexts/ThemeContext";
import CartorioCard, { Cartorio } from "@/components/cartorios/CartorioCard";
import CartoriosSearch from "@/components/cartorios/CartoriosSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { sortByCity } from "@/lib/sortCartorios";

const CartoriosWidget = () => {
  useResetThemeForPublic();
  const [cartorios, setCartorios] = useState<Cartorio[] | null>(null);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const { data: settings } = useCartoriosSettings();
  const s = settings || defaultCartoriosSettings;

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("cartorios")
        .select("id,nome_cartorio,nome_tabeliao,tabeliao_genero,localidades,endereco,email,telefones,instagram_url,whatsapp_url,site_url,display_order");
      setCartorios(sortByCity((data as Cartorio[]) || []));
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 150);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    if (!cartorios) return [];
    if (!debounced) return cartorios;
    return cartorios.filter((c) => {
      const fields = [c.nome_cartorio, c.nome_tabeliao, c.localidades, c.endereco]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return fields.includes(debounced);
    });
  }, [cartorios, debounced]);

  const loading = cartorios === null;

  return (
    <div style={{ background: hexToRgba(s.widget_bg_color, s.widget_bg_opacity), minHeight: "100%" }}>
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-8 md:px-6 md:pt-8">
        <div className="mb-6">
          <CartoriosSearch value={search} onChange={setSearch} />
        </div>

        {loading ? (
          <>
            {/* reserva a linha do contador para a grade não "pular" quando os dados chegam */}
            <p className="text-sm text-gray-800 mb-4 text-center md:text-left" aria-hidden="true">
              &nbsp;
            </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: `${s.card_gap}px` }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full rounded-3xl" />
            ))}
          </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-800 mb-4 text-center md:text-left">
              {filtered.length} cartório{filtered.length === 1 ? "" : "s"} encontrado
              {filtered.length === 1 ? "" : "s"}
            </p>
            {filtered.length === 0 ? (
              <p className="text-center text-gray-800 py-12">
                Nenhum cartório encontrado{debounced ? ` para "${search}"` : ""}.
              </p>
            ) : s.card_width > 0 ? (
              <div
                className="grid justify-center"
                style={{
                  gap: `${s.card_gap}px`,
                  gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${s.card_width}px), ${s.card_width}px))`,
                }}
              >
                {filtered.map((c) => (
                  <CartorioCard key={c.id} cartorio={c} settings={s} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: `${s.card_gap}px` }}>
                {filtered.map((c) => (
                  <CartorioCard key={c.id} cartorio={c} settings={s} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CartoriosWidget;
