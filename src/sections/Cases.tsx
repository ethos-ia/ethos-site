import type { CSSProperties } from "react";
import { SecTopo } from "@/components/site/SecTopo";
import { BotaoComece } from "@/components/site/BotaoComece";
import s from "./Cases.module.css";

// Logos com a mesma massa visual: a altura sai da área (~22.000 px²) e a largura tem teto de 320 px
const cases = [
  { id: "parque", nome: "Parque dos Leilões", tag: "Automação com IA", w: 251, h: 88 },
  { id: "boss", nome: "BOSS Detail", tag: "Sistema de gestão", w: 272, h: 81 },
  { id: "espacoz", nome: "Espaço Z", tag: "IA generativa", w: 320, h: 62 },
];

function Jogo() {
  return (
    <>
      {cases.map((c) => (
        <article key={c.id} className={s.case}>
          <div className={s.logo}>
            <span
              role="img"
              aria-label={c.nome}
              className={s.marca}
              style={{ "--logo": `url(/cases/${c.id}.png)`, "--w": `${c.w}px`, "--h": `${c.h}px` } as CSSProperties}
            />
          </div>
          <span className={s.tag}>{c.tag}</span>
        </article>
      ))}
      <article className={`${s.case} ${s.convite}`}>
        <p>O próximo case pode ser o seu.</p>
        <BotaoComece variante="texto" />
      </article>
    </>
  );
}

export function Cases() {
  return (
    <section id="cases" className={s.secao}>
      <div className="largura">
        <SecTopo numero="01" rotulo="Cases" titulo="Já em uso, no dia a dia de quem confiou na gente." escuro />
      </div>
      {/* Esteira: o mesmo jogo três vezes para o loop não abrir buraco em tela larga; as cópias ficam fora do leitor de tela e do Tab */}
      <div className={s.esteira}>
        <div className={s.trilho}>
          <Jogo />
          <div className={s.copia} aria-hidden="true" inert>
            <Jogo />
          </div>
          <div className={s.copia} aria-hidden="true" inert>
            <Jogo />
          </div>
        </div>
      </div>
    </section>
  );
}
