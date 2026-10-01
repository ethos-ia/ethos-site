import Link from "next/link";
import { Simbolo } from "./Simbolo";
import s from "./Marca.module.css";

// Assinatura da ethos: símbolo laranja + "ethos" em Satoshi Bold, minúsculo
export function Marca({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`${s.marca} ${className}`} aria-label="ethos, página inicial">
      <Simbolo className={s.simbolo} />
      <span>ethos</span>
    </Link>
  );
}
