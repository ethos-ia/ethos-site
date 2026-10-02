import type { CSSProperties } from "react";
import { SecTopo } from "@/components/site/SecTopo";
import { BotaoComece } from "@/components/site/BotaoComece";
import s from "./Cases.module.css";

// Colunas quase quadradas, logos centralizados: logos horizontais com teto de 230 px de largura;
// o selo redondo da Evo ocupa a altura da área do logo
const cases = [
  { id: "parque", nome: "Parque dos Leilões", tag: "Automação com IA", w: 230, h: 80 },
  { id: "boss", nome: "BOSS Detail", tag: "Sistema de gestão", w: 230, h: 68 },
  { id: "espacoz", nome: "Espaço Z", tag: "IA generativa", w: 230, h: 45 },
  { id: "evo", nome: "Evo Club", tag: "Aplicativo", w: 168, h: 168 },
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
      <div className={`largura ${s.chamada}`}>
        <p>O próximo case pode ser o seu.</p>
        <BotaoComece variante="texto" />
      </div>
    </section>
  );
}
