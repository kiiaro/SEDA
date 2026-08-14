export const P = {
  primary:   '#5E8FC0',
  primaryDk: '#3D6E9F',
  secondary: '#7CC9BE',
  accent:    '#59B98A',
  bg:        '#F8FAFC',
  bgAlt:     '#EEF4F8',
  card:      '#FFFFFF',
  textMain:  '#1E3A5F',
  textSub:   '#64748B',
  success:   '#2FBF71',
  warn:      '#F4B740',
  danger:    '#E45454',
  border:    '#E2E8F0',
  purple:    '#6B7FD4',
} as const

export type Screen = 
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'home'
  | 'pressure'
  | 'glucose'
  | 'voice'
  | 'history'
  | 'dashboard'
  | 'alerts'
  | 'network'
  | 'profile'
  | 'settings'
  | 'emergency'
  | 'appointments'
  | 'new-appointment'

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled'
export type AppointmentType = 'presencial' | 'teleconsulta'

export interface Appointment {
  id: number
  doctor: string
  specialty: string
  location: string
  date: string
  time: string
  type: AppointmentType
  status: AppointmentStatus
  notes: string
  bookedBy: string
  forPatient: string
}

export interface HealthRecord {
  id: number
  date: string
  time: string
  sys: number
  dia: number
  hr: number
  glucose: number
  mealTime?: 'before' | 'after'
  notes?: string
  status: 'normal' | 'attention' | 'alert'
}

export interface ClinicalAlert {
  id: number
  icon: string
  title: string
  desc: string
  time: string
  color: string
  read?: boolean
  actionType?: 'appointment' | 'medicine' | 'emergency' | 'pressure' | 'glucose'
}

export interface NetworkPerson {
  id: number
  name: string
  role: string
  avatar: string
  color: string
  status: 'online' | 'away' | 'busy' | 'offline'
  relation: string
  phone: string
}

export interface UserProfile {
  name: string
  age: number
  cpf: string
  phone: string
  birthDate: string
  bloodType: string
  role: string
  medications: string[]
  conditions: string[]
  emergencyContact: {
    name: string
    relation: string
    phone: string
  }
}

export interface ThemeColors {
  bg: string
  card: string
  text: string
  sub: string
  border: string
}

