import type { Metadata } from 'next';
import {
  Inter,
  Bangers,
  Cinzel,
  Cormorant_Garamond,
  IM_Fell_English,
  GFS_Didot,
  Anton,
  Oswald,
} from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { I18nProvider } from '@/lib/i18n-context';
import { UniverseProvider } from '@/lib/universe-context';
import { UNIVERSES, UNIVERSE_IDS, UNIVERSE_STORAGE_KEY } from '@/lib/universes';
import './globals.css';
import './universes.css';
import './universe-themes.css';
import './projects-gallery.css';
import './projects-archive.css';
import './universe-backdrops.css';
import './universe-motion.css';
import './universe-olimpo.css';
import './universe-grimorio.css';
import './universe-pulp.css';
import './universe-bastion.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

// Tipografías de los universos: sin preload, el navegador solo las descarga
// cuando un universo las usa.
const bangers = Bangers({ weight: '400', subsets: ['latin'], variable: '--font-bangers', display: 'swap', preload: false });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', display: 'swap', preload: false });
const cormorant = Cormorant_Garamond({ weight: ['400', '500', '600', '700'], style: ['normal', 'italic'], subsets: ['latin'], variable: '--font-cormorant', display: 'swap', preload: false });
const fell = IM_Fell_English({ weight: '400', style: ['normal', 'italic'], subsets: ['latin'], variable: '--font-fell', display: 'swap', preload: false });
const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton', display: 'swap', preload: false });
const didot = GFS_Didot({ weight: '400', subsets: ['greek'], variable: '--font-didot', display: 'swap', preload: false });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald', display: 'swap', preload: false });

const fontVars = [inter, bangers, cinzel, cormorant, fell, anton, oswald, didot].map((f) => f.variable).join(' ');

// Aplica el universo antes de pintar (evita ver la paleta profesional un instante).
const slugMap = Object.fromEntries(UNIVERSE_IDS.flatMap((id) => [[UNIVERSES[id].slug, id], [id, id]]));
const universeBootScript = `(function(){try{var m=${JSON.stringify(slugMap)};var q=new URLSearchParams(location.search).get('universo');var s=localStorage.getItem('${UNIVERSE_STORAGE_KEY}');var u=(q&&m[q])||(s&&m[s])||'pro';document.documentElement.dataset.universe=u;}catch(e){document.documentElement.dataset.universe='pro';}})();`;

/** URL pública del portafolio (Cloudflare Workers). Debe coincidir con la del CV. */
const SITE_URL = 'https://portfolio-2026.jandresrmz.workers.dev';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
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
    url: SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-universe="pro" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: universeBootScript }} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <I18nProvider>
            <UniverseProvider>{children}</UniverseProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
