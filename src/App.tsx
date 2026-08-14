import { useState, useEffect } from 'react'
import { Screen, Appointment, P, HealthRecord, ClinicalAlert, NetworkPerson, UserProfile } from './types/figma'
import { GlobalCSS, NavBar, Toast } from './components/figma/CommonComponents'
import { SplashScreen, OnboardingScreen, LoginScreen, RegisterScreen } from './components/figma/AuthScreens'
import { HomeScreen } from './components/figma/HomeScreen'
import { PressureScreen, GlucoseScreen, VoiceScreen } from './components/figma/MeasurementScreens'
import { HistoryScreen, DashboardScreen, AlertsScreen } from './components/figma/AnalyticsScreens'
import { NetworkScreen, ProfileScreen, SettingsScreen, EmergencyScreen } from './components/figma/UserScreens'
import { AppointmentsScreen, NewAppointmentScreen } from './components/figma/AppointmentScreens'
import { Phone, PhoneOff, Check, X, Share2, Copy, MessageCircle } from 'lucide-react'

const initialAppointments: Appointment[] = [
  {
    id: 1,
    doctor: 'Dr. Carlos Mendes',
    specialty: 'Cardiologia',
    location: 'UBS Jardim das Flores — R. das Rosas, 120',
    date: '2026-07-21',
    time: '09:00',
    type: 'presencial',
    status: 'confirmed',
    notes: 'Trazer exames de sangue recentes.',
    bookedBy: 'João Silva',
    forPatient: 'João Silva',
  },
  {
    id: 2,
    doctor: 'Dra. Fernanda Lima',
    specialty: 'Endocrinologia',
    location: 'UBS Centro — Av. da Saudade, 450',
    date: '2026-07-28',
    time: '14:30',
    type: 'presencial',
    status: 'pending',
    notes: 'Avaliação da curva glicêmica.',
    bookedBy: 'Ana Silva (Filha)',
    forPatient: 'João Silva',
  },
  {
    id: 3,
    doctor: 'Dr. Paulo Ramos',
    specialty: 'Clínica Geral',
    location: 'Teleconsulta — App SEDA',
    date: '2026-08-05',
    time: '10:00',
    type: 'teleconsulta',
    status: 'confirmed',
    notes: 'Revisão das medições de pressão do mês.',
    bookedBy: 'João Silva',
    forPatient: 'João Silva',
  },
  {
    id: 4,
    doctor: 'Dr. Carlos Mendes',
    specialty: 'Cardiologia',
    location: 'UBS Jardim das Flores',
    date: '2026-06-10',
    time: '09:00',
    type: 'presencial',
    status: 'completed',
    notes: 'Ajuste de dosagem de Losartana 50mg.',
    bookedBy: 'Maria Silva',
    forPatient: 'João Silva',
  },
]

const initialRecords: HealthRecord[] = [
  { id: 1, date: '20 Jul 2026', time: '08:15', sys: 120, dia: 80, hr: 72, glucose: 110, status: 'normal', notes: 'Medição matinal em jejum.' },
  { id: 2, date: '19 Jul 2026', time: '19:40', sys: 135, dia: 88, hr: 76, glucose: 0, status: 'attention', notes: 'Após caminhada leve.' },
  { id: 3, date: '18 Jul 2026', time: '08:00', sys: 122, dia: 78, hr: 70, glucose: 105, status: 'normal' },
  { id: 4, date: '17 Jul 2026', time: '08:20', sys: 128, dia: 82, hr: 74, glucose: 118, status: 'normal' },
  { id: 5, date: '16 Jul 2026', time: '20:10', sys: 140, dia: 90, hr: 80, glucose: 0, status: 'alert', notes: 'Sentiu leve dor de cabeça.' },
  { id: 6, date: '15 Jul 2026', time: '08:05', sys: 125, dia: 80, hr: 72, glucose: 112, status: 'normal' },
  { id: 7, date: '14 Jul 2026', time: '08:10', sys: 130, dia: 85, hr: 75, glucose: 124, status: 'attention' },
]

