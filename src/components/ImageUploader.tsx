'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, CheckCircle, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  presets?: Array<{ label: string; url: string }>;
  placeholder?: string;
  previewHeight?: string;
  helperText?: string;
}

export default function ImageUploader({
  label,
  value,
  onChange,
  presets,
  placeholder = '/images/portada-1.png',
  previewHeight = 'h-36',
  helperText,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setErrorMsg(null);
    setUploadSuccess(false);

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('La imagen supera el límite de 15 MB.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setErrorMsg(data.error || 'Error al subir la imagen al servidor');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error de conexión al cargar el archivo');
    } finally {
      setUploading(false);
      // Limpiar input file para permitir volver a subir el mismo archivo si es necesario
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-slate-700 font-bold text-xs">{label}</label>
        {uploadSuccess && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded animate-in fade-in">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            ¡Subida con éxito!
          </span>
        )}
      </div>

      {/* Vista previa con overlay */}
      <div className={`w-full ${previewHeight} rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 relative shadow-inner group`}>
        <img
          src={value || placeholder}
          alt={label}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholder;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
        
        {/* Badge esquina inferior */}
        <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-semibold flex items-center gap-1">
          <ImageIcon className="w-3 h-3 text-brand-400" />
          <span>Vista previa</span>
        </div>

        {/* Botón rápido sobre la imagen */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute top-2 right-2 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5 transition-all hover:scale-105 backdrop-blur-md cursor-pointer disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
              <span>Subiendo...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-3.5 h-3.5 text-brand-600" />
              <span>Cambiar Imagen</span>
            </>
          )}
        </button>
      </div>

      {/* Input oculto de tipo file */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Botón principal de carga desde PC y campo de URL */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cargando archivo...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              <span>Cargar archivo desde el PC</span>
            </>
          )}
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:border-brand-500 focus:bg-white"
          />
        </div>
      </div>

      {errorMsg && (
        <p className="text-[11px] text-rose-600 font-semibold">{errorMsg}</p>
      )}

      {helperText && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}

      {/* Presets de selección rápida si existen */}
      {presets && presets.length > 0 && (
        <div className="pt-1">
          <span className="text-[10px] text-slate-500 font-semibold block mb-1">Selección rápida de biblioteca:</span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(p.url)}
                className={`text-[10px] px-2 py-1 rounded-lg border font-semibold transition-all ${
                  value === p.url
                    ? 'bg-brand-600 text-white border-brand-600 font-bold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
