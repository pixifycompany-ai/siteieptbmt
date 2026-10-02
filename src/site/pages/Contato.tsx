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
import SiteLayout from "../components/SiteLayout";
import { Reveal } from "../components/motion";
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
  <SiteLayout title="Contato | Cartórios de Protesto de Mato Grosso" background="#ffffff">
    {/* Cabeçalho + canais */}
    <section className="px-4 pb-12 pt-12 min-[810px]:px-16 min-[1200px]:pt-[54px]">
      <Reveal>
        <p className="text-[12px] font-light leading-[1.2] text-[#0061ff]">Fale com a equipe certa</p>
        <h1 className="text-[36px] font-medium leading-[1.3] text-[#2a2d33] min-[810px]:text-[48px]">
          Como podemos ajudar você?
        </h1>
        <p className="mt-2.5 text-[16px] font-light leading-[1.2] text-[#2a2d33]">
          Cada motivo de contato tem um canal direto. Escolha abaixo para falar com quem resolve mais rápido.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 min-[1000px]:grid-cols-3">
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
              className="mt-2.5 flex items-center gap-2.5 text-[18px] font-light leading-[1.2] text-[#2a2d33] transition-colors hover:text-[#0061ff]"
            >
              <Phone size={18} />
              {c.phone}
            </a>
            <a
              href={`mailto:${c.email}`}
              className="mt-2.5 flex items-center gap-2.5 break-all text-[18px] font-light leading-[1.2] text-[#2a2d33] transition-colors hover:text-[#0061ff]"
            >
              <EnvelopeSimple size={18} className="shrink-0" />
              {c.email}
            </a>
          </div>
        ))}
      </div>
    </section>

    {/* Mapa + horário + WhatsApp */}
    <section className="grid gap-8 px-4 pb-16 pt-8 min-[810px]:px-16 min-[1200px]:grid-cols-[527px_656px] min-[1200px]:justify-between">
      <div className="flex flex-col overflow-hidden rounded-[20px] border border-[#2a2d33]/10 min-[1200px]:h-[500px]">
        <iframe
          title="Mapa — Sede do Cartórios de Protesto MT"
          src={EXTERNAL.mapsEmbed}
          className="block h-[375px] w-full shrink-0 border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="flex flex-1 flex-wrap items-center justify-between gap-4 py-6 pl-8 pr-6">
          <div>
            <p className="text-[18px] font-medium leading-[1.3] text-[#2a2d33]">CARTÓRIOS DE PROTESTO MT · Sede</p>
            <p className="mt-2.5 text-[16px] font-light leading-[1.3] text-[#2a2d33]">
              Rua General Amilcar Magalhães, 38
              <br />
              Duque de Caxias, Cuiabá–MT
            </p>
          </div>
          <a
            href={MAPS_SHARE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[34px] items-center gap-1.5 rounded-full bg-[#0061ff] px-4 text-[14px] font-medium text-[#eff2f5] transition-colors hover:bg-[#2a2d33]"
          >
            Abrir no Maps
            <ArrowUpRight size={14} weight="bold" />
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="rounded-[20px] bg-[#0061ff] px-8 pb-6 pt-4 text-[#eff2f5]">
          <p className="text-[18px] font-medium leading-[1.3]">HORÁRIO DE FUNCIONAMENTO</p>
          <p className="mt-2.5 flex items-center gap-2.5 text-[16px] font-light leading-[1.3]">
            <Clock size={24} />
            Segunda a sexta, 8h às 17h.
          </p>
          <p className="mt-2.5 flex items-center gap-2.5 text-[16px] font-light leading-[1.3]">
            <CalendarDots size={24} />
            Exceto feriados nacionais
          </p>
        </div>

        <div className="flex flex-1 flex-col rounded-[20px] bg-[#2a2d33] p-8 text-[#eff2f5] min-[1200px]:min-h-[337px]">
          <div className="flex items-center gap-2.5">
            <ChatCircle size={48} color="#00d4d4" />
            <p className="text-[40px] font-medium leading-[1.3] min-[810px]:text-[48px]">WhatsApp</p>
          </div>
          <p className="mt-2.5 text-[20px] font-light leading-[1.3] min-[810px]:text-[24px]">
            Resposta rápida em horário comercial.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 flex h-[45px] w-fit items-center rounded-full bg-[#eff2f5] px-5 text-[16px] font-medium text-[#2a2d33] transition-colors hover:bg-white min-[1200px]:mt-auto"
          >
            Iniciar conversa
          </a>
        </div>
      </div>
    </section>
  </SiteLayout>
);

export default Contato;
