'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, ShieldCheck, Building } from 'lucide-react';
import { CMSContent } from '@/lib/types';

interface TestimoniosCasosProps {
  galeria?: CMSContent['galeria'];
}

const DEFAULT_PROMO_IMAGES = [
  { id: '1', src: '/images/Promocional HISTORIA 1.jpg.jpeg', title: 'Transformación Tecnológica Sostenible' },
  { id: '2', src: '/images/Promocional HISTORIA 2.jpg.jpeg', title: 'Certificación Ambiental Corporativa' },
  { id: '3', src: '/images/Promocional HISTORIA 3.jpg.jpeg', title: 'Cero Vertedero y Economía Circular' },
  { id: '4', src: '/images/Testimonio.jpg.jpeg', title: 'Experiencia y Confianza Empresarial' }
];

export default function TestimoniosCasos({ galeria }: TestimoniosCasosProps = {}) {
  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const [promoList, setPromoList] = useState(galeria && galeria.length > 0 ? galeria : DEFAULT_PROMO_IMAGES);

  useEffect(() => {
    if (galeria && galeria.length > 0) {
      setPromoList(galeria);
    } else {
      fetch('/api/cms')
        .then(r => r.json())
        .then(data => {
          if (data?.galeria && data.galeria.length > 0) {
            setPromoList(data.galeria);
          }
        })
        .catch(err => console.error('Error cargando galería en TestimoniosCasos:', err));
    }
  }, [galeria]);

  const promoImages = promoList;

  const testimonios = [
    {
      nombre: 'Alejandro Morales',
      cargo: 'Gerente de TI & Infraestructura',
      empresa: 'Grupo Industrial Antioquia',
      comentario: 'Excedentes de Raees Suárez nos permitió desincorporar más de 3 toneladas de servidores y computadores con total tranquilidad. El certificado oficial y el informe de desarme con QR pasaron nuestra auditoría ISO 14001 sin observaciones.',
      rating: 5,
      ciudad: 'Medellín'
    },
    {
      nombre: 'Dra. Carolina Vélez',
      cargo: 'Directora de Sostenibilidad y ESG',
      empresa: 'Servicios Financieros del Valle',
      comentario: 'La puntualidad en la recolección y la trazabilidad en cada una de las 10 etapas del ciclo nos demostraron que son los mejores aliados ambientales de la región. El soporte vía WhatsApp y la plataforma web son excelentes.',
      rating: 5,
      ciudad: 'Envigado'
    },
    {
      nombre: 'Ing. David Henao',
      cargo: 'Jefe de Operaciones y Mantenimiento',
      empresa: 'Redes & Soluciones Digitales',
      comentario: 'Destacamos la destrucción segura de discos duros y el aprovechamiento de materiales secundarios. Muy recomendados para cualquier empresa que valore el cumplimiento legal estricto.',
      rating: 5,
      ciudad: 'Itagüí'
    }
  ];

  return (
    <section className="relative py-24 bg-slate-50 border-t border-slate-200 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-700 font-extrabold px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-200">
            Casos de Éxito & Testimonios
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-4 tracking-tight">
            La Confianza de Nuestros Clientes
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-normal">
            Empresas líderes en Antioquia y Colombia confían en nuestros procesos de certificación y desincorporación tecnológica.
          </p>
        </div>

        {/* Testimonials Grid (Clean White Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {testimonios.map((t, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-brand-400 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-brand-200 group-hover:text-brand-500 transition-colors" />
                </div>

                <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 italic">
                  &ldquo;{t.comentario}&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{t.nombre}</h4>
                  <p className="text-xs text-brand-700 font-semibold">{t.cargo}</p>
                  <p className="text-xs text-slate-500">{t.empresa} • {t.ciudad}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700">
                  <Building className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Promotional Gallery Carousel */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <span>Galería de Procesos & Experiencias</span>
              </h3>
              <p className="text-xs text-slate-500">Conoce el respaldo técnico y visual de nuestras campañas de recolección.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePromoIndex(prev => (prev === 0 ? promoImages.length - 1 : prev - 1))}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActivePromoIndex(prev => (prev === promoImages.length - 1 ? 0 : prev + 1))}
                className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-colors shadow-md"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {promoImages.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setActivePromoIndex(idx)}
                className={`relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 border transition-all cursor-pointer group ${
                  activePromoIndex === idx ? 'border-brand-500 ring-2 ring-brand-500/30 shadow-lg' : 'border-slate-200 opacity-90 hover:opacity-100'
                }`}
              >
                <img 
                  src={img.src} 
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <p className="text-xs font-bold text-white">{img.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
