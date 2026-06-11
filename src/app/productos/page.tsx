import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, products } from "@/lib/products";
import { ProductsExplorer } from "@/components/products/products-explorer";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Catálogo de equipos de diagnóstico, programación automotriz, componentes electrónicos, módulos, productos digitales y servicios. Envíos a todo Chile.",
  alternates: { canonical: "/productos" },
};

export default function ProductosPage() {
  const categories = getCategories();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Productos
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-500">
          Equipos de diagnóstico, programación, componentes y servicios para tu taller.
          Todas las marcas, máxima calidad.
        </p>
      </header>
      <Suspense>
        <ProductsExplorer products={products} categories={categories} />
      </Suspense>
    </div>
  );
}
