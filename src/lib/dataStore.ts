import fs from 'fs';
import path from 'path';
import { CMSContent, LoteResiduo, SolicitudRecoleccion, UserAdmin } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const CMS_FILE = path.join(DATA_DIR, 'cms_content.json');
const LOTES_FILE = path.join(DATA_DIR, 'lotes.json');
const SOLICITUDES_FILE = path.join(DATA_DIR, 'solicitudes.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

export const INITIAL_CMS_CONTENT: CMSContent = {
  hero: {
    badge: "Líderes en Sostenibilidad y Economía Circular RAEE",
    title: "Dando una nueva vida a los residuos electrónicos, cuidamos nuestro planeta.",
    subtitle: "Somos Excedentes de Raees Suárez, pioneros en gestión integral, reciclaje certificado y desincorporación tecnológica en Medellín y Colombia.",
    ctaPrimary: "Solicitar Recolección",
    ctaSecondary: "Conoce Nuestro Proceso",
    stat1: { number: "+20", label: "Toneladas Recicladas" },
    stat2: { number: "85%", label: "Reducción de Impacto" },
    stat3: { number: "+10", label: "Ciudades en Colombia" },
    cards: [
      {
        id: 1,
        tag: "LOGÍSTICA ESPECIALIZADA",
        title: "Recolección Empresarial",
        description: "Retiro programado y seguro de equipos obsoletos directamente en tus instalaciones con trazabilidad desde origen.",
        icon: "Truck"
      },
      {
        id: 2,
        tag: "NORMATIVA LEGAL",
        title: "Certificación y QR",
        description: "Emisión de Certificados Ambientales e Informes Técnicos de Desarme válidos ante autoridades ambientales.",
        icon: "Award"
      },
      {
        id: 3,
        tag: "CERO VERTEDERO",
        title: "Economía Circular",
        description: "Reincorporación de plásticos, metales ferrosos y minerales valiosos a la cadena productiva.",
        icon: "Recycle"
      },
      {
        id: 4,
        tag: "SEGURIDAD DE DATOS",
        title: "Destrucción Segura",
        description: "Desarme técnico y desmagnetización de discos duros y memorias con actas de destrucción de información.",
        icon: "ShieldCheck"
      }
    ]
  },
  nosotros: {
    tag: "QUIÉNES SOMOS",
    title: "Transformando la Tecnología en Futuro Sostenible",
    description: "En Excedentes de Raees Suárez construimos confianza y conexión ecológica. Nacimos para solucionar la problemática del manejo inadecuado de residuos electrónicos en Colombia, garantizando procesos limpios y transparentes.",
    mision: "Reducir la contaminación generada por residuos electrónicos a través de prácticas sostenibles, promoviendo soluciones innovadoras que protejan el medio ambiente y generen impacto positivo en la comunidad.",
    vision: "Ser la empresa líder en la gestión y reciclaje de residuos electrónicos en Colombia, inspirando a otros a adoptar prácticas sostenibles y a construir juntos un futuro más verde.",
    valores: [
      "Innovación Continua",
      "Sostenibilidad Integral",
      "Transparencia en Trazabilidad",
      "Compromiso Social y Comunitario",
      "Excelencia Operativa"
    ],
    historia: "Excedentes de Raees Suárez nació de la urgente necesidad de detener la contaminación por e-waste en el Valle de Aburrá y toda Colombia. Desde Medellín hemos implementado tecnología de desarme selectivo y valorización de materias primas que devuelven componentes nobles a la industria.",
    equipo: [
      {
        nombre: "Ing. Carlos Suárez",
        cargo: "Director de Operaciones y Sostenibilidad",
        descripcion: "Especialista en gestión ambiental y logística de residuos de manejo especial con más de 12 años de trayectoria.",
        avatar: "/images/team1.jpg"
      },
      {
        nombre: "Dra. Valentina Restrepo",
        cargo: "Líder de Cumplimiento Ambiental y Certificaciones",
        descripcion: "Auditora ambiental experta en normativas colombianas de desincorporación de activos y economía circular.",
        avatar: "/images/team2.jpg"
      },
      {
        nombre: "Mateo Gómez",
        cargo: "Jefe de Planta y Desarme Técnico",
        descripcion: "Supervisor de líneas de clasificación, valorización de metales y tratamiento de componentes peligrosos.",
        avatar: "/images/team3.jpg"
      }
    ]
  },
  servicios: [
    {
      id: "gestion-raee",
      title: "Gestión Integral de Residuos Electrónicos",
      description: "Recolección especializada, clasificación minuciosa y reciclaje responsable de componentes electrónicos de oficina e industriales.",
      icon: "Cpu",
      features: [
        "Recolección programada a nivel nacional con flota autorizada",
        "Clasificación y separación de materiales aprovechables y no aprovechables",
        "Recuperación de metales nobles, cobre, aluminio y plásticos técnicos"
      ],
      detalles: "Atendemos computadores, servidores, baterías, televisores, plantas telefónicas y electrodomésticos corporativos con pesaje exacto y cadena de custodia."
    },
    {
      id: "consultoria-ambiental",
      title: "Consultoría y Cumplimiento Normativo",
      description: "Asesoría técnica y legal personalizada para que las empresas cumplan con la legislación ambiental vigente y planes de postconsumo.",
      icon: "FileCheck",
      features: [
        "Planes de Gestión Integral de Residuos (PGIR)",
        "Elaboración de Informes de Sostenibilidad y Huella de Carbono",
        "Acompañamiento en auditorías de entes de control ambiental"
      ],
      detalles: "Garantizamos que tu compañía mantenga sus registros al día, evitando sanciones y mejorando tu calificación en auditorías de calidad ESG."
    },
    {
      id: "innovacion-ambiental",
      title: "Innovación en Soluciones Ambientales",
      description: "Proyectos a la medida para instituciones educativas, corporaciones y gobiernos que buscan transformar su huella tecnológica.",
      icon: "Sparkles",
      features: [
        "Campañas de retoma y sensibilización para colaboradores",
        "Donación y refabricación de equipos para comunidades vulnerables",
        "Talleres de concientización y cultura de reciclaje"
      ],
      detalles: "Fomentamos la inclusión digital mediante el reacondicionamiento seguro de equipos viables para escuelas rurales y fundaciones."
    }
  ],
  metricas: {
    toneladas: 28,
    reduccionImpacto: 85,
    ciudades: 12,
    empresasAtendidas: 140
  },
  procesos: [
    {
      paso: 1,
      titulo: "Contacto Inicial",
      subtitulo: "Asesoría y Diagnóstico",
      descripcion: "El cliente se comunica mediante nuestros canales digitales o portal para registrar sus necesidades de desincorporación.",
      icono: "PhoneCall",
      detalles: ["Identificación preliminar del inventario", "Asignación de asesor ambiental", "Canal de soporte 24/7"],
      tiempoEstimado: "2 a 4 Horas"
    },
    {
      paso: 2,
      titulo: "Solicitud de Recolección",
      subtitulo: "Planificación Logística",
      descripcion: "Formalización del pedido con estimación de volumen, tipología de equipos y condiciones de retiro en sitio.",
      icono: "FileSpreadsheet",
      detalles: ["Emisión de manifiesto de carga", "Coordinación de permisos de acceso", "Generación de código de seguimiento"],
      tiempoEstimado: "Mismo Día"
    },
    {
      paso: 3,
      titulo: "Recolección en Sitio",
      subtitulo: "Transporte Seguro",
      descripcion: "Vehículos equipados y personal capacitado con EPP realizan el embalaje y cargue con acta de entrega.",
      icono: "Truck",
      detalles: ["Pesaje preliminar en báscula móvil", "Precintado de seguridad", "Transporte hacia planta central"],
      tiempoEstimado: "24 a 48 Horas"
    },
    {
      paso: 4,
      titulo: "Clasificación en Planta",
      subtitulo: "Segregación por Líneas",
      descripcion: "Recepción en planta de transferencia y separación metódica entre residuos aprovechables y componentes peligrosos.",
      icono: "Layers",
      detalles: ["Separación de tarjetas madres, fuentes, cables y chasis", "Categorización por grados de pureza", "Control de inventario digital"],
      tiempoEstimado: "Día 1 en Planta"
    },
    {
      paso: 5,
      titulo: "Almacenamiento Temporal",
      subtitulo: "Custodia Regulada",
      descripcion: "Ubicación en celdas técnicas techadas con control de humedad y piso epóxico según normatividad ambiental.",
      icono: "Warehouse",
      detalles: ["Áreas delimitadas e ignífugas", "Monitoreo por circuito cerrado", "Control de trazabilidad por lote"],
      tiempoEstimado: "1 a 3 Días"
    },
    {
      paso: 6,
      titulo: "Desmontaje y Separación",
      subtitulo: "Desensamble Técnico",
      descripcion: "Operarios técnicos despiezan cada dispositivo extrayendo plásticos, cobres, aluminios, placas de circuito y baterías.",
      icono: "Wrench",
      detalles: ["Herramientas antiestáticas", "Destrucción física de memorias/almacenamiento", "Pesaje exacto por material segregado"],
      tiempoEstimado: "Día 2 en Planta"
    },
    {
      paso: 7,
      titulo: "Informe Técnico de Desarme",
      subtitulo: "Documentación Detallada",
      descripcion: "Elaboración de informe con registro fotográfico, balances de masa y pesos netos por cada fracción obtenida.",
      icono: "FileText",
      detalles: ["Desglose porcentual de materiales", "Evidencias fotográficas del proceso", "Firma del ingeniero supervisor"],
      tiempoEstimado: "Inmediato"
    },
    {
      paso: 8,
      titulo: "Certificado de Gestión Ambiental",
      subtitulo: "Validez Oficial con QR",
      descripcion: "Emisión del Certificado Oficial con código QR único para auditorías, DIAN y autoridades ambientales.",
      icono: "Award",
      detalles: ["Firma digital criptográfica", "Verificación pública instantánea en la web", "Cálculo de huella de CO2 evitada"],
      tiempoEstimado: "Emisión Digital"
    },
    {
      paso: 9,
      titulo: "Reciclaje y Valorización",
      subtitulo: "Economía Circular Activa",
      descripcion: "Envío de materias primas secundarias (cobre, plástico peletizado, aluminio) a fundiciones y refinerías autorizadas.",
      icono: "Recycle",
      detalles: ["Cero vertedero de materiales reciclables", "Reincorporación a la industria nacional", "Certificados de aprovechamiento"],
      tiempoEstimado: "Ciclo Continuo"
    },
    {
      paso: 10,
      titulo: "Tratamiento de Residuos Peligrosos",
      subtitulo: "Disposición Final Segura",
      descripcion: "Neutralización y confinamiento controlado en celdas de seguridad de elementos tóxicos como mercurio, cadmio o plomo.",
      icono: "ShieldAlert",
      detalles: ["Gestores de residuos peligrosos (RESPEL) certificados", "Termodestrucción e inertización", "Manifiestos de disposición final"],
      tiempoEstimado: "Cierre de Ciclo"
    }
  ],
  blog: [
    {
      id: "reducir-huella-electronica",
      titulo: "5 Formas Clave de Reducir la Huella Electrónica en tu Empresa",
      categoria: "Sostenibilidad",
      fecha: "18 Febrero 2026",
      resumen: "Aprende cómo optimizar el ciclo de vida de los activos TI corporativos y aplicar principios de economía circular.",
      tiempoLectura: "4 min de lectura",
      imagen: "/images/blog1.jpg"
    },
    {
      id: "impacto-reciclaje-medellin",
      titulo: "El Impacto Positivo del Reciclaje de RAEE en Medellín y Antioquia",
      categoria: "Impacto Local",
      fecha: "10 Enero 2026",
      resumen: "Cómo la correcta gestión de residuos electrónicos previene la contaminación de fuentes hídricas y genera empleo verde.",
      tiempoLectura: "6 min de lectura",
      imagen: "/images/blog2.jpg"
    },
    {
      id: "identificar-residuos-casa",
      titulo: "Cómo Identificar Residuos Electrónicos y Baterías en Casa y Oficina",
      categoria: "Educación",
      fecha: "28 Diciembre 2025",
      resumen: "Guía práctica para clasificar aparatos eléctricos y electrónicos en desuso antes de entregarlos al gestor ambiental.",
      tiempoLectura: "3 min de lectura",
      imagen: "/images/blog3.jpg"
    }
  ],
  contacto: {
    telefono: "+57 314 518 1158",
    whatsapp: "+573145181158",
    email: "contacto@excedentesraees.com",
    direccion: "Carrera 48 # 20 - 114, Sector Industrial El Poblado / Guayabal",
    ciudad: "Medellín, Colombia",
    horario: "Lunes a Viernes: 8:00 AM - 5:30 PM | Sábados: 8:00 AM - 1:00 PM"
  }
};

export const INITIAL_LOTES: LoteResiduo[] = [
  {
    id: "RAEE-2026-001",
    codigoSeguimiento: "RAEE-MED-84920",
    cliente: {
      razonSocial: "Tecnologías Andinas S.A.S.",
      nit: "900.845.120-4",
      contactoNombre: "Ing. Laura Cadavid",
      email: "logistica@tecnoandinas.com",
      telefono: "+57 311 489 2039",
      direccion: "Calle 10 # 43E - 22",
      ciudad: "Medellín"
    },
    fechaSolicitud: "2026-02-15",
    fechaRecoleccion: "2026-02-18",
    fechaFinalizacion: "2026-02-22",
    etapaActual: 8,
    estado: "Completado",
    detallesCarga: {
      categoria: "Equipos de Cómputo",
      pesoEstimadoKg: 450,
      pesoRealKg: 468.5,
      desglosePesaje: {
        plasticosKg: 110.2,
        metalesFerrososKg: 185.3,
        tarjetasElectronicasKg: 88.0,
        cablesKg: 42.5,
        bateriasKg: 28.5,
        residuosPeligrososKg: 14.0
      },
      observaciones: "Torres de cómputo descontinuadas, monitores LCD y switchs de red retirados de sede principal."
    },
    bitacora: [
      { etapa: 1, fecha: "2026-02-15 09:30", nota: "Contacto recibido por formulario web", usuario: "Sistema Web" },
      { etapa: 2, fecha: "2026-02-15 11:00", nota: "Solicitud de recolección aprobada y programada", usuario: "Valentina Restrepo" },
      { etapa: 3, fecha: "2026-02-18 14:15", nota: "Recolección completada en camión institucional", usuario: "Conductor / Logística" },
      { etapa: 4, fecha: "2026-02-19 08:30", nota: "Pesaje inicial e ingreso a planta de clasificación", usuario: "Mateo Gómez" },
      { etapa: 6, fecha: "2026-02-20 16:00", nota: "Desensamble técnico y extracción selectiva de componentes", usuario: "Técnico Desarme" },
      { etapa: 7, fecha: "2026-02-21 10:00", nota: "Informe de desarme técnico consolidado", usuario: "Carlos Suárez" },
      { etapa: 8, fecha: "2026-02-22 15:30", nota: "Certificado oficial emitido con firma digital y QR", usuario: "Valentina Restrepo" }
    ],
    certificado: {
      numeroCertificado: "CERT-RAEE-2026-0042",
      fechaEmision: "2026-02-22",
      hashSeguridad: "e8b7c3d9a1f4e5a2b8c9d0e1f2a3b4c5",
      qrUrl: "/verificar-certificado?codigo=RAEE-MED-84920",
      disposicionFinal: "Aprovechamiento de metales 82%, Valorización plástica 15%, Confinamiento controlado 3%",
      impactoCO2EvitadoKg: 980.5
    }
  },
  {
    id: "RAEE-2026-002",
    codigoSeguimiento: "RAEE-ENV-93012",
    cliente: {
      razonSocial: "Banca Soluciones Medellín",
      nit: "890.301.992-1",
      contactoNombre: "Dr. Andrés Morales",
      email: "infraestructura@bancasoluciones.co",
      telefono: "+57 300 655 4411",
      direccion: "Avenida El Poblado # 15 Sur - 80",
      ciudad: "Medellín"
    },
    fechaSolicitud: "2026-02-28",
    fechaRecoleccion: "2026-03-02",
    etapaActual: 6,
    estado: "En Proceso",
    detallesCarga: {
      categoria: "Telecomunicaciones",
      pesoEstimadoKg: 280,
      pesoRealKg: 295.0,
      desglosePesaje: {
        plasticosKg: 58.0,
        metalesFerrososKg: 120.0,
        tarjetasElectronicasKg: 75.0,
        cablesKg: 30.0,
        bateriasKg: 12.0,
        residuosPeligrososKg: 0.0
      },
      observaciones: "Racks de servidores, UPS y cableado estructurado blindado."
    },
    bitacora: [
      { etapa: 1, fecha: "2026-02-28 10:15", nota: "Solicitud directa de corporación bancaria", usuario: "Sistema Web" },
      { etapa: 3, fecha: "2026-03-02 08:30", nota: "Recolección bajo protocolo estricto de seguridad", usuario: "Logística Especial" },
      { etapa: 6, fecha: "2026-03-03 11:20", nota: "Desmontaje de servidores y destrucción de discos con acta", usuario: "Mateo Gómez" }
    ]
  }
];

export const INITIAL_SOLICITUDES: SolicitudRecoleccion[] = [
  {
    id: "SOL-2026-089",
    empresa: "Constructora del Valle",
    nit: "901.223.445-8",
    contacto: "Mariana Henao",
    email: "ambiental@constructoradelvalle.com",
    telefono: "+57 312 908 1122",
    direccion: "Autopista Sur # 65-10",
    ciudad: "Itagüí / Medellín",
    tipoResiduos: ["Equipos de Cómputo", "Baterías", "Electrodomésticos"],
    pesoAproximado: "300 a 500 Kg",
    mensaje: "Requerimos recolección urgente para renovación tecnológica de oficina central y certificación ambiental.",
    fechaCreacion: "2026-03-04 14:20",
    estado: "Nueva"
  }
];

// Helper functions for reading/writing persistent data
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getCMSContent(): CMSContent {
  try {
    ensureDataDir();
    if (!fs.existsSync(CMS_FILE)) {
      fs.writeFileSync(CMS_FILE, JSON.stringify(INITIAL_CMS_CONTENT, null, 2), 'utf-8');
      return INITIAL_CMS_CONTENT;
    }
    const data = fs.readFileSync(CMS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo cms_content.json:", error);
    return INITIAL_CMS_CONTENT;
  }
}

export function saveCMSContent(content: CMSContent): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(CMS_FILE, JSON.stringify(content, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Error guardando cms_content.json:", error);
    return false;
  }
}

export function getLotes(): LoteResiduo[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(LOTES_FILE)) {
      fs.writeFileSync(LOTES_FILE, JSON.stringify(INITIAL_LOTES, null, 2), 'utf-8');
      return INITIAL_LOTES;
    }
    const data = fs.readFileSync(LOTES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo lotes.json:", error);
    return INITIAL_LOTES;
  }
}

export function saveLotes(lotes: LoteResiduo[]): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(LOTES_FILE, JSON.stringify(lotes, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Error guardando lotes.json:", error);
    return false;
  }
}

export function getSolicitudes(): SolicitudRecoleccion[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(SOLICITUDES_FILE)) {
      fs.writeFileSync(SOLICITUDES_FILE, JSON.stringify(INITIAL_SOLICITUDES, null, 2), 'utf-8');
      return INITIAL_SOLICITUDES;
    }
    const data = fs.readFileSync(SOLICITUDES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo solicitudes.json:", error);
    return INITIAL_SOLICITUDES;
  }
}

export function saveSolicitudes(solicitudes: SolicitudRecoleccion[]): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(SOLICITUDES_FILE, JSON.stringify(solicitudes, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Error guardando solicitudes.json:", error);
    return false;
  }
}

export const INITIAL_USERS: UserAdmin[] = [
  {
    id: "USR-001",
    nombre: "Administrador General",
    email: "admin@excedentesraees.com",
    password: "Admin2026*Secret",
    rol: "SUPER ADMIN",
    estado: "Activo",
    fechaCreacion: "2026-01-15 08:00",
    ultimoAcceso: "2026-03-09 08:10"
  },
  {
    id: "USR-002",
    nombre: "Supervisor de Operaciones",
    email: "supervisor@excedentesraees.com",
    password: "Supervisor2026*",
    rol: "SUPERVISOR",
    estado: "Activo",
    fechaCreacion: "2026-02-01 09:30",
    ultimoAcceso: "2026-03-08 17:45"
  }
];

export function getUsers(): UserAdmin[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(INITIAL_USERS, null, 2), 'utf-8');
      return INITIAL_USERS;
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo users.json:", error);
    return INITIAL_USERS;
  }
}

export function saveUsers(users: UserAdmin[]): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Error guardando users.json:", error);
    return false;
  }
}

