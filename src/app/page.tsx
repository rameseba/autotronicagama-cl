import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CircuitBoard,
  Cpu,
  HandshakeIcon,
  RefreshCcw,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { getFeaturedProducts, getCategories } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";
import { site } from "@/lib/site";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Pago seguro",
    description: "Compra con 100% de seguridad y respaldo en cada transacción.",
  },
  {
    icon: RefreshCcw,
    title: "Garantía de cambio",
    description: "Cambio por mal funcionamiento en productos Gama.",
  },
  {
    icon: HandshakeIcon,
    title: "Apoyo en tu compra",
    description: "Te asesoramos para que elijas el equipo correcto para tu taller.",
  },
  {
    icon: Truck,
    title: "Envíos a todo Chile",
    description: "Despachamos a todas las regiones del país.",
  },
];

const categoryIcons: Record<string, typeof Cpu> = {
  "equipos-de-diagnostico": Wrench,
  "equipos-de-programacion": Cpu,
  "componentes-electronicos": CircuitBoard,
};

export default function Home() {
  const featured = getFeaturedProducts(8);
  const categories = getCategories();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, var(--color-brand-500) 0%, transparent 45%), radial-gradient(circle at 10% 90%, var(--color-accent-700) 0%, transparent 40%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-700 bg-brand-900/60 px-4 py-1.5 text-sm font-medium text-brand-200">
              <Cpu className="h-4 w-4 text-accent-400" aria-hidden="true" />
              Especialistas en autotrónica
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Electrónica y programación{" "}
              <span className="bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent">
                automotriz
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-brand-200">
              Nos comprometemos a ofrecerte los mejores productos. Todas las marcas, máxima
              calidad y envíos a todo Chile para llevar tu taller al siguiente nivel.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 rounded-full bg-accent-600 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-accent-700"
              >
                Ver productos
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-full border border-brand-600 px-7 py-3.5 font-semibold text-brand-100 transition-colors hover:bg-brand-900"
              >
                Contáctanos
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl ring-1 ring-brand-700/50">
              <Image
                src="/images/brand/taller-1.jpeg"
                alt="Laboratorio de electrónica automotriz de Gama Autotrónica"
                fill
                priority
                sizes="(max-width: 1024px) 0px, 512px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 to-transparent" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Pilares de servicio */}
      <section aria-labelledby="pilares" className="border-b border-zinc-200 bg-white">
        <h2 id="pilares" className="sr-only">
          Nuestros compromisos
        </h2>
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex gap-4 p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <pillar.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-zinc-900">{pillar.title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-500">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section aria-labelledby="categorias" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="categorias" className="font-display text-3xl font-bold tracking-tight text-zinc-900">
              Explora por categoría
            </h2>
            <p className="mt-2 text-zinc-500">
              Todo lo que tu taller necesita, organizado para encontrarlo rápido.
            </p>
          </div>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] ?? CircuitBoard;
            return (
              <li key={category.slug}>
                <Link
                  href={`/productos?categoria=${category.slug}`}
                  className="group flex h-full flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center ring-1 ring-zinc-200 transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-brand-300"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium leading-tight text-zinc-800">
                    {category.name}
                  </span>
                  <span className="text-xs text-zinc-400">{category.count} productos</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Productos destacados */}
      <section aria-labelledby="destacados" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="destacados" className="font-display text-3xl font-bold tracking-tight text-zinc-900">
                Nuevos productos
              </h2>
              <p className="mt-2 text-zinc-500">
                Equipos y herramientas seleccionadas para el diagnóstico y la programación.
              </p>
            </div>
            <Link
              href="/productos"
              className="hidden items-center gap-1.5 font-medium text-brand-700 hover:text-brand-900 sm:inline-flex"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/productos"
              className="inline-flex items-center gap-1.5 font-medium text-brand-700"
            >
              Ver todos los productos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Qué es la autotrónica */}
      <section aria-labelledby="autotronica" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-3xl lg:order-1">
            <Image
              src="/images/brand/taller-2.jpeg"
              alt="Trabajo de programación de módulos en el laboratorio"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 id="autotronica" className="font-display text-3xl font-bold tracking-tight text-zinc-900">
              ¿Qué es la autotrónica?
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-600">
              La autotrónica es la fusión entre la mecánica automotriz y la electrónica: la
              disciplina clave en los vehículos modernos, con sistemas de control,
              diagnóstico y automatización cada vez más sofisticados.
            </p>
            <p className="mt-4 leading-7 text-zinc-600">
              Conocemos cada sección del rubro porque lo recorrimos completo: desde ayudante
              de mecánico hasta laboratorio de electrónica y programación automotriz. Por eso
              sabemos exactamente qué necesita tu taller.
            </p>
            <Link
              href="/sobre-nosotros"
              className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:text-brand-900"
            >
              Conoce nuestra historia
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-brand-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white">
            ¿Necesitas asesoría para tu taller?
          </h2>
          <p className="max-w-2xl text-lg text-brand-200">
            Escríbenos y te ayudamos a elegir el equipo de diagnóstico o programación
            adecuado para tu trabajo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`tel:+${site.phoneRaw}`}
              className="rounded-full bg-white px-7 py-3.5 font-semibold text-brand-900 transition-colors hover:bg-brand-100"
            >
              Llámanos: {site.phone}
            </a>
            <Link
              href="/contacto"
              className="rounded-full border border-brand-600 px-7 py-3.5 font-semibold text-brand-100 transition-colors hover:bg-brand-900"
            >
              Ir a contacto
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
