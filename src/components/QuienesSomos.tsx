'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Eye, Sparkles, CheckCircle2, Leaf, ArrowRight } from 'lucide-react';
import { CMSContent } from '@/lib/types';

interface QuienesSomosProps {
  content: CMSContent['nosotros'];
}

export default function QuienesSomos({ content }: QuienesSomosProps) {
  return (
    <section id="nosotros" className="relative py-24 bg-white border-t border-slate-200 overflow-hidden">
      
      {/* Background soft ambient accents */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-700 font-extrabold px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200">
            {content.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-4 tracking-tight">
            {content.title}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-normal">
            {content.description}
          </p>
        </div>

        {/* Mission & Vision Cards (Clean Light Cards with subtle shadow) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Misión */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:border-brand-400 shadow-lg shadow-slate-100 transition-all duration-300 relative group overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-white mb-6 shadow-md shadow-brand-500/20">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>Nuestra Misión</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 font-bold">Propósito</span>
            </h3>
            <p className="text-slate-700 text-base leading-relaxed italic">
              &ldquo;{content.mision}&rdquo;
            </p>
          </div>

          {/* Visión */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:border-emerald-400 shadow-lg shadow-slate-100 transition-all duration-300 relative group overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mb-6 shadow-md shadow-emerald-500/20">
              <Eye className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>Nuestra Visión</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Futuro</span>
            </h3>
            <p className="text-slate-700 text-base leading-relaxed italic">
              &ldquo;{content.vision}&rdquo;
            </p>
          </div>
        </div>

        {/* Valores Corporativos */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 mb-16 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-brand-400" />
            <h3 className="text-xl font-bold text-white">Nuestros Valores Corporativos</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {content.valores.map((val, idx) => (
              <div key={idx} className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-100">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Historia & Impacto Local */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 uppercase tracking-wider">
              <Leaf className="w-4 h-4" />
              <span>Nuestra Trayectoria en Medellín</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Liderando la Economía Circular y el Manejo Responsable de RAEE en Antioquia
            </h3>
            <p className="text-slate-600 text-base leading-relaxed">
              {content.historia}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/quienes-somos"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 transition-all hover:scale-105"
              >
                <span>Conoce Más Sobre Nosotros</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#contacto"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-brand-700 transition-colors"
              >
                <span>Contacto Directo</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative aspect-[4/3] bg-slate-100">
              <img 
                src="/images/Reflexivo Historia.jpg.jpeg" 
                alt="Historia y Valores Excedentes RAEES Suárez"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md">
                <p className="text-xs font-bold text-brand-700">Medellín & Valle de Aburrá</p>
                <p className="text-xs text-slate-600">Comprometidos con el desarrollo sostenible y la desincorporación limpia.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
