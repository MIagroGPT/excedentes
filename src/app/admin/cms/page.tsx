'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  FileEdit, 
  Save, 
  CheckCircle2, 
  Image as ImageIcon, 
  BookOpen, 
  Plus, 
  Trash2, 
  Layers, 
  Sparkles,
  Eye,
  Calendar,
  Clock,
  Tag
} from 'lucide-react';
import { CMSContent } from '@/lib/types';

const PRESET_PORTADAS = [
  { label: 'Portada 1 (Operación)', url: '/images/portada-1.png' },
  { label: 'Portada 2 (Técnico)', url: '/images/portada-2.png' },
  { label: 'Banner 1', url: '/images/ban-1.png' },
  { label: 'Banner 2', url: '/images/ban-2.png' },
];

const PRESET_BLOG_IMAGES = [
  { label: 'Historia 1', url: '/images/Promocional HISTORIA 1.jpg.jpeg' },
  { label: 'Historia 2', url: '/images/Promocional HISTORIA 2.jpg.jpeg' },
  { label: 'Historia 3', url: '/images/Promocional HISTORIA 3.jpg.jpeg' },
  { label: 'Reflexivo', url: '/images/Reflexivo Historia.jpg.jpeg' },
  { label: 'Testimonio', url: '/images/Testimonio.jpg.jpeg' },
  { label: 'Portada 1', url: '/images/portada-1.png' },
  { label: 'Portada 2', url: '/images/portada-2.png' },
];

