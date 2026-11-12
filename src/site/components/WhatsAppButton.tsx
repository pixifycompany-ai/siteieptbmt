import { WHATSAPP_URL } from "../data";
import { WhatsAppIcon } from "./icons";

/**
 * Botão fixo de WhatsApp no canto inferior direito: abre a conversa com o comercial, (65) 99612-7651,
 * com a mensagem inicial de WHATSAPP_URL. É um link simples, já no HTML pré-renderizado (sem script externo).
 */
const WhatsAppButton = () => (
  <a
    data-whatsapp-float
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Fale conosco pelo WhatsApp"
    title="Fale conosco pelo WhatsApp"
    className="fixed bottom-5 right-5 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-[#0061ff] text-white shadow-[0_10px_30px_-8px_rgba(0,97,255,0.55)] transition-[transform,box-shadow] duration-300 ease-out-quint hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-8px_rgba(0,97,255,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0061ff] focus-visible:ring-offset-2 motion-reduce:transition-none"
  >
    <WhatsAppIcon className="h-7 w-7" />
  </a>
);

export default WhatsAppButton;
