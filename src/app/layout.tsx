import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { WhatsAppFab } from "@/components/whatsapp-fab";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Electrónica y programación automotriz`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "autotrónica",
    "electrónica automotriz",
    "programación automotriz",
    "diagnóstico automotriz",
    "ECU",
    "PCMFlash",
    "scanner automotriz",
    "Chile",
    "Paine",
  ],
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Electrónica y programación automotriz`,
    description: site.description,
    images: [{ url: "/images/brand/logo.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Electrónica y programación automotriz`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoPartsStore",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: `+${site.phoneRaw}`,
  email: site.email,
  image: `${site.url}/images/brand/logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Cam. Padre Hurtado, casa n°32",
    addressLocality: "Paine",
    addressRegion: "Región Metropolitana",
    postalCode: "9450000",
    addressCountry: "CL",
  },
  sameAs: [site.social.instagram, site.social.tiktok],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CL"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido principal
        </a>
        <Header />
        <main id="contenido" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <WhatsAppFab />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
