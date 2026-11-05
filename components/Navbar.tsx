'use client';

import { useTheme } from 'next-themes';
import { useI18n } from '@/lib/i18n-context';
import { Moon, Sun, Menu, X, Code2, Clapperboard } from 'lucide-react';
import { useUniverse } from '@/lib/universe-context';
import { universeCopy } from '@/lib/universe-copy';
import { UNIVERSES } from '@/lib/universes';
import { useState, useEffect, useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useI18n();
  const { universe, openBoard, sectionLabel } = useUniverse();
  const boardCopy = universeCopy[lang].board;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // true en el navegador, false en el servidor (evita desajustes de hidratación).
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { href: '#hero', label: sectionLabel('home') },
    { href: '#about', label: sectionLabel('about') },
    { href: '#skills', label: sectionLabel('skills') },
    { href: '#experience', label: sectionLabel('experience') },
    { href: '#projects', label: sectionLabel('projects') },
    { href: '#courses', label: sectionLabel('courses') },
    { href: '#contact', label: sectionLabel('contact') },
  ];

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? '0.6rem 1.5rem' : '1rem 1.5rem',
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '100vw',
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--gradient-from), var(--gradient-to))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(56,189,248,0.4)',
            }}
          >
            <Code2 size={20} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            JNDRX<span className="gradient-text">.dev</span>
          </span>
        </a>

        {/* Desktop links */}
        <div
          style={{
            display: 'flex',
            gap: '1.75rem',
            alignItems: 'center',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="animated-underline"
              style={{
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = 'var(--accent)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'var(--text-secondary)')
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Lang toggle */}
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              border: '1.5px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.05em',
            }}
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>

          {/* Selector de universo */}
          <button
            onClick={openBoard}
            aria-label={`${boardCopy.openLabel}: ${UNIVERSES[universe].name[lang]}`}
            style={{
              height: 38,
              padding: '0 0.85rem',
              borderRadius: 'min(var(--radius), 10px)',
              border: '1.5px solid var(--accent)',
              background: 'var(--accent)',
              // En Profesional el azul es claro: texto oscuro para que se lea.
              color: universe === 'pro' ? '#04121f' : 'var(--on-accent)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            <Clapperboard size={16} aria-hidden="true" />
            <span className="universe-btn-label">
              {boardCopy.open}: {UNIVERSES[universe].name[lang]}
            </span>
          </button>

          {/* Claro / oscuro (cada universo tiene sus dos versiones) */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={
                theme === 'dark'
                  ? lang === 'es' ? 'Cambiar a modo claro' : 'Switch to light mode'
                  : lang === 'es' ? 'Cambiar a modo oscuro' : 'Switch to dark mode'
              }
              style={{
                width: 38,
                height: 38,
                borderRadius: 'min(var(--radius), 10px)',
                border: '1.5px solid var(--border)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              border: '1.5px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            className="hamburger-btn"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            zIndex: 999,
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                color: 'var(--text-primary)',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .universe-btn-label { display: none; }
        }
      `}</style>
    </>
  );
}
