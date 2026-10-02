import s from "./Simbolo.module.css";

// Símbolo da ethos (a fita que sugere um "e"). O desenho vem de /marca/simbolo.svg
// como máscara, então a cor é a do texto (currentColor) de quem usa.
export function Simbolo({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`${s.simbolo} ${className}`} />;
}
