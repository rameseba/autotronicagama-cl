"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  ImageOff,
  Loader2,
  Pencil,
  Search,
  ShieldAlert,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { normalize, cn } from "@/lib/utils";
import type { GalleryImage } from "@/components/gallery/gallery-explorer";

type PendingFile = {
  file: File;
  name: string;
  tags: string;
  preview: string;
};

function cleanFileName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
}

export function AdminPanel() {
  const supabase = useMemo(() => createClient(), []);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("gallery_images")
      .select("id, name, tags, storage_path, created_at")
      .order("created_at", { ascending: false });
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
      if (!user?.email) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("admins")
        .select("email")
        .eq("email", user.email)
        .maybeSingle();
      setIsAdmin(Boolean(data));
      if (data) load();
    });
  }, [supabase, load]);

  function addFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setPending((prev) => [
      ...prev,
      ...list.map((file) => ({
        file,
        name: cleanFileName(file.name),
        tags: "",
        preview: URL.createObjectURL(file),
      })),
    ]);
  }

  async function uploadAll() {
    setUploading(true);
    setNotice(null);
    let okCount = 0;
    const failed: string[] = [];

    for (const item of pending) {
      const ext = item.file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: storageError } = await supabase.storage
        .from("galeria")
        .upload(path, item.file, { contentType: item.file.type });
      if (storageError) {
        failed.push(item.name);
        continue;
      }
      const tags = item.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const { error: dbError } = await supabase.from("gallery_images").insert({
        name: item.name.trim() || cleanFileName(item.file.name),
        tags,
        storage_path: path,
      });
      if (dbError) {
        await supabase.storage.from("galeria").remove([path]);
        failed.push(item.name);
        continue;
      }
      okCount++;
    }

    pending.forEach((p) => URL.revokeObjectURL(p.preview));
    setPending([]);
    setUploading(false);
    setNotice(
      failed.length === 0
        ? { kind: "ok", text: `${okCount} ${okCount === 1 ? "imagen subida" : "imágenes subidas"} correctamente.` }
        : {
            kind: "error",
            text: `Se subieron ${okCount}, pero fallaron: ${failed.join(", ")}. Inténtalo de nuevo.`,
          }
    );
    load();
  }

  async function deleteImage(img: GalleryImage) {
    if (!window.confirm(`¿Eliminar «${img.name}» de la galería? Esta acción no se puede deshacer.`)) {
      return;
    }
    const { error } = await supabase.from("gallery_images").delete().eq("id", img.id);
    if (!error) {
      await supabase.storage.from("galeria").remove([img.storage_path]);
      setImages((prev) => prev.filter((i) => i.id !== img.id));
    } else {
      setNotice({ kind: "error", text: "No se pudo eliminar la imagen. Inténtalo de nuevo." });
    }
  }

  async function saveRename(img: GalleryImage) {
    const name = editName.trim();
    setEditingId(null);
    if (!name || name === img.name) return;
    const { error } = await supabase.from("gallery_images").update({ name }).eq("id", img.id);
    if (!error) {
      setImages((prev) => prev.map((i) => (i.id === img.id ? { ...i, name } : i)));
    }
  }

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return images;
    return images.filter((img) => normalize(`${img.name} ${img.tags.join(" ")}`).includes(q));
  }, [images, query]);

  if (isAdmin === null) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" aria-label="Cargando" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <ShieldAlert className="h-12 w-12 text-accent-500" aria-hidden="true" />
        <h1 className="font-display text-2xl font-bold text-zinc-900">Acceso restringido</h1>
        <p className="text-zinc-500">
          Tu cuenta no tiene permisos de administración. Si crees que es un error, contacta
          al administrador del sitio.
        </p>
        <Link
          href="/galeria"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver a la galería
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900">
            Administración de galería
          </h1>
          <p className="mt-2 text-zinc-500">
            Sube imágenes con un nombre claro: ese nombre es el que tus clientes usarán para
            buscarlas.
          </p>
        </div>
        <Link
          href="/galeria"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Ver galería
        </Link>
      </header>

      {/* Zona de carga */}
      <section aria-labelledby="subir" className="mt-8">
        <h2 id="subir" className="sr-only">
          Subir imágenes
        </h2>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed px-6 py-12 text-center transition-colors",
            dragOver ? "border-brand-500 bg-brand-50" : "border-zinc-300 bg-white"
          )}
        >
          <ImagePlus className="h-10 w-10 text-brand-500" aria-hidden="true" />
          <p className="font-medium text-zinc-800">
            Arrastra imágenes aquí o selecciónalas desde tu equipo
          </p>
          <p className="text-sm text-zinc-500">JPG, PNG o WebP. Puedes subir varias a la vez.</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800"
          >
            Elegir imágenes
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
            aria-label="Seleccionar imágenes para subir"
          />
        </div>

        {/* Pendientes de subir */}
        {pending.length > 0 && (
          <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-zinc-200 sm:p-6">
            <h3 className="font-display text-lg font-semibold text-zinc-900">
              Listas para subir ({pending.length})
            </h3>
            <ul className="mt-4 space-y-4">
              {pending.map((item, index) => (
                <li
                  key={item.preview}
                  className="flex flex-col gap-3 rounded-2xl bg-zinc-50 p-4 sm:flex-row sm:items-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local */}
                  <img
                    src={item.preview}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="grid flex-1 gap-2 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`nombre-${index}`}
                        className="block text-xs font-medium text-zinc-500"
                      >
                        Nombre (para el buscador)
                      </label>
                      <input
                        id={`nombre-${index}`}
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          setPending((prev) =>
                            prev.map((p, i) => (i === index ? { ...p, name: e.target.value } : p))
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`tags-${index}`}
                        className="block text-xs font-medium text-zinc-500"
                      >
                        Etiquetas (opcional, separadas por coma)
                      </label>
                      <input
                        id={`tags-${index}`}
                        type="text"
                        value={item.tags}
                        placeholder="ej: ecu, bosch, diagrama"
                        onChange={(e) =>
                          setPending((prev) =>
                            prev.map((p, i) => (i === index ? { ...p, tags: e.target.value } : p))
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(item.preview);
                      setPending((prev) => prev.filter((_, i) => i !== index));
                    }}
                    className="self-start rounded-md p-2 text-zinc-400 hover:bg-accent-50 hover:text-accent-600 sm:self-center"
                    aria-label={`Quitar ${item.name} de la lista`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={uploadAll}
              disabled={uploading}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <UploadCloud className="h-5 w-5" aria-hidden="true" />
              )}
              {uploading ? "Subiendo…" : `Subir ${pending.length} ${pending.length === 1 ? "imagen" : "imágenes"}`}
            </button>
          </div>
        )}

        {notice && (
          <p
            role="status"
            className={cn(
              "mt-4 rounded-xl p-4 text-sm ring-1",
              notice.kind === "ok"
                ? "bg-green-50 text-green-800 ring-green-200"
                : "bg-accent-50 text-accent-800 ring-accent-200"
            )}
          >
            {notice.text}
          </p>
        )}
      </section>

      {/* Imágenes existentes */}
      <section aria-labelledby="existentes" className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="existentes" className="font-display text-xl font-semibold text-zinc-900">
            Imágenes publicadas {!loading && <span className="text-zinc-400">({images.length})</span>}
          </h2>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filtrar…"
              aria-label="Filtrar imágenes publicadas"
              className="h-10 rounded-full border border-zinc-300 bg-white pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-brand-600" aria-label="Cargando" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-zinc-200">
            <ImageOff className="h-9 w-9 text-zinc-300" aria-hidden="true" />
            <p className="text-sm text-zinc-500">
              {images.length === 0
                ? "Todavía no has subido imágenes. Usa la zona de carga de arriba."
                : "Ninguna imagen coincide con el filtro."}
            </p>
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {filtered.map((img) => (
              <li
                key={img.id}
                className="overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200"
              >
                <div className="relative aspect-square bg-zinc-100">
                  {img.url ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- URL firmada temporal de Supabase */
                    <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-zinc-300">
                      <ImageOff className="h-8 w-8" aria-hidden="true" />
                    </span>
                  )}
                </div>
                <div className="p-3">
                  {editingId === img.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRename(img);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                        aria-label="Nuevo nombre de la imagen"
                        className="w-full rounded-lg border border-brand-400 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
                      />
                      <button
                        type="button"
                        onClick={() => saveRename(img)}
                        className="rounded p-1.5 text-green-600 hover:bg-green-50"
                        aria-label="Guardar nombre"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="truncate text-sm font-medium text-zinc-800" title={img.name}>
                      {img.name}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(img.id);
                        setEditName(img.name);
                      }}
                      className="inline-flex items-center gap-1 rounded p-1 text-xs text-zinc-500 hover:text-brand-700"
                      aria-label={`Renombrar ${img.name}`}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Renombrar
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteImage(img)}
                      className="inline-flex items-center gap-1 rounded p-1 text-xs text-zinc-500 hover:text-accent-600"
                      aria-label={`Eliminar ${img.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
