// Message drafts types and mock generator for communication assist layer

export type MessageScenario =
  | "first_reply"
  | "scope_clarification"
  | "price_defense"
  | "proposal_followup"
  | "payment_reminder_friendly"
  | "payment_reminder_firm"
  | "delivery_nudge"
  | "meeting_confirmation"
  | "project_update"

export type MessageTone = "formal" | "friendly" | "professional" | "firm"

export type MessageChannel = "whatsapp" | "email"

export interface MessageDraft {
  id: string
  scenario: MessageScenario
  channel: MessageChannel
  tone: MessageTone
  subject?: string // For emails
  body: string
  placeholders: string[] // Variables that need to be filled
  context: {
    clientName?: string
    projectName?: string
    amount?: number
    currency?: string
    daysOverdue?: number
    deadline?: string
  }
}

export interface MessageTemplate {
  scenario: MessageScenario
  tones: MessageTone[]
  channels: MessageChannel[]
  templates: {
    [key in MessageTone]?: {
      [channel in MessageChannel]?: {
        subject?: string
        body: string
      }
    }
  }
}

// Mock message templates by scenario
const messageTemplates: Record<MessageScenario, MessageTemplate> = {
  first_reply: {
    scenario: "first_reply",
    tones: ["professional", "friendly"],
    channels: ["whatsapp", "email"],
    templates: {
      professional: {
        whatsapp: {
          body: `Hola {clientName}! Gracias por contactarme.

Me interesa mucho tu proyecto de {projectType}. Para poder darte una cotización precisa, me gustaría agendar una llamada de 15-20 minutos esta semana.

¿Te funcionaría {suggestedDay} a las {suggestedTime}?

Saludos,
{myName}`,
        },
        email: {
          subject: "Re: Consulta sobre {projectType}",
          body: `Hola {clientName},

Gracias por contactarme respecto a tu proyecto de {projectType}.

Me interesa mucho entender más sobre lo que necesitas. Para poder darte una propuesta ajustada a tus necesidades, me gustaría agendar una llamada breve de 15-20 minutos.

¿Te funcionaría algún momento esta semana? Puedo adaptarme a tu disponibilidad.

Quedo atento a tu respuesta.

Saludos cordiales,
{myName}`,
        },
      },
      friendly: {
        whatsapp: {
          body: `Hola {clientName}! Qué bueno que me escribiste.

Tu proyecto suena interesante. Cuéntame un poco más sobre qué tienes en mente y qué fechas manejas.

¿Podemos hablar esta semana para entender mejor qué necesitas?`,
        },
        email: {
          subject: "Re: Consulta sobre {projectType}",
          body: `Hola {clientName}!

Qué bueno saber de ti. Tu proyecto suena muy interesante.

Me encantaría saber más detalles sobre lo que tienes en mente. ¿Podríamos agendar una llamada rápida esta semana para conversar?

Cuéntame qué horarios te funcionan mejor.

Saludos!
{myName}`,
        },
      },
    },
  },

  scope_clarification: {
    scenario: "scope_clarification",
    tones: ["professional", "friendly"],
    channels: ["whatsapp", "email"],
    templates: {
      professional: {
        whatsapp: {
          body: `Hola {clientName}, gracias por la info.

Para poder avanzar con la propuesta, necesito clarificar algunos puntos:

{clarificationQuestions}

¿Podrías ayudarme con esos detalles?`,
        },
        email: {
          subject: "Algunas preguntas sobre el proyecto",
          body: `Hola {clientName},

Gracias por compartir los detalles del proyecto. Antes de enviarte la propuesta formal, me gustaría clarificar algunos puntos:

{clarificationQuestions}

Tus respuestas me ayudarán a darte una cotización más precisa y ajustada a lo que realmente necesitas.

Quedo atento,
{myName}`,
        },
      },
      friendly: {
        whatsapp: {
          body: `Hola {clientName}! Gracias por los detalles.

Tengo algunas preguntas para asegurarme de entender bien lo que necesitas:

{clarificationQuestions}

Así te puedo armar algo que realmente te sirva.`,
        },
      },
    },
  },

  price_defense: {
    scenario: "price_defense",
    tones: ["professional", "firm"],
    channels: ["whatsapp", "email"],
    templates: {
      professional: {
        whatsapp: {
          body: `Hola {clientName}, entiendo tu preocupación sobre el presupuesto.

El precio refleja {valueProposition}. Incluye {keyDeliverables} y garantizo {guarantee}.

Si necesitas ajustar el alcance para trabajar con un presupuesto diferente, podemos conversarlo. Pero prefiero ser transparente sobre lo que realmente implica hacer esto bien.

¿Hablamos?`,
        },
        email: {
          subject: "Re: Sobre el presupuesto",
          body: `Hola {clientName},

Entiendo perfectamente tu preocupación sobre el presupuesto. Permíteme explicarte qué incluye:

{valueBreakdown}

El precio refleja el tiempo, expertise y recursos necesarios para entregarte un resultado profesional que realmente funcione para tu negocio.

Si tu presupuesto actual es diferente, podemos explorar opciones de alcance reducido o fases. Pero siempre prefiero ser transparente sobre lo que implica hacer las cosas bien.

¿Te parece si lo conversamos por llamada?

Saludos,
{myName}`,
        },
      },
      firm: {
        whatsapp: {
          body: `Hola {clientName}, gracias por tu feedback sobre el precio.

Mis tarifas reflejan mi experiencia y la calidad que entrego. No suelo negociar hacia abajo porque eso afecta el resultado final.

Si el presupuesto es una limitante, puedo sugerirte alternativas de alcance reducido. Pero el precio por hora/entrega se mantiene.

Avísame cómo quieres proceder.`,
        },
      },
    },
  },

  proposal_followup: {
    scenario: "proposal_followup",
    tones: ["professional", "friendly"],
    channels: ["whatsapp", "email"],
    templates: {
      professional: {
        whatsapp: {
          body: `Hola {clientName}! Espero que estés bien.

Te escribo para dar seguimiento a la propuesta que te envié hace {daysSent} días para {projectName}.

¿Tuviste oportunidad de revisarla? Si tienes preguntas o quieres ajustar algo, con gusto lo conversamos.

Quedo atento a tu respuesta.`,
        },
        email: {
          subject: "Seguimiento: Propuesta {projectName}",
          body: `Hola {clientName},

Espero que te encuentres bien. Te escribo para dar seguimiento a la propuesta que te envié hace {daysSent} días para el proyecto de {projectName}.

¿Has tenido oportunidad de revisarla? Estoy disponible para resolver cualquier duda o ajustar detalles según tus necesidades.

Quedo atento a tu respuesta.

Saludos cordiales,
{myName}`,
        },
      },
      friendly: {
        whatsapp: {
          body: `Hola {clientName}! ¿Cómo va todo?

Solo quería saber si pudiste ver la propuesta que te mandé. Si tienes dudas o quieres cambiar algo, avísame!

Sin presión, solo quería asegurarme de que te llegó bien.`,
        },
      },
    },
  },

  payment_reminder_friendly: {
    scenario: "payment_reminder_friendly",
    tones: ["friendly", "professional"],
    channels: ["whatsapp", "email"],
    templates: {
      friendly: {
        whatsapp: {
          body: `Hola {clientName}! Espero que todo bien.

Te escribo porque tengo pendiente el pago de {amount} {currency} por {projectName}. La fecha era el {dueDate}.

¿Todo bien por tu lado? Avísame si necesitas los datos de transferencia nuevamente o si hay algún inconveniente.

Gracias!`,
        },
        email: {
          subject: "Recordatorio: Pago pendiente - {projectName}",
          body: `Hola {clientName},

Espero que estés muy bien. Te escribo para recordarte sobre el pago pendiente de {amount} {currency} correspondiente a {projectName}.

La fecha de vencimiento era el {dueDate}. Si ya realizaste el pago, por favor ignora este mensaje. Si necesitas los datos bancarios nuevamente o tienes algún inconveniente, no dudes en avisarme.

Gracias por tu atención.

Saludos,
{myName}`,
        },
      },
      professional: {
        whatsapp: {
          body: `Hola {clientName}, buen día.

Te contacto respecto al pago de {amount} {currency} por {projectName}, que estaba programado para el {dueDate}.

¿Podrías confirmarme el estado? Si necesitas los datos de transferencia, con gusto te los reenvío.

Gracias,
{myName}`,
        },
      },
    },
  },

  payment_reminder_firm: {
    scenario: "payment_reminder_firm",
    tones: ["firm", "professional"],
    channels: ["whatsapp", "email"],
    templates: {
      firm: {
        whatsapp: {
          body: `Hola {clientName}.

El pago de {amount} {currency} por {projectName} tiene {daysOverdue} días de retraso desde la fecha acordada ({dueDate}).

Necesito que me confirmes una fecha de pago a la brevedad. Sin el pago regularizado, no podré continuar con trabajo adicional ni priorizar futuros pedidos.

Quedo atento a tu respuesta hoy.`,
        },
        email: {
          subject: "URGENTE: Pago vencido - {projectName}",
          body: `Hola {clientName},

Me comunico nuevamente respecto al pago pendiente de {amount} {currency} por {projectName}, el cual tiene {daysOverdue} días de retraso desde la fecha acordada ({dueDate}).

Es importante regularizar esta situación a la brevedad. Te solicito me confirmes una fecha concreta de pago dentro de las próximas 48 horas.

Hasta no recibir el pago, lamentablemente no podré priorizar trabajos adicionales ni comprometer nuevos plazos.

Adjunto nuevamente los datos para la transferencia:
{paymentDetails}

Quedo a la espera de tu pronta respuesta.

{myName}`,
        },
      },
      professional: {
        whatsapp: {
          body: `Hola {clientName}.

Seguimiento sobre el pago de {amount} {currency} por {projectName}. El pago tiene {daysOverdue} días de atraso.

Por favor confírmame cuándo puedo esperar la transferencia. Necesito cerrar este pendiente para poder planificar.

Gracias,
{myName}`,
        },
      },
    },
  },

  delivery_nudge: {
    scenario: "delivery_nudge",
    tones: ["professional", "friendly"],
    channels: ["whatsapp", "email"],
    templates: {
      professional: {
        whatsapp: {
          body: `Hola {clientName}! 

Te aviso que la entrega de {deliverable} está programada para {deliveryDate}.

Voy bien con los tiempos. ¿Hay algo que necesites de tu lado antes de esa fecha? Por ejemplo: {neededFromClient}

Avísame si todo sigue en pie o si hay cambios.`,
        },
        email: {
          subject: "Próxima entrega: {deliverable} - {deliveryDate}",
          body: `Hola {clientName},

Te escribo para confirmar que la entrega de {deliverable} está programada para el {deliveryDate}.

Por mi lado vamos bien con el avance. Solo quería confirmar:
- ¿Sigue vigente la fecha acordada?
- ¿Necesitas algo específico en la entrega?
{additionalQuestions}

Avísame si hay cambios o ajustes que necesites.

Saludos,
{myName}`,
        },
      },
      friendly: {
        whatsapp: {
          body: `Hola {clientName}! 

Solo para avisarte que vamos en tiempo con {deliverable}. La entrega sigue para el {deliveryDate}.

¿Todo bien por tu lado? ¿Cambió algo que deba saber?

Te aviso cuando esté listo para revisar!`,
        },
      },
    },
  },

  meeting_confirmation: {
    scenario: "meeting_confirmation",
    tones: ["professional", "friendly"],
    channels: ["whatsapp", "email"],
    templates: {
      professional: {
        whatsapp: {
          body: `Hola {clientName}! Confirmando nuestra llamada para {meetingDate} a las {meetingTime}.

{meetingLink}

Agenda tentativa:
{agendaItems}

¿Todo confirmado?`,
        },
      },
      friendly: {
        whatsapp: {
          body: `Hola {clientName}! Nos vemos {meetingDate} a las {meetingTime} 

{meetingLink}

Cualquier cosa me avisas!`,
        },
      },
    },
  },

  project_update: {
    scenario: "project_update",
    tones: ["professional", "friendly"],
    channels: ["whatsapp", "email"],
    templates: {
      professional: {
        whatsapp: {
          body: `Hola {clientName}! Update sobre {projectName}:

Completado: {completedItems}
En progreso: {inProgressItems}
Próximo: {nextItems}

Avance general: {progressPercent}%

¿Dudas o comentarios?`,
        },
        email: {
          subject: "Update semanal: {projectName}",
          body: `Hola {clientName},

Te comparto el avance del proyecto {projectName}:

**Completado esta semana:**
{completedItems}

**En progreso:**
{inProgressItems}

**Próximos pasos:**
{nextItems}

**Avance general:** {progressPercent}%

Si tienes preguntas o comentarios, estoy disponible.

Saludos,
{myName}`,
        },
      },
    },
  },
}

