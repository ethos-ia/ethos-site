import { SecTopo } from "@/components/site/SecTopo";
import s from "./ComoTrabalhamos.module.css";

const etapas = [
  { nome: "Entender", texto: "Conversamos com quem faz o trabalho e vemos o processo como ele acontece de verdade." },
  { nome: "Detalhar", texto: "Medimos onde está o custo, em tempo, erro e retrabalho, e definimos o que vale resolver primeiro." },
  { nome: "Planejar", texto: "Desenhamos a solução mais simples que resolve e combinamos escopo, prazo e valor." },
  { nome: "Construir", texto: "Construímos, testamos com a sua equipe e colocamos para rodar no dia a dia." },
];

export function ComoTrabalhamos() {
  return (
    <section id="como-trabalhamos" className={s.secao}>
      <div className="largura">
        <SecTopo
          numero="03"
          rotulo="Como trabalhamos"
          titulo="Antes de construir, a gente entende."
          lead="A solução certa depende do problema certo. Por isso o trabalho começa no seu processo, não no código."
          escuro
        />
        {/* As etapas ficam sobre uma régua, a mesma ideia de medida do topo */}
        <ol className={s.etapas}>
          {etapas.map((e, i) => (
            <li key={e.nome}>
              <span className={s.numero}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{e.nome}</h3>
              <p>{e.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
