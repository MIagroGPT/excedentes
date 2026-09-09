'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  phone: string;
}

export default function FloatingWhatsApp({ phone }: FloatingWhatsAppProps) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  return (
    <aside aria-label="Contacto Rápido" className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      <div className="hidden sm:block bg-dark-bg/90 backdrop-blur-md border border-brand-500/30 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xl animate-bounce">
        ¿Dudas sobre reciclaje RAEE? ¡Escríbenos!
      </div>
      <a
        href={`https://wa.me/${cleanPhone}?text=Hola%20Excedentes%20de%20Raees%20Su%C3%A1rez,%20quisiera%20cotizar%20la%20recolecci%C3%B3n%20y%20certificaci%C3%B3n%20de%20residuos%20electr%C3%B3nicos.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir chat de WhatsApp con Excedentes de Raees Suárez"
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-brand-500 to-neon-green text-slate-950 flex items-center justify-center shadow-2xl shadow-brand-500/40 hover:scale-110 active:scale-95 transition-all group"
      >
        <MessageCircle className="w-7 h-7 fill-slate-950 text-slate-950 group-hover:rotate-12 transition-transform" />
      </a>
    </aside>
  );
}
