'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Inbox, 
  Phone, 
  Mail, 
  Building, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Layers, 
  RotateCcw,
  Search,
  Sparkles,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  CheckCheck
} from 'lucide-react';
import { SolicitudRecoleccion, EstadoSolicitud } from '@/lib/types';

export default function AdminSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudRecoleccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchSolicitudes = async () => {
    try {
      const res = await fetch('/api/solicitudes');
      const data = await res.json();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  // Helper to normalize legacy status
  const getNormalizedStatus = (estado?: string): 'pendiente' | 'confirmado' | 'anulado' | 'procesado' => {
    if (!estado) return 'pendiente';
    const s = estado.toLowerCase();
    if (s === 'confirmado') return 'confirmado';
    if (s === 'anulado' || s === 'cancelado') return 'anulado';
    if (s === 'procesado' || s === 'convertida a lote') return 'procesado';
    return 'pendiente';
  };

  // Change request status (Anular, Confirmar, etc.)
  const handleCambiarEstado = async (id: string, nuevoEstado: EstadoSolicitud) => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/solicitudes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado: nuevoEstado })
      });

      if (res.ok) {
        setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s));
      } else {
        alert('Error al actualizar el estado de la solicitud');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión al actualizar');
    } finally {
      setProcessingId(null);
    }
  };

  // Convert to Active CRM Batch (Lote Activo)
  const handleConvertirALote = async (sol: SolicitudRecoleccion) => {
    const status = getNormalizedStatus(sol.estado);

    if (status === 'anulado') {
      alert('Esta solicitud está anulada. Para convertirla en lote, primero reactívala o confírmala.');
      return;
    }

    const confirmMsg = status === 'confirmado'
      ? `¿Deseas convertir la solicitud confirmada ${sol.id} de "${sol.empresa}" en un Lote Activo en el CRM?`
      : `La solicitud ${sol.id} está en estado Pendiente. ¿Deseas confirmarla y convertirla automáticamente en Lote Activo?`;

    if (!confirm(confirmMsg)) {
      return;
    }

    setProcessingId(sol.id);
    try {
      // 1. Create active batch in /api/lotes
      const resLote = await fetch('/api/lotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razonSocial: sol.empresa,
          nit: sol.nit,
          contactoNombre: sol.contacto,
          email: sol.email,
          telefono: sol.telefono,
          direccion: sol.direccion,
          ciudad: sol.ciudad,
          categoria: sol.tipoResiduos[0] || 'Equipos de Cómputo',
          pesoEstimadoKg: 250,
          observaciones: `Convertido desde solicitud web ${sol.id}. Residuos: ${sol.tipoResiduos.join(', ')}. Mensaje cliente: ${sol.mensaje || 'N/A'}`
        })
      });

      if (!resLote.ok) {
        throw new Error('No se pudo crear el lote');
      }

      const loteData = await resLote.json();
      const loteId = loteData.lote?.id || 'LOTE-ACTIVO';

      // 2. Update Solicitud status to 'procesado' with associated lote ID
      const resSol = await fetch('/api/solicitudes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: sol.id, 
          estado: 'procesado',
          loteIdAsociado: loteId
        })
      });

      if (resSol.ok) {
        setSolicitudes(prev => prev.map(s => s.id === sol.id ? { 
          ...s, 
          estado: 'procesado',
          loteIdAsociado: loteId
        } : s));
        alert(`¡Éxito! Solicitud convertida en Lote Activo ${loteId}. Puedes gestionarlo en el módulo de Lotes & Ciclo 10 Etapas.`);
      }
    } catch (e) {
      console.error(e);
      alert('Error al convertir solicitud en lote activo');
    } finally {
      setProcessingId(null);
    }
  };

  // Filtered requests
  const filteredSolicitudes = solicitudes.filter(sol => {
    const status = getNormalizedStatus(sol.estado);
    const matchesFilter = filterStatus === 'todos' || status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      sol.empresa.toLowerCase().includes(q) ||
      sol.nit.toLowerCase().includes(q) ||
      sol.contacto.toLowerCase().includes(q) ||
      sol.id.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  // Counts
  const counts = {
    todos: solicitudes.length,
    pendiente: solicitudes.filter(s => getNormalizedStatus(s.estado) === 'pendiente').length,
    confirmado: solicitudes.filter(s => getNormalizedStatus(s.estado) === 'confirmado').length,
    procesado: solicitudes.filter(s => getNormalizedStatus(s.estado) === 'procesado').length,
    anulado: solicitudes.filter(s => getNormalizedStatus(s.estado) === 'anulado').length,
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <Inbox className="w-7 h-7 text-brand-600" />
              <span>Bandeja de Solicitudes de Recolección</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Control de estado, confirmación y conversión de cotizaciones en Lotes Activos del CRM.
            </p>
          </div>

          <Link
            href="/admin/lotes"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Layers className="w-4 h-4 text-brand-400" />
            <span>Ver Lotes en Ciclo 10 Etapas →</span>
          </Link>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setFilterStatus('todos')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterStatus === 'todos'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Todos</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filterStatus === 'todos' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'}`}>{counts.todos}</span>
            </button>

            <button
              onClick={() => setFilterStatus('pendiente')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterStatus === 'pendiente'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pendientes</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filterStatus === 'pendiente' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800'}`}>{counts.pendiente}</span>
            </button>

            <button
              onClick={() => setFilterStatus('confirmado')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterStatus === 'confirmado'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmados</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filterStatus === 'confirmado' ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-800'}`}>{counts.confirmado}</span>
            </button>

            <button
              onClick={() => setFilterStatus('procesado')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterStatus === 'procesado'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Procesados (Lote)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filterStatus === 'procesado' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800'}`}>{counts.procesado}</span>
            </button>

            <button
              onClick={() => setFilterStatus('anulado')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterStatus === 'anulado'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Anulados</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filterStatus === 'anulado' ? 'bg-rose-700 text-white' : 'bg-rose-50 text-rose-800'}`}>{counts.anulado}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por empresa, NIT, contacto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 shadow-sm"
            />
          </div>

        </div>

        {/* Requests Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 shadow-sm">
              Cargando solicitudes...
            </div>
          ) : filteredSolicitudes.length === 0 ? (
            <div className="col-span-2 p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-bold text-sm text-slate-700">No se encontraron solicitudes con los filtros aplicados</p>
              <p className="text-xs text-slate-400">Prueba cambiando el filtro de estado o el término de búsqueda.</p>
            </div>
          ) : (
            filteredSolicitudes.map((sol) => {
              const status = getNormalizedStatus(sol.estado);
              const isProcessing = processingId === sol.id;

              return (
                <div 
                  key={sol.id} 
                  className={`p-6 sm:p-7 rounded-3xl bg-white border transition-all duration-300 shadow-sm flex flex-col justify-between relative overflow-hidden ${
                    status === 'anulado'
                      ? 'border-rose-200 opacity-75 hover:opacity-100 bg-rose-50/20'
                      : status === 'confirmado'
                      ? 'border-blue-200 hover:border-blue-400 shadow-blue-500/5'
                      : status === 'procesado'
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Decorative top accent indicator */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                    status === 'anulado' ? 'bg-rose-500' :
                    status === 'confirmado' ? 'bg-blue-500' :
                    status === 'procesado' ? 'bg-emerald-500' :
                    'bg-amber-400'
                  }`} />

                  {/* Top: Header with ID, Date, and Status Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          {sol.id}
                        </span>
                        {sol.loteIdAsociado && (
                          <Link
                            href="/admin/lotes"
                            className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1 transition-colors"
                            title="Ver este Lote Activo en CRM"
                          >
                            <Layers className="w-3 h-3" />
                            <span>{sol.loteIdAsociado}</span>
                          </Link>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center">
                        {status === 'pendiente' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 shadow-xs">
                            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                            <span>Pendiente</span>
                          </span>
                        )}
                        {status === 'confirmado' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-300 shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Confirmado</span>
                          </span>
                        )}
                        {status === 'procesado' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Procesado (Lote)</span>
                          </span>
                        )}
                        {status === 'anulado' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300 shadow-xs">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Anulado</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{sol.empresa}</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mb-4">NIT: {sol.nit}</p>

                    {/* Client details card */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700 mb-4 shadow-2xs">
                      <p className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span><strong>Contacto:</strong> {sol.contacto}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span><strong>Teléfono:</strong> {sol.telefono}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span className="truncate"><strong>Email:</strong> {sol.email}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span><strong>Ubicación:</strong> {sol.direccion}, {sol.ciudad}</span>
                      </p>
                    </div>

                    {/* Cargo details */}
                    <div className="space-y-1.5 text-xs text-slate-700 mb-4">
                      <div className="flex flex-wrap gap-1 items-center">
                        <strong className="text-slate-500">Residuos:</strong>
                        {sol.tipoResiduos.map((tr, idx) => (
                          <span key={idx} className="bg-brand-50 text-brand-800 text-[11px] font-bold px-2 py-0.5 rounded-md border border-brand-200">
                            {tr}
                          </span>
                        ))}
                      </div>
                      <p><strong className="text-slate-500">Peso Estimado:</strong> <span className="font-semibold">{sol.pesoAproximado}</span></p>
                      {sol.mensaje && (
                        <div className="p-2.5 rounded-xl bg-slate-100/80 border border-slate-200 mt-2">
                          <p className="text-slate-600 italic text-[11px] leading-relaxed">
                            &ldquo;{sol.mensaje}&rdquo;
                          </p>
                        </div>
                      )}
                      <p className="text-[10px] text-slate-400 pt-1">
                        Registrada: {sol.fechaCreacion}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Contact & 3 Action Status Buttons */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    
                    {/* Quick WhatsApp Contact */}
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={`https://wa.me/${sol.telefono.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(sol.contacto)},%20te%20contactamos%20de%20Excedentes%20de%20Raees%20Su%C3%A1rez%20respecto%20a%20tu%20solicitud%20${sol.id}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Contactar por WhatsApp</span>
                      </a>
                    </div>

                    {/* 3 Status Control Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      
                      {/* 1. BOTÓN ANULAR / ANULADO */}
                      {status === 'anulado' ? (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleCambiarEstado(sol.id, 'pendiente')}
                          className="py-2.5 px-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold border border-slate-300 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                          title="Reactivar solicitud a estado Pendiente"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                          <span>Reactivar</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => {
                            if (confirm(`¿Estás seguro de anular la solicitud ${sol.id}?`)) {
                              handleCambiarEstado(sol.id, 'anulado');
                            }
                          }}
                          className="py-2.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs group"
                          title="Anular esta solicitud"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
                          <span>Anular</span>
                        </button>
                      )}

                      {/* 2. BOTÓN CONFIRMAR / CONFIRMADO */}
                      <button
                        type="button"
                        disabled={isProcessing || status === 'confirmado' || status === 'procesado'}
                        onClick={() => handleCambiarEstado(sol.id, 'confirmado')}
                        className={`py-2.5 px-2 rounded-xl text-[11px] font-bold border flex flex-col items-center justify-center gap-1 transition-all shadow-2xs ${
                          status === 'confirmado'
                            ? 'bg-blue-600 text-white border-blue-600 cursor-default shadow-xs ring-2 ring-blue-400/40'
                            : status === 'procesado'
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : status === 'anulado'
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 cursor-pointer group'
                        }`}
                        title={status === 'confirmado' ? 'Solicitud ya confirmada' : 'Confirmar contacto y viabilidad de recolección'}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${status === 'confirmado' ? 'text-white' : 'text-blue-600 group-hover:scale-110'} transition-transform`} />
                        <span>{status === 'confirmado' ? 'Confirmado ✓' : 'Confirmar'}</span>
                      </button>

                      {/* 3. BOTÓN CONVERTIR EN LOTE ACTIVO */}
                      {status === 'procesado' ? (
                        <Link
                          href="/admin/lotes"
                          className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold border border-emerald-500 flex flex-col items-center justify-center gap-1 transition-all shadow-xs cursor-pointer text-center ring-2 ring-emerald-400/40"
                          title="Ver en Lotes Activos"
                        >
                          <CheckCheck className="w-3.5 h-3.5 text-white" />
                          <span>Ver en Lote →</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          disabled={isProcessing || status === 'anulado'}
                          onClick={() => handleConvertirALote(sol)}
                          className={`py-2.5 px-2 rounded-xl text-[11px] font-bold border flex flex-col items-center justify-center gap-1 transition-all shadow-xs ${
                            status === 'confirmado'
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 cursor-pointer hover:scale-102 shadow-emerald-500/20'
                              : status === 'anulado'
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                              : 'bg-slate-900 hover:bg-brand-600 text-white border-slate-800 cursor-pointer'
                          }`}
                          title="Crear Lote Activo en CRM"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>{status === 'confirmado' ? 'Crear Lote Activo' : 'Convertir a Lote'}</span>
                        </button>
                      )}

                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>

      </main>
    </div>
  );
}
