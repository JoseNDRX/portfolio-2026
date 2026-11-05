import type { Lang } from './translations';

// Imagen y categoría de cada proyecto para el archivo inmersivo.
// TEMPORAL: las imágenes son fotos genéricas de Unsplash (licencia libre,
// vía picsum.photos) mientras llegan las capturas reales de cada proyecto.
// Para cambiar una, pon la captura en /public/projects/ y actualiza `image`.
//
// Créditos (Unsplash):
//   stock-0, 6, 8, 9  Alejandro Escamilla
//   stock-48          Luke Chesser
//   stock-60          Vadim Sherbakov
//   stock-119         Nadir Balcikli
//   stock-160         Thom
//   stock-180         Galymzhan Abdugalimov
//   stock-201         Craig Garner

type Media = { image: string; category: Record<Lang, string> };

export const projectMedia: Record<string, Media> = {
  saas_srg: { image: '/projects/stock-180.jpg', category: { es: 'Plataforma SaaS', en: 'SaaS platform' } },
  lims_demo: { image: '/projects/stock-60.jpg', category: { es: 'Laboratorio · LIMS', en: 'Laboratory · LIMS' } },
  crm_demo: { image: '/projects/stock-0.jpg', category: { es: 'CRM', en: 'CRM' } },
  labreport: { image: '/projects/stock-119.jpg', category: { es: 'Herramienta', en: 'Tool' } },
  teslo: { image: '/projects/stock-8.jpg', category: { es: 'E-commerce', en: 'E-commerce' } },
  pokemon_ssr: { image: '/projects/stock-160.jpg', category: { es: 'Web app · SSR', en: 'Web app · SSR' } },
};

/** Imágenes de relleno para proyectos nuevos que aún no tienen captura. */
const fallbackImages = ['/projects/stock-6.jpg', '/projects/stock-9.jpg', '/projects/stock-48.jpg', '/projects/stock-201.jpg'];

export function mediaFor(id: string, index: number, lang: Lang): { image: string; category: string } {
  const m = projectMedia[id];
  return {
    image: m?.image ?? fallbackImages[index % fallbackImages.length],
    category: m?.category[lang] ?? (lang === 'es' ? 'Proyecto' : 'Project'),
  };
}
