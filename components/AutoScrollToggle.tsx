'use client';

import { useEffect, useState } from 'react';
import { ChevronsDown, Pause } from 'lucide-react';

/* ---------------------------------------------------------------------------
   Autoscroll: recorre la página sola, despacio, para ver las animaciones de
   cada universo sin tocar nada. Se apaga al llegar al final o en cuanto la
   persona interactúa (rueda, toque, teclado, arrastre de la barra).
   --------------------------------------------------------------------------- */

/** Velocidad en px por segundo. */
const SPEED = 60;

type Props = { lang: 'es' | 'en' };

export default function AutoScrollToggle({ lang }: Props) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!on) return;
    // Mientras recorre solo, los avisos de "sigue bajando" sobran: se ocultan (CSS en globals.css).
    document.documentElement.dataset.autoscroll = 'on';
    let raf = 0;
    let prev = performance.now();
    // Acumula fracciones de píxel: con scrollBy de < 1 px el navegador no avanzaría.
    let pos = window.scrollY;

    const stop = () => setOn(false);
    const tick = (now: number) => {
      const dt = Math.min(64, now - prev) / 1000;
      prev = now;
      // Si algo movió la página (un enlace del menú, por ejemplo), seguimos desde ahí.
      if (Math.abs(window.scrollY - Math.round(pos)) > 2) pos = window.scrollY;
      pos += SPEED * dt;
      window.scrollTo({ top: pos, behavior: 'instant' });
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (pos >= max - 1) return stop();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Cualquier gesto propio de la persona lo apaga. Excepciones: el propio botón
    // y los controles del navbar (tema, idioma, universo…): cambiarlos no debe detenerlo.
    const onUser = (e: Event) => {
      if (e.target instanceof Element && e.target.closest('.site-nav')) return;
      stop();
    };
    const opts = { passive: true } as const;
    window.addEventListener('wheel', onUser, opts);
    window.addEventListener('touchstart', onUser, opts);
    window.addEventListener('keydown', onUser);
    window.addEventListener('mousedown', onUser);
    return () => {
      delete document.documentElement.dataset.autoscroll;
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', onUser);
      window.removeEventListener('touchstart', onUser);
      window.removeEventListener('keydown', onUser);
      window.removeEventListener('mousedown', onUser);
    };
  }, [on]);

  const label = on
    ? lang === 'es' ? 'Detener recorrido automático' : 'Stop auto-scroll'
    : lang === 'es' ? 'Recorrido automático' : 'Auto-scroll';

  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      aria-label={label}
      title={label}
      className="nav-icon-btn"
      style={{
        width: 38,
        height: 38,
        borderRadius: 'min(var(--radius), 10px)',
        border: `1.5px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
        background: on ? 'var(--accent)' : 'var(--bg-card)',
        color: on ? 'var(--on-accent)' : 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}
    >
      {on ? <Pause size={16} /> : <ChevronsDown size={17} />}
    </button>
  );
}
