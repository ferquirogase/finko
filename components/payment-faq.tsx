"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { IconHelpCircle } from "@tabler/icons-react"

const faqItems = [
  {
    id: "faq-1",
    question: "¿Qué documentación necesito para recibir pagos del exterior?",
    answer:
      "Generalmente necesitás identificación oficial (DNI o pasaporte), comprobante de domicilio y, según la plataforma, tu número de CUIT/CUIL. Algunas plataformas pueden pedir documentación adicional para cumplir con regulaciones contra el lavado de dinero (KYC).",
  },
  {
    id: "faq-2",
    question: "¿Cómo afectan los impuestos a mis cobros internacionales?",
    answer:
      "Los pagos del exterior pueden estar sujetos a impuestos en Argentina. Si sos monotributista o responsable inscripto, debés declarar estos ingresos. Te recomendamos consultar con un contador para entender tus obligaciones según tu situación fiscal.",
  },
  {
    id: "faq-3",
    question: "¿Cuál es la forma más rápida de recibir pagos?",
    answer:
      "Wise y Skrill suelen procesar en 1-2 días hábiles. PayPal puede ser más rápido para la acreditación inicial, pero los retiros a cuenta bancaria demoran más. Si necesitás el dinero rápido, Payoneer y Skrill ofrecen tarjetas de débito para usar los fondos de inmediato.",
  },
  {
    id: "faq-4",
    question: "¿Cómo puedo reducir las comisiones?",
    answer:
      "Algunas estrategias: usá Wise para transferencias grandes (la comisión porcentual es la más baja), consolidá pagos chicos en transferencias más grandes para que el costo fijo de retiro impacte menos, y hablá con tus clientes para que usen plataformas con menores costos de envío.",
  },
  {
    id: "faq-5",
    question: "¿Puedo tener cuentas en varias plataformas a la vez?",
    answer:
      "Sí, y es lo recomendable. Muchos freelancers usan Wise para clientes europeos (por el tipo de cambio), Payoneer para marketplaces como Upwork o Fiverr, y PayPal como opción de respaldo para clientes que no usan otras plataformas.",
  },
]

export default function PaymentFAQ() {
  return (
    <div className="rounded-3xl bg-gray-900 p-6">
      <div className="mb-5 flex items-start gap-4">
        <div className="rounded-full bg-gray-800 p-2 text-gray-400">
          <IconHelpCircle className="h-5 w-5" stroke={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-100">Preguntas frecuentes</h2>
          <p className="text-sm text-gray-500">Todo lo que necesitás saber sobre cobros del exterior</p>
        </div>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {faqItems.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="rounded-2xl border border-gray-800 px-4 hover:border-gray-700 transition-colors"
          >
            <AccordionTrigger className="py-4 text-left text-sm font-medium text-gray-200 hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm leading-relaxed text-gray-500">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
