import React, { useState } from 'react'
import { P, ThemeColors } from '../../types/figma'
import { SedaLogo } from '../SedaLogo'
import { Eye, EyeOff } from 'lucide-react'
import { BackHeader } from './CommonComponents'

export function SplashScreen() {
  return (
    <div
      style={{
        flex: 1,
        background: `linear-gradient(160deg, ${P.primaryDk} 0%, ${P.primary} 55%, ${P.secondary} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -50, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      <div style={{ position: 'absolute', top: '35%', left: -40, width: 130, height: 130, borderRadius: '50%', background: 'rgba(124,201,190,0.18)' }} />

      {/* Animated rings */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {[160, 130, 110].map((s, i) => (
          <div
            key={s}
            style={{
              position: 'absolute',
              width: s,
              height: s,
              borderRadius: '50%',
              border: `2px solid rgba(255,255,255,${0.08 - i * 0.02})`,
              animation: `pulse-ring ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 34,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 16px 56px rgba(30,58,95,0.25), 0 0 0 4px rgba(255,255,255,0.3)',
            animation: 'float-up 0.6s ease',
          }}
        >
          <div style={{ animation: 'heartbeat 2s ease-in-out infinite', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SedaLogo size={90} />
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', animation: 'float-up 0.8s ease 0.2s both' }}>
        <div style={{ fontSize: 50, fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1 }}>SEDA</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500, marginTop: 6, lineHeight: 1.5 }}>
          Sistema de Equilíbrio de<br />Diabetes e Artérias
        </div>
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 24,
          padding: '11px 26px',
          border: '1px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(10px)',
          animation: 'float-up 0.8s ease 0.4s both',
        }}
      >
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 500, fontStyle: 'italic' }}>
          "Cuidando da sua saúde todos os dias."
        </span>
      </div>

      <div style={{ position: 'absolute', bottom: 36, display: 'flex', gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: i === 0 ? 26 : 8,
              height: 8,
              borderRadius: 4,
              background: i === 0 ? '#fff' : 'rgba(255,255,255,0.35)',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  )
}

