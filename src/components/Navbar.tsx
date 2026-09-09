'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Recycle, ShieldCheck, Menu, X, ArrowRight, Phone } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 py-3 shadow-sm' 
        : 'bg-white/70 backdrop-blur-md py-4 border-b border-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo Oficial */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center transition-all group-hover:scale-105">
            <img 
              src="/logo.png" 
              alt="Excedentes de RAEES Suárez S.A.S." 
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
          <Link href="/" className="hover:text-brand-600 transition-colors">Inicio</Link>
          <Link href="/quienes-somos" className="hover:text-brand-600 transition-colors">Quiénes Somos</Link>
          <Link href="/servicios" className="hover:text-brand-600 transition-colors">Servicios</Link>
          <Link href="/#proceso" className="hover:text-brand-600 transition-colors flex items-center gap-1.5 text-brand-700 font-bold bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
            </span>
            Ciclo 10 Pasos
          </Link>
          <Link href="/#metricas" className="hover:text-brand-600 transition-colors">Impacto</Link>
          <Link href="/#blog" className="hover:text-brand-600 transition-colors">Blog</Link>
          <Link href="/#contacto" className="hover:text-brand-600 transition-colors">Contacto</Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link 
            href="/verificar-certificado" 
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all"
            title="Validar autenticidad de certificado ambiental con QR o Código"
          >
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Validar QR</span>
          </Link>

          <Link 
            href="/solicitar-recoleccion" 
            className="relative group overflow-hidden flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Solicitar Recolección</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-2xl border-b border-slate-200 px-4 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-base font-semibold text-slate-800">
            <Link onClick={() => setMobileMenuOpen(false)} href="/" className="hover:text-brand-600">Inicio</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/quienes-somos" className="hover:text-brand-600">Quiénes Somos</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/servicios" className="hover:text-brand-600">Servicios</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/#proceso" className="text-brand-700 font-bold">Ciclo de 10 Pasos RAEE</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/#metricas" className="hover:text-brand-600">Impacto Ambiental</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/#blog" className="hover:text-brand-600">Blog y Noticias</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/#contacto" className="hover:text-brand-600">Contacto</Link>
          </nav>
          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2.5">
            <Link 
              onClick={() => setMobileMenuOpen(false)}
              href="/solicitar-recoleccion" 
              className="w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-md"
            >
              Solicitar Recolección
            </Link>
            <Link 
              onClick={() => setMobileMenuOpen(false)}
              href="/verificar-certificado" 
              className="w-full text-center py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300"
            >
              Validar Certificado con QR
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
