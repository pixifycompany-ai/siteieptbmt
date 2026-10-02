import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SiteLayout from "../components/SiteLayout";
import { Reveal } from "../components/motion";
import { img } from "../data";

type Person = {
  name: string;
  role: string;
  description: string;
  /** foto da frente (círculo) e do verso (quadrado); sem foto = placeholder listrado do Framer */
  front?: { photo: string; position: string };
  back?: { photo: string; position: string };
};

const TEAM: Person[] = [
  {
    name: "Laura Amaranta",
    role: "Gestora",
    description: "Experiência em coordenação de operações, controle financeiro e otimização de processos.",
    front: { photo: "tFZYmJNEG3c9AvHgTBRYQmCWA", position: "62.1% 32.5%" },
  },
  {
    name: "Ana Paula",
    role: "Auxiliar de Gestão",
    description:
      "Auxilia na organização e execução de processos administrativos e operacionais e faz o intermédio das demandas entre equipes, clientes e fornecedores.",
    front: { photo: "gnrAC7XJ5LVCIb4hL1VWnvPkGA", position: "48.6% 24.3%" },
    back: { photo: "gnrAC7XJ5LVCIb4hL1VWnvPkGA", position: "48.8% 21.1%" },
  },
  {
    name: "Joelson Oliveira",
    role: "Gerente Comercial",
    description:
      "Responsável por planejar, coordenar e acompanhar as estratégias de vendas e relacionamento com clientes. Atua na prospecção de novos negócios, manutenção de parcerias e análise de resultados.",
    front: { photo: "uX5mBxtvxl3sx2ktrkIBCtOxkg", position: "47% 2%" },
    back: { photo: "uX5mBxtvxl3sx2ktrkIBCtOxkg", position: "46.5% 7.7%" },
  },
  {
    name: "Aline Mozer",
    role: "Coordenadora Comercial",
    description:
      "Responsável por coordenar a equipe comercial, acompanhar metas e resultados, organizar rotinas e estratégias de atendimento e prospecção.",
    front: { photo: "FtAT9Kr6S2NFPLCMieqqDXCr43o", position: "55.8% 44%" },
    back: { photo: "FtAT9Kr6S2NFPLCMieqqDXCr43o", position: "55.6% 43.7%" },
  },
  {
    name: "Walmir Dias",
    role: "Logística",
    description:
      "Organiza, armazena e distribui documentos, entre eles, os instrumentos de protesto, garantindo segurança, conformidade e eficiência nos processos documentais.",
    front: { photo: "EzvfGzcpxCw703Q2BkKGeMlUzVo", position: "49.8% 25.1%" },
    back: { photo: "EzvfGzcpxCw703Q2BkKGeMlUzVo", position: "48.8% 24.6%" },
  },
  {
    name: "Ernandes Ferraz",
    role: "Auxiliar Administrativo",
    description:
      "Atendimento ao público. Suporte aos usuários da Central de Remessa de Arquivos e aos cartórios de protesto.",
    front: { photo: "UqqCe2iFf4KczzS2l1GjjxqWsOo", position: "46.7% 16.8%" },
    back: { photo: "UqqCe2iFf4KczzS2l1GjjxqWsOo", position: "48.6% 14.6%" },
  },
  {
    name: "Alfredo Callejas",
    role: "Auxiliar Administrativo",
    description:
      "Atendimento ao público. Suporte aos usuários da Central de Remessa de Arquivos e aos cartórios de protesto.",
    front: { photo: "HLrMV4aDL11t1PXGtjEkNG5K8G0", position: "56.8% 27.7%" },
    back: { photo: "HLrMV4aDL11t1PXGtjEkNG5K8G0", position: "56.3% 25.8%" },
  },
  {
    name: "Carlos Camargo",
    role: "Auxiliar Administrativo",
    description:
      "Atendimento ao público. Suporte aos usuários da Central de Remessa de Arquivos e aos cartórios de protesto.",
    front: { photo: "4nJyXKvH2mkk0v9Mc1ZrqXTPF2c", position: "43% 22.5%" },
    back: { photo: "4nJyXKvH2mkk0v9Mc1ZrqXTPF2c", position: "43.5% 22.8%" },
  },
  {
    name: "Nilza Maria",
    role: "Serviços Gerais",
    description:
      "Responsável pela manutenção da limpeza, organização e conservação dos ambientes, garantindo um espaço agradável, seguro e higienizado para colaboradores e clientes.",
  },
  {
    name: "Paulo Henrique",
    role: "Assistente de Operações Comerciais",
    description:
      "Atua no suporte às atividades comerciais da empresa, auxiliando na organização de processos, atendimento a clientes, realização de atualizações cadastrais e acompanhamento de demandas operacionais.",
  },
  {
    name: "Lucas Matheus",
    role: "Assistente de Operações Comerciais",
    description:
      "Atua no suporte às atividades comerciais da empresa, auxiliando na organização de processos, atendimento a clientes, realização de atualizações cadastrais e acompanhamento de demandas operacionais.",
  },
];

