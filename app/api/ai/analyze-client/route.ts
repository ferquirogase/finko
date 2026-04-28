import { generateText, Output } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { clientAnalysisSchema } from "@/lib/ai/schemas"

// Use OpenAI directly instead of Vercel AI Gateway
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `Eres Finko, un asistente inteligente para freelancers en Latinoamérica. Tu trabajo es analizar mensajes de potenciales clientes y extraer información estructurada para ayudar al freelancer a tomar decisiones.

Analiza el mensaje del cliente y extrae:

1. **Información del cliente**: Nombre, empresa, email si están mencionados
2. **Alcance del proyecto**: Qué necesita, tipo de proyecto, complejidad, entregables sugeridos, y áreas que necesitan clarificación
3. **Urgencia**: Nivel de urgencia, deadlines mencionados, y razonamiento
4. **Presupuesto**: Si se menciona budget, expectativas de precio del cliente, y guía de pricing sugerida basada en el mercado latinoamericano
5. **Método de pago**: Recomendar el mejor método de pago según el contexto (local vs internacional, monto)
6. **Red flags**: Alertas potenciales como scope creep, cliente difícil, expectativas irreales, etc.
7. **Respuesta sugerida**: Un mensaje profesional para responder al cliente
8. **Próximos pasos**: Acciones recomendadas para el freelancer

Contexto de precios para freelancers en LATAM:
- Diseño web básico: $500-2000 USD
- Desarrollo web: $1500-8000 USD
- Apps móviles: $3000-15000+ USD
- Diseño gráfico: $200-1500 USD
- Tarifas por hora típicas: $25-75 USD/hora dependiendo de experiencia

Sé específico y actionable. Piensa como un mentor de negocios para freelancers.`

export async function POST(req: Request) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { success: false, error: "OpenAI API key not configured. Add OPENAI_API_KEY in Settings > Vars." },
        { status: 500 }
      )
    }

    const { message, source } = await req.json()

    if (!message || typeof message !== "string") {
      return Response.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      )
    }

    const { output } = await generateText({
      model: openai("gpt-4o-mini"),
      output: Output.object({
        schema: clientAnalysisSchema,
      }),
      system: SYSTEM_PROMPT,
      prompt: `Mensaje del cliente (recibido por ${source || "email"}):\n\n${message}`,
    })

    return Response.json({
      success: true,
      analysis: output,
    })
  } catch (error) {
    console.error("[Finko AI] Error analyzing client:", error)
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Error analyzing message" 
      },
      { status: 500 }
    )
  }
}
