'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Layers, 
  Inbox, 
  Award, 
  FileEdit, 
  Globe, 
  Recycle,
  LogOut,
  ChevronRight,
  Users,
  ShieldCheck
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin', label: 'Dashboard General', icon: LayoutDashboard },
    { href: '/admin/lotes', label: 'Lotes & Ciclo 10 Etapas', icon: Layers },
    { href: '/admin/solicitudes', label: 'Bandeja de Solicitudes', icon: Inbox },
    { href: '/admin/certificados', label: 'Certificados Oficiales', icon: Award },
    { href: '/admin/cms', label: 'Editor de Contenido CMS', icon: FileEdit },
    { href: '/admin/usuarios', label: 'Usuarios & Permisos', icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen p-4">
      <div className="space-y-6">
        
        {/* Brand Header con Logo Oficial */}
        <div className="px-2 py-3 border-b border-slate-800 space-y-2">
          <div className="bg-white/95 px-3 py-1.5 rounded-xl shadow-md border border-white/20 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="Excedentes de RAEES Suárez S.A.S." 
              className="h-8 w-auto object-contain"
            />
          </div>
          <p className="text-[10px] text-center text-brand-400 font-semibold uppercase tracking-wider">
            Plataforma SaaS & CMS
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Session Info & Link */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">Sesión Activa</p>
              <span className="text-[10px] text-indigo-300 font-extrabold">SUPER ADMIN</span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
        >
          <Globe className="w-4 h-4 text-brand-400" />
          <span>Ver Sitio Web Público</span>
        </Link>
      </div>
    </aside>
  );
}
