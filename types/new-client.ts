// Types for the "Tengo un cliente nuevo" AI intake flow

export type UrgencyLevel = "urgent" | "normal" | "flexible"
export type RedFlagSeverity = "high" | "medium" | "low"
export type PaymentMethod = "transferencia" | "paypal" | "wise" | "crypto" | "efectivo" | "tarjeta"

// Decision layer types - distinguishes facts from inferences
export type DataSource = "detected" | "inferred" | "assumption"

export interface ConfidenceInfo {
  level: number // 0-100
  source: DataSource
  reason: string
}

export interface EditableValue<T> {
  value: T
  isEditable: boolean
  confidence: ConfidenceInfo
}

export interface LinkedAction {
  tool: "calculadora" | "presupuestos" | "recibos" | "pagos" | "whatsapp" | "email"
  label: string
  href?: string
  prefillData?: Record<string, unknown>
}

export interface ClientMessage {
  content: string
  source: "whatsapp" | "email" | "brief" | "other"
  receivedAt?: Date
}

export interface ExtractedScope {
  summary: EditableValue<string>
  projectType: EditableValue<string>
  estimatedComplexity: EditableValue<"low" | "medium" | "high">
  suggestedDeliverables: EditableValue<string[]>
  uncertainAreas: string[]
}

export interface UrgencyAnalysis {
  level: EditableValue<UrgencyLevel>
  deadline: EditableValue<string | undefined>
  reasoning: string
  flexibilityNotes?: string
}

export interface BudgetClues {
  mentioned: boolean
  extractedAmount?: number
  currency?: string
  rangeMin?: number
  rangeMax?: number
  clientExpectation: EditableValue<"low" | "market" | "premium" | "unclear">
  pricingGuidance: string
  suggestedHourlyRate: EditableValue<number | undefined>
  suggestedProjectRate: EditableValue<number | undefined>
}

export interface PaymentRecommendation {
  primary: EditableValue<PaymentMethod>
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
  action?: LinkedAction
}

export interface SuggestedReply {
  tone: EditableValue<"formal" | "friendly" | "professional">
  subject: EditableValue<string | undefined>
  body: EditableValue<string>
  callToAction: string
  sentAt?: Date
}

export interface NextStep {
  id: string
  action: string
  description: string
  priority: "high" | "medium" | "low"
  linkedTool?: "calculadora" | "presupuestos" | "recibos" | "pagos"
  linkHref?: string
  linkedAction?: LinkedAction
  completed?: boolean
}

export interface ClientAnalysis {
  id: string
  createdAt: Date
  originalMessage: ClientMessage
  clientName: EditableValue<string | undefined>
  clientCompany: EditableValue<string | undefined>
  clientEmail: EditableValue<string | undefined>
  
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

// Helper to create editable values
export function createEditableValue<T>(
  value: T,
  source: DataSource = "inferred",
  reason: string = "",
  confidenceLevel: number = 70
): EditableValue<T> {
  return {
    value,
    isEditable: true,
    confidence: {
      level: confidenceLevel,
      source,
      reason,
    },
  }
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
