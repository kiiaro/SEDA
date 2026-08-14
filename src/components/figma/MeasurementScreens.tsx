import React, { useState, useEffect } from 'react'
import { P, ThemeColors } from '../../types/figma'
import { BackHeader, Stepper, HealthRing, sColor } from './CommonComponents'
import { Heart, Check, Clock, Mic, MicOff, Volume2, Sparkles } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function PressureScreen({
  dm,
  fs,
  onBack,
  sys,
  setSys,
  dia,
  setDia,
  hr,
  setHr,
  saved,
  onSave,
}: {
  dm: ThemeColors
  fs: (n: number) => number
  onBack: () => void
  sys: number
  setSys: React.Dispatch<React.SetStateAction<number>>
  dia: number
  setDia: React.Dispatch<React.SetStateAction<number>>
  hr: number
  setHr: React.Dispatch<React.SetStateAction<number>>
  saved: boolean
  onSave: (sys: number, dia: number, hr: number, notes?: string) => void
}) {
  const [notes, setNotes] = useState('')
  const status = sys >= 140 ? 'alert' : sys >= 130 ? 'attention' : 'normal'
  const statusC = sColor(status)

  const handleSave = () => {
    onSave(sys, dia, hr, notes)
  }

  const mockHistory = [
    { day: 'Seg', sys: 130, dia: 85 },
    { day: 'Ter', sys: 125, dia: 80 },
    { day: 'Qua', sys: 140, dia: 90 },
    { day: 'Qui', sys: 128, dia: 82 },
    { day: 'Sex', sys: 122, dia: 78 },
    { day: 'Sáb', sys: 135, dia: 88 },
    { day: 'Hoje', sys: sys, dia: dia },
  ]

  return (
    <div style={{ background: dm.bg, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <BackHeader
        title="❤️ Registrar Pressão"
        onBack={onBack}
        color={status === 'alert' ? P.danger : status === 'attention' ? P.warn : P.primaryDk}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Status banner */}
        <div
          style={{
            background: statusC + '14',
            borderRadius: 16,
            padding: '14px 18px',
            border: `1.5px solid ${statusC}30`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            animation: 'float-up 0.4s ease',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: statusC + '20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Heart size={20} color={statusC} style={{ animation: status === 'normal' ? 'heartbeat 2s ease-in-out infinite' : undefined }} />
          </div>
          <div>
            <div style={{ fontSize: fs(14), fontWeight: 700, color: statusC }}>
              {status === 'normal' ? 'Pressão ideal / normal ✓' : status === 'attention' ? 'Pressão limítrofe — Atenção' : '⚠️ Pressão elevada — Alerta'}
            </div>
            <div style={{ fontSize: fs(11), color: dm.sub, marginTop: 2 }}>
              Sistólica: {sys} mmHg • Diastólica: {dia} mmHg
            </div>
          </div>
        </div>

        {/* Sistólica stepper */}
        <div style={{ background: dm.card, borderRadius: 20, padding: '18px 16px', boxShadow: '0 2px 16px rgba(94,143,192,0.08)', animation: 'float-up 0.4s ease 0.05s both' }}>
          <div style={{ fontSize: fs(11), fontWeight: 700, color: dm.sub, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 12, textAlign: 'center' }}>
            ⬆️ Pressão Sistólica (Máxima)
          </div>
          <Stepper
            value={sys}
            onDec={() => setSys((v) => Math.max(60, v - 1))}
            onInc={() => setSys((v) => Math.min(240, v + 1))}
            onDecStep={() => setSys((v) => Math.max(60, v - 5))}
            onIncStep={() => setSys((v) => Math.min(240, v + 5))}
            onChange={(n) => setSys(Math.max(60, Math.min(240, n)))}
            color={statusC}
          />
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <span style={{ fontSize: fs(12), color: dm.sub, fontWeight: 600 }}>mmHg</span>
          </div>
        </div>

        {/* Diastólica stepper */}
        <div style={{ background: dm.card, borderRadius: 20, padding: '18px 16px', boxShadow: '0 2px 16px rgba(94,143,192,0.08)', animation: 'float-up 0.4s ease 0.1s both' }}>
          <div style={{ fontSize: fs(11), fontWeight: 700, color: dm.sub, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 12, textAlign: 'center' }}>
            ⬇️ Pressão Diastólica (Mínima)
          </div>
          <Stepper
            value={dia}
            onDec={() => setDia((v) => Math.max(40, v - 1))}
            onInc={() => setDia((v) => Math.min(150, v + 1))}
            onDecStep={() => setDia((v) => Math.max(40, v - 5))}
            onIncStep={() => setDia((v) => Math.min(150, v + 5))}
            onChange={(n) => setDia(Math.max(40, Math.min(150, n)))}
            color={P.secondary}
          />
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <span style={{ fontSize: fs(12), color: dm.sub, fontWeight: 600 }}>mmHg</span>
          </div>
        </div>

        {/* Batimentos stepper */}
        <div style={{ background: dm.card, borderRadius: 20, padding: '18px 16px', boxShadow: '0 2px 16px rgba(94,143,192,0.08)', animation: 'float-up 0.4s ease 0.15s both' }}>
          <div style={{ fontSize: fs(11), fontWeight: 700, color: dm.sub, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 12, textAlign: 'center' }}>
            💓 Frequência Cardíaca (Pulso)
          </div>
          <Stepper
            value={hr}
            onDec={() => setHr((v) => Math.max(40, v - 1))}
            onInc={() => setHr((v) => Math.min(220, v + 1))}
            onDecStep={() => setHr((v) => Math.max(40, v - 5))}
            onIncStep={() => setHr((v) => Math.min(220, v + 5))}
            onChange={(n) => setHr(Math.max(40, Math.min(220, n)))}
            color={P.purple}
          />
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <span style={{ fontSize: fs(12), color: dm.sub, fontWeight: 600 }}>bpm</span>
          </div>
        </div>

        {/* Observations */}
        <div style={{ background: dm.card, borderRadius: 18, padding: '16px', boxShadow: '0 2px 16px rgba(94,143,192,0.06)' }}>
          <div style={{ fontSize: fs(12), color: dm.sub, fontWeight: 700, marginBottom: 8 }}>📝 Observações adicionais</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: após 10 minutos de repouso, medido no braço esquerdo..."
            rows={2}
            style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: fs(14), color: dm.text, fontFamily: 'inherit', resize: 'none', lineHeight: 1.5 }}
          />
        </div>

        <button
          onClick={handleSave}
          className="btn-press"
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: 18,
            background: saved ? `linear-gradient(135deg,${P.success},${P.accent})` : `linear-gradient(135deg,${P.primary},${P.primaryDk})`,
            color: '#fff',
            fontSize: fs(17),
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: `0 6px 24px ${P.primary}45`,
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {saved ? (
            <>
              <Check size={22} /> Salvo no Histórico!
            </>
          ) : (
            'Salvar Registro de Pressão'
          )}
        </button>

        {/* Chart */}
        <div style={{ background: dm.card, borderRadius: 18, padding: '16px', boxShadow: '0 2px 16px rgba(94,143,192,0.06)' }}>
          <div style={{ fontSize: fs(13), fontWeight: 700, color: dm.text, marginBottom: 12 }}>Tendência Semanal</div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={mockHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke={dm.border} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[60, 160]} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }} />
              <Line type="monotone" dataKey="sys" stroke={P.primary} strokeWidth={2.5} dot={{ r: 4, fill: P.primary }} name="Sistólica" />
              <Line type="monotone" dataKey="dia" stroke={P.secondary} strokeWidth={2.5} dot={{ r: 4, fill: P.secondary }} name="Diastólica" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export function GlucoseScreen({
  dm,
  fs,
  onBack,
  value,
  setValue,
  mealTime,
  setMealTime,
  saved,
  onSave,
}: {
  dm: ThemeColors
  fs: (n: number) => number
  onBack: () => void
  value: number
  setValue: React.Dispatch<React.SetStateAction<number>>
  mealTime: 'before' | 'after'
  setMealTime: (m: 'before' | 'after') => void
  saved: boolean
  onSave: (val: number, mealTime: 'before' | 'after', time: string, notes?: string) => void
}) {
  const [time, setTime] = useState('08:00')
  const [notes, setNotes] = useState('')

  const status = value > 126 ? 'alert' : value < 70 ? 'low' : 'normal'
  const statusC = status === 'normal' ? P.accent : status === 'low' ? P.primary : P.danger

  const handleSave = () => {
    onSave(value, mealTime, time, notes)
  }

  const glucoseData = [
    { day: 'Seg', value: 110 },
    { day: 'Ter', value: 125 },
    { day: 'Qua', value: 98 },
    { day: 'Qui', value: 140 },
    { day: 'Sex', value: 115 },
    { day: 'Sáb', value: 108 },
    { day: 'Hoje', value: value },
  ]

  return (
    <div style={{ background: dm.bg, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <BackHeader
        title="🩸 Registrar Glicemia"
        onBack={onBack}
        color={status === 'normal' ? P.accent : status === 'low' ? P.primaryDk : P.danger}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Big ring + stepper */}
        <div
          style={{
            background: dm.card,
            borderRadius: 22,
            padding: '24px 20px',
            boxShadow: '0 4px 24px rgba(94,143,192,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            animation: 'float-up 0.4s ease',
          }}
        >
          <HealthRing value={value} max={300} color={statusC} size={124} stroke={11} label="Glicemia" unit="mg/dL" />
          <Stepper
            value={value}
            onDec={() => setValue((v) => Math.max(20, v - 1))}
            onInc={() => setValue((v) => Math.min(600, v + 1))}
            onDecStep={() => setValue((v) => Math.max(20, v - 5))}
            onIncStep={() => setValue((v) => Math.min(600, v + 5))}
            onChange={(n) => setValue(Math.max(20, Math.min(600, n)))}
            color={statusC}
          />
          <div style={{ padding: '6px 20px', borderRadius: 24, background: statusC + '18', border: `1.5px solid ${statusC}30` }}>
            <span style={{ fontSize: fs(13), fontWeight: 700, color: statusC }}>
              {status === 'normal' ? '✓ Glicemia Normal' : status === 'low' ? '⬇️ Hipoglicemia' : '⬆️ Hiperglicemia'}
            </span>
          </div>
        </div>

        {/* Meal time */}
        <div style={{ background: dm.card, borderRadius: 18, padding: '16px', boxShadow: '0 2px 16px rgba(94,143,192,0.06)' }}>
          <div style={{ fontSize: fs(12), color: dm.sub, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
            ⏰ Momento do registro
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'before', l: '🍽️ Antes da refeição (Jejum)' },
              { id: 'after', l: '🍴 Pós-prandial (Após comer)' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMealTime(m.id as any)}
                className="btn-press"
                style={{
                  flex: 1,
                  padding: '13px 8px',
                  borderRadius: 13,
                  border: `2px solid ${mealTime === m.id ? P.warn : dm.border}`,
                  background: mealTime === m.id ? '#FEF3C7' : 'transparent',
                  color: mealTime === m.id ? '#9A6B1A' : dm.sub,
                  fontSize: fs(11),
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                {m.l}
              </button>
            ))}
          </div>
        </div>

        {/* Time input */}
        <div style={{ background: dm.card, borderRadius: 18, padding: '16px', boxShadow: '0 2px 16px rgba(94,143,192,0.06)', display: 'flex', gap: 16, alignItems: 'center' }}>
          <Clock size={20} color={dm.sub} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: fs(11), color: dm.sub, fontWeight: 700 }}>Horário da medição</div>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ fontSize: fs(16), fontWeight: 700, color: dm.text, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', width: '100%', marginTop: 2 }}
            />
          </div>
        </div>

        {/* Notes */}
        <div style={{ background: dm.card, borderRadius: 18, padding: '16px', boxShadow: '0 2px 16px rgba(94,143,192,0.06)' }}>
          <div style={{ fontSize: fs(12), color: dm.sub, fontWeight: 700, marginBottom: 8 }}>📝 Observações</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: jejum de 8 horas, 2h após o almoço..."
            rows={2}
            style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: fs(14), color: dm.text, fontFamily: 'inherit', resize: 'none' }}
          />
        </div>

        <button
          onClick={handleSave}
          className="btn-press"
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: 18,
            background: saved ? `linear-gradient(135deg,${P.success},${P.accent})` : `linear-gradient(135deg,${statusC},${P.primaryDk})`,
            color: '#fff',
            fontSize: fs(17),
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: `0 6px 24px ${statusC}45`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {saved ? (
            <>
              <Check size={22} /> Glicemia Registrada!
            </>
          ) : (
            '🩸 Salvar Glicemia'
          )}
        </button>

        <div style={{ background: dm.card, borderRadius: 18, padding: '16px', boxShadow: '0 2px 16px rgba(94,143,192,0.06)' }}>
          <div style={{ fontSize: fs(13), fontWeight: 700, color: dm.text, marginBottom: 12 }}>Glicemia dos Últimos Dias</div>
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={glucoseData}>
              <defs>
                <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={P.warn} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={P.warn} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dm.border} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[60, 180]} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }} />
              <Area type="monotone" dataKey="value" stroke={P.warn} fill="url(#gg)" strokeWidth={2.5} dot={{ r: 4, fill: P.warn }} name="mg/dL" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export function VoiceScreen({
  dm,
  fs,
  onBack,
  isListening,
  setIsListening,
  voiceText,
  setVoiceText,
  onSaveVoice,
}: {
  dm: ThemeColors
  fs: (n: number) => number
  onBack: () => void
  isListening: boolean
  setIsListening: (l: boolean) => void
  voiceText: string
  setVoiceText: (t: string) => void
  onSaveVoice: (recognizedText: string) => void
}) {
  const [waves, setWaves] = useState(Array(14).fill(0.3))

  useEffect(() => {
    if (!isListening) return
    const i = setInterval(() => setWaves((w) => w.map(() => 0.15 + Math.random() * 0.85)), 120)
    return () => clearInterval(i)
  }, [isListening])

  const samplePrompts = [
    'Minha pressão foi 12 por 8',
    'Pressão 130 por 85 com 74 batimentos',
    'Glicemia 110 em jejum',
    'Minha pressão deu 14 por 9',
    'Glicemia 145 após almoço',
  ]

  const triggerPrompt = (text: string) => {
    setIsListening(true)
    setTimeout(() => {
      setVoiceText(text)
      setIsListening(false)
    }, 1200)
  }

  // Parse voice text preview
  const parseVoice = (text: string) => {
    const t = text.toLowerCase()
    if (t.includes('12 por 8') || t.includes('120') || t.includes('12/8')) {
      return { type: 'pressure', sys: 120, dia: 80, hr: 72, label: 'Pressão 120/80 mmHg interpretada' }
    }
    if (t.includes('130 por 85') || t.includes('13 por 8')) {
      return { type: 'pressure', sys: 130, dia: 85, hr: 74, label: 'Pressão 130/85 mmHg (74 bpm) interpretada' }
    }
    if (t.includes('14 por 9') || t.includes('140')) {
      return { type: 'pressure', sys: 140, dia: 90, hr: 78, label: 'Pressão 140/90 mmHg (Alerta) interpretada' }
    }
    if (t.includes('110') || t.includes('jejum')) {
      return { type: 'glucose', val: 110, label: 'Glicemia 110 mg/dL (Jejum) interpretada' }
    }
    if (t.includes('145') || t.includes('almoço')) {
      return { type: 'glucose', val: 145, label: 'Glicemia 145 mg/dL (Pós-prandial) interpretada' }
    }
    return { type: 'pressure', sys: 120, dia: 80, hr: 72, label: 'Registro interpretado com sucesso' }
  }

  const parsed = voiceText ? parseVoice(voiceText) : null

  return (
    <div style={{ background: dm.bg, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <BackHeader title="🎤 Registro por Voz" onBack={onBack} color={P.purple} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', gap: 20, overflowY: 'auto' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: fs(18), fontWeight: 800, color: dm.text }}>
            {isListening ? 'Ouvindo sua voz…' : voiceText ? 'Áudio processado!' : 'Fale sua medição'}
          </div>
          <div style={{ fontSize: fs(13), color: dm.sub, marginTop: 4 }}>
            {isListening ? 'Fale de forma clara e natural' : 'Toque no microfone ou escolha um exemplo'}
          </div>
        </div>

        {/* Audio waves */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 50, padding: '0 8px' }}>
          {waves.map((h, i) => (
            <div
              key={i}
              style={{
                width: 4,
                borderRadius: 2,
                background: isListening ? P.purple : '#CBD5E1',
                height: isListening ? h * 46 : 8,
                transition: 'height 0.12s ease',
              }}
            />
          ))}
        </div>

        {/* Mic button */}
        <div style={{ position: 'relative' }}>
          {isListening &&
            [1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  inset: -i * 16,
                  borderRadius: '50%',
                  border: `2px solid ${P.purple}${40 - i * 10}`,
                  animation: `pulse-ring ${1.2 + i * 0.4}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          <button
            onClick={() => {
              if (isListening) {
                setIsListening(false)
              } else {
                triggerPrompt(samplePrompts[Math.floor(Math.random() * samplePrompts.length)])
              }
            }}
            className="btn-press"
            style={{
              width: 110,
              height: 110,
              borderRadius: '50%',
              background: isListening ? `linear-gradient(135deg,${P.purple},#5A6DC4)` : '#E0E8F8',
              border: `4px solid ${isListening ? '#8EA3E8' : '#C8D4F4'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening ? `0 0 0 0 ${P.purple}50, 0 10px 40px ${P.purple}50` : '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s',
            }}
          >
            {isListening ? <MicOff size={42} color="#fff" /> : <Mic size={42} color={P.purple} />}
          </button>
        </div>
        <div style={{ fontSize: fs(12), color: dm.sub, fontWeight: 600 }}>{isListening ? 'Ouvindo...' : 'Toque para falar'}</div>

        {voiceText && parsed && (
          <div
            style={{
              background: dm.card,
              borderRadius: 20,
              padding: '18px',
              width: '100%',
              boxShadow: '0 4px 24px rgba(107,127,212,0.15)',
              border: `1.5px solid ${P.purple}30`,
              animation: 'float-up 0.4s ease',
            }}
          >
            <div style={{ fontSize: fs(11), color: P.purple, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Volume2 size={14} /> RECONHECIMENTO DE VOZ
            </div>
            <div style={{ fontSize: fs(15), fontWeight: 700, color: dm.text, marginBottom: 10 }}>"{voiceText}"</div>
            <div style={{ background: '#D0F2E8', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Check size={16} color={P.success} />
              <span style={{ fontSize: fs(12), color: '#1E9B5A', fontWeight: 700 }}>{parsed.label}</span>
            </div>
            <button
              onClick={() => onSaveVoice(voiceText)}
              className="btn-press"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 14,
                background: `linear-gradient(135deg,${P.purple},#5A6DC4)`,
                color: '#fff',
                fontSize: fs(14),
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: `0 4px 16px ${P.purple}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Sparkles size={16} /> Confirmar e salvar medição
            </button>
          </div>
        )}

        <div style={{ background: dm.card, borderRadius: 18, padding: '16px', width: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: fs(11), fontWeight: 700, color: dm.sub, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
            Ou selecione um comando de exemplo:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {samplePrompts.map((ex) => (
              <button
                key={ex}
                onClick={() => triggerPrompt(ex)}
                className="btn-press"
                style={{
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: `1px solid ${dm.border}`,
                  background: 'transparent',
                  textAlign: 'left',
                  fontSize: fs(12),
                  color: dm.text,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>💬</span>
                <span style={{ flex: 1 }}>{ex}</span>
                <span style={{ fontSize: 10, color: P.purple, fontWeight: 700 }}>Testar →</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
