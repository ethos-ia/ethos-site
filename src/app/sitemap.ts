import type { MetadataRoute } from "next";

const BASE = "https://www.somosethos.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return [
    { url: BASE, lastModified: agora, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/privacidade`, lastModified: agora, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/termos`, lastModified: agora, changeFrequency: "yearly", priority: 0.3 },
  ];
}
