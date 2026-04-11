'use client';

import { useI18n } from '@/lib/i18n-context';
import { User, Globe, Briefcase, MapPin } from 'lucide-react';

const coreSkills = [
  'Arquitectura de Software',
  'LIMS & CRM',
  'Microservicios',
  'ISO 17025',
  'AI-Assisted Dev',
  'Liderazgo Técnico',
  'Automatización',
  'Administración de Servidores',
];

const coreSkillsEn = [
  'Software Architecture',
  'LIMS & CRM',
  'Microservices',
  'ISO 17025',
  'AI-Assisted Dev',
  'Technical Leadership',
  'Process Automation',
  'Server Administration',
];

export default function About() {
  const { t, lang } = useI18n();
  const skills = lang === 'es' ? coreSkills : coreSkillsEn;

  return (
    <section
      id="about"
      style={{ padding: '6rem 1.5rem', background: 'var(--bg-secondary)' }}
    >
      <div className="section-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-tag" style={{ display: 'inline-flex' }}>
            <User size={12} />
            {t.about.title}
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: '0.5rem',
            }}
          >
            {t.about.subtitle}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'start',
          }}
          className="about-grid"
        >
          {/* Left: Description */}
          <div>
            <p
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                fontSize: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              {t.about.p1}
            </p>
            <p
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                fontSize: '1rem',
                marginBottom: '2rem',
              }}
            >
              {t.about.p2}
            </p>

            {/* Core competencies */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skills.map((s) => (
                <span key={s} className="skill-badge">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Languages card */}
            <div className="card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.1rem',
                  color: 'var(--accent)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                <Globe size={16} />
                {t.about.languages}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { lang: t.about.spanish, level: t.about.native, pct: 100 },
                  { lang: t.about.english, level: 'B1', pct: 60 },
                  { lang: t.about.german, level: 'A2', pct: 25 },
                ].map((l) => (
                  <div key={l.lang}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <span
                        style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600 }}
                      >
                        {l.lang}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{l.level}</span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 3,
                        background: 'var(--border)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${l.pct}%`,
                          borderRadius: 3,
                          background:
                            'linear-gradient(90deg, var(--gradient-from), var(--gradient-to))',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability card */}
            <div className="card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  color: 'var(--accent)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                <Briefcase size={16} />
                {t.about.workMode}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  { icon: <Briefcase size={14} />, text: t.about.hybrid },
                  { icon: <MapPin size={14} />, text: 'Puebla, México' },
                  { icon: <Globe size={14} />, text: t.about.travel },
                ].map((item) => (
                  <div
                    key={item.text}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <span style={{ color: 'var(--accent-2)' }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
