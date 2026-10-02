"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Marca } from "@/components/site/Marca";
import { EMAIL_CONTATO, WHATSAPP_NUMERO, WHATSAPP_URL } from "@/lib/contato";
import s from "./Footer.module.css";

interface CookiePrefs {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = "ethos-cookie-prefs";
const DEFAULT_PREFS: CookiePrefs = {
  essential: true, // sempre ativo, não pode ser desabilitado
  analytics: false,
  marketing: false,
};

export function Footer() {
  const [modalOpen, setModalOpen] = useState(false);
  // Carrega preferências salvas no primeiro render (guardado contra SSR).
  // Lazy initializer em vez de useEffect: prefs só alimenta o modal (que monta
  // sob demanda), então não há risco de mismatch de hidratação.
  const [prefs, setPrefs] = useState<CookiePrefs>(() => {
    if (typeof window === "undefined") return DEFAULT_PREFS;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return DEFAULT_PREFS;
      const parsed = JSON.parse(saved) as Partial<CookiePrefs>;
      return { ...DEFAULT_PREFS, ...parsed, essential: true };
    } catch {
      // armazenamento corrompido — ignora e mantém defaults
      return DEFAULT_PREFS;
    }
  });

  const handleSave = (next: CookiePrefs) => {
    const sanitized = { ...next, essential: true };
    setPrefs(sanitized);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    }
    setModalOpen(false);
  };

  return (
    <>
      <footer className={s.rodape}>
        <div className="largura">
          <div className={s.grade}>
            <div className={s.marca}>
              <Marca />
              <p className={s.assinatura}>Inteligência sob medida.</p>
              <p className={s.posicao}>Software house especializada em soluções com IA.</p>
            </div>
            <nav aria-label="Rodapé">
              <p className={s.rotulo}>Navegar</p>
              <Link href="/#cases">Cases</Link>
              <Link href="/#o-que-fazemos">O que fazemos</Link>
              <Link href="/#como-trabalhamos">Como trabalhamos</Link>
              <Link href="/#perguntas">Perguntas</Link>
            </nav>
            <div>
              <p className={s.rotulo}>Contato</p>
              <a href={`mailto:${EMAIL_CONTATO}`}>{EMAIL_CONTATO}</a>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener">
                WhatsApp {WHATSAPP_NUMERO}
              </a>
              <a href="https://instagram.com/ia.ethos" target="_blank" rel="noreferrer noopener">
                Instagram @ia.ethos
              </a>
            </div>
            <div>
              <p className={s.rotulo}>Institucional</p>
              <Link href="/privacidade">Política de privacidade</Link>
              <Link href="/termos">Termos de uso</Link>
            </div>
          </div>

          <div className={s.base}>
            <span>© 2026 Ethos AI - Automações e Integrações. Todos os direitos reservados.</span>
            <button type="button" onClick={() => setModalOpen(true)}>
              Preferências de cookies
            </button>
          </div>
        </div>
      </footer>

      {modalOpen && (
        <CookiePrefsModal
          initial={prefs}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

// ——————————————————————————————————————————————
// Modal de preferências de cookies
// ——————————————————————————————————————————————

interface ModalProps {
  initial: CookiePrefs;
  onSave: (prefs: CookiePrefs) => void;
  onClose: () => void;
}

function CookiePrefsModal({ initial, onSave, onClose }: ModalProps) {
  const [analytics, setAnalytics] = useState(initial.analytics);
  const [marketing, setMarketing] = useState(initial.marketing);

  // Fecha com ESC + trava scroll do body enquanto aberto
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-prefs-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-areia rounded-2xl p-7 md:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="cookie-prefs-title"
          className="text-xl font-bold tracking-tight text-carvao mb-2"
        >
          Preferências de Cookies
        </h3>
        <p className="text-sm text-pedra leading-relaxed mb-6">
          Escolha quais categorias de cookies a Ethos pode usar. Sua escolha é
          guardada no seu navegador.
        </p>

        <div className="flex flex-col">
          <PrefRow
            title="Essenciais"
            description="Necessários para o funcionamento básico do site."
            alwaysOn
          />
          <PrefRow
            title="Analíticos"
            description="Ajudam a entender como o site é usado para melhorá-lo."
            on={analytics}
            onChange={setAnalytics}
          />
          <PrefRow
            title="Marketing"
            description="Personalizar comunicações e medir o desempenho de campanhas."
            on={marketing}
            onChange={setMarketing}
            isLast
          />
        </div>

        <div className="flex justify-end gap-3 mt-7">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-pedra px-4 py-2 hover:text-carvao transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSave({ essential: true, analytics, marketing })}
            className="text-sm font-bold text-areia bg-carvao hover:bg-linha rounded-full px-5 py-2.5 transition-colors duration-200"
          >
            Salvar preferências
          </button>
        </div>
      </div>
    </div>
  );
}

interface PrefRowProps {
  title: string;
  description: string;
  alwaysOn?: boolean;
  on?: boolean;
  onChange?: (v: boolean) => void;
  isLast?: boolean;
}

function PrefRow({ title, description, alwaysOn, on, onChange, isLast }: PrefRowProps) {
  return (
    <div
      className={`flex items-start justify-between gap-4 py-4 ${
        isLast ? "" : "border-b border-areia-linha"
      }`}
    >
      <div className="flex-1">
        <p className="text-sm font-bold text-carvao">{title}</p>
        <p className="text-xs text-pedra mt-1 leading-relaxed">{description}</p>
      </div>
      {alwaysOn ? (
        <span className="font-mono text-[0.65rem] text-pedra uppercase tracking-wider shrink-0 mt-1">
          Sempre ativo
        </span>
      ) : (
        <Toggle on={on ?? false} onChange={onChange ?? (() => {})} label={title} />
      )}
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`Cookies de ${label}`}
      onClick={() => onChange(!on)}
      className={`relative shrink-0 w-10 h-6 rounded-full transition-colors duration-200 mt-1 ${
        on ? "bg-laranja" : "bg-areia-linha"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
          on ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}
