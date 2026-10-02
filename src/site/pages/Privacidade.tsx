import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "@phosphor-icons/react";
import SiteLayout from "../components/SiteLayout";
import { Reveal } from "../components/motion";
import { PRIVACY_ITEMS } from "../content/privacidade";
import { CONTACTS } from "../data";

const spring = { type: "spring" as const, bounce: 0.2, duration: 0.4 };

const Item = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-[10px] bg-[#2a2d33]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 text-left"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-white transition-colors duration-300 ${open ? "bg-transparent" : "bg-[#0061ff]"}`}
        >
          {open ? <Minus size={16} weight="bold" /> : <Plus size={16} weight="bold" />}
        </span>
        <span className="py-2 text-[12px] font-normal leading-none text-[#eff2f5] min-[810px]:text-[15px]">{question}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring}
          >
            <p className="whitespace-pre-line pb-2.5 pl-10 pr-5 text-[13px] font-light leading-[1.3] text-[#eff2f5]/80 min-[810px]:text-[15px]">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Privacidade = () => (
  <SiteLayout
    title="Aviso de Privacidade | Cartórios de Protesto de Mato Grosso"
    description="Aviso de privacidade do IEPTB-MT: quais dados pessoais tratamos, para quê, como os protegemos e como exercer seus direitos conforme a LGPD."
  >
    <section className="px-6 pb-6 pt-[62px] min-[810px]:px-16 min-[810px]:pb-16 min-[810px]:pt-8 min-[1200px]:pt-[22px]">
      <Reveal>
        <h1 className="text-center text-[28px] font-medium leading-[1.4] text-[#2a2d33] min-[810px]:text-[48px]">
          Aviso de privacidade
        </h1>
      </Reveal>

      <div className="mx-auto mt-6 max-w-[858px] space-y-3">
        {PRIVACY_ITEMS.map((item) => (
          <Item key={item.question} {...item} />
        ))}
      </div>

      <div className="mt-6 space-y-0 text-center text-[13px] font-light leading-[1.5] text-[#2a2d33]/90 min-[810px]:text-[14px]">
        <p className="min-[1440px]:-mx-4 min-[1440px]:whitespace-nowrap">
          Em caso de dúvidas acerca dos seus direitos, ou da forma como exercê-los, entre em contato com o nosso
          Encarregado de Dados Pessoais, Laura Amaranta de Almeida Lima, via e-mail:{" "}
          <a href={`mailto:${CONTACTS.institucional.email}`} className="break-all hover:text-[#0061ff]">
            {CONTACTS.institucional.email}
          </a>
          .
        </p>
        <br />
        <p>O IEPTB se compromete a responder você dentro de um prazo razoável, após a verificação da sua identidade.</p>
        <p>
          Esse Aviso de Privacidade pode passar por atualizações. Desta forma, recomendamos visitar periodicamente esta
          página para que tenha conhecimento sobre as modificações.
          <br />
          Caso sejam feitas alterações relevantes que necessitem de novas autorizações da sua parte, publicaremos um novo
          aviso de privacidade.
        </p>
        <br />
        <p className="font-normal italic">Atualizado pela última vez em 27 de Abril de 2026.</p>
      </div>
    </section>
  </SiteLayout>
);

export default Privacidade;