// Placeholder listrado que o Framer exibe quando a imagem não foi definida.
const PLACEHOLDER = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="126" height="126"><path d="M126 0v21.584L21.584 126H0v-17.585L108.415 0H126Zm0 108.414V126h-17.586L126 108.414Zm0-84v39.171L63.585 126H24.414L126 24.414Zm0 42v39.17L105.584 126h-39.17L126 66.414ZM105.586 0 0 105.586V66.415L66.415 0h39.171Zm-42 0L0 63.586V24.415L24.415 0h39.171Zm-42 0L0 21.586V0h21.586Z" fill="rgba(136,136,136,0.2)" fill-rule="evenodd"/></svg>',
)}")`;

const Photo = ({ src, className }: { src?: { photo: string; position: string }; className: string }) =>
  src ? (
    <img src={img(src.photo)} alt="" loading="lazy" className={`${className} object-cover`} style={{ objectPosition: src.position }} />
  ) : (
    <div aria-hidden="true" className={className} style={{ backgroundImage: PLACEHOLDER, backgroundSize: "64px auto" }} />
  );

const face = "absolute inset-0 overflow-hidden rounded-2xl [backface-visibility:hidden] [-webkit-backface-visibility:hidden]";

/** Card que vira no eixo X ao passar o mouse (componente "Flip Card" do Framer: vertical, 0.6s, easeInOut). */
const FlipCard = ({ p }: { p: Person }) => {
  const [flipped, setFlipped] = useState(false);
  const reduce = useReducedMotion();
  const transition = { duration: reduce ? 0 : 0.6, ease: "easeInOut" as const };

  return (
    <div
      className="relative h-[280px] w-[250px] rounded-2xl bg-[#eff2f5]/40 shadow-[0_4px_20px_rgba(0,0,0,0.1)] [perspective:1000px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setFlipped((f) => !f)}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${p.name}, ${p.role}`}
    >
      {/* Frente */}
      <motion.div
        className={`${face} flex flex-col items-center bg-gradient-to-br from-[#f2f2f2] to-[#e8e8e8] px-6 pt-6 text-center`}
        animate={{ rotateX: flipped ? -180 : 0 }}
        transition={transition}
      >
        <Photo src={p.front} className="h-[92px] w-[92px] shrink-0 rounded-full" />
        <h3 className="mt-6 text-[20px] font-semibold leading-[1.4] text-[#2a2d33]">{p.name}</h3>
        <p className="text-[16px] font-normal leading-[1.4] text-[#2a2d33]/80">{p.role}</p>
        <p className="absolute bottom-6 text-[8px] font-extralight leading-[1.4] text-[#2a2d33]/80">passe o mouse</p>
      </motion.div>

      {/* Verso */}
      <motion.div
        className={`${face} bg-[#0061ff] p-6 text-left`}
        initial={false}
        animate={{ rotateX: flipped ? 0 : 180 }}
        transition={transition}
      >
        <h3 className="text-[20px] font-semibold leading-[1.4] text-[#eff2f5]">{p.name}</h3>
        <p className="text-[14px] font-normal leading-[1.4] text-[#eff2f5]">{p.role}</p>
        <p className="mt-4 text-[11px] font-extralight leading-[1.4] text-[#eff2f5]/80">{p.description}</p>
        <Photo src={p.back} className="absolute bottom-6 right-6 h-16 w-16 rounded-lg" />
      </motion.div>
    </div>
  );
};

const Equipe = () => (
  <SiteLayout title="Nossa Equipe | Cartórios de Protesto de Mato Grosso" background="#2a2d33">
    <section className="px-6 pb-[88px] pt-[88px] min-[810px]:px-[72px] min-[810px]:pt-16 min-[1200px]:pt-[82px]">
      <Reveal className="flex flex-col items-center border-b border-[#eff2f5]/10 pb-4">
        <span className="inline-flex h-6 items-center rounded-full bg-[#0061ff] px-4 text-[10px] font-light text-[#eff2f5] min-[810px]:h-[26px] min-[810px]:text-[12px]">
          Quem faz acontecer
        </span>
        <h1 className="mt-2.5 text-[28px] font-semibold leading-[1.2] text-[#eff2f5] min-[810px]:text-[48px]">Nossa Equipe</h1>
      </Reveal>
      {/* Mesma divisão do original: fileiras de 4, 4 e 3 (no celular cada fileira empilha). */}
      <div className="mt-12 flex flex-col items-center gap-20 min-[810px]:gap-[72px]">
        {[TEAM.slice(0, 4), TEAM.slice(4, 8), TEAM.slice(8)].map((row, i) => (
          <div key={i} className="flex max-w-[1096px] flex-wrap justify-center gap-8">
            {row.map((p) => (
              <FlipCard key={p.name} p={p} />
            ))}
          </div>
        ))}
      </div>
    </section>
  </SiteLayout>
);

export default Equipe;
