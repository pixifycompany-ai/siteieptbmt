import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { FacebookIcon, InstagramIcon, LogoMark } from "./icons";
import { INSTITUCIONAL_MENU, SERVICOS_MENU, SOCIAL, WHATSAPP_URL, type MenuItem } from "../data";

const linkBase = "text-[16px] leading-[1.2] font-normal uppercase transition-colors duration-200";

const ItemLink = ({ item, onNavigate }: { item: MenuItem; onNavigate?: () => void }) => {
  const inner = (
    <>
      <span className="block text-[14px] font-medium leading-tight text-[#0061ff]">{item.title}</span>
      <span className="mt-1 block text-[11px] font-light leading-snug text-[#6c737f]">{item.description}</span>
    </>
  );
  const cls = "block rounded-lg px-3 py-2 transition-colors hover:bg-[#eff2f5]";
  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onNavigate}>
      {inner}
    </a>
  ) : (
    <Link to={item.href} className={cls} onClick={onNavigate}>
      {inner}
    </Link>
  );
};

const Dropdown = ({ label, items }: { label: string; items: MenuItem[] }) => {
  const [open, setOpen] = useState(false);
  const timer = useRef<number>();
  const show = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    timer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onFocus={show}
        className={`${linkBase} flex items-center gap-1 ${open ? "text-[#0061ff]" : "text-[#2a2d33] hover:text-[#0061ff]"}`}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.44, 0, 0.56, 1] }}
            className="absolute left-[-12px] top-full z-50 pt-4"
          >
            <div className="w-[300px] rounded-xl bg-white p-2 shadow-[0_10px_30px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)]">
              {items.map((item) => (
                <ItemLink key={item.title} item={item} onNavigate={() => setOpen(false)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SocialButton = ({ href, label, children }: { href: string; label: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0061ff] text-white transition-colors duration-300 hover:bg-[#0057e3]"
  >
    {children}
  </a>
);

// O original não destaca a página ativa no menu.
const navClass = `${linkBase} text-[#2a2d33] hover:text-[#0061ff]`;

const MobileSection = ({ title, items, onNavigate }: { title: string; items: MenuItem[]; onNavigate: () => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e5e7eb]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-[16px] uppercase text-[#2a2d33]"
      >
        {title}
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={1.5} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-3">
              {items.map((item) => (
                <ItemLink key={item.title} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[70px] bg-white min-[1200px]:h-20">
      <nav className="flex h-full items-center justify-between px-6 min-[810px]:px-10 min-[1200px]:px-16">
        <div className="flex items-center gap-[68px]">
          <Link to="/" aria-label="Página inicial" className="text-[#2a2d33]">
            <LogoMark className="h-[34px] w-[34px]" />
          </Link>
          <div className="hidden items-center gap-10 min-[1200px]:flex">
            <Dropdown label="Institucional" items={INSTITUCIONAL_MENU} />
            <Dropdown label="Serviços" items={SERVICOS_MENU} />
            <Link to="/blog" className={navClass}>
              Notícias
            </Link>
            <Link to="/contato" className={navClass}>
              Contato
            </Link>
            <Link to="/privacidade" className={navClass}>
              Privacidade
            </Link>
          </div>
        </div>

        <div className="hidden items-center gap-6 min-[1200px]:flex">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[39px] items-center rounded-lg bg-[#2a2d33] px-4 text-[16px] font-medium text-[#eff2f5] transition-colors duration-300 hover:bg-[#0061ff]"
          >
            Entrar em contato
          </a>
          <SocialButton href={SOCIAL.facebook} label="Facebook">
            <FacebookIcon className="h-6 w-6" />
          </SocialButton>
          <SocialButton href={SOCIAL.instagram} label="Instagram">
            <InstagramIcon className="h-6 w-6" />
          </SocialButton>
        </div>

        <button
          type="button"
          className="p-1 text-[#2a2d33] min-[1200px]:hidden"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-7 w-7" strokeWidth={1.5} /> : <Menu className="h-7 w-7" strokeWidth={1.5} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.44, 0, 0.56, 1] }}
            className="fixed inset-x-0 bottom-0 top-[70px] overflow-y-auto bg-white px-6 pb-10 min-[810px]:px-10 min-[1200px]:hidden"
          >
            <MobileSection title="Institucional" items={INSTITUCIONAL_MENU} onNavigate={() => setMobileOpen(false)} />
            <MobileSection title="Serviços" items={SERVICOS_MENU} onNavigate={() => setMobileOpen(false)} />
            {[
              ["Notícias", "/blog"],
              ["Contato", "/contato"],
              ["Privacidade", "/privacidade"],
            ].map(([label, href]) => (
              <Link
                key={href}
                to={href}
                className="block border-b border-[#e5e7eb] py-4 text-[16px] uppercase text-[#2a2d33]"
              >
                {label}
              </Link>
            ))}
            <div className="mt-8 flex items-center gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[44px] flex-1 items-center justify-center rounded-lg bg-[#2a2d33] text-[16px] font-medium text-[#eff2f5]"
              >
                Entrar em contato
              </a>
              <SocialButton href={SOCIAL.facebook} label="Facebook">
                <FacebookIcon className="h-6 w-6" />
              </SocialButton>
              <SocialButton href={SOCIAL.instagram} label="Instagram">
                <InstagramIcon className="h-6 w-6" />
              </SocialButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
