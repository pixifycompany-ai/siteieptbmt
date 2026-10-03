import type { ReactNode } from "react";
import {
  ArrowUpRight,
  CalendarDots,
  ChatCircle,
  Clock,
  EnvelopeSimple,
  MagnifyingGlass,
  Phone,
  UploadSimple,
  UserPlus,
} from "@phosphor-icons/react";
import { SEO } from "../seo";
import SiteLayout from "../components/SiteLayout";
import { Reveal } from "../components/motion";
import LazyMap from "../components/LazyMap";
import { CONTACTS, EXTERNAL, WHATSAPP_URL, tel } from "../data";

const MAPS_SHARE = "https://share.google/mnS2B0CzDrfcK8dAA";

const CHANNELS: { label: string; title: string; description: string; icon: ReactNode; phone: string; email: string }[] = [
  {
    label: "DÚVIDAS GERAIS",
    title: "Atendimento institucional",
    description: "Informações sobre o IEPTB-MT, imprensa e parcerias.",
    icon: <MagnifyingGlass size={18} color="#0061ff" />,
    ...CONTACTS.institucional,
  },
  {
    label: "ENVIO DE TÍTULOS",
    title: "Central de remessa (CRA-MT)",
    description: "Suporte técnico e operacional para conveniados.",
    icon: <UploadSimple size={18} color="#0061ff" />,
    ...CONTACTS.cra,
  },
  {
    label: "QUERO CONTRATAR",
    title: "Convênios e novos clientes",
    description: "Falar com um consultor sobre planos e condições.",
    icon: <UserPlus size={18} color="#0061ff" />,
    ...CONTACTS.comercial,
  },
];

