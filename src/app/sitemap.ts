import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/productos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/sobre-nosotros`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/contacto`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/descargas`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${site.url}/productos/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
