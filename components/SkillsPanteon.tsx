'use client';

import Image from 'next/image';
import { Code2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { useUniverse } from '@/lib/universe-context';
import { universeCopy } from '@/lib/universe-copy';
import { skillData } from '@/lib/skills';
import { GODS } from '@/lib/olimpo';
import ScrollCue from '@/components/universe/ScrollCue';

/** Sección Habilidades en el universo Olimpo: cada dios protege categorías del stack. */
export default function SkillsPanteon() {
  const { lang, t } = useI18n();
  const { sectionLabel } = useUniverse();
  const c = universeCopy[lang].oli;

  return (
    <section id="skills" className="ol-panteon">
      <div className="ol-panteon-marble" aria-hidden="true" />
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
          return (
            <article key={g.id} className="ol-god">
              <div className="ol-portrait">
                <Image
                  src={g.image}
                  alt={`${c.portraitAlt} ${g.name[lang]}`}
                  fill
                  sizes="(max-width: 760px) 100vw, 400px"
                  style={{ objectPosition: g.focus }}
                />
                <div className="ol-greek" lang="el" aria-hidden="true">
                  {g.greek}
                </div>
              </div>
              <div className="ol-gbody">
                <h3 className="ol-gname">{g.name[lang]}</h3>
                <div className="ol-gdomain">{g.domain[lang]}</div>
                <div className="ol-gcat">{cats}</div>
                <div className="ol-chips">
                  {stack.map((s) => (
                    <span key={s} className="ol-chip">
                      {s}
                    </span>
                  ))}
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
