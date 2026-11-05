# Portfolio 2026 — José Andrés Ramírez

Portfolio profesional bilingüe (ES/EN) con modo oscuro, animaciones y demos interactivas de un LIMS y un CRM.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19
- TypeScript
- Tailwind CSS 4
- [Framer Motion](https://motion.dev) para animaciones
- [next-themes](https://github.com/pacocoursey/next-themes) para el tema (oscuro por defecto)
- [lucide-react](https://lucide.dev) para iconos
- Fuente Inter vía `next/font/google`

## Requisitos

- Node.js 20.9 o superior (probado con Node 24)
- npm

## Puesta en marcha

Después de clonar el repositorio **hay que instalar las dependencias primero**. Si no, `npm run dev` falla con el error `"next" no se reconoce como un comando interno o externo`.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando         | Qué hace                                 |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Servidor de desarrollo con recarga en vivo |
| `npm run build` | Build de producción (incluye chequeo de TypeScript) |
| `npm run start` | Sirve el build de producción             |
| `npm run lint`  | ESLint                                   |

## Estructura

```
app/
  layout.tsx            # Layout raíz: tipografías, providers, metadata
  page.tsx              # Página principal (ensambla las secciones)
  globals.css           # Variables base (claro / oscuro) y estilos comunes
  universes.css         # Formas por universo, heroes, cartelera e intros
  universe-themes.css   # Paletas claro / oscuro de cada universo
  projects-gallery.css  # Archivo inmersivo 3D de Proyectos
  demos/
    lims/page.tsx       # Demo del LIMS  → /demos/lims
    crm/page.tsx        # Demo del CRM   → /demos/crm
components/
  Navbar, About, Skills, Experience, Projects, Courses, Contact, Footer
  Hero.tsx              # Elige el hero según el universo activo
  heroes/               # Un hero por universo (HeroPro, HeroEscuadron, …)
  universe/             # Cartelera (UniverseBoard) e intros (UniverseIntro)
  projects/             # Tarjeta de proyecto y galería 3D
lib/
  translations.ts       # Textos en español e inglés
  i18n-context.tsx      # Contexto de idioma (useI18n)
  skills.ts             # Stack técnico de la sección Habilidades
  universes.ts          # Registro de universos (nombres, secciones, slug)
  universe-copy.ts      # Textos de heroes, intros y cartelera (ES / EN)
  universe-context.tsx  # Universo activo, cartelera e intro (useUniverse)
public/                 # Recursos estáticos
```

### Editar contenido

Todos los textos del sitio están en [lib/translations.ts](lib/translations.ts). Las claves de `es` y `en` deben ser las mismas. Para usarlas en un componente:

```tsx
const { t, lang, setLang } = useI18n();
```

El stack de la sección Habilidades está en [lib/skills.ts](lib/skills.ts).

## Universos temáticos

El sitio tiene 6 universos que cambian el hero, la paleta, las tipografías y los nombres de las secciones: **Profesional** (por defecto), **Escuadrón**, **Olimpo**, **Grimorio**, **Capítulo final** y **Bastión**. Se eligen desde el botón **Universo** del menú, que abre una cartelera con una previa de cada uno. Todos menos Profesional reproducen una intro de unos 3 segundos, que se puede saltar con el botón o con `Esc`.

- Cada universo tiene versión **clara y oscura**, con el botón sol / luna del menú. El modo es global: si eliges oscuro, se mantiene al cambiar de universo. Las paletas de ambos modos están en [app/universe-themes.css](app/universe-themes.css).
- El universo elegido se guarda en el navegador.
- Se puede compartir un enlace directo: `/?universo=grimorio` (valores: `profesional`, `escuadron`, `olimpo`, `grimorio`, `capitulo-final`, `bastion`). Al abrirlo se reproduce la intro.
- Si el sistema tiene activado "reducir movimiento", no hay intros ni animaciones fuertes, y Proyectos se muestra como cuadrícula.

**Fondos por sección:** cada universo puede tener un fondo temático en cada sección ([components/universe/UniverseBackdrop.tsx](components/universe/UniverseBackdrop.tsx) y [app/universe-backdrops.css](app/universe-backdrops.css)). Por ahora los tiene Escuadrón: trama y ciudad en Origen, líneas de velocidad en Poderes, líneas de movimiento en Misiones, viñetas en Expedientes, trama degradada en Entrenamiento, rayos de sol en Señal, y onomatopeyas que aparecen y desaparecen en posiciones al azar (fuera de la columna de contenido).

**Animaciones por universo:** los títulos, etiquetas, tarjetas y badges de cada sección entran con una animación propia del universo, y el hover de las tarjetas también cambia ([components/universe/UniverseMotion.tsx](components/universe/UniverseMotion.tsx) y [app/universe-motion.css](app/universe-motion.css)):

| Universo | Entrada |
|---|---|
| Profesional | Aparece y sube suavemente |
| Escuadrón | Golpe de viñeta con rebote; los badges "saltan" y tiemblan al pasar el cursor |
| Olimpo | Se alza desde una bruma dorada; los títulos se condensan |
| Grimorio | Aparece como tinta; las tarjetas se despliegan como una página |
| Capítulo final | Corte de película: barrida y parpadeo |
| Bastión | Avance rápido desde un lado y "aterrizaje" |

Para agregar un universo:
1. Regístralo en [lib/universes.ts](lib/universes.ts).
2. Agrega sus paletas clara y oscura (`html:not(.dark)[data-universe='…']` y `html.dark[data-universe='…']`) en [app/universe-themes.css](app/universe-themes.css).
3. Crea su hero en `components/heroes/` y agrégalo en [components/Hero.tsx](components/Hero.tsx).
4. Agrega su póster en `UniverseBoard.tsx`, su intro en `UniverseIntro.tsx` y sus textos en `universe-copy.ts`.

## Proyectos: archivo inmersivo

La sección Proyectos es un **archivo inmersivo**: un lienzo infinito donde los proyectos flotan a distintas profundidades ([components/projects/ProjectsArchive.tsx](components/projects/ProjectsArchive.tsx)).

- Tiene **movimiento propio**: mientras nadie interactúa, las tarjetas derivan solas. Se detiene al pasar el mouse, arrastrar o abrir un proyecto, y vuelve a arrancar poco después (velocidad y espera en `DRIFT` e `IDLE_DELAY_MS`).
- Se explora **arrastrando** en cualquier dirección (con inercia); el scroll de la página también lo recorre, y la rueda horizontal o `Shift` + rueda lo mueve de lado.
- Al **hacer clic** se abre el detalle ([ProjectDetail.tsx](components/projects/ProjectDetail.tsx)) con título animado, tecnologías, enlaces y botones anterior / siguiente (también con las flechas del teclado; `Esc` cierra).
- Con teclado (`Tab`), el archivo se mueve para centrar la tarjeta enfocada.
- Cada universo le da su piel: en Escuadrón son portadas de cómic, en Capítulo final fotogramas en blanco y negro, etc.
- El universo **Bastión** usa otra variante, el "vuelo en profundidad" ([ProjectsGallery.tsx](components/projects/ProjectsGallery.tsx)), donde el scroll hace avanzar la cámara hacia adentro.

**Imágenes:** por ahora son fotos genéricas de Unsplash en `public/projects/`. Para poner la captura real de un proyecto, guárdala en esa carpeta y cambia su `image` en [lib/project-media.ts](lib/project-media.ts). Ahí también está la categoría que se muestra en cada tarjeta.

## Solución de problemas

- **`"next" no se reconoce como un comando...`**: faltan las dependencias. Ejecuta `npm install`.
- **Aviso `We detected multiple lockfiles`**: hay un `package-lock.json` en una carpeta superior (p. ej. `C:\Users\<usuario>\package-lock.json`). `next.config.ts` ya fija `turbopack.root` en esta carpeta. Si ese archivo superior no lo usa nada, puedes borrarlo.

## Despliegue

Se puede desplegar en cualquier hosting que soporte Node.js:

```bash
npm run build
npm run start
```
