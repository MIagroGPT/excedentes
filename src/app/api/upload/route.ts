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

    if (!fs.existsSync(dataUploadsDir)) {
      fs.mkdirSync(dataUploadsDir, { recursive: true });
    }
    if (!fs.existsSync(publicUploadsDir)) {
      fs.mkdirSync(publicUploadsDir, { recursive: true });
    }

    // Guardar en ambas ubicaciones para compatibilidad máxima (Docker volumen /app/data y static public)
    fs.writeFileSync(path.join(dataUploadsDir, filename), buffer);
    fs.writeFileSync(path.join(publicUploadsDir, filename), buffer);

    const fileUrl = `/api/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: filename,
      message: 'Imagen subida correctamente'
    });
  } catch (error: any) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json({ error: 'Error interno al procesar la subida del archivo' }, { status: 500 });
  }
}
