import { type DashboardInsights } from "@/lib/ai/schemas"

interface Project {
  id: string
  clientName: string
  status: string
  endDate?: string
  totalBudget: number
  paidAmount: number
}

interface Payment {
  id: string
  clientName: string
  amount: number
  dueDate: string
  status: string
  daysOverdue?: number
}

interface FollowUp {
  id: string
  clientName: string
  type: string
  dueDate: string
  priority: string
}

// Generate rule-based insights from the data
function generateInsights(
  projects: Project[],
  payments: Payment[],
  followUps: FollowUp[],
  today: string
): DashboardInsights {
  const priorities: DashboardInsights['priorities'] = []
  const actions: DashboardInsights['actions'] = []
  const alerts: DashboardInsights['alerts'] = []
  
  const todayDate = new Date(today)
  
  // Analyze overdue payments
  const overduePayments = payments.filter(p => 
    p.status === 'overdue' || 
    (p.dueDate && new Date(p.dueDate) < todayDate && p.status !== 'paid')
  )
  
  // Analyze payments due soon
  const upcomingPayments = payments.filter(p => {
    if (p.status === 'paid') return false
    const dueDate = new Date(p.dueDate)
    const daysUntil = Math.ceil((dueDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntil >= 0 && daysUntil <= 7
  })
  
  // Analyze follow-ups due today or overdue
  const urgentFollowUps = followUps.filter(f => {
    const dueDate = new Date(f.dueDate)
    return dueDate <= todayDate || f.priority === 'high'
  })
  
  // Generate priorities
  if (overduePayments.length > 0) {
    const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0)
    priorities.push({
      id: 'pri-1',
      title: `Cobrar ${overduePayments.length} pago${overduePayments.length > 1 ? 's' : ''} vencido${overduePayments.length > 1 ? 's' : ''}`,
      description: `Tienes pagos vencidos por un total de $${totalOverdue.toLocaleString()}`,
      type: 'payment',
      urgency: 'high',
      whyNow: 'Cada día que pasa reduce la probabilidad de cobro',
      relatedIds: overduePayments.map(p => p.id)
    })
  }
  
  if (urgentFollowUps.length > 0) {
    priorities.push({
      id: 'pri-2',
      title: `Realizar ${urgentFollowUps.length} seguimiento${urgentFollowUps.length > 1 ? 's' : ''} urgente${urgentFollowUps.length > 1 ? 's' : ''}`,
      description: `Hay seguimientos que requieren tu atención hoy`,
      type: 'follow-up',
      urgency: urgentFollowUps.some(f => f.priority === 'high') ? 'high' : 'medium',
      whyNow: 'Los seguimientos oportunos mantienen la relación con el cliente',
      relatedIds: urgentFollowUps.map(f => f.id)
    })
  }
  
  if (upcomingPayments.length > 0) {
    priorities.push({
      id: 'pri-3',
      title: `Preparar ${upcomingPayments.length} factura${upcomingPayments.length > 1 ? 's' : ''} próxima${upcomingPayments.length > 1 ? 's' : ''}`,
      description: `Pagos que vencen esta semana`,
      type: 'payment',
      urgency: 'medium',
      whyNow: 'Enviar recordatorios antes del vencimiento mejora la tasa de cobro',
      relatedIds: upcomingPayments.map(p => p.id)
    })
  }
  
  // Active projects nearing end date
  const nearingEndProjects = projects.filter(p => {
    if (!p.endDate || p.status !== 'active') return false
    const endDate = new Date(p.endDate)
    const daysUntil = Math.ceil((endDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntil >= 0 && daysUntil <= 14
  })
  
  if (nearingEndProjects.length > 0) {
    priorities.push({
      id: 'pri-4',
      title: `Revisar ${nearingEndProjects.length} proyecto${nearingEndProjects.length > 1 ? 's' : ''} por finalizar`,
      description: `Proyectos que terminan en las próximas 2 semanas`,
      type: 'project',
      urgency: 'medium',
      whyNow: 'Asegúrate de entregar a tiempo y facturar el saldo pendiente',
      relatedIds: nearingEndProjects.map(p => p.id)
    })
  }
  
  // Generate actions
  if (overduePayments.length > 0) {
    const highestOverdue = overduePayments.sort((a, b) => b.amount - a.amount)[0]
    actions.push({
      id: 'act-1',
      title: `Llamar a ${highestOverdue.clientName}`,
      description: `Tiene un pago pendiente de $${highestOverdue.amount.toLocaleString()}`,
      actionType: 'call',
      estimatedImpact: `+$${highestOverdue.amount.toLocaleString()} potencial`,
      relatedId: highestOverdue.id
    })
  }
  
  if (urgentFollowUps.length > 0) {
    const firstFollowUp = urgentFollowUps[0]
    actions.push({
      id: 'act-2',
      title: `Enviar mensaje a ${firstFollowUp.clientName}`,
      description: `Seguimiento ${firstFollowUp.type} pendiente`,
      actionType: 'message',
      relatedId: firstFollowUp.id
    })
  }
  
  // Suggest creating invoice if projects have pending balance
  const projectsWithBalance = projects.filter(p => 
    p.status === 'active' && (p.totalBudget - p.paidAmount) > 0
  )
  
  if (projectsWithBalance.length > 0) {
    const totalPending = projectsWithBalance.reduce((sum, p) => sum + (p.totalBudget - p.paidAmount), 0)
    actions.push({
      id: 'act-3',
      title: 'Revisar saldos pendientes de proyectos',
      description: `Tienes $${totalPending.toLocaleString()} por facturar en proyectos activos`,
      actionType: 'review'
    })
  }
  
  // Generate alerts
  if (overduePayments.some(p => (p.daysOverdue || 0) > 30)) {
    const veryOverdue = overduePayments.filter(p => (p.daysOverdue || 0) > 30)
    alerts.push({
      id: 'alert-1',
      title: 'Pagos con más de 30 días vencidos',
      description: `${veryOverdue.length} pago${veryOverdue.length > 1 ? 's' : ''} requiere${veryOverdue.length > 1 ? 'n' : ''} acción inmediata`,
      severity: 'high',
      category: 'payment',
      relatedIds: veryOverdue.map(p => p.id)
    })
  }
  
  // Calculate weekly insight
  const totalPendingPayments = payments
    .filter(p => p.status !== 'paid')
    .reduce((sum, p) => sum + p.amount, 0)
  
  const activeProjectsCount = projects.filter(p => p.status === 'active').length
  
  const weeklyInsight = overduePayments.length > 0
    ? `Esta semana es clave para recuperar $${overduePayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} en pagos vencidos. Prioriza las llamadas a clientes.`
    : activeProjectsCount > 0
    ? `Tienes ${activeProjectsCount} proyecto${activeProjectsCount > 1 ? 's' : ''} activo${activeProjectsCount > 1 ? 's' : ''} y $${totalPendingPayments.toLocaleString()} por cobrar. Mantén el ritmo.`
    : 'Buen momento para buscar nuevos clientes y proyectos.'
  
  return {
    priorities: priorities.slice(0, 5),
    actions: actions.slice(0, 4),
    alerts: alerts.slice(0, 3),
    weeklyInsight
  }
}

export async function POST(req: Request) {
  try {
    const { projects, payments, followUps, currentDate } = await req.json()

    const today = currentDate || new Date().toISOString().split('T')[0]

    // Generate insights using rule-based logic
    const insights = generateInsights(
      projects || [],
      payments || [],
      followUps || [],
      today
    )

    return Response.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Finko AI] Error generating dashboard insights:", error)
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Error generating insights" 
      },
      { status: 500 }
    )
  }
}
