export const cityKey = (nome: string) =>
  nome.replace(/^.*?Of[íi]cio de\s+/i, "").trim();

export const sortByCity = <T extends { nome_cartorio: string }>(arr: T[]) =>
  [...arr].sort((a, b) =>
    cityKey(a.nome_cartorio).localeCompare(cityKey(b.nome_cartorio), "pt-BR", {
      sensitivity: "base",
    })
  );
