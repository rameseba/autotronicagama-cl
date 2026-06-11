"use client";

import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons/social";

type Props = {
  product: Product;
  compact?: boolean;
};

export function AddToCartButton({ product, compact = false }: Props) {
  const addItem = useCart((s) => s.addItem);

  // Sin precio publicado: derivar a consulta por WhatsApp
  if (product.price <= 0) {
    return (
      <a
        href={whatsappLink(`Hola, quiero consultar por: ${product.name}`)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full bg-green-600 font-semibold text-white transition-colors hover:bg-green-700",
          compact ? "p-2.5" : "px-6 py-3 text-sm"
        )}
        aria-label={`Consultar por ${product.name} en WhatsApp`}
      >
        <WhatsAppIcon className={compact ? "h-4 w-4" : "h-5 w-5"} />
        {!compact && "Consultar por WhatsApp"}
      </a>
    );
  }

  if (!product.inStock) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-zinc-100 font-medium text-zinc-400",
          compact ? "px-3 py-2 text-xs" : "px-6 py-3 text-sm"
        )}
      >
        Agotado
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 font-semibold text-white transition-colors hover:bg-brand-800 active:scale-95",
        compact ? "p-2.5" : "px-6 py-3 text-sm"
      )}
      aria-label={`Agregar ${product.name} al carrito`}
    >
      <ShoppingCart className={compact ? "h-4 w-4" : "h-5 w-5"} aria-hidden="true" />
      {!compact && "Agregar al carrito"}
    </button>
  );
}
