'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Users, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Edit3, 
  Lock, 
  Mail, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  X,
  Shield,
  KeyRound,
  Check,
  Search,
  Sparkles,
  Info
} from 'lucide-react';
import { UserAdmin, RolUsuario } from '@/lib/types';

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'TODOS' | 'SUPER ADMIN' | 'SUPERVISOR'>('TODOS');
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAdmin | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});

  // Form state
  const [formData, setFormData] = useState<{
    nombre: string;
    email: string;
    password: string;
    rol: RolUsuario;
    estado: 'Activo' | 'Inactivo';
  }>({
    nombre: '',
    email: '',
    password: '',
    rol: 'SUPERVISOR',
    estado: 'Activo'
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      rol: 'SUPERVISOR',
      estado: 'Activo'
    });
    setShowPassword(false);
    setModalOpen(true);
  };

  const openEditModal = (user: UserAdmin) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      password: user.password || '',
      rol: user.rol,
      estado: user.estado
    });
    setShowPassword(false);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim() || !formData.email.trim() || (!editingUser && !formData.password.trim())) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    try {
      if (editingUser) {
        // Edit User
        const res = await fetch('/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingUser.id,
            ...formData
          })
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(prev => prev.map(u => u.id === editingUser.id ? data.user : u));
          setModalOpen(false);
          alert('¡Usuario actualizado exitosamente!');
        } else {
          alert(data.error || 'Error al actualizar el usuario');
        }
      } else {
        // Create User
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(prev => [data.user, ...prev]);
          setModalOpen(false);
          alert(`¡Usuario ${data.user.rol} creado exitosamente!`);
        } else {
          alert(data.error || 'Error al crear el usuario');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor');
    }
  };

  const handleDeleteUser = async (user: UserAdmin) => {
    if (!confirm(`¿Estás seguro de eliminar permanentemente al usuario ${user.nombre} (${user.email})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users?id=${user.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== user.id));
        alert('Usuario eliminado correctamente.');
      } else {
        alert(data.error || 'Error al eliminar usuario');
      }
    } catch (e) {
      console.error(e);
      alert('Error de red al eliminar usuario');
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = filterRole === 'TODOS' || u.rol === filterRole;
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q || 
      u.nombre.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q);
    return matchesRole && matchesQuery;
  });

  const superAdminCount = users.filter(u => u.rol === 'SUPER ADMIN').length;
  const supervisorCount = users.filter(u => u.rol === 'SUPERVISOR').length;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <Users className="w-7 h-7 text-brand-600" />
              <span>Gestión de Usuarios y Perfiles de Acceso</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Administración de cuentas con roles diferenciados: <strong>SUPER ADMIN</strong> (Control Total) y <strong>SUPERVISOR</strong> (Supervisión sin permisos de eliminación).
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Usuario</span>
          </button>
        </div>

        {/* Roles & Permissions Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Card SUPER ADMIN */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Permisos Totales (Root)
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">SUPER ADMIN</h3>
            <p className="text-xs text-slate-300 mb-4">Administrador General con control integral del sistema.</p>

            <ul className="space-y-2 text-xs text-slate-200 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Crear, editar y <strong>eliminar</strong> Lotes y Solicitudes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Emitir y certificar con firma digital y QR</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Gestión de usuarios y creación de nuevas credenciales</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Edición y publicación de contenidos CMS</span>
              </li>
            </ul>
          </div>

          {/* Card SUPERVISOR */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                Solo Supervisión
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">SUPERVISOR</h3>
            <p className="text-xs text-slate-500 mb-4">Acceso de consulta y seguimiento operativo de procesos.</p>

            <ul className="space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Visualización del ciclo de 10 etapas y bitácora de lotes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Lectura y confirmación de solicitudes de recolección</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Validación y descarga de certificados oficiales</span>
              </li>
              <li className="flex items-center gap-2 text-rose-600 font-bold bg-rose-50 p-2 rounded-xl border border-rose-200">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>NO PUEDE ELIMINAR NINGÚN REGISTRO NI USUARIO</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setFilterRole('TODOS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterRole === 'TODOS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Todos ({users.length})</span>
            </button>
            <button
              onClick={() => setFilterRole('SUPER ADMIN')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterRole === 'SUPER ADMIN'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Super Admin ({superAdminCount})</span>
            </button>
            <button
              onClick={() => setFilterRole('SUPERVISOR')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterRole === 'SUPERVISOR'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Supervisor ({supervisorCount})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 shadow-xs"
            />
          </div>

        </div>

        {/* Users List Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Cargando usuarios...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold">No se encontraron usuarios registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Usuario / Nombre</th>
                    <th className="py-4 px-6">Correo Electrónico</th>
                    <th className="py-4 px-6">Rol de Acceso</th>
                    <th className="py-4 px-6">Contraseña</th>
                    <th className="py-4 px-6">Estado</th>
                    <th className="py-4 px-6">Fecha Registro</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isVisible = visiblePasswords[u.id];

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Name & ID */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                              u.rol === 'SUPER ADMIN'
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                : 'bg-teal-100 text-teal-700 border border-teal-200'
                            }`}>
                              {u.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{u.nombre}</p>
                              <span className="font-mono text-[10px] text-slate-400">{u.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-4 px-6">
                          <span className="font-medium text-slate-800">{u.email}</span>
                        </td>

                        {/* Role Badge */}
                        <td className="py-4 px-6">
                          {u.rol === 'SUPER ADMIN' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-2xs">
                              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                              <span>SUPER ADMIN</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-teal-100 text-teal-800 border border-teal-300 shadow-2xs">
                              <Eye className="w-3.5 h-3.5 text-teal-600" />
                              <span>SUPERVISOR</span>
                            </span>
                          )}
                        </td>

                        {/* Password with toggle */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-slate-800 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                              {isVisible ? u.password : '••••••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(u.id)}
                              className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200 transition-colors"
                              title={isVisible ? 'Ocultar contraseña' : 'Ver contraseña'}
                            >
                              {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                            u.estado === 'Activo'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.estado === 'Activo' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            <span>{u.estado}</span>
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-6 text-[11px] text-slate-500">
                          {u.fechaCreacion}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(u)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
                              title="Editar usuario y contraseña"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u)}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors border border-rose-200"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Crear / Editar Usuario */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative text-xs">
              
              <button 
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {editingUser ? 'Editar Usuario y Credenciales' : 'Crear Nuevo Usuario Administrador'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Configura el acceso y asigna el perfil de permisos.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Nombre */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nombre Completo:</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carlos Suárez"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Correo Electrónico (Usuario de Acceso):</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="usuario@excedentesraees.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold">Contraseña:</label>
                    <button
                      type="button"
                      onClick={() => {
                        const randomPass = 'Raees' + Math.floor(1000 + Math.random() * 9000) + '*!';
                        setFormData({ ...formData, password: randomPass });
                        setShowPassword(true);
                      }}
                      className="text-[10px] text-brand-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Generar Segura</span>
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required={!editingUser}
                      placeholder={editingUser ? 'Dejar en blanco para mantener la actual' : 'Mínimo 6 caracteres'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Rol de Usuario (Exactamente 2 opciones) */}
                <div>
                  <label className="block text-slate-700 font-bold mb-2">Perfil y Nivel de Acceso:</label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* SUPER ADMIN */}
                    <div
                      onClick={() => setFormData({ ...formData, rol: 'SUPER ADMIN' })}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.rol === 'SUPER ADMIN'
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                          <span className="font-black text-xs text-indigo-900">SUPER ADMIN</span>
                        </div>
                        {formData.rol === 'SUPER ADMIN' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <p className="text-[10px] text-slate-600 leading-tight">
                        Administrador General. Puede crear, editar y eliminar cualquier registro y gestionar usuarios.
                      </p>
                    </div>

                    {/* SUPERVISOR */}
                    <div
                      onClick={() => setFormData({ ...formData, rol: 'SUPERVISOR' })}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.rol === 'SUPERVISOR'
                          ? 'bg-teal-50 border-teal-600 text-teal-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-teal-600" />
                          <span className="font-black text-xs text-teal-900">SUPERVISOR</span>
                        </div>
                        {formData.rol === 'SUPERVISOR' && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                      </div>
                      <p className="text-[10px] text-slate-600 leading-tight">
                        Solo supervisión operativa. <strong>No puede eliminar ningún registro</strong>.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Estado de la Cuenta:</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'Activo' | 'Inactivo' })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  >
                    <option value="Activo">Activo (Permite inicio de sesión)</option>
                    <option value="Inactivo">Inactivo (Acceso suspendido)</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-200 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all hover:scale-102"
                  >
                    {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
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
