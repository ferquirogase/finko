import type { ClientAnalysis, ClientMessage } from "@/types/new-client"

// Simulates AI analysis delay
const SIMULATED_DELAY_MS = 1500

// Mock analysis that extracts realistic data from any input
export async function analyzeClientMessage(
  message: string,
  source: ClientMessage["source"] = "whatsapp"
): Promise<ClientAnalysis> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))

  const now = new Date()
  const hasUrgentKeywords = /urgente|asap|rápido|mañana|hoy|deadline|apurado/i.test(message)
  const hasBudgetMention = /\$|usd|pesos|presupuesto|budget|precio|rate/i.test(message)
  const hasWebKeywords = /web|sitio|página|landing|ecommerce|tienda/i.test(message)
  const hasDesignKeywords = /diseño|logo|marca|branding|identidad/i.test(message)
  const hasAppKeywords = /app|aplicación|móvil|ios|android/i.test(message)

  // Determine project type
  let projectType = "Proyecto digital"
  if (hasWebKeywords) projectType = "Desarrollo web"
  else if (hasDesignKeywords) projectType = "Diseño gráfico"
  else if (hasAppKeywords) projectType = "Desarrollo de app"

  // Extract potential name (simple heuristic)
  const nameMatch = message.match(/(?:soy|me llamo|nombre es)\s+([A-Z][a-záéíóú]+)/i)
  const companyMatch = message.match(/(?:empresa|compañía|negocio|startup)\s+([A-Z][a-záéíóúA-Z\s]+)/i)

  const analysis: ClientAnalysis = {
    id: `analysis-${Date.now()}`,
    createdAt: now,
    originalMessage: {
      content: message,
      source,
      receivedAt: now,
    },
    clientName: nameMatch?.[1] || undefined,
    clientCompany: companyMatch?.[1]?.trim() || undefined,

    scope: {
      summary: generateScopeSummary(message, projectType),
      projectType,
      estimatedComplexity: message.length > 500 ? "high" : message.length > 200 ? "medium" : "low",
      suggestedDeliverables: generateDeliverables(projectType, message),
      uncertainAreas: generateUncertainAreas(message),
    },

    urgency: {
      level: hasUrgentKeywords ? "urgent" : "normal",
      deadline: hasUrgentKeywords ? "Próxima semana (mencionado)" : undefined,
      reasoning: hasUrgentKeywords
        ? "El cliente menciona urgencia o plazos cortos en su mensaje"
        : "No se detectaron indicadores de urgencia específicos",
      flexibilityNotes: hasUrgentKeywords
        ? "Considerar cobrar tarifa de urgencia (15-25% extra)"
        : "Hay margen para negociar plazos según tu disponibilidad",
    },

    budget: {
      mentioned: hasBudgetMention,
      clientExpectation: hasBudgetMention ? "market" : "unclear",
      pricingGuidance: generatePricingGuidance(projectType, message),
      suggestedHourlyRate: getSuggestedRate(projectType),
      suggestedProjectRate: getSuggestedProjectRate(projectType, message),
    },

    paymentMethod: {
      primary: "transferencia",
      alternatives: ["wise", "paypal"],
      reasoning:
        "Para clientes nuevos, se recomienda transferencia bancaria con 50% de anticipo. Si es internacional, Wise ofrece mejores tasas que PayPal.",
      riskNotes: "Siempre cobrar anticipo antes de comenzar trabajo significativo",
    },

    redFlags: generateRedFlags(message),

    suggestedReply: {
      tone: "professional",
      subject: `Re: ${projectType} - Próximos pasos`,
      body: generateReplyBody(projectType, message),
      callToAction:
        "¿Te parece si agendamos una llamada de 15 minutos para afinar los detalles?",
    },

    nextSteps: generateNextSteps(projectType),

    confidenceScore: calculateConfidence(message),
    analysisNotes:
      message.length < 50
        ? "Mensaje corto - considera pedir más contexto al cliente"
        : undefined,
  }

  return analysis
}

function generateScopeSummary(message: string, projectType: string): string {
  const length = message.length
  if (length < 100) {
    return `Solicitud de ${projectType.toLowerCase()}. El mensaje es breve - se recomienda solicitar más detalles antes de cotizar.`
  }
  return `Proyecto de ${projectType.toLowerCase()} con alcance por definir. El cliente muestra interés inicial y hay suficiente contexto para una primera conversación.`
}

function generateDeliverables(projectType: string, message: string): string[] {
  const base: Record<string, string[]> = {
    "Desarrollo web": [
      "Diseño UI/UX responsive",
      "Desarrollo frontend",
      "Integración con backend/CMS",
      "Testing y QA",
      "Deploy y configuración",
    ],
    "Diseño gráfico": [
      "Propuesta de concepto (2-3 opciones)",
      "Diseño final en formatos digitales",
      "Archivos editables (AI/PSD/Figma)",
      "Guía de uso básica",
    ],
    "Desarrollo de app": [
      "Wireframes y flujos de usuario",
      "Diseño de interfaz",
      "Desarrollo MVP",
      "Testing en dispositivos",
      "Publicación en stores",
    ],
    "Proyecto digital": [
      "Definición de alcance detallado",
      "Entregables según requerimientos",
      "Revisiones incluidas (2 rondas)",
      "Entrega final documentada",
    ],
  }
  return base[projectType] || base["Proyecto digital"]
}

