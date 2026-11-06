'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n-context';
import { useUniverse } from '@/lib/universe-context';
import { universeCopy } from '@/lib/universe-copy';
import { OliSky } from './UniverseBackdrop';

/** Banda de greca en terracota y negro (separador del universo Olimpo). */
export function Meander() {
  return (
    <svg className="ol-meander" height="26" aria-hidden="true">
      <defs>
        <pattern id="ol-meander" width="32" height="26" patternUnits="userSpaceOnUse">
          <rect width="32" height="26" fill="#b5532b" />
          <path d="M2 24 V3 H28 V19 H10 V10 H21" fill="none" stroke="#120d05" strokeWidth="3" />
        </pattern>
      </defs>
      <rect width="100%" height="26" fill="url(#ol-meander)" />
    </svg>
  );
}

/** Interludio del Coro entre el hero y "Sobre mí" (solo en Olimpo). */
export default function OlimpoCoro() {
  const { lang } = useI18n();
  const { universe } = useUniverse();
  if (universe !== 'oli') return null;
  const c = universeCopy[lang].oli;

  return (
    <>
      <Meander />
      <section className="ol-coro" aria-label={c.coroLabel}>
        <div className="ol-coro-photo" aria-hidden="true" />
        <div className="ol-coro-shade" aria-hidden="true" />
        <OliSky className="ub-oli-sky-coro" />
        <div className="ol-coro-inner">
          <motion.div
            className="ol-coro-frame"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: [0.2, 0.9, 0.2, 1] }}
          >
            <Image src="/universes/olimpo/concept/coro-perseo.jpg" alt={c.coroAlt} fill sizes="340px" />
          </motion.div>
          <div className="ol-coro-text">
            <div className="ol-coro-label">{c.coroLabel}</div>
            {c.coro.map((line, i) => (
              <motion.span
                key={line}
                className="ol-verse"
                initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.1, delay: 0.25 + i * 0.7 }}
              >
                {line}
              </motion.span>
            ))}
          </div>
        </div>
      </section>
      <Meander />
    </>
  );
}
