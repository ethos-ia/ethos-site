"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import s from "./Forma.module.css";

// A forma do topo: o símbolo da ethos como uma peça 3D inflada, desenhada em tempo real
// por um shader (WebGL puro, sem biblioteca). Ela se transforma, como um líquido, em três
// outras formas, uma para cada frente: laço (automação), grade (sistemas) e brilho (IA generativa).
// Cada forma é um campo de distância 2D; a transição é a mistura dos campos.

export const FORMAS = 4; // 0 = símbolo, 1 a 3 = as frentes
const LADO = 256; // lado da textura do campo de distância do símbolo
const ALCANCE = 1.1; // a textura cobre de -1.1 a 1.1 no espaço da forma
const ESPERA = 3000; // ms parado em cada forma
const TROCA = 1300; // ms de transição
const PAUSA_MANUAL = 9000; // ms sem trocar sozinha depois de um clique
const MAX_PIXELS = 1_150_000;

const VERTICES = `#version 300 es
void main() {
  // um triângulo que cobre a tela inteira
  vec2 p = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAGMENTOS = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uUnid;
uniform float uTempo;
uniform vec2 uGiro;
uniform vec3 uMouse;
uniform vec4 uPesos;
uniform float uAgito;
uniform float uCresce;
uniform sampler2D uSimbolo;
out vec4 cor;

// A borda arredonda até RAIO e depois o topo é plano. RAIO não passa da meia largura do traço
// mais fino: se passasse, apareceria um vinco no meio de cada traço.
const float RAIO = 0.115;
const float ALTURA = 0.115;
const float FATIA = 0.13;

float simbolo(vec2 p) {
  float d = texture(uSimbolo, vec2(p.x, -p.y) / ${(ALCANCE * 2).toFixed(1)} + 0.5).r;
  return d + length(max(abs(p) - ${ALCANCE.toFixed(1)}, 0.0));
}
// automação: dois elos entrelaçados, o ciclo que roda sozinho
float laco(vec2 p) {
  float a = abs(length(p - vec2(0.40, 0.0)) - 0.34) - 0.115;
  float b = abs(length(p + vec2(0.40, 0.0)) - 0.34) - 0.115;
  // união suave: os elos se fundem como líquido onde se cruzam
  float h = clamp(0.5 + 0.5 * (b - a) / 0.07, 0.0, 1.0);
  return mix(b, a, h) - 0.07 * h * (1.0 - h);
}
// sistemas e aplicativos: quatro peças numa grade
float grade(vec2 p) {
  vec2 b = abs(abs(p) - 0.40) - 0.19;
  return length(max(b, 0.0)) + min(max(b.x, b.y), 0.0) - 0.12;
}
// IA generativa: o brilho de quatro pontas
float brilho(vec2 p) {
  // um losango mordido por quatro círculos, um em cada diagonal
  p = abs(p) * 1.07;
  float losango = (p.x + p.y - 0.86) * 0.7071;
  float mordida = 1.184 - length(p - 1.15);
  return max(losango, mordida) - 0.04;
}

float campo(vec2 p) {
  float d = 0.0;
  if (uPesos.x > 0.0) d += uPesos.x * simbolo(p);
  if (uPesos.y > 0.0) d += uPesos.y * laco(p);
  if (uPesos.z > 0.0) d += uPesos.z * grade(p);
  if (uPesos.w > 0.0) d += uPesos.w * brilho(p);
  // a superfície respira; durante a troca ela ondula como líquido
  d += (0.003 + 0.05 * uAgito) * sin(3.1 * p.x + uTempo * 1.3) * sin(2.9 * p.y - uTempo * 1.1 + p.x * 1.5);
  // o mouse puxa a forma para perto dele
  vec2 m = p - uMouse.xy;
  d -= uMouse.z * 0.085 * exp(-dot(m, m) / 0.05);
  return d + (1.0 - uCresce) * 0.6;
}

float altura(float d) {
  float t = clamp(-d / RAIO, 0.0, 1.0);
  return ALTURA * sqrt(1.0 - (1.0 - t) * (1.0 - t));
}

float superficie(vec3 q) {
  float d = campo(q.xy);
  return d >= 0.0 ? length(vec2(d, q.z)) : abs(q.z) - altura(d);
}

float caixa(vec3 r, vec3 dir, vec3 cima, vec2 tam, float suave) {
  float f = dot(r, dir);
  if (f <= 0.0) return 0.0;
  vec3 x = normalize(cross(cima, dir));
  vec3 y = cross(dir, x);
  vec2 q = abs(vec2(dot(r, x), dot(r, y)) / f);
  vec2 a = smoothstep(tam + suave, tam - suave, q);
  return a.x * a.y;
}

// o estúdio que a peça reflete: sala cor de areia, duas luzes de caixa e o rebote do chão
vec3 estudio(vec3 r) {
  vec3 c = mix(vec3(0.20, 0.08, 0.04), vec3(0.95, 0.86, 0.74), smoothstep(-0.7, 0.75, r.y));
  c += 15.0 * caixa(r, normalize(vec3(-0.55, 0.72, 0.42)), vec3(0.0, 1.0, 0.0), vec2(0.62, 0.2), 0.12) * vec3(1.0, 0.97, 0.93);
  c += 7.0 * caixa(r, normalize(vec3(0.85, 0.2, 0.25)), vec3(0.0, 1.0, 0.0), vec2(0.1, 0.7), 0.1) * vec3(1.0, 0.9, 0.8);
  c += 2.5 * caixa(r, normalize(vec3(0.1, -0.9, 0.35)), vec3(0.0, 0.0, 1.0), vec2(0.8, 0.25), 0.25) * vec3(1.0, 0.62, 0.38);
  return c;
}

vec3 pinta(vec3 n, vec3 v, float cheio) {
  float nl = dot(n, normalize(vec3(-0.45, 0.75, 0.5)));
  float nv = max(dot(n, v), 0.0);
  vec3 c = mix(vec3(0.60, 0.12, 0.03), vec3(1.0, 0.43, 0.16), smoothstep(-0.4, 0.95, nl));
  c += vec3(1.0, 0.5, 0.15) * 0.16 * pow(1.0 - nv, 2.0);
  c *= mix(0.86, 1.0, smoothstep(0.0, 0.4, cheio));
  float fresnel = 0.035 + 0.6 * pow(1.0 - nv, 4.5);
  c = c * (1.0 - fresnel) + estudio(reflect(-v, n)) * fresnel;
  return min(c, 1.0);
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uUnid;
  float cy = cos(uGiro.x), sy = sin(uGiro.x), cx = cos(uGiro.y), sx = sin(uGiro.y);
  mat3 giro = mat3(cy, 0.0, -sy, 0.0, 1.0, 0.0, sy, 0.0, cy) * mat3(1.0, 0.0, 0.0, 0.0, cx, sx, 0.0, -sx, cx);
  vec3 ro = vec3(0.0, 0.0, 5.0) * giro;
  vec3 rd = normalize(vec3(p, -5.0));
  vec3 rdo = rd * giro;

  // sombra no chão: o próprio campo, deslocado e bem difuso
  float sombra = 0.24 * (1.0 - smoothstep(-0.08, 0.26, campo(p + vec2(-0.05, 0.17))));
  cor = vec4(vec3(0.36, 0.17, 0.07) * sombra, sombra);

  float t0 = (-FATIA - ro.z) / rdo.z, t1 = (FATIA - ro.z) / rdo.z;
  float tn = min(t0, t1), tf = max(t0, t1);
  if (campo((ro + rdo * (tn + tf) * 0.5).xy) > 0.3) return;

  // percorre a fatia onde a peça existe; achou a superfície, refina por bisseção
  const int PASSOS = 20;
  float passo = (tf - tn) / float(PASSOS);
  float t = tn, menor = 1e3, tMenor = tn;
  bool bateu = false;
  for (int i = 0; i <= PASSOS; i++) {
    float g = superficie(ro + rdo * t);
    if (g < 0.0) { bateu = true; break; }
    if (g < menor) { menor = g; tMenor = t; }
    t += passo;
  }
  float cobre = 1.0;
  if (bateu) {
    float a = t - passo, b = t;
    for (int i = 0; i < 8; i++) {
      float meio = 0.5 * (a + b);
      if (superficie(ro + rdo * meio) < 0.0) b = meio; else a = meio;
    }
    t = 0.5 * (a + b);
  } else {
    // passou raspando: borda suavizada com a cor da beirada
    cobre = clamp(1.0 - menor * uUnid / 1.3, 0.0, 1.0);
    if (cobre <= 0.0) return;
    t = tMenor;
  }
  vec3 q = ro + rdo * t;
  float d = campo(q.xy);
  vec2 g = vec2(campo(q.xy + vec2(0.02, 0.0)) - campo(q.xy - vec2(0.02, 0.0)), campo(q.xy + vec2(0.0, 0.02)) - campo(q.xy - vec2(0.0, 0.02)));
  g /= max(length(g), 1e-5);
  vec3 no;
  if (d < 0.0) {
    float k = clamp(-d / RAIO, 0.0, 1.0);
    float queda = min((ALTURA / RAIO) * (1.0 - k) / max(sqrt(1.0 - (1.0 - k) * (1.0 - k)), 0.03), 30.0);
    no = normalize(vec3(g * queda, q.z >= 0.0 ? 1.0 : -1.0));
  } else {
    no = normalize(vec3(g, q.z * 4.0));
  }
  vec3 tinta = pinta(giro * no, -rd, clamp(-d / RAIO, 0.0, 1.0));
  cor = vec4(mix(cor.rgb, tinta, cobre), mix(cor.a, 1.0, cobre));
}`;

