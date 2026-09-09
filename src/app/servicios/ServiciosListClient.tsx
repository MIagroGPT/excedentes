'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cpu, FileCheck2, Sparkles, Check, ArrowRight, X, PhoneCall, ShieldCheck, Zap } from 'lucide-react';
import { CMSContent } from '@/lib/types';

interface ServiciosListClientProps {
  servicios: CMSContent['servicios'];
}

export default function ServiciosListClient({ servicios }: ServiciosListClientProps) {
  const [selectedService, setSelectedService] = useState<CMSContent['servicios'][0] | null>(null);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-8 h-8 text-brand-600" />;
      case 'FileCheck': return <FileCheck2 className="w-8 h-8 text-emerald-600" />;
      case 'Sparkles': return <Sparkles className="w-8 h-8 text-teal-600" />;
      default: return <Cpu className="w-8 h-8 text-brand-600" />;
    }
  };

  return (
    <div>
      {/* Services Cards */}
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

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setSelectedService(srv)}
                className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group/btn cursor-pointer"
              >
                <span>Ver Detalles del Servicio</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <Link
                href="/solicitar-recoleccion"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <span>Cotizar este Servicio</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative">
            <button 
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                {getServiceIcon(selectedService.icon)}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{selectedService.title}</h3>
                <span className="text-xs text-brand-700 font-bold">Servicio Especializado Certificado</span>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {selectedService.description}
            </p>

            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Alcance y Beneficios Clave:</h4>
              <ul className="space-y-2">
                {selectedService.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/solicitar-recoleccion" 
                className="flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs text-center shadow-md shadow-brand-500/20"
                onClick={() => setSelectedService(null)}
              >
                Solicitar Cotización Inmediata
              </Link>
              <a 
                href="https://wa.me/573145181158?text=Hola,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios%20de%20gesti%C3%B3n%20RAEE"
                target="_blank" 
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-brand-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
