import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import { ContactProvider } from "@/contexts/ContactContext";
import { ContactModal } from "@/components/ui/ContactModal";
import { ChatWidget } from "@/components/ui/ChatWidget";
import "./globals.css";

// Satoshi (Fontshare) servida localmente: só os pesos que a marca usa
const satoshi = localFont({
  src: [
    { path: "../fonts/satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/satoshi-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/satoshi-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_TITLE = "ethos · Software house especializada em soluções com IA";
const SITE_DESCRIPTION =
  "Software house especializada em soluções com IA. Automação com IA, sistemas sob medida e IA generativa, do tamanho exato do problema da sua empresa.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.somosethos.com.br"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${satoshi.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ContactProvider>
          {children}
          <ContactModal />
          <ChatWidget />
        </ContactProvider>
      </body>
    </html>
  );
}
