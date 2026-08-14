import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      system: "SEDA - Sistema de Equilíbrio de Diabetes e Artérias",
      version: "2.5.0-SUS-ESF",
      timestamp: new Date().toISOString(),
      aiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // AI Endpoint for "Diário dos Sentidos" (Clinical Audio Transcript & Subjective Symptom Analysis)
  app.post("/api/ai/diario-sentidos", async (req, res) => {
    try {
      const { textReport, patientContext } = req.body;

      if (!textReport || typeof textReport !== "string" || !textReport.trim()) {
        res.status(400).json({ error: "Relato de voz/texto obrigatório." });
        return;
      }

      const ai = getGenAI();

      if (!ai) {
        // Rule-based fallback if API key is not configured
        const fallbackAnalysis = generateFallbackClinicalAnalysis(textReport, patientContext);
        res.json(fallbackAnalysis);
        return;
      }

      const prompt = `Você é o módulo de Inteligência Artificial Clínica do SEDA (Sistema de Equilíbrio de Diabetes e Artérias), integrado à Atenção Primária do SUS (Estratégia Saúde da Família - UBS).
O paciente (geralmente idoso) gravou ou digitou um relato sobre como está se sentindo hoje no seu "Diário dos Sentidos".

DADOS DO PACIENTE:
- Nome: ${patientContext?.name || "Sr. Manoel da Silva"} (Idade: ${patientContext?.age || "68 anos"})
- Diagnósticos: ${patientContext?.conditions?.join(", ") || "Hipertensão Arterial Sistêmica, Diabetes Mellitus Tipo 2"}
- Última Pressão Arterial: ${patientContext?.lastBP ? `${patientContext.lastBP.systolic}/${patientContext.lastBP.diastolic} mmHg` : "135/85 mmHg"}
- Última Glicemia: ${patientContext?.lastGlucose ? `${patientContext.lastGlucose.value} mg/dL (${patientContext.lastGlucose.context})` : "142 mg/dL (pós-prandial)"}
- Dias sem registrar medições anteriores: ${patientContext?.daysSilent || 0} dias

RELATO DO PACIENTE NO DIÁRIO:
"${textReport}"

OBJETIVO DA ANÁLISE:
1. Identificar sintomas físicos subjetivos relatados (ex: cefaleia, tontura, palpitação, sede excessiva, visão turva, tremores, cansaço, dor no peito, falta de ar).
2. Identificar humor e estado emocional (tranquilo, ansioso, desanimado, confuso, estressado).
3. Avaliar nível de risco clínico global com base no relato e histórico:
   - "BAIXO": sintomas leves ou paciente sentindo-se bem/estável.
   - "MODERADO": sintomas de leve descompensação (ex: leve dor de cabeça, cansaço comum).
   - "ALTO": sintomas que sugerem pico hipertensivo, hiperglicemia ou hipoglicemia importante.
   - "CRITICO_URGENCIA": dor no peito irradiando, desmaio, confusão súbita, perda de força (requer acionamento imediato da UBS/SAMU 192).
4. Gerar uma mensagem de retorno acolhedora, afetuosa, empática e em linguagem clara para o idoso ou cuidador (sem jargões médicos difíceis).
5. Orientação de conduta prática (ex: "Repouse 15 minutos e meça a pressão agora", "Tome um copo d'água", "Contate sua UBS").
6. Indicação se é recomendada a marcação ou encaixe prioritário de consulta na UBS (true/false) e justificativa clínica para a equipe de Saúde da Família (ACS/Médico/Enfermeiro).

Responda EXCLUSIVAMENTE em formato JSON com a seguinte estrutura:
{
  "detectedSymptoms": ["sintoma 1", "sintoma 2"],
  "emotionalState": "string curta",
  "riskLevel": "BAIXO" | "MODERADO" | "ALTO" | "CRITICO_URGENCIA",
  "friendlyMessage": "Mensagem empática em português simples para o paciente",
  "practicalAction": "Instrução simples e imediata",
  "recommendAppointment": true | false,
  "appointmentUrgency": "ROTINA" | "PREVENTIVA" | "PRIORITARIA_24H" | "EMERGENCIA_IMEDIATA",
  "clinicalNoteForTeam": "Resumo técnico sucinto para o prontuário do ACS / Médico da UBS"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText.trim());
        res.json(parsed);
      } catch (parseError) {
        console.warn("Failed to parse Gemini JSON output, applying fallback parser", parseError);
        res.json(generateFallbackClinicalAnalysis(textReport, patientContext));
      }
    } catch (err: unknown) {
      console.error("Error in /api/ai/diario-sentidos:", err);
      // Even if AI service fails, return a safe clinical heuristic analysis so the patient is never left unassisted
      const reqBody = req.body || {};
      res.json(generateFallbackClinicalAnalysis(reqBody.textReport || "", reqBody.patientContext));
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SEDA SUS HealthTech Server running on http://0.0.0.0:${PORT}`);
  });
}

