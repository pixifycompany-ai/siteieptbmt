import type { ReactNode } from "react";
import { Eye, Mountains, Target } from "@phosphor-icons/react";
import SiteLayout from "../components/SiteLayout";
import { BlurText, Reveal } from "../components/motion";

const PHILOSOPHY: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: "Missão",
    text: "Promover a integração e fortalecimento dos integrantes da especialidade de tabelionato de protesto no Estado de Mato Grosso, defendendo seus interesses, primando pela segurança jurídica e pelo aperfeiçoamento constante de suas normas de serviço.",
    icon: <Target size={24} />,
  },
  {
    title: "Visão",
    text: "Ser referência dentre as seccionais estaduais em promover a qualificação e o aperfeiçoamento dos serviços de protesto de títulos e outros documentos de dívida, bem como a integração dos tabeliães de protesto.",
    icon: <Eye size={24} />,
  },
  {
    title: "Valores",
    text: "Ética, Qualidade no atendimento e Segurança Jurídica.",
    icon: <Mountains size={24} />,
  },
];

// Reproduzido exatamente como publicado no site original (inclusive a repetição de 2013–2020).
const PRESIDENTS = [
  ["2005 a 2007", "Paulo Henrique Felipetto Malta"],
  ["2008 a 2010", "Juliano Duailibi Baungart"],
  ["2011 a 2012", "Velenice Dias de Almeida"],
  ["2013 a 2014", "Velenice Dias de Almeida"],
  ["2015 a 2016", "Velenice Dias de Almeida"],
  ["2017 a 2018", "Velenice Dias de Almeida"],
  ["2019 a 2020", "Velenice Dias de Almeida"],
  ["2021 a 2022", "Niuara Ribeiro Roberto Borges"],
  ["2023 a 2024", "Wellington Ribeiro Campos"],
  ["2025 a 2026", "Wellington Ribeiro Campos"],
];

const paragraph = "text-balance whitespace-pre-wrap text-[13px] font-light leading-[1.55] text-[#2a2d33]/80 min-[810px]:text-[22px] min-[810px]:leading-[1.6]";
const strong = "font-normal";

const Instituicao = () => (
  <SiteLayout title="Instituição | Cartórios de Protesto de Mato Grosso" background="#ffffff">
    {/* Sobre Nós */}
    <section className="px-4 pb-[51px] pt-20 min-[810px]:px-16 min-[810px]:pb-20 min-[1200px]:pb-28">
      <div className="border-b border-[#2a2d33]/10">
        <h1 className="text-[28px] font-bold leading-[1.4] text-[#0061ff] min-[810px]:text-[64px]">
          <BlurText text="Sobre Nós" />
        </h1>
      </div>
      <Reveal className="mt-3.5 max-w-[1181px] space-y-[1.55em] text-[13px] min-[810px]:mt-6 min-[810px]:space-y-[1.6em] min-[810px]:text-[22px]">
        <p className={paragraph}>
          O Instituto de Estudos de Protesto de Títulos do Brasil Seção Mato Grosso - IEPTB/MT é uma entidade civil, sem
          fins lucrativos, que representa os cartórios de protesto de títulos e documentos de dívida do Estado do Mato
          Grosso.
        </p>
        <p className={paragraph}>
          O <span className={strong}>IEPTB-MT</span> foi criado em 15/09/2005, tendo como incentivador e primeiro
          presidente o tabelião de protesto da Comarca de Lucas do Rio Verde-MT,{" "}
          <span className={strong}>Paulo Henrique Felipetto Malta</span>.
        </p>
        <p className={paragraph}>
          O <span className={strong}>IEPTB-MT</span> tem por finalidade, dentre outros: congregar os tabeliães de
          protesto de Mato Grosso, promovendo a união em defesa de direitos, prerrogativas e interesses legítimos; estudar
          e pesquisar os procedimentos e normas jurídicas referentes ao protesto de títulos e outros documentos de dívida,
          propugnando pelo desenvolvimento, difusão e aperfeiçoamento das técnicas utilizadas.
        </p>
      </Reveal>
    </section>

    {/* Missão, Visão e Valores */}
    <section className="bg-[#0061ff] px-4 pb-11 pt-16 min-[810px]:px-16 min-[810px]:pb-16">
      <div className="space-y-8">
        {PHILOSOPHY.map((item) => (
          <Reveal
            key={item.title}
            className="flex items-center gap-8 border-b border-[#eff2f5]/30 pb-8 min-[810px]:pb-11"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#eff2f5] text-[#eff2f5]">
              {item.icon}
            </span>
            <div className="max-w-[1181px]">
              <h2 className="text-[25px] font-normal leading-[1.2] text-white min-[810px]:text-[64px]">{item.title}</h2>
              <p className="text-balance text-[13px] font-light leading-[1.6] text-[#eff2f5]/70 min-[810px]:text-[16px]">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>

    {/* Presidentes */}
    <section className="px-4 pb-4 pt-8 min-[810px]:px-16 min-[810px]:pb-16 min-[810px]:pt-16 min-[1200px]:pt-[90px]">
      <div className="border-b border-[#2a2d33]/10">
        <h2 className="text-balance px-6 text-center text-[28px] font-bold leading-[1.1] text-[#0061ff] min-[810px]:px-0 min-[810px]:text-[64px]">
          <BlurText text="Presidentes que marcaram nossa história" />
        </h2>
        <Reveal>
          <p className="mx-auto mt-[45px] text-balance text-center text-[22px] font-light leading-[1.55] text-[#2a2d33]/80 min-[810px]:mt-[50px] min-[810px]:leading-[1.6]">
            Do início da nossa jornada até os dias atuais, cada presidente do IEPTB-MT contribuiu para consolidar
            <br />o serviço de protesto como pilar essencial da segurança jurídica e da recuperação de crédito em Mato
            Grosso.
          </p>
        </Reveal>

        <div className="relative mt-6 pb-8 pt-[62px] min-[810px]:pt-8">
          <span className="absolute bottom-0 left-6 top-0 w-0.5 bg-[#e0e0e0] min-[810px]:left-1/2 min-[810px]:-translate-x-1/2" />
          <ol className="space-y-7">
            {PRESIDENTS.map(([period, name], i) => {
              const right = i % 2 === 1;
              return (
                <li key={period} className="relative min-[810px]:grid min-[810px]:grid-cols-2 min-[810px]:gap-[88px] min-[810px]:px-5">
                  <span className="absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-y-1/2 rounded-full bg-[#0061ff] min-[810px]:block" />
                  <Reveal
                    blur
                    y={20}
                    className={`ml-5 w-[246px] rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] min-[810px]:ml-0 min-[810px]:w-auto min-[810px]:p-6 ${right ? "min-[810px]:col-start-2" : ""}`}
                  >
                    <p className="text-[14px] font-medium leading-[1.4] text-[#666]">{period}</p>
                    <p className="mt-[7px] text-[18px] font-semibold leading-[1.3] text-black">{name}</p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  </SiteLayout>
);

export default Instituicao;
