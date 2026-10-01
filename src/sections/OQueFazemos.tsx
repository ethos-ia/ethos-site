import { SecTopo } from "@/components/site/SecTopo";
import { Seta } from "@/components/site/icones";
import s from "./OQueFazemos.module.css";

// As três frentes são as mesmas classificações usadas nos cases
const frentes = [
  {
    nome: "Automação com IA",
    texto: "Tarefas repetitivas passam a rodar sozinhas. E-mails, planilhas e sistemas conversam entre si, com IA onde ela faz diferença.",
    caso: "Parque dos Leilões",
  },
  {
    nome: "Sistemas sob medida",
    texto: "Sistemas de gestão, painéis e aplicativos feitos para o jeito que a sua empresa trabalha.",
    caso: "BOSS Detail",
  },
  {
    nome: "IA generativa",
    texto: "Imagem, vídeo e experiências com IA para marcas, campanhas e eventos.",
    caso: "Espaço Z",
  },
];

export function OQueFazemos() {
  return (
    <section id="o-que-fazemos" className={s.secao}>
      <div className="largura">
        <SecTopo numero="02" rotulo="O que fazemos" titulo={"Três frentes. Todas sob medida."} />
        <div className={s.frentes}>
          {frentes.map((f) => (
            <article key={f.caso} className={s.frente}>
              <h3>
                <i aria-hidden="true" />
                {f.nome}
              </h3>
              <p>{f.texto}</p>
              <a href="#cases">
                Case: {f.caso}
                <Seta className={s.seta} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
