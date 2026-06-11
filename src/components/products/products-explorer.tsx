"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PackageSearch, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  searchProducts,
  sortProducts,
  type Category,
  type Product,
  type SortKey,
} from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";

type Props = {
  products: Product[];
  categories: (Category & { count: number })[];
};

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "relevancia", label: "Relevancia" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "nombre", label: "Nombre A–Z" },
];

export function ProductsExplorer({ products, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const q = searchParams.get("q") ?? "";
  const categoria = searchParams.get("categoria") ?? "";
  const orden = (searchParams.get("orden") as SortKey) ?? "relevancia";
  const disponibles = searchParams.get("disponibles") === "1";

  const [searchValue, setSearchValue] = useState(q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setSearchValue(q), [q]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  function onSearchChange(value: string) {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParams({ q: value || null }), 250);
  }

  const filtered = useMemo(() => {
    let list = products;
    if (categoria) list = list.filter((p) => p.categories.some((c) => c.slug === categoria));
    if (disponibles) list = list.filter((p) => p.inStock);
    list = searchProducts(q, list);
    return sortProducts(list, orden);
  }, [products, categoria, disponibles, q, orden]);

  const hasFilters = Boolean(q || categoria || disponibles || orden !== "relevancia");
  const activeCategory = categories.find((c) => c.slug === categoria);

  function clearAll() {
    setSearchValue("");
    startTransition(() => router.replace(pathname, { scroll: false }));
  }

  const filterPanel = (
    <div className="space-y-7">
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Categorías
        </legend>
        <ul className="mt-3 space-y-1">
          <li>
            <button
              type="button"
              onClick={() => updateParams({ categoria: null })}
              aria-pressed={!categoria}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                !categoria
                  ? "bg-brand-50 font-semibold text-brand-800"
                  : "text-zinc-600 hover:bg-zinc-100"
              )}
            >
              Todas las categorías
              <span className="text-xs text-zinc-400">{products.length}</span>
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                type="button"
                onClick={() =>
                  updateParams({ categoria: categoria === cat.slug ? null : cat.slug })
                }
                aria-pressed={categoria === cat.slug}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  categoria === cat.slug
                    ? "bg-brand-50 font-semibold text-brand-800"
                    : "text-zinc-600 hover:bg-zinc-100"
                )}
              >
                {cat.name}
                <span className="text-xs text-zinc-400">{cat.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Disponibilidad
        </legend>
        <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
          <input
            type="checkbox"
            checked={disponibles}
            onChange={(e) => updateParams({ disponibles: e.target.checked ? "1" : null })}
            className="h-4 w-4 rounded border-zinc-300 accent-brand-700"
          />
          Solo productos disponibles
        </label>
      </fieldset>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent-700"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Limpiar todos los filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
      {/* Sidebar escritorio */}
      <aside className="hidden lg:block" aria-label="Filtros de productos">
        <div className="sticky top-32 rounded-2xl bg-white p-5 ring-1 ring-zinc-200">
          {filterPanel}
        </div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar en el catálogo…"
              aria-label="Buscar productos en el catálogo"
              className="h-11 w-full rounded-full border border-zinc-300 bg-white pl-11 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="orden" className="sr-only">
              Ordenar productos
            </label>
            <select
              id="orden"
              value={orden}
              onChange={(e) =>
                updateParams({ orden: e.target.value === "relevancia" ? null : e.target.value })
              }
              className="h-11 flex-1 rounded-full border border-zinc-300 bg-white px-4 text-sm text-zinc-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 sm:flex-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 lg:hidden"
              aria-expanded={mobileFiltersOpen}
              aria-controls="filtros-movil"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filtros
            </button>
          </div>
        </div>

        {/* Panel de filtros móvil */}
        {mobileFiltersOpen && (
          <div
            id="filtros-movil"
            className="mt-4 rounded-2xl bg-white p-5 ring-1 ring-zinc-200 lg:hidden"
          >
            {filterPanel}
          </div>
        )}

        {/* Estado de resultados */}
        <div className="mt-5 flex flex-wrap items-center gap-2" aria-live="polite">
          <p className="text-sm text-zinc-500">
            {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
            {activeCategory && (
              <>
                {" "}
                en <span className="font-medium text-zinc-800">{activeCategory.name}</span>
              </>
            )}
            {q && (
              <>
                {" "}
                para «<span className="font-medium text-zinc-800">{q}</span>»
              </>
            )}
          </p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-16 text-center ring-1 ring-zinc-200">
            <PackageSearch className="h-10 w-10 text-zinc-300" aria-hidden="true" />
            <p className="font-medium text-zinc-800">No encontramos productos</p>
            <p className="max-w-sm text-sm text-zinc-500">
              Prueba con otra búsqueda o limpia los filtros. También puedes consultarnos
              directamente: tenemos acceso a más productos de los publicados.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
