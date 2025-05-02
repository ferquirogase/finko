"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PaymentFAQ() {
  const faqItems = [
    {
      id: "faq-1",
      question: "¿Qué documentación necesito para recibir pagos internacionales?",
      answer:
        "Generalmente necesitarás identificación oficial (pasaporte o DNI), comprobante de domicilio y, dependiendo del país, documentación fiscal como número de identificación tributaria. Algunas plataformas pueden solicitar información adicional para cumplir con regulaciones contra el lavado de dinero.",
    },
    {
      id: "faq-2",
      question: "¿Cómo afectan los impuestos a mis cobros internacionales?",
      answer:
        "Los pagos internacionales pueden estar sujetos a impuestos tanto en el país de origen como en tu país de residencia. Es importante consultar con un contador especializado en tu país para entender tus obligaciones fiscales y posibles tratados de doble imposición que puedan aplicar.",
    },
    {
      id: "faq-3",
      question: "¿Cuál es la forma más rápida de recibir pagos internacionales?",
      answer:
        "PayPal suele ofrecer transferencias instantáneas, pero con comisiones más altas. Wise y Payoneer tienen tiempos de procesamiento de 1-3 días hábiles. Para necesidades urgentes, algunas plataformas ofrecen tarjetas de débito que te permiten acceder a tus fondos inmediatamente después de recibirlos.",
    },
    {
      id: "faq-4",
      question: "¿Cómo puedo reducir las comisiones por pagos internacionales?",
      answer:
        "Para reducir comisiones: negocia con tus clientes para que cubran las tarifas de transacción, consolida pagos pequeños en transferencias más grandes, considera plataformas con menores comisiones como Wise para montos grandes, y mantén tus fondos en la divisa original si planeas usarlos para gastos en esa moneda.",
    },
  ]

  return (
    <div className="mt-8 mb-16">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Preguntas frecuentes sobre cobros internacionales</h2>

      <Accordion type="single" collapsible className="space-y-2">
        {faqItems.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="rounded-lg border border-gray-100 bg-white px-4 shadow-sm"
          >
            <AccordionTrigger className="font-medium text-purple-900 py-3 hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-gray-600 pb-3">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
