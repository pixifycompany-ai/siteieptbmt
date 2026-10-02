import { Link } from "react-router-dom";
import logoLight from "../assets/logo-full-light.svg";
import { FacebookIcon, InstagramIcon } from "./icons";
import { CONTACTS, EXTERNAL, SOCIAL, tel } from "../data";

const contactLines = [
  { label: CONTACTS.cra.phone, href: tel(CONTACTS.cra.phone) },
  { label: CONTACTS.institucional.phone, href: tel(CONTACTS.institucional.phone) },
  { label: CONTACTS.institucional.email, href: `mailto:${CONTACTS.institucional.email}` },
  { label: CONTACTS.cra.email, href: `mailto:${CONTACTS.cra.email}` },
  { label: CONTACTS.comercial.email, href: `mailto:${CONTACTS.comercial.email}` },
];

const links = [
  { label: "Sobre Nós", to: "/instituicao" },
  { label: "Cartórios de Protesto", to: "/cartoriosdeprotesto" },
  { label: "Serviços", to: "/servicos" },
  { label: "Notícias", to: "/blog" },
];

const social = "flex h-9 w-9 items-center justify-center rounded-full bg-[#0061ff] text-white transition-colors duration-300 hover:bg-[#0099ff]";

const Footer = () => (
  <footer className="bg-[#2a2d33] px-6 py-12 text-[#eff2f5] min-[810px]:px-10 min-[1200px]:px-16 min-[1200px]:py-16">
    <div className="flex flex-col gap-10 min-[810px]:flex-row min-[810px]:items-start min-[810px]:justify-between">
      <div>
        <Link to="/" aria-label="Página inicial">
          <img src={logoLight} alt="Cartórios de Protesto MT" width={186} height={36} className="h-9 w-auto" />
        </Link>
        <p className="mt-16 text-[16px] font-medium leading-[1.2]">Entre em contato com a gente</p>
        <ul className="mt-2.5 space-y-2.5">
          {contactLines.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                className="text-[13px] font-light leading-[1.2] text-[#eff2f5]/80 transition-colors hover:text-white"
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-10 min-[810px]:items-end min-[810px]:self-stretch min-[810px]:pt-[98px]">
        <ul className="space-y-[11px] min-[810px]:text-right">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                className="text-[16px] font-light leading-6 text-[#eff2f5] transition-colors hover:text-[#0099ff]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex gap-4">
          <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={social}>
            <FacebookIcon className="h-6 w-6" />
          </a>
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={social}>
            <InstagramIcon className="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>

    <div className="mt-12 flex flex-col gap-4 min-[810px]:flex-row min-[810px]:items-end min-[810px]:justify-between">
      <div className="text-[13px] font-bold leading-[1.2] text-[#eff2f5]/80">
        <p>
          Instituto de Estudos de Protesto de Títulos do Brasil – Seção Mato Grosso (IEPTB-MT) · CNPJ
          10.864.384/0001-44
        </p>
        <p>Entidade civil sem fins lucrativos que representa os cartórios de protesto de MT.</p>
      </div>
      <a
        href={EXTERNAL.pixify}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-[10px] font-light text-[#eff2f5]/80 transition-colors hover:text-white"
      >
        Desenvolvido por pixify.company
      </a>
    </div>
  </footer>
);

export default Footer;
