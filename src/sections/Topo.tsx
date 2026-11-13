"use client";

import { useRef, useState } from "react";
import { Nav } from "@/components/layout/Nav";
import { BotaoComece } from "@/components/site/BotaoComece";
import { Forma } from "./topo/Forma";
import s from "./Topo.module.css";

// As três frentes, na ordem das formas que a peça assume (a forma 0 é o símbolo)
const frentes = ["Automação com IA", "Sistemas e aplicativos", "IA generativa"];

// Topo do site: o símbolo da ethos como uma peça 3D viva, que toma a forma de cada frente.
// O título e o texto são HTML (a maior pintura da tela não depende do WebGL); a peça entra depois, por trás.
export function Topo() {
  const [forma, setForma] = useState(0);
  const comandoRef = useRef<((forma: number) => void) | null>(null);

  return (
    <section className={s.palco}>
      <Forma comandoRef={comandoRef} aoMudar={setForma} />
      <Nav />
      <div className={s.miolo}>
        <p className={s.ficha}>
          <i />
          Software house especializada em soluções com IA
        </p>
        <h1 className={s.titulo}>
          <span>Inteligência</span>
          <span>sob medida.</span>
        </h1>
        <div className={s.baixo}>
          {/* A peça toma a forma de cada frente; os botões escolhem qual */}
          <div className={s.frentes} role="group" aria-label="O que a ethos faz">
            {frentes.map((nome, i) => (
              <button key={nome} type="button" className={s.frente} aria-pressed={forma === i + 1} onClick={() => comandoRef.current?.(i + 1)}>
                <i />
                <span>{nome}</span>
              </button>
            ))}
          </div>
          <div className={s.pe}>
            <p className={s.lead}>
              Toda empresa tem um jeito só dela de funcionar. A{" "}ethos cria software e soluções com IA do
              tamanho exato do seu problema.
            </p>
            <BotaoComece />
          </div>
        </div>
      </div>
    </section>
  );
}
