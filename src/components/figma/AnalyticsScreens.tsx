import React, { useState } from 'react'
import { P, ThemeColors, HealthRecord } from '../../types/figma'
import { StatusBadge, sColor } from './CommonComponents'
import { Filter, Clock, TrendingUp, TrendingDown, Check, AlertTriangle, Trash2, Share2, Sparkles } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function HistoryScreen({
  dm,
  fs,
  filter,
  setFilter,
  records,
  onDeleteRecord,
  onExport,
}: {
  dm: ThemeColors
  fs: (n: number) => number
  filter: string
  setFilter: (f: string) => void
  records: HealthRecord[]
  onDeleteRecord: (id: number) => void
  onExport: () => void
}) {
  const [typeFilter, setTypeFilter] = useState<'all' | 'pressure' | 'glucose'>('all')

  const filtered = records.filter((r) => {
    if (typeFilter === 'pressure') return r.sys > 0
    if (typeFilter === 'glucose') return r.glucose > 0
    return true
  })

  return (
    <div style={{ background: dm.bg, minHeight: '100%', paddingBottom: 24 }}>
      <div style={{ background: `linear-gradient(135deg,${P.primaryDk},${P.primary})`, padding: '18px 20px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: fs(20), fontWeight: 800, color: '#fff' }}>📋 Histórico</div>
            <div style={{ fontSize: fs(13), color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>
              {records.length} registro{records.length !== 1 ? 's' : ''} sincronizado{records.length !== 1 ? 's' : ''}
            </div>
          </div>
          <button
            onClick={onExport}
            className="btn-press"
            style={{
              padding: '8px 14px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              fontSize: fs(12),
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Share2 size={14} /> Exportar
          </button>
        </div>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* Type filter pills */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {[
            { id: 'all', l: 'Todos' },
            { id: 'pressure', l: '❤️ Pressão' },
            { id: 'glucose', l: '🩸 Glicemia' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id as any)}
              className="btn-press"
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: 12,
                border: `2px solid ${typeFilter === t.id ? P.primary : dm.border}`,
                background: typeFilter === t.id ? `${P.primary}15` : dm.card,
                color: typeFilter === t.id ? P.primary : dm.sub,
                fontSize: fs(11),
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {t.l}
            </button>
          ))}
        </div>

        {/* Period filter pills */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, alignItems: 'center' }}>
          <Filter size={14} color={dm.sub} />
          {['7d', '15d', '30d', '3m'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="btn-press"
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                border: `1.5px solid ${filter === f ? P.primary : 'transparent'}`,
                background: filter === f ? `${P.primary}14` : dm.card,
                color: filter === f ? P.primary : dm.sub,
                fontSize: fs(11),
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {f === '7d' ? '7 dias' : f === '15d' ? '15 dias' : f === '30d' ? '30 dias' : '3 meses'}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: dm.sub }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📝</div>
            <div style={{ fontSize: fs(15), fontWeight: 700, color: dm.text }}>Nenhum registro encontrado</div>
            <div style={{ fontSize: fs(12), marginTop: 4 }}>Adicione medições de pressão ou glicemia.</div>
          </div>
        )}

        {filtered.map((r, i) => (
          <div
            key={r.id}
            style={{
              background: dm.card,
              borderRadius: 18,
              padding: '14px 16px',
              marginBottom: 10,
              boxShadow: '0 2px 12px rgba(94,143,192,0.07)',
              border: `1px solid ${dm.border}`,
              animation: `float-up 0.35s ease ${i * 0.04}s both`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: fs(14), fontWeight: 700, color: dm.text }}>{r.date}</div>
                <div style={{ fontSize: fs(12), color: dm.sub, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Clock size={12} /> {r.time}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StatusBadge status={r.status} />
                <button
                  onClick={() => onDeleteRecord(r.id)}
                  title="Excluir medição"
                  className="btn-press"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {r.sys > 0 && (
                <div style={{ flex: 1, background: `${P.primary}12`, borderRadius: 12, padding: '10px 4px', textAlign: 'center' }}>
                  <div style={{ fontSize: fs(9), color: P.primary, fontWeight: 700, marginBottom: 3 }}>❤️ PRESSÃO</div>
                  <div style={{ fontSize: fs(15), fontWeight: 800, color: P.primary }}>
                    {r.sys}/{r.dia}
                  </div>
                  <div style={{ fontSize: fs(9), color: P.primary, opacity: 0.7 }}>mmHg</div>
                </div>
              )}
              {r.glucose > 0 && (
                <div style={{ flex: 1, background: `${P.warn}12`, borderRadius: 12, padding: '10px 4px', textAlign: 'center' }}>
                  <div style={{ fontSize: fs(9), color: P.warn, fontWeight: 700, marginBottom: 3 }}>🩸 GLICEMIA</div>
                  <div style={{ fontSize: fs(15), fontWeight: 800, color: P.warn }}>{r.glucose}</div>
                  <div style={{ fontSize: fs(9), color: P.warn, opacity: 0.7 }}>mg/dL</div>
                </div>
              )}
              {r.hr > 0 && (
                <div style={{ flex: 1, background: `${P.success}12`, borderRadius: 12, padding: '10px 4px', textAlign: 'center' }}>
                  <div style={{ fontSize: fs(9), color: P.success, fontWeight: 700, marginBottom: 3 }}>💓 BPM</div>
                  <div style={{ fontSize: fs(15), fontWeight: 800, color: P.success }}>{r.hr}</div>
                  <div style={{ fontSize: fs(9), color: P.success, opacity: 0.7 }}>bpm</div>
                </div>
              )}
            </div>

            {r.notes && (
              <div style={{ marginTop: 10, background: dm.bg, borderRadius: 10, padding: '6px 10px', fontSize: fs(11), color: dm.sub }}>
                📝 {r.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardScreen({
  dm,
  fs,
  records,
}: {
  dm: ThemeColors
  fs: (n: number) => number
  records: HealthRecord[]
}) {
  const [tab, setTab] = useState<'pressure' | 'glucose' | 'freq'>('pressure')

  // Calculate dynamic averages
  const pressureRecords = records.filter((r) => r.sys > 0)
  const glucoseRecords = records.filter((r) => r.glucose > 0)

  const avgSys = pressureRecords.length ? Math.round(pressureRecords.reduce((a, b) => a + b.sys, 0) / pressureRecords.length) : 120
  const avgDia = pressureRecords.length ? Math.round(pressureRecords.reduce((a, b) => a + b.dia, 0) / pressureRecords.length) : 80
  const avgGluc = glucoseRecords.length ? Math.round(glucoseRecords.reduce((a, b) => a + b.glucose, 0) / glucoseRecords.length) : 110

  const chartData = records.slice(0, 7).reverse().map((r, i) => ({
    day: r.date.split(' ')[0] || `D${i + 1}`,
    sys: r.sys,
    dia: r.dia,
    glucose: r.glucose,
    hr: r.hr,
  }))

  return (
    <div style={{ background: dm.bg, minHeight: '100%', paddingBottom: 24 }}>
      <div style={{ background: `linear-gradient(135deg,${P.primaryDk},${P.primary} 60%,${P.secondary})`, padding: '18px 20px 22px' }}>
        <div style={{ fontSize: fs(20), fontWeight: 800, color: '#fff' }}>📊 Dashboard</div>
        <div style={{ fontSize: fs(13), color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>Evolução clínica e tendências</div>
      </div>
      <div style={{ padding: 16 }}>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            { label: '❤️ Média Sist.', val: `${avgSys} mmHg`, sub2: avgSys < 130 ? 'Controlada' : 'Atenção', c: P.primary, bg: `${P.primary}12`, Icon: avgSys < 130 ? TrendingDown : TrendingUp },
            { label: '🩸 Média Glic.', val: `${avgGluc} mg/dL`, sub2: avgGluc <= 126 ? 'Normal' : 'Elevada', c: P.accent, bg: `${P.accent}12`, Icon: avgGluc <= 126 ? TrendingDown : TrendingUp },
            { label: '📈 Registros', val: `${records.length}`, sub2: 'no total', c: P.purple, bg: `${P.purple}12`, Icon: Sparkles },
          ].map((k) => (
            <div key={k.label} style={{ background: k.bg, borderRadius: 16, padding: '12px 10px' }}>
              <div style={{ fontSize: fs(9), color: k.c, fontWeight: 700, marginBottom: 5 }}>{k.label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                <k.Icon size={13} color={k.c} />
                <span style={{ fontSize: fs(12), fontWeight: 800, color: k.c }}>{k.val}</span>
              </div>
              <div style={{ fontSize: fs(10), color: k.c, opacity: 0.7 }}>{k.sub2}</div>
            </div>
          ))}
        </div>

        {/* Tab toggle */}
        <div style={{ background: dm.card, borderRadius: 16, padding: 5, display: 'flex', gap: 4, marginBottom: 14, boxShadow: '0 2px 12px rgba(94,143,192,0.08)' }}>
          {[
            { id: 'pressure', l: 'Pressão' },
            { id: 'glucose', l: 'Glicemia' },
            { id: 'freq', l: 'Frequência' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 12,
                border: 'none',
                background: tab === t.id ? P.primary : 'transparent',
                color: tab === t.id ? '#fff' : dm.sub,
                fontSize: fs(12),
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.25s',
              }}
            >
              {t.l}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div style={{ background: dm.card, borderRadius: 20, padding: '16px', boxShadow: '0 4px 24px rgba(94,143,192,0.08)', marginBottom: 14 }}>
          {tab === 'pressure' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, alignItems: 'center' }}>
                <div style={{ fontSize: fs(14), fontWeight: 700, color: dm.text }}>Pressão Arterial (mmHg)</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { c: P.primary, l: 'Sistólica' },
                    { c: P.secondary, l: 'Diastólica' },
                  ].map((x) => (
                    <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 10, height: 3, borderRadius: 2, background: x.c }} />
                      <span style={{ fontSize: 10, color: dm.sub }}>{x.l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dm.border} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[50, 170]} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }} />
                  <Line type="monotone" dataKey="sys" stroke={P.primary} strokeWidth={2.5} dot={{ r: 4, fill: P.primary }} name="Sistólica" />
                  <Line type="monotone" dataKey="dia" stroke={P.secondary} strokeWidth={2.5} dot={{ r: 4, fill: P.secondary }} name="Diastólica" />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
          {tab === 'glucose' && (
            <>
              <div style={{ fontSize: fs(14), fontWeight: 700, color: dm.text, marginBottom: 14 }}>Glicemia (mg/dL)</div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="dgg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={P.warn} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={P.warn} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={dm.border} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[60, 200]} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }} />
                  <Area type="monotone" dataKey="glucose" stroke={P.warn} fill="url(#dgg)" strokeWidth={2.5} dot={{ r: 4, fill: P.warn }} name="mg/dL" />
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}
          {tab === 'freq' && (
            <>
              <div style={{ fontSize: fs(14), fontWeight: 700, color: dm.text, marginBottom: 14 }}>Frequência Cardíaca (BPM)</div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dm.border} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[50, 120]} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }} />
                  <Line type="monotone" dataKey="hr" stroke={P.purple} strokeWidth={2.5} dot={{ r: 4, fill: P.purple }} name="BPM" />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </div>

        {/* Summary stats */}
        <div style={{ background: dm.card, borderRadius: 20, padding: '16px', boxShadow: '0 4px 24px rgba(94,143,192,0.08)' }}>
          <div style={{ fontSize: fs(13), fontWeight: 700, color: dm.text, marginBottom: 14 }}>Resumo Semanal & Metas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Média sistólica', val: `${avgSys} mmHg`, ok: avgSys <= 130 },
              { label: 'Média diastólica', val: `${avgDia} mmHg`, ok: avgDia <= 85 },
              { label: 'Média glicemia', val: `${avgGluc} mg/dL`, ok: avgGluc <= 126 },
              { label: 'Frequência de registros', val: `${records.length} medições`, ok: records.length >= 3 },
            ].map((s) => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: `1px solid ${dm.border}` }}>
                <span style={{ fontSize: fs(13), color: dm.sub }}>{s.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: fs(13), fontWeight: 700, color: dm.text }}>{s.val}</span>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: s.ok ? `${P.success}20` : `${P.warn}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {s.ok ? <Check size={12} color={P.success} /> : <AlertTriangle size={12} color={P.warn} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AlertsScreen({
  dm,
  fs,
  alerts,
  onDismissAlert,
  onTakeAction,
}: {
  dm: ThemeColors
  fs: (n: number) => number
  alerts: Array<{ id: number; icon: string; title: string; desc: string; time: string; color: string; actionType?: string }>
  onDismissAlert: (id: number) => void
  onTakeAction: (actionType?: string) => void
}) {
  return (
    <div style={{ background: dm.bg, minHeight: '100%', paddingBottom: 24 }}>
      <div style={{ background: `linear-gradient(135deg,${P.danger},#C43C3C)`, padding: '18px 20px 22px' }}>
        <div style={{ fontSize: fs(20), fontWeight: 800, color: '#fff' }}>🔔 Alertas Clínicos</div>
        <div style={{ fontSize: fs(13), color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>
          {alerts.length} notificaç{alerts.length !== 1 ? 'ões' : 'ão'} ativa{alerts.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: dm.sub }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            <div style={{ fontSize: fs(16), fontWeight: 700, color: dm.text }}>Tudo sob controle!</div>
            <div style={{ fontSize: fs(12), marginTop: 4 }}>Não há alertas pendentes no momento.</div>
          </div>
        ) : (
          alerts.map((a, i) => (
            <div
              key={a.id}
              style={{
                background: dm.card,
                borderRadius: 18,
                padding: '14px 16px',
                boxShadow: '0 2px 12px rgba(94,143,192,0.07)',
                borderLeft: `5px solid ${a.color}`,
                animation: `float-up 0.4s ease ${i * 0.05}s both`,
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: a.color + '18',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {a.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ fontSize: fs(14), fontWeight: 700, color: dm.text, lineHeight: 1.3 }}>{a.title}</div>
                    <span style={{ fontSize: fs(10), color: dm.sub, flexShrink: 0, background: dm.bg, padding: '3px 8px', borderRadius: 20 }}>{a.time}</span>
                  </div>
                  <div style={{ fontSize: fs(12), color: dm.sub, marginTop: 4, lineHeight: 1.45 }}>{a.desc}</div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    {a.actionType && (
                      <button
                        onClick={() => onTakeAction(a.actionType)}
                        className="btn-press"
                        style={{
                          padding: '6px 12px',
                          borderRadius: 10,
                          background: a.color + '18',
                          color: a.color,
                          border: `1px solid ${a.color}35`,
                          fontSize: fs(11),
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        Ver ação →
                      </button>
                    )}
                    <button
                      onClick={() => onDismissAlert(a.id)}
                      className="btn-press"
                      style={{
                        padding: '6px 10px',
                        borderRadius: 10,
                        background: 'transparent',
                        color: dm.sub,
                        border: `1px solid ${dm.border}`,
                        fontSize: fs(11),
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Dispensar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
