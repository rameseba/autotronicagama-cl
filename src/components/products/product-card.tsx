import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatCLP } from "@/lib/utils";
import { AddToCartButton } from "@/components/products/add-to-cart-button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-brand-300">
      <Link
        href={`/productos/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-zinc-50"
        aria-label={product.name}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-zinc-300">Sin imagen</span>
        )}
        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-zinc-900/85 px-2.5 py-1 text-xs font-semibold text-white">
            Agotado
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
          {product.categories[0]?.name}
        </p>
        <h3 className="line-clamp-2 font-medium leading-snug text-zinc-900">
          <Link href={`/productos/${product.slug}`} className="hover:text-brand-700">
            {product.name}
          </Link>
        </h3>
        {product.shortDescription && (
          <p className="line-clamp-2 text-sm text-zinc-500">{product.shortDescription}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <p className="font-display text-lg font-bold text-zinc-900">
            {product.price > 0 ? formatCLP(product.price) : "A consultar"}
          </p>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
