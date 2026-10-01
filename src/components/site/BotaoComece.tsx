"use client";

import { useContact } from "@/contexts/ContactContext";
import { Seta } from "./icones";
import s from "./BotaoComece.module.css";

type Variante = "pilula" | "pilulaNav" | "texto";

// CTA único do site: "Comece por aqui" abre o formulário de contato
export function BotaoComece({ variante = "pilula", aoClicar }: { variante?: Variante; aoClicar?: () => void }) {
  const { open } = useContact();
  return (
    <button
      type="button"
      className={`${s.botao} ${s[variante]}`}
      onClick={() => {
        aoClicar?.();
        open();
      }}
    >
      Comece por aqui
      <Seta className={s.seta} />
    </button>
  );
}
