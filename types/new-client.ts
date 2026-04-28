// Types for the "Tengo un cliente nuevo" AI intake flow

export type UrgencyLevel = "urgent" | "normal" | "flexible"
export type RedFlagSeverity = "high" | "medium" | "low"
export type PaymentMethod = "transferencia" | "paypal" | "wise" | "crypto" | "efectivo" | "tarjeta"

export interface ClientMessage {
  content: string
  source: "whatsapp" | "email" | "brief" | "other"
  receivedAt?: Date
}

export interface ExtractedScope {
  summary: string
  projectType: string
  estimatedComplexity: "low" | "medium" | "high"
  suggestedDeliverables: string[]
  uncertainAreas: string[]
}

export interface UrgencyAnalysis {
  level: UrgencyLevel
  deadline?: string
  reasoning: string
  flexibilityNotes?: string
}

export interface BudgetClues {
  mentioned: boolean
  extractedAmount?: number
  currency?: string
  rangeMin?: number
  rangeMax?: number
  clientExpectation: "low" | "market" | "premium" | "unclear"
  pricingGuidance: string
  suggestedHourlyRate?: number
  suggestedProjectRate?: number
}

export interface PaymentRecommendation {
  primary: PaymentMethod
  alternatives: PaymentMethod[]
  reasoning: string
  riskNotes?: string
}

export interface RedFlag {
  id: string
  title: string
  description: string
  severity: RedFlagSeverity
  recommendation: string
}

export interface SuggestedReply {
  tone: "formal" | "friendly" | "professional"
  subject?: string
  body: string
  callToAction: string
}

export interface NextStep {
  id: string
  action: string
  description: string
  priority: "high" | "medium" | "low"
  linkedTool?: "calculadora" | "presupuestos" | "recibos" | "pagos"
  linkHref?: string
}

export interface ClientAnalysis {
  id: string
  createdAt: Date
  originalMessage: ClientMessage
  clientName?: string
  clientCompany?: string
  clientEmail?: string
  
  // Core analysis sections
  scope: ExtractedScope
  urgency: UrgencyAnalysis
  budget: BudgetClues
  paymentMethod: PaymentRecommendation
  redFlags: RedFlag[]
  suggestedReply: SuggestedReply
  nextSteps: NextStep[]
  
  // Meta
  confidenceScore: number // 0-100
  analysisNotes?: string
}

// Analysis request/response for future API integration
export interface AnalyzeClientRequest {
  message: string
  source: ClientMessage["source"]
}

export interface AnalyzeClientResponse {
  success: boolean
  analysis?: ClientAnalysis
  error?: string
}
