'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, FlaskConical, CheckCircle2, Clock, XCircle,
  FileText, Beaker, Search,
  Download, Plus, Eye
} from 'lucide-react';

const samples = [
  { id: 'M-2024-0891', client: 'PEMEX Refinery', type: 'Crude Oil', parameter: 'API Gravity', value: '32.5', unit: '°API', method: 'ASTM D287', status: 'conforme', analyst: 'R. Sánchez', date: '2024-04-10', cert: 'ISO-2024-891' },
  { id: 'M-2024-0892', client: 'Petrobras Mx', type: 'Diesel', parameter: 'Flash Point', value: '58.2', unit: '°C', method: 'ASTM D93', status: 'conforme', analyst: 'L. Torres', date: '2024-04-10', cert: 'ISO-2024-892' },
  { id: 'M-2024-0893', client: 'Shell México', type: 'Gasoline', parameter: 'Octane Number', value: '87.0', unit: 'RON', method: 'ASTM D2699', status: 'revision', analyst: 'M. García', date: '2024-04-09', cert: null },
  { id: 'M-2024-0894', client: 'Total Energies', type: 'Lubricant', parameter: 'Viscosity 40°C', value: '105.3', unit: 'cSt', method: 'ASTM D445', status: 'no_conforme', analyst: 'P. Ruiz', date: '2024-04-09', cert: null },
  { id: 'M-2024-0895', client: 'PEMEX Refinery', type: 'LPG', parameter: 'Vapor Pressure', value: '210.4', unit: 'kPa', method: 'ASTM D1267', status: 'conforme', analyst: 'R. Sánchez', date: '2024-04-08', cert: 'ISO-2024-895' },
  { id: 'M-2024-0896', client: 'ExxonMobil', type: 'Jet Fuel', parameter: 'Freeze Point', value: '-48.5', unit: '°C', method: 'ASTM D2386', status: 'pendiente', analyst: 'L. Torres', date: '2024-04-08', cert: null },
  { id: 'M-2024-0897', client: 'Repsol México', type: 'Asphalt', parameter: 'Penetration 25°C', value: '68', unit: '0.1mm', method: 'ASTM D5', status: 'conforme', analyst: 'M. García', date: '2024-04-07', cert: 'ISO-2024-897' },
  { id: 'M-2024-0898', client: 'Chevron', type: 'Crude Oil', parameter: 'Sulfur Content', value: '1.82', unit: '%m/m', method: 'ASTM D4294', status: 'revision', analyst: 'P. Ruiz', date: '2024-04-07', cert: null },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  conforme: { label: 'Conforme', color: '#34d399', bg: 'rgba(52,211,153,0.12)', icon: <CheckCircle2 size={13} /> },
  pendiente: { label: 'Pendiente', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', icon: <Clock size={13} /> },
  no_conforme: { label: 'No Conforme', color: '#f87171', bg: 'rgba(248,113,113,0.12)', icon: <XCircle size={13} /> },
  revision: { label: 'En Revisión', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', icon: <Eye size={13} /> },
};

const kpis = [
  { label: 'Muestras Hoy', value: 12, icon: <Beaker size={22} />, color: '#38bdf8' },
  { label: 'Conformes', value: 8, icon: <CheckCircle2 size={22} />, color: '#34d399' },
  { label: 'En Revisión', value: 3, icon: <Eye size={22} />, color: '#a78bfa' },
  { label: 'No Conformes', value: 1, icon: <XCircle size={22} />, color: '#f87171' },
];

export default function LimsDemoPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filtered = samples.filter((s) => {
    const matchSearch =
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.client.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'all' || s.status === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: 'Inter, sans-serif',
        padding: '0',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          padding: '0.85rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft size={16} />
            Volver al portafolio
          </Link>
          <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FlaskConical size={18} style={{ color: '#38bdf8' }} />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>PETROAADLAB · LIMS</span>
          </div>
          <span
            style={{
              padding: '0.15rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.7rem',
              fontWeight: 700,
              background: 'rgba(52,211,153,0.15)',
              color: '#34d399',
              border: '1px solid rgba(52,211,153,0.3)',
            }}
          >
            ISO/IEC 17025 Certificado
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: 'rgba(56,189,248,0.12)',
              color: '#38bdf8',
              border: '1px solid rgba(56,189,248,0.25)',
            }}
          >
            ⚠️ Demo Visual — Datos ficticios
          </span>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #38bdf8, #34d399)',
              border: 'none',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            Nueva Muestra
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        {/* Title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '0.3rem',
            }}
          >
            Dashboard de Análisis
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sistema de Gestión de Información de Laboratorio · Trazabilidad ISO/IEC 17025 · Abril 2024
          </p>
        </div>

        {/* KPIs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: 'var(--shadow)',
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '12px',
                  background: `${kpi.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: kpi.color,
                }}
              >
                {kpi.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: kpi.color,
                    lineHeight: 1,
                    marginBottom: '0.2rem',
                  }}
                >
                  {kpi.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{kpi.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & search */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1.25rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              borderRadius: '10px',
              padding: '0.55rem 0.9rem',
              flex: '1',
              minWidth: 220,
            }}
          >
            <Search size={15} style={{ color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar muestra, cliente, tipo..."
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.88rem',
                color: 'var(--text-primary)',
                width: '100%',
              }}
            />
          </div>
          {(['all', 'conforme', 'pendiente', 'revision', 'no_conforme'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: `1.5px solid ${activeFilter === f ? 'var(--accent)' : 'var(--border)'}`,
                background: activeFilter === f ? 'var(--accent-light)' : 'var(--bg-card)',
                color: activeFilter === f ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {f === 'all' ? 'Todos' : statusConfig[f]?.label ?? f}
            </button>
          ))}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1.5px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            <Download size={14} />
            Exportar
          </button>
        </div>

        {/* Table */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                {['ID Muestra', 'Cliente', 'Tipo', 'Parámetro', 'Resultado', 'Método', 'Analista', 'Fecha', 'Estado', 'Certificado'].map(
                  (th) => (
                    <th
                      key={th}
                      style={{
                        padding: '0.85rem 1rem',
                        textAlign: 'left',
                        color: 'var(--text-muted)',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {th}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const st = statusConfig[s.status];
                return (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'var(--bg-secondary)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'transparent')
                    }
                  >
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#38bdf8' }}>
                      {s.id}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-primary)' }}>{s.client}</td>
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>{s.type}</td>
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-primary)' }}>{s.parameter}</td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {s.value} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{s.unit}</span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                      {s.method}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>{s.analyst}</td>
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {s.date}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: st.bg,
                          color: st.color,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {st.icon}
                        {st.label}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      {s.cert ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.75rem',
                            color: '#34d399',
                            fontFamily: 'monospace',
                          }}
                        >
                          <FileText size={12} />
                          {s.cert}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem 1.25rem',
            background: 'rgba(56,189,248,0.05)',
            border: '1px solid rgba(56,189,248,0.15)',
            borderRadius: '10px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          🔬 <strong style={{ color: 'var(--text-secondary)' }}>PETROAADLAB LIMS v2.4</strong> — Sistema de Gestión de Información de Laboratorio certificado bajo{' '}
          <strong style={{ color: '#38bdf8' }}>ISO/IEC 17025:2017</strong>. Todos los análisis cuentan con trazabilidad completa, cadena de custodia y certificados de calibración. <em>Demo visual — datos ficticios.</em>
        </div>
      </div>
    </div>
  );
}