// Transformada de distância exata (Felzenszwalb), uma dimensão por vez
function distancias(dentro: Uint8Array, n: number, alvo: number) {
  const INF = 1e12;
  const f = new Float64Array(n * n);
  for (let i = 0; i < n * n; i++) f[i] = dentro[i] === alvo ? 0 : INF;
  const linha = new Float64Array(n), saida = new Float64Array(n), z = new Float64Array(n + 1), v = new Int32Array(n);
  const passa = (inicio: number, salto: number) => {
    for (let i = 0; i < n; i++) linha[i] = f[inicio + i * salto];
    let k = 0;
    v[0] = 0;
    z[0] = -INF;
    z[1] = INF;
    for (let q = 1; q < n; q++) {
      let sx = 0;
      for (;;) {
        const p = v[k];
        sx = (linha[q] + q * q - (linha[p] + p * p)) / (2 * q - 2 * p);
        if (sx > z[k]) break;
        k--;
      }
      k++;
      v[k] = q;
      z[k] = sx;
      z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < n; q++) {
      while (z[k + 1] < q) k++;
      const p = v[k];
      saida[q] = (q - p) * (q - p) + linha[p];
    }
    for (let i = 0; i < n; i++) f[inicio + i * salto] = saida[i];
  };
  for (let x = 0; x < n; x++) passa(x, n);
  for (let y = 0; y < n; y++) passa(y * n, 1);
  return f;
}

