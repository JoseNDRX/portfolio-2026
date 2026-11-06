'use client';

import { useTheme } from 'next-themes';
import { useI18n } from '@/lib/i18n-context';
import { Moon, Sun, Menu, X, Code2, Clapperboard } from 'lucide-react';
import { useUniverse } from '@/lib/universe-context';
import { universeCopy } from '@/lib/universe-copy';
import { UNIVERSES } from '@/lib/universes';
import { useState, useEffect } from 'react';
import { useMounted } from '@/lib/hooks';
import AutoScrollToggle from './AutoScrollToggle';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useI18n();
  const { universe, openBoard, sectionLabel } = useUniverse();
  const boardCopy = universeCopy[lang].board;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // true en el navegador, false en el servidor (evita desajustes de hidratación).
  const mounted = useMounted();

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

  const themeLabel =
    theme === 'dark'
      ? lang === 'es' ? 'Cambiar a modo claro' : 'Switch to light mode'
      : lang === 'es' ? 'Cambiar a modo oscuro' : 'Switch to dark mode';

  // Estilos en app/navbar.css
  return (
    <>
      <nav className={`site-nav${scrolled ? ' is-scrolled' : ''}`}>
        <a href="#" className="nav-logo">
          <span className="nav-logo-mark">
            <Code2 size={20} />
          </span>
          <span className="nav-logo-text">
            JNDRX<span className="gradient-text">.dev</span>
          </span>
        </a>

        <div className="desktop-nav">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="animated-underline">
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav-controls">
          <button className="nav-btn nav-lang" onClick={() => setLang(lang === 'es' ? 'en' : 'es')}>
            {lang === 'es' ? 'EN' : 'ES'}
          </button>

          <button
            className="nav-btn nav-universe"
            onClick={openBoard}
            aria-label={`${boardCopy.openLabel}: ${UNIVERSES[universe].name[lang]}`}
          >
            <Clapperboard size={16} aria-hidden="true" />
            <span className="universe-btn-label">
              {boardCopy.open}: {UNIVERSES[universe].name[lang]}
            </span>
          </button>

          {/* Recorrido automático de la página */}
          <AutoScrollToggle lang={lang} />

          {/* Claro / oscuro (cada universo tiene sus dos versiones) */}
          {mounted && (
            <button className="nav-btn is-square" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={themeLabel}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          <button className="nav-btn is-square hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