export default function AdminCMSPage() {
  const [content, setContent] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'nosotros' | 'servicios' | 'blog' | 'metricas' | 'contacto'>('hero');

  useEffect(() => {
    fetch('/api/cms')
      .then(r => r.json())
      .then(data => {
        // Ensure default portadas and blog exist
        const updated = {
          ...data,
          hero: {
            ...data.hero,
            portada1: data.hero?.portada1 || '/images/portada-1.png',
            portada2: data.hero?.portada2 || '/images/portada-2.png'
          },
          blog: Array.isArray(data.blog) ? data.blog : []
        };
        setContent(updated);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert('Error al guardar los cambios en el CMS');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlogArticle = () => {
    if (!content) return;
    const newArticle = {
      id: `articulo-${Date.now()}`,
      titulo: 'Nuevo Artículo sobre Reciclaje RAEE',
      categoria: 'Sostenibilidad',
      fecha: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }),
      resumen: 'Escribe aquí el resumen del nuevo artículo informativo o normativo para tu audiencia...',
      tiempoLectura: '4 min de lectura',
      imagen: '/images/Promocional HISTORIA 1.jpg.jpeg'
    };
    setContent({
      ...content,
      blog: [newArticle, ...content.blog]
    });
  };

  const handleDeleteBlogArticle = (index: number) => {
    if (!content) return;
    if (confirm('¿Estás seguro de eliminar este artículo del blog?')) {
      const updated = content.blog.filter((_, idx) => idx !== index);
      setContent({ ...content, blog: updated });
    }
  };

  if (loading || !content) {
    return (
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        <AdminSidebar />
        <main className="flex-1 p-10 flex items-center justify-center text-slate-500 font-bold">
          Cargando configuración CMS...
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <FileEdit className="w-7 h-7 text-brand-600" />
              <span>Editor de Contenidos CMS del Sitio Web</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Modifica portadas, blog, textos, misión, servicios, estadísticas y datos de contacto en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡Cambios Guardados y Publicados!</span>
              </span>
            )}
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Guardando...' : 'Guardar y Publicar'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'hero' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-brand-400" />
            <span>Sección Hero & Portadas</span>
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'blog' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Blog & Artículos ({content.blog?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('nosotros')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'nosotros' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Quiénes Somos (Misión / Visión)
          </button>
          <button
            onClick={() => setActiveTab('servicios')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'servicios' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Servicios RAEE
          </button>
          <button
            onClick={() => setActiveTab('metricas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'metricas' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Métricas de Impacto
          </button>
          <button
            onClick={() => setActiveTab('contacto')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'contacto' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Contacto & Ubicación
          </button>
        </div>

        {/* Tab 1: Hero & Portadas */}
        {activeTab === 'hero' && (
          <div className="space-y-8 max-w-4xl text-xs">
            
            {/* Box: Portadas del Slider */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <ImageIcon className="w-5 h-5 text-brand-600" />
                <h2 className="text-base font-bold text-slate-900">Imágenes de la Portada Principal (Slider Automático)</h2>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Personaliza las 2 imágenes de fondo que se alternan suavemente en el encabezado de inicio. Puedes ingresar una ruta interna o URL de imagen.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Portada 1 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Portada 1 (Diapositiva Inicial)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-brand-100 text-brand-800 font-bold">Activa</span>
                  </div>

                  {/* Thumbnail preview */}
                  <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 relative shadow-inner">
                    <img 
                      src={content.hero.portada1 || '/images/portada-1.png'} 
                      alt="Vista previa Portada 1"
                      className="w-full h-full object-cover object-center"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/portada-1.png'; }}
                    />
                    <div className="absolute inset-0 bg-white/40 pointer-events-none" />
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                      Vista previa
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Ruta / URL de Portada 1:</label>
                    <input
                      type="text"
                      value={content.hero.portada1 || ''}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero, portada1: e.target.value }
                      })}
                      placeholder="/images/portada-1.png"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
                    />
                  </div>

                  {/* Preset quick buttons */}
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-500 font-semibold block mb-1">Selección rápida:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_PORTADAS.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setContent({ ...content, hero: { ...content.hero, portada1: p.url } })}
                          className={`text-[10px] px-2 py-1 rounded-lg border font-semibold transition-all ${
                            content.hero.portada1 === p.url
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Portada 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Portada 2 (Segunda Diapositiva)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Activa</span>
                  </div>

                  {/* Thumbnail preview */}
                  <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 relative shadow-inner">
                    <img 
                      src={content.hero.portada2 || '/images/portada-2.png'} 
                      alt="Vista previa Portada 2"
                      className="w-full h-full object-cover object-center"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/portada-2.png'; }}
                    />
                    <div className="absolute inset-0 bg-white/40 pointer-events-none" />
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                      Vista previa
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Ruta / URL de Portada 2:</label>
                    <input
                      type="text"
                      value={content.hero.portada2 || ''}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero, portada2: e.target.value }
                      })}
                      placeholder="/images/portada-2.png"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
                    />
                  </div>

                  {/* Preset quick buttons */}
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-500 font-semibold block mb-1">Selección rápida:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_PORTADAS.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setContent({ ...content, hero: { ...content.hero, portada2: p.url } })}
                          className={`text-[10px] px-2 py-1 rounded-lg border font-semibold transition-all ${
                            content.hero.portada2 === p.url
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Box: Textos del Encabezado */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Textos del Encabezado</h2>
              
              <div>
                <label className="block text-slate-700 font-bold mb-1">Badge Superior:</label>
                <input
                  type="text"
                  value={content.hero.badge}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Título Principal:</label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subtítulo Descriptivo:</label>
                <textarea
                  rows={3}
                  value={content.hero.subtitle}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Texto Botón Primario:</label>
                  <input
                    type="text"
                    value={content.hero.ctaPrimary}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaPrimary: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Texto Botón Secundario:</label>
                  <input
                    type="text"
                    value={content.hero.ctaSecondary}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaSecondary: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab: Blog & Noticias */}
        {activeTab === 'blog' && (
          <div className="space-y-6 max-w-4xl text-xs">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-600" />
                  <span>Artículos del Blog y Noticias RAEE</span>
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Administra las publicaciones informativas, consejos de reciclaje y normativas mostradas en la web.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddBlogArticle}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-brand-400" />
                <span>Agregar Nuevo Artículo</span>
              </button>
            </div>

            {/* Articles List */}
            <div className="space-y-6">
              {content.blog.map((art, idx) => (
                <div key={art.id || idx} className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4 relative">
                  
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        Artículo #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                        {art.categoria || 'General'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteBlogArticle(idx)}
                      className="text-rose-600 hover:text-rose-700 p-2 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200 flex items-center gap-1 transition-colors cursor-pointer text-xs font-semibold"
                      title="Eliminar este artículo"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Thumbnail & Image selector */}
                    <div className="md:col-span-4 space-y-3">
                      <label className="block text-slate-700 font-bold">Imagen del Artículo:</label>
                      <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 relative shadow-inner">
                        <img 
                          src={art.imagen || '/images/Promocional HISTORIA 1.jpg.jpeg'} 
                          alt={art.titulo}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/Promocional HISTORIA 1.jpg.jpeg'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
                        <div className="absolute bottom-2 left-2 text-[10px] text-white font-bold bg-slate-900/80 px-2 py-0.5 rounded">
                          Vista previa
                        </div>
                      </div>

                      <input
                        type="text"
                        value={art.imagen || ''}
                        onChange={(e) => {
                          const updated = [...content.blog];
                          updated[idx].imagen = e.target.value;
                          setContent({ ...content, blog: updated });
                        }}
                        placeholder="/images/Promocional HISTORIA 1.jpg.jpeg"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                      />

                      <div className="pt-1">
                        <span className="text-[10px] text-slate-500 font-semibold block mb-1">Imágenes sugeridas:</span>
                        <div className="flex flex-wrap gap-1">
                          {PRESET_BLOG_IMAGES.map((img, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                const updated = [...content.blog];
                                updated[idx].imagen = img.url;
                                setContent({ ...content, blog: updated });
                              }}
                              className={`text-[10px] px-2 py-0.5 rounded border transition-all ${
                                art.imagen === img.url
                                  ? 'bg-brand-600 text-white border-brand-600 font-bold'
                                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {img.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Info Inputs */}
                    <div className="md:col-span-8 space-y-3">
                      
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Título del Artículo:</label>
                        <input
                          type="text"
                          value={art.titulo}
                          onChange={(e) => {
                            const updated = [...content.blog];
                            updated[idx].titulo = e.target.value;
                            setContent({ ...content, blog: updated });
                          }}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Categoría:</label>
                          <input
                            type="text"
                            value={art.categoria}
                            onChange={(e) => {
                              const updated = [...content.blog];
                              updated[idx].categoria = e.target.value;
                              setContent({ ...content, blog: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Fecha Publicación:</label>
                          <input
                            type="text"
                            value={art.fecha}
                            onChange={(e) => {
                              const updated = [...content.blog];
                              updated[idx].fecha = e.target.value;
                              setContent({ ...content, blog: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Tiempo de Lectura:</label>
                          <input
                            type="text"
                            value={art.tiempoLectura}
                            onChange={(e) => {
                              const updated = [...content.blog];
                              updated[idx].tiempoLectura = e.target.value;
                              setContent({ ...content, blog: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Resumen / Contenido del Artículo:</label>
                        <textarea
                          rows={3}
                          value={art.resumen}
                          onChange={(e) => {
                            const updated = [...content.blog];
                            updated[idx].resumen = e.target.value;
                            setContent({ ...content, blog: updated });
                          }}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 resize-none leading-relaxed"
                        />
                      </div>

                    </div>

                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* Tab: Quiénes Somos */}
        {activeTab === 'nosotros' && (
          <div className="space-y-6 max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">Información Institucional</h2>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Título de la Sección:</label>
              <input
                type="text"
                value={content.nosotros.title}
                onChange={(e) => setContent({ ...content, nosotros: { ...content.nosotros, title: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Misión Corporativa:</label>
              <textarea
                rows={3}
                value={content.nosotros.mision}
                onChange={(e) => setContent({ ...content, nosotros: { ...content.nosotros, mision: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Visión Corporativa:</label>
              <textarea
                rows={3}
                value={content.nosotros.vision}
                onChange={(e) => setContent({ ...content, nosotros: { ...content.nosotros, vision: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Historia y Trayectoria:</label>
              <textarea
                rows={4}
                value={content.nosotros.historia}
                onChange={(e) => setContent({ ...content, nosotros: { ...content.nosotros, historia: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 resize-none"
              />
            </div>
          </div>
        )}

        {/* Tab: Servicios */}
        {activeTab === 'servicios' && (
          <div className="space-y-6 max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">Servicios Principales</h2>

            {content.servicios.map((srv, idx) => (
              <div key={srv.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="text-xs font-bold text-brand-700">Servicio #{idx + 1}: {srv.id}</p>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Título:</label>
                  <input
                    type="text"
                    value={srv.title}
                    onChange={(e) => {
                      const updated = [...content.servicios];
                      updated[idx].title = e.target.value;
                      setContent({ ...content, servicios: updated });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Descripción:</label>
                  <textarea
                    rows={2}
                    value={srv.description}
                    onChange={(e) => {
                      const updated = [...content.servicios];
                      updated[idx].description = e.target.value;
                      setContent({ ...content, servicios: updated });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Métricas */}
        {activeTab === 'metricas' && (
          <div className="space-y-6 max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">Estadísticas y Contadores de Impacto Ambiental</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Toneladas Recicladas:</label>
                <input
                  type="number"
                  value={content.metricas.toneladas}
                  onChange={(e) => setContent({ ...content, metricas: { ...content.metricas, toneladas: Number(e.target.value) } })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">% Reducción Impacto:</label>
                <input
                  type="number"
                  value={content.metricas.reduccionImpacto}
                  onChange={(e) => setContent({ ...content, metricas: { ...content.metricas, reduccionImpacto: Number(e.target.value) } })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Ciudades con Cobertura:</label>
                <input
                  type="number"
                  value={content.metricas.ciudades}
                  onChange={(e) => setContent({ ...content, metricas: { ...content.metricas, ciudades: Number(e.target.value) } })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Empresas Atendidas:</label>
                <input
                  type="number"
                  value={content.metricas.empresasAtendidas}
                  onChange={(e) => setContent({ ...content, metricas: { ...content.metricas, empresasAtendidas: Number(e.target.value) } })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Contacto */}
        {activeTab === 'contacto' && (
          <div className="space-y-6 max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">Datos de Contacto & Sede en Medellín</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Teléfono Fijo / PBX:</label>
                <input
                  type="text"
                  value={content.contacto.telefono}
                  onChange={(e) => setContent({ ...content, contacto: { ...content.contacto, telefono: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Número de WhatsApp:</label>
                <input
                  type="text"
                  value={content.contacto.whatsapp}
                  onChange={(e) => setContent({ ...content, contacto: { ...content.contacto, whatsapp: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Correo Electrónico:</label>
                <input
                  type="email"
                  value={content.contacto.email}
                  onChange={(e) => setContent({ ...content, contacto: { ...content.contacto, email: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Ciudad / Región:</label>
                <input
                  type="text"
                  value={content.contacto.ciudad}
                  onChange={(e) => setContent({ ...content, contacto: { ...content.contacto, ciudad: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Dirección de Sede / Planta:</label>
              <input
                type="text"
                value={content.contacto.direccion}
                onChange={(e) => setContent({ ...content, contacto: { ...content.contacto, direccion: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Horario de Atención:</label>
              <input
                type="text"
                value={content.contacto.horario}
                onChange={(e) => setContent({ ...content, contacto: { ...content.contacto, horario: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
              />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
