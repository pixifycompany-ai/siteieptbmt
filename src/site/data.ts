import manifest from "./image-manifest.json";

// Dados compartilhados do site institucional (extraídos do site original no Framer).

export const WHATSAPP_URL =
  "https://wa.me/5565996127651?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20servi%C3%A7o%20de%20protesto%20de%20t%C3%ADtulos.";

export const SOCIAL = {
  facebook: "https://www.facebook.com/ieptbmt",
  instagram: "https://www.instagram.com/cartoriosdeprotestomt/",
};

export const EXTERNAL = {
  pesquisaProtesto: "https://www.pesquisaprotesto.com.br/",
  tabelaEmolumentos:
    "https://drive.google.com/file/d/18L54G4REHQpkVTUUo4kFtsgJEJU9wE9_/view?usp=sharing",
  edital: "https://mt.edital21.com.br/publicacao/consultar",
  // Lei Federal nº 9.492/1997 — regulamenta o protesto de títulos e outros documentos de dívida
  leiProtesto: "https://www.planalto.gov.br/ccivil_03/leis/l9492.htm",
  pixify: "https://www.pixify.company/",
  mapsEmbed: "https://maps.google.com/maps?q=IEPTB%20MT&z=15&output=embed",
};

export const CONTACTS = {
  institucional: { phone: "(65) 2136-9478", email: "ieptb@cartoriosdeprotestomt.com.br" },
  cra: { phone: "(65) 99943-2539", email: "cra@cartoriosdeprotestomt.com.br" },
  comercial: { phone: "(65) 99612-7651", email: "comercial@cartoriosdeprotestomt.com.br" },
};

export const ADDRESS =
  "Rua General Amilcar Magalhães, 38 - Duque de Caxias - CEP 78043-303 - Cuiabá/MT";

export const tel = (phone: string) => `tel:+55${phone.replace(/\D/g, "")}`;

export type MenuItem = { title: string; description: string; href: string; external?: boolean };

export const INSTITUCIONAL_MENU: MenuItem[] = [
  { title: "A Instituição", description: "Um pouco da história da instituição", href: "/instituicao" },
  { title: "Diretoria", description: "Atual diretoria — 2025/2026", href: "/diretoria" },
  { title: "Nossa Equipe", description: "Quem faz acontecer", href: "/equipe" },
  {
    title: "Cartórios de Protesto",
    description: "Lista de todos os Cartórios de Protesto do estado de Mato Grosso",
    href: "/cartoriosdeprotesto",
  },
];

export const SERVICOS_MENU: MenuItem[] = [
  {
    title: "Consulta Protesto",
    description: "Consulte gratuitamente protestos em qualquer cartório do país pelo CPF ou CNPJ",
    href: "/servicos",
  },
  {
    title: "Central de Remessa de Arquivos",
    description: "Distribuição eletrônica de títulos para os 78 cartórios de protesto do Mato Grosso",
    href: "/servicos",
  },
  {
    title: "Cancelamento Eletrônico de Protesto",
    description: "Cancele protestos online, 24h por dia, de qualquer lugar do Brasil",
    href: "/servicos",
  },
  {
    title: "Convênios",
    description: "Protesto eletrônico de multas, títulos e dívidas para órgãos públicos e empresas",
    href: "/servicos",
  },
  {
    title: "Legislação",
    description: "Leis federais e normas da Corregedoria sobre o protesto extrajudicial",
    href: "/servicos",
  },
  {
    title: "Tabela de Emolumentos",
    description: "Custas e taxas oficiais dos serviços de protesto — 2026",
    href: EXTERNAL.tabelaEmolumentos,
    external: true,
  },
  {
    title: "Edital",
    description:
      "Verificar a existência de intimações por edital eletrônico nos Cartórios de Protesto. Os editais são atualizados diariamente.",
    href: EXTERNAL.edital,
    external: true,
  },
];

// Imagens geradas por `npm run images` em várias larguras (ver src/site/image-manifest.json).
const imageWidths = manifest as Record<string, number[]>;

/** URL de uma variante da imagem (a menor largura >= `width`, ou a maior disponível). */
export const img = (name: string, width = 1280) => {
  const widths = imageWidths[name];
  if (!widths) return `/site/img/${name}.webp`;
  const w = widths.find((x) => x >= width) ?? widths[widths.length - 1];
  return `/site/img/${name}-${w}.webp`;
};

/** `srcset` com todas as larguras disponíveis da imagem. */
export const srcSet = (name: string) =>
  (imageWidths[name] ?? []).map((w) => `/site/img/${name}-${w}.webp ${w}w`).join(", ");
