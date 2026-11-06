import type { Lang } from './translations';

// Imagen y categoría de cada proyecto para el archivo inmersivo.
// TEMPORAL: las imágenes son fotos genéricas de Unsplash (licencia libre,
// vía picsum.photos) mientras llegan las capturas reales de cada proyecto.
// Para cambiar una, pon la captura en /public/projects/ y actualiza `image`.
// Capturas reales (tomadas de cada sitio desplegado): labreport, teslo,
// pokemon-ssr, growing-healthcare, maps-app, rick-morty.
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
  lims_demo: { image: '/projects/stock-60.jpg', category: { es: 'Laboratorio · LIMS', en: 'Laboratory · LIMS' } },
  crm_demo: { image: '/projects/stock-0.jpg', category: { es: 'CRM geoespacial', en: 'Geospatial CRM' } },
  llm_validator: { image: '/projects/stock-9.jpg', category: { es: 'IA · Cumplimiento normativo', en: 'AI · Compliance' } },
  room_booking: { image: '/projects/stock-201.jpg', category: { es: 'Kiosco · .NET', en: 'Kiosk · .NET' } },
  kpi_17025: { image: '/projects/stock-48.jpg', category: { es: 'KPIs · ISO/IEC 17025', en: 'KPIs · ISO/IEC 17025' } },
  aquaadlablog: { image: '/projects/stock-6.jpg', category: { es: 'App móvil y escritorio', en: 'Mobile & desktop app' } },
  invitations_engine: { image: '/projects/stock-180.jpg', category: { es: 'Proyecto personal', en: 'Personal project' } },
  xv_invitation: { image: '/projects/stock-160.jpg', category: { es: 'Proyecto personal', en: 'Personal project' } },
  saas_srg: { image: '/projects/stock-8.jpg', category: { es: 'Plataforma SaaS', en: 'SaaS platform' } },
  labreport: { image: '/projects/labreport.jpg', category: { es: 'Herramienta', en: 'Tool' } },
  teslo: { image: '/projects/teslo.jpg', category: { es: 'E-commerce', en: 'E-commerce' } },
  pokemon_ssr: { image: '/projects/pokemon-ssr.jpg', category: { es: 'Web app · SSR', en: 'Web app · SSR' } },
  growing_healthcare: { image: '/projects/growing-healthcare.jpg', category: { es: 'Sitio web · Cliente', en: 'Website · Client' } },
  maps_app: { image: '/projects/maps-app.jpg', category: { es: 'Mapas · Angular', en: 'Maps · Angular' } },
  react_ecommerce: { image: '/projects/stock-8.jpg', category: { es: 'E-commerce · React', en: 'E-commerce · React' } },
  crud_products: { image: '/projects/stock-48.jpg', category: { es: 'CRUD · React', en: 'CRUD · React' } },
  pokedex_react: { image: '/projects/stock-160.jpg', category: { es: 'Web app · React', en: 'Web app · React' } },
  rick_morty: { image: '/projects/rick-morty.jpg', category: { es: 'Buscador · React', en: 'Search · React' } },
  weather_app: { image: '/projects/stock-119.jpg', category: { es: 'Clima · React', en: 'Weather · React' } },
  react_app: { image: '/projects/stock-6.jpg', category: { es: 'Web app · React', en: 'Web app · React' } },
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
