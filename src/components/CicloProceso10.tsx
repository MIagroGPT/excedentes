'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  PhoneCall, 
  FileSpreadsheet, 
  Truck, 
  Layers, 
  Warehouse, 
  Wrench, 
  FileText, 
  Award, 
  Recycle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Cpu
} from 'lucide-react';
import { CMSContent } from '@/lib/types';

interface CicloProceso10Props {
  procesos: CMSContent['procesos'];
}

export default function CicloProceso10({ procesos }: CicloProceso10Props) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const currentPaso = procesos.find(p => p.paso === activeStep) || procesos[0];

  const getStepIcon = (paso: number, className: string = "w-5 h-5") => {
    switch (paso) {
      case 1: return <PhoneCall className={className} />;
      case 2: return <FileSpreadsheet className={className} />;
      case 3: return <Truck className={className} />;
      case 4: return <Layers className={className} />;
      case 5: return <Warehouse className={className} />;
      case 6: return <Wrench className={className} />;
      case 7: return <FileText className={className} />;
      case 8: return <Award className={className} />;
      case 9: return <Recycle className={className} />;
      case 10: return <ShieldAlert className={className} />;
      default: return <Cpu className={className} />;
    }
  };

  return (
    <section id="proceso" className="relative py-24 bg-slate-100 text-slate-900 border-y border-slate-200 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-200 text-brand-800 text-xs uppercase tracking-widest font-extrabold mb-4 shadow-sm">
            <Recycle className="w-4 h-4 text-brand-600" />
            <span>Sistema Integral de Gestión y Trazabilidad</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Proceso de Desincorporación & Reciclaje de Residuos
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-normal">
            Conoce las 10 etapas metódicas que garantizan el 100% de trazabilidad legal, ambiental y técnica para tus residuos electrónicos (RAEE).
          </p>
        </div>

        {/* 10 Steps Interactive Stepper Bar (Fluid, Flicker-free buttons) */}
        <div className="mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
            {procesos.map((item) => {
              const isSelected = item.paso === activeStep;

              return (
                <button
                  key={item.paso}
                  type="button"
                  onClick={() => setActiveStep(item.paso)}
                  className={`relative p-3 rounded-2xl flex flex-col items-center justify-between text-center min-h-[118px] cursor-pointer border-2 transition-all duration-200 ease-out select-none ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/40 -translate-y-1'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700 hover:-translate-y-0.5 shadow-md'
                  }`}
                >
                  {/* Step Number Tag */}
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-full mb-1 transition-colors duration-200 ${
                    isSelected 
                      ? 'bg-white text-slate-950 shadow-xs' 
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {String(item.paso).padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center my-1 transition-colors duration-200 ${
                    isSelected 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-800 text-brand-400'
                  }`}>
                    {getStepIcon(item.paso, `w-4 h-4 ${isSelected ? 'text-white' : 'text-brand-400'}`)}
                  </div>

                  {/* Step Short Label */}
                  <span className={`text-[11px] font-bold leading-tight line-clamp-2 transition-colors duration-200 ${
                    isSelected ? 'text-white' : 'text-slate-200'
                  }`}>
                    {item.titulo}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Detailed Showcase Card (Clean White Card on Gray Section) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl relative overflow-hidden text-slate-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Step Info */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-black px-3.5 py-1 rounded-lg bg-emerald-600 text-white shadow-sm">
                  ETAPA {String(currentPaso.paso).padStart(2, '0')} DE 10
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  <span>Tiempo estimado: {currentPaso.tiempoEstimado}</span>
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {currentPaso.titulo}
                </h3>
                <p className="text-sm sm:text-base font-bold text-brand-700 mt-1">
                  {currentPaso.subtitulo}
                </p>
              </div>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
                {currentPaso.descripcion}
              </p>

              {/* Specific highlights */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Acciones Clave en esta Fase:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentPaso.detalles.map((det, dIdx) => (
                    <div key={dIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-700">{det}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={activeStep === 1}
                  onClick={() => setActiveStep(prev => Math.max(prev - 1, 1))}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 text-xs font-bold transition-all border border-slate-300 active:scale-95"
                >
                  ← Etapa Anterior
                </button>
                <button
                  type="button"
                  disabled={activeStep === 10}
                  onClick={() => setActiveStep(prev => Math.min(prev + 1, 10))}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  Siguiente Etapa →
                </button>
              </div>

            </div>

            {/* Right Col: Graphic & Callout Card */}
            <div className="lg:col-span-5 relative">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6">
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-brand-500/30">
                  {getStepIcon(currentPaso.paso, "w-8 h-8 text-slate-950")}
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">Garantía de Cumplimiento Legal</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Cada una de nuestras etapas se ajusta a los estándares del Ministerio de Ambiente y Desarrollo Sostenible de Colombia (MinAmbiente) y autoridades metropolitanas (Área Metropolitana del Valle de Aburrá / CORANTIOQUIA).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Progreso de Trazabilidad</span>
                    <span className="font-bold text-brand-400">{activeStep * 10}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500 rounded-full"
                      style={{ width: `${activeStep * 10}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/solicitar-recoleccion"
                    className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>Iniciar Proceso para Mi Empresa</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
