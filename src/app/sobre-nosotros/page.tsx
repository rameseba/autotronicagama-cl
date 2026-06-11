import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wrench, Zap, CircuitBoard, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "Conoce la historia de Gama Autotrónica: de ayudante de mecánico a laboratorio de electrónica y programación automotriz. Lo mejor para tu taller.",
  alternates: { canonical: "/sobre-nosotros" },
};

const timeline = [
  {
    icon: Wrench,
    title: "Ayudante de mecánico",
    description:
      "Nuestros inicios: aprendiendo el oficio desde la base, conociendo cada rincón de un taller.",
  },
  {
    icon: Wrench,
    title: "Taller mecánico",
    description:
      "Crecimos a taller propio, resolviendo los problemas mecánicos del día a día.",
  },
  {
    icon: Zap,
    title: "Taller de electricidad",
    description:
      "El siguiente paso natural: dominar los sistemas eléctricos del automóvil.",
  },
  {
    icon: CircuitBoard,
    title: "Laboratorio de electrónica y programación automotriz",
    description:
      "Hoy somos especialistas en autotrónica: diagnóstico, reparación de módulos y programación de ECUs.",
  },
];

export default function SobreNosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-400">
            Sobre nosotros
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Dedicados a entregarte los mejores productos en autotrónica
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-brand-200">
            Lo mejor para tu taller, de parte de quienes conocen el rubro desde adentro.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section aria-labelledby="historia" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 id="historia" className="font-display text-3xl font-bold tracking-tight text-zinc-900">
              Nuestro camino
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-600">
              Actualmente somos una empresa dedicada a la electrónica y programación
              automotriz, pero nuestro camino inició desde ayudante de mecánico, a taller
              mecánico, taller de electricidad, y posteriormente a un laboratorio de
              electrónica y programación automotriz.
            </p>
            <p className="mt-4 leading-7 text-zinc-600">
              Es por esa razón que conocemos cada sección de nuestro rubro y sabemos qué
              necesidades hay en cada una de ellas, para así poder brindar soluciones a las
              necesidades de tu taller.
            </p>

            <ol className="mt-10 space-y-0">
              {timeline.map((step, index) => (
                <li key={step.title} className="relative flex gap-5 pb-10 last:pb-0">
                  {index < timeline.length - 1 && (
                    <span
                      className="absolute left-6 top-12 h-[calc(100%-3rem)] w-px bg-brand-200"
                      aria-hidden="true"
                    />
                  )}
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white ring-4 ring-brand-50">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="pt-1.5">
                    <h3 className="font-semibold text-zinc-900">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src="/images/brand/taller-2.jpeg"
                alt="Trabajo de electrónica en el laboratorio de Gama Autotrónica"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src="/images/brand/taller-3.jpeg"
                alt="Equipos de programación automotriz en uso"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lo mejor para tu taller */}
      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <GraduationCap className="h-10 w-10 text-brand-600" aria-hidden="true" />
          <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900">
            Lo mejor para tu taller
          </h2>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600">
            Cada producto de nuestro catálogo está seleccionado con criterio técnico, porque
            antes de venderlos, los usamos.
          </p>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Explorar el catálogo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
