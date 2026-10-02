import { BotaoComece } from "@/components/site/BotaoComece";
import { Simbolo } from "@/components/site/Simbolo";
import s from "./ChamadaFinal.module.css";

export function ChamadaFinal() {
  return (
    <section id="comece" className={s.secao}>
      <div className={`largura ${s.grade}`}>
        <div>
          <h2 className={s.titulo}>Cada problema pede a sua solução.</h2>
          <p className={s.texto}>Conte o seu. A gente responde com o caminho mais simples para resolver.</p>
          <BotaoComece />
        </div>
        <div className={s.lado}>
          <Simbolo className={s.simbolo} />
        </div>
      </div>
    </section>
  );
}