const initialPeople: NetworkPerson[] = [
  { id: 1, name: 'Ana Silva', role: 'Filha & Cuidadora Principal', avatar: 'AS', color: P.accent, status: 'online', relation: 'Filha', phone: '(11) 98765-4321' },
  { id: 2, name: 'Dra. Mariana Costa', role: 'Médica de Família — UBS Centro', avatar: 'MC', color: P.danger, status: 'online', relation: 'Médica', phone: '(11) 3456-7890' },
  { id: 3, name: 'Dr. Carlos Mendes', role: 'Cardiologista — UBS Flores', avatar: 'CM', color: P.primary, status: 'away', relation: 'Especialista', phone: '(11) 3322-1100' },
  { id: 4, name: 'Roberto Silva', role: 'Filho', avatar: 'RS', color: P.purple, status: 'offline', relation: 'Filho', phone: '(11) 91234-5678' },
]

const initialAlerts: ClinicalAlert[] = [
  {
    id: 1,
    icon: '❤️',
    title: 'Pressão Sistólica Elevada (140 mmHg)',
    desc: 'Registrada no dia 16/07. Recomendado aferir novamente em repouso e beber água.',
    time: 'Há 4 dias',
    color: P.danger,
    actionType: 'pressure',
  },
  {
    id: 2,
    icon: '💊',
    title: 'Lembrete: Tomar Losartana 50mg',
    desc: 'Horário programado das 20:00. Mantenha a adesão ao tratamento.',
    time: 'Hoje, 20:00',
    color: P.purple,
    actionType: 'medicine',
  },
  {
    id: 3,
    icon: '📅',
    title: 'Consulta Amanhã com Dr. Carlos',
    desc: 'Às 09:00 na UBS Jardim das Flores. Lembre-se de levar seus exames.',
    time: 'Amanhã',
    color: P.primary,
    actionType: 'appointment',
  },
]