function generateUncertainAreas(message: string): string[] {
  const areas: string[] = []
  if (!/plazo|tiempo|fecha|deadline|cuando/i.test(message)) {
    areas.push("Plazos de entrega no especificados")
  }
  if (!/presupuesto|budget|\$|precio/i.test(message)) {
    areas.push("Presupuesto del cliente no mencionado")
  }
  if (!/contenido|textos|imágenes|assets/i.test(message)) {
    areas.push("¿Quién provee el contenido?")
  }
  if (areas.length === 0) {
    areas.push("Revisar alcance detallado en llamada inicial")
  }
  return areas
}

function generatePricingGuidance(projectType: string, message: string): string {
  const hasComplexity = message.length > 300
  if (projectType === "Desarrollo web") {
    return hasComplexity
      ? "Proyecto web con alcance amplio. Considera cotizar entre $800-2500 USD dependiendo de funcionalidades específicas."
      : "Proyecto web estándar. Rango típico: $500-1200 USD para landing/sitio básico."
  }
  if (projectType === "Diseño gráfico") {
    return "Diseño gráfico profesional. Rango: $200-800 USD según complejidad y cantidad de entregables."
  }
  if (projectType === "Desarrollo de app") {
    return "Apps tienen alta variabilidad. MVP básico: $3000-8000 USD. Clarificar alcance antes de cotizar."
  }
  return "Solicitar más detalles para dar un rango de precio preciso."
}

function getSuggestedRate(projectType: string): number {
  const rates: Record<string, number> = {
    "Desarrollo web": 45,
    "Diseño gráfico": 35,
    "Desarrollo de app": 55,
    "Proyecto digital": 40,
  }
  return rates[projectType] || 40
}

function getSuggestedProjectRate(projectType: string, message: string): number {
  const complexity = message.length > 300 ? 1.5 : 1
  const bases: Record<string, number> = {
    "Desarrollo web": 800,
    "Diseño gráfico": 400,
    "Desarrollo de app": 3500,
    "Proyecto digital": 600,
  }
  return Math.round((bases[projectType] || 600) * complexity)
}

function generateRedFlags(message: string): ClientAnalysis["redFlags"] {
  const flags: ClientAnalysis["redFlags"] = []

  if (/gratis|free|sin costo|intercambio|exposure/i.test(message)) {
    flags.push({
      id: "rf-1",
      title: "Expectativa de trabajo gratis",
      description: "El mensaje sugiere que el cliente espera trabajo sin pago o a cambio de exposición",
      severity: "high",
      recommendation: "Aclarar tus tarifas desde el inicio. Si insiste, declinar amablemente.",
    })
  }

  if (/urgente|asap|para ayer|mañana/i.test(message)) {
    flags.push({
      id: "rf-2",
      title: "Urgencia extrema",
      description: "Plazos muy ajustados pueden indicar mala planificación del cliente",
      severity: "medium",
      recommendation: "Cobrar tarifa de urgencia (15-25% extra) y definir expectativas claras.",
    })
  }

  if (/sencillo|fácil|rápido|no es mucho/i.test(message)) {
    flags.push({
      id: "rf-3",
      title: "Minimización del trabajo",
      description: "Frases como 'es algo sencillo' suelen subestimar el esfuerzo real",
      severity: "low",
      recommendation: "Desglosar el trabajo en tareas para mostrar la complejidad real.",
    })
  }

  if (message.length < 50) {
    flags.push({
      id: "rf-4",
      title: "Información insuficiente",
      description: "El mensaje es muy corto para entender bien el proyecto",
      severity: "low",
      recommendation: "Hacer preguntas específicas antes de cotizar o comprometerse.",
    })
  }

  return flags
}

function generateReplyBody(projectType: string, message: string): string {
  return `¡Hola! Gracias por contactarme.

Me interesa saber más sobre tu proyecto de ${projectType.toLowerCase()}. Por lo que mencionas, creo que podemos trabajar juntos.

Para darte una cotización precisa, me ayudaría conocer:
• ¿Cuál es el objetivo principal del proyecto?
• ¿Tienes alguna fecha límite en mente?
• ¿Tienes referencias visuales o ejemplos de lo que buscas?

Con esa info puedo prepararte una propuesta detallada.`
}

function generateNextSteps(projectType: string): ClientAnalysis["nextSteps"] {
  return [
    {
      id: "ns-1",
      action: "Responder al cliente",
      description: "Usa la respuesta sugerida como base y personalízala",
      priority: "high",
    },
    {
      id: "ns-2",
      action: "Calcular tu tarifa",
      description: "Revisa cuánto deberías cobrar por este tipo de proyecto",
      priority: "high",
      linkedTool: "calculadora",
      linkHref: "/calculadora",
    },
    {
      id: "ns-3",
      action: "Crear presupuesto",
      description: "Genera un presupuesto profesional para enviar al cliente",
      priority: "medium",
      linkedTool: "presupuestos",
      linkHref: "/presupuestos",
    },
    {
      id: "ns-4",
      action: "Agendar llamada",
      description: "Una llamada de 15 min ayuda a cerrar más rápido",
      priority: "medium",
    },
  ]
}

function calculateConfidence(message: string): number {
  let score = 50
  if (message.length > 100) score += 15
  if (message.length > 300) score += 10
  if (/proyecto|necesito|quiero|busco/i.test(message)) score += 10
  if (/\$|presupuesto|budget/i.test(message)) score += 10
  if (/plazo|fecha|deadline/i.test(message)) score += 5
  return Math.min(score, 95)
}
