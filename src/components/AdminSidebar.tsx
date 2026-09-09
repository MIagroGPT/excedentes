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
  LogOut,
  ChevronRight,
  Users,
  ShieldCheck,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout, isSuperAdmin, isSupervisor } = useAuth();

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
          <div className="bg-white/95 px-3 py-2 rounded-2xl shadow-md flex items-center justify-center">
            <img 
              src="/images/logo.png" 
              alt="Excedentes de RAEES Suárez S.A.S." 
              className="h-12 w-auto object-contain"
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

      {/* Bottom Session Info & Logout */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        
        {/* Active User Card */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isSuperAdmin 
                  ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-400' 
                  : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
              }`}>
                {isSuperAdmin ? <ShieldCheck className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate max-w-[130px]">
                  {user?.nombre || 'Usuario'}
                </p>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                  isSuperAdmin 
                    ? 'bg-indigo-500/20 text-indigo-300' 
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {user?.rol || 'SUPER ADMIN'}
                </span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Sesión activa" />
          </div>

          <p className="text-[10px] text-slate-400 truncate px-0.5">
            {user?.email || 'admin@excedentesraees.com'}
          </p>
        </div>

        {/* Buttons: Public Site & Logout */}
        <div className="space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <Globe className="w-4 h-4 text-brand-400" />
            <span>Ver Sitio Web Público</span>
          </Link>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </div>
    </aside>
  );
}
