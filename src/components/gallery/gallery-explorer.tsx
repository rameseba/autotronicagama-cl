"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Download,
  ImageOff,
  Loader2,
  LogOut,
  Search,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { site, whatsappLink } from "@/lib/site";
import { normalize } from "@/lib/utils";

export type GalleryImage = {
  id: string;
  name: string;
  tags: string[];
  storage_path: string;
  created_at: string;
  url?: string;
};

export function GalleryExplorer() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [approved, setApproved] = useState<boolean | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("gallery_images")
      .select("id, name, tags, storage_path, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setLoadError("No pudimos cargar la galería. Recarga la página o vuelve a ingresar.");
      setLoading(false);
      return;
    }

    const rows = (data ?? []) as GalleryImage[];
    if (rows.length > 0) {
      const { data: signed } = await supabase.storage
        .from("galeria")
        .createSignedUrls(rows.map((r) => r.storage_path), 60 * 60);
      const urlByPath = new Map<string, string>();
      for (const s of signed ?? []) {
        if (s.path && s.signedUrl) urlByPath.set(s.path, s.signedUrl);
      }
      for (const row of rows) row.url = urlByPath.get(row.storage_path);
    }
    setImages(rows);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setApproved(false);
        return;
      }
      const [{ data: adminRow }, { data: profile }] = await Promise.all([
        user.email
          ? supabase.from("admins").select("email").eq("email", user.email).maybeSingle()
          : Promise.resolve({ data: null }),
        supabase.from("profiles").select("approved").eq("id", user.id).maybeSingle(),
      ]);
      const admin = Boolean(adminRow);
      const ok = admin || Boolean(profile?.approved);
      setIsAdmin(admin);
      setApproved(ok);
      if (ok) load();
    });
  }, [load, supabase]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return images;
    const terms = q.split(/\s+/);
    return images.filter((img) => {
      const haystack = normalize(`${img.name} ${img.tags.join(" ")}`);
      return terms.every((t) => haystack.includes(t));
    });
  }, [images, query]);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/acceso");
    router.refresh();
  }

  // Cerrar visor con Escape
  useEffect(() => {
    if (!selected) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  if (approved === null) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" aria-label="Cargando" />
      </div>
    );
  }

  if (!approved) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <Clock className="h-12 w-12 text-amber-500" aria-hidden="true" />
        <h1 className="font-display text-2xl font-bold text-zinc-900">
          Cuenta pendiente de aprobación
        </h1>
        <p className="text-zinc-500">
          Tu cuenta fue creada correctamente, pero un administrador debe aprobarla antes de
          que puedas ver la galería. Te avisaremos en cuanto esté lista.
        </p>
        <a
          href={whatsappLink(
            "Hola, acabo de crear mi cuenta en la galería privada de " +
              site.name +
              " y quedó pendiente de aprobación."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800"
        >
          Avisar por WhatsApp
        </a>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900">
            Galería privada
          </h1>
          <p className="mt-2 text-zinc-500">
            Busca una imagen por su nombre y selecciónala para verla en grande.
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              Administrar
            </Link>
          )}
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Buscador */}
      <div className="relative mt-8 max-w-xl">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
          aria-hidden="true"
        />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar imagen por nombre…"
          aria-label="Buscar imagen por nombre"
          className="h-13 w-full rounded-full border border-zinc-300 bg-white py-3.5 pl-12 pr-4 text-base text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </div>

      <p className="mt-4 text-sm text-zinc-500" aria-live="polite">
        {loading
          ? "Cargando imágenes…"
          : `${results.length} ${results.length === 1 ? "imagen" : "imágenes"}${query ? ` para «${query}»` : ""}`}
      </p>

      {/* Contenido */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" aria-label="Cargando" />
        </div>
      ) : loadError ? (
        <div className="mt-8 rounded-2xl bg-accent-50 p-6 text-accent-800 ring-1 ring-accent-200">
          {loadError}
        </div>
      ) : results.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-3xl bg-white px-6 py-20 text-center ring-1 ring-zinc-200">
          <ImageOff className="h-10 w-10 text-zinc-300" aria-hidden="true" />
          <p className="font-medium text-zinc-800">
            {images.length === 0 ? "Aún no hay imágenes en la galería" : "Sin resultados"}
          </p>
          <p className="max-w-sm text-sm text-zinc-500">
            {images.length === 0
              ? "Cuando se carguen imágenes aparecerán aquí, listas para buscar por nombre."
              : "Prueba con otro nombre o revisa la ortografía."}
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((img) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setSelected(img)}
                className="group block w-full overflow-hidden rounded-2xl bg-white text-left ring-1 ring-zinc-200 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-brand-300"
              >
                <span className="relative block aspect-square overflow-hidden bg-zinc-100">
                  {img.url ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- URL firmada temporal de Supabase */
                    <img
                      src={img.url}
                      alt={img.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-zinc-300">
                      <ImageOff className="h-8 w-8" aria-hidden="true" />
                    </span>
                  )}
                </span>
                <span className="block truncate px-3.5 py-3 text-sm font-medium text-zinc-800">
                  {img.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Visor */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen: ${selected.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            type="button"
            className="absolute inset-0 bg-zinc-950/85 backdrop-blur-sm"
            onClick={() => setSelected(null)}
            aria-label="Cerrar visor"
            tabIndex={-1}
          />
          <figure className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-3.5">
              <figcaption className="truncate font-medium text-zinc-900">
                {selected.name}
              </figcaption>
              <div className="flex shrink-0 items-center gap-1.5">
                {selected.url && (
                  <a
                    href={selected.url}
                    download={selected.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                    aria-label={`Descargar ${selected.name}`}
                  >
                    <Download className="h-5 w-5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                  aria-label="Cerrar visor"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex max-h-[calc(90vh-7rem)] items-center justify-center bg-zinc-50 p-4">
              {selected.url ? (
                /* eslint-disable-next-line @next/next/no-img-element -- URL firmada temporal de Supabase */
                <img
                  src={selected.url}
                  alt={selected.name}
                  className="max-h-[calc(90vh-9rem)] w-auto max-w-full rounded-lg object-contain"
                />
              ) : (
                <ImageOff className="h-12 w-12 text-zinc-300" aria-hidden="true" />
              )}
            </div>
            {selected.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-zinc-100 px-5 py-3">
                {selected.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </figure>
        </div>
      )}
    </div>
  );
}
