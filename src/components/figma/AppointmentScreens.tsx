import React, { useState, useEffect } from 'react'
import { P, Screen, Appointment, AppointmentStatus, AppointmentType, ThemeColors } from '../../types/figma'
import { BackHeader } from './CommonComponents'
import {
  Calendar,
  Clock,
  Building2,
  User,
  Video,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Hourglass,
  Trash2,
  Plus,
  MapPin,
  AlertTriangle,
  Check,
  Phone,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Navigation,
  MessageSquare,
  X,
  Send,
} from 'lucide-react'

const specialties = [
  'Clínica Geral',
  'Cardiologia',
  'Endocrinologia',
  'Nefrologia',
  'Oftalmologia',
  'Neurologia',
  'Nutrição',
  'Fisioterapia',
]

const locations = [
  'UBS Jardim das Flores — R. das Rosas, 120',
  'UBS Centro — Av. da Saudade, 450',
  'UBS Vila Nova — R. Amazonas, 89',
  'UBS Parque das Árvores — Alameda Verde, 33',
  'Teleconsulta — App SEDA',
]

export function AppointmentsScreen({
  dm,
  fs,
  go,
  appointments,
  setAppts,
  onShowToast,
}: {
  dm: ThemeColors
  fs: (n: number) => number
  go: (s: Screen) => void
  appointments: Appointment[]
  setAppts: React.Dispatch<React.SetStateAction<Appointment[]>>
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'error' | 'info') => void
}) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [cancelId, setCancelId] = useState<number | null>(null)
  const [activeTeleconsulta, setActiveTeleconsulta] = useState<Appointment | null>(null)
  const [activeLocationModal, setActiveLocationModal] = useState<Appointment | null>(null)

  // Teleconsulta state
  const [callSeconds, setCallSeconds] = useState(0)
  const [micMuted, setMicMuted] = useState(false)
  const [camOff, setCamOff] = useState(false)
  const [teleChat, setTeleChat] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'Dr. Paulo', text: 'Olá João! Consegue me ouvir bem?' },
  ])
  const [teleInput, setTeleInput] = useState('')

  useEffect(() => {
    let t: any
    if (activeTeleconsulta) {
      t = setInterval(() => setCallSeconds((s) => s + 1), 1000)
    } else {
      setCallSeconds(0)
    }
    return () => clearInterval(t)
  }, [activeTeleconsulta])

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = appointments
    .filter((a) => a.status !== 'cancelled' && a.status !== 'completed' && new Date(a.date + 'T00:00:00') >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
  const past = appointments
    .filter((a) => a.status === 'cancelled' || a.status === 'completed' || new Date(a.date + 'T00:00:00') < today)
    .sort((a, b) => b.date.localeCompare(a.date))

  const apptInfo = (s: AppointmentStatus) =>
    ({
      confirmed: { l: 'Confirmada', bg: P.success + '18', c: P.success, Icon: CheckCircle2 },
      pending: { l: 'Pendente', bg: P.warn + '18', c: P.warn, Icon: Hourglass },
      completed: { l: 'Realizada', bg: P.primary + '18', c: P.primary, Icon: CheckCircle2 },
      cancelled: { l: 'Cancelada', bg: P.danger + '18', c: P.danger, Icon: XCircle },
    }[s])

  const fmt = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
  const du = (d: string) => {
    const diff = Math.round((new Date(d + 'T00:00:00').getTime() - today.getTime()) / 86400000)
    return diff === 0 ? 'Hoje' : diff === 1 ? 'Amanhã' : `Em ${diff}d`
  }

  const doCancel = (id: number) => {
    setAppts((p) => p.map((a) => (a.id === id ? { ...a, status: 'cancelled' as AppointmentStatus } : a)))
    setCancelId(null)
    onShowToast('Consulta cancelada com sucesso.', 'info')
  }

  const sendTeleMessage = () => {
    if (!teleInput.trim()) return
    setTeleChat((prev) => [...prev, { sender: 'Você', text: teleInput.trim() }])
    setTeleInput('')
    setTimeout(() => {
      setTeleChat((prev) => [...prev, { sender: 'Dr. Paulo', text: 'Recebi sua informação, está anotado em seu prontuário eletrônico do SUS.' }])
    }, 1000)
  }

  const list = tab === 'upcoming' ? upcoming : past

  return (
    <div style={{ background: dm.bg, minHeight: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ background: `linear-gradient(135deg,${P.primaryDk},${P.primary} 60%,${P.secondary})`, padding: '16px 18px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: fs(20), fontWeight: 800, color: '#fff' }}>📅 Consultas & Agendamentos</div>
            <div style={{ fontSize: fs(13), color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>
              {upcoming.length} próxima{upcoming.length !== 1 ? 's' : ''} consulta{upcoming.length !== 1 ? 's' : ''}
            </div>
          </div>
          <button
            onClick={() => go('new-appointment')}
            className="btn-press"
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: '#fff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            <Plus size={24} color={P.primary} />
          </button>
        </div>

        {upcoming[0] && (
          <div
            style={{
              marginTop: 14,
              background: 'rgba(255,255,255,0.14)',
              borderRadius: 16,
              padding: '12px 14px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.22)',
            }}
          >
            <div
              style={{
                fontSize: fs(10),
                color: 'rgba(255,255,255,0.65)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.7px',
                marginBottom: 8,
              }}
            >
              Próxima Consulta
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {upcoming[0].type === 'teleconsulta' ? <Video size={20} color="#fff" /> : <Stethoscope size={20} color="#fff" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: fs(14), fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {upcoming[0].doctor}
                </div>
                <div style={{ fontSize: fs(11), color: 'rgba(255,255,255,0.75)' }}>
                  {du(upcoming[0].date)} — {upcoming[0].time}
                </div>
              </div>
              <div style={{ background: P.success, borderRadius: 20, padding: '4px 12px' }}>
                <span style={{ fontSize: fs(11), fontWeight: 700, color: '#fff' }}>{du(upcoming[0].date)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ background: dm.card, padding: '10px 16px', display: 'flex', gap: 6, borderBottom: `1px solid ${dm.border}`, flexShrink: 0 }}>
        {[
          { id: 'upcoming', l: `Próximas (${upcoming.length})` },
          { id: 'past', l: `Passadas (${past.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className="btn-press"
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: 12,
              border: 'none',
              background: tab === t.id ? `${P.primary}14` : 'transparent',
              color: tab === t.id ? P.primary : dm.sub,
              fontSize: fs(13),
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
          >
            {t.l}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 80px' }}>
        {list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 68, height: 68, borderRadius: 22, background: `${P.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={34} color={`${P.primary}60`} />
            </div>
            <div style={{ fontSize: fs(16), fontWeight: 700, color: dm.text }}>Nenhuma consulta</div>
            {tab === 'upcoming' && (
              <button
                onClick={() => go('new-appointment')}
                className="btn-press"
                style={{
                  padding: '13px 28px',
                  borderRadius: 14,
                  background: `linear-gradient(135deg,${P.primary},${P.primaryDk})`,
                  color: '#fff',
                  fontSize: fs(14),
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: `0 6px 24px ${P.primary}40`,
                }}
              >
                + Agendar consulta
              </button>
            )}
          </div>
        )}
        {list.map((appt: Appointment, i: number) => {
          const info = apptInfo(appt.status)!
          const isUp = appt.status === 'confirmed' || appt.status === 'pending'
          return (
            <div
              key={appt.id}
              style={{
                background: dm.card,
                borderRadius: 20,
                padding: '16px',
                marginBottom: 12,
                boxShadow: '0 2px 14px rgba(94,143,192,0.08)',
                border: `1px solid ${dm.border}`,
                animation: `float-up 0.4s ease ${i * 0.07}s both`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: `${P.primary}12`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {appt.type === 'teleconsulta' ? <Video size={24} color={P.primary} /> : <Stethoscope size={24} color={P.primary} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: fs(15), fontWeight: 800, color: dm.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {appt.doctor}
                  </div>
                  <div style={{ fontSize: fs(12), color: P.purple, fontWeight: 600, marginTop: 1 }}>{appt.specialty}</div>
                </div>
                <div style={{ padding: '5px 11px', borderRadius: 20, background: info.bg, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <info.Icon size={12} color={info.c} />
                  <span style={{ fontSize: fs(10), fontWeight: 700, color: info.c }}>{info.l}</span>
                </div>
              </div>
              <div style={{ background: dm.bg, borderRadius: 14, padding: '10px 14px', marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Calendar size={13} color={dm.sub} />
                  <span style={{ fontSize: fs(13), color: dm.text, fontWeight: 600, flex: 1 }}>{fmt(appt.date)}</span>
                  {isUp && (
                    <span style={{ fontSize: fs(11), fontWeight: 700, color: P.primary, background: `${P.primary}14`, padding: '2px 9px', borderRadius: 20 }}>
                      {du(appt.date)}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={13} color={dm.sub} />
                  <span style={{ fontSize: fs(13), color: dm.text }}>{appt.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Building2 size={13} color={dm.sub} />
                  <span style={{ fontSize: fs(13), color: dm.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {appt.location}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={13} color={dm.sub} />
                  <span style={{ fontSize: fs(12), color: dm.sub }}>
                    Agendado por: <b style={{ color: dm.text }}>{appt.bookedBy}</b>
                  </span>
                </div>
              </div>
              {appt.notes && (
                <div style={{ background: '#FEF3C7', borderRadius: 10, padding: '8px 12px', marginBottom: 10 }}>
                  <span style={{ fontSize: fs(12), color: '#A07030' }}>📝 {appt.notes}</span>
                </div>
              )}
              {isUp && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {appt.type === 'teleconsulta' ? (
                    <button
                      onClick={() => setActiveTeleconsulta(appt)}
                      className="btn-press"
                      style={{
                        flex: 1,
                        padding: '11px',
                        borderRadius: 12,
                        background: `linear-gradient(135deg,${P.primary},${P.primaryDk})`,
                        color: '#fff',
                        fontSize: fs(13),
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        boxShadow: `0 4px 16px ${P.primary}35`,
                      }}
                    >
                      <Video size={15} /> Entrar na Teleconsulta
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveLocationModal(appt)}
                      className="btn-press"
                      style={{
                        flex: 1,
                        padding: '11px',
                        borderRadius: 12,
                        background: `${P.primary}12`,
                        color: P.primary,
                        fontSize: fs(13),
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <MapPin size={15} /> Como chegar (Rota)
                    </button>
                  )}
                  <button
                    onClick={() => setCancelId(appt.id)}
                    className="btn-press"
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: `${P.danger}12`,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={16} color={P.danger} />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => go('new-appointment')}
        className="btn-press"
        style={{
          position: 'absolute',
          bottom: 76,
          right: 18,
          width: 58,
          height: 58,
          borderRadius: 18,
          background: `linear-gradient(135deg,${P.primary},${P.primaryDk})`,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 6px 24px ${P.primary}50`,
        }}
      >
        <Plus size={28} color="#fff" />
      </button>

      {/* Cancel Confirmation Modal */}
      {cancelId !== null && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', zIndex: 20, animation: 'fade-in 0.2s ease' }}>
          <div style={{ background: dm.card, borderRadius: '24px 24px 0 0', padding: '24px 20px 36px', width: '100%', boxShadow: '0 -8px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: dm.border, margin: '0 auto 20px' }} />
            <div style={{ fontSize: fs(18), fontWeight: 800, color: dm.text, marginBottom: 8 }}>Cancelar consulta?</div>
            <div style={{ fontSize: fs(14), color: dm.sub, lineHeight: 1.55, marginBottom: 24 }}>
              A consulta será marcada como cancelada. Esta ação não pode ser desfeita.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setCancelId(null)}
                className="btn-press"
                style={{
                  flex: 1,
                  padding: '17px',
                  borderRadius: 16,
                  border: `2px solid ${dm.border}`,
                  background: 'transparent',
                  color: dm.text,
                  fontSize: fs(15),
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Manter
              </button>
              <button
                onClick={() => doCancel(cancelId)}
                className="btn-press"
                style={{
                  flex: 1,
                  padding: '17px',
                  borderRadius: 16,
                  border: 'none',
                  background: `linear-gradient(135deg,${P.danger},#C43C3C)`,
                  color: '#fff',
                  fontSize: fs(15),
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: `0 4px 20px ${P.danger}40`,
                }}
              >
                Cancelar consulta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Teleconsulta Room */}
      {activeTeleconsulta && (
        <div style={{ position: 'absolute', inset: 0, background: '#0F172A', zIndex: 40, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: fs(15), fontWeight: 800, color: '#fff' }}>{activeTeleconsulta.doctor}</div>
              <div style={{ fontSize: fs(11), color: '#94A3B8' }}>{activeTeleconsulta.specialty} • Teleconsulta SUS</div>
            </div>
            <div style={{ background: `${P.success}25`, padding: '4px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: P.success }} />
              <span style={{ fontSize: fs(12), fontWeight: 700, color: P.success }}>{formatTimer(callSeconds)}</span>
            </div>
          </div>

          {/* Main Video View */}
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1E293B', margin: 12, borderRadius: 24, overflow: 'hidden' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: `${P.primary}30`, border: `3px solid ${P.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 36 }}>
                👨‍⚕️
              </div>
              <div style={{ fontSize: fs(18), fontWeight: 800, color: '#fff' }}>{activeTeleconsulta.doctor}</div>
              <div style={{ fontSize: fs(13), color: '#94A3B8', marginTop: 4 }}>Conexão Segura e Criptografada</div>
            </div>

            {/* Self-view picture-in-picture */}
            <div style={{ position: 'absolute', bottom: 16, right: 16, width: 88, height: 120, borderRadius: 16, background: camOff ? '#334155' : '#475569', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
              {camOff ? (
                <VideoOff size={22} color="#94A3B8" />
              ) : (
                <>
                  <div style={{ fontSize: 24 }}>🧑</div>
                  <span style={{ fontSize: 9, color: '#fff', fontWeight: 700, marginTop: 4 }}>João Silva</span>
                </>
              )}
            </div>
          </div>

          {/* Chat notes strip */}
          <div style={{ padding: '0 14px 10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '10px 14px', maxHeight: 90, overflowY: 'auto' }}>
              {teleChat.map((m, idx) => (
                <div key={idx} style={{ fontSize: fs(12), color: m.sender === 'Você' ? P.primary : '#E2E8F0', marginBottom: 4 }}>
                  <b>{m.sender}:</b> {m.text}
                </div>
              ))}
            </div>
          </div>

          {/* Controls Bar */}
          <div style={{ padding: '12px 18px 24px', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <button
              onClick={() => setMicMuted(!micMuted)}
              className="btn-press"
              style={{ width: 50, height: 50, borderRadius: '50%', background: micMuted ? P.danger : 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {micMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>
            <button
              onClick={() => setCamOff(!camOff)}
              className="btn-press"
              style={{ width: 50, height: 50, borderRadius: '50%', background: camOff ? P.danger : 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {camOff ? <VideoOff size={22} /> : <Video size={22} />}
            </button>
            <button
              onClick={() => {
                setActiveTeleconsulta(null)
                onShowToast('Teleconsulta finalizada com sucesso.', 'info')
              }}
              className="btn-press"
              style={{ width: 56, height: 56, borderRadius: '50%', background: P.danger, border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${P.danger}60` }}
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Interactive Location / Directions Modal */}
      {activeLocationModal && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30, display: 'flex', alignItems: 'flex-end', animation: 'fade-in 0.2s ease' }}>
          <div style={{ background: dm.card, borderRadius: '24px 24px 0 0', padding: '22px 20px 32px', width: '100%', maxHeight: '85%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: fs(17), fontWeight: 800, color: dm.text }}>Localização da UBS</div>
                <div style={{ fontSize: fs(12), color: dm.sub }}>{activeLocationModal.location}</div>
              </div>
              <button onClick={() => setActiveLocationModal(null)} style={{ background: 'none', border: 'none', color: dm.sub, cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Map visual preview */}
            <div style={{ width: '100%', height: 140, borderRadius: 16, background: '#E2E8F0', position: 'relative', overflow: 'hidden', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.25, backgroundImage: 'radial-gradient(#475569 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', color: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                  <MapPin size={22} />
                </div>
                <div style={{ fontSize: fs(12), fontWeight: 800, color: '#1E293B' }}>1.8 km de distância (6 min)</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <div style={{ background: dm.bg, padding: '12px 14px', borderRadius: 14, fontSize: fs(12), color: dm.text }}>
                🕒 <b>Horário de atendimento:</b> Segunda a Sexta, das 07:00 às 18:00
              </div>
              <div style={{ background: dm.bg, padding: '12px 14px', borderRadius: 14, fontSize: fs(12), color: dm.text }}>
                📞 <b>Telefone da Unidade:</b> (11) 3456-7890
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  onShowToast('Iniciando rota no navegador...', 'info')
                  setActiveLocationModal(null)
                }}
                className="btn-press"
                style={{ flex: 1, padding: '15px', borderRadius: 14, background: P.primary, color: '#fff', fontWeight: 700, fontSize: fs(14), border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Navigation size={16} /> Iniciar Rota GPS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function NewAppointmentScreen({
  dm,
  fs,
  onBack,
  onSave,
}: {
  dm: ThemeColors
  fs: (n: number) => number
  onBack: () => void
  onSave: (a: Appointment) => void
}) {
  // Compute default date to tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDateStr = tomorrow.toISOString().split('T')[0]

  const [doctor, setDoctor] = useState('Dr. Carlos Mendes')
  const [specialty, setSpec] = useState(specialties[0])
  const [location, setLoc] = useState(locations[0])
  const [date, setDate] = useState(defaultDateStr)
  const [time, setTime] = useState('09:00')
  const [type, setType] = useState<AppointmentType>('presencial')
  const [notes, setNotes] = useState('')
  const [bookedBy, setBookedBy] = useState<'patient' | 'family'>('patient')
  const [error, setError] = useState('')

  const handleSave = () => {
    if (!doctor.trim()) {
      setError('Informe o nome do médico.')
      return
    }
    if (!date) {
      setError('Selecione a data.')
      return
    }
    setError('')
    onSave({
      id: Date.now(),
      doctor: doctor.trim(),
      specialty,
      location: type === 'teleconsulta' ? 'Teleconsulta — App SEDA' : location,
      date,
      time,
      type,
      status: 'pending' as AppointmentStatus,
      notes,
      bookedBy: bookedBy === 'family' ? 'Ana Silva (Familiar)' : 'João Silva',
      forPatient: 'João Silva',
    })
  }

  const inp: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 14,
    border: `2px solid ${dm.border}`,
    fontSize: fs(15),
    fontFamily: 'inherit',
    outline: 'none',
    background: dm.card,
    color: dm.text,
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ background: dm.bg, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <BackHeader title="Nova Consulta" onBack={onBack} color={P.primaryDk} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Who books */}
        <div style={{ background: dm.card, borderRadius: 18, padding: '16px', boxShadow: '0 2px 14px rgba(94,143,192,0.07)' }}>
          <div style={{ fontSize: fs(12), fontWeight: 700, color: dm.sub, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
            Quem está agendando?
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'patient', l: '🧑‍⚕️ Paciente (João)' },
              { id: 'family', l: '👨‍👩‍👧 Familiar' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => setBookedBy(b.id as any)}
                className="btn-press"
                style={{
                  flex: 1,
                  padding: '13px 8px',
                  borderRadius: 13,
                  border: `2px solid ${bookedBy === b.id ? P.primary : dm.border}`,
                  background: bookedBy === b.id ? `${P.primary}12` : 'transparent',
                  color: bookedBy === b.id ? P.primary : dm.sub,
                  fontSize: fs(13),
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                {b.l}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div style={{ background: dm.card, borderRadius: 18, padding: '16px', boxShadow: '0 2px 14px rgba(94,143,192,0.07)' }}>
          <div style={{ fontSize: fs(12), fontWeight: 700, color: dm.sub, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
            Tipo de consulta
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'presencial', l: '🏥 Presencial' },
              { id: 'teleconsulta', l: '💻 Teleconsulta' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id as AppointmentType)}
                className="btn-press"
                style={{
                  flex: 1,
                  padding: '13px 8px',
                  borderRadius: 13,
                  border: `2px solid ${type === t.id ? P.primary : dm.border}`,
                  background: type === t.id ? `${P.primary}12` : 'transparent',
                  color: type === t.id ? P.primary : dm.sub,
                  fontSize: fs(13),
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor */}
        <div style={{ background: dm.card, borderRadius: 18, padding: '16px', boxShadow: '0 2px 14px rgba(94,143,192,0.07)' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: fs(12), fontWeight: 700, color: dm.sub, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
              Médico / Profissional
            </span>
            <input
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              placeholder="Ex: Dr. Carlos Mendes"
              style={inp}
              onFocus={(e) => (e.target.style.borderColor = P.primary)}
              onBlur={(e) => (e.target.style.borderColor = dm.border)}
            />
          </label>
        </div>

        {/* Specialty chips */}
        <div style={{ background: dm.card, borderRadius: 18, padding: '16px', boxShadow: '0 2px 14px rgba(94,143,192,0.07)' }}>
          <div style={{ fontSize: fs(12), fontWeight: 700, color: dm.sub, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
            Especialidade
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {specialties.map((sp) => (
              <button
                key={sp}
                onClick={() => setSpec(sp)}
                className="btn-press"
                style={{
                  padding: '8px 14px',
                  borderRadius: 20,
                  border: `2px solid ${specialty === sp ? P.primary : dm.border}`,
                  background: specialty === sp ? `${P.primary}12` : 'transparent',
                  color: specialty === sp ? P.primary : dm.sub,
                  fontSize: fs(12),
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                {sp}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        {type === 'presencial' && (
          <div style={{ background: dm.card, borderRadius: 18, padding: '16px', boxShadow: '0 2px 14px rgba(94,143,192,0.07)' }}>
            <div style={{ fontSize: fs(12), fontWeight: 700, color: dm.sub, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
              Unidade de Saúde
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {locations
                .filter((l) => !l.includes('Teleconsulta'))
                .map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLoc(loc)}
                    className="btn-press"
                    style={{
                      padding: '13px 16px',
                      borderRadius: 13,
                      border: `2px solid ${location === loc ? P.primary : dm.border}`,
                      background: location === loc ? `${P.primary}10` : 'transparent',
                      color: location === loc ? P.primary : dm.text,
                      fontSize: fs(13),
                      fontWeight: location === loc ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>{loc}</span>
                    {location === loc && <Check size={16} color={P.primary} />}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Date & time */}
        <div style={{ background: dm.card, borderRadius: 18, padding: '16px', boxShadow: '0 2px 14px rgba(94,143,192,0.07)' }}>
          <div style={{ fontSize: fs(12), fontWeight: 700, color: dm.sub, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
            Data e Horário
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <label style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: fs(11), color: dm.sub, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={12} /> Data
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{ ...inp, padding: '12px' }}
                onFocus={(e) => (e.target.style.borderColor = P.primary)}
                onBlur={(e) => (e.target.style.borderColor = dm.border)}
              />
            </label>
            <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: fs(11), color: dm.sub, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} /> Hora
              </span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{ ...inp, padding: '12px' }}
                onFocus={(e) => (e.target.style.borderColor = P.primary)}
                onBlur={(e) => (e.target.style.borderColor = dm.border)}
              />
            </label>
          </div>
        </div>

        {/* Notes */}
        <div style={{ background: dm.card, borderRadius: 18, padding: '16px', boxShadow: '0 2px 14px rgba(94,143,192,0.07)' }}>
          <div style={{ fontSize: fs(12), fontWeight: 700, color: dm.sub, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
            📝 Observações (opcional)
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: trazer exames de sangue recentes, em jejum..."
            rows={3}
            style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: fs(14), color: dm.text, fontFamily: 'inherit', resize: 'none', lineHeight: 1.6 }}
          />
        </div>

        {error && (
          <div style={{ background: `${P.danger}12`, borderRadius: 13, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, border: `1.5px solid ${P.danger}25` }}>
            <AlertTriangle size={16} color={P.danger} />
            <span style={{ fontSize: fs(13), color: P.danger, fontWeight: 600 }}>{error}</span>
          </div>
        )}

        <button
          onClick={handleSave}
          className="btn-press"
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: 18,
            background: `linear-gradient(135deg,${P.primary},${P.primaryDk})`,
            color: '#fff',
            fontSize: fs(16),
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: `0 6px 24px ${P.primary}45`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Calendar size={20} /> Confirmar Agendamento
        </button>
      </div>
    </div>
  )
}
