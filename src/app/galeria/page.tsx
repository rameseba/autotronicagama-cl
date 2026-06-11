import type { Metadata } from "next";
import { GalleryExplorer } from "@/components/gallery/gallery-explorer";

export const metadata: Metadata = {
  title: "Galería privada",
  description: "Buscador de imágenes exclusivo para clientes registrados.",
  robots: { index: false },
};

// Página privada por usuario: no debe prerenderizarse en el build
export const dynamic = "force-dynamic";

export default function GaleriaPage() {
  return <GalleryExplorer />;
}