/**
 * Heuristic Clinical Fallback Analyzer
 * Ensures 100% offline & uninterrupted clinical triaging even without internet or API key
 */
function generateFallbackClinicalAnalysis(text: string, context: any) {
  const lower = (text || "").toLowerCase();
  const symptoms: string[] = [];
  let riskLevel = "BAIXO";
  let recommendAppointment = false;
  let urgency = "ROTINA";
  let practicalAction = "Continue com seus bons hábitos e mantenha suas medições em dia.";
  let friendlyMessage = `Recebemos seu relato no Diário dos Sentidos! É muito bom saber como você está se sentindo hoje. Mantenha-se hidratado e continue cuidando da sua saúde.`;
  let emotionalState = "Estável e participativo";

  // Critical indicators
  const isEmergency =
    lower.includes("dor no peito") ||
    lower.includes("peito apertado") ||
    lower.includes("desmaio") ||
    lower.includes("perdi a consciência") ||
    lower.includes("boca torta") ||
    lower.includes("braço dormente") ||
    lower.includes("falta de ar grave");

  const isHighRisk =
    lower.includes("tontura forte") ||
    lower.includes("vista escura") ||
    lower.includes("visão turva") ||
    lower.includes("dor de cabeça forte") ||
    lower.includes("nuca latejando") ||
    lower.includes("muito suor frio") ||
    lower.includes("tremor forte");

  const isModerateRisk =
    lower.includes("tontura") ||
    lower.includes("dor de cabeça") ||
    lower.includes("cansaço") ||
    lower.includes("muita sede") ||
    lower.includes("enjoo") ||
    lower.includes("azia");

  if (lower.includes("dor de cabeça") || lower.includes("cefaléia")) symptoms.push("Dor de cabeça");
  if (lower.includes("tontura") || lower.includes("vertigem")) symptoms.push("Tontura");
  if (lower.includes("visão turva") || lower.includes("vista escura")) symptoms.push("Visão turva / escotomas");
  if (lower.includes("cansaço") || lower.includes("fadiga") || lower.includes("fraco")) symptoms.push("Fadiga / Cansaço");
  if (lower.includes("sede") || lower.includes("boca seca")) symptoms.push("Sede excessiva");
  if (lower.includes("suor frio") || lower.includes("tremedeira")) symptoms.push("Sudorese fria / Tremores");
  if (lower.includes("dor no peito") || lower.includes("palpitação")) symptoms.push("Dor torácica / Palpitações");

  if (lower.includes("triste") || lower.includes("desanimado") || lower.includes("chateado")) emotionalState = "Desanimado / Vulnerável";
  if (lower.includes("ansioso") || lower.includes("nervoso") || lower.includes("preocupado")) emotionalState = "Ansioso / Preocupado";
  if (lower.includes("bem") || lower.includes("ótimo") || lower.includes("disposto") || lower.includes("alegre")) emotionalState = "Positivo e Bem Disposto";

  if (isEmergency) {
    riskLevel = "CRITICO_URGENCIA";
    recommendAppointment = true;
    urgency = "EMERGENCIA_IMEDIATA";
    friendlyMessage = "Atenção: Identificamos sintomas que merecem atendimento médico com urgência. Por favor, sente-se agora e chame um familiar ou acione o SAMU 192.";
    practicalAction = "Repouse sentado, não faça esforços e acione o botão de emergência ou SAMU 192.";
  } else if (isHighRisk) {
    riskLevel = "ALTO";
    recommendAppointment = true;
    urgency = "PRIORITARIA_24H";
    friendlyMessage = "Você relatou sintomas que pedem atenção especial da nossa equipe de saúde da UBS. Vamos verificar sua pressão e glicemia agora.";
    practicalAction = "Meça sua Pressão Arterial e Glicemia agora no aplicativo e repouse em local ventilado.";
  } else if (isModerateRisk) {
    riskLevel = "MODERADO";
    recommendAppointment = true;
    urgency = "PREVENTIVA";
    friendlyMessage = "Compreendemos o seu incômodo. Beba um copo de água fresca, descanse um pouco e registre sua medição de hoje.";
    practicalAction = "Tome um copo d'água, respire fundo e mantenha o horário das suas medicações de rotina.";
  }

  return {
    detectedSymptoms: symptoms.length > 0 ? symptoms : ["Sem queixas físicas expressivas"],
    emotionalState,
    riskLevel,
    friendlyMessage,
    practicalAction,
    recommendAppointment,
    appointmentUrgency: urgency,
    clinicalNoteForTeam: `Relato qualitativo processado: "${text.substring(0, 100)}...". Sintomas mapeados: ${symptoms.join(", ") || "Nenhum grave"}. Nível de risco sugerido: ${riskLevel}.`,
  };
}

startServer();
