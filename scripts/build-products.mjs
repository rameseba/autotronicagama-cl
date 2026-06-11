// Transforma el JSON crudo de WooCommerce en src/data/products.json
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

const raw = JSON.parse(readFileSync(join(os.tmpdir(), "aga_clean.json"), "utf8"));

const CATEGORY_MAP = {
  "Equipos de diagnóstico": { slug: "equipos-de-diagnostico", name: "Equipos de diagnóstico" },
  "Equipos de programacion": { slug: "equipos-de-programacion", name: "Equipos de programación" },
  "Componentes electronicos": { slug: "componentes-electronicos", name: "Componentes electrónicos" },
  "Módulos automotrices": { slug: "modulos-automotrices", name: "Módulos automotrices" },
  "Productos digitales": { slug: "productos-digitales", name: "Productos digitales" },
  "Servicios": { slug: "servicios", name: "Servicios" },
};

const decode = (s) =>
  (s || "")
    .replace(/&#8212;/g, "—")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const products = raw.map((p) => {
  const img = p.image ? "/images/products/" + decodeURIComponent(p.image.split("/").pop()) : null;
  const cats = (Array.isArray(p.categories) ? p.categories : [p.categories]).map(
    (c) => CATEGORY_MAP[c] ?? { slug: "otros", name: c }
  );
  return {
    id: p.id,
    name: decode(p.name),
    slug: p.slug,
    shortDescription: decode(p.short),
    description: decode(p.description),
    price: p.price,
    regularPrice: p.regular,
    onSale: p.on_sale && p.sale < p.regular,
    inStock: p.in_stock,
    categories: cats,
    image: img,
  };
});

mkdirSync("src/data", { recursive: true });
writeFileSync("src/data/products.json", JSON.stringify(products, null, 2), "utf8");

const counts = {};
for (const p of products) for (const c of p.categories) counts[c.name] = (counts[c.name] || 0) + 1;
console.log(`OK: ${products.length} productos`);
console.log(counts);
const missing = products.filter((p) => p.image && !existsSync(join("public", p.image)));
if (missing.length) console.log("Imágenes faltantes:", missing.map((m) => m.image));
