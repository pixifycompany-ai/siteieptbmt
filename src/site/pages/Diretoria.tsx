import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";
import SiteLayout from "../components/SiteLayout";
import { Reveal } from "../components/motion";
import { img } from "../data";

type Member = { name: string; role: string; office: string; photo: string; position?: string };

const DIRETORIA: Member[] = [
  { name: "Wellington Ribeiro Campos", role: "Presidente", office: "Tabelião do 2º Ofício de Itiquira/MT", photo: "Pv3Hm52MF3lS2X5Sp3L5a93Y", position: "50.8% 26%" },
  { name: "Ricardo Fabricio Seganfredo", role: "Vice-Presidente", office: "Tabelião do 2º Ofício de Pontes e Lacerda/MT", photo: "LsFhPszEKRtGgOZsaUhRI8GAeo" },
  { name: "Mauro Pereira da Silva", role: "Secretário Geral", office: "Tabelião do 2º Ofício de Tangará da Serra/MT", photo: "I6rb8GMBzjULBa2R91LX2pxMvGc" },
  { name: "Marcelo Farias Machado", role: "1º Tesoureiro", office: "Tabelião do 2º Ofício de Jaciara/MT", photo: "gtLtLmNOcE9u6esgHgN0mZv6d8k" },
  { name: "Edivaldo Mauricio Semensato", role: "2º Tesoureiro", office: "Tabelião do 2º Ofício de Tabaporã/MT", photo: "kLPQ2Vzn9NMKSsSjLtKx25Zdp0" },
  { name: "Bianca de Oliveira Borges", role: "1º Secretário", office: "Tabeliã do 2º Ofício de Colniza/MT", photo: "YxBWy0ZEnVDLnVzZOVzJt2oFY" },
];

const CONSELHO: Member[] = [
  { name: "Velenice Dias de Almeida", role: "1º Titular", office: "Tabeliã do 2º Ofício de Primavera do Leste/MT", photo: "XBoD8gMZgXAi7IfyqeG2ybpBbvs" },
  { name: "Dirceu da Silva", role: "2º Titular", office: "Tabelião do 2º Ofício de Nova Monte Verde/MT", photo: "AP6pqJAtGDu5fCwPOgrqlncFFfk" },
  { name: "Ingrid Gil Sales Barreto", role: "3º Titular", office: "Tabeliã do 2º Ofício de Nobres/MT", photo: "aS14Ggj7OTPHcQ9nATHu6gVl3uE" },
  { name: "Wagner Oliveira de Melo", role: "1º Suplente", office: "Tabelião do 2º Ofício de Pedra Preta/MT", photo: "UiMJMtxtf9amDjtkwzm3BeM9jIE" },
  { name: "Maria de Nazaret de Souza Pires", role: "2º Suplente", office: "Tabelião do 2º Ofício de Nova Vila Rica/MT", photo: "d5fz6pwv6DAwOgYKAYY3P9cCLY" },
  { name: "Vanessa Silva Tiago Fujii", role: "3º Suplente", office: "Tabeliã do 2º Ofício de Nortelândia/MT", photo: "abBslLoh1BYJAS8BscQ1JtrPtA" },
];

// Desfoque progressivo na base da foto: 8 camadas de backdrop-blur crescente (igual ao Framer).
const BLUR_LAYERS = [0.0390625, 0.078125, 0.15625, 0.3125, 0.625, 1.25, 2.5, 5];

const ProgressiveBlur = () => (
  <div className="pointer-events-none absolute inset-x-0 top-[10px] h-[274px]">
    {BLUR_LAYERS.map((b, i) => {
      const s = i * 12.5;
      const mask = `linear-gradient(rgba(0,0,0,0) ${s}%, #000 ${s + 12.5}%, #000 ${s + 25}%, rgba(0,0,0,0) ${s + 37.5}%)`;
      return (
        <div
          key={b}
          className="absolute inset-0 rounded-[34px]"
          style={{ backdropFilter: `blur(${b}px)`, WebkitBackdropFilter: `blur(${b}px)`, maskImage: mask, WebkitMaskImage: mask }}
        />
      );
    })}
  </div>
);

