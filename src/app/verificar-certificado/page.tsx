'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ShieldCheck, 
  Search, 
  FileDown, 
  QrCode, 
  Building, 
  Calendar, 
  Scale, 
  AlertCircle, 
  Leaf
} from 'lucide-react';
import { generateCertificadoPDF } from '@/lib/pdfGenerator';
import { LoteResiduo } from '@/lib/types';

function VerificarCertificadoContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('codigo') || '';

  const [searchCode, setSearchCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const handleSearch = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch(`/api/certificados?codigo=${encodeURIComponent(codeToSearch.trim())}`);
      const data = await res.json();
      if (res.ok && data.found) {
        setResult(data.lote);
      } else {
        setErrorMsg(data.message || 'No se encontró ningún certificado con el código suministrado.');
      }
    } catch (err) {
      setErrorMsg('Error al conectar con el servidor de validación.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const mockLote: LoteResiduo = {
        id: result.id,
        codigoSeguimiento: result.codigoSeguimiento,
        cliente: {
          razonSocial: result.cliente.razonSocial,
          nit: result.cliente.nit,
          contactoNombre: 'Representante Autorizado',
          email: 'contacto@cliente.com',
          telefono: '+57 300 000 0000',
          direccion: 'Sede Principal',
          ciudad: result.cliente.ciudad || 'Medellín'
        },
        fechaSolicitud: result.fechaSolicitud,
        fechaRecoleccion: result.fechaSolicitud,
        fechaFinalizacion: result.fechaFinalizacion || result.certificado?.fechaEmision,
        etapaActual: 8,
        estado: 'Completado',
        detallesCarga: {
          categoria: result.detallesCarga.categoria,
          pesoEstimadoKg: result.detallesCarga.pesoTotalKg,
          pesoRealKg: result.detallesCarga.pesoTotalKg,
          desglosePesaje: result.detallesCarga.desglosePesaje,
          observaciones: 'Certificado oficial verificado en plataforma digital.'
        },
        bitacora: [],
        certificado: result.certificado
      };

      const doc = await generateCertificadoPDF(mockLote);
      doc.save(`Certificado_Ambiental_${result.codigoSeguimiento}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Error al generar el archivo PDF');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-200 text-brand-800 text-xs font-bold uppercase tracking-widest mb-4">
            <QrCode className="w-4 h-4 text-brand-600" />
            <span>Portal Oficial de Autenticidad</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Validación de Certificados Ambientales RAEE
          </h1>
          <p className="text-slate-600 text-sm mt-3">
            Verifica en tiempo real la autenticidad, cadena de custodia y disposición final de cualquier certificado emitido por <strong>EXCEDENTES RAEES SUAREZ</strong>.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 mb-8 shadow-xl">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(searchCode); }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Ingresa el Código de Seguimiento (ej: RAEE-MED-84920)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono placeholder:font-sans focus:outline-none focus:border-brand-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? <span>Consultando...</span> : <span>Verificar Ahora</span>}
            </button>
          </form>

          {/* Helper examples */}
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
            <span>Códigos de prueba activos:</span>
            <button 
              onClick={() => { setSearchCode('RAEE-MED-84920'); handleSearch('RAEE-MED-84920'); }}
              className="font-mono text-brand-700 font-bold hover:underline"
            >
              RAEE-MED-84920
            </button>
            <span>•</span>
            <button 
              onClick={() => { setSearchCode('RAEE-ENV-93012'); handleSearch('RAEE-ENV-93012'); }}
              className="font-mono text-emerald-700 font-bold hover:underline"
            >
              RAEE-ENV-93012
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center space-y-2 mb-8 animate-in fade-in">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Registro No Encontrado</h3>
            <p className="text-xs text-red-700">{errorMsg}</p>
          </div>
        )}

        {/* Verified Result Card (Clean White & Slate details) */}
        {result && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-brand-500 shadow-2xl space-y-8 animate-in zoom-in-95 text-slate-900">
            
            {/* Top Status Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      CERTIFICADO VÁLIDO & AUTÉNTICO
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    {result.certificado?.numeroCertificado || `Lote ${result.codigoSeguimiento}`}
                  </h2>
                </div>
              </div>

              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <FileDown className="w-4 h-4" />
                <span>{downloading ? 'Generando PDF...' : 'Descargar PDF Oficial'}</span>
              </button>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-brand-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4" />
                  <span>Datos del Generador (Cliente)</span>
                </h3>
                <div className="text-xs space-y-1.5 text-slate-700">
                  <p><strong className="text-slate-900">Empresa:</strong> {result.cliente.razonSocial}</p>
                  <p><strong className="text-slate-900">NIT:</strong> {result.cliente.nit}</p>
                  <p><strong className="text-slate-900">Ciudad:</strong> {result.cliente.ciudad}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Trazabilidad y Fechas</span>
                </h3>
                <div className="text-xs space-y-1.5 text-slate-700">
                  <p><strong className="text-slate-900">Código de Lote:</strong> <span className="font-mono font-bold text-brand-700">{result.codigoSeguimiento}</span></p>
                  <p><strong className="text-slate-900">Fecha de Emisión:</strong> {result.certificado?.fechaEmision || result.fechaSolicitud}</p>
                  <p><strong className="text-slate-900">Estado de Custodia:</strong> <span className="text-emerald-700 font-bold">{result.estado} (Etapa {result.etapaActual}/10)</span></p>
                </div>
              </div>

            </div>

            {/* Weight and Mass Balance */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-brand-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  <span>Balance de Masas y Disposición Final</span>
                </h3>
                <span className="text-sm font-black text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                  Total: {result.detallesCarga.pesoTotalKg} Kg
                </span>
              </div>

              {result.detallesCarga.desglosePesaje && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-sm">
                    <p className="text-[10px] text-slate-500 font-semibold">Metales Ferrosos</p>
                    <p className="text-sm font-bold text-slate-900">{result.detallesCarga.desglosePesaje.metalesFerrososKg} Kg</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-sm">
                    <p className="text-[10px] text-slate-500 font-semibold">Plásticos Técnicos</p>
                    <p className="text-sm font-bold text-slate-900">{result.detallesCarga.desglosePesaje.plasticosKg} Kg</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-sm">
                    <p className="text-[10px] text-slate-500 font-semibold">Tarjetas PCB / Chips</p>
                    <p className="text-sm font-bold text-slate-900">{result.detallesCarga.desglosePesaje.tarjetasElectronicasKg} Kg</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-sm">
                    <p className="text-[10px] text-slate-500 font-semibold">Cables & Cobre</p>
                    <p className="text-sm font-bold text-slate-900">{result.detallesCarga.desglosePesaje.cablesKg} Kg</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-sm">
                    <p className="text-[10px] text-slate-500 font-semibold">Baterías / Litio</p>
                    <p className="text-sm font-bold text-slate-900">{result.detallesCarga.desglosePesaje.bateriasKg} Kg</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-sm">
                    <p className="text-[10px] text-slate-500 font-semibold">Peligrosos (Respels)</p>
                    <p className="text-sm font-bold text-slate-900">{result.detallesCarga.desglosePesaje.residuosPeligrososKg} Kg</p>
                  </div>
                </div>
              )}

              {result.certificado?.impactoCO2EvitadoKg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-emerald-900 font-semibold">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>Impacto Ambiental Positivo Certificado:</span>
                  </div>
                  <span className="text-xs font-black text-emerald-700">
                    {result.certificado.impactoCO2EvitadoKg} Kg de CO2eq Evitados
                  </span>
                </div>
              )}
            </div>

            {/* Cryptographic Security Hash */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold">Firma Criptográfica del Documento:</p>
                <p className="font-mono text-xs text-brand-300 break-all">{result.certificado?.hashSeguridad || '8f4c2b9a7d1e0f3b5c6a8d2e9f1a4c7b'}</p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold shrink-0">
                Verificado MinAmbiente
              </span>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function VerificarCertificadoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">Cargando validador...</div>}>
      <VerificarCertificadoContent />
    </Suspense>
  );
}
