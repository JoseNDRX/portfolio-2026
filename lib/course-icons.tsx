import { siAngular, siDocker, siDotnet, siN8n, siNextdotjs, type SimpleIcon } from 'simple-icons';
import { BookOpen, Layers, SquareKanban, Users, type LucideIcon } from 'lucide-react';

/* Icono de cada curso según su nombre (por palabra clave). Si agregas un curso
   en translations.ts toma su icono automáticamente; si no coincide con
   ninguna regla, usa el libro genérico. */

export type CourseIcon =
  | { kind: 'brand'; icon: SimpleIcon; color: string }
  | { kind: 'lucide'; icon: LucideIcon; color: string };

const RULES: { test: RegExp; icon: CourseIcon }[] = [
  // Angular usa su rojo clásico (el logo nuevo es casi negro y no se ve en modo oscuro).
  // C# y ASP.NET: simple-icons no tiene C#, se usa el logo de .NET (su plataforma).
  { test: /c#|asp\.?net|\.net/i, icon: { kind: 'brand', icon: siDotnet, color: '#512BD4' } },
  { test: /angular/i, icon: { kind: 'brand', icon: siAngular, color: '#DD0031' } },
  { test: /n8n/i, icon: { kind: 'brand', icon: siN8n, color: `#${siN8n.hex}` } },
  { test: /docker/i, icon: { kind: 'brand', icon: siDocker, color: `#${siDocker.hex}` } },
  // Next.js es negro: toma el color del texto para verse en claro y oscuro.
  { test: /next\.?js/i, icon: { kind: 'brand', icon: siNextdotjs, color: 'var(--text-primary)' } },
  // El logo de Scrum Alliance es un texto ilegible en pequeño: se usa un tablero Kanban.
  { test: /scrum/i, icon: { kind: 'lucide', icon: SquareKanban, color: '#009FDA' } },
  { test: /liderazgo|leadership/i, icon: { kind: 'lucide', icon: Users, color: '#f59e0b' } },
  { test: /full ?stack|web/i, icon: { kind: 'lucide', icon: Layers, color: '#8b5cf6' } },
];

const FALLBACK: CourseIcon = { kind: 'lucide', icon: BookOpen, color: 'var(--accent)' };

export function courseIcon(name: string): CourseIcon {
  return RULES.find((r) => r.test.test(name))?.icon ?? FALLBACK;
}
