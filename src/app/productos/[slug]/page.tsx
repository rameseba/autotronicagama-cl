import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, PackageCheck, PackageX, ShieldCheck, Truck } from "lucide-react";
import { getProductBySlug, products, sortProducts } from "@/lib/products";
import { formatCLP } from "@/lib/utils";
import { site } from "@/lib/site";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { ProductCard } from "@/components/products/product-card";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const description =
    product.shortDescription || product.description.slice(0, 160) || site.description;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/productos/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = sortProducts(
    products.filter(
      (p) =>
        p.id !== product.id &&
        p.categories.some((c) => product.categories.some((pc) => pc.slug === c.slug))
    ),
    "relevancia"
  ).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || undefined,
    image: product.image ? `${site.url}${product.image}` : undefined,
    sku: String(product.id),
    brand: { "@type": "Brand", name: site.name },
    offers:
      product.price > 0
        ? {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "CLP",
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `${site.url}/productos/${product.slug}`,
          }
        : undefined,
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      {/* Migas de pan */}
      <nav aria-label="Miga de pan" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
          <li>
            <Link href="/" className="hover:text-brand-700">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link href="/productos" className="hover:text-brand-700">
              Productos
            </Link>
          </li>
          {product.categories[0] && (
            <>
              <li aria-hidden="true">
                <ChevronRight className="h-4 w-4" />
              </li>
              <li>
                <Link
                  href={`/productos?categoria=${product.categories[0].slug}`}
                  className="hover:text-brand-700"
                >
                  {product.categories[0].name}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li aria-current="page" className="font-medium text-zinc-800">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Imagen */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-white ring-1 ring-zinc-200">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-zinc-300">
              Sin imagen
            </span>
          )}
        </div>

        {/* Información */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
            {product.categories.map((c) => c.name).join(" · ")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            {product.name}
          </h1>
          {product.shortDescription && (
            <p className="mt-3 text-lg text-zinc-600">{product.shortDescription}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p className="font-display text-4xl font-bold text-zinc-900">
              {product.price > 0 ? formatCLP(product.price) : "Precio a consultar"}
            </p>
            {product.inStock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                <PackageCheck className="h-4 w-4" aria-hidden="true" />
                Disponible
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-500">
                <PackageX className="h-4 w-4" aria-hidden="true" />
                Agotado — consúltanos por reposición
              </span>
            )}
          </div>

          <div className="mt-7">
            <AddToCartButton product={product} />
          </div>

          <ul className="mt-8 space-y-3 rounded-2xl bg-white p-5 text-sm text-zinc-600 ring-1 ring-zinc-200">
            <li className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-brand-600" aria-hidden="true" />
              Envíos a todo Chile
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-brand-600" aria-hidden="true" />
              Cambio por mal funcionamiento en productos Gama
            </li>
          </ul>

          {product.description && (
            <section className="mt-8" aria-labelledby="descripcion">
              <h2 id="descripcion" className="font-display text-xl font-semibold text-zinc-900">
                Descripción
              </h2>
              <p className="mt-3 whitespace-pre-line leading-7 text-zinc-600">
                {product.description}
              </p>
            </section>
          )}
        </div>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="relacionados">
          <h2 id="relacionados" className="font-display text-2xl font-bold text-zinc-900">
            También te puede interesar
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
