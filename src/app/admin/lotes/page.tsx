'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Layers, 
  Plus, 
  Search, 
  Award, 
  Scale, 
  Clock, 
  FileDown, 
  X
} from 'lucide-react';
import { LoteResiduo } from '@/lib/types';
import { generateCertificadoPDF } from '@/lib/pdfGenerator';

const ETAPAS_TITULOS: Record<number, string> = {
  1: '01 Contacto Inicial',
  2: '02 Solicitud de Recolección',
  3: '03 Recolección y Logística',
  4: '04 Clasificación en Planta',
  5: '05 Almacenamiento Temporal',
  6: '06 Desmontaje y Separación',
  7: '07 Informe de Desarme',
  8: '08 Certificado de Gestión RAEE',
  9: '09 Reciclaje y Aprovechamiento',
  10: '10 Residuos Peligrosos'
};

export default function AdminLotesPage() {
  const [lotes, setLotes] = useState<LoteResiduo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLote, setSelectedLote] = useState<LoteResiduo | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const [newBatch, setNewBatch] = useState({
    razonSocial: '',
    nit: '',
    contactoNombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: 'Medellín',
    categoria: 'Equipos de Cómputo',
    pesoEstimadoKg: 200,
    observaciones: ''
  });

  const [editEtapa, setEditEtapa] = useState<number>(1);
  const [editNota, setEditNota] = useState('');
  const [editPesos, setEditPesos] = useState({
    plasticosKg: 0,
    metalesFerrososKg: 0,
    tarjetasElectronicasKg: 0,
    cablesKg: 0,
    bateriasKg: 0,
    residuosPeligrososKg: 0
  });

  const fetchLotes = async () => {
    try {
      const res = await fetch('/api/lotes');
      const data = await res.json();
      setLotes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLotes();
  }, []);

  const handleOpenLote = (lote: LoteResiduo) => {
    setSelectedLote(lote);
    setEditEtapa(lote.etapaActual);
    setEditNota('');
    if (lote.detallesCarga.desglosePesaje) {
      setEditPesos(lote.detallesCarga.desglosePesaje);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/lotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBatch)
      });
      if (res.ok) {
        setShowNewModal(false);
        fetchLotes();
        setNewBatch({
          razonSocial: '',
          nit: '',
          contactoNombre: '',
          email: '',
          telefono: '',
          direccion: '',
          ciudad: 'Medellín',
          categoria: 'Equipos de Cómputo',
          pesoEstimadoKg: 200,
          observaciones: ''
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateLote = async (emitirCert = false) => {
    if (!selectedLote) return;

    const totalReal = Object.values(editPesos).reduce((a, b) => a + Number(b || 0), 0);

    try {
      const res = await fetch('/api/lotes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLote.id,
          etapaActual: emitirCert ? 8 : editEtapa,
          notaBitacora: editNota || (emitirCert ? 'Certificado ambiental oficial emitido.' : `Avanzó a ${ETAPAS_TITULOS[editEtapa]}`),
          detallesCarga: {
            pesoRealKg: totalReal > 0 ? totalReal : (selectedLote.detallesCarga.pesoRealKg || selectedLote.detallesCarga.pesoEstimadoKg),
            desglosePesaje: editPesos
          },
          emitirCertificado: emitirCert
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedLote(data.lote);
        fetchLotes();
        alert(emitirCert ? '¡Certificado Oficial Emitido Exitosamente!' : 'Lote actualizado correctamente.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadPDF = async (lote: LoteResiduo) => {
    try {
      const doc = await generateCertificadoPDF(lote);
      doc.save(`Certificado_Oficial_${lote.codigoSeguimiento}.pdf`);
    } catch (e) {
      alert('Error generando PDF');
    }
  };

  const filteredLotes = lotes.filter(l => 
    l.cliente.razonSocial.toLowerCase().includes(search.toLowerCase()) ||
    l.codigoSeguimiento.toLowerCase().includes(search.toLowerCase()) ||
    l.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-7 h-7 text-brand-600" />
              <span>Gestor de Lotes RAEE & Ciclo de 10 Etapas</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Control técnico, pesaje, bitácora y emisión de certificados ambientales con código QR.
            </p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Lote</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por empresa, código de seguimiento o ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500 shadow-sm"
            />
          </div>
        </div>

        {/* Lotes Table (Clean Light Table) */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Código Lote</th>
                <th className="p-4">Cliente / Generador</th>
                <th className="p-4">Categoría RAEE</th>
                <th className="p-4">Peso (Kg)</th>
                <th className="p-4">Etapa Actual (1 a 10)</th>
                <th className="p-4">Certificado</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLotes.map((lote) => (
                <tr key={lote.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-brand-700">{lote.codigoSeguimiento}</td>
                  <td className="p-4 font-bold text-slate-900">{lote.cliente.razonSocial}</td>
                  <td className="p-4">{lote.detallesCarga.categoria}</td>
                  <td className="p-4 font-bold">{lote.detallesCarga.pesoRealKg || lote.detallesCarga.pesoEstimadoKg} Kg</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200 text-[11px] font-bold">
                      <Clock className="w-3 h-3 text-brand-600" />
                      {ETAPAS_TITULOS[lote.etapaActual] || `Etapa ${lote.etapaActual}`}
                    </span>
                  </td>
                  <td className="p-4">
                    {lote.certificado ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <Award className="w-3.5 h-3.5" />
                        <span>Emitido</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Pendiente</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenLote(lote)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      Ver & Gestionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Lote Modal */}
        {selectedLote && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-mono text-brand-700 font-bold">{selectedLote.codigoSeguimiento}</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">{selectedLote.cliente.razonSocial}</h2>
                </div>
                <button 
                  onClick={() => setSelectedLote(null)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Etapa Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Avanzar o Modificar Etapa del Ciclo RAEE:
                </label>
                <select
                  value={editEtapa}
                  onChange={(e) => setEditEtapa(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-brand-500"
                >
                  {Object.entries(ETAPAS_TITULOS).map(([num, name]) => (
                    <option key={num} value={num}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Pesajes de Planta */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-brand-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-4 h-4" />
                    <span>Desglose de Pesaje en Planta (Kg)</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-800 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                    Total: {Object.values(editPesos).reduce((a, b) => a + Number(b || 0), 0)} Kg
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Metales Ferrosos (Kg)</label>
                    <input
                      type="number"
                      value={editPesos.metalesFerrososKg}
                      onChange={(e) => setEditPesos({ ...editPesos, metalesFerrososKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Plásticos Técnicos (Kg)</label>
                    <input
                      type="number"
                      value={editPesos.plasticosKg}
                      onChange={(e) => setEditPesos({ ...editPesos, plasticosKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tarjetas PCB / Chips (Kg)</label>
                    <input
                      type="number"
                      value={editPesos.tarjetasElectronicasKg}
                      onChange={(e) => setEditPesos({ ...editPesos, tarjetasElectronicasKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cables y Cobre (Kg)</label>
                    <input
                      type="number"
                      value={editPesos.cablesKg}
                      onChange={(e) => setEditPesos({ ...editPesos, cablesKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Baterías / Litio (Kg)</label>
                    <input
                      type="number"
                      value={editPesos.bateriasKg}
                      onChange={(e) => setEditPesos({ ...editPesos, bateriasKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Peligrosos Respels (Kg)</label>
                    <input
                      type="number"
                      value={editPesos.residuosPeligrososKg}
                      onChange={(e) => setEditPesos({ ...editPesos, residuosPeligrososKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Bitácora Note */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nota para la Bitácora de Trazabilidad:
                </label>
                <input
                  type="text"
                  value={editNota}
                  onChange={(e) => setEditNota(e.target.value)}
                  placeholder="Ej. Finalizó desmontaje técnico y pesaje oficial..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                />
              </div>

              {/* Bitácora History */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Historial de Bitácora:</h4>
                <div className="max-h-36 overflow-y-auto space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  {selectedLote.bitacora.map((b, i) => (
                    <div key={i} className="flex items-center justify-between text-slate-700 py-1 border-b border-slate-200 last:border-0">
                      <span><strong>Etapa {b.etapa}:</strong> {b.nota}</span>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">{b.fecha} ({b.usuario})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handleUpdateLote(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  Guardar Cambios de Etapa & Pesos
                </button>

                <div className="flex items-center gap-2">
                  {selectedLote.certificado ? (
                    <button
                      type="button"
                      onClick={() => handleDownloadPDF(selectedLote)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>Descargar Certificado PDF</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUpdateLote(true)}
                      className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Award className="w-4 h-4" />
                      <span>Emitir Certificado Oficial con QR</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Create Batch Modal */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 text-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Crear Nuevo Lote RAEE</h2>
                <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Razón Social *</label>
                  <input
                    type="text"
                    required
                    value={newBatch.razonSocial}
                    onChange={(e) => setNewBatch({ ...newBatch, razonSocial: e.target.value })}
                    placeholder="Empresa cliente..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">NIT *</label>
                    <input
                      type="text"
                      required
                      value={newBatch.nit}
                      onChange={(e) => setNewBatch({ ...newBatch, nit: e.target.value })}
                      placeholder="900.000.000-0"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Contacto *</label>
                    <input
                      type="text"
                      required
                      value={newBatch.contactoNombre}
                      onChange={(e) => setNewBatch({ ...newBatch, contactoNombre: e.target.value })}
                      placeholder="Nombre del responsable"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Categoría RAEE</label>
                    <select
                      value={newBatch.categoria}
                      onChange={(e) => setNewBatch({ ...newBatch, categoria: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900"
                    >
                      <option value="Equipos de Cómputo">Equipos de Cómputo</option>
                      <option value="Baterías">Baterías</option>
                      <option value="Electrodomésticos">Electrodomésticos</option>
                      <option value="Telecomunicaciones">Telecomunicaciones</option>
                      <option value="Mixto">Mixto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Peso Estimado (Kg)</label>
                    <input
                      type="number"
                      value={newBatch.pesoEstimadoKg}
                      onChange={(e) => setNewBatch({ ...newBatch, pesoEstimadoKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-brand-600 text-white font-bold shadow-md"
                  >
                    Crear Lote
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
