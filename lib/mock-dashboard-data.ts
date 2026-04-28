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

// ===== ETAPA 4: Execution Tracking Types =====

export interface TodayPriority {
  id: string
  type: "delivery" | "followup" | "payment" | "meeting" | "task"
  title: string
  description: string
  clientName?: string
  projectName?: string
  urgency: "critical" | "high" | "medium"
  whyNow: string // AI explanation of why this is important today
  impact?: string // e.g., "20% más probabilidad de cierre si respondes hoy"
  dueTime?: string // e.g., "14:00" for meetings
  actionLabel: string
  actionHref?: string
  completed: boolean
}

export interface ActiveProject {
  id: string
  clientName: string
  projectName: string
  status: "en_progreso" | "esperando_feedback" | "por_entregar" | "en_revision"
  progress: number // 0-100
  startDate: string
  estimatedEndDate: string
  daysRemaining: number
  totalValue: number
  currency: string
  nextMilestone?: ProjectMilestone
  nextAction: {
    description: string
    dueDate?: string
    actionLabel: string
    actionHref?: string
  }
  healthStatus: "on_track" | "at_risk" | "delayed"
  healthReason?: string
}

export interface ProjectMilestone {
  id: string
  name: string
  dueDate: string
  status: "pending" | "in_progress" | "completed" | "overdue"
  daysUntilDue: number
}

export interface WeeklyDelivery {
  id: string
  projectName: string
  clientName: string
  milestoneName: string
  dueDate: string
  dayOfWeek: "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo"
  status: "pending" | "in_progress" | "completed" | "at_risk"
  progress: number
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

// ===== ETAPA 4: Execution Mock Data =====

export const mockTodayPriorities: TodayPriority[] = [
  {
    id: "priority-1",
    type: "delivery",
    title: "Entregar revisión final de branding",
    description: "Café del Centro espera los archivos finales hoy",
    clientName: "Café del Centro",
    projectName: "Branding Completo",
    urgency: "critical",
    whyNow: "El deadline es mañana y el cliente necesita tiempo para revisar",
    impact: "Evitar retraso y mantener tu reputación de entregas a tiempo",
    actionLabel: "Preparar entrega",
    actionHref: "/presupuestos",
    completed: false,
  },
  {
    id: "priority-2",
    type: "payment",
    title: "Cobrar factura vencida a Startup XYZ",
    description: "7 días de retraso en pago de $1,200 USD",
    clientName: "Startup XYZ",
    projectName: "Diseño Web",
    urgency: "high",
    whyNow: "Cada día que pasa reduce la probabilidad de cobro. Actuar hoy es clave.",
    impact: "Recuperar $1,200 USD pendientes",
    actionLabel: "Enviar recordatorio",
    actionHref: "/recibos",
    completed: false,
  },
  {
    id: "priority-3",
    type: "followup",
    title: "Responder a E-Shop Latino",
    description: "Lead caliente esperando propuesta de rediseño",
    clientName: "E-Shop Latino",
    urgency: "high",
    whyNow: "Han pasado 2 días sin respuesta. Responder hoy aumenta cierre en 40%.",
    impact: "Potencial proyecto de $3,000-5,000 USD",
    actionLabel: "Crear presupuesto",
    actionHref: "/presupuestos",
    completed: false,
  },
  {
    id: "priority-4",
    type: "task",
    title: "Actualizar progreso a Carlos Méndez",
    description: "Cliente esperando status del proyecto de App Móvil",
    clientName: "Carlos Méndez",
    projectName: "App Móvil",
    urgency: "medium",
    whyNow: "4 días sin comunicación. Un update breve mantiene la confianza.",
    actionLabel: "Enviar update",
    completed: false,
  },
]

export const mockActiveProjects: ActiveProject[] = [
  {
    id: "project-1",
    clientName: "Café del Centro",
    projectName: "Branding Completo",
    status: "por_entregar",
    progress: 90,
    startDate: "2024-01-02",
    estimatedEndDate: "2024-01-24",
    daysRemaining: 2,
    totalValue: 850,
    currency: "USD",
    nextMilestone: {
      id: "milestone-1",
      name: "Entrega final",
      dueDate: "2024-01-24",
      status: "in_progress",
      daysUntilDue: 2,
    },
    nextAction: {
      description: "Exportar archivos finales y preparar carpeta de entrega",
      dueDate: "2024-01-23",
      actionLabel: "Preparar entrega",
    },
    healthStatus: "on_track",
  },
  {
    id: "project-2",
    clientName: "Carlos Méndez",
    projectName: "App Móvil",
    status: "en_progreso",
    progress: 45,
    startDate: "2024-01-08",
    estimatedEndDate: "2024-02-15",
    daysRemaining: 24,
    totalValue: 3500,
    currency: "USD",
    nextMilestone: {
      id: "milestone-2",
      name: "Prototipo interactivo",
      dueDate: "2024-01-28",
      status: "in_progress",
      daysUntilDue: 6,
    },
    nextAction: {
      description: "Completar pantallas de onboarding y conectar flujo",
      dueDate: "2024-01-26",
      actionLabel: "Continuar diseño",
    },
    healthStatus: "on_track",
  },
  {
    id: "project-3",
    clientName: "María García",
    projectName: "Identidad Visual",
    status: "esperando_feedback",
    progress: 60,
    startDate: "2024-01-10",
    estimatedEndDate: "2024-02-05",
    daysRemaining: 14,
    totalValue: 1200,
    currency: "USD",
    nextMilestone: {
      id: "milestone-3",
      name: "Aprobación de logo",
      dueDate: "2024-01-25",
      status: "pending",
      daysUntilDue: 3,
    },
    nextAction: {
      description: "Esperar feedback de cliente sobre opciones de logo",
      actionLabel: "Hacer follow-up",
    },
    healthStatus: "at_risk",
    healthReason: "4 días sin respuesta del cliente. Puede afectar timeline.",
  },
  {
    id: "project-4",
    clientName: "Startup XYZ",
    projectName: "Diseño Web",
    status: "en_revision",
    progress: 100,
    startDate: "2023-12-15",
    estimatedEndDate: "2024-01-15",
    daysRemaining: 0,
    totalValue: 1200,
    currency: "USD",
    nextAction: {
      description: "Cobrar factura pendiente - proyecto entregado",
      actionLabel: "Enviar recordatorio",
      actionHref: "/recibos",
    },
    healthStatus: "delayed",
    healthReason: "Proyecto entregado pero pago vencido hace 7 días.",
  },
]

export const mockWeeklyDeliveries: WeeklyDelivery[] = [
  {
    id: "delivery-1",
    projectName: "Branding Completo",
    clientName: "Café del Centro",
    milestoneName: "Entrega final",
    dueDate: "2024-01-24",
    dayOfWeek: "miercoles",
    status: "in_progress",
    progress: 90,
  },
  {
    id: "delivery-2",
    projectName: "Identidad Visual",
    clientName: "María García",
    milestoneName: "Aprobación de logo",
    dueDate: "2024-01-25",
    dayOfWeek: "jueves",
    status: "at_risk",
    progress: 60,
  },
  {
    id: "delivery-3",
    projectName: "App Móvil",
    clientName: "Carlos Méndez",
    milestoneName: "Prototipo interactivo",
    dueDate: "2024-01-28",
    dayOfWeek: "domingo",
    status: "pending",
    progress: 45,
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
    todayPriorities: mockTodayPriorities,
    activeProjects: mockActiveProjects,
    weeklyDeliveries: mockWeeklyDeliveries,
  }
}
