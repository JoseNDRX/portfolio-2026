import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { I18nProvider } from '@/lib/i18n-context';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'José Andrés Ramírez | Coordinador de Desarrollo de Software',
  description:
    'Portfolio profesional de José Andrés Ramírez Olvera — Coordinador de Desarrollo de Software con 25+ años de experiencia en LIMS, CRM, microservicios y desarrollo asistido por IA. Puebla, México.',
  keywords: [
    'José Andrés Ramírez',
    'Software Developer',
    'LIMS',
    'CRM',
    'NestJS',
    'Angular',
    'Next.js',
    'TypeScript',
    'Puebla',
    'Mexico',
    'Full Stack',
  ],
  authors: [{ name: 'José Andrés Ramírez Olvera' }],
  openGraph: {
    title: 'José Andrés Ramírez | Software Development Coordinator',
    description: 'Portfolio profesional — LIMS, CRM, microservicios, Angular, NestJS, Next.js',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