const initialProfile: UserProfile = {
  name: 'João Silva',
  role: 'Paciente SUS',
  age: 68,
  cpf: '123.456.789-00',
  phone: '(11) 98765-4321',
  birthDate: '15/03/1958',
  bloodType: 'O+',
  medications: ['Losartana 50mg (1x ao dia)', 'Metformina 850mg (2x ao dia)', 'Sinvastatina 20mg (à noite)'],
  conditions: ['Hipertensão Arterial Sistêmica', 'Diabetes Mellitus Tipo 2'],
  emergencyContact: {
    name: 'Ana Silva',
    relation: 'Filha',
    phone: '(11) 98765-4321',
  },
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [onbStep, setOnbStep] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [voiceText, setVoiceText] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState('normal')
  const [activeTab, setActiveTab] = useState('home')

  // Clinical Vitals State
  const [pressSys, setPressSys] = useState(120)
  const [pressDia, setPressDia] = useState(80)
  const [heartRate, setHeartRate] = useState(72)
  const [glucose, setGlucose] = useState(110)
  const [mealTime, setMealTime] = useState<'before' | 'after'>('before')
  const [filterPeriod, setFilter] = useState('7d')
  const [pressSaved, setPressSaved] = useState(false)
  const [glucSaved, setGlucSaved] = useState(false)

  // Lists State
  const [appointments, setAppts] = useState<Appointment[]>(initialAppointments)
  const [historyRecords, setHistoryRecords] = useState<HealthRecord[]>(initialRecords)
  const [people, setPeople] = useState<NetworkPerson[]>(initialPeople)
  const [alerts, setAlerts] = useState<ClinicalAlert[]>(initialAlerts)
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile)

  // Modals & Feedback
  const [emergencyConfirm, setEConf] = useState(false)
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'warning' | 'error' | 'info' } | null>(null)
  const [callingState, setCallingState] = useState<{ name: string; phone: string; seconds: number } | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  const showToast = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
  }

  const scale = fontSize === 'large' ? 1.12 : fontSize === 'xl' ? 1.26 : 1
  const fs = (n: number) => Math.round(n * scale)

  const dm = {
    bg: darkMode ? '#0C1F35' : P.bg,
    card: darkMode ? '#132840' : P.card,
    text: darkMode ? '#EEF4F8' : P.textMain,
    sub: darkMode ? '#94A3B8' : P.textSub,
    border: darkMode ? '#1E3A5F' : P.border,
  }

  useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(() => setScreen('onboarding'), 2600)
      return () => clearTimeout(t)
    }
  }, [screen])

  // Call timer simulation
  useEffect(() => {
    let t: any
    if (callingState) {
      t = setInterval(() => {
        setCallingState((prev) => (prev ? { ...prev, seconds: prev.seconds + 1 } : null))
      }, 1000)
    }
    return () => clearInterval(t)
  }, [callingState])

  const go = (s: Screen) => {
    setScreen(s)
    if (['home', 'history', 'alerts', 'network', 'profile'].includes(s)) {
      setActiveTab(s)
    }
  }

  const isMain = ['home', 'history', 'alerts', 'network', 'profile', 'dashboard', 'appointments'].includes(screen)

  // Handlers for measurements
  const handleSavePressure = (sys: number, dia: number, hr: number, notes?: string) => {
    setPressSys(sys)
    setPressDia(dia)
    setHeartRate(hr)
    setPressSaved(true)

    const status = sys >= 140 ? 'alert' : sys >= 130 ? 'attention' : 'normal'
    const newRecord: HealthRecord = {
      id: Date.now(),
      date: 'Hoje, ' + new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      sys,
      dia,
      hr,
      glucose: 0,
      status,
      notes: notes || 'Medição via app SEDA',
    }

    setHistoryRecords((prev) => [newRecord, ...prev])
    showToast(`❤️ Pressão salva: ${sys}/${dia} mmHg (${status === 'normal' ? 'Normal' : status === 'attention' ? 'Atenção' : 'Alerta'})`, status === 'alert' ? 'warning' : 'success')

    setTimeout(() => {
      setPressSaved(false)
      go('home')
    }, 1200)
  }

  const handleSaveGlucose = (val: number, meal: 'before' | 'after', time: string, notes?: string) => {
    setGlucose(val)
    setMealTime(meal)
    setGlucSaved(true)

    const status = val > 126 ? 'alert' : val < 70 ? 'attention' : 'normal'
    const newRecord: HealthRecord = {
      id: Date.now(),
      date: 'Hoje, ' + new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      time,
      sys: 0,
      dia: 0,
      hr: 0,
      glucose: val,
      status,
      notes: (meal === 'before' ? 'Jejum • ' : 'Pós-prandial • ') + (notes || ''),
    }

    setHistoryRecords((prev) => [newRecord, ...prev])
    showToast(`🩸 Glicemia salva: ${val} mg/dL (${meal === 'before' ? 'Jejum' : 'Pós-refeição'})`, status === 'alert' ? 'warning' : 'success')

    setTimeout(() => {
      setGlucSaved(false)
      go('home')
    }, 1200)
  }

  const handleSaveVoice = (recognizedText: string) => {
    const t = recognizedText.toLowerCase()
    let sys = 120
    let dia = 80
    let hr = 72
    let gluc = 0

    if (t.includes('14 por 9') || t.includes('140')) {
      sys = 140
      dia = 90
      hr = 78
    } else if (t.includes('130 por 85') || t.includes('13 por 8')) {
      sys = 130
      dia = 85
      hr = 74
    } else if (t.includes('145')) {
      gluc = 145
    } else if (t.includes('110')) {
      gluc = 110
    }

    if (gluc > 0) {
      setGlucose(gluc)
      setHistoryRecords((prev) => [
        {
          id: Date.now(),
          date: 'Hoje, ' + new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          sys: 0,
          dia: 0,
          hr: 0,
          glucose: gluc,
          status: gluc > 126 ? 'alert' : 'normal',
          notes: 'Registro por comando de voz: "' + recognizedText + '"',
        },
        ...prev,
      ])
      showToast(`🎤 Glicemia de ${gluc} mg/dL registrada por voz!`, 'success')
    } else {
      setPressSys(sys)
      setPressDia(dia)
      setHeartRate(hr)
      setHistoryRecords((prev) => [
        {
          id: Date.now(),
          date: 'Hoje, ' + new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          sys,
          dia,
          hr,
          glucose: 0,
          status: sys >= 140 ? 'alert' : sys >= 130 ? 'attention' : 'normal',
          notes: 'Registro por comando de voz: "' + recognizedText + '"',
        },
        ...prev,
      ])
      showToast(`🎤 Pressão ${sys}/${dia} mmHg registrada por voz!`, 'success')
    }

    go('home')
  }

  const handleDismissAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
    showToast('Alerta dispensado.', 'info')
  }

  const handleDeleteRecord = (id: number) => {
    setHistoryRecords((prev) => prev.filter((r) => r.id !== id))
    showToast('Registro excluído do histórico.', 'info')
  }

  const handleCopyReport = () => {
    const reportText = `📋 *RELATÓRIO CLÍNICO SEDA — PACIENTE JOÃO SILVA*\n` +
      `Idade: 68 anos | CPF: 123.456.789-00\n` +
      `Data de emissão: ${new Date().toLocaleDateString('pt-BR')}\n\n` +
      `❤️ *Última Pressão Arterial:* ${pressSys}/${pressDia} mmHg (Pulso: ${heartRate} bpm)\n` +
      `🩸 *Última Glicemia:* ${glucose} mg/dL (${mealTime === 'before' ? 'Jejum' : 'Pós-refeição'})\n` +
      `💊 *Medicamentos:* Losartana 50mg, Metformina 850mg\n` +
      `🏥 *Unidade de Saúde de Referência:* UBS Centro — SUS`

    navigator.clipboard.writeText(reportText)
    showToast('📋 Relatório copiado para a área de transferência!', 'success')
    setShowShareModal(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: darkMode ? '#060F1A' : '#C8D8E8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 0',
        fontFamily: "'Inter',system-ui,sans-serif",
      }}
    >
      <GlobalCSS />
      <div
        style={{
          width: 390,
          height: 844,
          background: dm.bg,
          borderRadius: 44,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.35), 0 0 0 10px #1E3A5F, 0 0 0 12px #4A6080',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Floating Toast */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Status bar */}
        <div
          style={{
            height: 44,
            background: ['splash', 'onboarding'].includes(screen) ? 'transparent' : dm.card,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            flexShrink: 0,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: ['splash', 'onboarding'].includes(screen) ? '#fff' : dm.text }}>9:41</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div
              style={{
                width: 17,
                height: 11,
                border: `2px solid ${['splash', 'onboarding'].includes(screen) ? '#fff' : dm.text}`,
                borderRadius: 3,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 1,
                  top: 1,
                  bottom: 1,
                  width: '75%',
                  background: ['splash', 'onboarding'].includes(screen) ? '#fff' : dm.text,
                  borderRadius: 1,
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {[4, 6, 8, 10].map((h) => (
                <div key={h} style={{ width: 3, height: h, background: ['splash', 'onboarding'].includes(screen) ? '#fff' : dm.text, borderRadius: 1 }} />
              ))}
            </div>
          </div>
        </div>

        {/* Screens container */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {screen === 'splash' && <SplashScreen />}
          {screen === 'onboarding' && <OnboardingScreen step={onbStep} setStep={setOnbStep} onDone={() => go('login')} />}
          {screen === 'login' && <LoginScreen onLogin={() => go('home')} onRegister={() => go('register')} dm={dm} fs={fs} />}
          {screen === 'register' && (
            <RegisterScreen
              onBack={() => go('login')}
              onDone={() => {
                showToast('Conta criada com sucesso!', 'success')
                go('home')
              }}
              dm={dm}
              fs={fs}
            />
          )}

          {isMain && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {screen === 'home' && (
                  <HomeScreen
                    dm={dm}
                    fs={fs}
                    go={go}
                    appointments={appointments}
                    pressSys={pressSys}
                    pressDia={pressDia}
                    glucose={glucose}
                  />
                )}
                {screen === 'history' && (
                  <HistoryScreen
                    dm={dm}
                    fs={fs}
                    filter={filterPeriod}
                    setFilter={setFilter}
                    records={historyRecords}
                    onDeleteRecord={handleDeleteRecord}
                    onExport={() => setShowShareModal(true)}
                  />
                )}
                {screen === 'alerts' && (
                  <AlertsScreen
                    dm={dm}
                    fs={fs}
                    alerts={alerts}
                    onDismissAlert={handleDismissAlert}
                    onTakeAction={(action) => {
                      if (action === 'pressure') go('pressure')
                      else if (action === 'glucose') go('glucose')
                      else if (action === 'appointment') go('appointments')
                      else if (action === 'emergency') go('emergency')
                      else if (action === 'medicine') showToast('Lembrete de medicação confirmado.', 'info')
                    }}
                  />
                )}
                {screen === 'network' && (
                  <NetworkScreen
                    dm={dm}
                    fs={fs}
                    people={people}
                    onAddPerson={(p) => {
                      setPeople((prev) => [...prev, p])
                      showToast(`${p.name} adicionado(a) à sua rede!`, 'success')
                    }}
                    onShareReport={() => setShowShareModal(true)}
                    onCallPerson={(name, phone) => setCallingState({ name, phone, seconds: 0 })}
                    onMessagePerson={(name) => showToast(`Abrindo conversa com ${name}...`, 'info')}
                  />
                )}
                {screen === 'profile' && (
                  <ProfileScreen
                    dm={dm}
                    fs={fs}
                    go={go}
                    profile={userProfile}
                    onUpdateProfile={(p) => {
                      setUserProfile(p)
                      showToast('Perfil atualizado com sucesso!', 'success')
                    }}
                  />
                )}
                {screen === 'dashboard' && <DashboardScreen dm={dm} fs={fs} records={historyRecords} />}
                {screen === 'appointments' && (
                  <AppointmentsScreen
                    dm={dm}
                    fs={fs}
                    go={go}
                    appointments={appointments}
                    setAppts={setAppts}
                    onShowToast={showToast}
                  />
                )}
              </div>
              <NavBar active={activeTab} onTab={(t) => go(t as Screen)} />
            </div>
          )}

          {screen === 'pressure' && (
            <PressureScreen
              dm={dm}
              fs={fs}
              onBack={() => go('home')}
              sys={pressSys}
              setSys={setPressSys}
              dia={pressDia}
              setDia={setPressDia}
              hr={heartRate}
              setHr={setHeartRate}
              saved={pressSaved}
              onSave={handleSavePressure}
            />
          )}

          {screen === 'glucose' && (
            <GlucoseScreen
              dm={dm}
              fs={fs}
              onBack={() => go('home')}
              value={glucose}
              setValue={setGlucose}
              mealTime={mealTime}
              setMealTime={setMealTime}
              saved={glucSaved}
              onSave={handleSaveGlucose}
            />
          )}

          {screen === 'voice' && (
            <VoiceScreen
              dm={dm}
              fs={fs}
              onBack={() => go('home')}
              isListening={isListening}
              setIsListening={setIsListening}
              voiceText={voiceText}
              setVoiceText={setVoiceText}
              onSaveVoice={handleSaveVoice}
            />
          )}

          {screen === 'emergency' && (
            <EmergencyScreen
              dm={dm}
              fs={fs}
              onBack={() => go('home')}
              confirm={emergencyConfirm}
              setConfirm={setEConf}
              onShareLocation={() => showToast('📍 Localização GPS compartilhada com a UBS Centro!', 'info')}
              onCallContact={() => setCallingState({ name: 'Ana Silva (Filha)', phone: '(11) 98765-4321', seconds: 0 })}
              onDispatchHealthTeam={() => showToast('🚨 Equipe do SAMU e UBS acionadas com prioridade máxima!', 'warning')}
            />
          )}

          {screen === 'settings' && (
            <SettingsScreen
              dm={dm}
              fs={fs}
              onBack={() => go('profile')}
              darkMode={darkMode}
              setDarkMode={(d) => {
                setDarkMode(d)
                showToast(`Modo ${d ? 'escuro' : 'claro'} ativado.`, 'info')
              }}
              fontSize={fontSize}
              setFontSize={(f) => {
                setFontSize(f)
                showToast(`Tamanho de fonte: ${f}`, 'info')
              }}
              onExportData={() => setShowShareModal(true)}
            />
          )}

          {screen === 'new-appointment' && (
            <NewAppointmentScreen
              dm={dm}
              fs={fs}
              onBack={() => go('appointments')}
              onSave={(a) => {
                setAppts((p) => [a, ...p])
                showToast(`📅 Consulta com ${a.doctor} agendada!`, 'success')
                go('appointments')
              }}
            />
          )}
        </div>

        {/* Simulated Phone Call Modal */}
        {callingState && (
          <div style={{ position: 'absolute', inset: 0, background: '#0B132B', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '60px 24px 48px', animation: 'fade-in 0.25s ease' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: `${P.accent}30`, border: `3px solid ${P.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 36 }}>
                📞
              </div>
              <div style={{ fontSize: fs(22), fontWeight: 800, color: '#fff' }}>{callingState.name}</div>
              <div style={{ fontSize: fs(14), color: '#94A3B8', marginTop: 4 }}>{callingState.phone}</div>
              <div style={{ marginTop: 14, background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: 20, display: 'inline-block' }}>
                <span style={{ fontSize: fs(13), color: P.accent, fontWeight: 700 }}>
                  Em chamada • {Math.floor(callingState.seconds / 60).toString().padStart(2, '0')}:{(callingState.seconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 20 }}>
              <button
                onClick={() => {
                  setCallingState(null)
                  showToast('Chamada encerrada.', 'info')
                }}
                className="btn-press"
                style={{ width: 68, height: 68, borderRadius: '50%', background: P.danger, border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 32px ${P.danger}60` }}
              >
                <PhoneOff size={30} />
              </button>
            </div>
          </div>
        )}

        {/* Share Medical Report Modal */}
        {showShareModal && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 45, display: 'flex', alignItems: 'flex-end', animation: 'fade-in 0.2s ease' }}>
            <div style={{ background: dm.card, borderRadius: '24px 24px 0 0', padding: '22px 20px 32px', width: '100%', maxHeight: '85%', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: fs(17), fontWeight: 800, color: dm.text }}>Relatório Clínico SEDA</div>
                <button onClick={() => setShowShareModal(false)} style={{ background: 'none', border: 'none', color: dm.sub, cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Report Preview */}
              <div style={{ background: dm.bg, padding: '14px', borderRadius: 16, border: `1px solid ${dm.border}`, marginBottom: 16, fontSize: fs(12), color: dm.text, lineHeight: 1.6 }}>
                <div style={{ fontWeight: 800, color: P.primary, marginBottom: 4 }}>📋 RESUMO CLÍNICO (ÚLTIMOS 7 DIAS)</div>
                <div><b>Paciente:</b> {userProfile.name} ({userProfile.age} anos)</div>
                <div><b>Última Pressão:</b> {pressSys}/{pressDia} mmHg ({heartRate} bpm)</div>
                <div><b>Última Glicemia:</b> {glucose} mg/dL ({mealTime === 'before' ? 'Jejum' : 'Pós-refeição'})</div>
                <div><b>Adesão Medicamentosa:</b> 100% (Losartana 50mg, Metformina)</div>
                <div><b>UBS de Referência:</b> UBS Centro — SUS</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={handleCopyReport}
                  className="btn-press"
                  style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: 14,
                    background: `linear-gradient(135deg,${P.primary},${P.primaryDk})`,
                    color: '#fff',
                    fontSize: fs(14),
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <Copy size={16} /> Copiar Relatório Completo
                </button>
                <button
                  onClick={() => {
                    showToast('Compartilhando via WhatsApp...', 'info')
                    setShowShareModal(false)
                  }}
                  className="btn-press"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 14,
                    background: '#25D366',
                    color: '#fff',
                    fontSize: fs(14),
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <MessageCircle size={16} /> Enviar no WhatsApp da Família
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
