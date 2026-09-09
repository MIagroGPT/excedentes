import React from 'react';
import Navbar from '@/components/Navbar';
import Hero3D from '@/components/Hero3D';
import CicloProceso10 from '@/components/CicloProceso10';
import MetricasImpacto from '@/components/MetricasImpacto';
import TestimoniosCasos from '@/components/TestimoniosCasos';
import BlogSeccion from '@/components/BlogSeccion';
import ContactoSeccion from '@/components/ContactoSeccion';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Footer from '@/components/Footer';
import { getCMSContent } from '@/lib/dataStore';

export const revalidate = 0; // Dynamic server rendering for live CMS updates

export default function HomePage() {
  const content = getCMSContent();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      <Navbar />
      <Hero3D content={content.hero} />
      <CicloProceso10 procesos={content.procesos} />
      <MetricasImpacto metricas={content.metricas} />
      <TestimoniosCasos />
      <BlogSeccion articulos={content.blog} />
      <ContactoSeccion contacto={content.contacto} />
      <Footer />
      <FloatingWhatsApp phone={content.contacto.whatsapp} />
    </main>
  );
}
