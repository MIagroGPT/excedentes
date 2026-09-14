'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { 
  Truck, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

export default function SolicitarRecoleccionPage() {
  const [formData, setFormData] = useState({
    empresa: '',
    nit: '',
    contacto: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: 'Medellín',
    tipoResiduos: [] as string[],
    pesoAproximado: '100 - 300 Kg',
    requiereDestruccionDiscos: true,
    mensaje: ''
  });

  const [loading, setLoading] = useState(false);
  const [ticketCreated, setTicketCreated] = useState<any | null>(null);

  const wasteTypes = [
    { id: 'Computadores', label: 'Computadores & Servidores', desc: 'Torres, laptops, racks, fuentes y placas madre' },
    { id: 'Monitores', label: 'Monitores & Pantallas', desc: 'LCD, LED, CRT y proyectores' },
    { id: 'Baterias', label: 'Baterías & UPS', desc: 'Sistemas de energía ininterrumpida y celdas' },
    { id: 'Telecomunicaciones', label: 'Telecomunicaciones & Redes', desc: 'Switches, routers, fibra y telefonía' },
    { id: 'Impresoras', label: 'Impresoras & Periféricos', desc: 'Equipos multifuncionales, teclados y cables' },
    { id: 'Electrodomesticos', label: 'Electrodomésticos & Varios', desc: 'Aires acondicionados, microondas y motores' },
  ];

  const toggleWaste = (label: string) => {
    setFormData(prev => {
      const exists = prev.tipoResiduos.includes(label);
      return {
        ...prev,
        tipoResiduos: exists ? prev.tipoResiduos.filter(i => i !== label) : [...prev.tipoResiduos, label]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.tipoResiduos.length === 0) {
      alert("Por favor selecciona al menos una categoría de residuos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setTicketCreated(data.solicitud);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-200 text-brand-800 text-xs font-bold uppercase tracking-widest mb-4">
            <Truck className="w-4 h-4 text-brand-600" />
            <span>Servicio Corporativo Especializado</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Solicitud de Recolección & Desincorporación RAEE
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Diligencia el manifiesto preliminar para programar el retiro de tus equipos en Medellín y emitir tu Certificado de Disposición Final.
          </p>
        </div>

        {ticketCreated ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6 max-w-2xl mx-auto animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">Ticket Generado</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{ticketCreated.id}</h2>
              <p className="text-sm text-slate-600 mt-2">
                Hemos registrado tu solicitud para <strong className="text-slate-900">{ticketCreated.empresa}</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 text-slate-700">
              <p><strong className="text-slate-900">Contacto:</strong> {ticketCreated.contacto} ({ticketCreated.telefono})</p>
              <p><strong className="text-slate-900">Email:</strong> {ticketCreated.email}</p>
              <p><strong className="text-slate-900">Residuos:</strong> {ticketCreated.tipoResiduos.join(', ')}</p>
              <p><strong className="text-slate-900">Peso Estimado:</strong> {ticketCreated.pesoAproximado}</p>
              <p><strong className="text-slate-900">Estado:</strong> <span className="px-2 py-0.5 rounded bg-brand-100 text-brand-800 font-bold">{ticketCreated.estado}</span></p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Un coordinador logístico se comunicará vía WhatsApp o llamada para confirmar la fecha y hora de arribo del camión institucional.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300"
              >
                Volver al Inicio
              </Link>
              <a
                href={`https://wa.me/573145181158?text=Hola,%20acabo%20de%20crear%20el%20ticket%20${ticketCreated.id}%20para%20${encodeURIComponent(ticketCreated.empresa)}.`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-md"
              >
                Acelerar por WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: Waste selection */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
              <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-black">1</span>
                <span>Selecciona la Tipología de Residuos</span>
              </h2>
              <p className="text-xs text-slate-500 mb-6">Elige todas las categorías que deseas entregar a Excedentes de Raees Suárez:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {wasteTypes.map((item) => {
                  const isChecked = formData.tipoResiduos.includes(item.label);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleWaste(item.label)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isChecked
                          ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-bold text-slate-900">{item.label}</span>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isChecked ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Company details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
              <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-black">2</span>
                <span>Datos de la Empresa & Ubicación</span>
              </h2>
              <p className="text-xs text-slate-500 mb-6">Información para la generación del manifiesto de carga y certificado:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Razón Social o Nombre de la Organización *</label>
                  <input
                    type="text"
                    required
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    placeholder="Ej. Soluciones Logísticas S.A.S."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIT con Dígito de Verificación *</label>
                  <input
                    type="text"
                    required
                    value={formData.nit}
                    onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                    placeholder="Ej. 900.554.890-1"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Persona de Contacto *</label>
                  <input
                    type="text"
                    required
                    value={formData.contacto}
                    onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                    placeholder="Nombre del responsable"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ambiental@empresa.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono Móvil / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+57 300 000 0000"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dirección del Punto de Retiro *</label>
                  <input
                    type="text"
                    required
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Ej. Carrera 50 # 30 - 20, Bodega 4"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Municipio / Ciudad *</label>
                  <input
                    type="text"
                    required
                    value={formData.ciudad}
                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                    placeholder="Medellín / Envigado / Itagüí..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Volume & Special requests */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
              <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-black">3</span>
                <span>Estimación de Carga & Requerimientos</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rango de Peso Estimado *</label>
                  <select
                    value={formData.pesoAproximado}
                    onChange={(e) => setFormData({ ...formData, pesoAproximado: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500"
                  >
                    <option value="Menos de 100 Kg">Menos de 100 Kg (Lote Pequeño)</option>
                    <option value="100 - 300 Kg">100 - 300 Kg (Lote Mediano)</option>
                    <option value="300 - 1,000 Kg">300 - 1,000 Kg (Media Tonelada / Grande)</option>
                    <option value="1 a 5 Toneladas">1 a 5 Toneladas (Desincorporación Masiva)</option>
                    <option value="Más de 5 Toneladas">Más de 5 Toneladas (Proyecto Industrial)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.requiereDestruccionDiscos}
                      onChange={(e) => setFormData({ ...formData, requiereDestruccionDiscos: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-xs text-slate-700 font-semibold">
                      Requiere <strong>Acta de Destrucción Segura de Discos Duros & Datos</strong>
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Observaciones o Instrucciones de Acceso</label>
                <textarea
                  rows={3}
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  placeholder="Horarios permitidos para cargue, muelle disponible, permisos de ARL requeridos, etc."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-sm shadow-xl shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <span>Registrando solicitud...</span>
                ) : (
                  <>
                    <span>Confirmar Solicitud de Recolección</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
