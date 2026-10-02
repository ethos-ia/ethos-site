import type { CSSProperties, ReactNode } from "react";
import { SecTopo } from "@/components/site/SecTopo";
import s from "./OQueFazemos.module.css";

type Case = { id: string; nome: string; w: number; h: number };

// Cada frente mostra o que faz numa cena animada (mesma linguagem de peças e medida do topo)
function CenaAutomacao() {
  return (
    <div className={`${s.cena} ${s.auto}`} aria-hidden="true">
      <div className={s.email}>
        <span className={s.rot}>Novo e-mail</span>
        <b>Pedido de remoção</b>
        <i />
        <i className={s.curta} />
      </div>
      <div className={s.fio}>
        <span />
      </div>
      <div className={s.tabela}>
        <div className={s.cab}>
          <span>Pedido</span>
          <span>Placa</span>
          <span>Status</span>
        </div>
        <div className={s.lin}>
          <i />
          <i />
          <em>ok</em>
        </div>
        <div className={s.lin}>
          <i />
          <i />
          <em>ok</em>
        </div>
        <div className={`${s.lin} ${s.nova}`}>
          <i />
          <i />
          <em>novo</em>
        </div>
      </div>
    </div>
  );
}

function CenaSistemas() {
  return (
    <div className={`${s.cena} ${s.sis}`} aria-hidden="true">
      <div className={s.painel}>
        <span className={s.rot}>Painel</span>
        <div className={s.barras}>
          {[0.55, 0.8, 0.45, 0.95, 0.7].map((a, i) => (
            <i key={i} style={{ "--a": a, animationDelay: `${i * 0.12}s` } as CSSProperties} />
          ))}
        </div>
        <svg viewBox="0 0 200 50" className={s.grafico}>
          <path d="M0 40 C 30 38, 45 20, 70 24 S 110 36, 130 18 S 175 8, 200 12" />
        </svg>
      </div>
      <div className={s.celular}>
        <span className={s.rot}>Aulas de hoje</span>
        {[0, 1, 2].map((i) => (
          <div key={i} className={s.item} style={{ animationDelay: `${i * 0.15}s` }}>
            <b />
            <i />
          </div>
        ))}
      </div>
    </div>
  );
}

function CenaGenerativa() {
  return (
    <div className={`${s.cena} ${s.gen}`} aria-hidden="true">
      <div className={s.grade}>
        {Array.from({ length: 9 }, (_, i) => (
          <i key={i} className={i === 4 ? s.viva : undefined} />
        ))}
      </div>
      <div className={s.varre} />
      <span className={`${s.rot} ${s.gera}`}>Gerando</span>
    </div>
  );
}

const frentes: { nome: string; texto: string; cena: ReactNode; cases: Case[] }[] = [
  {
    nome: "Automação com IA",
    texto: "Tarefas repetitivas passam a rodar sozinhas. E-mails, planilhas e sistemas conversam entre si, com IA onde ela faz diferença.",
    cena: <CenaAutomacao />,
    cases: [{ id: "parque", nome: "Parque dos Leilões", w: 132, h: 46 }],
  },
  {
    nome: "Sistemas e aplicativos",
    texto: "Sistemas de gestão, painéis e aplicativos feitos para o jeito que a sua empresa trabalha.",
    cena: <CenaSistemas />,
    cases: [
      { id: "boss", nome: "BOSS Detail", w: 132, h: 39 },
      { id: "evo", nome: "Evo Club", w: 54, h: 54 },
    ],
  },
  {
    nome: "IA generativa",
    texto: "Imagem, vídeo e experiências com IA para marcas, campanhas e eventos.",
    cena: <CenaGenerativa />,
    cases: [{ id: "espacoz", nome: "Espaço Z", w: 150, h: 29 }],
  },
];

export function OQueFazemos() {
  return (
    <section id="o-que-fazemos" className={s.secao}>
      <div className="largura">
        <SecTopo numero="02" rotulo="O que fazemos" titulo={"Três frentes. Todas sob medida."} />
        <div className={s.frentes}>
          {frentes.map((f) => (
            <article key={f.nome} className={s.frente}>
              {f.cena}
              <h3>
                <i aria-hidden="true" />
                {f.nome}
              </h3>
              <p>{f.texto}</p>
              <a href="#cases" className={s.cases}>
                <span className={s.r}>Case</span>
                {f.cases.map((c) => (
                  <span
                    key={c.id}
                    role="img"
                    aria-label={c.nome}
                    className={s.logo}
                    style={{ "--logo": `url(/cases/${c.id}.png)`, width: c.w, height: c.h } as CSSProperties}
                  />
                ))}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