// Campo de distância do símbolo, calculado uma vez a partir do SVG da marca
async function campoDoSimbolo(): Promise<Float32Array | null> {
  const svg = await (await fetch("/marca/simbolo.svg")).text();
  const caminho = /\sd="([^"]+)"/.exec(svg)?.[1];
  const tela = document.createElement("canvas");
  tela.width = tela.height = LADO;
  const c = tela.getContext("2d", { willReadFrequently: true });
  if (!caminho || !c) return null;
  // viewBox do símbolo: 8 13 84 74, encaixado em 1,84 de largura no espaço da forma
  const escala = ((1.84 / (ALCANCE * 2)) * LADO) / 84;
  c.translate(LADO / 2, LADO / 2);
  c.scale(escala, escala);
  c.translate(-50, -50);
  c.fill(new Path2D(caminho), "evenodd");
  const alfa = c.getImageData(0, 0, LADO, LADO).data;
  const dentro = new Uint8Array(LADO * LADO);
  for (let i = 0; i < dentro.length; i++) dentro[i] = alfa[i * 4 + 3] > 127 ? 1 : 0;
  const fora = distancias(dentro, LADO, 1), dentroD = distancias(dentro, LADO, 0);
  let campo = new Float32Array(LADO * LADO);
  const px = (ALCANCE * 2) / LADO;
  for (let i = 0; i < campo.length; i++) campo[i] = (Math.sqrt(fora[i]) - Math.sqrt(dentroD[i])) * px;
  // passadas de média tiram o serrilhado do recorte (que apareceria como tremido no brilho)
  for (let vez = 0; vez < 6; vez++) {
    const novo = new Float32Array(campo);
    for (let y = 1; y < LADO - 1; y++) {
      for (let x = 1; x < LADO - 1; x++) {
        const i = y * LADO + x;
        novo[i] = (campo[i] * 4 + (campo[i - 1] + campo[i + 1] + campo[i - LADO] + campo[i + LADO]) * 2 + campo[i - LADO - 1] + campo[i - LADO + 1] + campo[i + LADO - 1] + campo[i + LADO + 1]) / 16;
      }
    }
    campo = novo;
  }
  return campo;
}

