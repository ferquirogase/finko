import { z } from "zod"

// Schema for client analysis structured output
export const clientAnalysisSchema = z.object({
  clientName: z.string().nullable().describe("Client name if mentioned"),
  clientCompany: z.string().nullable().describe("Company name if mentioned"),
  clientEmail: z.string().nullable().describe("Client email if mentioned"),
  
  scope: z.object({
    summary: z.string().describe("Brief summary of what the client needs"),
    projectType: z.string().describe("Type of project (e.g., 'Sitio web', 'App móvil', 'Diseño gráfico')"),
    estimatedComplexity: z.enum(["low", "medium", "high"]).describe("Project complexity"),
    suggestedDeliverables: z.array(z.string()).describe("List of suggested deliverables"),
    uncertainAreas: z.array(z.string()).describe("Areas that need clarification"),
  }),
  
  urgency: z.object({
    level: z.enum(["urgent", "normal", "flexible"]).describe("Urgency level"),
    deadline: z.string().nullable().describe("Mentioned deadline if any"),
    reasoning: z.string().describe("Why this urgency level was assigned"),
  }),
  
  budget: z.object({
    mentioned: z.boolean().describe("Whether budget was mentioned"),
    extractedAmount: z.number().nullable().describe("Budget amount if mentioned"),
    currency: z.string().nullable().describe("Currency if mentioned"),
    clientExpectation: z.enum(["low", "market", "premium", "unclear"]).describe("Client's price expectation"),
    pricingGuidance: z.string().describe("Guidance on how to price this project"),
    suggestedHourlyRateUSD: z.number().nullable().describe("Suggested hourly rate in USD"),
    suggestedProjectRateUSD: z.number().nullable().describe("Suggested project price in USD"),
  }),
  
  paymentMethod: z.object({
    primary: z.enum(["transferencia", "paypal", "wise", "crypto", "efectivo", "tarjeta"]).describe("Recommended payment method"),
    alternatives: z.array(z.enum(["transferencia", "paypal", "wise", "crypto", "efectivo", "tarjeta"])).describe("Alternative payment methods"),
    reasoning: z.string().describe("Why this payment method is recommended"),
  }),
  
  redFlags: z.array(z.object({
    title: z.string().describe("Brief title of the red flag"),
    description: z.string().describe("Detailed description"),
    severity: z.enum(["high", "medium", "low"]).describe("Severity level"),
    recommendation: z.string().describe("What to do about this flag"),
  })).describe("Potential red flags or risks detected"),
  
  suggestedReply: z.object({
    tone: z.enum(["formal", "friendly", "professional"]).describe("Recommended tone"),
    subject: z.string().nullable().describe("Email subject line if applicable"),
    body: z.string().describe("Full suggested reply message"),
    callToAction: z.string().describe("What action you want the client to take"),
  }),
  
  nextSteps: z.array(z.object({
    action: z.string().describe("Action to take"),
    description: z.string().describe("Details about this step"),
    priority: z.enum(["high", "medium", "low"]).describe("Priority level"),
    linkedTool: z.enum(["calculadora", "presupuestos", "recibos", "pagos"]).nullable().describe("Finko tool that helps with this"),
  })).describe("Recommended next steps for the freelancer"),
  
  confidenceScore: z.number().min(0).max(100).describe("Overall confidence in this analysis (0-100)"),
  analysisNotes: z.string().nullable().describe("Any additional notes about the analysis"),
})

export type AIClientAnalysis = z.infer<typeof clientAnalysisSchema>

// Schema for message generation
export const messageGenerationSchema = z.object({
  subject: z.string().nullable().describe("Email subject if applicable"),
  body: z.string().describe("The message body"),
  tone: z.enum(["formal", "friendly", "professional", "firm"]).describe("Detected tone"),
  callToAction: z.string().describe("What the reader should do next"),
  placeholders: z.array(z.string()).nullable().describe("List of placeholders that need to be filled"),
})

export type AIGeneratedMessage = z.infer<typeof messageGenerationSchema>

// Schema for dashboard insights - AI-generated priorities and suggestions
export const dashboardInsightsSchema = z.object({
  todayPriorities: z.array(z.object({
    id: z.string().describe("Unique identifier"),
    type: z.enum(["delivery", "followup", "payment", "meeting", "task"]).describe("Priority type"),
    title: z.string().describe("Short title"),
    description: z.string().describe("Brief description"),
    clientName: z.string().nullable().describe("Related client"),
    projectName: z.string().nullable().describe("Related project"),
    dueTime: z.string().nullable().describe("Due time if applicable (HH:mm)"),
    urgencyLevel: z.enum(["critical", "high", "medium"]).describe("Urgency level"),
    whyNow: z.string().describe("AI explanation of why this is a priority today"),
    impact: z.string().nullable().describe("Potential impact of completing/missing this"),
  })).describe("Top 3-5 priorities for today"),
  
  recommendedActions: z.array(z.object({
    id: z.string().describe("Unique identifier"),
    type: z.enum(["followup", "cobro", "propuesta", "entrega", "revision"]).describe("Action type"),
    title: z.string().describe("Action title"),
    description: z.string().describe("Why this action is recommended"),
    reason: z.string().describe("AI reasoning for suggesting this"),
    clientName: z.string().nullable().describe("Related client"),
    suggestedDate: z.string().nullable().describe("Suggested date to complete"),
    actionLabel: z.string().describe("CTA button label"),
    linkedTool: z.string().nullable().describe("Related Finko tool"),
  })).describe("AI-suggested actions based on context"),
  
  urgentAlerts: z.array(z.object({
    id: z.string().describe("Unique identifier"),
    type: z.enum(["overdue_payment", "deadline", "no_response", "pending_invoice"]).describe("Alert type"),
    title: z.string().describe("Alert title"),
    description: z.string().describe("Alert description"),
    severity: z.enum(["critical", "high", "medium"]).describe("Severity level"),
    clientName: z.string().nullable().describe("Related client"),
    projectName: z.string().nullable().describe("Related project"),
    amount: z.number().nullable().describe("Amount if financial"),
    daysOverdue: z.number().nullable().describe("Days overdue if applicable"),
  })).describe("Urgent alerts requiring attention"),
  
  weeklyInsight: z.string().describe("A brief AI insight about the week's workload and priorities"),
})

export type AIDashboardInsights = z.infer<typeof dashboardInsightsSchema>
