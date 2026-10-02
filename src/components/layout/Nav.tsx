"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Marca } from "@/components/site/Marca";
import { BotaoComece } from "@/components/site/BotaoComece";
import s from "./Nav.module.css";

const links = [
  { label: "Cases", href: "/#cases" },
  { label: "O que fazemos", href: "/#o-que-fazemos" },
  { label: "Como trabalhamos", href: "/#como-trabalhamos" },
  { label: "Perguntas", href: "/#perguntas" },
];

export function Nav() {
  const [aberto, setAberto] = useState(false);

  // Menu do celular: Esc fecha e a página não rola por baixo
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("keydown", onKey);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = antes;
    };
  }, [aberto]);

  return (
    <header className={s.nav}>
      <Marca className={s.marca} />
      <nav className={s.links} aria-label="Principal">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className={s.cta}>
        <BotaoComece variante="pilulaNav" />
      </div>
      <button type="button" className={s.menu} aria-label="Abrir menu" aria-expanded={aberto} onClick={() => setAberto(true)}>
        <i />
        <i />
      </button>

      {/* Portal no body: dentro do palco do topo o filme ficaria por cima do menu */}
      {aberto &&
        createPortal(
          <div className={s.painel} role="dialog" aria-modal="true" aria-label="Menu">
            <div className={s.painelTopo}>
              <Marca />
              <button type="button" className={s.fechar} aria-label="Fechar menu" onClick={() => setAberto(false)}>
                <svg viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav className={s.painelLinks} aria-label="Principal">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setAberto(false)}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <BotaoComece aoClicar={() => setAberto(false)} />
          </div>,
          document.body
        )}
    </header>
  );
}
