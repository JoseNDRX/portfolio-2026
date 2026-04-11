'use client';

import { useTheme } from 'next-themes';
import { useI18n } from '@/lib/i18n-context';
import { Moon, Sun, Menu, X, Code2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { href: '#about', label: t.nav.about },
    { href: '#skills', label: t.nav.skills },
    { href: '#experience', label: t.nav.experience },
    { href: '#projects', label: t.nav.projects },
    { href: '#courses', label: t.nav.courses },
    { href: '#contact', label: t.nav.contact },
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

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{
                width: 38,
                height: 38,
                borderRadius: '10px',
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
        }
      `}</style>
    </>
  );
}
