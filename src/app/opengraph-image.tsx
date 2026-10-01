import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ethos · Inteligência sob medida. Software house especializada em soluções com IA.";

// Imagem de compartilhamento (WhatsApp, LinkedIn...). A arte vem pronta de public/marca/og.png,
// desenhada com a Satoshi: o gerador do next/og não lê woff2 e cairia numa fonte fina.
export default async function OgImage() {
  const arte = await readFile(join(process.cwd(), "public/marca/og.png"));

  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={`data:image/png;base64,${arte.toString("base64")}`} width={size.width} height={size.height} alt="" />
    ),
    { ...size }
  );
}
