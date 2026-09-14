'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Recycle, ShieldCheck, Phone, Mail, MapPin, ArrowUp, Heart, MessageCircle } from 'lucide-react';
import { CMSContent } from '@/lib/types';

interface FooterProps {
  contacto?: CMSContent['contacto'];
}

const DEFAULT_CONTACTO: CMSContent['contacto'] = {
  telefono: '+57 314 518 1158',
  whatsapp: '+573145181158',
  email: 'excedentessuarez5413@hotmail.com',
  direccion: 'Calle 57 n 54-131 Paz con Cúcuta',
  ciudad: 'Medellín, Colombia',
  horario: 'Lunes a Viernes: 8:00 AM - 5:30 PM | Sábados: 8:00 AM - 1:00 PM'
};

export default function Footer({ contacto }: FooterProps = {}) {
  const [contactData, setContactData] = useState<CMSContent['contacto']>(contacto || DEFAULT_CONTACTO);

  useEffect(() => {
    if (contacto) {
      setContactData(contacto);
    } else {
      fetch('/api/cms')
        .then(res => res.json())
        .then(data => {
          if (data?.contacto) {
            setContactData(data.contacto);
          }
        })
        .catch(err => console.error('Error cargando contacto en Footer:', err));
    }
  }, [contacto]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanPhone = (contactData.telefono || '').replace(/[^0-9+]/g, '');
  const cleanWhatsapp = (contactData.whatsapp || '').replace(/[^0-9]/g, '');

  return (
    <footer className="bg-dark-bg border-t border-slate-800/80 text-slate-400 text-xs relative overflow-hidden">
      
      {/* Decorative top green glow line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <div className="bg-white/95 hover:bg-white px-3 py-1.5 rounded-2xl shadow-md inline-flex items-center justify-center transition-all group-hover:scale-105">
                <img 
                  src="/images/logo 2.png" 
                  alt="Excedentes de RAEES Suárez S.A.S." 
                  className="h-14 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              Líderes en sostenibilidad, desincorporación de activos informáticos y economía circular en Medellín y Colombia. Cumplimiento estricto de la Ley 1672 de 2013.
            </p>

            <div className="pt-2 flex items-center gap-3 text-slate-400">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-brand-500 hover:text-slate-950 flex items-center justify-center transition-colors">
                Fb
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-brand-500 hover:text-slate-950 flex items-center justify-center transition-colors">
                Ig
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-brand-500 hover:text-slate-950 flex items-center justify-center transition-colors">
                In
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Navegación</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-brand-400 transition-colors">Inicio</Link></li>
              <li><Link href="/quienes-somos" className="hover:text-brand-400 transition-colors">Quiénes Somos</Link></li>
              <li><Link href="/servicios" className="hover:text-brand-400 transition-colors">Servicios RAEE</Link></li>
              <li><Link href="/#proceso" className="hover:text-brand-400 transition-colors text-emerald-400">Ciclo de 10 Etapas</Link></li>
              <li><Link href="/#metricas" className="hover:text-brand-400 transition-colors">Impacto Ambiental</Link></li>
              <li><Link href="/#blog" className="hover:text-brand-400 transition-colors">Blog y Noticias</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal & Certification */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Cumplimiento & Normativa</h4>
            <ul className="space-y-2">
              <li><Link href="/verificar-certificado" className="hover:text-brand-400 transition-colors flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-brand-400" /> Validar Certificado QR</Link></li>
              <li><Link href="/solicitar-recoleccion" className="hover:text-brand-400 transition-colors">Solicitud de Retiro</Link></li>
              <li><a href="/#contacto" className="hover:text-brand-400 transition-colors">Aviso de Privacidad</a></li>
              <li><a href="/#contacto" className="hover:text-brand-400 transition-colors">Términos de Servicio</a></li>
            </ul>
          </div>

          {/* Col 4: Contact quick info */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
              {contactData.ciudad || 'Medellín, Colombia'}
            </h4>
            <div className="space-y-2.5 text-xs">
              <p className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                <span>{contactData.direccion || 'Calle 57 n 54-131 Paz con Cúcuta'}</span>
              </p>
              {contactData.telefono && (
                <a 
                  href={`tel:${cleanPhone}`} 
                  className="flex items-center gap-2 text-slate-300 hover:text-brand-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <span>{contactData.telefono}</span>
                </a>
              )}
              {cleanWhatsapp && (
                <a 
                  href={`https://wa.me/${cleanWhatsapp}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>WhatsApp: {contactData.whatsapp}</span>
                </a>
              )}
              {contactData.email && (
                <a 
                  href={`mailto:${contactData.email}`} 
                  className="flex items-center gap-2 text-slate-300 hover:text-brand-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <span className="break-all">{contactData.email}</span>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} <strong className="text-slate-300">EXCEDENTES RAEES SUAREZ</strong>. Todos los derechos reservados. Medellín, Colombia.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5 text-brand-400" />
          </button>
        </div>

      </div>
    </footer>
  );
}