function programa(gl: WebGL2RenderingContext) {
  const prog = gl.createProgram();
  for (const [tipo, fonte] of [
    [gl.VERTEX_SHADER, VERTICES],
    [gl.FRAGMENT_SHADER, FRAGMENTOS],
  ] as const) {
    const sh = gl.createShader(tipo);
    if (!sh) return null;
    gl.shaderSource(sh, fonte);
    gl.compileShader(sh);
    gl.attachShader(prog, sh);
  }
  gl.linkProgram(prog);
  return gl.getProgramParameter(prog, gl.LINK_STATUS) ? prog : null;
}

const limita = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Props = {
  // quem usa pede uma forma por aqui (clique nos botões das frentes)
  comandoRef: MutableRefObject<((forma: number) => void) | null>;
  aoMudar: (forma: number) => void;
};

export function Forma({ comandoRef, aoMudar }: Props) {
  const cenaRef = useRef<HTMLDivElement>(null);
  const telaRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cena = cenaRef.current, tela = telaRef.current;
    const palco = cena?.parentElement;
    if (!cena || !tela || !palco) return;
    const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl = tela.getContext("webgl2", { antialias: false, alpha: true, powerPreference: "high-performance" });
    const prog = gl && programa(gl);
    if (!gl || !prog) {
      // sem WebGL: o símbolo chapado no lugar da peça, e os botões só marcam a frente
      cena.dataset.plana = "";
      comandoRef.current = aoMudar;
      return () => {
        comandoRef.current = null;
      };
    }
    gl.useProgram(prog);
    const un = (nome: string) => gl.getUniformLocation(prog, nome);
    const uRes = un("uRes"), uUnid = un("uUnid"), uTempo = un("uTempo"), uGiro = un("uGiro");
    const uMouse = un("uMouse"), uPesos = un("uPesos"), uAgito = un("uAgito"), uCresce = un("uCresce");
    gl.bindVertexArray(gl.createVertexArray());

    // estado da animação
    let origem = [1, 0, 0, 0];
    const pesos = [1, 0, 0, 0];
    let alvo = 0, inicioTroca = -1e9, chegou = 0, pausaAte = 0;
    let nascimento = 0, pedido = 0, visivel = true, pronto = false, ativo = true;
    let mx = 0, my = 0, forca = 0, forcaAlvo = 0, giroX = 0, giroY = 0, alvoX = 0, alvoY = 0;
    let escala = 1, unidade = 100, lento = 0, ultimo = 0;

    function ajusta() {
      if (!gl || !tela || !cena) return;
      const w = cena.clientWidth, h = cena.clientHeight;
      const teto = Math.min(devicePixelRatio || 1, 2) * escala;
      const dpr = Math.min(teto, Math.sqrt(MAX_PIXELS / Math.max(1, w * h)));
      tela.width = Math.max(2, Math.round(w * dpr));
      tela.height = Math.max(2, Math.round(h * dpr));
      unidade = Math.min(w, h) / 2 / 1.22;
      gl.viewport(0, 0, tela.width, tela.height);
      gl.uniform2f(uRes, tela.width, tela.height);
      gl.uniform1f(uUnid, unidade * dpr);
    }

    function vai(forma: number, agora: number) {
      if (forma === alvo) return;
      origem = pesos.slice();
      alvo = forma;
      inicioTroca = agora;
      aoMudar(forma);
    }

    function desenha(t: number) {
      pedido = 0;
      if (!gl || !pronto) return;
      if (!nascimento) nascimento = t;

      // troca de forma: mistura dos campos, da origem para o alvo
      const m = calmo ? 1 : limita((t - inicioTroca) / TROCA);
      const e = suave(m);
      for (let i = 0; i < FORMAS; i++) pesos[i] = origem[i] + ((i === alvo ? 1 : 0) - origem[i]) * e;
      if (m < 1) chegou = t;
      else if (!calmo && t > pausaAte && t - chegou > (alvo === 0 ? ESPERA * 1.4 : ESPERA)) vai((alvo + 1) % FORMAS, t);

      // se o aparelho não acompanha, a peça é desenhada com menos pixels
      if (ultimo && !calmo) {
        lento = t - ultimo > 30 ? lento + 1 : Math.max(0, lento - 1);
        if (lento > 24 && escala > 0.45) {
          escala *= 0.8;
          lento = 0;
          ajusta();
        }
      }
      ultimo = t;

      forca += (forcaAlvo - forca) * 0.1;
      giroX += (alvoX - giroX) * 0.07;
      giroY += (alvoY - giroY) * 0.07;
      const s1 = t * 0.001;
      const nasce = calmo ? 1 : 1 - Math.pow(1 - limita((t - nascimento) / 1400), 4);
      gl.uniform1f(uTempo, calmo ? 0 : s1);
      gl.uniform2f(uGiro, giroX + (calmo ? -0.22 : Math.sin(s1 * 0.55) * 0.3 - (1 - nasce) * 1.2), giroY + (calmo ? 0.1 : Math.sin(s1 * 0.4) * 0.12));
      gl.uniform3f(uMouse, mx, my, forca);
      gl.uniform4f(uPesos, pesos[0], pesos[1], pesos[2], pesos[3]);
      gl.uniform1f(uAgito, Math.sin(Math.PI * m) + (1 - nasce) * 0.8);
      gl.uniform1f(uCresce, nasce);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!calmo && visivel) pedido = requestAnimationFrame(desenha);
    }
    const pede = () => {
      if (!pedido && visivel) {
        ultimo = 0;
        pedido = requestAnimationFrame(desenha);
      }
    };

    comandoRef.current = (forma) => {
      const agora = performance.now();
      pausaAte = agora + PAUSA_MANUAL;
      vai(forma === alvo ? 0 : forma, agora);
      pede();
    };

    const aoMover = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse" || calmo) return;
      const b = cena.getBoundingClientRect();
      mx = (ev.clientX - b.left - b.width / 2) / unidade;
      my = -(ev.clientY - b.top - b.height / 2) / unidade;
      forcaAlvo = Math.hypot(mx, my) < 1.5 ? 1 : 0;
      alvoX = limita(mx, -1.6, 1.6) * 0.2;
      alvoY = limita(-my, -1.2, 1.2) * 0.16;
    };
    const aoSair = () => {
      forcaAlvo = alvoX = alvoY = 0;
    };
    const aoPerder = (ev: Event) => {
      ev.preventDefault();
      cena.dataset.plana = "";
    };
    const redimensiona = new ResizeObserver(() => {
      ajusta();
      pede();
    });
    const olha = new IntersectionObserver(([en]) => {
      visivel = en.isIntersecting;
      pede();
    });

    campoDoSimbolo()
      .then((campo) => {
        if (!ativo) return;
        if (!campo) {
          cena.dataset.plana = "";
          return;
        }
        gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, LADO, LADO, 0, gl.RED, gl.FLOAT, campo);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        ajusta();
        pronto = true;
        chegou = performance.now();
        tela.classList.add(s.pronta);
        redimensiona.observe(cena);
        olha.observe(cena);
        palco.addEventListener("pointermove", aoMover);
        palco.addEventListener("pointerleave", aoSair);
        tela.addEventListener("webglcontextlost", aoPerder);
        pede();
      })
      .catch(() => {
        cena.dataset.plana = "";
      });

    return () => {
      ativo = false;
      comandoRef.current = null;
      redimensiona.disconnect();
      olha.disconnect();
      palco.removeEventListener("pointermove", aoMover);
      palco.removeEventListener("pointerleave", aoSair);
      tela.removeEventListener("webglcontextlost", aoPerder);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, [comandoRef, aoMudar]);

  return (
    <div ref={cenaRef} className={s.cena} aria-hidden="true">
      <canvas ref={telaRef} className={s.tela} />
      <span className={s.reserva} />
    </div>
  );
}
