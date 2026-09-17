import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'El archivo debe ser una imagen válida (JPG, PNG, WebP, GIF o SVG)' }, { status: 400 });
    }

    // Validar tamaño máximo (15 MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'El tamaño de la imagen supera el límite permitido de 15MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitizar nombre de archivo
    const originalExt = path.extname(file.name) || '.jpg';
    const cleanBaseName = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
    const filename = `img_${Date.now()}_${cleanBaseName}${originalExt.toLowerCase()}`;

    // Asegurar directorios de persistencia
    const dataUploadsDir = path.join(process.cwd(), 'data', 'uploads');
    const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads');

    let savedToDisk = false;
    let fileUrl = `/api/uploads/${filename}`;

    // 1. Guardar en data/uploads (directorio de persistencia principal)
    try {
      if (!fs.existsSync(dataUploadsDir)) {
        fs.mkdirSync(dataUploadsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(dataUploadsDir, filename), buffer);
      savedToDisk = true;
    } catch (dataErr) {
      console.warn('Aviso: No se pudo guardar en data/uploads:', dataErr);
    }

    // 2. Intentar también en public/uploads como fallback para acceso estático
    try {
      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(publicUploadsDir, filename), buffer);
      savedToDisk = true;
    } catch (pubErr) {
      console.warn('Aviso: No se pudo escribir en public/uploads:', pubErr);
    }

    // 3. Fallback infalible: Si el contenedor Docker tiene permisos restringidos en disco,
    // convertir a Data URI Base64 para que la subida NUNCA falle ni de error 500
    if (!savedToDisk) {
      const mimeType = file.type || 'image/jpeg';
      fileUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: filename,
      message: 'Imagen subida correctamente'
    });
  } catch (error: any) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json({ 
      error: `Error al procesar la imagen: ${error?.message || 'Error interno'}` 
    }, { status: 500 });
  }
}
