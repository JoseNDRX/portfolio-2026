import type { Lang } from './translations';

/* CV descargable. Los PDF están en public/cv/ con nombre fijo (sin fecha) para
   que el enlace no cambie: para actualizar el CV basta con reemplazar el archivo
   y volver a desplegar. */
export const CV_FILES: Record<Lang, string> = {
  es: '/cv/CV-JARO-ESP.pdf',
  en: '/cv/CV-JARO-ENG.pdf',
};

export const cvHref = (lang: Lang) => CV_FILES[lang];
