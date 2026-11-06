'use client';

import { useI18n } from '@/lib/i18n-context';
import UniverseBackdrop from '@/components/universe/UniverseBackdrop';
import { useUniverse } from '@/lib/universe-context';
import { Mail, MapPin, Send, Code2, Network, Download } from 'lucide-react';
import { cvHref } from '@/lib/cv';
import { siWhatsapp } from 'simple-icons';
import BrandIcon from '@/components/BrandIcon';
import { useState } from 'react';

export default function Contact() {
  const { t, lang } = useI18n();
  const { sectionLabel } = useUniverse();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section
      id="contact"
      style={{ padding: '6rem 1.5rem', background: 'var(--bg-primary)' }}
    >
      <UniverseBackdrop section="contact" />
      <div className="section-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-tag" style={{ display: 'inline-flex' }}>
            <Mail size={12} />
            {sectionLabel('contact', t.contact.title)}
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: '0.5rem',
            }}
          >
            {t.contact.subtitle}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: '2.5rem',
            alignItems: 'start',
          }}
          className="contact-grid"
        >
          {/* Left: info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                fontSize: '0.95rem',
              }}
            >
              {t.contact.availability}
            </p>

            {[
              {
                icon: <Mail size={18} />,
                label: 'Email',
                value: 'jandresrmz@yahoo.com',
                href: 'mailto:jandresrmz@yahoo.com',
              },
              {
                // Contacto por WhatsApp: abre el chat con un saludo ya escrito.
                icon: <BrandIcon icon={siWhatsapp} size={20} />,
                label: 'WhatsApp',
                value: '+52 222 811 7255',
                href: `https://wa.me/522228117255?text=${encodeURIComponent(
                  lang === 'es'
                    ? 'Hola José Andrés, vi tu portafolio y me gustaría platicar contigo.'
                    : 'Hi José Andrés, I saw your portfolio and would like to talk with you.',
                )}`,
                external: true,
              },
              {
                icon: <MapPin size={18} />,
                label: t.contact.location,
                value: t.contact.location,
                href: null,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="card"
                style={{ padding: '1rem 1.1rem', display: 'flex', gap: '0.85rem', alignItems: 'center' }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>
                    {item.label}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      {...('external' in item && item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      style={{
                        fontSize: '1rem',
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Social */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
              {[
                { icon: <Code2 size={18} />, href: 'https://github.com/JoseNDRX', label: 'GitHub' },
                {
                  icon: <Network size={18} />,
                  href: 'https://www.linkedin.com/in/jos%C3%A9-andr%C3%A9s-ram%C3%ADrez-olvera-ba7822268',
                  label: 'LinkedIn',
                },
                // CV en el idioma del sitio (disponible en todos los universos).
                { icon: <Download size={18} />, href: cvHref(lang), label: t.hero.downloadCV },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ flex: '1 1 auto', justifyContent: 'center', padding: '0.6rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                >
                  {s.icon}
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="card">
            {sent ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                }}
              >
                <div
                  style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                  }}
                >
                  ✅
                </div>
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {lang === 'es' ? '¡Mensaje enviado!' : 'Message sent!'}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {lang === 'es'
                    ? 'Gracias por contactarme. Te responderé pronto.'
                    : 'Thank you for reaching out. I will reply soon.'}
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="btn-primary"
                  style={{ marginTop: '1.5rem' }}
                >
                  {lang === 'es' ? 'Enviar otro' : 'Send another'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {t.contact.name}
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {t.contact.email}
                  </label>
                  <input
                    className="input-field"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {t.contact.message}
                  </label>
                  <textarea
                    className="input-field"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={lang === 'es' ? 'Hola José...' : 'Hi José...'}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={sending}
                  style={{ justifyContent: 'center' }}
                >
                  {sending ? (
                    <>
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white',
                          animation: 'spin 0.8s linear infinite',
                          display: 'inline-block',
                        }}
                      />
                      {t.contact.sending}
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      {t.contact.send}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

