"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { whatsappLink } from "@/lib/site";

export function ContactForm() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("Consulta general");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = [
      `Hola, soy ${name.trim() || "un cliente"}.`,
      `Tema: ${topic}`,
      "",
      message.trim(),
    ].join("\n");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-zinc-700">
          Tu nombre
        </label>
        <input
          id="nombre"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="Ej: Juan Pérez"
        />
      </div>

      <div>
        <label htmlFor="tema" className="block text-sm font-medium text-zinc-700">
          ¿Sobre qué nos escribes?
        </label>
        <select
          id="tema"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          <option>Consulta general</option>
          <option>Consulta por un producto</option>
          <option>Servicio: reparación de módulos</option>
          <option>Servicio: inmo off / DPF</option>
          <option>Estado de mi pedido</option>
        </select>
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-zinc-700">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1.5 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="Cuéntanos qué necesitas…"
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-brand-800 sm:w-auto"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        Enviar por WhatsApp
      </button>
    </form>
  );
}
