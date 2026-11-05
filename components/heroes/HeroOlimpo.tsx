'use client';

import { useRef } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { universeCopy } from '@/lib/universe-copy';
import { skillCategoryOrder } from '@/lib/skills';
import { toRoman } from '@/lib/olimpo';
import ScrollCue from '@/components/universe/ScrollCue';

/** Cifras del hero: años, proyectos, tecnologías y áreas de conocimiento (categorías del stack). */
const STATS = [
  { value: 25, plus: true },
  { value: 30, plus: true },
  { value: 60, plus: true },
  { value: skillCategoryOrder.length, plus: false },
];

const MOTES = [
  { left: '54%', bottom: '8%', delay: '0s' },
  { left: '66%', bottom: '3%', delay: '2.5s' },
  { left: '78%', bottom: '10%', delay: '5s' },
  { left: '88%', bottom: '4%', delay: '7.2s' },
  { left: '40%', bottom: '2%', delay: '3.6s' },
];

export default function HeroOlimpo() {
  const { lang, t } = useI18n();
  const c = universeCopy[lang].oli;
  const ref = useRef<HTMLElement>(null);
  const words = t.hero.name.split(' ');

  // Parallax con el mouse: mueve el fondo y las placas en sentidos opuestos.
  // Se escribe en variables CSS para no re-renderizar en cada movimiento.
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const my = ((e.clientY - r.top) / r.height) * 2 - 1;
    el.style.setProperty('--ol-bx', `${(-mx * 18).toFixed(1)}px`);
    el.style.setProperty('--ol-by', `${(-my * 12).toFixed(1)}px`);
    el.style.setProperty('--ol-fx', `${(mx * 14).toFixed(1)}px`);
    el.style.setProperty('--ol-fy', `${(my * 10).toFixed(1)}px`);
  };

  return (
    <section id="hero" ref={ref} className="ol-hero" onMouseMove={onMove}>
      <div className="ol-photo" aria-hidden="true" />
      <div className="ol-shade" aria-hidden="true" />
      <div className="ol-fade" aria-hidden="true" />
      {MOTES.map((m) => (
        <div key={m.left} className="ol-mote" style={{ left: m.left, bottom: m.bottom, animationDelay: m.delay }} />
      ))}

      <div className="ol-inner">
        <div className="ol-copy">
          <div className="ol-kicker">{c.kicker}</div>
          <h1 className="ol-name">
            {words.slice(0, 2).join(' ')}
            <br />
            {words.slice(2).join(' ')}
          </h1>
          <p className="ol-role">{c.role}</p>
          <p className="ol-quote">{c.subtitle}</p>
          <div className="ol-ctas">
            <a href="#projects" className="ol-cta">{c.cta}</a>
            <a href="#contact" className="ol-cta2">{c.contact}</a>
          </div>
        </div>

        <div className="ol-stats">
          <div className="ol-stats-title">{c.statsTitle}</div>
          <ul className="ol-stats-grid" style={{ listStyle: 'none' }}>
            {STATS.map((s, i) => (
              <li key={c.stats[i]} className="ol-plaque">
                <div className="ol-pval" aria-hidden="true">
                  {toRoman(s.value)}
                  {s.plus ? '+' : ''}
                </div>
                <div className="ol-pnum">
                  {s.value}
                  {s.plus ? '+' : ''}
                </div>
                <div className="ol-plbl">{c.stats[i]}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ScrollCue />
    </section>
  );
}
