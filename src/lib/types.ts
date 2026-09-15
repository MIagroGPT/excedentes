export interface CMSContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    portada1?: string;
    portada2?: string;
    stat1: { number: string; label: string };
    stat2: { number: string; label: string };
    stat3: { number: string; label: string };
    cards: Array<{
      id: number;
      tag: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };
  nosotros: {
    tag: string;
    title: string;
    description: string;
    mision: string;
    vision: string;
    valores: string[];
    historia: string;
    equipo: Array<{
      nombre: string;
      cargo: string;
      descripcion: string;
      avatar: string;
    }>;
  };
  servicios: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    features: string[];
    detalles: string;
  }>;
  metricas: {
    toneladas: number;
    reduccionImpacto: number;
    ciudades: number;
    empresasAtendidas: number;
  };
  procesos: Array<{
    paso: number;
    titulo: string;
    subtitulo: string;
    descripcion: string;
    icono: string;
    detalles: string[];
    tiempoEstimado: string;
  }>;
  blog: Array<{
    id: string;
    titulo: string;
    categoria: string;
    fecha: string;
    resumen: string;
    tiempoLectura: string;
    imagen: string;
  }>;
  contacto: {
    telefono: string;
    whatsapp: string;
    email: string;
    direccion: string;
    ciudad: string;
    horario: string;
  };
  galeria?: Array<{
    id: string;
    src: string;
    title: string;
    subtitle?: string;
  }>;
}

export type EtapaProceso =
  | 1 // Contacto
  | 2 // Solicitud de Recolección
  | 3 // Recolección y Logística
  | 4 // Clasificación
  | 5 // Almacenamiento Temporal
  | 6 // Desmontaje y Separación
  | 7 // Informe de Desarme
  | 8 // Certificado de Gestión
  | 9 // Reciclaje y Aprovechamiento
  | 10; // Residuos Peligrosos

export interface LoteResiduo {
  id: string; // RAEE-2026-001
  codigoSeguimiento: string; // COD-XYZ-123
  cliente: {
    razonSocial: string;
    nit: string;
    contactoNombre: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
  };
  fechaSolicitud: string;
  fechaRecoleccion?: string;
  fechaFinalizacion?: string;
  etapaActual: EtapaProceso;
  estado: 'En Proceso' | 'Completado' | 'Pendiente' | 'Cancelado';
  detallesCarga: {
    categoria: 'Equipos de Cómputo' | 'Baterías' | 'Electrodomésticos' | 'Mixto' | 'Telecomunicaciones';
    pesoEstimadoKg: number;
    pesoRealKg?: number;
    desglosePesaje?: {
      plasticosKg: number;
      metalesFerrososKg: number;
      tarjetasElectronicasKg: number;
      cablesKg: number;
      bateriasKg: number;
      residuosPeligrososKg: number;
    };
    observaciones: string;
  };
  bitacora: Array<{
    etapa: EtapaProceso;
    fecha: string;
    nota: string;
    usuario: string;
  }>;
  certificado?: {
    numeroCertificado: string;
    fechaEmision: string;
    hashSeguridad: string;
    qrUrl: string;
    disposicionFinal: string;
    impactoCO2EvitadoKg: number;
  };
}

export type RolUsuario = 'SUPER ADMIN' | 'SUPERVISOR';

export interface UserAdmin {
  id: string;
  nombre: string;
  email: string;
  password?: string;
  rol: RolUsuario;
  estado: 'Activo' | 'Inactivo';
  fechaCreacion: string;
  ultimoAcceso?: string;
}

export type EstadoSolicitud = 'pendiente' | 'confirmado' | 'anulado' | 'procesado' | 'Nueva' | 'En Revisión' | 'Programada' | 'Convertida a Lote';

export interface SolicitudRecoleccion {
  id: string;
  empresa: string;
  nit: string;
  contacto: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  tipoResiduos: string[];
  pesoAproximado: string;
  mensaje?: string;
  fechaCreacion: string;
  estado: EstadoSolicitud;
  loteIdAsociado?: string;
}
