import { ArrowUpRight } from "@phosphor-icons/react";
import { SEO } from "../seo";
import SiteLayout from "../components/SiteLayout";
import { BlurText, Reveal } from "../components/motion";
import { WHATSAPP_URL } from "../data";

type Partner = {
  /** sigla exibida em destaque */
  name: string;
  /** nome completo da instituição */
  fullName: string;
  description: string;
  /** logomarca em public/site/parceiros (SVG sempre que possível: nítido em qualquer tela e leve) */
  logo: string;
  /** tamanho da logo no card, ajustado à mão para todas terem o mesmo peso visual */
  logoWidth: number;
  url: string;
};

// Para incluir um parceiro: adicione a logo em public/site/parceiros e um item aqui.
const PARTNERS: Partner[] = [
  {
    name: "TJMT",
    fullName: "Tribunal de Justiça do Estado de Mato Grosso",
    description: "Órgão do Poder Judiciário estadual, responsável pela fiscalização dos serviços notariais e de registro em Mato Grosso.",
    logo: "/site/parceiros/tjmt.webp",
    logoWidth: 250,
    url: "https://www.tjmt.jus.br",
  },
  {
    name: "PGE-MT",
    fullName: "Procuradoria-Geral do Estado de Mato Grosso",
    description: "Representa judicial e extrajudicialmente o Estado de Mato Grosso e orienta o contribuinte sobre débitos estaduais, como IPVA.",
    logo: "/site/parceiros/pge-mt.svg",
    logoWidth: 240,
    url: "https://www.pge.mt.gov.br",
  },
  {
    name: "AMM",
    fullName: "Associação Mato-grossense dos Municípios",
    description: "Reúne as prefeituras dos municípios de Mato Grosso e apoia a gestão pública municipal.",
    logo: "/site/parceiros/amm.svg",
    logoWidth: 116,
    url: "https://www.amm.org.br",
  },
  {
    name: "ANOREG-MT",
    fullName: "Associação dos Notários e Registradores de Mato Grosso",
    description: "Entidade que representa os cartórios de notas e de registro do estado de Mato Grosso.",
    logo: "/site/parceiros/anoreg-mt.webp",
    logoWidth: 230,
    url: "https://www.anoregmt.org.br",
  },
  {
    name: "Energisa",
    fullName: "Energisa Mato Grosso",
    description: "Concessionária de distribuição de energia elétrica em Mato Grosso.",
    logo: "/site/parceiros/energisa.svg",
    logoWidth: 200,
    url: "https://www.energisa.com.br",
  },
];

const PartnerCard = ({ p }: { p: Partner }) => (
  <a
    href={p.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#0061ff]/15 bg-white outline-none transition-[transform,border-color,box-shadow] duration-500 ease-out-quint hover:-translate-y-1 hover:border-[#0061ff]/50 hover:shadow-[0_20px_40px_-18px_rgba(0,97,255,0.35)] focus-visible:border-[#0061ff] focus-visible:ring-2 focus-visible:ring-[#0061ff]/40"
  >
    <div className="flex h-[168px] items-center justify-center bg-[#f6f8fb] px-10 transition-colors duration-500 group-hover:bg-[#eef3fe]">
      <img
        src={p.logo}
        alt={`Logomarca ${p.fullName}`}
        loading="lazy"
        decoding="async"
        className="h-auto max-h-[120px] max-w-full object-contain"
        style={{ width: p.logoWidth }}
      />
    </div>
    <div className="flex flex-1 flex-col p-6">
      <h2 className="type-card text-[#2a2d33]">{p.name}</h2>
      <p className="type-small mt-0.5 !font-normal text-[#0061ff]">{p.fullName}</p>
      <p className="type-small mt-3 flex-1 text-[#2a2d33]/75">{p.description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#2a2d33] transition-colors duration-300 group-hover:text-[#0061ff]">
        Visitar site
        <ArrowUpRight size={14} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
      </span>
    </div>
  </a>
);

const Parceiros = () => (
  <SiteLayout {...SEO["/parceiros"]} background="#ffffff">
    <section className="px-6 pb-16 pt-[94px] min-[810px]:px-16 min-[810px]:pt-12 min-[1200px]:pb-28 min-[1200px]:pt-[86px]">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col items-center text-center">
          <Reveal immediate>
            <span className="inline-flex h-6 items-center rounded-full bg-[#2a2d33] px-3 type-eyebrow text-[#eff2f5] min-[810px]:h-[26px]">
              Quem confia no protesto
            </span>
          </Reveal>
          <h1 className="type-hero mt-3 text-[#0061ff]">
            <BlurText text="Parceiros" immediate />
          </h1>
          <Reveal immediate delay={0.2}>
            <p className="type-lead mx-auto mt-3 max-w-[720px] text-balance text-[#2a2d33]/80">
              Órgãos públicos, prefeituras e empresas que confiam nos Cartórios de Protesto de Mato Grosso e utilizam o
              protesto de títulos de forma eletrônica, rápida e segura.
            </p>
          </Reveal>
        </div>

        {/* flex (e não grid) para a última fileira incompleta ficar centralizada */}
        <ul className="mt-10 flex flex-wrap justify-center gap-6 min-[810px]:mt-14">
          {PARTNERS.map((p, i) => (
            <li key={p.name} className="w-full min-[680px]:w-[calc((100%-24px)/2)] min-[1000px]:w-[calc((100%-48px)/3)]">
              <Reveal immediate delay={0.25 + i * 0.06} className="h-full">
                <PartnerCard p={p} />
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-12 flex flex-col items-center gap-4 rounded-2xl bg-[#2a2d33] px-6 py-10 text-center min-[810px]:mt-16 min-[810px]:py-14">
          <h2 className="type-title text-[#00d4d4]">Quer ser nosso parceiro?</h2>
          <p className="type-body max-w-[560px] text-balance text-white">
            Órgãos públicos, prefeituras e empresas podem firmar convênio para protestar títulos e dívidas de forma
            eletrônica.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex h-[51px] items-center justify-center rounded-lg bg-white px-6 text-[16px] font-medium text-[#2a2d33] transition-colors duration-300 hover:bg-[#eff2f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a2d33]"
          >
            Falar com a equipe
          </a>
        </Reveal>
      </div>
    </section>
  </SiteLayout>
);

export default Parceiros;
