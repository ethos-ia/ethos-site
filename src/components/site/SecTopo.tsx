import type { ReactNode } from "react";
import s from "./SecTopo.module.css";

type Props = {
  numero: string;
  rotulo: string;
  titulo: ReactNode;
  lead?: string;
  escuro?: boolean;
};

// Cabeçalho das seções: régua com o índice em mono, título e, quando houver, uma linha de apoio
export function SecTopo({ numero, rotulo, titulo, lead, escuro = false }: Props) {
  return (
    <header className={`${s.topo} ${escuro ? s.escuro : ""}`}>
      <div className={s.rotulo}>
        <span>{numero}</span>
        {rotulo}
      </div>
      <h2 className={s.titulo}>{titulo}</h2>
      {lead && <p className={s.lead}>{lead}</p>}
    </header>
  );
}
