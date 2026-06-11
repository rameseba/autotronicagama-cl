import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Acceso clientes",
  description: "Ingresa con tu usuario y contraseña para acceder a la galería privada.",
  robots: { index: false },
};

export default function AccesoPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-brand-950 to-brand-900 px-4 py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
