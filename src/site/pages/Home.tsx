import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Mail, Phone } from "lucide-react";
import { blogUrl } from "@/lib/hosts";
import { SEO } from "../seo";
import SiteLayout, { SectionBadge } from "../components/SiteLayout";
import NewsGrid from "../components/NewsGrid";
import LazyMap from "../components/LazyMap";
import { CountUp, Reveal, SLIDE_IN, TWEEN_SECTION } from "../components/motion";
import { ADDRESS, CONTACTS, EXTERNAL, WHATSAPP_URL, img, srcSet, tel } from "../data";

const SOLUTIONS = [
  {
    title: "Consulta de Protesto",
    description: "Consulta gratuita por CPF ou CNPJ na plataforma oficial do IEPTB-BR",
    image: "LFyuOmQeLW8xYCSaK9Ai5xqY0",
  },
  {
    title: "Cancelamento Eletrônico",
    description: "Cancele protestos 100% online, sem ir ao cartório, com validade jurídica.",
    image: "kbyGxA11oIjNr1Hnlu6mzaeZooE",
  },
  {
    title: "Central de Remessa",
    description: "Envie arquivos de títulos para protesto com praticidade e rastreabilidade.",
    image: "REtfIkNvsjxYxCsD790UZo1Dquw",
  },
  {
    title: "Convênio",
    description: "Parcerias estratégicas.",
    image: "9Df0AS6XJ8kd3agQZDYe80DqMnk",
  },
];

const FAQ = [
  {
    q: "O que é protesto de títulos?",
    a: "O protesto é um ato formal e público, realizado pelo tabelião, que comprova o não cumprimento de uma obrigação representada em título ou documento. Regulado pela Lei Federal nº 9.492/1997, ele tem duas funções principais: dar publicidade oficial à pendência e oferecer uma via extrajudicial, rápida e segura, para a sua regularização, sem a necessidade de ação na Justiça.",
  },
  {
    q: "Quem paga os emolumentos cobrados pelo cartório?",
    a: "Em regra, quem paga é o devedor, no momento da quitação da dívida no tabelionato (art. 19 da Lei 9.492/97). O credor não tem custo direto para apresentar o título a protesto — uma das principais vantagens desse mecanismo em comparação com a via judicial. Se o devedor não pagar e o protesto for lavrado, posteriormente ele também arca com as custas do cancelamento.",
  },
  {
    q: "Quanto tempo tenho para pagar antes que o protesto seja registrado?",
    a: "Após receber a intimação do cartório, o devedor tem 3 dias úteis para efetuar o pagamento e evitar o protesto (art. 12 e art. 15, §1º da Lei 9.492/97). Esse prazo começa a contar a partir da data da intimação concretizada, não do vencimento do título.",
  },
  {
    q: "Quero protestar um título. Como faço?",
    a: "Pessoas físicas e jurídicas podem firmar convênio com o Cartórios de Protesto MT e enviar os títulos eletronicamente pela Central de Remessa de Arquivos (CRA-MT), com mais agilidade e custo operacional reduzido.",
  },
];

const SectionTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h2
    className={`text-balance px-4 text-center text-[28px] font-semibold leading-none text-[#2a2d33] min-[810px]:text-[40px] min-[1200px]:text-[48px] ${className}`}
  >
    {children}
  </h2>
);

