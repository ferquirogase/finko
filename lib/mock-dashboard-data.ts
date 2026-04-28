// Mock data for Finko AI Dashboard
// This data simulates what would come from AI analysis of freelancer activity
// Ready to be replaced with real backend/AI service calls

export interface WeeklyBriefing {
  totalIngresos: number
  proyectosActivos: number
  propuestasEnviadas: number
  tasaConversion: number
  horasRegistradas: number
  tendencia: "up" | "down" | "stable"
  comparacionSemanaAnterior: number
  alertasCriticas: number
}

export interface UrgentAlert {
  id: string
  type: "pago_vencido" | "deadline_proximo" | "cliente_sin_respuesta" | "factura_pendiente"
  title: string
  description: string
  clientName?: string
  amount?: number
  currency?: string
  dueDate?: string
  daysOverdue?: number
  priority: "high" | "medium" | "low"
  actionLabel: string
  actionHref?: string
}

export interface RecommendedAction {
  id: string
  type: "followup" | "cobro" | "propuesta" | "entrega" | "revision"
  title: string
  description: string
  reason: string // AI reasoning for why this action is recommended
  clientName?: string
  projectName?: string
  suggestedDate?: string
  actionLabel: string
  actionHref?: string
}

export interface FollowUpItem {
  id: string
  clientName: string
  projectName?: string
  lastContactDate: string
  daysSinceContact: number
  suggestedAction: string
  channel: "email" | "whatsapp" | "llamada"
  status: "pending" | "scheduled" | "completed"
}

export interface PaymentReminder {
  id: string
  clientName: string
  projectName: string
  invoiceNumber?: string
  amount: number
  currency: string
  dueDate: string
  status: "por_vencer" | "vencido" | "muy_vencido"
  daysUntilDue: number // negative if overdue
}

// Mock data - represents a typical freelancer's week
export const mockWeeklyBriefing: WeeklyBriefing = {
  totalIngresos: 2850,
  proyectosActivos: 4,
  propuestasEnviadas: 3,
  tasaConversion: 67,
  horasRegistradas: 32,
  tendencia: "up",
  comparacionSemanaAnterior: 15,
  alertasCriticas: 2,
}

export const mockUrgentAlerts: UrgentAlert[] = [
  {
    id: "alert-1",
    type: "pago_vencido",
    title: "Pago vencido hace 7 días",
    description: "El pago del proyecto de diseño web está pendiente",
    clientName: "Startup XYZ",
    amount: 1200,
    currency: "USD",
    dueDate: "2024-01-15",
    daysOverdue: 7,
    priority: "high",
    actionLabel: "Enviar recordatorio",
  },
  {
    id: "alert-2",
    type: "deadline_proximo",
    title: "Entrega en 2 días",
    description: "Revisión final del proyecto de branding",
    clientName: "Café del Centro",
    dueDate: "2024-01-24",
    priority: "high",
    actionLabel: "Ver proyecto",
  },
  {
    id: "alert-3",
    type: "cliente_sin_respuesta",
    title: "Sin respuesta hace 5 días",
    description: "Esperando aprobación de propuesta enviada",
    clientName: "Tech Solutions SA",
    priority: "medium",
    actionLabel: "Hacer follow-up",
  },
]

export const mockRecommendedActions: RecommendedAction[] = [
  {
    id: "action-1",
    type: "followup",
    title: "Contactar a María García",
    description: "Consultar sobre el proyecto de identidad visual",
    reason: "Han pasado 4 días desde tu última comunicación y el proyecto está en fase de aprobación",
    clientName: "María García",
    projectName: "Identidad Visual",
    suggestedDate: "Hoy",
    actionLabel: "Redactar mensaje",
  },
  {
    id: "action-2",
    type: "cobro",
    title: "Generar factura pendiente",
    description: "El proyecto de consultoría fue entregado hace 3 días",
    reason: "El plazo de pago acordado fue de 7 días post-entrega. Es buen momento para enviar la factura.",
    clientName: "Agencia Digital",
    projectName: "Consultoría UX",
    actionLabel: "Crear factura",
    actionHref: "/recibos",
  },
  {
    id: "action-3",
    type: "propuesta",
    title: "Preparar propuesta para lead",
    description: "Nuevo contacto interesado en rediseño de e-commerce",
    reason: "Este lead llegó hace 2 días. Responder rápido aumenta la probabilidad de cierre en 40%.",
    clientName: "E-Shop Latino",
    actionLabel: "Crear presupuesto",
    actionHref: "/presupuestos",
  },
]

export const mockFollowUpQueue: FollowUpItem[] = [
  {
    id: "followup-1",
    clientName: "Carlos Méndez",
    projectName: "App Móvil",
    lastContactDate: "2024-01-18",
    daysSinceContact: 4,
    suggestedAction: "Enviar actualización de progreso",
    channel: "email",
    status: "pending",
  },
  {
    id: "followup-2",
    clientName: "Studio Creativo",
    projectName: "Manual de Marca",
    lastContactDate: "2024-01-17",
    daysSinceContact: 5,
    suggestedAction: "Confirmar fecha de entrega final",
    channel: "whatsapp",
    status: "pending",
  },
  {
    id: "followup-3",
    clientName: "Inversiones ABC",
    lastContactDate: "2024-01-15",
    daysSinceContact: 7,
    suggestedAction: "Verificar si recibió la propuesta",
    channel: "llamada",
    status: "scheduled",
  },
]

export const mockPaymentReminders: PaymentReminder[] = [
  {
    id: "payment-1",
    clientName: "Startup XYZ",
    projectName: "Diseño Web",
    invoiceNumber: "INV-2024-001",
    amount: 1200,
    currency: "USD",
    dueDate: "2024-01-15",
    status: "vencido",
    daysUntilDue: -7,
  },
  {
    id: "payment-2",
    clientName: "Café del Centro",
    projectName: "Branding Completo",
    invoiceNumber: "INV-2024-003",
    amount: 850,
    currency: "USD",
    dueDate: "2024-01-25",
    status: "por_vencer",
    daysUntilDue: 3,
  },
  {
    id: "payment-3",
    clientName: "Agencia Digital",
    projectName: "Consultoría UX",
    amount: 600,
    currency: "USD",
    dueDate: "2024-01-28",
    status: "por_vencer",
    daysUntilDue: 6,
  },
]

// Helper function to get dashboard data (future: replace with API call)
export async function getDashboardData() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  
  return {
    weeklyBriefing: mockWeeklyBriefing,
    urgentAlerts: mockUrgentAlerts,
    recommendedActions: mockRecommendedActions,
    followUpQueue: mockFollowUpQueue,
    paymentReminders: mockPaymentReminders,
  }
}
