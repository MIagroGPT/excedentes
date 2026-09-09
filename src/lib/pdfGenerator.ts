import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import { LoteResiduo } from './types';

async function loadLogoBase64(): Promise<string> {
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('/logo.png');
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error('Error cargando logo:', e);
      return '';
    }
  }
  return '';
}

export async function generateCertificadoPDF(lote: LoteResiduo): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const greenPrimary = '#059669';
  const greenDark = '#064e3b';
  const grayDark = '#1f2937';

  // 1. Header Banner
  doc.setFillColor(6, 78, 59); // deep emerald
  doc.rect(0, 0, 210, 38, 'F');

  // Decorative accent line
  doc.setFillColor(16, 185, 129); // bright neon emerald
  doc.rect(0, 38, 210, 3, 'F');

  // Official Logo Container (Exact Natural Aspect Ratio 451:165 = 2.733)
  const logoBase64 = await loadLogoBase64();
  if (logoBase64) {
    const boxX = 10;
    const boxY = 6;
    const boxW = 60;
    const boxH = 26;
    
    // Proportional logo dimensions inside container
    const logoW = 56;
    const logoH = logoW / 2.73333; // 20.48 mm (preserva el 100% de la proporción original)
    const logoX = boxX + (boxW - logoW) / 2;
    const logoY = boxY + (boxH - logoH) / 2;

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, 'F');
    try {
      doc.addImage(logoBase64, 'PNG', logoX, logoY, logoW, logoH);
    } catch (err) {
      console.error('Error insertando imagen de logo:', err);
    }
  }

  // Title in header next to logo
  const textStartX = logoBase64 ? 74 : 15;

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.text('EXCEDENTES DE RAEES SUAREZ', textStartX, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Líderes en Gestión Integral y Disposición de RAEE', textStartX, 21);
  doc.text('NIT: 901.450.880-3 | Medellín, Colombia | contacto@excedentesraees.com', textStartX, 26);

  // Document Type Badge
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(154, 7, 46, 24, 2, 2, 'F');
  doc.setTextColor(6, 78, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CERTIFICADO OFICIAL', 157, 14);
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(lote.certificado?.numeroCertificado || `CERT-${lote.id}`, 157, 22);

  // 2. Main Title
  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('CERTIFICADO DE GESTIÓN Y DISPOSICIÓN FINAL AMBIENTAL', 15, 50);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  const introText = `Por medio del presente documento, EXCEDENTES DE RAEES SUAREZ certifica que ha recibido, clasificado, desensamblado y dispuesto conforme a la normatividad ambiental colombiana (Ley 1672 de 2013 y Decretos Reglamentarios) el lote de Residuos de Aparatos Eléctricos y Electrónicos (RAEE) detallado a continuación:`;
  const splitIntro = doc.splitTextToSize(introText, 180);
  doc.text(splitIntro, 15, 58);

  // 3. Client & Batch Details Table
  autoTable(doc, {
    startY: 72,
    head: [['DATOS DEL GENERADOR (CLIENTE)', 'INFORMACIÓN DEL LOTE RAEE']],
    body: [
      [
        `Razón Social: ${lote.cliente.razonSocial}\nNIT: ${lote.cliente.nit}\nRepresentante: ${lote.cliente.contactoNombre}\nDirección: ${lote.cliente.direccion}, ${lote.cliente.ciudad}\nEmail: ${lote.cliente.email}`,
        `Código de Seguimiento: ${lote.codigoSeguimiento}\nFecha Solicitud: ${lote.fechaSolicitud}\nFecha Recolección: ${lote.fechaRecoleccion || 'N/A'}\nFecha Certificación: ${lote.certificado?.fechaEmision || new Date().toISOString().split('T')[0]}\nCategoría: ${lote.detallesCarga.categoria}`
      ]
    ],
    theme: 'grid',
    headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: [31, 41, 55], cellPadding: 3.5 },
    columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 90 } }
  });

  // 4. Weight Breakdown Table
  const finalY1 = (doc as any).lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(6, 78, 59);
  doc.text('BALANCE DE MASAS Y DESGLOSE DE VALORIZACIÓN', 15, finalY1);

  const desglose = lote.detallesCarga.desglosePesaje || {
    plasticosKg: 0,
    metalesFerrososKg: 0,
    tarjetasElectronicasKg: 0,
    cablesKg: 0,
    bateriasKg: 0,
    residuosPeligrososKg: 0
  };

  const totalKg = lote.detallesCarga.pesoRealKg || lote.detallesCarga.pesoEstimadoKg;

  autoTable(doc, {
    startY: finalY1 + 4,
    head: [['Fracción / Material', 'Peso (Kg)', '% Total', 'Destino / Aprovechamiento']],
    body: [
      ['Metales Ferrosos y No Ferrosos (Aluminio/Hierro/Cobre)', `${desglose.metalesFerrososKg} kg`, `${((desglose.metalesFerrososKg / (totalKg || 1)) * 100).toFixed(1)}%`, 'Fundición y Reincorporación a Siderúrgicas'],
      ['Plásticos Técnicos (ABS / HIPS / Policarbonato)', `${desglose.plasticosKg} kg`, `${((desglose.plasticosKg / (totalKg || 1)) * 100).toFixed(1)}%`, 'Trituración y Peletizado Secundario'],
      ['Tarjetas de Circuito Impreso (PCB / Chips)', `${desglose.tarjetasElectronicasKg} kg`, `${((desglose.tarjetasElectronicasKg / (totalKg || 1)) * 100).toFixed(1)}%`, 'Refinación Térmica de Metales Nobles'],
      ['Cables y Conectores de Cobre Blindados', `${desglose.cablesKg} kg`, `${((desglose.cablesKg / (totalKg || 1)) * 100).toFixed(1)}%`, 'Pelado Mecánico y Granulado de Cobre'],
      ['Baterías de Litio / Plomo / NiMH', `${desglose.bateriasKg} kg`, `${((desglose.bateriasKg / (totalKg || 1)) * 100).toFixed(1)}%`, 'Gestor Especializado Respels Autorizado'],
      ['Residuos Peligrosos No Aprovechables (Respels)', `${desglose.residuosPeligrososKg} kg`, `${((desglose.residuosPeligrososKg / (totalKg || 1)) * 100).toFixed(1)}%`, 'Celda de Seguridad e Incineración Controlada'],
      ['TOTAL MATERIAL GESTIONADO', `${totalKg} kg`, '100%', 'Trazabilidad 100% Certificada']
    ],
    theme: 'striped',
    headStyles: { fillColor: [6, 78, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [31, 41, 55] },
    foot: [['PESO TOTAL NETO:', `${totalKg} KG`, 'CO2 EVITADO:', `${lote.certificado?.impactoCO2EvitadoKg || (totalKg * 2.1).toFixed(1)} Kg CO2eq`]],
    footStyles: { fillColor: [209, 250, 229], textColor: [6, 78, 59], fontStyle: 'bold', fontSize: 9 }
  });

  // 5. Verification QR Code & Security Stamp
  const finalY2 = (doc as any).lastAutoTable.finalY + 8;
  const qrUrl = `https://excedentesraees.com/verificar-certificado?codigo=${encodeURIComponent(lote.codigoSeguimiento)}`;
  
  try {
    const qrDataUrl = await QRCode.toDataURL(qrUrl, { margin: 1, width: 120 });
    doc.addImage(qrDataUrl, 'PNG', 15, finalY2, 30, 30);
  } catch (e) {
    console.error('Error generando QR:', e);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 78, 59);
  doc.text('VALIDACIÓN DIGITAL Y TRAZABILIDAD', 48, finalY2 + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(75, 85, 99);
  doc.text(`Escanea el código QR para validar la autenticidad de este certificado en tiempo real en nuestra plataforma.`, 48, finalY2 + 10);
  doc.text(`Hash de Seguridad Criptográfico:`, 48, finalY2 + 15);
  doc.setFont('courier', 'bold');
  doc.text(lote.certificado?.hashSeguridad || '8f4c2b9a7d1e0f3b5c6a8d2e9f1a4c7b', 48, finalY2 + 19);

  // Signatures
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(31, 41, 55);
  
  // Line 1
  doc.line(130, finalY2 + 18, 195, finalY2 + 18);
  doc.text('Ing. Carlos Suárez', 130, finalY2 + 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Director Técnico y Ambiental', 130, finalY2 + 26);
  doc.text('Reg. Profesional MinAmbiente #34098', 130, finalY2 + 28);

  // Footer Bottom Bar
  doc.setFillColor(243, 244, 246);
  doc.rect(0, 282, 210, 15, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(107, 114, 128);
  doc.text('Este documento es un certificado legal ambiental emitido bajo los lineamientos del Ministerio de Ambiente y Desarrollo Sostenible de Colombia.', 15, 287);
  doc.text(`Generado automáticamente por la Plataforma SaaS EXCEDENTES RAEES SUAREZ el ${new Date().toLocaleString('es-CO')}`, 15, 291);

  return doc;
}
