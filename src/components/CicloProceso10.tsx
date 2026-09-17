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
  Cpu,
  BatteryCharging,
  Zap,
  Sparkles
} from 'lucide-react';
import { CMSContent } from '@/lib/types';

interface CicloProceso10Props {
  procesos: CMSContent['procesos'];
}

interface RaeeParticle {
  id: number;
  icon: 'cpu' | 'battery' | 'zap' | 'wrench' | 'recycle' | 'sparkles' | 'layers';
  dx: number;
  dy: number;
  dz: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
  color: string;
  size: number;
}

export default function CicloProceso10({ procesos }: CicloProceso10Props) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeBurst, setActiveBurst] = useState<{ step: number; particles: RaeeParticle[] } | null>(null);

  const currentPaso = procesos.find(p => p.paso === activeStep) || procesos[0];

  const getStepIcon = (paso: number, className: string = "w-6 h-6") => {
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

  const renderRaeeParticleIcon = (type: RaeeParticle['icon'], size: number) => {
    const style = { width: size, height: size };
    switch (type) {
      case 'cpu': return <Cpu style={style} strokeWidth={2.2} />;
      case 'battery': return <BatteryCharging style={style} strokeWidth={2.2} />;
      case 'zap': return <Zap style={style} strokeWidth={2.2} />;
      case 'wrench': return <Wrench style={style} strokeWidth={2.2} />;
      case 'recycle': return <Recycle style={style} strokeWidth={2.2} />;
      case 'layers': return <Layers style={style} strokeWidth={2.2} />;
      case 'sparkles':
      default: return <Sparkles style={style} strokeWidth={2.2} />;
    }
  };

  // Celebration with Confetti & Cyan flashes on Step 10
  const triggerStep10Confetti = async () => {
    if (typeof window === 'undefined') return;
    try {
      const confetti = (await import('canvas-confetti')).default;

      // Palette strictly adhering to instructions: Emerald, mint, slate, white, and CYAN
      const cyanPalette = ['#00E5FF', '#22D3EE', '#06B6D4', '#10B981', '#34D399', '#FFFFFF'];

      // Shot 1: Central radial burst
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.45 },
        colors: cyanPalette,
        ticks: 220,
        gravity: 0.78,
        scalar: 1.15,
        shapes: ['square', 'circle']
      });

      // Shot 2: Dual celebratory side cannons with cyan flashes
      setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 55,
          origin: { x: 0.12, y: 0.5 },
          colors: cyanPalette,
          ticks: 200,
          scalar: 1.1
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 55,
          origin: { x: 0.88, y: 0.5 },
          colors: cyanPalette,
          ticks: 200,
          scalar: 1.1
        });
      }, 200);
    } catch (err) {
      console.error('Confetti trigger error:', err);
    }
  };

  const handleSelectStep = (step: number) => {
    setActiveStep(step);

    const isStep10 = step === 10;
    const icons: RaeeParticle['icon'][] = [
      'cpu', 'battery', 'zap', 'wrench', 'recycle', 'sparkles',
      'layers', 'cpu', 'battery', 'zap', 'recycle', 'sparkles'
    ];
    const colors = isStep10
      ? ['#00E5FF', '#22D3EE', '#06B6D4', '#10B981', '#34D399', '#FFFFFF']
      : ['#10B981', '#34D399', '#059669', '#6EE7B7', '#A7F3D0', '#FFFFFF'];

    const count = 12;
    const newParticles: RaeeParticle[] = Array.from({ length: count }, (_, idx) => {
      const angle = (Math.PI * 2 * idx) / count + (Math.random() - 0.5) * 0.4;
      const dist = 48 + Math.random() * 52;
      return {
        id: Date.now() + idx,
        icon: icons[idx % icons.length],
        dx: Math.round(Math.cos(angle) * dist),
        dy: Math.round(Math.sin(angle) * dist - 18),
        dz: Math.round((Math.random() - 0.5) * 80),
        rotX: Math.round((Math.random() - 0.5) * 360),
        rotY: Math.round((Math.random() - 0.5) * 360),
        rotZ: Math.round((Math.random() - 0.5) * 180),
        scale: 0.85 + Math.random() * 0.4,
        color: colors[idx % colors.length],
        size: 14 + Math.round(Math.random() * 6)
      };
    });

    setActiveBurst({ step, particles: newParticles });
    setTimeout(() => {
      setActiveBurst(prev => (prev?.step === step ? null : prev));
    }, 1000);

    if (isStep10) {
      triggerStep10Confetti();
    }
  };

  return (
    <section id="proceso" className="relative py-24 bg-slate-100 text-slate-900 border-y border-slate-200 overflow-hidden">
      
      {/* CSS Keyframes for Intermittent Glow and 3D RAEE Particle Explosion */}
      <style jsx global>{`
        @keyframes intermittentGlow {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.75));
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            filter: drop-shadow(0 0 16px rgba(16, 185, 129, 1)) drop-shadow(0 0 6px #34D399);
            opacity: 0.88;
          }
        }

        @keyframes intermittentCyanGlow {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 6px rgba(6, 182, 212, 0.85));
            opacity: 1;
          }
          50% {
            transform: scale(1.18);
            filter: drop-shadow(0 0 22px rgba(6, 182, 212, 1)) drop-shadow(0 0 10px #00E5FF);
            opacity: 0.9;
          }
        }

        @keyframes raeeBurstParticle {
          0% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(0.3) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          50% {
            opacity: 0.95;
            transform: translate3d(calc(var(--pdx) * 0.8), calc(var(--pdy) * 0.8), var(--pdz)) scale(var(--pscale)) rotateX(var(--prx)) rotateY(var(--pry)) rotateZ(var(--prz));
          }
          100% {
            opacity: 0;
            transform: translate3d(var(--pdx), var(--pdy), calc(var(--pdz) * 1.4)) scale(calc(var(--pscale) * 0.45)) rotateX(calc(var(--prx) * 1.3)) rotateY(calc(var(--pry) * 1.3)) rotateZ(var(--prz));
          }
        }

        @keyframes beaconPing {
          0% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.15;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.8;
          }
        }
      `}</style>
      
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

        {/* 10 Steps Interactive Stepper Bar (More animated, larger icons, 3D particles & cyan sparks) */}
        <div className="mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3">
            {procesos.map((item) => {
              const isSelected = item.paso === activeStep;
              const isStep10 = item.paso === 10;

              return (
                <button
                  key={item.paso}
                  type="button"
                  onClick={() => handleSelectStep(item.paso)}
                  className={`group relative p-3 sm:p-3.5 rounded-2xl flex flex-col items-center justify-between text-center min-h-[136px] sm:min-h-[142px] cursor-pointer border-2 transition-all duration-300 ease-out select-none ${
                    isSelected
                      ? isStep10
                        ? 'bg-gradient-to-b from-emerald-600 via-teal-700 to-cyan-800 text-white border-cyan-400 shadow-xl shadow-cyan-500/35 ring-4 ring-cyan-400/40 -translate-y-2'
                        : 'bg-gradient-to-b from-emerald-600 to-emerald-700 text-white border-emerald-400 shadow-xl shadow-emerald-600/35 ring-4 ring-emerald-400/35 -translate-y-2'
                      : isStep10
                      ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-cyan-500/60 hover:-translate-y-1 shadow-md hover:shadow-cyan-900/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700 hover:-translate-y-1 shadow-md hover:shadow-xl'
                  }`}
                >
                  {/* Step Number Tag */}
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-colors duration-200 ${
                      isSelected 
                        ? isStep10
                          ? 'bg-cyan-300 text-slate-950 font-black shadow-xs ring-1 ring-cyan-200'
                          : 'bg-white text-slate-950 font-black shadow-xs' 
                        : isStep10
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold'
                        : 'bg-slate-800 text-slate-400 font-bold'
                    }`}>
                      {String(item.paso).padStart(2, '0')}
                    </span>
                    {isStep10 && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-cyan-300 animate-ping' : 'bg-cyan-400'}`} />
                    )}
                  </div>

                  {/* Icon Container with Intermittent Pulsing Glow Effect */}
                  <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center my-1.5 transition-all duration-300 ${
                    isSelected 
                      ? isStep10
                        ? 'bg-cyan-400/25 text-cyan-100 ring-2 ring-cyan-300 shadow-[0_0_18px_rgba(6,182,212,0.85)]'
                        : 'bg-white/20 text-white ring-2 ring-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.7)]' 
                      : isStep10
                      ? 'bg-slate-800 text-cyan-400 group-hover:bg-cyan-950/60 group-hover:scale-105'
                      : 'bg-slate-800 text-brand-400 group-hover:text-brand-300 group-hover:bg-slate-750 group-hover:scale-105'
                  }`}>
                    {/* Intermittent pulsing icon */}
                    <div 
                      className="flex items-center justify-center"
                      style={
                        isSelected 
                          ? { animation: isStep10 ? 'intermittentCyanGlow 1.6s ease-in-out infinite' : 'intermittentGlow 1.6s ease-in-out infinite' } 
                          : undefined
                      }
                    >
                      {getStepIcon(
                        item.paso, 
                        `w-6 h-6 stroke-[2.2] ${
                          isSelected 
                            ? isStep10 ? 'text-cyan-100' : 'text-white' 
                            : isStep10 ? 'text-cyan-400' : 'text-brand-400'
                        }`
                      )}
                    </div>

                    {/* Beacon ring when selected */}
                    {isSelected && (
                      <span 
                        className={`absolute inset-0 rounded-2xl pointer-events-none ${
                          isStep10 ? 'border border-cyan-300/60' : 'border border-emerald-300/50'
                        }`}
                        style={{ animation: 'beaconPing 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}
                      />
                    )}
                  </div>

                  {/* Step Short Label */}
                  <span className={`text-[11px] font-bold leading-tight line-clamp-2 transition-colors duration-200 ${
                    isSelected 
                      ? isStep10 ? 'text-cyan-100 font-extrabold' : 'text-white font-extrabold' 
                      : isStep10 ? 'text-cyan-200/90' : 'text-slate-200'
                  }`}>
                    {item.titulo}
                  </span>

                  {/* 3D RAEE Particle Explosion Container */}
                  {activeBurst?.step === item.paso && (
                    <div 
                      className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-40" 
                      style={{ perspective: '600px', transformStyle: 'preserve-3d' }}
                    >
                      {activeBurst.particles.map((p) => (
                        <div
                          key={p.id}
                          className="absolute pointer-events-none"
                          style={{
                            animation: 'raeeBurstParticle 0.95s cubic-bezier(0.16, 0.84, 0.34, 1.2) forwards',
                            '--pdx': `${p.dx}px`,
                            '--pdy': `${p.dy}px`,
                            '--pdz': `${p.dz}px`,
                            '--prx': `${p.rotX}deg`,
                            '--pry': `${p.rotY}deg`,
                            '--prz': `${p.rotZ}deg`,
                            '--pscale': p.scale,
                            color: p.color
                          } as React.CSSProperties}
                        >
                          <div style={{ filter: `drop-shadow(0 0 8px ${p.color}90)` }}>
                            {renderRaeeParticleIcon(p.icon, p.size)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Detailed Showcase Card */}
        <div className={`bg-white rounded-3xl p-6 sm:p-10 border shadow-xl relative overflow-hidden text-slate-900 transition-all duration-300 ${
          activeStep === 10 ? 'border-cyan-200 shadow-cyan-500/10' : 'border-slate-200 shadow-xl'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Step Info */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className={`text-sm font-black px-3.5 py-1 rounded-lg shadow-sm ${
                  activeStep === 10
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white ring-2 ring-cyan-400/40'
                    : 'bg-emerald-600 text-white'
                }`}>
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
                <p className={`text-sm sm:text-base font-bold mt-1 ${activeStep === 10 ? 'text-teal-700' : 'text-brand-700'}`}>
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
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${activeStep === 10 ? 'text-cyan-600' : 'text-brand-600'}`} />
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
                  onClick={() => handleSelectStep(Math.max(activeStep - 1, 1))}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 text-xs font-bold transition-all border border-slate-300 active:scale-95 cursor-pointer"
                >
                  ← Etapa Anterior
                </button>
                <button
                  type="button"
                  disabled={activeStep === 10}
                  onClick={() => handleSelectStep(Math.min(activeStep + 1, 10))}
                  className={`px-5 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                    activeStep === 9
                      ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 animate-pulse'
                      : 'bg-brand-600 hover:bg-brand-500'
                  }`}
                >
                  Siguiente Etapa →
                </button>
              </div>

            </div>

            {/* Right Col: Graphic & Callout Card */}
            <div className="lg:col-span-5 relative">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6">
                
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg ${
                  activeStep === 10
                    ? 'bg-gradient-to-tr from-brand-600 via-teal-400 to-cyan-300 shadow-cyan-500/40 ring-2 ring-cyan-400'
                    : 'bg-gradient-to-tr from-brand-600 to-emerald-400 shadow-brand-500/30'
                }`}>
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
                    <span className={`font-bold ${activeStep === 10 ? 'text-cyan-400' : 'text-brand-400'}`}>
                      {activeStep * 10}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        activeStep === 10
                          ? 'bg-gradient-to-r from-brand-500 via-emerald-400 to-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                          : 'bg-gradient-to-r from-brand-500 to-emerald-400'
                      }`}
                      style={{ width: `${activeStep * 10}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/solicitar-recoleccion"
                    className={`w-full py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all ${
                      activeStep === 10
                        ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-cyan-500/25'
                        : 'bg-brand-500 hover:bg-brand-400 text-slate-950 shadow-brand-500/20'
                    }`}
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
