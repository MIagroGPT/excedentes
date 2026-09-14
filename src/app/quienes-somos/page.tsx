import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { getCMSContent } from '@/lib/dataStore';
import { 
  Target, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Leaf, 
  Award, 
  ShieldCheck, 
  Building2, 
  Users, 
  Scale, 
  ArrowRight,
  MapPin,
  Check
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quiénes Somos | Excedentes de RAEES Suárez S.A.S. Medellín',
  description: 'Conoce nuestra historia, misión, visión, valores y compromiso con la gestión integral de residuos electrónicos (RAEE) y economía circular en Colombia.',
};

export const revalidate = 0;

export default function QuienesSomosPage() {
  const content = getCMSContent();
  const nosotros = content.nosotros;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* Hero Header Section with Cover Image Background */}
      <section className="relative pt-36 pb-24 border-b border-slate-200 overflow-hidden">
        {/* Cover Image Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/portada-1.png" 
            alt="Quiénes Somos - Excedentes de RAEES Suárez"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* 50% White Overlay for Optimal Text Readability */}
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-white z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-brand-200 text-brand-800 text-xs uppercase tracking-widest font-extrabold mb-4 shadow-md backdrop-blur-md">
            <Leaf className="w-4 h-4 text-brand-600" />
            <span>{nosotros.tag || 'Liderazgo & Sostenibilidad Ambiental'}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto drop-shadow-sm">
            {nosotros.title || 'Quiénes Somos'}
          </h1>

          <p className="text-slate-700 text-lg sm:text-xl mt-6 max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-2xs">
            {nosotros.description || 'Pioneros en el tratamiento técnico, desincorporación de activos informáticos y economía circular para empresas en Medellín, Antioquia y toda Colombia.'}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/solicitar-recoleccion"
              className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Solicitar Gestión de Residuos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/servicios"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-md transition-all"
            >
              Ver Portafolio de Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Misión */}
            <div className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg shadow-slate-100 hover:border-brand-400 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-white mb-6 shadow-md shadow-brand-500/20 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Nuestra Misión</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 font-bold">Propósito Central</span>
              </div>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed italic border-l-4 border-brand-500 pl-4 bg-white/60 py-3 rounded-r-xl">
                &ldquo;{nosotros.mision}&rdquo;
              </p>
              <p className="text-slate-600 text-sm mt-4 leading-relaxed">
                Nos enfocamos en brindar tranquilidad técnica, tributaria y ambiental a cada uno de nuestros clientes mediante procesos estandarizados y trazabilidad de punta a punta.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg shadow-slate-100 hover:border-emerald-400 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mb-6 shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Nuestra Visión</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Hacia el Futuro</span>
              </div>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed italic border-l-4 border-emerald-500 pl-4 bg-white/60 py-3 rounded-r-xl">
                &ldquo;{nosotros.vision}&rdquo;
              </p>
              <p className="text-slate-600 text-sm mt-4 leading-relaxed">
                Consolidarnos como el referente tecnológico e industrial en valorización de excedentes electrónicos y minerales secundarios en América Latina.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Valores Corporativos */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-brand-400 text-xs uppercase tracking-widest font-extrabold mb-3">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Pilares de Cultura</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Nuestros Valores Corporativos
            </h2>
            <p className="text-slate-400 text-base mt-3">
              Los principios inquebrantables que guían cada lote procesado, cada recolección y cada certificación emitida.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {nosotros.valores.map((val, idx) => (
              <div 
                key={idx} 
                className="bg-slate-800/90 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-brand-400 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-700 text-brand-400 flex items-center justify-center mb-4 group-hover:bg-brand-500 group-hover:text-slate-950 transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-500 block mb-1">0{idx + 1}</span>
                  <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                    {val}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia, Compromiso & Normativa Legal */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-200">
                <Building2 className="w-4 h-4" />
                <span>Trayectoria y Compromiso en Antioquia</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Liderando la Economía Circular y el Manejo Responsable de RAEE en Medellín
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                {nosotros.historia}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-1">
                    <Check className="w-3 h-3 text-brand-700 font-bold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Cumplimiento Estricto de la Ley 1672 de 2013</h4>
                    <p className="text-xs text-slate-500">Garantizamos la correcta disposición final y aprovechamiento de RAEE según lineamientos de MinAmbiente.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-1">
                    <Check className="w-3 h-3 text-brand-700 font-bold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Certificados Oficiales con Código QR Verificable</h4>
                    <p className="text-xs text-slate-500">Descarga inmediata y validación pública en tiempo real de certificados de disposición y balance de masas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-1">
                    <Check className="w-3 h-3 text-brand-700 font-bold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Destrucción Segura de Información y Discos Duros</h4>
                    <p className="text-xs text-slate-500">Protocolos de desmagnetización y trituración física con acta de confidencialidad para activos de TI.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/solicitar-recoleccion"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-all"
                >
                  <span>Agendar Recolección Empresarial</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Card: Alianzas & Reconocimientos */}
            <div className="lg:col-span-5">
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Garantía Corporativa</h3>
                    <p className="text-xs text-slate-500">Medellín, Valle de Aburrá & Nacional</p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-200 pt-4">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-brand-600" />
                      <span className="text-xs font-bold text-slate-800">Trazabilidad 100% Legal</span>
                    </div>
                    <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">Garantizada</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Scale className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-800">Balanza Certificada</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Calibrada</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-teal-600" />
                      <span className="text-xs font-bold text-slate-800">Personal Especializado</span>
                    </div>
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">SST / EPP</span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-xs text-slate-500 mb-4">
                    Sede principal en Medellín con cobertura para Antioquia y transporte seguro para empresas.
                  </p>
                  <Link
                    href="/#contacto"
                    className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 block transition-all"
                  >
                    Contactar al Equipo
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer contacto={content.contacto} />
      <FloatingWhatsApp phone={content.contacto.whatsapp} />
    </main>
  );
}
