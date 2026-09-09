'use client';

import React, { useState } from 'react';
import { Leaf, Award, MapPin, Building2, Calculator } from 'lucide-react';
import { CMSContent } from '@/lib/types';

interface MetricasImpactoProps {
  metricas: CMSContent['metricas'];
}

export default function MetricasImpacto({ metricas }: MetricasImpactoProps) {
  const [calculatorKg, setCalculatorKg] = useState<number>(250);

  const co2Avoided = Math.round(calculatorKg * 2.1);
  const treesEquivalent = Math.round(co2Avoided / 22);
  const waterSavedLiters = Math.round(calculatorKg * 14.5);

  return (
    <section id="metricas" className="relative py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-700 font-extrabold px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200">
            Impacto Ambiental & Logros
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-4 tracking-tight">
            Resultados Tangibles en Sostenibilidad
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-normal">
            Nuestra labor diaria previene la contaminación de ecosistemas estratégicos y devuelve recursos valiosos a la economía circular.
          </p>
        </div>

        {/* 4 Key Counters (Clean White Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 mx-auto mb-4">
              <Leaf className="w-7 h-7" />
            </div>
            <div className="text-4xl sm:text-5xl font-black text-slate-900 mb-2">
              +{metricas.toneladas} <span className="text-brand-600 text-2xl font-bold">Ton</span>
            </div>
            <p className="text-sm font-bold text-slate-800">Residuos RAEE Reciclados</p>
            <p className="text-xs text-slate-500 mt-1">Computadores, servidores y baterías</p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 mx-auto mb-4">
              <Award className="w-7 h-7" />
            </div>
            <div className="text-4xl sm:text-5xl font-black text-slate-900 mb-2">
              {metricas.reduccionImpacto}%
            </div>
            <p className="text-sm font-bold text-slate-800">Reducción de Impacto</p>
            <p className="text-xs text-slate-500 mt-1">Cero vertedero de metales nobles</p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 mx-auto mb-4">
              <MapPin className="w-7 h-7" />
            </div>
            <div className="text-4xl sm:text-5xl font-black text-slate-900 mb-2">
              +{metricas.ciudades}
            </div>
            <p className="text-sm font-bold text-slate-800">Ciudades en Colombia</p>
            <p className="text-xs text-slate-500 mt-1">Cobertura logística y alianzas</p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-700 mx-auto mb-4">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="text-4xl sm:text-5xl font-black text-slate-900 mb-2">
              +{metricas.empresasAtendidas}
            </div>
            <p className="text-sm font-bold text-slate-800">Empresas Certificadas</p>
            <p className="text-xs text-slate-500 mt-1">En el sector público y privado</p>
          </div>

        </div>

        {/* Interactive Eco Calculator (High Contrast Card) */}
        <div className="rounded-3xl p-8 sm:p-10 bg-slate-900 text-white border border-slate-800 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            <div className="max-w-md space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-400 uppercase">
                <Calculator className="w-4 h-4" />
                <span>Calculadora de Impacto Ambiental</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Calcula el Beneficio Ecológico de Reciclar tus Equipos
              </h3>
              <p className="text-sm text-slate-300">
                Selecciona la cantidad estimada de kilogramos de residuos electrónicos que tu empresa planea desincorporar:
              </p>

              <div>
                <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
                  <span>Peso Estimado:</span>
                  <span className="text-brand-400 text-sm font-extrabold">{calculatorKg} Kg</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={calculatorKg}
                  onChange={(e) => setCalculatorKg(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>50 Kg</span>
                  <span>1,500 Kg</span>
                  <span>3,000 Kg</span>
                </div>
              </div>
            </div>

            {/* Calculated Results */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
              
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <p className="text-xs text-slate-400 font-semibold mb-1">CO2 Evitado</p>
                <div className="text-3xl font-black text-brand-400">{co2Avoided}</div>
                <p className="text-[11px] text-slate-300 font-medium">Kg de CO2 eq</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <p className="text-xs text-slate-400 font-semibold mb-1">Equivalente Arbóreo</p>
                <div className="text-3xl font-black text-emerald-400">{treesEquivalent}</div>
                <p className="text-[11px] text-slate-300 font-medium">Árboles / Año</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <p className="text-xs text-slate-400 font-semibold mb-1">Agua Protegida</p>
                <div className="text-3xl font-black text-teal-400">{waterSavedLiters}</div>
                <p className="text-[11px] text-slate-300 font-medium">Litros de Agua</p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
