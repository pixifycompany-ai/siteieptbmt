import { MapPin, Phone, Mail, Instagram, Globe } from "lucide-react";
import { CartoriosSettings, hexToRgba } from "@/hooks/useCartoriosSettings";
import { useIsMobile } from "@/hooks/use-mobile";

export type Cartorio = {
  id: string;
  nome_cartorio: string;
  nome_tabeliao: string | null;
  tabeliao_genero?: "tabeliao" | "tabelia" | "ambos";
  localidades: string | null;
  endereco: string | null;
  telefones: string[];
  email: string | null;
  instagram_url: string | null;
  whatsapp_url: string | null;
  site_url?: string | null;
};

// WhatsApp icon (lucide doesn't include it natively in same style)
const WhatsAppIcon = ({ size = 18, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.967-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 22h-.005a9.87 9.87 0 01-5.031-1.378l-.36-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface Props {
  cartorio: Cartorio;
  settings: CartoriosSettings;
}

const CartorioCard = ({ cartorio, settings: s }: Props) => {
  const isMobile = useIsMobile();
  const bg = hexToRgba(s.card_bg_color, s.card_bg_opacity);
  const titleColor = hexToRgba(s.card_title_color, s.card_title_opacity);
  const text = hexToRgba(s.card_text_color, s.card_text_opacity);
  const subtitle = hexToRgba(s.card_subtitle_color, s.card_subtitle_opacity);
  const label = s.card_label_color;
  const divider = hexToRgba(s.card_divider_color, s.card_divider_opacity);
  const icon = hexToRgba(s.card_icon_color, s.card_icon_opacity);
  const socialBg = hexToRgba(s.card_social_bg_color, s.card_social_bg_opacity);

  const socialRadius = Math.min(s.card_social_radius ?? 9999, 9999);
  const socialJustify = s.card_social_position === "right" ? "justify-end" : "justify-start";

  return (
    <article
      className="flex flex-col p-5 md:p-7 w-full"
      style={{
        background: bg,
        borderRadius: `${s.card_border_radius}px`,
        color: text,
        height: "100%",
        maxWidth: "100%",
        minHeight: !isMobile && s.card_min_height && s.card_min_height > 0 ? `${s.card_min_height}px` : undefined,
      }}
    >
      {/* Título */}
      <h3
        className="text-lg md:text-xl font-bold leading-tight mb-1"
        style={{ color: titleColor }}
      >
        {cartorio.nome_cartorio}
      </h3>

      {/* Subtítulo */}
      {cartorio.nome_tabeliao && (
        <p className="italic text-sm mb-1" style={{ color: subtitle }}>
          {cartorio.tabeliao_genero === "tabelia"
            ? "Tabeliã"
            : cartorio.tabeliao_genero === "ambos"
            ? "Tabeliã/Tabelião"
            : "Tabelião"}{" "}
          {cartorio.nome_tabeliao}
        </p>
      )}

      {/* Localidades */}
      {cartorio.localidades && (
        <div className="mb-4 mt-2">
          <p className="text-xs font-semibold tracking-wider uppercase mb-0.5" style={{ color: label }}>
            Localidades que abrangem a comarca
          </p>
          <p className="text-sm" style={{ color: text }}>
            {cartorio.localidades}
          </p>
        </div>
      )}

      {/* Divisor */}
      <div className="h-px w-full mb-5" style={{ background: divider }} />

      {/* Endereço */}
      {cartorio.endereco && (
        <div className="flex gap-3 mb-4">
          <MapPin className="shrink-0 mt-0.5" size={18} style={{ color: icon }} />
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wider uppercase mb-0.5" style={{ color: label }}>
              Endereço
            </p>
            <p className="text-sm leading-snug break-words" style={{ color: text }}>
              {cartorio.endereco}
            </p>
          </div>
        </div>
      )}

      {/* Telefones */}
      {cartorio.telefones && cartorio.telefones.filter(Boolean).length > 0 && (
        <div className="flex gap-3 mb-4">
          <Phone className="shrink-0 mt-0.5" size={18} style={{ color: icon }} />
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase mb-0.5" style={{ color: label }}>
              Telefone
            </p>
            {cartorio.telefones.filter(Boolean).map((tel, i) => (
              <p key={i} className="text-sm leading-snug" style={{ color: text }}>
                {tel}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Email */}
      {cartorio.email && (
        <div className="flex gap-3 mb-5">
          <Mail className="shrink-0 mt-0.5" size={18} style={{ color: icon }} />
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wider uppercase mb-0.5" style={{ color: label }}>
              Email
            </p>
            <p className="text-sm leading-snug break-all" style={{ color: text }}>
              {cartorio.email}
            </p>
          </div>
        </div>
      )}

      {/* Redes sociais */}
      {(cartorio.instagram_url || cartorio.whatsapp_url || cartorio.site_url) && (
        <div className={`flex gap-3 mt-auto pt-2 ${socialJustify}`}>
          {cartorio.instagram_url && (
            <a
              href={cartorio.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center justify-center w-10 h-10 transition-transform hover:scale-105"
              style={{ background: socialBg, borderRadius: `${socialRadius}px` }}
            >
              <Instagram size={18} style={{ color: s.card_bg_color }} />
            </a>
          )}
          {cartorio.whatsapp_url && (
            <a
              href={cartorio.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex items-center justify-center w-10 h-10 transition-transform hover:scale-105"
              style={{ background: socialBg, borderRadius: `${socialRadius}px` }}
            >
              <WhatsAppIcon size={18} color={s.card_bg_color} />
            </a>
          )}
          {cartorio.site_url && (
            <a
              href={cartorio.site_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Site"
              className="flex items-center justify-center w-10 h-10 transition-transform hover:scale-105"
              style={{ background: socialBg, borderRadius: `${socialRadius}px` }}
            >
              <Globe size={18} style={{ color: s.card_bg_color }} />
            </a>
          )}
        </div>
      )}
    </article>
  );
};

export default CartorioCard;
