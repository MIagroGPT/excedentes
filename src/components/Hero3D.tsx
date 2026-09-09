'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Recycle, Truck, Award, Sparkles, ChevronDown } from 'lucide-react';
import { CMSContent } from '@/lib/types';

interface HeroProps {
  content: CMSContent['hero'];
}

export default function Hero3D({ content }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: content.portada1 || '/images/portada-1.png',
      alt: 'Excedentes de RAEES Suárez - Portada 1'
    },
    {
      id: 2,
      image: content.portada2 || '/images/portada-2.png',
      alt: 'Excedentes de RAEES Suárez - Portada 2'
    }
  ];

  // Auto slide transition every 6 seconds (pure opacity crossfade, no zoom)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="inicio" className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-16 overflow-hidden">
      
      {/* Background Slideshow Slider (Static position, smooth opacity only - no zoom/scale) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-center transform-none"
              />
            </div>
          );
        })}
      </div>

      {/* Capa Blanca con 50% de Transparencia para Lectura Óptima */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 pointer-events-none" />

      {/* Subtle top and bottom gradient fades for smooth page blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-slate-100/90 z-10 pointer-events-none" />

      {/* Top Hero Text Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4 md:pt-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-brand-200 text-brand-800 text-xs sm:text-sm font-extrabold shadow-md mb-6 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-brand-600 animate-pulse" />
          <span>{content.badge}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-5xl mx-auto uppercase drop-shadow-sm">
          {content.title.split(',')[0]}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-700 drop-shadow-sm">
            {content.title.split(',')[1] || 'CUIDAMOS NUESTRO PLANETA'}
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-700 max-w-3xl mx-auto font-semibold leading-relaxed drop-shadow-2xs">
          {content.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/solicitar-recoleccion"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-base shadow-xl shadow-brand-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
          >
            <span>{content.ctaPrimary}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/#proceso"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Recycle className="w-5 h-5 text-brand-600" />
            <span>{content.ctaSecondary}</span>
          </Link>
        </div>

        {/* Quick Stats Badges */}
        <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto pt-6 border-t border-slate-300/80">
          <div className="bg-white/95 p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-md backdrop-blur-md">
            <div className="text-xl sm:text-3xl font-black text-brand-600">{content.stat1.number}</div>
            <div className="text-[11px] sm:text-xs text-slate-700 font-bold">{content.stat1.label}</div>
          </div>
          <div className="bg-white/95 p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-md backdrop-blur-md">
            <div className="text-xl sm:text-3xl font-black text-emerald-600">{content.stat2.number}</div>
            <div className="text-[11px] sm:text-xs text-slate-700 font-bold">{content.stat2.label}</div>
          </div>
          <div className="bg-white/95 p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-md backdrop-blur-md">
            <div className="text-xl sm:text-3xl font-black text-teal-600">{content.stat3.number}</div>
            <div className="text-[11px] sm:text-xs text-slate-700 font-bold">{content.stat3.label}</div>
          </div>
        </div>
      </div>

      {/* Slider Manual Indicators */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center mt-8 mb-2">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Ir a portada ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-brand-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 4 Interactive Placards / Cards (Pure CSS smooth hover, no React state re-rendering, no background jump) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 lg:mt-10 w-full">
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-widest text-slate-700 font-extrabold bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-300 shadow-sm">
            Pilares Estratégicos de Operación
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.cards.map((card) => {
            return (
              <Link
                key={card.id}
                href="/servicios"
                className="group relative rounded-2xl p-5 bg-white/95 hover:bg-white text-slate-800 border border-slate-200 hover:border-brand-500 shadow-md hover:shadow-xl hover:shadow-brand-500/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer block"
              >
                <div>
                  {/* Card Header: Icon & Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white group-hover:shadow-md">
                      {card.icon === 'Truck' && <Truck className="w-5 h-5" />}
                      {card.icon === 'Award' && <Award className="w-5 h-5" />}
                      {card.icon === 'Recycle' && <Recycle className="w-5 h-5" />}
                      {card.icon === 'ShieldCheck' && <ShieldCheck className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-slate-100 group-hover:bg-brand-50 text-slate-700 group-hover:text-brand-800 border border-slate-200 group-hover:border-brand-200 transition-colors">
                      {card.tag}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-base font-bold mb-2 text-slate-900 group-hover:text-brand-700 transition-colors">
                    {card.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-xs leading-relaxed text-slate-600">
                    {card.description}
                  </p>
                </div>

                {/* Card Action Link */}
                <div className="mt-4 pt-3 flex items-center justify-between text-[11px] font-bold border-t border-slate-200/80 text-brand-600 group-hover:text-brand-700 transition-colors">
                  <span>Explorar Solución</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-20 flex justify-center mt-10">
        <a 
          href="/#proceso" 
          className="flex flex-col items-center gap-1.5 text-xs text-slate-600 hover:text-brand-600 transition-colors bg-white/80 px-4 py-2 rounded-full border border-slate-200 shadow-sm backdrop-blur-sm"
          aria-label="Desplazarse hacia el ciclo de proceso"
        >
          <span className="text-[10px] uppercase tracking-widest font-extrabold">Conoce el Proceso de 10 Etapas</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-brand-600" />
        </a>
      </div>

    </section>
  );
}
