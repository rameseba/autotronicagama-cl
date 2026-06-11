"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart, cartTotal, cartCount } from "@/store/cart";
import { formatCLP } from "@/lib/utils";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons/social";

export function CartDrawer() {
  const { items, isOpen, close, removeItem, setQuantity, clear } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const total = cartTotal(items);
  const count = cartCount(items);

  // Bloquear scroll del fondo y cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const orderMessage = [
    `¡Hola ${site.name}! Quiero hacer el siguiente pedido:`,
    "",
    ...items.map(
      (i) =>
        `• ${i.name} x${i.quantity} — ${i.price > 0 ? formatCLP(i.price * i.quantity) : "precio a consultar"}`
    ),
    "",
    `Total: ${formatCLP(total)}`,
  ].join("\n");

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      {/* Fondo */}
      <button
        type="button"
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
        onClick={close}
        aria-label="Cerrar carrito"
        tabIndex={-1}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-zinc-900">
            Tu carrito {count > 0 && <span className="text-zinc-400">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={close}
            className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-zinc-300" aria-hidden="true" />
            <div>
              <p className="font-medium text-zinc-900">Tu carrito está vacío</p>
              <p className="mt-1 text-sm text-zinc-500">
                Explora nuestros equipos y productos para tu taller.
              </p>
            </div>
            <Link
              href="/productos"
              onClick={close}
              className="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-zinc-100 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <Link
                    href={`/productos/${item.slug}`}
                    onClick={close}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100"
                  >
                    {item.image && (
                      <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
                    )}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/productos/${item.slug}`}
                        onClick={close}
                        className="line-clamp-2 text-sm font-medium text-zinc-900 hover:text-brand-700"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded p-1 text-zinc-400 hover:bg-accent-50 hover:text-accent-600"
                        aria-label={`Quitar ${item.name} del carrito`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div
                        className="flex items-center rounded-full border border-zinc-200"
                        role="group"
                        aria-label={`Cantidad de ${item.name}`}
                      >
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          className="rounded-l-full p-1.5 px-2.5 text-zinc-600 hover:bg-zinc-100"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          className="rounded-r-full p-1.5 px-2.5 text-zinc-600 hover:bg-zinc-100"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-zinc-900">
                        {item.price > 0 ? formatCLP(item.price * item.quantity) : "Consultar"}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-zinc-200 px-5 py-4">
              <div className="flex items-center justify-between text-base">
                <span className="text-zinc-600">Total</span>
                <span className="font-display text-xl font-bold text-zinc-900">
                  {formatCLP(total)}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                El envío se coordina al confirmar el pedido.
              </p>
              <a
                href={whatsappLink(orderMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Finalizar pedido por WhatsApp
              </a>
              <button
                type="button"
                onClick={clear}
                className="mt-2 w-full rounded-full px-5 py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