const Contato = () => (
  <SiteLayout {...SEO["/contato"]} background="#ffffff">
    {/* Cabeçalho + canais */}
    <section className="px-6 pb-12 pt-[94px] min-[810px]:px-16 min-[810px]:pt-12 min-[1200px]:pt-[54px]">
      <Reveal immediate>
        <p className="text-[12px] font-light leading-[1.2] text-[#0061ff]">Fale com a equipe certa</p>
        <h1 className="text-[28px] font-medium leading-[1.3] text-[#2a2d33] min-[810px]:text-[48px]">
          Como podemos ajudar você?
        </h1>
        <p className="mt-2.5 text-[13px] font-light leading-[1.2] text-[#2a2d33] min-[810px]:text-[16px]">
          Cada motivo de contato tem um canal direto. Escolha abaixo para falar com quem resolve mais rápido.
        </p>
      </Reveal>

      <div className="mt-2 grid gap-6 min-[810px]:mt-12 min-[1000px]:grid-cols-3">
        {CHANNELS.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-[#eff2f5] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#eff2f5]">
              {c.icon}
            </span>
            <p className="mt-2.5 text-[10px] font-normal leading-[1.2] text-[#2a2d33]">{c.label}</p>
            <h2 className="mt-1 text-[18px] font-medium leading-[1.2] text-[#2a2d33]">{c.title}</h2>
            <p className="mt-1 text-[14px] font-light leading-[1.2] text-[#2a2d33]">{c.description}</p>
            <a
              href={tel(c.phone)}
              className="mt-2.5 flex items-center gap-2.5 text-[14px] font-light leading-[1.2] text-[#2a2d33] transition-colors hover:text-[#0061ff] min-[810px]:text-[18px]"
            >
              <Phone className="h-3.5 w-3.5 min-[810px]:h-[18px] min-[810px]:w-[18px]" />
              {c.phone}
            </a>
            <a
              href={`mailto:${c.email}`}
              className="mt-2.5 flex items-center gap-2.5 break-all text-[13px] font-light leading-[1.2] text-[#2a2d33] transition-colors hover:text-[#0061ff] min-[810px]:text-[18px]"
            >
              <EnvelopeSimple className="h-3.5 w-3.5 shrink-0 min-[810px]:h-[18px] min-[810px]:w-[18px]" />
              {c.email}
            </a>
          </div>
        ))}
      </div>
    </section>

    {/* Mapa + horário + WhatsApp */}
    <section className="grid gap-8 px-6 pb-8 pt-0 min-[810px]:px-16 min-[810px]:pb-16 min-[810px]:pt-8 min-[1200px]:grid-cols-[527px_656px] min-[1200px]:justify-between">
      <div className="order-last mt-8 flex flex-col overflow-hidden rounded-[20px] border border-[#2a2d33]/10 min-[810px]:mt-0 min-[1200px]:order-none min-[1200px]:h-[500px]">
        <LazyMap title="Mapa — Sede do Cartórios de Protesto MT" className="h-[375px] w-full shrink-0" />
        <div className="flex flex-1 flex-col items-start justify-between gap-4 px-6 py-5 min-[810px]:flex-row min-[810px]:flex-wrap min-[810px]:items-center min-[810px]:py-6 min-[810px]:pl-8 min-[810px]:pr-6">
          <div>
            <p className="text-[15px] font-medium leading-[1.3] text-[#2a2d33] min-[810px]:text-[18px]">CARTÓRIOS DE PROTESTO MT · Sede</p>
            <p className="mt-1 text-[13px] font-light leading-[1.3] text-[#2a2d33] min-[810px]:mt-2.5 min-[810px]:text-[16px]">
              Rua General Amilcar Magalhães, 38
              <br />
              Duque de Caxias, Cuiabá–MT
            </p>
          </div>
          <a
            href={MAPS_SHARE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 items-center gap-1.5 rounded-full bg-[#0061ff] px-3 text-[12px] font-medium text-white transition-colors hover:bg-[#2a2d33] min-[810px]:h-[34px] min-[810px]:px-4 min-[810px]:text-[14px]"
          >
            Abrir no Maps
            <ArrowUpRight size={14} weight="bold" />
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="rounded-[20px] bg-[#0061ff] px-8 pb-6 pt-4 text-white">
          <p className="text-[18px] font-medium leading-[1.3]">HORÁRIO DE FUNCIONAMENTO</p>
          <p className="mt-2.5 flex items-center gap-2.5 text-[14px] font-light leading-[1.3] min-[810px]:text-[16px]">
            <Clock className="h-4 w-4 min-[810px]:h-6 min-[810px]:w-6" />
            Segunda a sexta, 8h às 17h.
          </p>
          <p className="mt-2.5 flex items-center gap-2.5 text-[14px] font-light leading-[1.3] min-[810px]:text-[16px]">
            <CalendarDots className="h-4 w-4 min-[810px]:h-6 min-[810px]:w-6" />
            Exceto feriados nacionais
          </p>
        </div>

        <div className="flex flex-1 flex-col rounded-[20px] bg-[#2a2d33] px-6 py-4 text-[#eff2f5] min-[810px]:p-8 min-[1200px]:min-h-[337px]">
          <div className="flex items-center gap-2.5">
            <ChatCircle color="#00d4d4" className="h-6 w-6 min-[810px]:h-12 min-[810px]:w-12" />
            <p className="text-[24px] font-medium leading-[1.3] min-[810px]:text-[48px]">WhatsApp</p>
          </div>
          <p className="mt-2.5 text-[14px] font-light leading-[1.3] min-[810px]:text-[24px]">
            Resposta rápida em horário comercial.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-16 flex h-[42px] w-fit items-center rounded-full bg-[#eff2f5] px-4 text-[14px] font-medium text-[#2a2d33] transition-colors hover:bg-white min-[810px]:mt-10 min-[810px]:h-[45px] min-[810px]:px-5 min-[810px]:text-[16px] min-[1200px]:mt-auto"
          >
            Iniciar conversa
          </a>
        </div>
      </div>
    </section>
  </SiteLayout>
);

export default Contato;
