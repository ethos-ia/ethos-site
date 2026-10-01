import type { NextConfig } from "next";

// Headers de seguranca aplicados a todas as rotas. CSP fica de fora desta
// rodada (precisa de testes detalhados com Spline 3D, scripts inline do Next
// e hydration); pode entrar depois em modo report-only.
const securityHeaders = [
  // HSTS reforcado: 2 anos + inclui subdominios + qualifica pra preload list.
  // Vercel ja envia HSTS basico; este override soma includeSubDomains e preload.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Anti-clickjacking: ninguem pode iframe-ar o site.
  { key: "X-Frame-Options", value: "DENY" },
  // Bloqueia MIME-sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Nao vaza URL completa do site em links externos (mantem so origem em
  // cross-origin) — bom pra privacidade de visitantes.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desliga APIs sensiveis que o site nao usa. Reduz superficie caso XSS.
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      // o filme do topo toca sozinho (mudo); autoplay=() bloquearia
      "autoplay=(self)",
      "camera=()",
      "display-capture=()",
      "encrypted-media=()",
      "fullscreen=(self)",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "midi=()",
      "payment=()",
      "picture-in-picture=()",
      "publickey-credentials-get=()",
      "screen-wake-lock=()",
      "sync-xhr=()",
      "usb=()",
      "xr-spatial-tracking=()",
    ].join(", "),
  },
  // Isola janelas popup (window.open): popup nao acessa window.opener.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
