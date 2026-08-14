import React, { useState, useEffect } from 'react'
import { P, Screen, ThemeColors, NetworkPerson, UserProfile } from '../../types/figma'
import { BackHeader } from './CommonComponents'
import {
  Share2,
  Plus,
  Edit,
  Pill,
  Settings,
  LogOut,
  Moon,
  Sun,
  Globe,
  Shield,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Phone,
  MapPin,
  AlertTriangle,
  X,
  Check,
  Send,
  Download,
  Copy,
  User,
  Heart,
  MessageCircle,
} from 'lucide-react'

export function NetworkScreen({
  dm,
  fs,
  people,
  onAddPerson,
  onShareReport,
  onCallPerson,
  onMessagePerson,
}: {
  dm: ThemeColors
  fs: (n: number) => number
  people: NetworkPerson[]
  onAddPerson: (p: NetworkPerson) => void
  onShareReport: () => void
  onCallPerson: (name: string, phone: string) => void
  onMessagePerson: (name: string) => void
}) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('Familiar')
  const [newPhone, setNewPhone] = useState('')
  const [newRelation, setNewRelation] = useState('Familiar')

  const dotColor = (s: string) => (s === 'online' ? P.success : s === 'away' ? P.warn : P.danger)

  const handleAdd = () => {
    if (!newName.trim()) return
    const initials = newName
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
    onAddPerson({
      id: Date.now(),
      name: newName.trim(),
      role: newRole,
      avatar: initials || 'CO',
      color: newRole.includes('Médic') || newRole.includes('Enferm') ? P.danger : P.accent,
      status: 'online',
      relation: newRelation,
      phone: newPhone || '(11) 99999-9999',
    })
    setNewName('')
    setNewPhone('')
    setShowAddModal(false)
  }

  return (
    <div style={{ background: dm.bg, minHeight: '100%', paddingBottom: 24, position: 'relative' }}>
      <div style={{ background: `linear-gradient(135deg,${P.accent},#3DAB7A)`, padding: '18px 20px 22px' }}>
        <div style={{ fontSize: fs(20), fontWeight: 800, color: '#fff' }}>👨‍👩‍👧 Rede de Cuidado</div>
        <div style={{ fontSize: fs(13), color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>
          {people.length} pessoas conectadas ao seu cuidado
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <button
          onClick={onShareReport}
          className="btn-press"
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: 16,
            background: `linear-gradient(135deg,${P.accent},#3DAB7A)`,
            color: '#fff',
            fontSize: fs(15),
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 16,
            boxShadow: `0 6px 24px ${P.accent}40`,
          }}
        >
          <Share2 size={18} /> Compartilhar Relatório Médico
        </button>

        {people.map((p, i) => (
          <div key={p.id || p.name}>
            <div
              style={{
                background: dm.card,
                borderRadius: 18,
                padding: '14px 16px',
                boxShadow: '0 2px 12px rgba(94,143,192,0.07)',
                border: `1px solid ${dm.border}`,
                animation: `float-up 0.4s ease ${i * 0.05}s both`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: p.color + '18',
                      border: `2.5px solid ${p.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: fs(14),
                      fontWeight: 800,
                      color: p.color,
                    }}
                  >
                    {p.avatar}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 1,
                      right: 1,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: dotColor(p.status),
                      border: '2px solid #fff',
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: fs(14), fontWeight: 700, color: dm.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: fs(11), color: dm.sub }}>{p.role} • {p.phone}</div>
                </div>
                <div style={{ padding: '4px 10px', borderRadius: 20, background: p.color + '14' }}>
                  <span style={{ fontSize: fs(10), fontWeight: 700, color: p.color }}>{p.relation}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8, marginTop: 12, borderTop: `1px solid ${dm.border}`, paddingTop: 10 }}>
                <button
                  onClick={() => onCallPerson(p.name, p.phone)}
                  className="btn-press"
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 10,
                    background: `${P.primary}12`,
                    border: 'none',
                    color: P.primary,
                    fontSize: fs(12),
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    fontFamily: 'inherit',
                  }}
                >
                  <Phone size={14} /> Ligar
                </button>
                <button
                  onClick={() => onMessagePerson(p.name)}
                  className="btn-press"
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 10,
                    background: `${P.accent}12`,
                    border: 'none',
                    color: P.accent,
                    fontSize: fs(12),
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    fontFamily: 'inherit',
                  }}
                >
                  <MessageCircle size={14} /> Mensagem
                </button>
              </div>
            </div>
            {i < people.length - 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
                <div style={{ width: 2, height: 10, background: dm.border, borderRadius: 1 }} />
              </div>
            )}
          </div>
        ))}

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-press"
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 16,
            border: `2px dashed ${dm.border}`,
            background: 'transparent',
            color: dm.sub,
            fontSize: fs(14),
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 14,
            fontFamily: 'inherit',
          }}
        >
          <Plus size={18} /> Adicionar à rede
        </button>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30, display: 'flex', alignItems: 'flex-end', animation: 'fade-in 0.2s ease' }}>
          <div style={{ background: dm.card, borderRadius: '24px 24px 0 0', padding: '20px 20px 32px', width: '100%', boxShadow: '0 -8px 40px rgba(0,0,0,0.25)', maxHeight: '85%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: fs(17), fontWeight: 800, color: dm.text }}>Adicionar à Rede de Cuidado</div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: dm.sub, cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: fs(12), fontWeight: 700, color: dm.text }}>Nome completo</span>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Dra. Mariana Costa"
                  style={{ width: '100%', padding: '12px', borderRadius: 12, border: `2px solid ${dm.border}`, background: dm.bg, color: dm.text, fontSize: fs(14), outline: 'none' }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: fs(12), fontWeight: 700, color: dm.text }}>Papel / Função</span>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: 12, border: `2px solid ${dm.border}`, background: dm.bg, color: dm.text, fontSize: fs(14), outline: 'none' }}
                >
                  <option>Familiar / Cuidador</option>
                  <option>Médico(a)</option>
                  <option>Enfermeiro(a)</option>
                  <option>Agente Comunitário SUS</option>
                  <option>Nutricionista</option>
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: fs(12), fontWeight: 700, color: dm.text }}>Relação / Vínculo</span>
                <input
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  placeholder="Ex: Filho, Vizinho, UBS Centro"
                  style={{ width: '100%', padding: '12px', borderRadius: 12, border: `2px solid ${dm.border}`, background: dm.bg, color: dm.text, fontSize: fs(14), outline: 'none' }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: fs(12), fontWeight: 700, color: dm.text }}>Telefone / WhatsApp</span>
                <input
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  style={{ width: '100%', padding: '12px', borderRadius: 12, border: `2px solid ${dm.border}`, background: dm.bg, color: dm.text, fontSize: fs(14), outline: 'none' }}
                />
              </label>

              <button
                onClick={handleAdd}
                className="btn-press"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 14,
                  background: `linear-gradient(135deg,${P.accent},#3DAB7A)`,
                  color: '#fff',
                  fontSize: fs(15),
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: 6,
                }}
              >
                Salvar Contato
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function ProfileScreen({
  dm,
  fs,
  go,
  profile,
  onUpdateProfile,
}: {
  dm: ThemeColors
  fs: (n: number) => number
  go: (s: Screen) => void
  profile: UserProfile
  onUpdateProfile: (p: UserProfile) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState<UserProfile>(profile)
  const [newMed, setNewMed] = useState('')
  const [newCond, setNewCond] = useState('')

  const handleSave = () => {
    onUpdateProfile(editData)
    setEditing(false)
  }

  const addMed = () => {
    if (!newMed.trim()) return
    setEditData((p) => ({ ...p, medications: [...p.medications, newMed.trim()] }))
    setNewMed('')
  }

  const removeMed = (index: number) => {
    setEditData((p) => ({ ...p, medications: p.medications.filter((_, i) => i !== index) }))
  }

  const addCond = () => {
    if (!newCond.trim()) return
    setEditData((p) => ({ ...p, conditions: [...p.conditions, newCond.trim()] }))
    setNewCond('')
  }

  const removeCond = (index: number) => {
    setEditData((p) => ({ ...p, conditions: p.conditions.filter((_, i) => i !== index) }))
  }

  return (
    <div style={{ background: dm.bg, minHeight: '100%', paddingBottom: 24, position: 'relative' }}>
      <div
        style={{
          background: `linear-gradient(160deg,${P.primaryDk},${P.primary} 60%,${P.secondary})`,
          padding: '28px 20px 52px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            border: '4px solid rgba(255,255,255,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: 28,
            fontWeight: 900,
            color: '#fff',
          }}
        >
          {profile.name
            .split(' ')
            .slice(0, 2)
            .map((w) => w[0])
            .join('')}
        </div>
        <div style={{ fontSize: fs(20), fontWeight: 800, color: '#fff' }}>{profile.name}</div>
        <div style={{ fontSize: fs(13), color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>
          {profile.role} • {profile.age} anos
        </div>
        <button
          onClick={() => {
            setEditData(profile)
            setEditing(true)
          }}
          className="btn-press"
          style={{
            marginTop: 12,
            padding: '7px 18px',
            borderRadius: 22,
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.35)',
            color: '#fff',
            fontSize: fs(12),
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Edit size={13} /> Editar perfil
        </button>
      </div>

      <div style={{ padding: '0 16px 20px', marginTop: -24 }}>
        <div style={{ background: dm.card, borderRadius: 20, padding: '18px', boxShadow: '0 4px 24px rgba(94,143,192,0.1)', marginBottom: 12 }}>
          <div style={{ fontSize: fs(11), fontWeight: 700, color: P.primary, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
            Dados Pessoais
          </div>
          {[
            { l: 'CPF', v: profile.cpf },
            { l: 'Telefone', v: profile.phone },
            { l: 'Nascimento', v: profile.birthDate },
            { l: 'Tipo sanguíneo', v: profile.bloodType },
          ].map((r) => (
            <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, marginBottom: 10, borderBottom: `1px solid ${dm.border}` }}>
              <span style={{ fontSize: fs(13), color: dm.sub }}>{r.l}</span>
              <span style={{ fontSize: fs(13), fontWeight: 600, color: dm.text }}>{r.v}</span>
            </div>
          ))}
        </div>

        {/* Medications */}
        <div style={{ background: dm.card, borderRadius: 20, padding: '18px', boxShadow: '0 2px 14px rgba(94,143,192,0.07)', marginBottom: 12 }}>
          <div style={{ fontSize: fs(11), fontWeight: 700, color: P.purple, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
            💊 Medicamentos de Uso Contínuo
          </div>
          {profile.medications.map((m) => (
            <div key={m} style={{ padding: '9px 0', fontSize: fs(13), color: dm.text, borderBottom: `1px solid ${dm.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Pill size={14} color={P.purple} /> {m}
            </div>
          ))}
        </div>

        {/* Conditions */}
        <div style={{ background: dm.card, borderRadius: 20, padding: '18px', boxShadow: '0 2px 14px rgba(94,143,192,0.07)', marginBottom: 12 }}>
          <div style={{ fontSize: fs(11), fontWeight: 700, color: P.danger, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
            🏥 Condições de Saúde Monitoradas
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {profile.conditions.map((c) => (
              <div key={c} style={{ padding: '6px 14px', borderRadius: 20, background: `${P.danger}12`, border: `1.5px solid ${P.danger}25`, fontSize: fs(12), fontWeight: 600, color: P.danger }}>
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div style={{ background: dm.card, borderRadius: 20, padding: '18px', boxShadow: '0 2px 14px rgba(94,143,192,0.07)', marginBottom: 14 }}>
          <div style={{ fontSize: fs(11), fontWeight: 700, color: P.warn, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
            📞 Contato de Emergência
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: `${P.warn}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 800,
                color: P.warn,
              }}
            >
              {profile.emergencyContact.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: fs(14), fontWeight: 700, color: dm.text }}>
                {profile.emergencyContact.name} ({profile.emergencyContact.relation})
              </div>
              <div style={{ fontSize: fs(13), color: dm.sub }}>{profile.emergencyContact.phone}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => go('settings')}
            className="btn-press"
            style={{
              flex: 1,
              padding: '15px',
              borderRadius: 16,
              border: `2px solid ${dm.border}`,
              background: dm.card,
              color: dm.text,
              fontSize: fs(14),
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'inherit',
            }}
          >
            <Settings size={18} /> Configurações
          </button>
          <button
            onClick={() => go('login')}
            className="btn-press"
            style={{
              flex: 1,
              padding: '15px',
              borderRadius: 16,
              border: `2px solid ${P.danger}25`,
              background: `${P.danger}08`,
              color: P.danger,
              fontSize: fs(14),
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'inherit',
            }}
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30, display: 'flex', alignItems: 'flex-end', animation: 'fade-in 0.2s ease' }}>
          <div style={{ background: dm.card, borderRadius: '24px 24px 0 0', padding: '20px 20px 32px', width: '100%', maxHeight: '90%', overflowY: 'auto', boxShadow: '0 -8px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: fs(18), fontWeight: 800, color: dm.text }}>Editar Perfil</div>
              <button onClick={() => setEditing(false)} style={{ background: 'none', border: 'none', color: dm.sub, cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: fs(12), fontWeight: 700, color: dm.text }}>Nome completo</span>
                <input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: 12, border: `2px solid ${dm.border}`, background: dm.bg, color: dm.text, fontSize: fs(14), outline: 'none' }}
                />
              </label>

              <div style={{ display: 'flex', gap: 8 }}>
                <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: fs(12), fontWeight: 700, color: dm.text }}>Idade</span>
                  <input
                    type="number"
                    value={editData.age}
                    onChange={(e) => setEditData({ ...editData, age: Number(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '12px', borderRadius: 12, border: `2px solid ${dm.border}`, background: dm.bg, color: dm.text, fontSize: fs(14), outline: 'none' }}
                  />
                </label>
                <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: fs(12), fontWeight: 700, color: dm.text }}>Tipo Sanguíneo</span>
                  <input
                    value={editData.bloodType}
                    onChange={(e) => setEditData({ ...editData, bloodType: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: 12, border: `2px solid ${dm.border}`, background: dm.bg, color: dm.text, fontSize: fs(14), outline: 'none' }}
                  />
                </label>
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: fs(12), fontWeight: 700, color: dm.text }}>Telefone</span>
                <input
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: 12, border: `2px solid ${dm.border}`, background: dm.bg, color: dm.text, fontSize: fs(14), outline: 'none' }}
                />
              </label>

              {/* Medicines management */}
              <div style={{ marginTop: 6 }}>
                <span style={{ fontSize: fs(12), fontWeight: 700, color: dm.text, display: 'block', marginBottom: 6 }}>Medicamentos</span>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <input
                    value={newMed}
                    onChange={(e) => setNewMed(e.target.value)}
                    placeholder="Adicionar medicamento..."
                    style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${dm.border}`, background: dm.bg, color: dm.text, fontSize: fs(13), outline: 'none' }}
                  />
                  <button onClick={addMed} className="btn-press" style={{ padding: '0 14px', borderRadius: 10, background: P.primary, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                    +
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {editData.medications.map((m, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: dm.bg, padding: '6px 10px', borderRadius: 8, fontSize: fs(12), color: dm.text }}>
                      <span>{m}</span>
                      <button onClick={() => removeMed(idx)} style={{ background: 'none', border: 'none', color: P.danger, cursor: 'pointer', fontSize: 13 }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                className="btn-press"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 14,
                  background: `linear-gradient(135deg,${P.primary},${P.primaryDk})`,
                  color: '#fff',
                  fontSize: fs(15),
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: 10,
                }}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function SettingsScreen({
  dm,
  fs,
  onBack,
  darkMode,
  setDarkMode,
  fontSize,
  setFontSize,
  onExportData,
}: {
  dm: ThemeColors
  fs: (n: number) => number
  onBack: () => void
  darkMode: boolean
  setDarkMode: (d: boolean) => void
  fontSize: string
  setFontSize: (f: string) => void
  onExportData: () => void
}) {
  const [notifAlerts, setNotifAlerts] = useState(true)
  const [notifMeds, setNotifMeds] = useState(true)
  const [notifAppts, setNotifAppts] = useState(true)

  const [activeModal, setActiveModal] = useState<'privacy' | 'help' | 'support' | null>(null)

  // Interactive Support Chat
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Olá, João! Sou o Assistente de Saúde Virtual do SEDA. Como posso te ajudar hoje?' },
  ])
  const [chatInput, setChatInput] = useState('')

  const handleSendSupport = () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }])
    setChatInput('')

    setTimeout(() => {
      let reply = 'Entendido! Registrei sua solicitação. Seus dados estão sincronizados com sua Unidade Básica de Saúde (UBS Centro).'
      const lower = userMsg.toLowerCase()
      if (lower.includes('pressão') || lower.includes('pressao')) {
        reply = 'Para aferir a pressão corretamente: repouse por 5 minutos sentado, com o braço apoiado na altura do coração e sem falar.'
      } else if (lower.includes('glicemia') || lower.includes('açucar') || lower.includes('acucar')) {
        reply = 'A glicemia em jejum normal deve estar abaixo de 100 mg/dL. Em caso de valores acima de 140 mg/dL com sintomas, consulte seu médico.'
      } else if (lower.includes('consulta') || lower.includes('médico') || lower.includes('medico')) {
        reply = 'Você pode agendar e gerenciar suas consultas presenciais e teleconsultas diretamente na aba Consultas.'
      }
      setChatMessages((prev) => [...prev, { sender: 'bot', text: reply }])
    }, 800)
  }

  const Toggle = ({ on, toggle }: { on: boolean; toggle: () => void }) => (
    <button
      onClick={toggle}
      className="btn-press"
      style={{
        width: 50,
        height: 28,
        borderRadius: 14,
        background: on ? P.primary : '#CBD5E1',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.3s',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 24 : 3,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.3s',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  )

  return (
    <div style={{ background: dm.bg, minHeight: '100%', paddingBottom: 24, position: 'relative' }}>
      <BackHeader title="⚙️ Configurações" onBack={onBack} color={P.primaryDk} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: dm.card, borderRadius: 20, padding: '18px', boxShadow: '0 2px 14px rgba(94,143,192,0.07)' }}>
          <div style={{ fontSize: fs(11), fontWeight: 700, color: dm.sub, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
            Aparência & Acessibilidade
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {darkMode ? <Moon size={20} color={dm.text} /> : <Sun size={20} color={dm.text} />}
              <span style={{ fontSize: fs(15), fontWeight: 600, color: dm.text }}>Modo escuro</span>
            </div>
            <Toggle on={darkMode} toggle={() => setDarkMode(!darkMode)} />
          </div>
          <div style={{ fontSize: fs(13), fontWeight: 600, color: dm.text, marginBottom: 10 }}>Tamanho da fonte</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'normal', l: 'Normal' },
              { id: 'large', l: 'Grande' },
              { id: 'xl', l: 'Extra Grande' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFontSize(f.id)}
                className="btn-press"
                style={{
                  flex: 1,
                  padding: '11px 4px',
                  borderRadius: 12,
                  border: `2px solid ${fontSize === f.id ? P.primary : dm.border}`,
                  background: fontSize === f.id ? `${P.primary}14` : 'transparent',
                  color: fontSize === f.id ? P.primary : dm.sub,
                  fontSize: fs(11),
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                {f.l}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: dm.card, borderRadius: 20, padding: '18px', boxShadow: '0 2px 14px rgba(94,143,192,0.07)' }}>
          <div style={{ fontSize: fs(11), fontWeight: 700, color: dm.sub, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
            Notificações & Lembretes
          </div>
          {[
            { l: 'Alertas clínicos de risco', on: notifAlerts, set: setNotifAlerts },
            { l: 'Lembretes de medicação', on: notifMeds, set: setNotifMeds },
            { l: 'Consultas e exames agendados', on: notifAppts, set: setNotifAppts },
          ].map((n) => (
            <div key={n.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: fs(13), fontWeight: 600, color: dm.text }}>{n.l}</span>
              <Toggle on={n.on} toggle={() => n.set(!n.on)} />
            </div>
          ))}
        </div>

        <div style={{ background: dm.card, borderRadius: 20, padding: '6px 18px', boxShadow: '0 2px 14px rgba(94,143,192,0.07)' }}>
          {[
            { Icon: Shield, l: 'Privacidade e dados de saúde', action: () => setActiveModal('privacy') },
            { Icon: HelpCircle, l: 'Central de ajuda & FAQ', action: () => setActiveModal('help') },
            { Icon: MessageSquare, l: 'Falar com suporte virtual SEDA', action: () => setActiveModal('support') },
          ].map(({ Icon, l, action }) => (
            <button
              key={l}
              onClick={action}
              className="btn-press"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '15px 0',
                border: 'none',
                background: 'none',
                borderBottom: `1px solid ${dm.border}`,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Icon size={19} color={dm.sub} />
              <span style={{ flex: 1, fontSize: fs(14), fontWeight: 600, color: dm.text }}>{l}</span>
              <ChevronRight size={18} color={dm.sub} />
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '6px 0 12px' }}>
          <span style={{ fontSize: fs(11), color: dm.sub }}>SEDA v1.2.0 • Ministério da Saúde — SUS Atenção Primária</span>
        </div>
      </div>

      {/* Privacy Modal */}
      {activeModal === 'privacy' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30, display: 'flex', alignItems: 'flex-end', animation: 'fade-in 0.2s ease' }}>
          <div style={{ background: dm.card, borderRadius: '24px 24px 0 0', padding: '22px 20px 32px', width: '100%', maxHeight: '80%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: fs(17), fontWeight: 800, color: dm.text }}>Privacidade e Proteção de Dados</div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: dm.sub, cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ fontSize: fs(13), color: dm.sub, lineHeight: 1.6, marginBottom: 16 }}>
              Seus registros de pressão, glicemia e consultas são protegidos com criptografia de ponta a ponta e estão em total conformidade com a LGPD e o SUS.
            </div>
            <button
              onClick={() => {
                onExportData()
                setActiveModal(null)
              }}
              className="btn-press"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 14,
                background: P.primary,
                color: '#fff',
                fontWeight: 700,
                fontSize: fs(14),
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Download size={16} /> Exportar todos os meus dados (CSV/Relatório)
            </button>
          </div>
        </div>
      )}

      {/* Help / FAQ Modal */}
      {activeModal === 'help' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30, display: 'flex', alignItems: 'flex-end', animation: 'fade-in 0.2s ease' }}>
          <div style={{ background: dm.card, borderRadius: '24px 24px 0 0', padding: '22px 20px 32px', width: '100%', maxHeight: '85%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: fs(17), fontWeight: 800, color: dm.text }}>Perguntas Frequentes (FAQ)</div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: dm.sub, cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { q: 'Como medir a pressão corretamente?', a: 'Sente-se com as costas apoiadas, pés no chão, braço na altura do coração e fique em silêncio por 5 minutos antes da medição.' },
                { q: 'O que significa cada cor nos indicadores?', a: 'Verde = normal; Amarelo = atenção/limítrofe; Vermelho = alerta de pressão ou glicemia fora dos padrões esperados.' },
                { q: 'Como meus familiares recebem os alertas?', a: 'Adicione-os na aba Família. Eles receberão notificações automáticas caso uma medição atinja o nível de alerta.' },
              ].map((faq) => (
                <div key={faq.q} style={{ background: dm.bg, padding: '12px 14px', borderRadius: 12 }}>
                  <div style={{ fontSize: fs(13), fontWeight: 700, color: dm.text, marginBottom: 4 }}>{faq.q}</div>
                  <div style={{ fontSize: fs(12), color: dm.sub, lineHeight: 1.5 }}>{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Support Chat Modal */}
      {activeModal === 'support' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30, display: 'flex', alignItems: 'flex-end', animation: 'fade-in 0.2s ease' }}>
          <div style={{ background: dm.card, borderRadius: '24px 24px 0 0', padding: '18px 16px 24px', width: '100%', height: '80%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: `1px solid ${dm.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${P.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🤖
                </div>
                <div>
                  <div style={{ fontSize: fs(14), fontWeight: 700, color: dm.text }}>Suporte SEDA</div>
                  <div style={{ fontSize: fs(10), color: P.success, fontWeight: 600 }}>● Online</div>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: dm.sub, cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.sender === 'user' ? P.primary : dm.bg,
                    color: msg.sender === 'user' ? '#fff' : dm.text,
                    padding: '10px 14px',
                    borderRadius: 14,
                    maxWidth: '85%',
                    fontSize: fs(13),
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: `1px solid ${dm.border}` }}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendSupport()}
                placeholder="Digite sua dúvida..."
                style={{ flex: 1, padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${dm.border}`, background: dm.bg, color: dm.text, fontSize: fs(13), outline: 'none' }}
              />
              <button
                onClick={handleSendSupport}
                className="btn-press"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: P.primary,
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function EmergencyScreen({
  dm,
  fs,
  onBack,
  confirm,
  setConfirm,
  onShareLocation,
  onCallContact,
  onDispatchHealthTeam,
}: {
  dm: ThemeColors
  fs: (n: number) => number
  onBack: () => void
  confirm: boolean
  setConfirm: (c: boolean) => void
  onShareLocation: () => void
  onCallContact: () => void
  onDispatchHealthTeam: () => void
}) {
  const [activated, setActivated] = useState(false)
  const [count, setCount] = useState(5)

  useEffect(() => {
    if (!confirm) return
    if (count === 0) {
      setActivated(true)
      setConfirm(false)
      return
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [confirm, count, setConfirm])

  const reset = () => {
    setConfirm(false)
    setActivated(false)
    setCount(5)
  }

  return (
    <div style={{ flex: 1, background: activated ? '#FEE8E8' : dm.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: activated ? P.danger : '#1E3A5F', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => {
            onBack()
            reset()
          }}
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
        <span style={{ fontSize: fs(18), fontWeight: 700, color: '#fff' }}>🚨 Botão de Emergência SOS</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 20px', gap: 24, overflowY: 'auto' }}>
        {!activated && !confirm && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: fs(22), fontWeight: 800, color: dm.text }}>Precisa de ajuda imediata?</div>
              <div style={{ fontSize: fs(13), color: dm.sub, marginTop: 6, lineHeight: 1.55 }}>
                Ao acionar, sua localização GPS será enviada e seus contatos de emergência e a UBS serão alertados.
              </div>
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: 170 + i * 36,
                    height: 170 + i * 36,
                    borderRadius: '50%',
                    background: `${P.danger}${12 - i * 4}`,
                    animation: `pulse-ring ${1.5 + i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.25}s`,
                  }}
                />
              ))}
              <button
                onClick={() => setConfirm(true)}
                className="btn-press"
                style={{
                  width: 170,
                  height: 170,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg,${P.danger},#C43C3C)`,
                  border: `8px solid ${P.danger}40`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: `0 12px 48px ${P.danger}50`,
                }}
              >
                <Phone size={48} color="#fff" />
                <span style={{ fontSize: fs(16), fontWeight: 800, color: '#fff' }}>PEDIR AJUDA</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
              {[
                { Icon: MapPin, l: 'Compartilhar localização GPS', c: P.primary, onClick: onShareLocation },
                { Icon: Phone, l: 'Ligar para Ana Silva (Filha)', c: P.accent, onClick: onCallContact },
                { Icon: AlertTriangle, l: 'Acionar equipe de saúde SAMU/UBS', c: P.warn, onClick: onDispatchHealthTeam },
              ].map((a) => (
                <button
                  key={a.l}
                  onClick={a.onClick}
                  className="btn-press"
                  style={{
                    background: dm.card,
                    borderRadius: 16,
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    boxShadow: '0 2px 12px rgba(94,143,192,0.07)',
                    border: `1px solid ${dm.border}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${a.c}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <a.Icon size={20} color={a.c} />
                  </div>
                  <span style={{ fontSize: fs(13), fontWeight: 700, color: dm.text, flex: 1 }}>{a.l}</span>
                  <span style={{ fontSize: 16, color: dm.sub }}>→</span>
                </button>
              ))}
            </div>
          </>
        )}

        {confirm && !activated && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: fs(18), fontWeight: 700, color: dm.text }}>Acionando socorro em…</div>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `${P.danger}12`,
                border: `8px solid ${P.danger}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: fs(48),
                fontWeight: 900,
                color: P.danger,
              }}
            >
              {count}
            </div>
            <button
              onClick={reset}
              className="btn-press"
              style={{
                padding: '15px 36px',
                borderRadius: 16,
                border: `2px solid ${P.danger}`,
                background: '#fff',
                color: P.danger,
                fontSize: fs(15),
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <X size={16} style={{ display: 'inline', marginRight: 6 }} />
              Cancelar SOS
            </button>
          </div>
        )}

        {activated && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 86,
                height: 86,
                borderRadius: '50%',
                background: P.danger,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 32px ${P.danger}50`,
              }}
            >
              <Phone size={38} color="#fff" />
            </div>
            <div style={{ fontSize: fs(22), fontWeight: 800, color: P.danger }}>Socorro acionado com sucesso!</div>
            <div style={{ fontSize: fs(13), color: dm.sub, lineHeight: 1.7 }}>
              📍 Localização compartilhada: Av. Paulista, 1000.
              <br />
              👨‍👩‍👧 Ana Silva (Filha) notificada via SMS/Push.
              <br />
              🏥 Equipe de saúde da UBS Centro em prontidão.
            </div>
            <button
              onClick={reset}
              className="btn-press"
              style={{
                padding: '15px 36px',
                borderRadius: 16,
                background: `linear-gradient(135deg,${P.danger},#C43C3C)`,
                color: '#fff',
                fontSize: fs(15),
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: `0 6px 24px ${P.danger}40`,
              }}
            >
              Concluir e Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
