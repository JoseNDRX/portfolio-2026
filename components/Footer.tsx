'use client';

import { useI18n } from '@/lib/i18n-context';
import { Code2, Network, Mail } from 'lucide-react';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        padding: '2.5rem 1.5rem',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div
        className="section-container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--gradient-from), var(--gradient-to))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Code2 size={14} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            JNDRX<span className="gradient-text">.dev</span>
          </span>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          © {year} José Andrés Ramírez Olvera — {t.footer.rights}
          <br />
          <span style={{ fontSize: '0.75rem' }}>{t.footer.builtWith}</span>
        </p>

        {/* Socials */}
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {[
            { icon: <Code2 size={15} />, href: 'https://github.com/JoseNDRX' },
            { icon: <Network size={15} />, href: 'https://linkedin.com/in/josendRX' },
            { icon: <Mail size={15} />, href: 'mailto:jandresrmz@yahoo.com' },
          ].map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
