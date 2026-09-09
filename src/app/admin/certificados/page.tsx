'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Award, FileDown, Search, QrCode } from 'lucide-react';
import { LoteResiduo } from '@/lib/types';
import { generateCertificadoPDF } from '@/lib/pdfGenerator';

export default function AdminCertificadosPage() {
  const [lotes, setLotes] = useState<LoteResiduo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/lotes')
      .then(r => r.json())
      .then(data => {
        setLotes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const certificados = lotes.filter(l => l.certificado);

  const handleDownload = async (lote: LoteResiduo) => {
    try {
      const doc = await generateCertificadoPDF(lote);
      doc.save(`Certificado_Ambiental_${lote.codigoSeguimiento}.pdf`);
    } catch (e) {
      alert('Error al generar PDF');
    }
  };

  const filtered = certificados.filter(l =>
    l.cliente.razonSocial.toLowerCase().includes(search.toLowerCase()) ||
    l.certificado?.numeroCertificado.toLowerCase().includes(search.toLowerCase()) ||
    l.codigoSeguimiento.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <Award className="w-7 h-7 text-teal-600" />
              <span>Certificados Ambientales Oficiales & QR</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Registro histórico de certificados emitidos y actas de disposición final.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por cliente, número de certificado o código..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500 shadow-sm"
            />
          </div>
        </div>

        {/* Grid of Certificates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-3 p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm">
              No hay certificados emitidos que coincidan con la búsqueda.
            </div>
          ) : (
            filtered.map((lote) => (
              <div key={lote.id} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200">
                      Oficial MinAmbiente
                    </span>
                    <span className="text-xs text-slate-400">{lote.certificado?.fechaEmision}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{lote.certificado?.numeroCertificado}</h3>
                  <p className="text-xs font-bold text-brand-700 mb-4">{lote.cliente.razonSocial}</p>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-700">
                    <p><strong className="text-slate-500">Código Lote:</strong> <span className="font-mono text-slate-900 font-bold">{lote.codigoSeguimiento}</span></p>
                    <p><strong className="text-slate-500">Peso Total:</strong> {lote.detallesCarga.pesoRealKg || lote.detallesCarga.pesoEstimadoKg} Kg</p>
                    <p><strong className="text-slate-500">CO2 Evitado:</strong> <span className="text-emerald-700 font-bold">{lote.certificado?.impactoCO2EvitadoKg} Kg CO2eq</span></p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={`/verificar-certificado?codigo=${lote.codigoSeguimiento}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Verificar Online</span>
                  </a>

                  <button
                    onClick={() => handleDownload(lote)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Descargar PDF</span>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}
