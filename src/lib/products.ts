import data from "@/data/products.json";
import { normalize } from "@/lib/utils";

export type Category = {
  slug: string;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  regularPrice: number;
  onSale: boolean;
  inStock: boolean;
  categories: Category[];
  image: string | null;
};

export const products: Product[] = data as Product[];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategories(): (Category & { count: number })[] {
  const map = new Map<string, Category & { count: number }>();
  for (const p of products) {
    for (const c of p.categories) {
      const existing = map.get(c.slug);
      if (existing) existing.count++;
      else map.set(c.slug, { ...c, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export function searchProducts(query: string, list: Product[] = products): Product[] {
  const q = normalize(query.trim());
  if (!q) return list;
  const terms = q.split(/\s+/);
  return list.filter((p) => {
    const haystack = normalize(
      `${p.name} ${p.shortDescription} ${p.categories.map((c) => c.name).join(" ")}`
    );
    return terms.every((t) => haystack.includes(t));
  });
}

export type SortKey = "relevancia" | "precio-asc" | "precio-desc" | "nombre";

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "precio-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "precio-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "nombre":
      sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
      break;
    default:
      // relevancia: disponibles primero, luego con precio, luego nombre
      sorted.sort((a, b) => {
        if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
        if ((a.price > 0) !== (b.price > 0)) return a.price > 0 ? -1 : 1;
        return a.name.localeCompare(b.name, "es");
      });
  }
  return sorted;
}

export function getFeaturedProducts(limit = 8): Product[] {
  return sortProducts(products, "relevancia").slice(0, limit);
}
