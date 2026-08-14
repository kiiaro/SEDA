import React from 'react'
import { P, Screen, Appointment, ThemeColors } from '../../types/figma'
import { HealthRing, StatusBadge } from './CommonComponents'
import { Phone, Bell, Calendar } from 'lucide-react'
import { AreaChart, Area, XAxis, ResponsiveContainer } from 'recharts'

const pressureData = [
  { day: 'Seg', sys: 130, dia: 85 },
  { day: 'Ter', sys: 125, dia: 80 },
  { day: 'Qua', sys: 140, dia: 90 },
  { day: 'Qui', sys: 128, dia: 82 },
  { day: 'Sex', sys: 122, dia: 78 },
  { day: 'Sáb', sys: 135, dia: 88 },
  { day: 'Dom', sys: 120, dia: 76 },
]

export function HomeScreen({
  dm,
  fs,
  go,
  appointments,
  pressSys,
  pressDia,
  glucose,
}: {
  dm: ThemeColors
  fs: (n: number) => number
  go: (s: Screen) => void
  appointments: Appointment[]
  pressSys: number
  pressDia: number
  glucose: number
}) {
  const hr = new Date().getHours()
  const greeting = hr < 12 ? 'Bom dia' : hr < 18 ? 'Boa tarde' : 'Boa noite'
  const sysStatus = pressSys >= 140 ? 'alert' : pressSys >= 130 ? 'attention' : 'normal'
  const glcStatus = glucose > 126 ? 'alert' : glucose < 70 ? 'attention' : 'normal'

  const next = appointments
    .filter((a) => a.status !== 'cancelled' && a.status !== 'completed')
    .sort((a, b) => a.date.localeCompare(b.date))[0]
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysUntil = next
    ? Math.round((new Date(next.date + 'T00:00:00').getTime() - today.getTime()) / 86400000)
    : null

  return (
    <div style={{ background: dm.bg, minHeight: '100%' }}>
      {/* Gradient header */}
      <div
        style={{
          background: `linear-gradient(160deg, ${P.primaryDk} 0%, ${P.primary} 60%, ${P.secondary} 100%)`,
          padding: '16px 20px 28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: 20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(124,201,190,0.15)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <div>
            <div style={{ fontSize: fs(13), color: 'rgba(255,255,255,0.72)', fontWeight: 500 }}>{greeting},</div>
            <div style={{ fontSize: fs(22), fontWeight: 800, color: '#fff', marginTop: 2 }}>João! 👋</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => go('emergency')}
              className="btn-press"
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                background: '#E4545430',
                border: '1.5px solid #E4545460',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Phone size={18} color="#fff" />
            </button>
            <button
              onClick={() => go('alerts')}
              className="btn-press"
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                background: 'rgba(255,255,255,0.15)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Bell size={18} color="#fff" />
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: P.danger,
                  border: '2px solid transparent',
                }}
              />
            </button>
          </div>
        </div>

        {/* Vitals summary strip */}
        <div
          style={{
            marginTop: 18,
            background: 'rgba(255,255,255,0.14)',
            borderRadius: 18,
            padding: '14px 16px',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.22)',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: fs(10),
              color: 'rgba(255,255,255,0.65)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: 10,
            }}
          >
            Resumo de Hoje — 20 Jul 2026
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: '❤️ Pressão', val: `${pressSys}/${pressDia}`, unit: 'mmHg', ok: sysStatus === 'normal' },
              { label: '🩸 Glicemia', val: `${glucose}`, unit: 'mg/dL', ok: glcStatus === 'normal' },
              { label: '💊 Medicação', val: '08:00', unit: 'tomada', ok: true },
            ].map((v) => (
              <div key={v.label} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '8px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: fs(9), color: 'rgba(255,255,255,0.65)', marginBottom: 3 }}>{v.label}</div>
                <div style={{ fontSize: fs(15), fontWeight: 800, color: '#fff' }}>{v.val}</div>
                <div style={{ fontSize: fs(9), color: v.ok ? '#7CC9BE' : '#F4B740', fontWeight: 600, marginTop: 1 }}>
                  {v.ok ? '✓' : ''} {v.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 14px 20px', marginTop: -12 }}>
        {/* Quick actions grid */}
        <div style={{ background: dm.card, borderRadius: 22, padding: '18px 14px', boxShadow: '0 4px 24px rgba(94,143,192,0.1)', marginBottom: 14 }}>
          <div style={{ fontSize: fs(14), fontWeight: 700, color: dm.text, marginBottom: 14, paddingLeft: 2 }}>Ações Rápidas</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { icon: '❤️', label: 'Pressão', screen: 'pressure', bg: '#FEE8E8', accent: P.danger },
              { icon: '🩸', label: 'Glicemia', screen: 'glucose', bg: '#FEF3E0', accent: P.warn },
              { icon: '🎤', label: 'Por Voz', screen: 'voice', bg: P.bgAlt, accent: P.purple },
              { icon: '📊', label: 'Dashboard', screen: 'dashboard', bg: '#EEF8F4', accent: P.accent },
              { icon: '👨‍👩‍👧', label: 'Família', screen: 'network', bg: `${P.secondary}18`, accent: P.secondary },
              { icon: '📅', label: 'Consultas', screen: 'appointments', bg: `${P.primary}10`, accent: P.primary },
            ].map((c) => (
              <button
                key={c.screen}
                onClick={() => go(c.screen as Screen)}
                className="btn-press card-hover"
                style={{
                  background: c.bg,
                  borderRadius: 16,
                  padding: '14px 6px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 7,
                  boxShadow: `0 2px 8px ${c.accent}18`,
                }}
              >
                <span style={{ fontSize: 26 }}>{c.icon}</span>
                <span style={{ fontSize: fs(11), fontWeight: 700, color: c.accent }}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Health rings */}
        <div style={{ background: dm.card, borderRadius: 22, padding: '18px 16px', boxShadow: '0 4px 24px rgba(94,143,192,0.08)', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: fs(14), fontWeight: 700, color: dm.text }}>Indicadores de Saúde</div>
            <StatusBadge status={sysStatus === 'normal' && glcStatus === 'normal' ? 'normal' : 'attention'} />
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'space-around' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <HealthRing
                value={pressSys}
                max={180}
                color={sysStatus === 'normal' ? P.success : sysStatus === 'attention' ? P.warn : P.danger}
                size={90}
                label="Sistólica"
                unit="mmHg"
              />
              <span style={{ fontSize: fs(12), color: dm.sub, fontWeight: 600 }}>❤️ Sistólica</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <HealthRing
                value={glucose}
                max={200}
                color={glcStatus === 'normal' ? P.accent : glcStatus === 'attention' ? P.warn : P.danger}
                size={90}
                label="Glicemia"
                unit="mg/dL"
              />
              <span style={{ fontSize: fs(12), color: dm.sub, fontWeight: 600 }}>🩸 Glicemia</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <HealthRing value={72} max={120} color={P.secondary} size={90} label="BPM" unit="bpm" />
              <span style={{ fontSize: fs(12), color: dm.sub, fontWeight: 600 }}>💓 Batimentos</span>
            </div>
          </div>
        </div>

        {/* Next appointment */}
        {next && (
          <button
            onClick={() => go('appointments')}
            className="btn-press card-hover"
            style={{
              width: '100%',
              background: dm.card,
              borderRadius: 20,
              padding: '16px',
              boxShadow: '0 4px 24px rgba(94,143,192,0.08)',
              border: `1px solid ${P.border}`,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'block',
              marginBottom: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: `${P.primary}14`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Calendar size={24} color={P.primary} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: fs(11), color: dm.sub, fontWeight: 600 }}>Próxima consulta</div>
                <div style={{ fontSize: fs(14), fontWeight: 700, color: dm.text, marginTop: 2 }}>{next.doctor}</div>
                <div style={{ fontSize: fs(11), color: dm.sub, marginTop: 1 }}>
                  {daysUntil === 0 ? 'Hoje' : daysUntil === 1 ? 'Amanhã' : `Em ${daysUntil} dias`} — {next.time} • {next.location}
                </div>
              </div>
              <div style={{ background: `${P.primary}14`, borderRadius: 10, padding: '6px 12px' }}>
                <span style={{ fontSize: fs(11), fontWeight: 700, color: P.primary }}>
                  {daysUntil === 0 ? 'Hoje' : daysUntil === 1 ? 'Amanhã' : `${daysUntil}d`}
                </span>
              </div>
            </div>
          </button>
        )}

        {/* Mini area chart */}
        <div style={{ background: dm.card, borderRadius: 20, padding: '16px', boxShadow: '0 4px 24px rgba(94,143,192,0.08)', border: `1px solid ${P.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: fs(13), fontWeight: 700, color: dm.text }}>Pressão — 7 dias</div>
            <button onClick={() => go('dashboard')} style={{ fontSize: fs(12), color: P.primary, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
              Ver mais →
            </button>
          </div>
          <ResponsiveContainer width="100%" height={72}>
            <AreaChart data={pressureData}>
              <defs>
                <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={P.primary} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={P.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="sys" stroke={P.primary} fill="url(#hg)" strokeWidth={2.5} dot={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
