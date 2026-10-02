import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatPostDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `Postado em ${format(date, "dd/MM/yyyy", { locale: ptBR })} às ${format(date, "HH:mm", { locale: ptBR })}h`;
}
