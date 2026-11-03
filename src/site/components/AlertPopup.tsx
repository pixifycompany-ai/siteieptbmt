import { X } from "lucide-react";
import { img, srcSet } from "../data";

/**
 * Comunicado urgente que abre assim que a página termina de carregar (uma vez por sessão do navegador).
 *
 * Não depende do React: vem no HTML pré-renderizado (oculto) e o script do <head> de index.html abre
 * e fecha o aviso pela classe html.alert-open, mesmo antes da hidratação. Abrir só após o "load" deixa
 * a foto do hero carregar primeiro. Para publicar um comunicado novo: troque a arte e o ALERT_ID de index.html.
 */
const AlertPopup = () => (
  <div
    data-alert-popup
    role="dialog"
    aria-modal="true"
    aria-labelledby="alert-popup-title"
    className="fixed inset-0 z-[70] hidden items-center justify-center overflow-y-auto bg-[#0b1220]/75 p-4 backdrop-blur-sm"
  >
    <div
      className="site-appear relative w-full"
      style={{ maxWidth: "min(640px, calc((100svh - 104px) * 0.8))", "--appear-y": "16px" } as React.CSSProperties}
    >
      <h2 id="alert-popup-title" className="sr-only">
        Alerta de golpe: falsas notificações de protesto em nome da CENPROT
      </h2>
      <img
        src={img("alerta-golpe-cenprot", 800)}
        srcSet={srcSet("alerta-golpe-cenprot")}
        sizes="(min-width: 680px) 640px, calc(100vw - 32px)"
        width={800}
        height={1000}
        loading="lazy"
        decoding="async"
        alt={
          "Alerta de golpe: falsas notificações de protesto em nome da CENPROT. Golpistas estão usando o nome e a marca da " +
          "CENPROT em mensagens de WhatsApp para direcionar pessoas a páginas falsas, que podem solicitar dados pessoais e até " +
          "reconhecimento facial. Fique atento aos sinais: cobrança com prazo de 24 horas e pressão para pagar imediatamente; " +
          "ameaças de bloqueio de contas, PIX, passaporte e outras restrições; perfil com nome de empresa sem relação com a " +
          "CENPROT ou com o cartório, mesmo usando a marca; links para páginas que pedem documentos, selfies ou reconhecimento " +
          "facial. A presença do seu nome, CPF e de um número de protocolo não comprova que a mensagem é verdadeira. Não " +
          "clique, não forneça dados e não faça pagamentos sem verificar. Acesse os canais oficiais da CENPROT por conta " +
          "própria ou procure diretamente o cartório. Não use o link suspeito para confirmar a autenticidade da mensagem."
        }
        className="block h-auto w-full rounded-2xl bg-[#0a57e8] shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
      />
      <button
        type="button"
        data-alert-close
        aria-label="Fechar aviso"
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2a2d33] shadow-lg transition-colors hover:bg-[#eff2f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0061ff]"
      >
        <X className="h-5 w-5" strokeWidth={2} />
      </button>
      <button
        type="button"
        data-alert-close
        className="mx-auto mt-4 flex h-12 items-center rounded-full bg-white px-8 text-[15px] font-medium text-[#0061ff] shadow-lg transition-colors hover:bg-[#eff2f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1220]"
      >
        Entendi
      </button>
    </div>
  </div>
);

export default AlertPopup;
