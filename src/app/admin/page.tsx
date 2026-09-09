'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Layers, 
  Inbox, 
  Award, 
  Scale, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  PlusCircle
} from 'lucide-react';
import { LoteResiduo, SolicitudRecoleccion } from '@/lib/types';

export default function AdminDashboardPage() {
  const [lotes, setLotes] = useState<LoteResiduo[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudRecoleccion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/lotes').then(r => r.json()),
      fetch('/api/solicitudes').then(r => r.json())
    ]).then(([lotesData, solData]) => {
      setLotes(Array.isArray(lotesData) ? lotesData : []);
      setSolicitudes(Array.isArray(solData) ? solData : []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const totalKg = lotes.reduce((acc, l) => acc + (l.detallesCarga.pesoRealKg || l.detallesCarga.pesoEstimadoKg || 0), 0);
  const lotesEnProceso = lotes.filter(l => l.estado === 'En Proceso').length;
  const certificadosEmitidos = lotes.filter(l => l.certificado).length;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Panel de Control & Trazabilidad</h1>
            <p className="text-xs text-slate-500 mt-1">Gestión integral de residuos electrónicos, ciclo de 10 etapas y contenidos.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/lotes"
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nuevo Lote RAEE</span>
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards (Clean White Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 font-semibold">Total RAEE Gestionado</span>
              <Scale className="w-5 h-5 text-brand-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{totalKg.toLocaleString()} <span className="text-xs text-brand-600 font-bold">Kg</span></div>
            <p className="text-[11px] text-slate-400 mt-1">Registrado en balanza de planta</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 font-semibold">Lotes en Circuito</span>
              <Layers className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{lotesEnProceso}</div>
            <p className="text-[11px] text-slate-400 mt-1">Avanzando en las 10 etapas</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 font-semibold">Solicitudes Pendientes</span>
              <Inbox className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">{solicitudes.length}</div>
            <p className="text-[11px] text-slate-400 mt-1">Clientes por atender</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 font-semibold">Certificados Oficiales</span>
              <Award className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{certificadosEmitidos}</div>
            <p className="text-[11px] text-slate-400 mt-1">Con código QR y firma</p>
          </div>

        </div>

        {/* 2 Column Section: Active Batches & Recent Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Active Batches Table */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-600" />
                <span>Lotes Activos & Estado de Ciclo</span>
              </h2>
              <Link href="/admin/lotes" className="text-xs text-brand-600 font-bold hover:underline">Ver todos →</Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                {lotes.slice(0, 4).map((lote) => (
                  <div key={lote.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brand-700">{lote.codigoSeguimiento}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          lote.estado === 'Completado' ? 'bg-emerald-100 text-emerald-800' : 'bg-brand-100 text-brand-800'
                        }`}>
                          Etapa {lote.etapaActual}/10
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900">{lote.cliente.razonSocial}</p>
                      <p className="text-[11px] text-slate-500">{lote.detallesCarga.categoria} • {lote.detallesCarga.pesoRealKg || lote.detallesCarga.pesoEstimadoKg} Kg</p>
                    </div>

                    <Link
                      href={`/admin/lotes`}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-300"
                    >
                      Gestionar
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Recent Requests */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Inbox className="w-4 h-4 text-amber-500" />
                <span>Solicitudes Web de Recolección</span>
              </h2>
              <Link href="/admin/solicitudes" className="text-xs text-brand-600 font-bold hover:underline">Ver bandeja →</Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
              {solicitudes.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No hay solicitudes pendientes</div>
              ) : (
                solicitudes.slice(0, 3).map((sol) => (
                  <div key={sol.id} className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{sol.empresa}</span>
                      <span className="text-[10px] text-slate-400">{sol.fechaCreacion}</span>
                    </div>
                    <p className="text-xs text-slate-500">{sol.contacto} • {sol.telefono}</p>
                    <p className="text-[11px] text-brand-700 font-semibold">{sol.pesoAproximado} • {sol.tipoResiduos.join(', ')}</p>
                  </div>
                ))
              )}
            </div>

            {/* CMS Shortcut Banner */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2 shadow-xl">
              <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider">Módulo de Contenido CMS</h3>
              <p className="text-xs text-slate-300">Modifica los textos de la página web, misión, visión, servicios y blog en tiempo real.</p>
              <Link
                href="/admin/cms"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 pt-1"
              >
                <span>Abrir Editor de Textos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
