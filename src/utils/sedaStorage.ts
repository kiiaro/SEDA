/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Armazenamento Local, Inicialização e Sincronização Offline
 */

import {
  AppAccessibilitySettings,
  Appointment,
  BloodPressureReading,
  EmergencyAlert,
  GlucoseReading,
  OfflineSyncItem,
  SenseDiaryEntry,
  SilenceMonitorStatus,
  UserProfile,
} from '../types';

export const DEFAULT_PATIENT_PROFILE: UserProfile = {
  id: 'paciente-001',
  name: 'Sr. Manoel da Silva',
  role: 'PACIENTE',
  autonomyLevel: 'ASSISTIDO', // Adaptativo: Autônomo, Assistido, Compartilhado
  cpfMasked: '148.***.***-34',
  cns: '702.4091.8820.0019',
  birthDate: '1958-04-12',
  age: 68,
  phone: '(11) 98721-4432',
  ubsReference: 'UBS Jardim Primavera - Dr. Arnaldo',
  esfTeam: 'Equipe 04 - Florescer (ESF)',
  microArea: 'Microárea 03 (Setor Norte)',
  acsName: 'Cláudia Ramos (ACS)',
  caregiverName: 'Lúcia Silva (Filha / Cuidadora)',
  caregiverPhone: '(11) 99342-8819',
  conditions: ['Hipertensão Arterial Sistêmica (Estágio 2)', 'Diabetes Mellitus Tipo 2'],
  medications: [
    'Losartana Potássica 50mg (1x ao dia pela manhã)',
    'Metformina 850mg (2x ao dia após refeições)',
    'Anlodipino 5mg (1x ao dia à noite)',
  ],
};

export const INITIAL_BP_READINGS: BloodPressureReading[] = [
  {
    id: 'bp-01',
    patientId: 'paciente-001',
    systolic: 128,
    diastolic: 82,
    pulse: 72,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    classification: 'NORMAL',
    registeredBy: 'PACIENTE',
    registeredByName: 'Sr. Manoel da Silva',
    weightPercentage: 80,
    notes: 'Medição matinal antes do café',
  },
  {
    id: 'bp-02',
    patientId: 'paciente-001',
    systolic: 138,
    diastolic: 88,
    pulse: 76,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    classification: 'PRE_HIPERTENSAO',
    registeredBy: 'CUIDADOR',
    registeredByName: 'Lúcia Silva (Cuidadora)',
    weightPercentage: 90,
    notes: 'Após caminhada leve',
  },
  {
    id: 'bp-03',
    patientId: 'paciente-001',
    systolic: 130,
    diastolic: 84,
    pulse: 70,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    classification: 'PRE_HIPERTENSAO',
    registeredBy: 'ACS',
    registeredByName: 'Cláudia Ramos (ACS)',
    weightPercentage: 100,
    notes: 'Visita domiciliar mensal com aparelho calibrado',
  },
];

export const INITIAL_GLUCOSE_READINGS: GlucoseReading[] = [
  {
    id: 'glu-01',
    patientId: 'paciente-001',
    value: 108,
    context: 'JEJUM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    classification: 'ELEVADA',
    registeredBy: 'PACIENTE',
    registeredByName: 'Sr. Manoel da Silva',
    weightPercentage: 80,
    notes: 'Em jejum de 8 horas',
  },
  {
    id: 'glu-02',
    patientId: 'paciente-001',
    value: 145,
    context: 'POS_PRANDIAL',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    classification: 'ELEVADA',
    registeredBy: 'CUIDADOR',
    registeredByName: 'Lúcia Silva (Cuidadora)',
    weightPercentage: 90,
    notes: '2 horas após almoço',
  },
  {
    id: 'glu-03',
    patientId: 'paciente-001',
    value: 96,
    context: 'JEJUM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    classification: 'NORMAL',
    registeredBy: 'ACS',
    registeredByName: 'Cláudia Ramos (ACS)',
    weightPercentage: 100,
    notes: 'Glicosímetro da UBS verificado',
  },
];

