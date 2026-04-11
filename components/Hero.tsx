'use client';

import { useI18n } from '@/lib/i18n-context';
import { Code2, Network, Mail, Download, ArrowDown, Zap, Layers, Globe } from 'lucide-react';

export default function Hero() {
  const { t } = useI18n();

  const stats = [
    { value: '25+', label: t.hero.yearsExp, icon: <Zap size={18} /> },
    { value: '30+', label: t.hero.projects, icon: <Layers size={18} /> },
    { value: '15+', label: t.hero.techStack, icon: <Globe size={18} /> },
  ];

  return (
    <section
      id="hero"
      className="grid-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '6rem 1.5rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glowing orbs */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          right: '5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '0%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="section-container" style={{ width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '3rem',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Text content */}
          <div>
            {/* Badge */}
            <div className="section-tag" style={{ marginBottom: '1.5rem' }}>
              <Zap size={12} />
              Software Development Coordinator · Puebla, MX
            </div>

            {/* Greeting */}
            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.35rem',
                fontWeight: 500,
              }}
            >
              {t.hero.greeting}
            </p>

            {/* Name */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '0.5rem',
                color: 'var(--text-primary)',
              }}
            >
              {t.hero.name}
            </h1>

            {/* Title */}
            <h2
              className="gradient-text"
              style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                fontWeight: 700,
                marginBottom: '1.5rem',
              }}
            >
              {t.hero.title}
            </h2>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: 560,
                marginBottom: '2.5rem',
              }}
            >
              {t.hero.subtitle}
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <a href="#projects" className="btn-primary">
                <Layers size={16} />
                {t.hero.cta}
              </a>
              <a href="#contact" className="btn-outline">
                <Mail size={16} />
                {t.hero.contact}
              </a>
              <a
                href="/CV-JARO-ESP.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <Download size={16} />
                {t.hero.downloadCV}
              </a>
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
              {[
                {
                  icon: <Code2 size={18} />,
                  href: 'https://github.com/JoseNDRX',
                  label: 'GitHub',
                },
                {
                  icon: <Network size={18} />,
                  href: 'https://linkedin.com/in/josendRX',
                  label: 'LinkedIn',
                },
                {
                  icon: <Mail size={18} />,
                  href: 'mailto:jandresrmz@yahoo.com',
                  label: 'Email',
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 42,
                    height: 42,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(56,189,248,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Avatar + stats */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            {/* Avatar ring */}
            <div
              className="float-anim"
              style={{
                position: 'relative',
                width: 220,
                height: 220,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: -3,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gradient-from), var(--gradient-to))',
                  animation: 'glow-pulse 3s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid var(--bg-primary)',
                  background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '5rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, var(--gradient-from), var(--gradient-to))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  JA
                </span>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="card"
                  style={{
                    padding: '0.85rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    minWidth: 200,
                  }}
                >
                  <div style={{ color: 'var(--accent)' }}>{s.icon}</div>
                  <div>
                    <div
                      className="gradient-text"
                      style={{ fontWeight: 800, fontSize: '1.3rem', lineHeight: 1 }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}
                    >
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '4rem',
            color: 'var(--text-muted)',
          }}
        >
          <a
            href="#about"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              animation: 'float 2.5s ease-in-out infinite',
            }}
          >
            <span>scroll</span>
            <ArrowDown size={16} />
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-grid > div:last-child {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