// Generate a contextual message draft
export function generateMessageDraft(
  scenario: MessageScenario,
  channel: MessageChannel,
  tone: MessageTone,
  context: MessageDraft["context"]
): MessageDraft | null {
  const template = messageTemplates[scenario]
  if (!template) return null

  const toneTemplate = template.templates[tone]
  if (!toneTemplate) return null

  const channelTemplate = toneTemplate[channel]
  if (!channelTemplate) return null

  // Replace placeholders with context values
  let body = channelTemplate.body
  let subject = channelTemplate.subject

  // Simple placeholder replacement
  if (context.clientName) {
    body = body.replace(/{clientName}/g, context.clientName)
    if (subject) subject = subject.replace(/{clientName}/g, context.clientName)
  }
  if (context.projectName) {
    body = body.replace(/{projectName}/g, context.projectName)
    body = body.replace(/{projectType}/g, context.projectName)
    if (subject) {
      subject = subject.replace(/{projectName}/g, context.projectName)
      subject = subject.replace(/{projectType}/g, context.projectName)
    }
  }
  if (context.amount) {
    body = body.replace(/{amount}/g, context.amount.toLocaleString())
  }
  if (context.currency) {
    body = body.replace(/{currency}/g, context.currency)
  }
  if (context.daysOverdue) {
    body = body.replace(/{daysOverdue}/g, context.daysOverdue.toString())
  }
  if (context.deadline) {
    body = body.replace(/{dueDate}/g, context.deadline)
    body = body.replace(/{deliveryDate}/g, context.deadline)
  }

  // Find remaining placeholders
  const placeholderRegex = /\{(\w+)\}/g
  const placeholders: string[] = []
  let match
  while ((match = placeholderRegex.exec(body)) !== null) {
    if (!placeholders.includes(match[1])) {
      placeholders.push(match[1])
    }
  }

  return {
    id: `${scenario}-${channel}-${tone}-${Date.now()}`,
    scenario,
    channel,
    tone,
    subject,
    body,
    placeholders,
    context,
  }
}

