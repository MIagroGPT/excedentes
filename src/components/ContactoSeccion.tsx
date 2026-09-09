'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2
} from 'lucide-react';
import { CMSContent } from '@/lib/types';

interface ContactoSeccionProps {
  contacto: CMSContent['contacto'];
}

export default function ContactoSeccion({ contacto }: ContactoSeccionProps) {
  const [formData, setFormData] = useState({
    empresa: '',
    nit: '',
    contacto: '',
    email: '',
    telefono: '',
    tipoConsulta: 'Recolección de RAEE',
    pesoEstimado: '100 a 300 Kg',
    mensaje: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresa: formData.empresa,
          nit: formData.nit,
          contacto: formData.contacto,
          email: formData.email,
          telefono: formData.telefono,
          direccion: 'Medellín y alrededores',
          ciudad: 'Medellín',
          tipoResiduos: [formData.tipoConsulta],
          pesoAproximado: formData.pesoEstimado,
          mensaje: formData.mensaje
        })
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          empresa: '',
          nit: '',
          contacto: '',
          email: '',
          telefono: '',
          tipoConsulta: 'Recolección de RAEE',
          pesoEstimado: '100 a 300 Kg',
          mensaje: ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="relative py-24 bg-slate-50 border-t border-slate-200 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-700 font-extrabold px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-200">
            Canales de Atención
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-4 tracking-tight">
            Contáctanos & Programa tu Recolección
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-normal">
            Estamos ubicados en Medellín, listos para asesorar a tu organización en desincorporación de activos y reciclaje RAEE certificado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 space-y-6 shadow-sm text-slate-900">
              <h3 className="text-xl font-bold text-slate-900">Información Corporativa</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Sede Principal & Planta:</p>
                    <p className="text-sm font-bold text-slate-900">{contacto.direccion}</p>
                    <p className="text-xs text-brand-700 font-bold">{contacto.ciudad}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Líneas de Atención:</p>
                    <p className="text-sm font-bold text-slate-900">{contacto.telefono}</p>
                    <a 
                      href={`https://wa.me/${contacto.whatsapp}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs text-brand-700 font-bold hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>Chatear por WhatsApp Directo</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Correo Electrónico:</p>
                    <p className="text-sm font-bold text-slate-900">{contacto.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Horario de Operación:</p>
                    <p className="text-xs font-bold text-slate-800">{contacto.horario}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map Embed (Medellín) */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl aspect-video relative">
              <iframe
                title="Mapa de Ubicación Excedentes RAEES Suárez Medellín"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126916.64326588267!2d-75.64273891789218!3d6.244203273187214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428dfb80fad05%3A0x42137cfcc7b53b56!2sMedell%C3%ADn%2C%20Antioquia!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
                className="w-full h-full border-0"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-200 text-[10px] font-bold text-brand-700 shadow-sm">
                Cobertura en todo el Valle de Aburrá
              </div>
            </div>

          </div>

          {/* Right Column: Contact & Quote Form (Clean White Card) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl relative text-slate-900">
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Formulario de Solicitud & Cotización</h3>
                <p className="text-xs text-slate-500 mt-1">Diligencia los datos y un ingeniero ambiental te contactará en menos de 2 horas.</p>
              </div>

              {success ? (
                <div className="p-8 rounded-2xl bg-brand-50 border border-brand-300 text-center space-y-4 animate-in fade-in">
                  <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">¡Solicitud Registrada con Éxito!</h4>
                  <p className="text-sm text-slate-600">Hemos recibido tus datos. Tu número de ticket ha sido creado en nuestro sistema SaaS.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md"
                  >
                    Enviar otra solicitud
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Nombre de la Empresa o Razón Social *</label>
                      <input
                        type="text"
                        required
                        value={formData.empresa}
                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                        placeholder="Ej. Inversiones Andinas S.A.S."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">NIT o Cédula *</label>
                      <input
                        type="text"
                        required
                        value={formData.nit}
                        onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                        placeholder="Ej. 900.123.456-7"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Persona de Contacto *</label>
                      <input
                        type="text"
                        required
                        value={formData.contacto}
                        onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                        placeholder="Nombre y Apellido"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Teléfono / Celular *</label>
                      <input
                        type="tel"
                        required
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        placeholder="+57 300 000 0000"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Correo Electrónico Corporativo *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contacto@empresa.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Tipo de Consulta o Residuo *</label>
                      <select
                        value={formData.tipoConsulta}
                        onChange={(e) => setFormData({ ...formData, tipoConsulta: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500 focus:bg-white"
                      >
                        <option value="Recolección de RAEE">Recolección de Residuos RAEE</option>
                        <option value="Equipos de Cómputo & Servidores">Equipos de Cómputo & Servidores</option>
                        <option value="Baterías y UPS">Baterías y UPS</option>
                        <option value="Consultoría y Certificación Ambiental">Consultoría y Certificación Ambiental</option>
                        <option value="Destrucción de Información">Destrucción de Información / Discos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Peso Aproximado *</label>
                      <select
                        value={formData.pesoEstimado}
                        onChange={(e) => setFormData({ ...formData, pesoEstimado: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500 focus:bg-white"
                      >
                        <option value="Menos de 100 Kg">Menos de 100 Kg</option>
                        <option value="100 a 300 Kg">100 a 300 Kg</option>
                        <option value="300 a 1,000 Kg">300 a 1,000 Kg</option>
                        <option value="Más de 1 Tonelada">Más de 1 Tonelada</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Detalles del Inventario o Mensaje</label>
                    <textarea
                      rows={3}
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      placeholder="Indica marcas, cantidades aproximadas o requerimientos especiales..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-brand-500 focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm shadow-xl shadow-brand-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Procesando solicitud...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Enviar Solicitud de Recolección</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
