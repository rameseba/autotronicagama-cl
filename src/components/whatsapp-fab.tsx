import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons/social";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Hola Gama Autotrónica, tengo una consulta.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-30 rounded-full bg-green-600 p-3.5 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-700"
      aria-label="Escríbenos por WhatsApp"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}