// Get available tones for a scenario
export function getAvailableTones(scenario: MessageScenario): MessageTone[] {
  return messageTemplates[scenario]?.tones || []
}

// Get available channels for a scenario
export function getAvailableChannels(scenario: MessageScenario): MessageChannel[] {
  return messageTemplates[scenario]?.channels || []
}

// Mock: Generate follow-up message for a client
export function generateFollowUpMessage(
  clientName: string,
  projectName: string,
  channel: MessageChannel = "whatsapp",
  tone: MessageTone = "professional"
): MessageDraft | null {
  return generateMessageDraft("proposal_followup", channel, tone, {
    clientName,
    projectName,
  })
}

// Mock: Generate payment reminder
export function generatePaymentReminder(
  clientName: string,
  projectName: string,
  amount: number,
  currency: string,
  daysOverdue: number,
  deadline: string,
  channel: MessageChannel = "whatsapp"
): MessageDraft | null {
  const scenario: MessageScenario = daysOverdue > 14 
    ? "payment_reminder_firm" 
    : "payment_reminder_friendly"
  
  const tone: MessageTone = daysOverdue > 14 ? "firm" : "friendly"

  return generateMessageDraft(scenario, channel, tone, {
    clientName,
    projectName,
    amount,
    currency,
    daysOverdue,
    deadline,
  })
}

// Mock: Generate delivery nudge
export function generateDeliveryNudge(
  clientName: string,
  projectName: string,
  deadline: string,
  channel: MessageChannel = "whatsapp",
  tone: MessageTone = "professional"
): MessageDraft | null {
  return generateMessageDraft("delivery_nudge", channel, tone, {
    clientName,
    projectName,
    deadline,
  })
}