export const INITIAL_DIARY_ENTRIES: SenseDiaryEntry[] = [
  {
    id: 'diary-01',
    patientId: 'paciente-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    audioDurationSeconds: 14,
    textTranscript: 'Hoje acordei bem disposto, tomei o remédio da pressão certinho e fiz uma caminhada até a padaria. Senti só uma sede um pouquinho maior no calor.',
    detectedSymptoms: ['Sede leve'],
    emotionalState: 'Positivo e disposto',
    riskLevel: 'BAIXO',
    aiFeedback: 'Que ótima notícia, Sr. Manoel! Parabéns por manter o horário das medicações. Lembre-se de tomar água fresca ao longo do dia para se hidratar.',
    practicalAction: 'Beba 1 copo de água e continue o repouso programado.',
    recommendAppointment: false,
    clinicalNoteForTeam: 'Paciente assíduo com medicação em dia. Relato de boa disposição física.',
    analyzedByAI: true,
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-01',
    patientId: 'paciente-001',
    patientName: 'Sr. Manoel da Silva',
    ubsName: 'UBS Jardim Primavera',
    esfTeam: 'Equipe 04 - Florescer',
    specialty: 'CLINICA_GERAL',
    professionalName: 'Dr. Eduardo Rocha (Médico de Família)',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0],
    timeSlot: '09:00',
    status: 'CONFIRMADA',
    isPriorityEncaixe: false,
    createdBy: 'MEDICO_UBS',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    reminders: {
      pushSent: true,
      smsSent: true,
      whatsappSent: true,
      confirmedByPatient: true,
    },
    clinicalObservations: 'Consulta de retorno semestral do programa Hiperdia SUS.',
  },
  {
    id: 'app-02',
    patientId: 'paciente-001',
    patientName: 'Sr. Manoel da Silva',
    ubsName: 'UBS Jardim Primavera',
    esfTeam: 'Equipe 04 - Florescer',
    specialty: 'ENFERMAGEM_HIPERDIA',
    professionalName: 'Enfª Marina Costa',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString().split('T')[0],
    timeSlot: '14:30',
    status: 'AGENDADA',
    isPriorityEncaixe: false,
    createdBy: 'ACS',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    reminders: {
      pushSent: false,
      smsSent: false,
      whatsappSent: false,
      confirmedByPatient: false,
    },
    clinicalObservations: 'Avaliação de pés diabéticos e renovação de tiras reagentes de glicemia.',
  },
];

export const INITIAL_SILENCE_STATUS: SilenceMonitorStatus = {
  daysWithoutRecord: 0,
  lastRecordDate: new Date().toISOString(),
  currentStage: 'NORMAL',
  notificationsLog: [
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      target: 'PACIENTE',
      channel: 'PUSH',
      message: 'Olá Sr. Manoel! Tudo pronto para o registro matinal de pressão e glicemia.',
    },
  ],
};

export const INITIAL_ACCESSIBILITY_SETTINGS: AppAccessibilitySettings = {
  fontSize: 'GRANDE', // Default friendly for seniors
  highContrast: false,
  voiceReaderEnabled: true,
  audioFeedbackEnabled: true,
  simplifiedIdosoMode: true,
};

const STORAGE_KEYS = {
  PROFILE: 'seda_user_profile_v2',
  BP: 'seda_bp_readings_v2',
  GLUCOSE: 'seda_glucose_readings_v2',
  DIARY: 'seda_sense_diary_v2',
  APPOINTMENTS: 'seda_appointments_v2',
  SILENCE: 'seda_silence_status_v2',
  ACCESSIBILITY: 'seda_accessibility_v2',
  OFFLINE_QUEUE: 'seda_offline_sync_queue_v2',
  EMERGENCY: 'seda_emergency_alerts_v2',
};

