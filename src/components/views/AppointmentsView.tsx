/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Módulo de Marcação e Gestão de Consultas na UBS (SUS / Atenção Primária)
 */

import React, { useState } from 'react';
import { 
  Appointment, 
  AppointmentSpecialty, 
  UserProfile, 
  UserRole, 
  AppAccessibilitySettings 
} from '../../types';
import { audioVoice } from '../../utils/audioVoice';
import { 
  CalendarCheck, 
  CalendarPlus, 
  Clock, 
  Hospital, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Phone, 
  Smartphone, 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  Send,
  ShieldCheck
} from 'lucide-react';

interface AppointmentsViewProps {
  profile: UserProfile;
  currentRole: UserRole;
  appointments: Appointment[];
  settings: AppAccessibilitySettings;
  onSaveAppointment: (app: Appointment) => void;
  onUpdateAppointmentStatus: (id: string, status: Appointment['status']) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  profile,
  currentRole,
  appointments,
  settings,
  onSaveAppointment,
  onUpdateAppointmentStatus,
}) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<AppointmentSpecialty>('CLINICA_GERAL');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>('09:30');
  const [clinicalObs, setClinicalObs] = useState<string>('');
  const [isPriorityEncaixe, setIsPriorityEncaixe] = useState<boolean>(false);
  const [priorityReason, setPriorityReason] = useState<string>('');

  const [notificationSimulated, setNotificationSimulated] = useState<string | null>(null);

  const availableProfessionals: Record<AppointmentSpecialty, { name: string; title: string }> = {
    CLINICA_GERAL: { name: 'Dr. Eduardo Rocha', title: 'Médico da Família e Comunidade (ESF)' },
    ENFERMAGEM_HIPERDIA: { name: 'Enfª Marina Costa', title: 'Enfermeira Especialista em Hiperdia' },
    VISITA_DOMICILIAR_ACS: { name: profile.acsName || 'ACS Cláudia Ramos', title: 'Agente Comunitária de Saúde' },
    NUTRICAO: { name: 'Nutr. Beatriz Lemos', title: 'Nutricionista NASF-SUS' },
    URGENCIA_ENCAIXE: { name: 'Médico Plantonista UBS / Encaixe', title: 'Vaga Prioritária de Acolhimento' },
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();

    const professional = availableProfessionals[selectedSpecialty];

    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      patientId: profile.id,
      patientName: profile.name,
      ubsName: profile.ubsReference,
      esfTeam: profile.esfTeam,
      specialty: selectedSpecialty,
      professionalName: `${professional.name} (${professional.title})`,
      date: selectedDate,
      timeSlot: selectedTime,
      status: isPriorityEncaixe ? 'ENCAIXE_PRIORITARIO' : 'AGENDADA',
      isPriorityEncaixe,
      priorityReason: isPriorityEncaixe ? priorityReason || 'Encaixe de triagem clínica SEDA' : undefined,
      createdBy: currentRole,
      createdAt: new Date().toISOString(),
      reminders: {
        pushSent: true,
        smsSent: true,
        whatsappSent: true,
        confirmedByPatient: false,
      },
      clinicalObservations: clinicalObs || 'Agendamento solicitado via aplicativo SEDA.',
    };

    onSaveAppointment(newAppointment);
    setShowBookingModal(false);
    audioVoice.playTone('success', settings.audioFeedbackEnabled);

    setNotificationSimulated(
      `Lembrete enviado com sucesso via SMS e WhatsApp para ${profile.phone}: "Consulta agendada na ${profile.ubsReference} com ${professional.name} em ${selectedDate} às ${selectedTime}."`
    );

    if (settings.voiceReaderEnabled) {
      audioVoice.speakText(
        `Consulta marcada com sucesso na Unidade Básica de Saúde para o dia ${selectedDate} às ${selectedTime}. Enviamos a confirmação para o seu celular.`
      );
    }
  };

  const handleConfirmPresence = (app: Appointment) => {
    onUpdateAppointmentStatus(app.id, 'CONFIRMADA');
    audioVoice.playTone('success', settings.audioFeedbackEnabled);
    if (settings.voiceReaderEnabled) {
      audioVoice.speakText(`Presença confirmada para a consulta com ${app.professionalName}.`);
    }
  };

  const handleSimulateWhatsAppReminder = (app: Appointment) => {
    setNotificationSimulated(
      `📲 Notificação WhatsApp enviada para ${profile.phone} e para cuidadora ${profile.caregiverPhone}: "Lembrete SUS: Olá ${profile.name}! Sua consulta é amanhã às ${app.timeSlot} na ${app.ubsName}. Responda 1 para confirmar."`
    );
    audioVoice.playTone('click', settings.audioFeedbackEnabled);
  };

  return (
    <div id="appointments-view" className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-900/50 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-2">
              <Hospital className="w-3.5 h-3.5 text-blue-400" />
              <span>Atenção Primária à Saúde • UBS Jardim Primavera</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Marcação e Gestão de Consultas
            </h2>
            <p className="text-blue-200/90 text-sm sm:text-base max-w-2xl mt-1 leading-relaxed">
              Agende consultas presenciais na UBS ou solicite visita domiciliar do ACS. Em caso de descompensação, o SEDA gera um <strong>Encaixe Prioritário Automático</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-open-booking-modal"
              onClick={() => {
                setIsPriorityEncaixe(false);
                setShowBookingModal(true);
                audioVoice.playTone('click', settings.audioFeedbackEnabled);
              }}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs sm:text-sm min-h-[48px] shadow-lg shadow-blue-950/50 flex items-center gap-2 transition-transform active:scale-95"
            >
              <CalendarPlus className="w-5 h-5" />
              <span>Nova Consulta UBS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulated notification banner */}
      {notificationSimulated && (
        <div className="bg-emerald-950/90 border border-emerald-600 rounded-2xl p-4 text-xs sm:text-sm text-emerald-200 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{notificationSimulated}</span>
          </div>
          <button
            onClick={() => setNotificationSimulated(null)}
            className="text-xs text-emerald-400 font-bold hover:text-white"
          >
            Fechar
          </button>
        </div>
      )}

      {/* PRIORITY ENCAIXE CALLOUT (SEDA AUTO-TRIAGE) */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-rose-950/60 border-2 border-amber-500/70 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black text-white">
              Triagem & Encaixe Prioritário Automático
            </h3>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-900 text-amber-200 border border-amber-500">
              Protocolo SUS
            </span>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Se a pressão for superior a <strong>180x110 mmHg</strong>, houver hipoglicemia severa ou o paciente estiver há mais de <strong>5 dias em silêncio</strong>, o sistema cria automaticamente uma pré-reserva de encaixe em 24h na UBS.
          </p>
        </div>

        <button
          id="btn-solicitar-encaixe-urgencia"
          onClick={() => {
            setIsPriorityEncaixe(true);
            setSelectedSpecialty('URGENCIA_ENCAIXE');
            setPriorityReason('Triagem prioritária: solicitação preventiva com sintomas descompensados.');
            setShowBookingModal(true);
            audioVoice.playTone('warning', settings.audioFeedbackEnabled);
          }}
          className="px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-black text-xs sm:text-sm min-h-[48px] shadow-lg shadow-amber-950/50 flex items-center gap-2 transition-transform active:scale-95 flex-shrink-0"
        >
          <AlertTriangle className="w-5 h-5" />
          <span>Solicitar Encaixe Prioritário</span>
        </button>
      </div>

      {/* UPCOMING & RECENT APPOINTMENTS LIST */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-blue-400" />
          <span>Consultas e Visitas Programadas ({appointments.length})</span>
        </h3>

        {appointments.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 space-y-3">
            <Hospital className="w-12 h-12 text-slate-600 mx-auto" />
            <p>Nenhuma consulta marcada no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {appointments.map((app) => {
              const isEncaixe = app.isPriorityEncaixe || app.status === 'ENCAIXE_PRIORITARIO';

              return (
                <div
                  key={app.id}
                  className={`bg-slate-900/90 border rounded-3xl p-5 sm:p-6 shadow-xl transition-all relative overflow-hidden ${
                    isEncaixe
                      ? 'border-amber-500 shadow-amber-950/30 ring-1 ring-amber-500/50'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Date and details */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-blue-950 border border-blue-800 flex flex-col items-center justify-center flex-shrink-0 text-center">
                        <span className="text-[10px] uppercase font-bold text-blue-300">
                          {new Date(app.date + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' })}
                        </span>
                        <span className="text-xl font-black text-white leading-none">
                          {app.date.split('-')[2]}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold">{app.timeSlot}</span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base sm:text-lg font-black text-white">
                            {app.professionalName}
                          </h4>

                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                              isEncaixe
                                ? 'bg-amber-950 text-amber-300 border-amber-600 animate-pulse'
                                : app.status === 'CONFIRMADA'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                                : 'bg-blue-950 text-blue-300 border-blue-600'
                            }`}
                          >
                            {isEncaixe ? '⚠️ Encaixe Prioritário (24h)' : `Status: ${app.status}`}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 flex items-center gap-2">
                          <Hospital className="w-3.5 h-3.5 text-blue-400" />
                          <span>{app.ubsName} ({app.esfTeam})</span>
                        </p>

                        {app.priorityReason && (
                          <div className="text-xs font-bold text-amber-300 bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-800/80 inline-block">
                            Motivo do Encaixe: {app.priorityReason}
                          </div>
                        )}

                        <p className="text-xs text-slate-400 italic">
                          "{app.clinicalObservations}"
                        </p>
                      </div>
                    </div>

                    {/* Multichannel status & actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                      {/* Notifications Indicators */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
                        <span title="Push Notificação">🔔 Push</span>
                        <span>•</span>
                        <span title="SMS 24h">📱 SMS</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold" title="WhatsApp Ativo">
                          💬 WhatsApp
                        </span>
                      </div>

                      {/* Confirm button */}
                      {app.status !== 'CONFIRMADA' && app.status !== 'REALIZADA' && (
                        <button
                          onClick={() => handleConfirmPresence(app)}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold min-h-[44px] flex items-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-emerald-950/40"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirmar Presença</span>
                        </button>
                      )}

                      {/* Simulate Reminder Test */}
                      <button
                        onClick={() => handleSimulateWhatsAppReminder(app)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold min-h-[44px] flex items-center gap-1.5"
                        title="Simular disparo de lembrete por SMS e WhatsApp"
                      >
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        <span>Testar Lembrete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <CalendarPlus className="w-6 h-6 text-blue-400" />
                <span>{isPriorityEncaixe ? 'Solicitar Encaixe de Urgência' : 'Agendar Consulta na UBS'}</span>
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs sm:text-sm">
              {/* Specialty */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-300">
                  Tipo de Atendimento / Especialidade:
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value as AppointmentSpecialty)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 px-3 font-semibold"
                >
                  <option value="CLINICA_GERAL">Consulta Médica - Clínica Geral (Dr. Eduardo Rocha)</option>
                  <option value="ENFERMAGEM_HIPERDIA">Enfermagem Hiperdia (Enfª Marina Costa)</option>
                  <option value="VISITA_DOMICILIAR_ACS">Visita Domiciliar em Casa (ACS Cláudia Ramos)</option>
                  <option value="NUTRICAO">Nutrição & Estilo de Vida (Nutr. Beatriz Lemos)</option>
                  <option value="URGENCIA_ENCAIXE">Encaixe Prioritário de Urgência (Acolhimento UBS)</option>
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-300">Data Desejada:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-2.5 px-3 font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-300">Horário:</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-2.5 px-3 font-semibold"
                  >
                    <option value="08:00">08:00 (Manhã)</option>
                    <option value="09:00">09:00 (Manhã)</option>
                    <option value="10:30">10:30 (Manhã)</option>
                    <option value="13:30">13:30 (Tarde)</option>
                    <option value="15:00">15:00 (Tarde)</option>
                    <option value="16:30">16:30 (Tarde)</option>
                  </select>
                </div>
              </div>

              {/* Priority Checkbox */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Encaixe Prioritário</span>
                  <span className="text-[11px] text-slate-400">Marcar em caso de sintomas ou crise</span>
                </div>
                <input
                  type="checkbox"
                  checked={isPriorityEncaixe}
                  onChange={(e) => setIsPriorityEncaixe(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0"
                />
              </div>

              {/* Clinical Obs */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-300">
                  Motivo ou Sintomas para a Equipe da UBS:
                </label>
                <textarea
                  rows={3}
                  value={clinicalObs}
                  onChange={(e) => setClinicalObs(e.target.value)}
                  placeholder="Ex: Renovação da receita de Losartana e acompanhamento de picos de pressão."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 resize-none font-medium"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black shadow-lg shadow-blue-950/50 transition-transform active:scale-95"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