const slides = [
  {
    emoji: '❤️',
    color: P.danger,
    bg: '#FFF0F0',
    title: 'Monitore sua pressão e glicemia facilmente.',
    sub: 'Registre seus dados de saúde em segundos, a qualquer hora do dia.',
    icon: (
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#FEE2E2" />
        <path d="M50 76s-26-17-26-35c0-9 6-14 14-14 5 0 10 3 12 7 2-4 7-7 12-7 8 0 14 5 14 14 0 18-26 35-26 35z" fill="#E45454" />
        <path d="M18 52Q28 44 38 52Q48 60 58 44Q68 28 78 44" stroke="#FCA5A5" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    emoji: '👨‍👩‍👧',
    color: P.accent,
    bg: '#EDFAF4',
    title: 'Conecte sua família ao seu tratamento.',
    sub: 'Compartilhe dados com quem você ama para cuidados ainda melhores.',
    icon: (
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#D0F2E8" />
        <circle cx="50" cy="38" r="14" fill="#59B98A" />
        <circle cx="50" cy="38" r="8" fill="#2FBF71" />
        <path d="M28 78Q38 62 50 62Q62 62 72 78" stroke="#59B98A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="28" cy="68" r="7" fill="#B0EAE2" />
        <circle cx="72" cy="68" r="7" fill="#B0EAE2" />
      </svg>
    ),
  },
  {
    emoji: '🔔',
    color: P.primary,
    bg: '#EEF4F8',
    title: 'Receba alertas e acompanhamento da equipe de saúde.',
    sub: 'Médicos, enfermeiros e agentes do SUS monitoram sua evolução.',
    icon: (
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#D0E6F4" />
        <rect x="30" y="30" width="40" height="30" rx="8" fill="#A0C4E0" />
        <path d="M34 22v16M66 22v16" stroke={P.primaryDk} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="50" cy="68" r="8" fill={P.primary} />
        <path d="M47 68l2.5 2.5 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export function OnboardingScreen({
  step,
  setStep,
  onDone,
}: {
  step: number
  setStep: (s: number) => void
  onDone: () => void
}) {
  const sl = slides[step]
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden' }}>
      {/* Top colored band */}
      <div style={{ background: `linear-gradient(160deg, ${sl.color}22, ${sl.color}08)`, padding: '20px 24px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onDone} style={{ background: 'none', border: 'none', color: P.textSub, fontSize: 14, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
          Pular
        </button>
      </div>

      {/* Illustration */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0 24px', animation: 'float-up 0.5s ease' }}>
        {sl.icon}
      </div>

      {/* Text */}
      <div style={{ padding: '0 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: P.textMain, lineHeight: 1.3, margin: 0 }}>{sl.title}</h2>
        <p style={{ fontSize: 15, color: P.textSub, lineHeight: 1.65, margin: 0 }}>{sl.sub}</p>
      </div>

      {/* Dots + CTA */}
      <div style={{ padding: '24px 24px 36px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: i === step ? 32 : 10,
                height: 10,
                borderRadius: 5,
                background: i === step ? sl.color : '#E2E8F0',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
        {step < 2 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="btn-press"
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: 18,
              background: sl.color,
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: `0 6px 24px ${sl.color}50`,
            }}
          >
            Próximo →
          </button>
        ) : (
          <button
            onClick={onDone}
            className="btn-press"
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: 18,
              background: `linear-gradient(135deg, ${P.primary}, ${P.accent})`,
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: `0 6px 24px ${P.primary}50`,
            }}
          >
            Começar
          </button>
        )}
      </div>
    </div>
  )
}

export function LoginScreen({
  onLogin,
  onRegister,
  dm,
  fs,
}: {
  onLogin: () => void
  onRegister: () => void
  dm: ThemeColors
  fs: (n: number) => number
}) {
  const [showPw, setShowPw] = useState(false)
  const inp: React.CSSProperties = {
    width: '100%',
    padding: '16px',
    borderRadius: 14,
    border: `2px solid ${P.border}`,
    fontSize: fs(15),
    fontFamily: 'inherit',
    outline: 'none',
    background: dm.card,
    color: dm.text,
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: dm.bg }}>
      <div style={{ background: `linear-gradient(160deg, ${P.primaryDk}, ${P.primary} 60%, ${P.secondary})`, padding: '40px 28px 56px', textAlign: 'center' }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            boxShadow: `0 8px 32px rgba(30,58,95,0.22)`,
          }}
        >
          <SedaLogo size={60} />
        </div>
        <div style={{ fontSize: fs(28), fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>SEDA</div>
        <div style={{ fontSize: fs(13), color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>Acesse sua conta</div>
      </div>

      <div
        style={{
          background: dm.card,
          borderRadius: '28px 28px 0 0',
          marginTop: -24,
          flex: 1,
          padding: '32px 24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 -4px 40px rgba(94,143,192,0.12)',
        }}
      >
        <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
          {['CPF', 'Senha'].map((l) => (
            <div key={l} style={{ flex: 1, height: 3, borderRadius: 2, background: l === 'CPF' ? P.primary : P.border }} />
          ))}
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <span style={{ fontSize: fs(13), fontWeight: 700, color: dm.text }}>CPF</span>
          <input
            placeholder="000.000.000-00"
            defaultValue="123.456.789-00"
            style={inp}
            onFocus={(e) => (e.target.style.borderColor = P.primary)}
            onBlur={(e) => (e.target.style.borderColor = P.border)}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <span style={{ fontSize: fs(13), fontWeight: 700, color: dm.text }}>Senha</span>
          <div style={{ position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              defaultValue="123456"
              style={{ ...inp, paddingRight: 48 }}
              onFocus={(e) => (e.target.style.borderColor = P.primary)}
              onBlur={(e) => (e.target.style.borderColor = P.border)}
            />
            <button
              onClick={() => setShowPw(!showPw)}
              style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8',
                display: 'flex',
              }}
            >
              {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </label>

        <button
          onClick={onLogin}
          className="btn-press"
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: 16,
            background: `linear-gradient(135deg, ${P.primary}, ${P.primaryDk})`,
            color: '#fff',
            fontSize: fs(16),
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: `0 6px 24px ${P.primary}45`,
            marginTop: 4,
          }}
        >
          Entrar
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: P.border }} />
          <span style={{ fontSize: 13, color: '#94A3B8' }}>ou</span>
          <div style={{ flex: 1, height: 1, background: P.border }} />
        </div>

        <button
          onClick={onLogin}
          className="btn-press"
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: 15,
            border: `2px solid ${P.border}`,
            background: '#fff',
            color: P.textMain,
            fontSize: fs(14),
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M18.17 10.2c0-.63-.06-1.23-.17-1.8H10v3.41h4.59a3.94 3.94 0 0 1-1.7 2.58v2.14h2.74c1.6-1.48 2.54-3.65 2.54-6.33z" fill="#4285F4" />
            <path d="M10 18.5c2.3 0 4.24-.76 5.65-2.07l-2.74-2.14c-.76.51-1.74.81-2.91.81-2.24 0-4.13-1.51-4.8-3.54H2.37v2.2A8.5 8.5 0 0 0 10 18.5z" fill="#34A853" />
            <path d="M5.2 11.56A5.1 5.1 0 0 1 4.93 10c0-.54.09-1.07.27-1.56V6.24H2.37A8.5 8.5 0 0 0 1.5 10c0 1.37.33 2.67.87 3.76l2.83-2.2z" fill="#FBBC05" />
            <path d="M10 4.91c1.27 0 2.4.44 3.29 1.3l2.46-2.46C14.24 2.35 12.3 1.5 10 1.5A8.5 8.5 0 0 0 2.37 6.24L5.2 8.44C5.87 6.41 7.76 4.91 10 4.91z" fill="#EA4335" />
          </svg>
          Entrar com Google
        </button>

        <button style={{ background: 'none', border: 'none', color: P.primary, fontSize: fs(13), fontWeight: 600, cursor: 'pointer', padding: '2px 0', fontFamily: 'inherit' }}>
          Esqueci minha senha
        </button>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: fs(13), color: dm.sub }}>Não tem conta? </span>
          <button onClick={onRegister} style={{ background: 'none', border: 'none', color: P.primary, fontSize: fs(13), fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Criar conta
          </button>
        </div>
      </div>
    </div>
  )
}

export function RegisterScreen({
  onBack,
  onDone,
  dm,
  fs,
}: {
  onBack: () => void
  onDone: () => void
  dm: ThemeColors
  fs: (n: number) => number
}) {
  const [userType, setUserType] = useState<'patient' | 'family' | 'pro'>('patient')
  const inp: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 13,
    border: `2px solid ${P.border}`,
    fontSize: fs(15),
    fontFamily: 'inherit',
    outline: 'none',
    background: dm.card,
    color: dm.text,
    boxSizing: 'border-box',
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: dm.bg }}>
      <BackHeader title="Criar Conta" onBack={onBack} color={P.primaryDk} />
      <div style={{ flex: 1, padding: '20px 18px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { l: 'Nome completo', ph: 'João da Silva' },
          { l: 'CPF', ph: '000.000.000-00' },
          { l: 'Telefone', ph: '(11) 99999-9999' },
          { l: 'Data de nascimento', ph: 'DD/MM/AAAA' },
        ].map((f) => (
          <label key={f.l} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: fs(13), fontWeight: 700, color: dm.text }}>{f.l}</span>
            <input placeholder={f.ph} style={inp} />
          </label>
        ))}

        <div>
          <span style={{ fontSize: fs(13), fontWeight: 700, color: dm.text, display: 'block', marginBottom: 10 }}>Tipo de usuário</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'patient', l: '🧑‍⚕️ Paciente' },
              { id: 'family', l: '👨‍👩‍👧 Familiar' },
              { id: 'pro', l: '🏥 Profissional' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setUserType(t.id as any)}
                style={{
                  flex: 1,
                  padding: '11px 4px',
                  borderRadius: 12,
                  border: `2px solid ${userType === t.id ? P.primary : P.border}`,
                  background: userType === t.id ? `${P.primary}14` : 'transparent',
                  color: userType === t.id ? P.primary : dm.sub,
                  fontSize: fs(11),
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

        {[
          { l: 'Senha', ph: '••••••••' },
          { l: 'Confirmar senha', ph: '••••••••' },
        ].map((f) => (
          <label key={f.l} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: fs(13), fontWeight: 700, color: dm.text }}>{f.l}</span>
            <input type="password" placeholder={f.ph} style={inp} />
          </label>
        ))}

        <button
          onClick={onDone}
          className="btn-press"
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: 16,
            background: `linear-gradient(135deg, ${P.primary}, ${P.primaryDk})`,
            color: '#fff',
            fontSize: fs(16),
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            marginTop: 4,
            boxShadow: `0 6px 24px ${P.primary}45`,
          }}
        >
          Criar conta
        </button>
      </div>
    </div>
  )
}
