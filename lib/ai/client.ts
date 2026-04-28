import type { ClientAnalysis, ClientMessage } from "@/types/new-client"
import { createEditableValue } from "@/types/new-client"
import type { AIClientAnalysis } from "./schemas"

/**
 * Analyzes a client message using the Finko AI API
 * Transforms the API response into the ClientAnalysis format used by the UI
 */
export async function analyzeClientWithAI(
  message: string,
  source: ClientMessage["source"]
): Promise<ClientAnalysis> {
  const response = await fetch("/api/ai/analyze-client", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, source }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Error analyzing message")
  }

  const { success, analysis, error } = await response.json()
  
  if (!success || !analysis) {
    throw new Error(error || "Failed to analyze message")
  }

  // Transform AI response to ClientAnalysis format
  return transformAIResponse(analysis, message, source)
}

/**
 * Transforms the raw AI response into the ClientAnalysis format with EditableValues
 */
function transformAIResponse(
  ai: AIClientAnalysis,
  originalMessage: string,
  source: ClientMessage["source"]
): ClientAnalysis {
  return {
    id: `analysis-${Date.now()}`,
    createdAt: new Date(),
    originalMessage: {
      content: originalMessage,
      source,
      receivedAt: new Date(),
    },
    
    clientName: createEditableValue(
      ai.clientName || undefined,
      ai.clientName ? "detected" : "assumption",
      ai.clientName ? "Nombre extraído del mensaje" : "No se detectó nombre",
      ai.clientName ? 90 : 20
    ),
    
    clientCompany: createEditableValue(
      ai.clientCompany || undefined,
      ai.clientCompany ? "detected" : "assumption",
      ai.clientCompany ? "Empresa extraída del mensaje" : "No se detectó empresa",
      ai.clientCompany ? 85 : 20
    ),
    
    clientEmail: createEditableValue(
      ai.clientEmail || undefined,
      ai.clientEmail ? "detected" : "assumption",
      ai.clientEmail ? "Email extraído del mensaje" : "No se detectó email",
      ai.clientEmail ? 95 : 10
    ),
    
    scope: {
      summary: createEditableValue(
        ai.scope.summary,
        "inferred",
        "Resumen generado por AI basado en el mensaje",
        ai.confidenceScore
      ),
      projectType: createEditableValue(
        ai.scope.projectType,
        "inferred",
        "Tipo de proyecto inferido del contexto",
        ai.confidenceScore
      ),
      estimatedComplexity: createEditableValue(
        ai.scope.estimatedComplexity,
        "inferred",
        "Complejidad estimada basada en alcance descrito",
        Math.min(ai.confidenceScore, 80)
      ),
      suggestedDeliverables: createEditableValue(
        ai.scope.suggestedDeliverables,
        "inferred",
        "Entregables sugeridos basados en tipo de proyecto",
        70
      ),
      uncertainAreas: ai.scope.uncertainAreas,
    },
    
    urgency: {
      level: createEditableValue(
        ai.urgency.level,
        ai.urgency.deadline ? "detected" : "inferred",
        ai.urgency.reasoning,
        ai.urgency.deadline ? 90 : 70
      ),
      deadline: createEditableValue(
        ai.urgency.deadline || undefined,
        ai.urgency.deadline ? "detected" : "assumption",
        ai.urgency.deadline ? "Deadline mencionado en el mensaje" : "Sin deadline explícito",
        ai.urgency.deadline ? 95 : 30
      ),
      reasoning: ai.urgency.reasoning,
    },
    
    budget: {
      mentioned: ai.budget.mentioned,
      extractedAmount: ai.budget.extractedAmount || undefined,
      currency: ai.budget.currency || undefined,
      clientExpectation: createEditableValue(
        ai.budget.clientExpectation,
        ai.budget.mentioned ? "detected" : "inferred",
        ai.budget.pricingGuidance,
        ai.budget.mentioned ? 85 : 60
      ),
      pricingGuidance: ai.budget.pricingGuidance,
      suggestedHourlyRate: createEditableValue(
        ai.budget.suggestedHourlyRateUSD || undefined,
        "inferred",
        "Tarifa sugerida basada en tipo de proyecto y mercado LATAM",
        65
      ),
      suggestedProjectRate: createEditableValue(
        ai.budget.suggestedProjectRateUSD || undefined,
        "inferred",
        "Precio de proyecto sugerido basado en alcance estimado",
        60
      ),
    },
    
    paymentMethod: {
      primary: createEditableValue(
        ai.paymentMethod.primary,
        "inferred",
        ai.paymentMethod.reasoning,
        75
      ),
      alternatives: ai.paymentMethod.alternatives,
      reasoning: ai.paymentMethod.reasoning,
    },
    
    redFlags: ai.redFlags.map((flag, index) => ({
      id: `flag-${index}`,
      title: flag.title,
      description: flag.description,
      severity: flag.severity,
      recommendation: flag.recommendation,
    })),
    
    suggestedReply: {
      tone: createEditableValue(
        ai.suggestedReply.tone,
        "inferred",
        "Tono recomendado para este tipo de cliente",
        80
      ),
      subject: createEditableValue(
        ai.suggestedReply.subject || undefined,
        "inferred",
        "Asunto sugerido para email",
        75
      ),
      body: createEditableValue(
        ai.suggestedReply.body,
        "inferred",
        "Respuesta generada por AI",
        ai.confidenceScore
      ),
      callToAction: ai.suggestedReply.callToAction,
    },
    
    nextSteps: ai.nextSteps.map((step, index) => ({
      id: `step-${index}`,
      action: step.action,
      description: step.description,
      priority: step.priority,
      linkedTool: step.linkedTool || undefined,
      linkHref: step.linkedTool ? `/${step.linkedTool}` : undefined,
    })),
    
    confidenceScore: ai.confidenceScore,
    analysisNotes: ai.analysisNotes || undefined,
  }
}

/**
 * Generates a contextual message using the Finko AI API
 */
export async function generateMessageWithAI(
  scenario: string,
  context: Record<string, unknown>,
  channel: "whatsapp" | "email" = "email",
  tone: "formal" | "friendly" | "professional" | "firm" = "professional"
) {
  const response = await fetch("/api/ai/generate-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario, context, channel, tone }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Error generating message")
  }

  const { success, message, error } = await response.json()
  
  if (!success || !message) {
    throw new Error(error || "Failed to generate message")
  }

  return message
}
