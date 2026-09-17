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
  X,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trash2
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

    if (emitirCert && editEtapa < 10) {
      alert('Solo se puede emitir el Certificado Oficial si el lote concluyó la Etapa 10 (10 Residuos Peligrosos).');
      return;
    }

    const totalReal = Object.values(editPesos).reduce((a, b) => a + Number(b || 0), 0);

    try {
      const res = await fetch('/api/lotes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLote.id,
          etapaActual: emitirCert ? 10 : editEtapa,
          notaBitacora: editNota || (emitirCert ? 'Certificado ambiental oficial con QR emitido tras concluir las 10 etapas.' : `Avanzó a ${ETAPAS_TITULOS[editEtapa]}`),
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
        alert(emitirCert ? '¡Certificado Oficial con QR Emitido Exitosamente!' : 'Lote actualizado correctamente.');
      }
    } catch (e) {
      console.error(e);
      alert('Error al actualizar el lote.');
    }
  };

  const handleDirectEmit = async (lote: LoteResiduo) => {
    if (lote.etapaActual < 10) {
      alert('Solo se puede emitir el Certificado Oficial si las 10 etapas del ciclo RAEE fueron concluidas.');
      return;
    }

    if (!confirm(`¿Confirmas la emisión del Certificado Oficial con QR para ${lote.cliente.razonSocial}?`)) {
      return;
    }

    try {
      const res = await fetch('/api/lotes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: lote.id,
          etapaActual: 10,
          emitirCertificado: true,
          notaBitacora: 'Certificado ambiental oficial con QR emitido tras concluir las 10 etapas del ciclo RAEE.'
        })
      });

      if (res.ok) {
        fetchLotes();
        alert('¡Certificado Oficial con QR Emitido Exitosamente!');
      } else {
        alert('Error al emitir el certificado.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión al emitir el certificado.');
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

  const handleDeleteLote = async (lote: LoteResiduo) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente el lote ${lote.codigoSeguimiento} de "${lote.cliente.razonSocial}"?\n\nEsta acción borrará el registro, sus pesajes y su bitácora técnica de forma definitiva.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/lotes?id=${encodeURIComponent(lote.id)}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setLotes(prev => prev.filter(l => l.id !== lote.id));
        if (selectedLote?.id === lote.id) {
          setSelectedLote(null);
        }
        alert('Lote eliminado correctamente.');
      } else {
        const err = await res.json();
        alert(err.error || 'Error al eliminar el lote.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión al eliminar el lote.');
    }
  };

  const renderEtapasProgress = (etapaActual: number, isCompletado: boolean = false) => {
    const isFinalizado = etapaActual >= 10 && isCompletado;

    return (
      <div className="space-y-1.5 py-0.5">
        {/* Fila de 10 bolitas indicadoras */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => {
            let dotClass = '';
            let title = `Etapa ${step}: ${ETAPAS_TITULOS[step]}`;

            if (step < etapaActual) {
              // 1. Etapa concluida -> VERDE ESTÁTICO
              dotClass = 'w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs';
              title += ' (Completada)';
            } else if (step === etapaActual) {
              if (isFinalizado) {
                // 2. Etapa 10 finalizada con éxito -> VERDE ESTÁTICO
                dotClass = 'w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-xs ring-2 ring-emerald-300';
                title += ' (Concluida 10/10)';
              } else {
                // 3. Etapa actual en curso -> VERDE INTERMITENTE (Pulsante)
                dotClass = 'w-3 h-3 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-300 ring-offset-1';
                title += ' (Etapa Actual en Proceso)';
              }
            } else {
              // 4. Etapas futuras pendientes -> GRIS INACTIVO
              dotClass = 'w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300';
              title += ' (Inactiva / Pendiente)';
            }

            return (
              <div
                key={step}
                title={title}
                className={`${dotClass} transition-all duration-300 cursor-help`}
              />
            );
          })}
        </div>

        {/* Etiqueta textual descriptiva */}
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            etapaActual >= 10
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}>
            <span className="font-mono">{String(etapaActual).padStart(2, '0')}/10:</span>
            <span className="truncate max-w-[145px]">{ETAPAS_TITULOS[etapaActual]?.replace(/^\d+\s*/, '')}</span>
          </span>
        </div>
      </div>
    );
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
              Control técnico de trazabilidad, bolitas de avance de 1 a 10 y emisión oficial condicionada al 100% del ciclo.
            </p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
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
                <th className="p-4 min-w-[210px]">Progreso Etapas (1 a 10)</th>
                <th className="p-4 min-w-[170px]">Certificado Oficial</th>
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
                    {renderEtapasProgress(lote.etapaActual, Boolean(lote.certificado || lote.estado === 'Completado'))}
                  </td>
                  <td className="p-4">
                    {lote.etapaActual < 10 ? (
                      // MENOS DE 10 ETAPAS: Bloqueado
                      <div 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-400"
                        title={`Se requieren las 10 etapas concluidas. Falta avanzar ${10 - lote.etapaActual} etapa(s).`}
                      >
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>Requiere 10/10</span>
                      </div>
                    ) : (
                      // 10 ETAPAS CONCLUIDAS: Por Emitir o Emitido
                      lote.certificado ? (
                        // ESTADO 2: EMITIDO
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Emitido</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDownloadPDF(lote)}
                            title="Descargar Certificado Oficial en PDF"
                            className="p-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors shadow-2xs cursor-pointer"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        // ESTADO 1: POR EMITIR (Botón activado)
                        <button
                          type="button"
                          onClick={() => handleDirectEmit(lote)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer animate-pulse"
                          title="¡Las 10 etapas han sido concluidas! Haz clic para emitir el certificado oficial ahora."
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Por Emitir (Emitir)</span>
                        </button>
                      )
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenLote(lote)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                      >
                        Ver & Gestionar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLote(lote)}
                        title="Eliminar este lote de registro"
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 transition-all cursor-pointer shadow-2xs group"
                      >
                        <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
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

              {/* Etapa Selector con 10 bolitas interactivas */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    Avanzar o Modificar Etapa del Ciclo RAEE:
                  </label>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    editEtapa >= 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {editEtapa >= 10 ? '¡Ciclo Completo (10/10)!' : `Etapa ${editEtapa} de 10`}
                  </span>
                </div>

                {/* 10 Bolitas en el Modal */}
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => {
                      const isPrev = step < editEtapa;
                      const isCurrent = step === editEtapa;
                      const isFinal = step === 10 && (selectedLote.certificado || editEtapa >= 10);

                      let dotStyle = 'bg-slate-200 text-slate-500 border border-slate-300';
                      if (isPrev) {
                        dotStyle = 'bg-emerald-500 text-white shadow-xs';
                      } else if (isCurrent) {
                        dotStyle = isFinal
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                          : 'bg-emerald-500 text-white animate-pulse ring-2 ring-emerald-300 ring-offset-1';
                      }

                      return (
                        <button
                          key={step}
                          type="button"
                          onClick={() => setEditEtapa(step)}
                          title={`Fijar Etapa ${step}: ${ETAPAS_TITULOS[step]}`}
                          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all cursor-pointer ${
                            isCurrent ? 'bg-emerald-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${dotStyle}`}>
                            {step}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <select
                  value={editEtapa}
                  onChange={(e) => setEditEtapa(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-brand-500"
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateLote(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    Guardar Cambios de Etapa & Pesos
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteLote(selectedLote)}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer group"
                    title="Eliminar permanentemente este lote"
                  >
                    <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>Eliminar Lote</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {selectedLote.certificado ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Certificado Emitido</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDownloadPDF(selectedLote)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                      >
                        <FileDown className="w-4 h-4" />
                        <span>Descargar PDF</span>
                      </button>
                    </div>
                  ) : editEtapa < 10 ? (
                    <div
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-xs font-semibold cursor-not-allowed"
                      title="Requiere concluir las 10 etapas para habilitar la emisión oficial."
                    >
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>Emisión bloqueada (Faltan {10 - editEtapa} etapas para habilitar)</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUpdateLote(true)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 animate-pulse cursor-pointer transition-all hover:scale-105"
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