const Hero = () => (
  <section className="relative -mt-[10px] h-[calc(100svh-70px)] min-h-[560px] overflow-hidden">
    <img
      src={img("l02yOJdgGRdf1I3Vrawzmx2k", 1920)}
      srcSet={srcSet("l02yOJdgGRdf1I3Vrawzmx2k")}
      sizes="100vw"
      alt=""
      className="absolute inset-0 h-full w-full object-cover object-[59.4%_44.2%] min-[810px]:object-[50%_0%]"
      fetchPriority="high"
    />
    {/* Névoa clara à esquerda: mesmo gradiente vetorial do Framer (sólido até 40%, some em 62%, opacidade .84) */}
    <div className="absolute left-0 top-0 h-full w-[724px] bg-[linear-gradient(90deg,#eff2f5_40%,rgba(239,242,245,0)_62%)] opacity-[0.84] min-[810px]:w-full min-[1200px]:w-[1366px]" />
    <div className="relative flex h-full flex-col items-center justify-center px-6 pb-10 text-center min-[810px]:items-start min-[810px]:px-16 min-[810px]:text-left min-[1200px]:px-32 min-[1200px]:pb-[8vh]">
      <Reveal immediate>
        <span className="inline-flex h-[19px] items-center rounded-full bg-[#2a2d33] px-2.5 text-[9px] font-light leading-none text-[#eff2f5] min-[810px]:h-[22px] min-[810px]:text-[12px]">
          Cartórios de Protesto · MT
        </span>
        <h1 className="mt-2.5 max-w-[558px] text-[28px] font-medium leading-none text-[#0061ff] min-[810px]:text-[38px]">
          Protesto de títulos com segurança jurídica
        </h1>
        <p className="mx-auto mt-2.5 max-w-[300px] text-[14px] font-light leading-[1.2] text-[#2a2d33] min-[810px]:mx-0 min-[810px]:max-w-[558px] min-[810px]:text-[13px]">
          Rápido, digital e com a segurança jurídica dos Cartórios de Mato Grosso.
        </p>
      </Reveal>
      <Reveal immediate delay={0.1} className="mt-6 flex w-[280px] flex-col gap-4 min-[810px]:w-auto min-[810px]:flex-row min-[810px]:gap-6">
        <a
          href={EXTERNAL.pesquisaProtesto}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[49px] items-center justify-center rounded-lg bg-[#2a2d33] px-4 text-[14px] font-light text-[#eff2f5] transition-colors duration-300 hover:bg-[#0061ff] min-[810px]:h-[51px] min-[810px]:text-[16px]"
        >
          Pesquisar protesto
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[49px] items-center justify-center rounded-lg border border-[#0061ff] bg-[#eff2f5]/20 px-4 text-[14px] font-normal text-[#0061ff] backdrop-blur-[2px] transition-colors duration-300 hover:bg-[#0061ff] hover:text-white min-[810px]:h-[51px] min-[810px]:text-[16px]"
        >
          Quero ser conveniado
        </a>
      </Reveal>
      <Reveal immediate delay={0.2} className="mt-12 text-left min-[810px]:mt-8">
        <div className="flex items-center gap-2">
          <span className="text-[44px] font-medium leading-none text-[#0061ff]">+</span>
          <CountUp to={140} className="text-[64px] font-medium leading-none text-[#2a2d33]" />
        </div>
        <p className="text-[14px] font-light leading-none text-[#2a2d33]">munícipios atendidos</p>
      </Reveal>
    </div>
  </section>
);

const Solutions = () => (
  <section className="flex flex-col items-center justify-center bg-white px-4 py-8 min-[810px]:py-24 min-[1200px]:min-h-[900px] min-[1200px]:py-[219px]">
    <SectionBadge>Soluções para você</SectionBadge>
    <SectionTitle className="mt-2.5 max-w-[1000px]">
      Como o Cartórios de Protesto de Mato Grosso pode te ajudar
    </SectionTitle>
    <div className="mt-8 grid w-full max-w-[1272px] grid-cols-1 justify-items-center gap-6 min-[680px]:grid-cols-2 min-[1200px]:grid-cols-4">
      {SOLUTIONS.map((s) => (
        <article
          key={s.title}
          className="group relative aspect-square w-full max-w-[300px] overflow-hidden rounded-lg bg-gradient-to-br from-[#0061ff] to-[#0057e3]"
        >
          <img
            src={img(s.image, 640)}
            srcSet={srcSet(s.image)}
            sizes="300px"
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-900 ease-out-quint will-change-transform group-hover:scale-[1.08]"
          />
          {/* véu igual ao SVG do Framer: transparente em 20% → preto em 84% */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_20%,#000_84%)]" />
          <div className="absolute inset-x-6 bottom-8">
            <h3 className="text-[20px] font-medium leading-none text-[#eff2f5]">{s.title}</h3>
            <p className="mt-2.5 text-[12px] font-extralight leading-none text-[#eff2f5]/80">{s.description}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

const News = () => (
  <section className="bg-white pb-16 pt-16">
    <div className="flex flex-col items-center">
      <SectionBadge>Notícias</SectionBadge>
      <SectionTitle className="mt-2.5">Acompanhe o universo do Protesto</SectionTitle>
    </div>
    {/* As 6 notícias mais recentes, direto na página (sem rolagem interna). O zoom .9 mantém a
        escala do widget original, que rodava num iframe do blog com raiz 14.4px. */}
    <div className="mx-4 mt-8" style={{ zoom: 0.9 }}>
      <NewsGrid limit={6} />
    </div>
    <div className="mt-2 flex justify-center px-4">
      <a
        href={blogUrl("/blog")}
        className="group inline-flex h-12 items-center gap-2 rounded-lg bg-[#2a2d33] px-6 text-[15px] font-normal text-[#eff2f5] transition-colors duration-300 hover:bg-[#0061ff]"
      >
        VER MAIS
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
      </a>
    </div>
  </section>
);

const Location = () => (
  <section className="bg-[#eff2f5] px-4 pb-16 pt-16">
    <div className="flex flex-col items-center">
      <SectionBadge tone="blue">Como chegar</SectionBadge>
      <SectionTitle className="mt-2.5 !leading-[1.2]">Localização</SectionTitle>
    </div>
    <div className="mt-8 overflow-hidden rounded-[20px]">
      <LazyMap title="Mapa — Cartórios de Protesto MT" className="h-[375px] w-full" />
    </div>
    <p className="mt-2.5 text-center text-[9px] font-light leading-[1.2] text-[#2a2d33] min-[810px]:text-[13px]">{ADDRESS}</p>
  </section>
);

const FaqItem = ({ index, q, a, open, onToggle }: { index: number; q: string; a: string; open: boolean; onToggle: () => void }) => (
  <div className="rounded-2xl bg-white shadow-[0_0.7px_0.7px_-1.25px_rgba(0,0,0,0.04),0_1.8px_1.8px_-2.5px_rgba(0,0,0,0.04),0_3.6px_3.6px_-3.75px_rgba(0,0,0,0.04),0_10px_10px_-5px_rgba(0,0,0,0.04)]">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center gap-4 px-8 py-[18px] text-left"
    >
      <span className="shrink-0 text-[20px] font-normal leading-8 text-[#6c737f]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="flex-1 text-[14px] font-medium leading-5 text-[#1f2a37]">{q}</span>
      <ChevronDown
        className={`h-5 w-5 shrink-0 text-[#6c737f] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        strokeWidth={1.5}
      />
    </button>
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          className="overflow-hidden"
        >
          <p className="pb-[18px] pl-6 pr-8 text-[14px] font-normal leading-5 text-[#384250]">{a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ContactCircle = ({ children }: { children: React.ReactNode }) => (
  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#f9fafb] to-[#d2d6db]">
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0061ff] text-white">{children}</span>
  </span>
);

const Faq = () => {
  // No original cada pergunta abre/fecha de forma independente; a primeira já vem aberta.
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  return (
    <section className="bg-white pb-16 pt-16 min-[810px]:px-4">
      <div className="flex flex-col items-center">
        <SectionBadge>FAQ</SectionBadge>
        <SectionTitle className="mt-2.5">Dúvidas recorrentes que escutamos</SectionTitle>
      </div>
      <div className="mx-auto mt-8 max-w-[1200px] bg-white p-4 min-[810px]:p-0 min-[1200px]:p-8">
        <div className="relative overflow-hidden rounded-[32px] border border-[#e5e7eb] bg-gradient-to-b from-[#f3f4f6] to-[#f9fafb] p-4 min-[810px]:border-0 min-[810px]:p-12">
          <span
            aria-hidden="true"
            className="gradient-text pointer-events-none absolute bottom-[26px] left-[27px] hidden select-none bg-[linear-gradient(0deg,rgba(228,230,235,0)_0%,#d2d6db_100%)] font-['Figtree','Figtree_Fallback',sans-serif] text-[250px] font-semibold leading-[1.3] min-[810px]:block"
          >
            FAQ
          </span>
          <div className="relative grid gap-10 min-[1000px]:grid-cols-2">
            <div>
              <Reveal y={50} opacity={1} transition={TWEEN_SECTION}>
                <h3 className="gradient-text inline-block bg-[linear-gradient(0deg,#111927_0%,#6c737f_100%)] text-[32px] font-semibold leading-10">
                  Quer saber mais?
                </h3>
                <p className="mt-2.5 text-[16px] font-normal leading-6 text-[#384250]">Fale com a gente</p>
              </Reveal>
              <Reveal y={50} opacity={1} transition={TWEEN_SECTION} className="mt-[50px] space-y-3">
                <a href={tel(CONTACTS.institucional.phone)} className="flex items-center gap-2 text-[14px] font-normal text-[#2a2d33] hover:text-[#0061ff]">
                  <ContactCircle>
                    <Phone className="h-4 w-4" strokeWidth={1.5} />
                  </ContactCircle>
                  {CONTACTS.institucional.phone}
                </a>
                <a href={`mailto:${CONTACTS.institucional.email}`} className="flex items-center gap-2 break-all text-[14px] font-normal text-[#2a2d33] hover:text-[#0061ff]">
                  <ContactCircle>
                    <Mail className="h-4 w-4" strokeWidth={1.5} />
                  </ContactCircle>
                  {CONTACTS.institucional.email}
                </a>
              </Reveal>
            </div>
            <Reveal x={150} y={0} transition={SLIDE_IN} amount={0.5} className="space-y-5">
              {FAQ.map((item, i) => (
                <FaqItem key={item.q} index={i} {...item} open={open.has(i)} onToggle={() => toggle(i)} />
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

const Home = () => (
  <SiteLayout {...SEO["/"]}>
    <Hero />
    <Solutions />
    <News />
    <Location />
    <Faq />
  </SiteLayout>
);

export default Home;
