import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EXCEDENTES RAEES SUAREZ | Líderes en Reciclaje Electrónico en Medellín',
  description: 'Dando una nueva vida a los residuos electrónicos, cuidamos nuestro planeta. Gestión integral de RAEE, recolección empresarial, desensamble técnico y certificados ambientales oficiales con código QR en Medellín y Colombia.',
  keywords: [
    'reciclaje electrónico en Medellín',
    'excedentes raees suarez',
    'gestión de residuos electrónicos',
    'certificado ambiental RAEE',
    'desensamble de computadores',
    'disposición final residuos peligrosos',
    'economía circular Antioquia'
  ],
  authors: [{ name: 'Excedentes de Raees Suárez' }],
  openGraph: {
    title: 'EXCEDENTES RAEES SUAREZ | Reciclaje Electrónico y Sostenibilidad',
    description: 'Gestión integral, recolección empresarial y certificación ambiental de residuos electrónicos en Medellín.',
    url: 'https://excedentesraees.com',
    siteName: 'EXCEDENTES RAEES SUAREZ',
    locale: 'es_CO',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
