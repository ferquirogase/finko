import { generateText, Output } from "ai"
import { messageGenerationSchema } from "@/lib/ai/schemas"

type MessageScenario = 
  | "first_reply"
  | "scope_clarification"
  | "price_defense"
  | "proposal_followup"
  | "payment_reminder_friendly"
  | "payment_reminder_firm"
  | "delivery_nudge"
  | "meeting_confirmation"
  | "project_update"

const SYSTEM_PROMPT = `Eres Finko, asistente de comunicación para freelancers en Latinoamérica. 
Genera mensajes profesionales, concisos y culturalmente apropiados para el contexto latino.

Reglas:
- Usa español neutro (evita regionalismos muy específicos)
- Sé profesional pero no frío
- Los mensajes deben ser directos y actionables
- Incluye siempre un call-to-action claro
- Para WhatsApp: mensajes más cortos y directos
- Para Email: puede ser más formal con subject line`

const SCENARIO_PROMPTS: Record<MessageScenario, string> = {
  first_reply: "Genera una primera respuesta a un potencial cliente que acaba de contactarte. Muestra interés, haz preguntas de clarificación si es necesario, y sugiere próximos pasos.",
  scope_clarification: "Genera un mensaje para clarificar el alcance del proyecto. Haz preguntas específicas sobre lo que no está claro.",
  price_defense: "El cliente cuestiona tu precio. Genera una respuesta profesional que defienda tu valor sin ser defensivo. Explica qué incluye y por qué vale la pena.",
  proposal_followup: "Enviaste una propuesta hace unos días. Genera un follow-up amable preguntando si tienen dudas o necesitan ajustes.",
  payment_reminder_friendly: "Genera un recordatorio de pago amable. El cliente no ha pagado pero no hay problemas previos.",
  payment_reminder_firm: "Genera un recordatorio de pago más firme. Ya enviaste recordatorios anteriores.",
  delivery_nudge: "Tienes una entrega próxima. Genera un mensaje actualizando al cliente sobre el progreso y confirmando fecha.",
  meeting_confirmation: "Genera un mensaje para confirmar una reunión, incluyendo fecha, hora y agenda.",
  project_update: "Genera un update de progreso del proyecto para mantener al cliente informado.",
}

export async function POST(req: Request) {
  try {
    const { scenario, context, channel, tone } = await req.json()

    if (!scenario || !context) {
      return Response.json(
        { success: false, error: "Scenario and context are required" },
        { status: 400 }
      )
    }

    const scenarioPrompt = SCENARIO_PROMPTS[scenario as MessageScenario]
    if (!scenarioPrompt) {
      return Response.json(
        { success: false, error: "Invalid scenario" },
        { status: 400 }
      )
    }

    const { output } = await generateText({
      model: "openai/gpt-4o-mini",
      output: Output.object({
        schema: messageGenerationSchema,
      }),
      system: SYSTEM_PROMPT,
      prompt: `Escenario: ${scenarioPrompt}

Canal: ${channel || "email"}
Tono deseado: ${tone || "professional"}

Contexto del proyecto/cliente:
${JSON.stringify(context, null, 2)}

Genera el mensaje apropiado.`,
    })

    return Response.json({
      success: true,
      message: output,
    })
  } catch (error) {
    console.error("[Finko AI] Error generating message:", error)
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Error generating message" 
      },
      { status: 500 }
    )
  }
}
