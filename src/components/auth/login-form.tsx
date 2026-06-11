"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, KeyRound, Loader2, Lock, Mail } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { site, whatsappLink } from "@/lib/site";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo."
          : "No pudimos iniciar sesión. Inténtalo nuevamente en unos segundos."
      );
      return;
    }
    const next = searchParams.get("next");
    router.push(next && next.startsWith("/") ? next : "/galeria");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex justify-center">
          <Image
            src="/images/brand/logo.png"
            alt="Gama Autotrónica"
            width={200}
            height={54}
            className="h-12 w-auto"
          />
        </div>
        <h1 className="mt-6 text-center font-display text-2xl font-bold text-zinc-900">
          Acceso clientes
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-500">
          Ingresa con tu usuario y contraseña para ver la galería privada.
        </p>

        {!configured ? (
          <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 ring-1 ring-amber-200">
            <p className="font-semibold">Configuración pendiente</p>
            <p className="mt-1">
              El acceso privado aún no está activado. Falta conectar el proyecto de
              Supabase (variables en <code className="font-mono">.env.local</code>) y
              ejecutar <code className="font-mono">supabase/schema.sql</code>.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                Correo electrónico
              </label>
              <div className="relative mt-1.5">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  placeholder="tu@correo.cl"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                Contraseña
              </label>
              <div className="relative mt-1.5">
                <Lock
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-11 pr-12 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-zinc-700"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-accent-50 p-3 text-sm text-accent-700 ring-1 ring-accent-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <KeyRound className="h-5 w-5" aria-hidden="true" />
              )}
              {loading ? "Ingresando…" : "Ingresar"}
            </button>
          </form>
        )}
      </div>

      <p className="mt-5 text-center text-sm text-brand-200">
        ¿No tienes cuenta?{" "}
        <a
          href={whatsappLink("Hola, quiero solicitar acceso a la galería privada de " + site.name + ".")}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white underline underline-offset-4 hover:text-brand-100"
        >
          Solicítala por WhatsApp
        </a>
      </p>
    </div>
  );
}
