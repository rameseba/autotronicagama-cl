"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Phone, Search, ShoppingCart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { useCart, cartCount } from "@/store/cart";
import { SearchDialog } from "@/components/search/search-dialog";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
  { href: "/contacto", label: "Contacto" },
  { href: "/descargas", label: "Descargas" },
  { href: "/galeria", label: "Galería" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const count = cartCount(items);

  return (
    <header className="sticky top-0 z-40">
      {/* Barra superior */}
      <div className="bg-brand-950 text-brand-100">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs sm:px-6">
          <p className="font-medium tracking-wide">
            Envíos a todo Chile · Asesoría especializada en autotrónica
          </p>
          <a
            href={`tel:+${site.phoneRaw}`}
            className="hidden items-center gap-1.5 hover:text-white sm:flex"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {site.phone}
          </a>
        </div>
      </div>

      {/* Barra principal */}
      <div className="border-b border-zinc-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            className="rounded-md p-2 text-zinc-700 hover:bg-zinc-100 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="menu-movil"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex shrink-0 items-center" aria-label="Gama Autotrónica — Inicio">
            <Image
              src="/images/brand/logo.png"
              alt="Gama Autotrónica"
              width={170}
              height={46}
              priority
              className="h-10 w-auto"
            />
          </Link>

          <nav className="ml-6 hidden lg:block" aria-label="Navegación principal">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const active =
                  link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-brand-50 text-brand-800"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-zinc-300 px-3 py-2 text-sm text-zinc-500 transition-colors hover:border-brand-400 hover:text-zinc-800 sm:min-w-44"
              aria-label="Buscar productos"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Buscar productos…</span>
              <kbd className="ml-auto hidden rounded border border-zinc-300 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 sm:inline">
                Ctrl K
              </kbd>
            </button>

            <button
              type="button"
              onClick={openCart}
              className="relative rounded-full p-2.5 text-zinc-700 transition-colors hover:bg-zinc-100"
              aria-label={`Abrir carrito de compras${count > 0 ? `, ${count} producto${count === 1 ? "" : "s"}` : ""}`}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {count > 0 && (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-600 px-1 text-[11px] font-bold text-white"
                  aria-hidden="true"
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {mobileOpen && (
          <nav
            id="menu-movil"
            aria-label="Navegación móvil"
            className="border-t border-zinc-200 bg-white lg:hidden"
          >
            <ul className="space-y-1 px-4 py-3">
              {navLinks.map((link) => {
                const active =
                  link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-md px-3 py-2.5 text-base font-medium",
                        active
                          ? "bg-brand-50 text-brand-800"
                          : "text-zinc-700 hover:bg-zinc-100"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <a
                  href={`tel:+${site.phoneRaw}`}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-500"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {site.phone}
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
