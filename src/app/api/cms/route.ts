import { NextResponse } from 'next/server';
import { getCMSContent, saveCMSContent } from '@/lib/dataStore';

export async function GET() {
  const content = getCMSContent();
  return NextResponse.json(content);
}

export async function POST(req: Request) {
  try {
    const updated = await req.json();
    const success = saveCMSContent(updated);
    if (!success) {
      return NextResponse.json({ error: 'Error al guardar contenido' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Contenido actualizado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Petición inválida' }, { status: 400 });
  }
}
