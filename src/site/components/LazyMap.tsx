import { useEffect, useRef, useState } from "react";
import { EXTERNAL } from "../data";

/**
 * Mapa do Google que só é montado quando chega perto da tela. O iframe do Maps puxa ~170 KB de
 * scripts; carregá-lo sob demanda mantém a abertura da página leve. Até lá, um placeholder do
 * mesmo tamanho evita deslocamento de layout.
 */
const LazyMap = ({ title, className = "" }: { title: string; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`bg-[#e5e3df] ${className}`}>
      {show && (
        <iframe
          title={title}
          src={EXTERNAL.mapsEmbed}
          className="block h-full w-full border-0"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </div>
  );
};

export default LazyMap;
