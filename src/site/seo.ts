// Título e description de cada página do site — usados pelo SiteLayout (navegação no app)
// e pela pré-renderização do build (HTML estático que o Google lê).
export const SITE_URL = "https://www.cartoriosdeprotestomt.com.br";

export const SEO: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Cartórios de Protesto de Mato Grosso | IEPTB-MT",
    description:
      "Protesto de títulos com segurança jurídica em Mato Grosso. Consulta gratuita, envio eletrônico e cancelamento nos 79 cartórios do estado.",
  },
  "/servicos": {
    title: "Serviços | Cartórios de Protesto de Mato Grosso",
    description:
      "Consulta de protesto gratuita por CPF ou CNPJ, envio eletrônico de títulos pela CRA-MT e cancelamento online nos 79 cartórios de protesto de Mato Grosso.",
  },
  "/contato": {
    title: "Contato | Cartórios de Protesto de Mato Grosso",
    description:
      "Fale com o Cartórios de Protesto de Mato Grosso: atendimento institucional, suporte à Central de Remessa (CRA-MT) e convênios. Telefones, e-mail, WhatsApp e endereço em Cuiabá.",
  },
  "/instituicao": {
    title: "Instituição | Cartórios de Protesto de Mato Grosso",
    description:
      "Conheça o IEPTB-MT, entidade sem fins lucrativos que representa os cartórios de protesto de Mato Grosso desde 2005: missão, visão, valores e presidentes.",
  },
  "/diretoria": {
    title: "Diretoria | Cartórios de Protesto de Mato Grosso",
    description:
      "Diretoria e Conselho Fiscal do IEPTB-MT, gestão 2025/2026: os tabeliães de protesto que conduzem o instituto em Mato Grosso.",
  },
  "/equipe": {
    title: "Nossa Equipe | Cartórios de Protesto de Mato Grosso",
    description:
      "Conheça a equipe do IEPTB-MT que atende cartórios, conveniados e cidadãos em todo o estado de Mato Grosso.",
  },
  "/cartoriosdeprotesto": {
    title: "Cartórios de Protesto | Cartórios de Protesto de Mato Grosso",
    description:
      "Encontre o cartório de protesto mais próximo: lista dos 79 cartórios de Mato Grosso com endereço, telefone, e-mail e localidades atendidas.",
  },
  "/privacidade": {
    title: "Aviso de Privacidade | Cartórios de Protesto de Mato Grosso",
    description:
      "Aviso de privacidade do IEPTB-MT: quais dados pessoais tratamos, para quê, como os protegemos e como exercer seus direitos conforme a LGPD.",
  },
};
