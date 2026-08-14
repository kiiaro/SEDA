/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Sistema de Equilíbrio de Diabetes e Artérias
 * Arquitetura de Tipos e Modelos de Domínio SUS / Atenção Primária
 */

export type UserRole = 'PACIENTE' | 'CUIDADOR' | 'ACS' | 'MEDICO_UBS';

export type AutonomyLevel = 'AUTONOMO' | 'ASSISTIDO' | 'COMPARTILHADO';

export type FontSizeOption = 'NORMAL' | 'GRANDE' | 'EXTRA_GRANDE';

export type NavigationTab = 
  | 'INICIO' 
  | 'DIARIO_SENTIDOS' 
  | 'MEDICOES' 
  | 'CONSULTAS_SUS' 
  | 'SILENCIO_RISCO' 
  | 'PAINEL_ACS' 
  | 'EMERGENCIA' 
  | 'ACESSIBILIDADE';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  autonomyLevel: AutonomyLevel;
  cpfMasked: string;
  cns: string; // Cartão Nacional do SUS
  birthDate: string;
  age: number;
  phone: string;
  ubsReference: string; // ex: UBS Jardim Primavera
  esfTeam: string; // ex: Equipe 04 - Florescer
  microArea: string; // ex: Microárea 03
  acsName: string; // Agente Comunitária de Saúde
  caregiverName?: string;
  caregiverPhone?: string;
  address?: string;
  conditions: string[]; // Hipertensão, Diabetes Tipo 2, etc.
  medications: string[];
}

export type BPClassification = 
  | 'OTIMA' 
  | 'NORMAL' 
  | 'PRE_HIPERTENSAO' 
  | 'HIPERTENSAO_ESTAGIO_1' 
  | 'HIPERTENSAO_ESTAGIO_2' 
  | 'CRISE_HIPERTENSIVA'; // >180/110

export interface BloodPressureReading {
  id: string;
  patientId: string;
  systolic: number; // Sistólica (ex: 120)
  diastolic: number; // Diastólica (ex: 80)
  pulse: number; // BPM
  timestamp: string;
  classification: BPClassification;
  registeredBy: UserRole;
  registeredByName: string;
  weightPercentage: number; // 100% ACS/Médico, 90% Cuidador, 80% Paciente
  isOfflineCreated?: boolean;
  notes?: string;
}

export type GlucoseContext = 'JEJUM' | 'POS_PRANDIAL' | 'CASUAL' | 'ANTES_DORMIR';

export type GlucoseClassification = 
  | 'HIPOGLICEMIA_GRAVE' // < 54 mg/dL
  | 'HIPOGLICEMIA_LEVE' // 54 - 69 mg/dL
  | 'NORMAL' // 70 - 99 mg/dL jejum / < 140 pós
  | 'ELEVADA' // 100 - 125 jejum / 140 - 199 pós
  | 'HIPERGLICEMIA' // >= 126 jejum / >= 200 pós
  | 'HIPERGLICEMIA_SEVERA'; // > 300 mg/dL

export interface GlucoseReading {
  id: string;
  patientId: string;
  value: number; // mg/dL (ex: 98)
  context: GlucoseContext;
  timestamp: string;
  classification: GlucoseClassification;
  registeredBy: UserRole;
  registeredByName: string;
  weightPercentage: number; // 100% ACS/Médico, 90% Cuidador, 80% Paciente
  isOfflineCreated?: boolean;
  notes?: string;
}

export interface SenseDiaryEntry {
  id: string;
  patientId: string;
  timestamp: string;
  audioDurationSeconds?: number;
  textTranscript: string;
  detectedSymptoms: string[];
  emotionalState: string;
  riskLevel: 'BAIXO' | 'MODERADO' | 'ALTO' | 'CRITICO_URGENCIA';
  aiFeedback: string;
  practicalAction: string;
  recommendAppointment: boolean;
  appointmentUrgency?: 'ROTINA' | 'PREVENTIVA' | 'PRIORITARIA_24H' | 'EMERGENCIA_IMEDIATA';
  clinicalNoteForTeam: string;
  linkedBPId?: string;
  linkedGlucoseId?: string;
  analyzedByAI: boolean;
}

export type AppointmentSpecialty = 
  | 'CLINICA_GERAL' 
  | 'ENFERMAGEM_HIPERDIA' 
  | 'VISITA_DOMICILIAR_ACS' 
  | 'NUTRICAO' 
  | 'URGENCIA_ENCAIXE';

export type AppointmentStatus = 
  | 'AGENDADA' 
  | 'CONFIRMADA' 
  | 'ENCAIXE_PRIORITARIO' 
  | 'REALIZADA' 
  | 'CANCELADA';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  ubsName: string;
  esfTeam: string;
  specialty: AppointmentSpecialty;
  professionalName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // ex: 08:30
  status: AppointmentStatus;
  isPriorityEncaixe: boolean;
  priorityReason?: string; // ex: "Crise Hipertensiva >180/110 detectada no app", "Silêncio Terapêutico > 5 dias"
  createdBy: UserRole;
  createdAt: string;
  reminders: {
    pushSent: boolean;
    smsSent: boolean;
    whatsappSent: boolean;
    confirmedByPatient: boolean;
  };
  clinicalObservations?: string;
}

export type SilenceStage = 
  | 'NORMAL' // 0 a 1 dia sem medições
  | 'PACIENTE_NOTIFICADO' // 1 a 2 dias (Lembrete carinhoso)
  | 'ALERTA_CUIDADOR' // 3 a 4 dias (Alerta imediato para familiar)
  | 'PAINEL_RISCO_UBS'; // >= 5 dias (Inclusão automática na lista de busca ativa do ACS)

export interface SilenceMonitorStatus {
  daysWithoutRecord: number;
  lastRecordDate: string;
  currentStage: SilenceStage;
  notificationsLog: {
    timestamp: string;
    target: 'PACIENTE' | 'CUIDADOR' | 'UBS_ACS';
    channel: 'PUSH' | 'SMS' | 'WHATSAPP' | 'PAINEL_UBS';
    message: string;
  }[];
}

export interface EmergencyAlert {
  id: string;
  timestamp: string;
  patientName: string;
  patientCns: string;
  type: 'CRISE_HIPERTENSIVA' | 'HIPOGLICEMIA_SEVERA' | 'RELATO_GRAVE_VOZ' | 'SILENCIO_PROLONGADO';
  triggerValue: string;
  severity: 'CRITICO' | 'ALTO';
  status: 'ATIVO' | 'EM_ATENDIMENTO_UBS' | 'RESOLVIDO';
  actionsTriggered: string[];
}

export interface OfflineSyncItem {
  id: string;
  timestamp: string;
  type: 'BP' | 'GLUCOSE' | 'APPOINTMENT' | 'DIARY';
  data: any;
  status: 'PENDENTE' | 'SINCRONIZADO';
}

export interface AppAccessibilitySettings {
  fontSize: FontSizeOption;
  highContrast: boolean;
  voiceReaderEnabled: boolean;
  audioFeedbackEnabled: boolean;
  simplifiedIdosoMode: boolean; // Interface ultra-simplificada para idosos
}
