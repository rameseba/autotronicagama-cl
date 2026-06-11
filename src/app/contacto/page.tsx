import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { ContactForm } from "@/components/contact-form";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/icons/social";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos por teléfono, WhatsApp, email o redes sociales. Estamos en Paine, Región Metropolitana, y enviamos a todo Chile.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Hablemos
        </h1>
        <p className="mt-3 text-lg text-zinc-600">
          ¿Tienes dudas sobre un producto o necesitas asesoría para tu taller? Escríbenos
          por el medio que prefieras: respondemos rápido.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* Datos de contacto */}
        <div className="space-y-4">
          <a
            href={site.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-zinc-200 transition-all hover:ring-green-400"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
              <WhatsAppIcon className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-semibold text-zinc-900">WhatsApp</span>
              <span className="block text-sm text-zinc-500">{site.phone}</span>
            </span>
          </a>

          <a
            href={`tel:+${site.phoneRaw}`}
            className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-zinc-200 transition-all hover:ring-brand-400"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <Phone className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold text-zinc-900">Teléfono</span>
              <span className="block text-sm text-zinc-500">{site.phone}</span>
            </span>
          </a>

          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-zinc-200 transition-all hover:ring-brand-400"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <Mail className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-zinc-900">Email</span>
              <span className="block break-all text-sm text-zinc-500">{site.email}</span>
            </span>
          </a>

          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-zinc-200">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <MapPin className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold text-zinc-900">Ubicación</span>
              <span className="block text-sm text-zinc-500">{site.address}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-zinc-200">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <Clock className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold text-zinc-900">Atención</span>
              <span className="block text-sm text-zinc-500">
                Lunes a sábado — coordina tu visita por WhatsApp
              </span>
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 ring-1 ring-zinc-200 transition-all hover:ring-brand-400"
            >
              <InstagramIcon className="h-4 w-4 text-brand-700" />
              {site.social.instagramHandle}
            </a>
            <a
              href={site.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 ring-1 ring-zinc-200 transition-all hover:ring-brand-400"
            >
              <TikTokIcon className="h-4 w-4 text-brand-700" />
              {site.social.tiktokHandle}
            </a>
          </div>
        </div>

        {/* Formulario */}
        <div className="rounded-3xl bg-white p-6 ring-1 ring-zinc-200 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-zinc-900">
            Envíanos un mensaje
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Completa el formulario y tu mensaje nos llegará directo por WhatsApp.
          </p>
          <ContactForm />
        </div>
      </div>

      {/* Mapa */}
      <section aria-label="Mapa de ubicación" className="mt-12 overflow-hidden rounded-3xl ring-1 ring-zinc-200">
        <iframe
          title="Ubicación de Gama Autotrónica en Paine, Región Metropolitana"
          src="https://www.google.com/maps?q=Camino%20Padre%20Hurtado%2C%20Paine%2C%20Regi%C3%B3n%20Metropolitana%2C%20Chile&output=embed"
          className="h-80 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  );
}
