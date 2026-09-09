import { NextResponse } from 'next/server';
import { getSolicitudes, saveSolicitudes } from '@/lib/dataStore';
import { SolicitudRecoleccion } from '@/lib/types';

export async function GET() {
  const solicitudes = getSolicitudes();
  return NextResponse.json(solicitudes);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const solicitudes = getSolicitudes();

    const newSolicitud: SolicitudRecoleccion = {
      id: `SOL-${new Date().getFullYear()}-${String(solicitudes.length + 1).padStart(3, '0')}`,
      empresa: data.empresa || 'Empresa Sin Nombre',
      nit: data.nit || 'Sin NIT',
      contacto: data.contacto || 'Contacto Principal',
      email: data.email || 'contacto@empresa.com',
      telefono: data.telefono || '+57 300 000 0000',
      direccion: data.direccion || 'Medellín',
      ciudad: data.ciudad || 'Medellín',
      tipoResiduos: Array.isArray(data.tipoResiduos) ? data.tipoResiduos : [data.tipoResiduos || 'RAEE Mixto'],
      pesoAproximado: data.pesoAproximado || '100 - 300 Kg',
      mensaje: data.mensaje || '',
      fechaCreacion: new Date().toLocaleString('es-CO'),
      estado: 'pendiente'
    };

    solicitudes.unshift(newSolicitud);
    saveSolicitudes(solicitudes);

    // Optional webhook trigger for n8n / automation
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'nueva_solicitud', data: newSolicitud })
        }).catch(e => console.error('n8n webhook error:', e));
      } catch (err) {
        // Continue even if webhook fails
      }
    }

    return NextResponse.json({ success: true, solicitud: newSolicitud });
  } catch (error) {
    return NextResponse.json({ error: 'Error al procesar solicitud' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, estado, loteIdAsociado } = data;

    if (!id) {
      return NextResponse.json({ error: 'ID de solicitud requerido' }, { status: 400 });
    }

    const solicitudes = getSolicitudes();
    const index = solicitudes.findIndex(s => s.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
    }

    if (estado) {
      solicitudes[index].estado = estado;
    }
    if (loteIdAsociado !== undefined) {
      solicitudes[index].loteIdAsociado = loteIdAsociado;
    }

    saveSolicitudes(solicitudes);
    return NextResponse.json({ success: true, solicitud: solicitudes[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar solicitud' }, { status: 500 });
  }
}
