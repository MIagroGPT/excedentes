# EXCEDENTES RAEES SUAREZ ♻️🌍

Plataforma Web 3D Interactiva, CMS Administrativo y Software SaaS de Gestión y Certificación del Ciclo RAEE (10 Etapas) para **EXCEDENTES RAEES SUAREZ** (Medellín, Colombia).

---

## 🚀 Características Principales

1. **Sitio Web 3D de Alto Impacto:**
   - **Hero 3D Interactivo (Three.js / WebGL + GSAP):** Escena 3D con el guardián ecológico sentado en la cima del planeta Tierra, 4 tarjetas flotantes interactivas, rotación inercial y partículas de e-waste (microchips, circuitos, bobinas de oro) flotando en parallax en tiempo real según el cursor y el scroll del usuario.
   - **Estructura Corporativa Completa (Extraída del PDF):**
     - Inicio con métricas de impacto ambiental (+20 Ton, 85% reducción de impacto, 12 ciudades).
     - Quiénes Somos (Misión, Visión, Valores, Historia en Antioquia y Equipo).
     - Servicios Especializados (Gestión RAEE, Consultoría Ambiental, Innovación).
     - **Ciclo Interactivo de 10 Etapas:** Visualizador dinámico paso a paso (Contacto, Solicitud, Recolección, Clasificación, Almacenamiento, Desmontaje, Informe, Certificado con QR, Reciclaje y Disposición de Peligrosos).
     - Casos de Éxito, Galería Promocional y Testimonios.
     - Blog y Consejos Prácticos de Reducción de Huella Electrónica.
     - Contacto con Mapa Interactivo de Medellín y canal directo a WhatsApp.

2. **Panel de Control Administrativo (CMS):**
   - Editor visual para cambiar en tiempo real los textos del Hero, Misión, Visión, Servicios, Estadísticas y Datos de contacto.

3. **Software SaaS / CRM de Trazabilidad & Certificación:**
   - Creación y seguimiento de lotes corporativos de reciclaje.
   - Registro de pesajes desglosados en planta (metales ferrosos, plásticos técnicos, tarjetas electrónicas PCB, cables, baterías, respels).
   - Bitácora de trazabilidad de cada fase.
   - **Generador de Certificados Oficiales en PDF con Código QR y Firma Digital Criptográfica.**

4. **Portal Público de Validación de Certificados:**
   - Escaneo de QR o ingreso de código de seguimiento para comprobar la autenticidad del certificado ambiental y descargar el PDF en tiempo real.

---

## 🛠️ Stack Tecnológico

- **Frontend & Fullstack:** Next.js 14 (App Router, Server Components, TypeScript).
- **Estilos & UI:** Tailwind CSS, Lucide React, Glassmorphism, Neon Glow effects.
- **Gráficos 3D & Animaciones:** Three.js, GSAP, Framer Motion, HTML5 WebGL Canvas.
- **Generación de Documentos:** jsPDF, jspdf-autotable, QRCode.
- **Despliegue:** Dockerfile multi-stage standalone, Docker Compose, EasyPanel en VPS Hostinger.

---

## 📦 Instrucciones para Despliegue en EasyPanel (Hostinger VPS)

### Paso 1: Subir el proyecto a un repositorio en GitHub
```bash
git init
git add .
git commit -m "Initial commit - Excedentes Raees Suarez Web & SaaS"
git branch -M main
git remote add origin https://github.com/tu-usuario/excedentes-raees-suarez.git
git push -u origin main
```

### Paso 2: Crear la App en EasyPanel
1. Entra a tu panel de **EasyPanel** en tu VPS de Hostinger.
2. Crea un nuevo **Project** o entra a uno existente.
3. Haz clic en **+ Service** -> Selecciona **App**.
4. En **Source**, selecciona **GitHub** y conecta tu repositorio.
5. En **Build**, selecciona **Dockerfile** (EasyPanel detectará automáticamente el archivo `Dockerfile` incluido en la raíz).
6. En **Environment Variables**, puedes configurar opcionalmente:
   - `PORT=3000`
   - `N8N_WEBHOOK_URL=https://n8n.tudominio.com/webhook/raee-events` (opcional si conectas n8n).
7. En **Volumes / Mounts**, añade un volumen persistente:
   - Host path: `/data` o volumen nombrado.
   - Container path: `/app/data` (para conservar las modificaciones del CMS y los lotes creados).
8. Haz clic en **Deploy**.

---

## ⚡ Automatizaciones con n8n (Opcional)

La plataforma envía webhooks automáticos cada vez que:
- Un cliente solicita recolección desde la web.
- Se avanza un lote a la etapa de recolección o desmontaje.
- Se emite un Certificado Oficial con QR (para disparar mensaje de WhatsApp con el enlace de descarga directa al cliente).
