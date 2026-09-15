import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const rawFilename = params.filename;
    // Prevenir path traversal
    const safeFilename = path.basename(rawFilename);

    // Buscar en data/uploads (volumen persistente Docker) y en public/uploads
    const dataPath = path.join(process.cwd(), 'data', 'uploads', safeFilename);
    const publicPath = path.join(process.cwd(), 'public', 'uploads', safeFilename);

    let filePathToRead = '';
    if (fs.existsSync(dataPath)) {
      filePathToRead = dataPath;
    } else if (fs.existsSync(publicPath)) {
      filePathToRead = publicPath;
    } else {
      return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 });
    }

    const ext = path.extname(safeFilename).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileBuffer = fs.readFileSync(filePathToRead);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error sirviendo imagen:', error);
    return NextResponse.json({ error: 'Error al servir la imagen' }, { status: 500 });
  }
}
