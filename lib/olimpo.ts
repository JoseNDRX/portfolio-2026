import type { Lang } from './translations';
import type { SkillCategory } from './skills';

/* ---------------------------------------------------------------------------
   Universo Olimpo: el Panteón (sección Habilidades).
   Cada dios protege una o más categorías de lib/skills.ts; las tecnologías se
   toman de ahí, así que al actualizar el stack el Panteón se actualiza solo.

   Imágenes (public/universes/olimpo/):
   - concept/*.jpg   Ilustraciones de Pixabay (Licencia de contenido de Pixabay,
                     uso comercial sin atribución; generadas con IA).
   - concept/coro-perseo.jpg  Perseo de Canova, foto de Pixabay (misma licencia).
   - ol-parthenon_w.jpg       Wikimedia Commons, dominio público.
   - ol-colonnade.jpg, ol-marble.jpg  Wikimedia Commons, CC0.
   - bg/*.jpg  Fondos por sección (Wikimedia Commons):
       about       Teatro de Epidauro (CC0)
       experience  Friso sur del Partenón (dominio público)
       projects    Templo de Poseidón, cabo Sunión (CC0)
       courses     Cariátides del Erecteion (CC0)
       contact     Templo de Apolo en Delfos (CC0)
   --------------------------------------------------------------------------- */

export type God = {
  id: string;
  greek: string;
  name: Record<Lang, string>;
  domain: Record<Lang, string>;
  categories: SkillCategory[];
  image: string;
  /** Encuadre de la ilustración dentro del retrato (object-position). */
  focus: string;
};

const IMG = '/universes/olimpo/concept';

export const GODS: God[] = [
  {
    id: 'zeus', greek: 'ΖΕΥΣ',
    name: { es: 'Zeus', en: 'Zeus' },
    domain: { es: 'El que gobierna', en: 'The one who rules' },
    categories: ['reporting', 'tools'],
    image: `${IMG}/zeus.jpg`, focus: 'center 25%',
  },
  {
    id: 'atenea', greek: 'ΑΘΗΝΑ',
    name: { es: 'Atenea', en: 'Athena' },
    domain: { es: 'Estrategia y sabiduría', en: 'Strategy and wisdom' },
    categories: ['architecture', 'testing'],
    image: `${IMG}/athena.jpg`, focus: 'center 22%',
  },
  {
    id: 'prometeo', greek: 'ΠΡΟΜΗΘΕΥΣ',
    name: { es: 'Prometeo', en: 'Prometheus' },
    domain: { es: 'El fuego del conocimiento', en: 'The fire of knowledge' },
    categories: ['languages'],
    image: `${IMG}/prometeo.jpg`, focus: '30% center',
  },
  {
    id: 'hermes', greek: 'ΕΡΜΗΣ',
    name: { es: 'Hermes', en: 'Hermes' },
    domain: { es: 'Mensajero de los dioses', en: 'Messenger of the gods' },
    categories: ['backend', 'integrations'],
    image: `${IMG}/hermes.jpg`, focus: '35% center',
  },
  {
    id: 'apolo', greek: 'ΑΠΟΛΛΩΝ',
    name: { es: 'Apolo', en: 'Apollo' },
    domain: { es: 'Las artes y la luz', en: 'The arts and the light' },
    categories: ['frontend', 'mobile'],
    image: `${IMG}/apolo.jpg`, focus: '70% 30%',
  },
  {
    id: 'mnemosine', greek: 'ΜΝΗΜΟΣΥΝΗ',
    name: { es: 'Mnemósine', en: 'Mnemosyne' },
    domain: { es: 'La memoria, madre de las Musas', en: 'Memory, mother of the Muses' },
    categories: ['ai'],
    image: `${IMG}/mnemosine.jpg`, focus: 'center 25%',
  },
  {
    id: 'hefesto', greek: 'ΗΦΑΙΣΤΟΣ',
    name: { es: 'Hefesto', en: 'Hephaestus' },
    domain: { es: 'La forja', en: 'The forge' },
    categories: ['devops'],
    image: `${IMG}/hefesto.jpg`, focus: '40% 25%',
  },
  {
    id: 'hades', greek: 'ΑΔΗΣ',
    name: { es: 'Hades', en: 'Hades' },
    domain: { es: 'Lo que yace debajo', en: 'What lies beneath' },
    categories: ['databases'],
    image: `${IMG}/hades.jpg`, focus: 'center 30%',
  },
  {
    id: 'gea', greek: 'ΓΑΙΑ',
    name: { es: 'Gea', en: 'Gaia' },
    domain: { es: 'La Tierra, madre de todo', en: 'The Earth, mother of all' },
    categories: ['geospatial'],
    image: `${IMG}/gea.jpg`, focus: '45% center',
  },
];

/** Números romanos para los contadores del hero. */
export function toRoman(n: number): string {
  const map: [number, string][] = [[50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out;
}
