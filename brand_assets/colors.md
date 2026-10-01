# Paleta de Cores — ethos

Brand book de 01/10/2026 (`ethos-marketing/brand/brand-book-ethos.pdf`). Fonte da verdade no código: variáveis do `:root` em `src/app/globals.css`.

## Cores

| Variável CSS | Utilitário Tailwind | Hex | Uso |
|--------------|---------------------|-----|-----|
| `--carvao` | `carvao` | `#141413` | Texto principal no claro, fundo das seções escuras |
| `--carvao-2` | `carvao-2` | `#1C1B19` | Superfície elevada no escuro (painel do chat) |
| `--linha` | `linha` | `#2E2B27` | Divisórias no escuro |
| `--areia` | `areia` | `#F2E8D8` | Única cor clara: fundo das seções claras, texto no escuro |
| `--areia-linha` | `areia-linha` | `#DDD0BA` | Divisórias e bordas no claro |
| `--laranja` | `laranja` | `#FF6A2B` | Símbolo, destaques, chamada final, detalhes no escuro |
| `--laranja-texto` | `laranja-texto` | `#AD3A0E` | Laranja para texto e links sobre areia (contraste 5,1:1) |
| `--pedra` | `pedra` | `#6E655A` | Texto de apoio no claro |
| `--pedra-clara` | `pedra-clara` | `#A89F92` | Texto de apoio no escuro |
| `--tinta` | `tinta` | `#45403A` | Texto corrido no claro |

## Regras

- Laranja vivo (`#FF6A2B`) não vai como cor de texto sobre areia: usar `laranja-texto`.
- Sem gradiente decorativo, sem brilho colorido atrás de cartões, sem palavra colorida no título.
- Seções alternam claro (areia) e escuro (carvão); a chamada final é o único bloco laranja.
