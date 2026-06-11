import type { Metadata } from "next";
import { Download, FileDown, MessageCircleQuestion } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Descargas",
  description:
    "Centro de descargas de Gama Autotrónica: software, drivers y archivos para tus equipos de diagnóstico y programación automotriz.",
  alternates: { canonical: "/descargas" },
};

// Agrega aquí las descargas disponibles: { name, description, href, size }
const downloads: { name: string; description: string; href: string; size?: string }[] = [];

export default function DescargasPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Descargas
        </h1>
        <p className="mt-3 text-lg text-zinc-600">
          Software, drivers y archivos de apoyo para tus equipos de diagnóstico y
          programación.
        </p>
      </header>

      {downloads.length > 0 ? (
        <ul className="mt-10 space-y-4">
          {downloads.map((file) => (
            <li key={file.href}>
              <a
                href={file.href}
                download
                className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-zinc-200 transition-all hover:ring-brand-400"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <FileDown className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-zinc-900">{file.name}</span>
                  <span className="block text-sm text-zinc-500">{file.description}</span>
                </span>
                {file.size && <span className="text-sm text-zinc-400">{file.size}</span>}
                <Download className="h-5 w-5 text-brand-600" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-zinc-200">
          <MessageCircleQuestion className="h-10 w-10 text-zinc-300" aria-hidden="true" />
          <div>
            <p className="font-semibold text-zinc-900">
              Estamos preparando el centro de descargas
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Si compraste un producto digital (PCMFlash, Guardant Code, DiagBox, Toyolex u
              otro) y necesitas el archivo de descarga, escríbenos y te lo enviamos de
              inmediato.
            </p>
          </div>
          <a
            href={whatsappLink("Hola, necesito el archivo de descarga de un producto digital que compré.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Solicitar por WhatsApp
          </a>
          <a href={`mailto:${site.email}`} className="text-sm text-brand-700 underline">
            o escríbenos a {site.email}
          </a>
        </div>
      )}
    </div>
  );
}
