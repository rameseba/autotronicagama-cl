export const site = {
  name: "Gama Autotrónica",
  legalName: "Autotrónica Gama",
  description:
    "Electrónica y programación automotriz. Equipos de diagnóstico, programación, componentes electrónicos y servicios para tu taller. Envíos a todo Chile.",
  url: "https://autotronicagama.cl",
  phone: "+56 9 9732 5070",
  phoneRaw: "56997325070",
  email: "autotronicagama01@gmail.com",
  address: "Cam. Padre Hurtado, casa n°32, Paine, Región Metropolitana",
  addressShort: "Paine, Región Metropolitana",
  social: {
    instagram: "https://www.instagram.com/gama_autotronica",
    instagramHandle: "@gama_autotronica",
    tiktok: "https://www.tiktok.com/@gama.autotronica",
    tiktokHandle: "@gama.autotronica",
    whatsapp: "https://wa.me/56997325070",
  },
} as const;

export function whatsappLink(message: string): string {
  return `${site.social.whatsapp}?text=${encodeURIComponent(message)}`;
}
