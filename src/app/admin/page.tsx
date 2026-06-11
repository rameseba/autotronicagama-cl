import type { Metadata } from "next";
import { AdminPanel } from "@/components/gallery/admin-panel";

export const metadata: Metadata = {
  title: "Administración de galería",
  description: "Sube y gestiona las imágenes de la galería privada.",
  robots: { index: false },
};

// Página privada por usuario: no debe prerenderizarse en el build
export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminPanel />;
}
