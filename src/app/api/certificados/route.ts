import { NextResponse } from 'next/server';
import { getLotes } from '@/lib/dataStore';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const codigo = searchParams.get('codigo');

  if (!codigo) {
    return NextResponse.json({ error: 'Código de seguimiento requerido' }, { status: 400 });
  }

  const lotes = getLotes();
  const cleanCode = codigo.trim().toUpperCase();

  const lote = lotes.find(
    l => l.codigoSeguimiento.toUpperCase() === cleanCode || 
         l.id.toUpperCase() === cleanCode || 
         l.certificado?.numeroCertificado.toUpperCase() === cleanCode
  );

  if (!lote) {
    return NextResponse.json({ found: false, message: 'Certificado o código no encontrado en el registro oficial.' }, { status: 404 });
  }

  return NextResponse.json({
    found: true,
    lote: {
      id: lote.id,
      codigoSeguimiento: lote.codigoSeguimiento,
      cliente: {
        razonSocial: lote.cliente.razonSocial,
        nit: lote.cliente.nit,
        ciudad: lote.cliente.ciudad
      },
      fechaSolicitud: lote.fechaSolicitud,
      fechaFinalizacion: lote.fechaFinalizacion,
      estado: lote.estado,
      etapaActual: lote.etapaActual,
      detallesCarga: {
        categoria: lote.detallesCarga.categoria,
        pesoTotalKg: lote.detallesCarga.pesoRealKg || lote.detallesCarga.pesoEstimadoKg,
        desglosePesaje: lote.detallesCarga.desglosePesaje
      },
      certificado: lote.certificado
    }
  });
}
