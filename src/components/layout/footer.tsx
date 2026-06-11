import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/icons/social";

const shopLinks = [
  { href: "/productos", label: "Todos los productos" },
  { href: "/productos?categoria=equipos-de-diagnostico", label: "Equipos de diagnóstico" },
  { href: "/productos?categoria=equipos-de-programacion", label: "Equipos de programación" },
  { href: "/productos?categoria=componentes-electronicos", label: "Componentes electrónicos" },
  { href: "/productos?categoria=productos-digitales", label: "Productos digitales" },
  { href: "/productos?categoria=servicios", label: "Servicios" },
];

const companyLinks = [
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
  { href: "/contacto", label: "Contacto" },
  { href: "/descargas", label: "Descargas" },
  { href: "/galeria", label: "Galería privada" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-brand-950 text-brand-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div>
            <div className="inline-block rounded-lg bg-white p-2">
              <Image
                src="/images/brand/logo.png"
                alt="Gama Autotrónica"
                width={160}
                height={43}
                className="h-9 w-auto"
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-brand-200">
              Electrónica y programación automotriz. Lo mejor para tu taller, con envíos a
              todo Chile.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-brand-900 p-2.5 transition-colors hover:bg-brand-800 hover:text-white"
                aria-label={`Instagram ${site.social.instagramHandle}`}
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={site.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-brand-900 p-2.5 transition-colors hover:bg-brand-800 hover:text-white"
                aria-label={`TikTok ${site.social.tiktokHandle}`}
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
              <a
                href={site.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-brand-900 p-2.5 transition-colors hover:bg-brand-800 hover:text-white"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Tienda */}
          <nav aria-label="Enlaces de la tienda">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Tienda
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-brand-200 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Empresa */}
          <nav aria-label="Enlaces de la empresa">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Empresa
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-brand-200 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto */}
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Contacto
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`tel:+${site.phoneRaw}`}
                  className="flex items-start gap-2.5 text-brand-200 transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-start gap-2.5 break-all text-brand-200 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-brand-200">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {site.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-brand-900 pt-6 text-center text-xs text-brand-300">
          © {new Date().getFullYear()} {site.legalName} — Electrónica y programación automotriz.
        </div>
      </div>
    </footer>
  );
}
