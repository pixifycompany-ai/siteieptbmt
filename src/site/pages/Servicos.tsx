import type { ReactNode } from "react";
import { BookOpen, Building, Newspaper, SquaresFour } from "@phosphor-icons/react";
import SiteLayout from "../components/SiteLayout";
import { EXTERNAL, WHATSAPP_URL, img } from "../data";

const MAIN = [
  {
    title: "Consulta de Protesto",
    description: "Pesquisa gratuita por CPF ou CNPJ na base nacional do Cartórios de Protesto.",
    cta: "Consultar agora",
    href: "https://www.pesquisaprotesto.com.br/servico/consulta-documento",
    image: img("LFyuOmQeLW8xYCSaK9Ai5xqY0"),
  },
  {
    title: "Central de Remessa",
    description: "Envio eletrônico de títulos aos 79 cartórios do estado de MT.",
    cta: "Acessar CRA-MT",
    href: "https://cramt.crabr.com.br/cramt/site/admin.php",
    image: img("REtfIkNvsjxYxCsD790UZo1Dquw"),
  },
  {
    title: "Cancelamento Eletrônico",
    description: "Baixa do protesto após quitação da dívida pelo devedor.",
    cta: "Solicitar baixa",
    href: "https://www.pesquisaprotesto.com.br/servico/pedido-anuencia",
    image: img("kbyGxA11oIjNr1Hnlu6mzaeZooE"),
  },
];

type Resource = { title: string; description: string; icon: ReactNode; href?: string };

const iconProps = { size: 24, color: "#0061ff", weight: "regular" as const };

const RESOURCES: Resource[] = [
  { title: "Convênios", description: "Empresas e órgãos públicos", icon: <Building {...iconProps} />, href: WHATSAPP_URL },
  { title: "Legislação", description: "Marco regulatório do protesto", icon: <BookOpen {...iconProps} /> },
  {
    title: "Tabela de emolumentos",
    description: "Valores por operação",
    icon: <SquaresFour {...iconProps} />,
    href: EXTERNAL.tabelaEmolumentos,
  },
  {
    title: "Edital",
    description:
      "Verificar a existência de intimações por edital eletrônico nos Cartórios de Protesto. Os editais são atualizados diariamente.",
    icon: <Newspaper {...iconProps} />,
    href: EXTERNAL.edital,
  },
];

const pill =
  "inline-flex h-[26px] items-center rounded-full bg-[#0061ff] px-3 text-[10px] font-normal leading-none text-white transition-colors duration-300";

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="text-center text-[28px] font-normal leading-[1.2] text-[#2a2d33]/70 min-[810px]:text-[32px]">{children}</h2>
);

const Servicos = () => (
  <SiteLayout title="Serviços | Cartórios de Protesto de Mato Grosso" background="#ffffff">
    {/* Hero */}
    <section className="relative overflow-hidden min-[1200px]:-mt-[10px] min-[1200px]:h-[900px]">
      <img
        src={img("xV0iRaFgKTyEwbvhVGw5aMHZtCc")}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[70%_50%] min-[1200px]:object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff_27%,rgba(255,255,255,0)_77%)] max-[809px]:bg-[linear-gradient(90deg,#fff_45%,rgba(255,255,255,0.6)_100%)]" />
      <div className="relative flex min-h-[620px] items-center px-6 py-16 min-[810px]:px-16 min-[1200px]:h-full min-[1200px]:px-24">
        <div className="max-w-[896px]">
          <h1 className="max-w-[806px] text-[38px] font-medium leading-none text-[#2a2d33] min-[810px]:text-[52px] min-[1200px]:text-[64px]">
            79 cartórios de protesto de Mato Grosso, conectados em uma plataforma.
          </h1>
          <p className="mt-2.5 max-w-[806px] text-[16px] font-light leading-[1.2] text-[#2a2d33]">
            Do envio do título ao cancelamento extrajudicial — tudo <br className="hidden min-[1200px]:block" />
            eletrônico, integrado à base estadual do Cartórios de Protesto MT.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 min-[810px]:gap-6">
            <a
              href={EXTERNAL.pesquisaProtesto}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[51px] items-center rounded-lg bg-[#0061ff] px-4 text-[16px] font-light text-[#eff2f5] transition-colors duration-300 hover:bg-[#2a2d33]"
            >
              Consulta gratuita
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[51px] items-center rounded-lg border border-[#0061ff] bg-[#eff2f5]/20 px-4 text-[16px] font-normal text-[#0061ff] transition-colors duration-300 hover:bg-[#0061ff] hover:text-white"
            >
              Falar com consultor
            </a>
          </div>
        </div>
      </div>
    </section>

    {/* Serviços principais */}
    <section className="px-4 pt-8 min-[810px]:px-16">
      <SectionHeading>Serviços principais</SectionHeading>
      <div className="mt-6 grid gap-6 min-[810px]:grid-cols-2 min-[1200px]:grid-cols-3">
        {MAIN.map((s) => (
          <a
            key={s.title}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block h-[400px] overflow-hidden rounded-lg bg-gradient-to-br from-[#0061ff] to-[#0057e3]"
          >
            <img
              src={s.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_20%,#000_84%)]" />
            <div className="absolute inset-x-6 bottom-8">
              <h3 className="text-[20px] font-medium leading-none text-[#eff2f5]">{s.title}</h3>
              <p className="mt-1 max-w-[252px] text-[12px] font-extralight leading-none text-[#eff2f5]/80">
                {s.description}
              </p>
              <span className={`${pill} mt-[18px] group-hover:bg-white group-hover:text-[#0061ff]`}>{s.cta}</span>
            </div>
          </a>
        ))}
      </div>
    </section>

    {/* Recursos */}
    <section className="px-4 pb-24 pt-24 min-[810px]:px-16">
      <SectionHeading>Recursos</SectionHeading>
      <div className="mt-[25px] grid gap-6 min-[680px]:grid-cols-2 min-[1200px]:grid-cols-4">
        {RESOURCES.map((r) => {
          const body = (
            <>
              <span className="block">{r.icon}</span>
              <span className="mt-3 block min-h-0 flex-1" />
              <span className="block text-[20px] font-medium leading-none text-[#2a2d33]">{r.title}</span>
              <span className="mt-1 block text-[12px] font-extralight leading-none text-[#2a2d33]">{r.description}</span>
              <span className={`${pill} mt-6 shrink-0 self-start`}>Saber mais</span>
            </>
          );
          const cls =
            "flex h-[250px] flex-col rounded-lg border border-[#0061ff] px-6 pb-4 pt-[100px] transition-colors duration-300 hover:bg-[#eff2f5]";
          return r.href ? (
            <a key={r.title} href={r.href} target="_blank" rel="noopener noreferrer" className={cls}>
              {body}
            </a>
          ) : (
            <div key={r.title} className={cls}>
              {body}
            </div>
          );
        })}
      </div>
    </section>
  </SiteLayout>
);

export default Servicos;
