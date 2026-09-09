import { NextResponse } from 'next/server';
import { getLotes, saveLotes } from '@/lib/dataStore';
import { LoteResiduo, EtapaProceso } from '@/lib/types';

export async function GET() {
  const lotes = getLotes();
  return NextResponse.json(lotes);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const lotes = getLotes();

    const newId = `RAEE-${new Date().getFullYear()}-${String(lotes.length + 1).padStart(3, '0')}`;
    const code = `RAEE-MED-${Math.floor(10000 + Math.random() * 90000)}`;

    const newLote: LoteResiduo = {
      id: newId,
      codigoSeguimiento: code,
      cliente: {
        razonSocial: data.razonSocial || 'Empresa Cliente',
        nit: data.nit || 'Sin NIT',
        contactoNombre: data.contactoNombre || 'Representante',
        email: data.email || 'email@cliente.com',
        telefono: data.telefono || '+57 300 000 0000',
        direccion: data.direccion || 'Medellín',
        ciudad: data.ciudad || 'Medellín'
      },
      fechaSolicitud: new Date().toISOString().split('T')[0],
      etapaActual: 1,
      estado: 'En Proceso',
      detallesCarga: {
        categoria: data.categoria || 'Equipos de Cómputo',
        pesoEstimadoKg: Number(data.pesoEstimadoKg) || 100,
        pesoRealKg: Number(data.pesoRealKg) || undefined,
        desglosePesaje: data.desglosePesaje || {
          plasticosKg: 0,
          metalesFerrososKg: 0,
          tarjetasElectronicasKg: 0,
          cablesKg: 0,
          bateriasKg: 0,
          residuosPeligrososKg: 0
        },
        observaciones: data.observaciones || 'Lote creado en plataforma SaaS'
      },
      bitacora: [
        {
          etapa: 1,
          fecha: new Date().toLocaleString('es-CO'),
          nota: 'Lote creado y registrado en plataforma.',
          usuario: 'Administrador SaaS'
        }
      ]
    };

    lotes.unshift(newLote);
    saveLotes(lotes);

    return NextResponse.json({ success: true, lote: newLote });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear lote' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const lotes = getLotes();
    const index = lotes.findIndex(l => l.id === data.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Lote no encontrado' }, { status: 404 });
    }

    const current = lotes[index];

    // If advancing stage or updating details
    if (data.etapaActual && data.etapaActual !== current.etapaActual) {
      current.bitacora.push({
        etapa: data.etapaActual as EtapaProceso,
        fecha: new Date().toLocaleString('es-CO'),
        nota: data.notaBitacora || `Avanzó a etapa ${data.etapaActual}`,
        usuario: data.usuario || 'Operador RAEE'
      });
      current.etapaActual = data.etapaActual;
    }

    if (data.detallesCarga) {
      current.detallesCarga = { ...current.detallesCarga, ...data.detallesCarga };
    }

    if (data.estado) {
      current.estado = data.estado;
    }

    if (data.fechaRecoleccion) {
      current.fechaRecoleccion = data.fechaRecoleccion;
    }

    // If generating certificate (Etapa 8)
    if (data.emitirCertificado) {
      const totalWeight = current.detallesCarga.pesoRealKg || current.detallesCarga.pesoEstimadoKg;
      current.certificado = {
        numeroCertificado: `CERT-RAEE-${new Date().getFullYear()}-${String(index + 40).padStart(4, '0')}`,
        fechaEmision: new Date().toISOString().split('T')[0],
        hashSeguridad: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        qrUrl: `/verificar-certificado?codigo=${current.codigoSeguimiento}`,
        disposicionFinal: 'Aprovechamiento y recuperación de metales y plásticos técnicos bajo norma MinAmbiente',
        impactoCO2EvitadoKg: Math.round(totalWeight * 2.1)
      };
      current.etapaActual = 8;
      current.estado = 'Completado';
      current.fechaFinalizacion = new Date().toISOString().split('T')[0];
    }

    lotes[index] = current;
    saveLotes(lotes);

    // Optional webhook trigger for n8n
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'actualizacion_lote', lote: current })
        }).catch(e => console.error(e));
      } catch (e) {}
    }

    return NextResponse.json({ success: true, lote: current });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar lote' }, { status: 400 });
  }
}
