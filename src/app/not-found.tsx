import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-24 text-center">
      <SearchX className="h-14 w-14 text-zinc-300" aria-hidden="true" />
      <h1 className="font-display text-3xl font-bold text-zinc-900">Página no encontrada</h1>
      <p className="max-w-md text-zinc-500">
        La página que buscas no existe o fue movida. Revisa el catálogo o vuelve al inicio.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800"
        >
          Ir al inicio
        </Link>
        <Link
          href="/productos"
          className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
        >
          Ver productos
        </Link>
      </div>
    </div>
  );
}
