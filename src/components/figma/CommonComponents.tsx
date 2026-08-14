import React, { useState } from 'react'
import { P, ThemeColors } from '../../types/figma'
import { 
  Minus, 
  Plus, 
  ChevronLeft, 
  Home, 
  History, 
  Bell, 
  Users, 
  User,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'

export const GlobalCSS: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    ::-webkit-scrollbar { display: none; }
    @keyframes pulse-ring {
      0%   { transform: scale(1);   opacity: 0.6; }
      50%  { transform: scale(1.18); opacity: 0.2; }
      100% { transform: scale(1);   opacity: 0.6; }
    }
    @keyframes heartbeat {
      0%,100% { transform: scale(1); }
      14%     { transform: scale(1.12); }
      28%     { transform: scale(1); }
      42%     { transform: scale(1.07); }
    }
    @keyframes float-up {
      from { opacity:0; transform:translateY(18px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes slide-in-right {
      from { opacity:0; transform:translateX(32px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes slide-in-up {
      from { opacity:0; transform:translateY(40px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes fade-in {
      from { opacity:0; }
      to   { opacity:1; }
    }
    @keyframes wave {
      0%,100% { transform: scaleY(0.3); }
      50%     { transform: scaleY(1); }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to   { rotate(360deg); }
    }
    .btn-press { transition: transform 0.12s, box-shadow 0.12s; }
    .btn-press:active { transform: scale(0.96); }
    .card-hover { transition: transform 0.2s, box-shadow 0.2s; }
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(94,143,192,0.18) !important; }
  `}</style>
)

export const sColor = (s: string) => s === 'normal' ? P.success : s === 'attention' ? P.warn : P.danger
export const sLabel = (s: string) => s === 'normal' ? 'Normal' : s === 'attention' ? 'Atenção' : 'Alerta'

export function Toast({
  message,
  type = 'success',
  onClose,
}: {
  message: string
  type?: 'success' | 'warning' | 'error' | 'info'
  onClose?: () => void
}) {
  const bg = type === 'success' ? P.success : type === 'warning' ? P.warn : type === 'error' ? P.danger : P.primary
  const Icon = type === 'success' ? CheckCircle : type === 'warning' || type === 'error' ? AlertCircle : Info

  return (
    <div
      style={{
        position: 'absolute',
        top: 54,
        left: 16,
        right: 16,
        background: bg,
        color: '#fff',
        padding: '12px 16px',
        borderRadius: 16,
        boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        zIndex: 100,
        animation: 'slide-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <Icon size={20} color="#fff" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 700, flex: 1, lineHeight: 1.4 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 16,
            cursor: 'pointer',
            padding: 0,
            opacity: 0.8,
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
}

export function HealthRing({
  value,
  max,
  color,
  size = 88,
  stroke = 8,
  unit,
}: {
  value: number
  max: number
  color: string
  size?: number
  stroke?: number
  label?: string
  unit: string
}) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  const dash = pct * circ

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color + '25'} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: size * 0.23, fontWeight: 800, color, lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: size * 0.12, color: P.textSub, fontWeight: 600, marginTop: 2 }}>{unit}</span>
      </div>
    </div>
  )
}

export function Stepper({
  value,
  onDec,
  onInc,
  onDecStep,
  onIncStep,
  color = P.primary,
  onChange,
}: {
  value: string | number
  onDec: () => void
  onInc: () => void
  onDecStep?: () => void
  onIncStep?: () => void
  color?: string
  onChange?: (val: number) => void
}) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', width: '100%' }}>
        {onDecStep && (
          <button
            onClick={onDecStep}
            className="btn-press"
            title="-5"
            style={{
              padding: '6px 10px',
              height: 42,
              borderRadius: 12,
              background: color + '12',
              border: `1.5px solid ${color}25`,
              color,
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            -5
          </button>
        )}
        <button
          onClick={onDec}
          className="btn-press"
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: color + '18',
            border: `2px solid ${color}30`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Minus size={22} color={color} />
        </button>

        {isEditing ? (
          <input
            type="number"
            autoFocus
            defaultValue={value}
            onBlur={(e) => {
              setIsEditing(false)
              const n = parseInt(e.target.value, 10)
              if (!isNaN(n) && onChange) onChange(n)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEditing(false)
                const n = parseInt((e.target as HTMLInputElement).value, 10)
                if (!isNaN(n) && onChange) onChange(n)
              }
            }}
            style={{
              fontSize: 44,
              fontWeight: 900,
              color,
              width: 110,
              textAlign: 'center',
              lineHeight: 1,
              fontFamily: 'Inter,system-ui,sans-serif',
              border: `2px solid ${color}`,
              borderRadius: 12,
              background: 'transparent',
              outline: 'none',
            }}
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            title="Clique para digitar"
            style={{
              fontSize: 50,
              fontWeight: 900,
              color,
              minWidth: 100,
              textAlign: 'center',
              lineHeight: 1,
              fontFamily: 'Inter,system-ui,sans-serif',
              letterSpacing: '-1.5px',
              cursor: 'pointer',
              userSelect: 'none',
              padding: '2px 6px',
              borderRadius: 8,
              border: '1px dashed transparent',
            }}
          >
            {value}
          </div>
        )}

        <button
          onClick={onInc}
          className="btn-press"
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: color + '18',
            border: `2px solid ${color}30`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={22} color={color} />
        </button>

        {onIncStep && (
          <button
            onClick={onIncStep}
            className="btn-press"
            title="+5"
            style={{
              padding: '6px 10px',
              height: 42,
              borderRadius: 12,
              background: color + '12',
              border: `1.5px solid ${color}25`,
              color,
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            +5
          </button>
        )}
      </div>
      <span style={{ fontSize: 10, color: P.textSub, opacity: 0.8 }}>Toque no número para digitar</span>
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const c = sColor(status)
  return (
    <div style={{ padding: '4px 12px', borderRadius: 20, background: c + '18', display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: c }}>{sLabel(status)}</span>
    </div>
  )
}

export function NavBar({ active, onTab }: { active: string; onTab: (t: string) => void }) {
  const tabs = [
    { id: 'home', Icon: Home, label: 'Início' },
    { id: 'history', Icon: History, label: 'Histórico' },
    { id: 'alerts', Icon: Bell, label: 'Alertas' },
    { id: 'network', Icon: Users, label: 'Família' },
    { id: 'profile', Icon: User, label: 'Perfil' },
  ]
  return (
    <div
      style={{
        background: P.card,
        borderTop: `1px solid ${P.border}`,
        padding: '6px 4px 12px',
        display: 'flex',
        flexShrink: 0,
        boxShadow: '0 -8px 32px rgba(94,143,192,0.1)',
      }}
    >
      {tabs.map(({ id, Icon, label }) => {
        const on = active === id
        return (
          <button
            key={id}
            onClick={() => onTab(id)}
            className="btn-press"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: on ? `${P.primary}18` : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s',
              }}
            >
              <Icon size={21} color={on ? P.primary : '#94A3B8'} strokeWidth={on ? 2.5 : 2} />
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: on ? 700 : 500,
                color: on ? P.primary : '#94A3B8',
                transition: 'color 0.25s',
              }}
            >
              {label}
            </span>
            {on && (
              <div
                style={{
                  width: 16,
                  height: 3,
                  borderRadius: 2,
                  background: P.primary,
                  marginTop: -2,
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

export function BackHeader({
  title,
  onBack,
  color = P.primaryDk,
  right,
}: {
  title: string
  onBack: () => void
  color?: string
  right?: React.ReactNode
}) {
  return (
    <div
      style={{
        background: color,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
      }}
    >
      <button
        onClick={onBack}
        className="btn-press"
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: 'rgba(255,255,255,0.18)',
          border: '1.5px solid rgba(255,255,255,0.25)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ChevronLeft size={20} color="#fff" />
      </button>
      <span style={{ flex: 1, fontSize: 17, fontWeight: 700, color: '#fff' }}>{title}</span>
      {right}
    </div>
  )
}
