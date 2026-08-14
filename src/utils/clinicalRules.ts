/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Regras Clínicas, Limiares SUS, Classificações e Pesos de Validação
 */

import {
  BPClassification,
  BloodPressureReading,
  GlucoseClassification,
  GlucoseContext,
  GlucoseReading,
  SilenceStage,
  UserRole,
} from '../types';

/**
 * Classifica a Pressão Arterial segundo as Diretrizes Brasileiras de Hipertensão Arterial (SBC/SBH)
 */
export function classifyBloodPressure(systolic: number, diastolic: number): BPClassification {
  if (systolic >= 180 || diastolic >= 110) {
    return 'CRISE_HIPERTENSIVA';
  }
  if (systolic >= 160 || diastolic >= 100) {
    return 'HIPERTENSAO_ESTAGIO_2';
  }
  if (systolic >= 140 || diastolic >= 90) {
    return 'HIPERTENSAO_ESTAGIO_1';
  }
  if (systolic >= 130 || diastolic >= 85) {
    return 'PRE_HIPERTENSAO';
  }
  if (systolic >= 120 || diastolic >= 80) {
    return 'NORMAL';
  }
  return 'OTIMA';
}

/**
 * Classifica a Glicemia Capilar segundo a Sociedade Brasileira de Diabetes (SBD)
 */
export function classifyGlucose(value: number, context: GlucoseContext): GlucoseClassification {
  if (value < 54) {
    return 'HIPOGLICEMIA_GRAVE';
  }
  if (value < 70) {
    return 'HIPOGLICEMIA_LEVE';
  }
  if (value > 300) {
    return 'HIPERGLICEMIA_SEVERA';
  }

  if (context === 'JEJUM') {
    if (value <= 99) return 'NORMAL';
    if (value <= 125) return 'ELEVADA';
    return 'HIPERGLICEMIA';
  } else {
    // Pós-prandial ou casual
    if (value < 140) return 'NORMAL';
    if (value <= 199) return 'ELEVADA';
    return 'HIPERGLICEMIA';
  }
}

/**
 * Atribui o peso clínico de validação conforme a política de hierarquia de dados do SEDA
 * - 100% de peso: Registros feitos por Profissionais de Saúde ou ACS ("Verdade de Ouro")
 * - 90% de peso: Registros inseridos pelo Cuidador
 * - 80% de peso: Registros inseridos diretamente pelo Paciente
 */
export function getClinicalWeight(role: UserRole): number {
  switch (role) {
    case 'MEDICO_UBS':
    case 'ACS':
      return 100;
    case 'CUIDADOR':
      return 90;
    case 'PACIENTE':
    default:
      return 80;
  }
}

/**
 * Avalia o estágio da régua de silêncio com base nos dias sem registros
 */
export function evaluateSilenceStage(daysWithoutRecord: number): SilenceStage {
  if (daysWithoutRecord <= 1) return 'NORMAL';
  if (daysWithoutRecord <= 2) return 'PACIENTE_NOTIFICADO';
  if (daysWithoutRecord <= 4) return 'ALERTA_CUIDADOR';
  return 'PAINEL_RISCO_UBS';
}

/**
 * Verifica se uma medição de Pressão Arterial constitui Alerta Crítico Imediato
 */
export function isCriticalBP(systolic: number, diastolic: number): boolean {
  return systolic >= 180 || diastolic >= 110 || systolic < 85;
}

/**
 * Verifica se uma medição de Glicemia constitui Alerta Crítico Imediato
 */
export function isCriticalGlucose(value: number): boolean {
  return value < 54 || value >= 300;
}

/**
 * Detecção de Conflitos Clínicos em Medições Próximas
 */
export interface ConflictResult {
  hasConflict: boolean;
  message?: string;
  recommendedValue?: string;
}

export function checkBPConflicts(readings: BloodPressureReading[]): ConflictResult {
  if (readings.length < 2) return { hasConflict: false };

  // Sort descending by timestamp
  const sorted = [...readings].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const r1 = sorted[0];
  const r2 = sorted[1];

  const timeDiffMinutes = Math.abs(
    (new Date(r1.timestamp).getTime() - new Date(r2.timestamp).getTime()) / (1000 * 60)
  );

  // If measured within 60 minutes and difference > 25 systolic
  if (timeDiffMinutes <= 60 && Math.abs(r1.systolic - r2.systolic) >= 25) {
    const higher = r1.weightPercentage >= r2.weightPercentage ? r1 : r2;
    return {
      hasConflict: true,
      message: `Divergência detectada (${r1.systolic}/${r1.diastolic} vs ${r2.systolic}/${r2.diastolic} mmHg em ${Math.round(timeDiffMinutes)} min).`,
      recommendedValue: `Priorizado registro de ${higher.registeredByName} (${higher.weightPercentage}% confiabilidade: ${higher.systolic}/${higher.diastolic} mmHg). Recomenda-se nova medição conjunta.`,
    };
  }

  return { hasConflict: false };
}
