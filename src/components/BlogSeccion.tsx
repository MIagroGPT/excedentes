'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { CMSContent } from '@/lib/types';

interface BlogSeccionProps {
  articulos: CMSContent['blog'];
}

export default function BlogSeccion({ articulos }: BlogSeccionProps) {
  return (
    <section id="blog" className="relative py-24 bg-white border-t border-slate-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-700 font-extrabold px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200">
            Educación Ambiental & Noticias
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-4 tracking-tight">
            Artículos y Consejos Prácticos RAEE
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-normal">
            Aprende sobre reducción de huella electrónica, normativas ambientales colombianas y prácticas sostenibles.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articulos.map((art) => (
            <article 
              key={art.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-brand-400 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image / Header banner */}
              <div className="relative h-48 bg-slate-900 overflow-hidden">
                {art.imagen ? (
                  <img
                    src={art.imagen}
                    alt={art.titulo}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-brand-900 via-slate-900 to-emerald-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent z-10" />
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded bg-brand-500 text-slate-950 shadow-md">
                    {art.categoria}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-600" />
                      {art.fecha}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      {art.tiempoLectura}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-700 transition-colors leading-snug">
                    {art.titulo}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {art.resumen}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href="#contacto"
                    className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-800"
                  >
                    <span>Leer Artículo Completo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Subscription Box */}
        <div className="mt-16 rounded-3xl p-8 bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-white flex items-center gap-2 justify-center md:justify-start">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Suscríbete a nuestro Boletín Ambiental</span>
            </h4>
            <p className="text-xs text-slate-300">Recibe normativas, fechas de jornadas de recolección y guías de postconsumo.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert("¡Gracias por suscribirte al boletín de Excedentes de Raees Suárez!"); }} className="flex w-full md:w-auto max-w-md gap-2">
            <input 
              type="email"
              required
              placeholder="tu.correo@empresa.com"
              className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs flex-1 focus:outline-none focus:border-brand-400 placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-md"
            >
              Suscribirme
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
