import type { MetadataRoute } from "next";

// Libera o site para buscadores e aponta o sitemap (acelera a troca do resultado antigo no Google)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.somosethos.com.br/sitemap.xml",
  };
}
