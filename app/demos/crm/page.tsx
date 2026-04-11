'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Users, MapPin, TrendingUp, Phone, Mail,
  Building2, CheckCircle2, Clock, AlertCircle, Filter,
  Map, List, Search, Star, ChevronRight
} from 'lucide-react';

const clients = [
  { id: 'C-001', name: 'PEMEX Refinería Tula', sector: 'Petroquímica', contact: 'Ing. R. Morales', phone: '+52 773 XXX XXXX', city: 'Tula, Hidalgo', zone: 'Centro-Norte', lat: 20.05, lng: -99.34, status: 'activo', revenue: '$280,000', lastVisit: '2024-04-08', priority: 'alta', visits: 12 },
  { id: 'C-002', name: 'Petrobras México', sector: 'Petroquímica', contact: 'Lic. A. Santos', phone: '+52 55 XXX XXXX', city: 'CDMX', zone: 'Centro', lat: 19.43, lng: -99.13, status: 'activo', revenue: '$195,000', lastVisit: '2024-04-05', priority: 'alta', visits: 9 },
  { id: 'C-003', name: 'Shell México Sureste', sector: 'Refinación', contact: 'Dr. P. Gómez', phone: '+52 938 XXX XXXX', city: 'Villahermosa', zone: 'Sur', lat: 17.99, lng: -92.93, status: 'activo', revenue: '$142,000', lastVisit: '2024-03-28', priority: 'media', visits: 6 },
  { id: 'C-004', name: 'Total Energies Veracruz', sector: 'Refinación', contact: 'Ing. C. Pérez', phone: '+52 229 XXX XXXX', city: 'Veracruz', zone: 'Este', lat: 19.17, lng: -96.13, status: 'seguimiento', revenue: '$87,000', lastVisit: '2024-03-20', priority: 'media', visits: 4 },
  { id: 'C-005', name: 'ExxonMobil Guadalajara', sector: 'Lubricantes', contact: 'Lic. M. Reyes', phone: '+52 33 XXX XXXX', city: 'Guadalajara', zone: 'Occidente', lat: 20.66, lng: -103.35, status: 'activo', revenue: '$210,000', lastVisit: '2024-04-03', priority: 'alta', visits: 11 },
  { id: 'C-006', name: 'Repsol México Norte', sector: 'Gas Natural', contact: 'Dr. J. López', phone: '+52 614 XXX XXXX', city: 'Chihuahua', zone: 'Norte', lat: 28.63, lng: -106.08, status: 'inactivo', revenue: '$45,000', lastVisit: '2024-02-14', priority: 'baja', visits: 2 },
  { id: 'C-007', name: 'Chevron Monterrey', sector: 'Lubricantes', contact: 'Ing. F. Castro', phone: '+52 81 XXX XXXX', city: 'Monterrey', zone: 'Norte', lat: 25.67, lng: -100.31, status: 'activo', revenue: '$165,000', lastVisit: '2024-04-07', priority: 'alta', visits: 8 },
  { id: 'C-008', name: 'Cenagas Puebla', sector: 'Gas Natural', contact: 'Lic. V. Hernández', phone: '+52 222 XXX XXXX', city: 'Puebla', zone: 'Centro', lat: 19.04, lng: -98.19, status: 'activo', revenue: '$98,000', lastVisit: '2024-04-09', priority: 'media', visits: 7 },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  activo: { label: 'Activo', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  seguimiento: { label: 'Seguimiento', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  inactivo: { label: 'Inactivo', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
};

const priorityColor: Record<string, string> = {
  alta: '#f87171',
  media: '#fbbf24',
  baja: '#94a3b8',
};

const zones = ['Todos', 'Centro', 'Centro-Norte', 'Norte', 'Sur', 'Este', 'Occidente'];

const kpis = [
  { label: 'Total Clientes', value: 8, icon: <Users size={20} />, color: '#38bdf8' },
  { label: 'Activos', value: 6, icon: <CheckCircle2 size={20} />, color: '#34d399' },
  { label: 'En Seguimiento', value: 1, icon: <Clock size={20} />, color: '#fbbf24' },
  { label: 'Zonas Cubiertas', value: 6, icon: <MapPin size={20} />, color: '#a78bfa' },
];

// Simple SVG map of Mexico with dots
const mexicoZones = [
  { name: 'CDMX', x: 235, y: 195, clients: ['C-002', 'C-008'] },
  { name: 'Tula', x: 228, y: 178, clients: ['C-001'] },
  { name: 'Guadalajara', x: 165, y: 190, clients: ['C-005'] },
  { name: 'Monterrey', x: 213, y: 130, clients: ['C-007'] },
  { name: 'Chihuahua', x: 148, y: 90, clients: ['C-006'] },
  { name: 'Veracruz', x: 262, y: 200, clients: ['C-004'] },
  { name: 'Villahermosa', x: 275, y: 225, clients: ['C-003'] },
  { name: 'Puebla', x: 245, y: 205, clients: ['C-008'] },
];

export default function CrmDemoPage() {
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('Todos');
  const [view, setView] = useState<'list' | 'map'>('list');
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q);
    const matchZone = zoneFilter === 'Todos' || c.zone === zoneFilter;
    return matchSearch && matchZone;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} />
            Volver al portafolio
          </Link>
          <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} style={{ color: '#a78bfa' }} />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>PETROAADLAB · CRM Comercial</span>
          </div>
        </div>
        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, background: 'rgba(56,189,248,0.12)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.25)' }}>
          ⚠️ Demo Visual — Datos ficticios
        </span>
      </div>

      <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.3rem' }}>Gestión de Clientes</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>CRM con Geolocalización · Optimización de recursos comerciales · PETROAADLAB</p>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {kpis.map((kpi) => (
            <div key={kpi.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 42, height: 42, borderRadius: '11px', background: `${kpi.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}>
                {kpi.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{kpi.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedClient ? '1fr 340px' : '1fr', gap: '1.5rem' }}>
          <div>
            {/* Controls */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '0.55rem 0.9rem', flex: 1, minWidth: 200 }}>
                <Search size={15} style={{ color: 'var(--text-muted)' }} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente, ciudad, sector..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem', color: 'var(--text-primary)', width: '100%' }} />
              </div>
              <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}
                style={{ padding: '0.55rem 0.9rem', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}>
                {zones.map((z) => <option key={z} value={z}>{z === 'Todos' ? 'Todas las zonas' : `Zona ${z}`}</option>)}
              </select>
              {/* View toggle */}
              <div style={{ display: 'flex', border: '1.5px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                {([['list', <List size={15} />, 'Lista'], ['map', <Map size={15} />, 'Mapa']] as const).map(([v, icon, label]) => (
                  <button key={v} onClick={() => setView(v as 'list' | 'map')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.9rem', border: 'none', background: view === v ? 'var(--accent-light)' : 'var(--bg-card)', color: view === v ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                    {icon}{label}
                  </button>
                ))}
              </div>
            </div>

            {/* Map view */}
            {view === 'map' ? (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem', minHeight: 400 }}>
                <div style={{ marginBottom: '1rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Map size={16} style={{ color: '#a78bfa' }} />
                  Distribución geográfica de clientes — México
                </div>
                <svg viewBox="0 0 400 300" style={{ width: '100%', maxHeight: 380, borderRadius: 10, background: 'var(--bg-secondary)' }}>
                  {/* Simple Mexico outline shape (approximate) */}
                  <path d="M 80 80 L 100 60 L 140 55 L 180 50 L 230 45 L 290 50 L 330 65 L 350 90 L 340 115 L 320 130 L 310 150 L 295 170 L 280 190 L 265 210 L 260 230 L 255 250 L 245 260 L 235 255 L 220 245 L 200 240 L 190 250 L 175 255 L 160 245 L 140 230 L 120 210 L 100 195 L 85 180 L 70 160 L 65 130 L 70 100 Z"
                    fill="rgba(56,189,248,0.04)" stroke="rgba(56,189,248,0.2)" strokeWidth="1.5" />
                  {/* Client dots */}
                  {mexicoZones.map((zone) => {
                    const hasActive = zone.clients.some(cid => clients.find(c => c.id === cid)?.status === 'activo');
                    return (
                      <g key={zone.name}>
                        <circle cx={zone.x} cy={zone.y} r={10} fill={hasActive ? 'rgba(56,189,248,0.15)' : 'rgba(148,163,184,0.1)'} />
                        <circle cx={zone.x} cy={zone.y} r={5} fill={hasActive ? '#38bdf8' : '#94a3b8'} />
                        <text x={zone.x + 8} y={zone.y + 4} fill="var(--text-muted)" fontSize="7" fontFamily="Inter">{zone.name}</text>
                      </g>
                    );
                  })}
                  {/* Legend */}
                  <circle cx={20} cy={275} r={4} fill="#38bdf8" />
                  <text x={28} y={279} fill="var(--text-muted)" fontSize="7" fontFamily="Inter">Cliente activo</text>
                  <circle cx={100} cy={275} r={4} fill="#94a3b8" />
                  <text x={108} y={279} fill="var(--text-muted)" fontSize="7" fontFamily="Inter">Inactivo</text>
                </svg>
                <p style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Mapa esquemático — En producción se usa integración con Leaflet.js / Google Maps API
                </p>
              </div>
            ) : (
              /* List view */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filtered.map((client) => {
                  const st = statusConfig[client.status];
                  return (
                    <div key={client.id}
                      onClick={() => setSelectedClient(selectedClient?.id === client.id ? null : client)}
                      style={{ background: 'var(--bg-card)', border: `1.5px solid ${selectedClient?.id === client.id ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '12px', padding: '1rem 1.25rem', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '1rem' }}
                      onMouseEnter={(e) => { if (selectedClient?.id !== client.id) e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                      onMouseLeave={(e) => { if (selectedClient?.id !== client.id) e.currentTarget.style.borderColor = 'var(--border)'; }}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: '11px', background: `${priorityColor[client.priority]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: priorityColor[client.priority], flexShrink: 0 }}>
                        <Building2 size={20} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{client.name}</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.12rem 0.5rem', borderRadius: '999px', background: st.bg, color: st.color }}>{st.label}</span>
                          {client.priority === 'alta' && <Star size={12} style={{ color: '#fbbf24', fill: '#fbbf24' }} />}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={11} />{client.city}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{client.sector}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Última visita: {client.lastVisit}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#34d399' }}>{client.revenue}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{client.visits} visitas</div>
                      </div>
                      <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selectedClient && (
            <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--accent)', borderRadius: '14px', padding: '1.5rem', alignSelf: 'start', position: 'sticky', top: 80 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{selectedClient.name}</h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{selectedClient.id}</span>
                </div>
                <button onClick={() => setSelectedClient(null)} style={{ border: 'none', background: 'var(--border)', borderRadius: '6px', width: 26, height: 26, cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }}>×</button>
              </div>
              {[
                { icon: <Building2 size={14} />, label: 'Sector', value: selectedClient.sector },
                { icon: <MapPin size={14} />, label: 'Ciudad', value: selectedClient.city },
                { icon: <Filter size={14} />, label: 'Zona', value: selectedClient.zone },
                { icon: <Users size={14} />, label: 'Contacto', value: selectedClient.contact },
                { icon: <Phone size={14} />, label: 'Teléfono', value: selectedClient.phone },
                { icon: <TrendingUp size={14} />, label: 'Revenue', value: selectedClient.revenue },
                { icon: <CheckCircle2 size={14} />, label: 'Visitas', value: `${selectedClient.visits} realizadas` },
                { icon: <Clock size={14} />, label: 'Última visita', value: selectedClient.lastVisit },
              ].map((row) => (
                <div key={row.label} style={{ display: 'flex', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--accent)', marginTop: '1px', flexShrink: 0 }}>{row.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{row.label}</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600 }}>{row.value}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button style={{ padding: '0.65rem', borderRadius: '8px', background: 'linear-gradient(135deg, #38bdf8, #34d399)', border: 'none', color: 'white', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  Programar Visita
                </button>
                <button style={{ padding: '0.65rem', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                  Ver Historial
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
