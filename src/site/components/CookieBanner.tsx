import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const KEY = "cpmt-cookie-consent";

const readConsent = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readConsent()) return;
    const t = window.setTimeout(() => setVisible(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  const choose = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* armazenamento indisponível: apenas fecha */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Aviso de cookies"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-[720px] rounded-2xl border border-white/[0.08] bg-[#101114] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] min-[810px]:bottom-6"
        >
          <div className="flex flex-col gap-4 min-[810px]:flex-row min-[810px]:items-center min-[810px]:gap-6">
            <div className="flex-1">
              <p className="text-[15px] font-bold text-[#f5f5f7]">Nós usamos cookies</p>
              <p className="mt-1 text-[13.5px] leading-[1.5] text-[#b6b8bf]">
                Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo. Ao
                continuar navegando, você concorda com a nossa{" "}
                <Link to="/privacidade" className="text-[#7aa2ff] underline underline-offset-2">
                  Política de Privacidade
                </Link>
                .
              </p>
            </div>
            <div className="flex shrink-0 gap-2.5">
              <button
                type="button"
                onClick={() => choose("declined")}
                className="h-[45px] flex-1 rounded-[10px] border border-white/[0.18] px-5 text-[14px] font-semibold text-[#d4d6dd] transition-colors hover:bg-white/5 min-[810px]:flex-none"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="h-[45px] flex-1 rounded-[10px] bg-white px-5 text-[14px] font-semibold text-[#101114] transition-colors hover:bg-[#e5e7eb] min-[810px]:flex-none"
              >
                Aceitar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
