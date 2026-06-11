"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PackageSearch, Search, X } from "lucide-react";
import { products, searchProducts } from "@/lib/products";
import { formatCLP, cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SearchDialog({ open, onOpenChange }: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(
    () => (query.trim() ? searchProducts(query).slice(0, 8) : products.slice(0, 6)),
    [query]
  );

  // Sincroniza el <dialog> nativo con el estado
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Atajo global Ctrl/Cmd + K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  function goTo(slug: string) {
    onOpenChange(false);
    router.push(`/productos/${slug}`);
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      goTo(results[activeIndex].slug);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={() => onOpenChange(false)}
      onClick={(e) => {
        // Cerrar al hacer clic en el backdrop
        if (e.target === dialogRef.current) onOpenChange(false);
      }}
      className="fixed inset-0 m-auto h-fit w-[calc(100%-2rem)] max-w-xl rounded-2xl bg-transparent p-0 backdrop:bg-zinc-950/60 backdrop:backdrop-blur-sm"
      aria-label="Buscador de productos"
    >
      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-200">
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4">
          <Search className="h-5 w-5 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded="true"
            aria-controls="resultados-busqueda"
            aria-activedescendant={results[activeIndex] ? `resultado-${results[activeIndex].id}` : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Busca por nombre, categoría o descripción…"
            className="h-14 w-full bg-transparent text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Cerrar buscador"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul
          id="resultados-busqueda"
          role="listbox"
          aria-label="Resultados de búsqueda"
          className="max-h-[55vh] overflow-y-auto p-2"
        >
          {!query.trim() && (
            <li className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Sugerencias
            </li>
          )}
          {results.map((product, index) => (
            <li
              key={product.id}
              id={`resultado-${product.id}`}
              role="option"
              aria-selected={index === activeIndex}
            >
              <button
                type="button"
                onClick={() => goTo(product.slug)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                  index === activeIndex ? "bg-brand-50" : "hover:bg-zinc-50"
                )}
              >
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-zinc-900">
                    {product.name}
                  </span>
                  <span className="block truncate text-xs text-zinc-500">
                    {product.categories.map((c) => c.name).join(" · ")}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-brand-700">
                  {product.price > 0 ? formatCLP(product.price) : "Consultar"}
                </span>
              </button>
            </li>
          ))}
          {query.trim() && results.length === 0 && (
            <li className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <PackageSearch className="h-8 w-8 text-zinc-300" aria-hidden="true" />
              <p className="text-sm text-zinc-500">
                Sin resultados para «{query}». Prueba con otra palabra o{" "}
                <a href="/contacto" className="font-medium text-brand-700 underline">
                  consúltanos directamente
                </a>
                .
              </p>
            </li>
          )}
        </ul>
      </div>
    </dialog>
  );
}
