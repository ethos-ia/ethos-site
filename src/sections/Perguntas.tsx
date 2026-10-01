import { SecTopo } from "@/components/site/SecTopo";
import s from "./Perguntas.module.css";

const perguntas = [
  {
    q: "Que tipo de empresa vocês atendem?",
    a: "Empresas de qualquer porte e setor com um problema claro para resolver: um processo que toma tempo demais, uma informação espalhada, uma ideia que precisa de IA para sair do papel.",
  },
  {
    q: "Vocês só trabalham com IA?",
    a: "Não. A gente faz software sob medida e usa IA quando ela é o melhor caminho. Se uma solução mais simples resolve, a gente diz.",
  },
  {
    q: "Precisamos ter equipe de tecnologia?",
    a: "Não. Atendemos empresas sem time de TI. O que a gente precisa é de acesso ao processo e às pessoas que fazem o trabalho.",
  },
  {
    q: "Quanto custa e quanto tempo leva?",
    a: "Depende do problema. Depois de entender o seu processo, você recebe escopo, prazo e valor antes de qualquer compromisso.",
  },
  {
    q: "Depois de pronto, vocês continuam junto?",
    a: "Se fizer sentido para você. Dá para seguir com a gente cuidando e evoluindo a solução, ou receber tudo documentado para a sua equipe tocar.",
  },
  {
    q: "De quem é o que for construído?",
    a: "Tudo fica documentado e acessível para a sua empresa. Os termos de propriedade são definidos em contrato, conforme o tipo de solução.",
  },
  {
    q: "Como vocês tratam os dados da empresa?",
    a: "Em conformidade com a LGPD. Acessamos só o necessário para a solução, com regras claras de acesso e armazenamento.",
  },
  {
    q: "Como começa?",
    a: "Com uma conversa sem compromisso sobre o seu problema. É só clicar em Comece por aqui.",
  },
];

const metade = Math.ceil(perguntas.length / 2);

export function Perguntas() {
  return (
    <section id="perguntas" className={s.secao}>
      <div className="largura">
        <SecTopo numero="04" rotulo="Perguntas" titulo="Antes da primeira conversa." />
        {/* Duas colunas independentes: abrir uma pergunta só empurra a própria coluna */}
        <div className={s.faq}>
          {[perguntas.slice(0, metade), perguntas.slice(metade)].map((coluna, i) => (
            <div key={i} className={s.coluna}>
              {coluna.map((p) => (
                <details key={p.q}>
                  <summary>
                    {p.q}
                    <i aria-hidden="true" />
                  </summary>
                  <p>{p.a}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
