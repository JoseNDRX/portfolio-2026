import type { Lang } from './translations';

export const UNIVERSE_IDS = ['pro', 'esc', 'oli', 'gri', 'pulp', 'bas'] as const;
export type UniverseId = (typeof UNIVERSE_IDS)[number];

export type SectionKey = 'home' | 'about' | 'skills' | 'experience' | 'projects' | 'courses' | 'contact';

type Localized<T> = Record<Lang, T>;

export type Universe = {
  id: UniverseId;
  /** Valor para la URL: ?universo=<slug> */
  slug: string;
  name: Localized<string>;
  tagline: Localized<string>;
  /** Nombres de las secciones en este universo (menú y etiquetas de sección). */
  sections: Localized<Record<SectionKey, string>> | null;
  hasIntro: boolean;
  /** Duración de la intro (ms). Por defecto 3400. */
  introMs?: number;
};

export const UNIVERSES: Record<UniverseId, Universe> = {
  pro: {
    id: 'pro',
    slug: 'profesional',
    name: { es: 'Profesional', en: 'Professional' },
    tagline: { es: 'Claro y directo. Sin intro.', en: 'Clean and direct. No intro.' },
    sections: null, // usa los nombres normales de translations.ts
    hasIntro: false,
  },
  esc: {
    id: 'esc',
    slug: 'escuadron',
    name: { es: 'Escuadrón', en: 'Squad' },
    tagline: { es: 'Cómic de héroes: misiones y poderes.', en: 'Hero comic: missions and powers.' },
    sections: {
      es: { home: 'Portada', about: 'Origen', skills: 'Poderes', experience: 'Misiones', projects: 'Expedientes', courses: 'Entrenamiento', contact: 'Señal' },
      en: { home: 'Cover', about: 'Origin', skills: 'Powers', experience: 'Missions', projects: 'Case files', courses: 'Training', contact: 'Signal' },
    },
    hasIntro: true,
    introMs: 6000,
  },
  oli: {
    id: 'oli',
    slug: 'olimpo',
    name: { es: 'Olimpo', en: 'Olympus' },
    tagline: { es: 'Mitológico: hazañas y constelaciones.', en: 'Mythic: feats and constellations.' },
    sections: {
      es: { home: 'Templo', about: 'El héroe', skills: 'Artes', experience: 'Travesía', projects: 'Hazañas', courses: 'Saberes', contact: 'Oráculo' },
      en: { home: 'Temple', about: 'The hero', skills: 'Arts', experience: 'Odyssey', projects: 'Feats', courses: 'Wisdom', contact: 'Oracle' },
    },
    hasIntro: true,
    introMs: 6000,
  },
  gri: {
    id: 'gri',
    slug: 'grimorio',
    name: { es: 'Grimorio', en: 'Grimoire' },
    tagline: { es: 'Fantasía medieval: hechizos y pergaminos.', en: 'Medieval fantasy: spells and scrolls.' },
    sections: {
      es: { home: 'Prólogo', about: 'El autor', skills: 'Hechizos', experience: 'Viajes', projects: 'Encargos', courses: 'Academia', contact: 'Carta' },
      en: { home: 'Prologue', about: 'The author', skills: 'Spells', experience: 'Journeys', projects: 'Quests', courses: 'Academy', contact: 'Letter' },
    },
    hasIntro: true,
    introMs: 6000,
  },
  pulp: {
    id: 'pulp',
    slug: 'capitulo-final',
    name: { es: 'Capítulo final', en: 'Final Chapter' },
    tagline: { es: 'Cine pulp: capítulos, grano y cortes.', en: 'Pulp cinema: chapters, grain and cuts.' },
    sections: {
      es: { home: 'Tráiler', about: 'Cap. 1', skills: 'Cap. 2', experience: 'Cap. 3', projects: 'Cap. 4', courses: 'Cap. 5', contact: 'Cap. 6' },
      en: { home: 'Trailer', about: 'Ch. 1', skills: 'Ch. 2', experience: 'Ch. 3', projects: 'Ch. 4', courses: 'Ch. 5', contact: 'Ch. 6' },
    },
    hasIntro: true,
    introMs: 6000,
  },
  bas: {
    id: 'bas',
    slug: 'bastion',
    name: { es: 'Bastión', en: 'Bastion' },
    tagline: { es: 'Anime de fantasía militar: episodios y expediciones.', en: 'Military fantasy anime: episodes and expeditions.' },
    sections: {
      es: { home: 'Base', about: 'Soldado', skills: 'Equipo', experience: 'Expediciones', projects: 'Operaciones', courses: 'Instrucción', contact: 'Cuartel' },
      en: { home: 'Base', about: 'Soldier', skills: 'Gear', experience: 'Expeditions', projects: 'Operations', courses: 'Drills', contact: 'HQ' },
    },
    hasIntro: true,
    introMs: 6000,
  },
};

export function universeFromSlug(slug: string | null | undefined): UniverseId | null {
  if (!slug) return null;
  const found = UNIVERSE_IDS.find((id) => UNIVERSES[id].slug === slug || id === slug);
  return found ?? null;
}

export function isUniverseId(v: unknown): v is UniverseId {
  return typeof v === 'string' && (UNIVERSE_IDS as readonly string[]).includes(v);
}

export const UNIVERSE_STORAGE_KEY = 'jaro-universe';
