"use client";

import { useEffect, useRef, useState } from "react";
import { useContact } from "@/contexts/ContactContext";
import { Button } from "@/components/ui/Button";
import { EMAIL_CONTATO, WHATSAPP_URL } from "@/lib/contato";

type Status = "idle" | "sending" | "sent" | "error";

const labelCls =
  "font-mono text-[0.68rem] text-pedra tracking-[0.12em] uppercase";

const inputCls =
  "bg-transparent border border-areia-linha rounded-lg px-4 py-3 text-[0.95rem] text-carvao placeholder:text-pedra/50 focus:outline-none focus:border-laranja-texto transition-colors";

const selectCls = `${inputCls} appearance-none pr-10 cursor-pointer bg-no-repeat bg-[right_1rem_center] bg-[length:0.7rem_auto] text-pedra/70 has-[option:checked:not([disabled])]:text-carvao`;

const chevronStyle: React.CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236E655A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
};

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits.length) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function ContactModal() {
  const { isOpen, close } = useContact();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    firstInputRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  function resetForm(form: HTMLFormElement) {
    form.reset();
    setTelefone("");
    setConsent(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      nome: String(data.get("nome") || "").trim(),
      empresa: String(data.get("empresa") || "").trim(),
      email: String(data.get("email") || "").trim(),
      telefone: String(data.get("telefone") || "").trim(),
      faturamento: String(data.get("faturamento") || ""),
      tamanho: String(data.get("tamanho") || ""),
      mensagem: String(data.get("mensagem") || "").trim(),
      consent: data.get("consent") === "on",
      _gotcha: String(data.get("_gotcha") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("sent");
        resetForm(form);
        return;
      }

      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setStatus("error");
      setErrorMsg(body?.error || "Não foi possível enviar agora.");
    } catch {
      setStatus("error");
      setErrorMsg("Falha de conexão. Tente novamente.");
    }
  }

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-overlay-in"
      role="dialog"
      aria-modal="true"
      aria-label="Formulário de contato"
      onClick={(e) => { if (e.target === overlayRef.current) close(); }}
    >
      <div className="relative w-full max-w-lg bg-areia rounded-2xl shadow-2xl p-8 md:p-10 max-h-[90vh] overflow-y-auto animate-modal-in">
        <button
          onClick={close}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-pedra hover:text-carvao transition-colors rounded-lg hover:bg-areia-linha/60"
          aria-label="Fechar"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {status === "sent" ? (
          <div role="status" aria-live="polite">
            <p className="text-2xl font-bold tracking-tight text-carvao mb-2">
              Mensagem recebida.
            </p>
            <p className="text-sm text-pedra mb-6">Respondemos em até 24 horas úteis.</p>
            <button
              onClick={close}
              className="text-sm text-laranja-texto underline underline-offset-4 hover:text-carvao transition-colors"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="w-[9px] h-[9px] rounded-[3px] bg-laranja mb-6" />
              <h2 className="text-3xl md:text-4xl font-black text-carvao tracking-[-0.04em] leading-[1.02] mb-3">
                Conte o problema que você quer resolver.
              </h2>
              <p className="text-[0.95rem] text-pedra leading-relaxed">
                Uma conversa sem compromisso, sem apresentação de vendas.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {/* Honeypot anti-spam — invisível e fora do alcance do tab */}
              <div aria-hidden="true" className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden">
                <label>
                  Não preencher
                  <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="cm-nome" className={labelCls}>Nome</label>
                  <input
                    id="cm-nome"
                    ref={firstInputRef}
                    name="nome"
                    required
                    placeholder="Seu nome"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="cm-empresa" className={labelCls}>Empresa</label>
                  <input
                    id="cm-empresa"
                    name="empresa"
                    required
                    placeholder="Nome da empresa"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="cm-email" className={labelCls}>E-mail</label>
                  <input
                    id="cm-email"
                    type="email"
                    name="email"
                    required
                    placeholder="contato@email.com.br"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="cm-telefone" className={labelCls}>Telefone</label>
                  <input
                    id="cm-telefone"
                    type="tel"
                    name="telefone"
                    required
                    inputMode="numeric"
                    placeholder="(61) 99999-9999"
                    value={telefone}
                    onChange={(e) => setTelefone(maskPhone(e.target.value))}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="cm-faturamento" className={labelCls}>Faturamento mensal</label>
                  <select
                    id="cm-faturamento"
                    name="faturamento"
                    required
                    defaultValue=""
                    className={selectCls}
                    style={chevronStyle}
                  >
                    <option value="" disabled hidden>
                      Selecione uma faixa
                    </option>
                    <option value="ate-50k">Até 50k/mês</option>
                    <option value="50k-100k">50k até 100k</option>
                    <option value="100k-300k">100k até 300k</option>
                    <option value="superior-500k">Superior a 500k</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="cm-tamanho" className={labelCls}>Tamanho da empresa</label>
                  <select
                    id="cm-tamanho"
                    name="tamanho"
                    required
                    defaultValue=""
                    className={selectCls}
                    style={chevronStyle}
                  >
                    <option value="" disabled hidden>
                      Selecione um porte
                    </option>
                    <option value="1-5">1-5 pessoas</option>
                    <option value="6-15">6-15 pessoas</option>
                    <option value="16-30">16-30 pessoas</option>
                    <option value="30+">Mais de 30 funcionários</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="cm-mensagem" className={labelCls}>
                  Qual o seu maior desafio na empresa hoje?
                </label>
                <textarea
                  id="cm-mensagem"
                  name="mensagem"
                  required
                  rows={4}
                  maxLength={4000}
                  placeholder="Descreva o processo ou problema que você quer resolver..."
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Consentimento LGPD */}
              <label className="flex items-start gap-3 text-[0.8rem] text-pedra leading-relaxed cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border border-areia-linha accent-laranja-texto cursor-pointer shrink-0"
                />
                <span>
                  Concordo com o uso dos meus dados para que a Ethos entre em contato,
                  conforme a{" "}
                  <a
                    href="/privacidade"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-laranja-texto underline underline-offset-2 hover:text-carvao"
                  >
                    Política de Privacidade
                  </a>
                  .
                </span>
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="text-sm px-8 py-3.5"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Enviando..." : "Enviar mensagem"}
                </Button>
                <p className="font-mono text-[0.68rem] text-pedra tracking-wide">
                  Respondemos em até 24h.
                </p>
              </div>

              {status === "error" && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="mt-2 rounded-lg border border-red-200 bg-red-50/70 p-3 text-xs text-red-800"
                >
                  <p className="font-semibold mb-1">{errorMsg}</p>
                  <p>
                    Você pode tentar novamente ou escrever diretamente para{" "}
                    <a href={`mailto:${EMAIL_CONTATO}`} className="underline">
                      {EMAIL_CONTATO}
                    </a>
                    .
                  </p>
                </div>
              )}
            </form>

            {/* Alternativa WhatsApp */}
            <div className="mt-6 pt-6 border-t border-areia-linha flex items-center gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-laranja-texto hover:text-carvao transition-colors group"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Falar pelo WhatsApp</span>
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
