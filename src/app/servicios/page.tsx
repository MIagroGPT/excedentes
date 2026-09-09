import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ServiciosListClient from './ServiciosListClient';
import { getCMSContent } from '@/lib/dataStore';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  FileCheck2, 
  Recycle, 
  Check, 
  Truck,
  Building2,
  HardDrive,
  Scale
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Servicios de Gestión RAEE y Reciclaje | Excedentes de RAEES Suárez',
  description: 'Portafolio de desincorporación, reciclaje de RAEE, consultoría ambiental, certificados de disposición con QR y compra de excedentes en Medellín.',
};

export const revalidate = 0;

export default function ServiciosPage() {
  const content = getCMSContent();
  const servicios = content.servicios;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* Hero Header with Cover Image Background */}
      <section className="relative pt-36 pb-24 border-b border-slate-200 overflow-hidden">
        {/* Cover Image Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/portada-2.png" 
            alt="Servicios - Excedentes de RAEES Suárez"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* 50% White Overlay for Optimal Text Readability */}
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-white z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-brand-200 text-brand-800 text-xs uppercase tracking-widest font-extrabold mb-4 shadow-md backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Portafolio Corporativo & Industrial</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto drop-shadow-sm">
            Servicios Especializados en RAEE y Sostenibilidad
          </h1>

          <p className="text-slate-700 text-lg sm:text-xl mt-6 max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-2xs">
            Soluciones completas de desincorporación, pesaje certificado, destrucción segura de información y emisión de certificados ambientales oficiales para tu empresa.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/solicitar-recoleccion"
              className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Solicitar Recolección o Cotización</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#proceso"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-md transition-all"
            >
              Ver Ciclo de 10 Pasos
            </Link>
          </div>
        </div>
      </section>

      {/* Main Interactive Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Nuestras Líneas de Servicio
            </h2>
            <p className="text-slate-600 text-base mt-3">
              Selecciona el servicio que mejor se adapte a las necesidades de tu organización.
            </p>
          </div>

          <ServiciosListClient servicios={servicios} />
        </div>
      </section>

      {/* Additional Corporate Features / Value Proposition */}
      <section className="py-20 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-brand-700 font-extrabold px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200">
              Valor Agregado
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight">
              ¿Por qué las empresas eligen a Excedentes RAEES Suárez?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Blindaje Jurídico & Ambiental</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cumplimiento estricto de la Ley 1672 de 2013 y normativas de MinAmbiente y CORANTIOQUIA, eximiendo a tu empresa de sanciones ambientales.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Certificados Inmediatos con QR</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generamos el certificado oficial con balance de masas y código QR criptográfico listo para tus auditorías de calidad (ISO 14001, RUC).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <HardDrive className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Destrucción Segura de Datos</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Protocolo certificado de borrado y destrucción mecánica de discos duros y medios magnéticos, protegiendo los datos confidenciales de tu empresa.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Logística de Retiro en Sitio</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Flota vehicular y personal capacitado con EPP y seguridad social para cargar y transportar tus excedentes directamente desde tus bodegas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Pesaje y Básculas Certificadas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Proceso de pesaje transparente con calibración reglamentaria y entrega de actas de recepción con desglose de fracciones.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Beneficios Tributarios</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Optimiza la baja contable de activos obsoletos y accede a beneficios e incentivos tributarios por inversiones ambientales.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* High-Impact CTA Banner */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-3 text-center lg:text-left max-w-2xl">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                ¿Listo para coordinar la desincorporación de tus activos?
              </h3>
              <p className="text-sm text-slate-300">
                Completa nuestro formulario express y recibe una cotización y fecha estimada de recolección en menos de 2 horas.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/solicitar-recoleccion"
                className="px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-sm shadow-xl shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                Solicitar Recolección Inmediata
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp phone={content.contacto.whatsapp} />
    </main>
  );
}
