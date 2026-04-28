import type { ClientAnalysis, ClientMessage, DataSource, EditableValue } from "@/types/new-client"

// Simulates AI analysis delay
const SIMULATED_DELAY_MS = 1500

// Helper to create editable values with confidence tracking
function editable<T>(
  value: T,
  source: DataSource,
  reason: string,
  confidence: number = 70
): EditableValue<T> {
  return {
    value,
    isEditable: true,
    confidence: {
      level: confidence,
      source,
      reason,
    },
  }
}

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
  let projectTypeSource: DataSource = "assumption"
  let projectTypeReason = "No se detectaron palabras clave específicas del tipo de proyecto"
  
  if (hasWebKeywords) {
    projectType = "Desarrollo web"
    projectTypeSource = "detected"
    projectTypeReason = "Palabras clave de web detectadas en el mensaje"
  } else if (hasDesignKeywords) {
    projectType = "Diseño gráfico"
    projectTypeSource = "detected"
    projectTypeReason = "Palabras clave de diseño detectadas"
  } else if (hasAppKeywords) {
    projectType = "Desarrollo de app"
    projectTypeSource = "detected"
    projectTypeReason = "Palabras clave de app/móvil detectadas"
  }

  // Extract potential name (simple heuristic)
  const nameMatch = message.match(/(?:soy|me llamo|nombre es)\s+([A-Z][a-záéíóú]+)/i)
  const companyMatch = message.match(/(?:empresa|compañía|negocio|startup)\s+([A-Z][a-záéíóúA-Z\s]+)/i)
  const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i)

  const analysis: ClientAnalysis = {
    id: `analysis-${Date.now()}`,
    createdAt: now,
    originalMessage: {
      content: message,
      source,
      receivedAt: now,
    },
    clientName: editable(
      nameMatch?.[1] || undefined,
      nameMatch ? "detected" : "assumption",
      nameMatch ? "Nombre extraído del mensaje" : "No se detectó nombre - agregar manualmente",
      nameMatch ? 85 : 20
    ),
    clientCompany: editable(
      companyMatch?.[1]?.trim() || undefined,
      companyMatch ? "detected" : "assumption",
      companyMatch ? "Empresa mencionada en el mensaje" : "No se detectó empresa",
      companyMatch ? 80 : 20
    ),
    clientEmail: editable(
      emailMatch?.[0] || undefined,
      emailMatch ? "detected" : "assumption",
      emailMatch ? "Email encontrado en el mensaje" : "No se detectó email",
      emailMatch ? 95 : 10
    ),

    scope: {
      summary: editable(
        generateScopeSummary(message, projectType),
        "inferred",
        "Resumen generado a partir del análisis del mensaje",
        75
      ),
      projectType: editable(
        projectType,
        projectTypeSource,
        projectTypeReason,
        projectTypeSource === "detected" ? 90 : 50
      ),
      estimatedComplexity: editable(
        message.length > 500 ? "high" : message.length > 200 ? "medium" : "low",
        "inferred",
        "Estimado basado en la extensión y detalle del mensaje",
        60
      ),
      suggestedDeliverables: editable(
        generateDeliverables(projectType, message),
        "inferred",
        "Entregables típicos para este tipo de proyecto - ajustar según necesidad",
        65
      ),
      uncertainAreas: generateUncertainAreas(message),
    },

    urgency: {
      level: editable(
        hasUrgentKeywords ? "urgent" : "normal",
        hasUrgentKeywords ? "detected" : "inferred",
        hasUrgentKeywords 
          ? "Palabras de urgencia detectadas en el mensaje" 
          : "Sin indicadores de urgencia - asumiendo timeline normal",
        hasUrgentKeywords ? 90 : 70
      ),
      deadline: editable(
        hasUrgentKeywords ? "Próxima semana (mencionado)" : undefined,
        hasUrgentKeywords ? "inferred" : "assumption",
        hasUrgentKeywords 
          ? "Fecha estimada basada en urgencia detectada" 
          : "Sin deadline específico mencionado",
        hasUrgentKeywords ? 60 : 30
      ),
      reasoning: hasUrgentKeywords
        ? "El cliente menciona urgencia o plazos cortos en su mensaje"
        : "No se detectaron indicadores de urgencia específicos",
      flexibilityNotes: hasUrgentKeywords
        ? "Considerar cobrar tarifa de urgencia (15-25% extra)"
        : "Hay margen para negociar plazos según tu disponibilidad",
    },

    budget: {
      mentioned: hasBudgetMention,
      clientExpectation: editable(
        hasBudgetMention ? "market" : "unclear",
        hasBudgetMention ? "inferred" : "assumption",
        hasBudgetMention 
          ? "El cliente menciona presupuesto - expectativas de mercado asumidas" 
          : "Sin mención de presupuesto - clarificar expectativas",
        hasBudgetMention ? 65 : 40
      ),
      pricingGuidance: generatePricingGuidance(projectType, message),
      suggestedHourlyRate: editable(
        getSuggestedRate(projectType),
        "inferred",
        `Tarifa promedio para ${projectType.toLowerCase()} en LATAM`,
        70
      ),
      suggestedProjectRate: editable(
        getSuggestedProjectRate(projectType, message),
        "inferred",
        "Estimación basada en tipo de proyecto y complejidad detectada",
        55
      ),
    },

    paymentMethod: {
      primary: editable(
        "transferencia",
        "inferred",
        "Transferencia es el método más seguro para clientes nuevos",
        85
      ),
      alternatives: ["wise", "paypal"],
      reasoning:
        "Para clientes nuevos, se recomienda transferencia bancaria con 50% de anticipo. Si es internacional, Wise ofrece mejores tasas que PayPal.",
      riskNotes: "Siempre cobrar anticipo antes de comenzar trabajo significativo",
    },

    redFlags: generateRedFlags(message),

    suggestedReply: {
      tone: editable(
        "professional",
        "inferred",
        "Tono profesional recomendado para primer contacto",
        80
      ),
      subject: editable(
        `Re: ${projectType} - Próximos pasos`,
        "inferred",
        "Asunto sugerido basado en tipo de proyecto",
        75
      ),
      body: editable(
        generateReplyBody(projectType, message),
        "inferred",
        "Respuesta generada - editar y personalizar antes de enviar",
        70
      ),
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

function generateDeliverables(projectType: string, _message: string): string[] {
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
      action: {
        tool: "email",
        label: "Enviar tarifas",
        prefillData: { template: "rates" },
      },
    })
  }

  if (/urgente|asap|para ayer|mañana/i.test(message)) {
    flags.push({
      id: "rf-2",
      title: "Urgencia extrema",
      description: "Plazos muy ajustados pueden indicar mala planificación del cliente",
      severity: "medium",
      recommendation: "Cobrar tarifa de urgencia (15-25% extra) y definir expectativas claras.",
      action: {
        tool: "calculadora",
        label: "Calcular con urgencia",
        href: "/calculadora",
        prefillData: { urgencyMultiplier: 1.2 },
      },
    })
  }

  if (/sencillo|fácil|rápido|no es mucho/i.test(message)) {
    flags.push({
      id: "rf-3",
      title: "Minimización del trabajo",
      description: "Frases como 'es algo sencillo' suelen subestimar el esfuerzo real",
      severity: "low",
      recommendation: "Desglosar el trabajo en tareas para mostrar la complejidad real.",
      action: {
        tool: "presupuestos",
        label: "Detallar en presupuesto",
        href: "/presupuestos",
      },
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

function generateReplyBody(projectType: string, _message: string): string {
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
      linkedAction: {
        tool: "whatsapp",
        label: "Copiar respuesta",
      },
    },
    {
      id: "ns-2",
      action: "Calcular tu tarifa",
      description: "Revisa cuánto deberías cobrar por este tipo de proyecto",
      priority: "high",
      linkedTool: "calculadora",
      linkHref: "/calculadora",
      linkedAction: {
        tool: "calculadora",
        label: "Ir a calculadora",
        href: "/calculadora",
        prefillData: { projectType },
      },
    },
    {
      id: "ns-3",
      action: "Crear presupuesto",
      description: "Genera un presupuesto profesional para enviar al cliente",
      priority: "medium",
      linkedTool: "presupuestos",
      linkHref: "/presupuestos",
      linkedAction: {
        tool: "presupuestos",
        label: "Crear presupuesto",
        href: "/presupuestos",
        prefillData: { projectType },
      },
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
