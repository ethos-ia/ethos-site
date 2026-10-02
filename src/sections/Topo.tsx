"use client";

import { useEffect, useRef } from "react";
import { Nav } from "@/components/layout/Nav";
import { BotaoComece } from "@/components/site/BotaoComece";
import { IconeSom } from "@/components/site/icones";
import s from "./Topo.module.css";

// Fração da trilha em que o filme chega à tela cheia; o resto segura o filme na tela
const FIM = 0.72;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Retangulo = { x: number; y: number; w: number; h: number };

// Topo do site: o filme de lançamento sai da vaga no título e, com a rolagem,
// cresce até a tela cheia. A medida dele aparece ao lado, até virar a medida da tela.
export function Topo() {
  const trilhaRef = useRef<HTMLDivElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const escureceRef = useRef<HTMLDivElement>(null);
  const topoRef = useRef<HTMLDivElement>(null);
  const vagaRef = useRef<HTMLSpanElement>(null);
  const quadroRef = useRef<HTMLButtonElement>(null);
  const filmeRef = useRef<HTMLVideoElement>(null);
  const cantRef = useRef<HTMLDivElement>(null);
  const leituraRef = useRef<HTMLParagraphElement>(null);
  const medidaRef = useRef<HTMLElement>(null);
  const notaRef = useRef<HTMLSpanElement>(null);
  const somRef = useRef<HTMLButtonElement>(null);
  const somTextoRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const trilha = trilhaRef.current, palco = palcoRef.current, escurece = escureceRef.current, topo = topoRef.current;
    const vaga = vagaRef.current, quadro = quadroRef.current, filme = filmeRef.current, cant = cantRef.current;
    const leitura = leituraRef.current, medida = medidaRef.current, nota = notaRef.current;
    const som = somRef.current, somTexto = somTextoRef.current;
    if (!trilha || !palco || !escurece || !topo || !vaga || !quadro || !filme || !cant || !leitura || !medida || !nota || !som || !somTexto) return;

    const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // celular em pé recebe o corte vertical do filme
    const retrato = matchMedia("(max-aspect-ratio: 1/1)").matches;
    filme.poster = retrato ? "/filme/capa-9x16.jpg" : "/filme/capa-16x9.jpg";
    filme.src = retrato ? "/filme/lancamento-9x16.mp4" : "/filme/lancamento-16x9.mp4";
    filme.muted = true;
    filme.play().catch(() => {});

    let r0: Retangulo | null = null;
    let raio0 = 0, perto = false, comecou = false, celular = false;
    let indo: ReturnType<typeof setTimeout> | null = null;
    let pedido = 0;

    const inicioTrilha = () => trilha.getBoundingClientRect().top + scrollY;
    const distancia = () => trilha.offsetHeight - palco.offsetHeight;
    const rotuloSom = () => {
      somTexto.textContent = filme.muted ? "Assistir com som" : "Tirar o som";
    };

    function mede() {
      if (!topo || !vaga || !palco) return;
      const t = topo.style.transform;
      topo.style.transform = "none"; // mede a vaga sem o deslocamento da rolagem
      const a = vaga.getBoundingClientRect(), b = palco.getBoundingClientRect();
      topo.style.transform = t;
      r0 = { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
      raio0 = Math.min(18, a.height * 0.14);
      celular = matchMedia("(max-width: 760px)").matches;
      // vídeo do tamanho do palco; o tamanho na tela vem do transform em atualiza()
      if (filme) {
        // estilo inteiro de uma vez (medido: só largura/altura soltas não tiravam o custo)
        filme.style.cssText = `position:absolute;left:50%;top:50%;width:${palco.clientWidth}px;height:${palco.clientHeight}px;max-width:none;object-fit:cover`;
      }
    }

    // Desenha o topo num ponto da trilha (p de 0 a 1)
    function atualiza(p: number) {
      if (!r0 || !palco || !quadro || !topo || !escurece || !cant || !medida || !nota || !leitura || !som || !filme) return;
      const e = calmo ? (p > 0.04 ? 1 : 0) : suave(clamp(p / FIM));
      const W = palco.clientWidth, H = palco.clientHeight;
      const x = lerp(r0.x, 0, e), y = lerp(r0.y, 0, e), w = lerp(r0.w, W, e), h = lerp(r0.h, H, e);
      quadro.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${lerp(raio0, 0, e)}px`;
      // o vídeo cobre o quadro só com escala (sem mudar o tamanho do elemento de vídeo)
      filme.style.transform = `translate(-50%, -50%) scale(${Math.max(w / W, h / H)})`;

      // primeiro o texto sai (sobre a areia limpa); depois a sala escurece
      const saida = clamp(e / 0.16);
      topo.style.opacity = String(1 - saida);
      topo.style.transform = saida > 0 ? `translateY(${-28 * saida}px)` : "";
      topo.style.visibility = saida >= 1 ? "hidden" : "visible";
      escurece.style.opacity = String(suave(clamp((e - 0.18) / 0.42)));
      palco.style.setProperty("--mix", (clamp((e - 0.26) / 0.2) * 100).toFixed(1) + "%");

      // cantoneiras: 10 px por fora do quadro no começo, 24 px por dentro na tela cheia
      const off = lerp(perto ? 6 : 10, -24, e);
      cant.style.cssText = `left:${x - off}px;top:${y - off}px;width:${w + 2 * off}px;height:${h + 2 * off}px`;
      cant.classList.toggle(s.respira, e < 0.005 && !perto);

      // leitura da medida: segue o quadro (embaixo no desktop, em cima no celular)
      // e na tela cheia fica ao lado da cantoneira
      medida.textContent = `${Math.round(w)} × ${Math.round(h)}`;
      nota.textContent = e < 0.015 ? "  ·  role para assistir ↓" : e > 0.985 ? "  ·  sob medida para a sua tela" : "";
      leitura.style.left = `${x + 52 * e}px`;
      leitura.style.top = `${celular ? Math.max(y - Math.max(off, 0) - 30, 24) : Math.min(y + h + Math.max(off, 0) + 14, H - 40)}px`;

      som.classList.toggle(s.somVisivel, e > 0.97);

      // chegou à tela cheia: o filme recomeça do início
      if (e >= 1 && !comecou) {
        comecou = true;
        filme.currentTime = 0;
        filme.play().catch(() => {});
      }
      if (e < 0.1) comecou = false;
      if (e >= 1 && indo) {
        clearTimeout(indo);
        indo = null;
      }
      // saiu do filme: volta ao mudo; filme fora da tela: pausa
      const fora = palco.getBoundingClientRect().bottom < innerHeight * 0.5;
      if (!filme.muted && !indo && (e < 0.6 || fora)) {
        filme.muted = true;
        rotuloSom();
      }
      if (fora && !filme.paused) filme.pause();
      else if (!fora && filme.paused) filme.play().catch(() => {});
    }

    function assistir() {
      if (!filme) return;
      scrollTo({ top: inicioTrilha() + distancia() * FIM + 2, behavior: calmo ? "auto" : "smooth" });
      comecou = true;
      // durante a rolagem automática até o filme, o som não é cortado
      if (indo) clearTimeout(indo);
      indo = setTimeout(() => {
        indo = null;
      }, 2500);
      filme.muted = false;
      filme.currentTime = 0;
      filme.play().catch(() => {});
      rotuloSom();
    }

    function alternaSom() {
      if (!filme) return;
      if (filme.muted) {
        filme.muted = false;
        filme.currentTime = 0;
        filme.play().catch(() => {});
      } else {
        filme.muted = true;
      }
      rotuloSom();
    }

    // O filme não copia a rolagem: desliza até ela. Sem rolagem suave (economia de energia do
    // navegador, bateria baixa), cada clique da rodinha pula ~100 px; copiando direto, o filme
    // pulava junto e parecia travado.
    let mostrado = -1; // ponto da trilha desenhado agora (-1 = nada desenhado ainda)
    let ultimoT = 0;
    const alvo = () => clamp((scrollY - inicioTrilha()) / distancia());
    const redesenha = () => atualiza(mostrado < 0 ? alvo() : mostrado);

    function anima(t: number) {
      pedido = 0;
      const p = alvo();
      if (mostrado < 0 || calmo) {
        mostrado = p;
      } else {
        // 12% do caminho a cada quadro de 60 Hz (assenta em ~0,4 s), igual em qualquer taxa de quadros
        const dt = ultimoT ? Math.min(64, t - ultimoT) : 16.67;
        mostrado += (p - mostrado) * (1 - Math.pow(0.88, dt / 16.67));
        if (Math.abs(p - mostrado) < 0.0005) mostrado = p;
      }
      atualiza(mostrado);
      if (mostrado !== p) {
        ultimoT = t;
        pedido = requestAnimationFrame(anima);
      } else {
        ultimoT = 0;
      }
    }

    const aoRolar = () => {
      if (!pedido) pedido = requestAnimationFrame(anima);
    };
    const aoRedimensionar = () => {
      mede();
      redesenha();
    };
    const aoEntrar = () => {
      perto = true;
      redesenha();
    };
    const aoSair = () => {
      perto = false;
      redesenha();
    };

    quadro.addEventListener("click", assistir);
    quadro.addEventListener("mouseenter", aoEntrar);
    quadro.addEventListener("mouseleave", aoSair);
    som.addEventListener("click", alternaSom);
    addEventListener("scroll", aoRolar, { passive: true });
    addEventListener("resize", aoRedimensionar);
    let ativo = true;
    document.fonts.ready.then(() => {
      if (!ativo) return;
      mede();
      aoRolar();
    });

    return () => {
      ativo = false;
      quadro.removeEventListener("click", assistir);
      quadro.removeEventListener("mouseenter", aoEntrar);
      quadro.removeEventListener("mouseleave", aoSair);
      som.removeEventListener("click", alternaSom);
      removeEventListener("scroll", aoRolar);
      removeEventListener("resize", aoRedimensionar);
      if (pedido) cancelAnimationFrame(pedido);
      if (indo) clearTimeout(indo);
    };
  }, []);

  return (
    <div ref={trilhaRef} className={s.trilha}>
      <div ref={palcoRef} className={s.palco}>
        <div ref={escureceRef} className={s.escurece} />
        <div ref={topoRef} className={s.topo}>
          <Nav />
          <div className={s.miolo}>
            <p className={s.ficha}>
              <i />
              Software house especializada em soluções com IA
            </p>
            <h1 className={s.titulo}>
              <span className={s.l1}>Inteligência</span>
              <span className={s.l2}>
                sob medida.
                <span ref={vagaRef} className={s.vaga} aria-hidden="true" />
              </span>
            </h1>
            <div className={s.pe}>
              <p className={s.lead}>
                Toda empresa tem um jeito só dela de funcionar. A{" "}ethos cria software e soluções com IA do
                tamanho exato do seu problema.
              </p>
              <BotaoComece />
            </div>
          </div>
        </div>
        <button ref={quadroRef} type="button" className={s.quadro} aria-label="Assistir ao filme de lançamento da ethos, 18 segundos">
          <video ref={filmeRef} muted loop playsInline preload="auto" />
        </button>
        <div ref={cantRef} className={s.cant} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <p ref={leituraRef} className={s.leitura} aria-hidden="true">
          <b ref={medidaRef} />
          <span ref={notaRef} />
        </p>
        <button ref={somRef} type="button" className={s.som}>
          <IconeSom />
          <span ref={somTextoRef}>Assistir com som</span>
        </button>
      </div>
    </div>
  );
}
