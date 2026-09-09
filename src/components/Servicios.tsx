'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cpu, FileCheck2, Sparkles, Check, ArrowRight, X, PhoneCall } from 'lucide-react';
import { CMSContent } from '@/lib/types';

interface ServiciosProps {
  servicios: CMSContent['servicios'];
}

export default function Servicios({ servicios }: ServiciosProps) {
  const [selectedService, setSelectedService] = useState<CMSContent['servicios'][0] | null>(null);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-8 h-8 text-brand-600" />;
      case 'FileCheck':
        return <FileCheck2 className="w-8 h-8 text-emerald-600" />;
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-teal-600" />;
      default:
        return <Cpu className="w-8 h-8 text-brand-600" />;
    }
  };

  return (
    <section id="servicios" className="relative py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-700 font-extrabold px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-200">
            Portafolio Especializado
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-4 tracking-tight">
            Nuestros Servicios de Gestión & Sostenibilidad
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-normal">
            Soluciones integrales de desincorporación, reciclaje de RAEE y cumplimiento ambiental diseñadas a la medida de empresas e instituciones.
          </p>
        </div>

        {/* Services Grid (Clean White Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicios.map((srv) => (
            <div 
              key={srv.id}
              className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-brand-400 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  {getServiceIcon(srv.icon)}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-brand-700 transition-colors">
                  {srv.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {srv.description}
                </p>

                {/* Features list */}
                <ul className="space-y-3 mb-8">
                  {srv.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-brand-700 font-bold" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedService(srv)}
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group/btn cursor-pointer"
                >
                  <span>Solicita Más Información</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Services Link */}
        <div className="mt-10 text-center">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm border border-slate-300 shadow-sm transition-all hover:scale-105"
          >
            <span>Ver Portafolio Completo y Beneficios de Servicios</span>
            <ArrowRight className="w-4 h-4 text-brand-600" />
          </Link>
        </div>

        {/* High-Contrast Highlight Banner */}
        <div className="mt-12 rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-black text-white">¿Tu empresa necesita un plan de desincorporación masivo?</h4>
            <p className="text-sm text-slate-300">Agendamos visitas técnicas de valoración en sitio sin costo para el Valle de Aburrá.</p>
          </div>
          <Link
            href="/solicitar-recoleccion"
            className="px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-sm shrink-0 shadow-xl shadow-brand-500/20 hover:scale-105 transition-all"
          >
            Agendar Diagnóstico Técnico
          </Link>
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-slate-900">
            <button
              type="button"
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-2 rounded-xl bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center mb-4">
              {getServiceIcon(selectedService.icon)}
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedService.title}</h3>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">{selectedService.description}</p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
              <h4 className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-2">Alcance y Operación</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{selectedService.detalles}</p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/solicitar-recoleccion"
                className="flex-1 py-3 text-center rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-colors shadow-md"
                onClick={() => setSelectedService(null)}
              >
                Solicitar Cotización
              </Link>
              <a
                href={`https://wa.me/573145181158?text=Hola,%20quisiera%20más%20información%20sobre%20el%20servicio:%20${encodeURIComponent(selectedService.title)}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
