# Tipografia — ethos

Duas famílias no site inteiro, carregadas pelo `next/font` em `src/app/layout.tsx`.

| Papel | Família | Pesos | Origem |
|-------|---------|-------|--------|
| Tudo (títulos, texto, botões) | Satoshi | 500, 700, 900 | Fontshare, arquivos em `src/fonts/` |
| Rótulos técnicos (índices, medidas, tags) | JetBrains Mono | 400, 500 | Google Fonts |

Variáveis CSS: `--sans` e `--mono` (utilitários `font-sans` e `font-mono`).

## Escala usada

| Elemento | Tamanho | Peso | Letter-spacing |
|----------|---------|------|----------------|
| Título do topo | min(12.6vw, 20.5vh, 184px) | 900 | -0.052em |
| Título de seção | clamp(38px, 4.6vw, 68px) | 900 | -0.045em |
| Título de item | 26 a 46px | 700 | -0.03em |
| Texto corrido | 17 a 21px | 500 | normal |
| Rótulo mono | 12 a 13,5px | 400/500 | 0.06 a 0.12em, caixa alta |

## Marca

- Nome sempre em minúsculas: **ethos**, em Satoshi Bold, com o símbolo laranja à esquerda (espaço de 0,22em).
- Símbolo: `brand_assets/logo.svg` (mestre) e `public/marca/simbolo.svg` (recortado, usado como máscara no site).
- Assinatura: "Inteligência sob medida." Manifesto: "Cada problema pede a sua solução."
- Nunca usar travessão em texto do site.
