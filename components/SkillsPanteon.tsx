'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Code2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { useUniverse } from '@/lib/universe-context';
import { universeCopy } from '@/lib/universe-copy';
import { skillData } from '@/lib/skills';
import { GODS } from '@/lib/olimpo';
import ScrollCue from '@/components/universe/ScrollCue';
import { OliSky } from '@/components/universe/UniverseBackdrop';

/** Sección Habilidades en el universo Olimpo: cada dios protege categorías del stack. */
export default function SkillsPanteon() {
  const { lang, t } = useI18n();
  const { sectionLabel } = useUniverse();
  const c = universeCopy[lang].oli;
  // Dios cuya imagen se muestra por toque o teclado (en escritorio también basta el hover).
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section id="skills" className="ol-panteon">
      <div className="ol-panteon-marble" aria-hidden="true" />
      <OliSky />
      <div className="ol-ph">
        <div className="section-tag" style={{ display: 'inline-flex' }}>
          <Code2 size={12} />
          {sectionLabel('skills', t.skills.title)}
        </div>
        <h2>{c.panteonTitle}</h2>
        <p>{c.panteonSubtitle}</p>
      </div>

      <div className="ol-gods">
        {GODS.map((g) => {
          const stack = g.categories.flatMap((k) => skillData[k]);
          const cats = g.categories.map((k) => t.skills.categories[k]).join(' · ');
          const active = activeId === g.id;
          const toggle = () => setActiveId(active ? null : g.id);
          return (
            // Dos caras: la normal (stack, sin imagen) y la del dios (imagen + su descripción).
            // Con mouse cambia al pasar el cursor; en móvil, con un toque (otro toque regresa).
            <article
              key={g.id}
              className="ol-god"
              data-active={active || undefined}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              aria-label={`${g.name[lang]} — ${g.domain[lang]}`}
              onClick={toggle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggle();
                }
              }}
            >
              {/* Cara normal: solo las categorías y su stack */}
              <div className="ol-face ol-face-info">
                <h3 className="ol-gcat">{cats}</h3>
                <div className="ol-chips">
                  {stack.map((s) => (
                    <span key={s} className="ol-chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ol-face ol-face-god" aria-hidden={!active}>
                <Image
                  src={g.image}
                  alt={`${c.portraitAlt} ${g.name[lang]}`}
                  fill
                  sizes="(max-width: 760px) 100vw, 400px"
                  style={{ objectPosition: g.focus }}
                />
                <div className="ol-god-caption">
                  <div className="ol-greek" lang="el" aria-hidden="true">
                    {g.greek}
                  </div>
                  <div className="ol-gname">{g.name[lang]}</div>
                  <div className="ol-gdomain">{g.domain[lang]}</div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="ol-credits">{c.credits}</p>
      <ScrollCue to="experience" />
    </section>
  );
}