const MemberCard = ({ m }: { m: Member }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
      className="flex w-[300px] flex-col gap-[14px] rounded-[44px_44px_34px_34px] bg-white p-2.5"
    >
      <div className="relative h-[260px] overflow-hidden rounded-[34px] shadow-[0_0.8px_0.8px_-0.5px_rgba(0,0,0,0.08),0_2.4px_2.4px_-1px_rgba(0,0,0,0.08),0_6.4px_6.4px_-1.5px_rgba(0,0,0,0.09),0_20px_20px_-2px_rgba(0,0,0,0.12)]">
        <img
          src={img(m.photo)}
          alt={m.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: m.position ?? "50% 50%" }}
        />
        <ProgressiveBlur />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="text-[16px] font-medium leading-[1.2] text-white">{m.name}</h3>
          <p className="text-[12px] font-normal leading-[1.2] text-white/60">{m.role}</p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="office"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 36 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className="flex items-center justify-center overflow-hidden rounded-2xl bg-[#2a2d33] px-3 text-center text-[10px] font-normal leading-[1.2] text-[#eff2f5]"
          >
            {m.office}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? `Recolher informações de ${m.name}` : `Ver cartório de ${m.name}`}
        className="mx-auto flex h-6 w-[180px] items-center justify-center rounded-[14px] text-[#2a2d33] backdrop-blur-[5px]"
      >
        <CaretDown size={24} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
    </motion.div>
  );
};

const Header = ({ badge, title, delay = 0 }: { badge: string; title: string; delay?: number }) => (
  <div className="flex flex-col items-center border-b border-[#2a2d33]/10 pb-4">
    <Reveal y={10} delay={delay} transition={{ type: "spring", bounce: 0, duration: 0.6 }}>
      <span className="inline-flex h-6 items-center rounded-full bg-[#2a2d33] px-4 text-[10px] font-light text-[#eff2f5] min-[810px]:h-[26px] min-[810px]:text-[12px]">
        {badge}
      </span>
    </Reveal>
    <Reveal y={10} delay={delay + 0.2} transition={{ type: "spring", bounce: 0, duration: 0.6 }}>
      <h2 className="mt-2.5 text-center text-[28px] font-semibold leading-[1.2] text-[#0061ff] min-[810px]:text-[48px]">{title}</h2>
    </Reveal>
  </div>
);

const Grid = ({ members, delay = 0 }: { members: Member[]; delay?: number }) => (
  <Reveal y={10} delay={delay} transition={{ type: "spring", bounce: 0, duration: 0.6 }}>
    <div className="mx-auto mt-8 grid w-fit grid-cols-1 items-start gap-8 min-[680px]:grid-cols-2 min-[1000px]:grid-cols-3">
      {members.map((m) => (
        <MemberCard key={m.name} m={m} />
      ))}
    </div>
  </Reveal>
);

const Diretoria = () => (
  <SiteLayout
    title="Diretoria | Cartórios de Protesto de Mato Grosso"
    description="Diretoria e Conselho Fiscal do IEPTB-MT, gestão 2025/2026: os tabeliães de protesto que conduzem o instituto em Mato Grosso."
  >
    <section className="px-4 pb-16 pt-[53px] min-[810px]:px-[72px] min-[810px]:pt-16 min-[1200px]:pt-[110px]">
      <Header badge="Gestão 2025/2026" title="Diretoria" />
      <Grid members={DIRETORIA} delay={0.4} />
      <div className="mt-16">
        <Header badge="Titulares e Suplentes" title="Conselho Fiscal" />
        <Grid members={CONSELHO} delay={0.4} />
      </div>
    </section>
  </SiteLayout>
);

export default Diretoria;
