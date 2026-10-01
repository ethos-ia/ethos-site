"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContact } from "@/contexts/ContactContext";
import { AGENT_NAME, AGENT_TAGLINE, WELCOME_MESSAGE } from "@/lib/agent";

type Role = "user" | "assistant";
interface Msg {
  role: Role;
  content: string;
}

const STORAGE_KEY = "ethos-chat-history";
const CONTACT_ID_KEY = "ethos-contact-id";
const EASE = [0.16, 1, 0.3, 1] as const;

function getOrCreateContactId(): string {
  try {
    const stored = localStorage.getItem(CONTACT_ID_KEY);
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem(CONTACT_ID_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

// Superfícies da paleta ethos (carvão). Mantidas em hex para controlar a
// elevação do painel sobre as seções escuras do site.
const PANEL_BG = "#1C1B19";
const BOT_BUBBLE = "#2A2825";

export function ChatWidget() {
  const { open: openContact } = useContact();
  const [open, setOpen] = useState(false);
  // Recupera a conversa da sessao no primeiro render (guardado contra SSR).
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Msg[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Persiste a conversa a cada mudanca.
  useEffect(() => {
    if (messages.length === 0) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignora */
    }
  }, [messages]);

  // Abre o painel e semeia a saudacao na primeira vez.
  const toggle = useCallback(() => {
    if (!open) {
      setMessages((prev) =>
        prev.length === 0 ? [{ role: "assistant", content: WELCOME_MESSAGE }] : prev
      );
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [open]);

  // Rola para o fim quando chega mensagem nova ou aparece o "digitando".
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Foco no input ao abrir.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 280);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Esc fecha o painel.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setErrored(false);
    setLoading(true);

    try {
      const contactId = getOrCreateContactId();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, contact_id: contactId }),
      });
      const data = await res.json();
      if (!res.ok || !data.reply) throw new Error(data.error ?? "falha");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setErrored(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Tive um problema para responder agora. Você pode tentar de novo em instantes ou falar com a ethos pelo formulário de contato.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Bolha flutuante, sempre visivel */}
      <motion.button
        type="button"
        onClick={toggle}
        aria-label={open ? "Fechar conversa" : "Abrir conversa com a ethos"}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-laranja border border-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laranja"
        style={{
          backgroundColor: PANEL_BG,
          boxShadow: "0 8px 24px -8px rgba(0,0,0,0.55), 0 2px 8px -2px rgba(0,0,0,0.4)",
        }}
        whileHover={{ y: -2, scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.2, ease: EASE }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              width="20" height="20" viewBox="0 0 14 14" fill="none" aria-hidden="true"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.18 }}
            >
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18 }}
            >
              <path
                d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H9l-4 4v-4H6.5"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Painel do chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`Conversa com ${AGENT_NAME}`}
            className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl border border-white/10 overflow-hidden w-[calc(100vw-3rem)] max-w-[380px] h-[min(70vh,560px)]"
            style={{
              backgroundColor: PANEL_BG,
              transformOrigin: "bottom right",
              boxShadow: "0 24px 64px -16px rgba(0,0,0,0.65), 0 8px 24px -8px rgba(0,0,0,0.45)",
            }}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-laranja opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-laranja" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-areia">{AGENT_NAME}</p>
                <p className="text-[0.7rem] text-pedra-clara">{AGENT_TAGLINE}</p>
              </div>
            </div>

            {/* Mensagens */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              aria-live="polite"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                    style={
                      m.role === "user"
                        ? { backgroundColor: "#FF6A2B", color: "#141413" }
                        : { backgroundColor: BOT_BUBBLE, color: "#F2E8D8" }
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="rounded-2xl px-4 py-3 flex items-center gap-1"
                    style={{ backgroundColor: BOT_BUBBLE }}
                  >
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-pedra-clara"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: d * 0.15, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {errored && (
                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={() => { setOpen(false); openContact(); }}
                    className="text-xs font-semibold text-laranja underline underline-offset-2 hover:text-areia transition-colors px-1"
                  >
                    Abrir formulário de contato
                  </button>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-white/8 p-3">
              <div className="flex items-end gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 focus-within:border-laranja/50 transition-colors">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder="Escreva sua mensagem"
                  aria-label="Sua mensagem"
                  className="flex-1 bg-transparent resize-none text-sm text-areia placeholder:text-pedra-clara/70 focus:outline-none max-h-24 leading-relaxed"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={!input.trim() || loading}
                  aria-label="Enviar mensagem"
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-laranja text-carvao disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:brightness-110 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laranja"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 12l16-8-6 16-3-7-7-1z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