export function loadStoredProfile(): UserProfile {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return item ? JSON.parse(item) : DEFAULT_PATIENT_PROFILE;
  } catch {
    return DEFAULT_PATIENT_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

export function loadStoredBP(): BloodPressureReading[] {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.BP);
    return item ? JSON.parse(item) : INITIAL_BP_READINGS;
  } catch {
    return INITIAL_BP_READINGS;
  }
}

export function saveStoredBP(readings: BloodPressureReading[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BP, JSON.stringify(readings));
  } catch (e) {
    console.error('Failed to save BP:', e);
  }
}

export function loadStoredGlucose(): GlucoseReading[] {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.GLUCOSE);
    return item ? JSON.parse(item) : INITIAL_GLUCOSE_READINGS;
  } catch {
    return INITIAL_GLUCOSE_READINGS;
  }
}

export function saveStoredGlucose(readings: GlucoseReading[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GLUCOSE, JSON.stringify(readings));
  } catch (e) {
    console.error('Failed to save Glucose:', e);
  }
}

export function loadStoredDiary(): SenseDiaryEntry[] {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.DIARY);
    return item ? JSON.parse(item) : INITIAL_DIARY_ENTRIES;
  } catch {
    return INITIAL_DIARY_ENTRIES;
  }
}

export function saveStoredDiary(entries: SenseDiaryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save Diary:', e);
  }
}

export function loadStoredAppointments(): Appointment[] {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return item ? JSON.parse(item) : INITIAL_APPOINTMENTS;
  } catch {
    return INITIAL_APPOINTMENTS;
  }
}

export function saveStoredAppointments(appointments: Appointment[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  } catch (e) {
    console.error('Failed to save Appointments:', e);
  }
}

export function loadStoredSilence(): SilenceMonitorStatus {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.SILENCE);
    return item ? JSON.parse(item) : INITIAL_SILENCE_STATUS;
  } catch {
    return INITIAL_SILENCE_STATUS;
  }
}

export function saveStoredSilence(status: SilenceMonitorStatus): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SILENCE, JSON.stringify(status));
  } catch (e) {
    console.error('Failed to save Silence status:', e);
  }
}

export function loadStoredAccessibility(): AppAccessibilitySettings {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.ACCESSIBILITY);
    return item ? JSON.parse(item) : INITIAL_ACCESSIBILITY_SETTINGS;
  } catch {
    return INITIAL_ACCESSIBILITY_SETTINGS;
  }
}

export function saveStoredAccessibility(settings: AppAccessibilitySettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCESSIBILITY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save Accessibility settings:', e);
  }
}

export function loadStoredOfflineQueue(): OfflineSyncItem[] {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
}

export function saveStoredOfflineQueue(queue: OfflineSyncItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save offline queue:', e);
  }
}

export function loadStoredEmergencies(): EmergencyAlert[] {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.EMERGENCY);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
}

export function saveStoredEmergencies(emergencies: EmergencyAlert[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EMERGENCY, JSON.stringify(emergencies));
  } catch (e) {
    console.error('Failed to save emergencies:', e);
  }
}

// Aliases for explicit typing and backward compatibility
export const loadStoredBPReadings = loadStoredBP;
export const saveStoredBPReadings = saveStoredBP;
export const loadStoredGlucoseReadings = loadStoredGlucose;
export const saveStoredGlucoseReadings = saveStoredGlucose;
export const loadStoredDiaryEntries = loadStoredDiary;
export const saveStoredDiaryEntries = saveStoredDiary;
export const loadStoredSilenceStatus = loadStoredSilence;
export const saveStoredSilenceStatus = saveStoredSilence;
export const loadStoredAccessibilitySettings = loadStoredAccessibility;
export const saveStoredAccessibilitySettings = saveStoredAccessibility;
export const loadStoredAlerts = loadStoredEmergencies;
export const saveStoredAlerts = saveStoredEmergencies;
