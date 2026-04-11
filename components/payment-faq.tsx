"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { IconHelpCircle } from "@tabler/icons-react"
import { useTranslations } from "next-intl"

export default function PaymentFAQ() {
  const t = useTranslations("payments")

  const faqItems = [
    { id: "faq-1", question: t("faq.q1"), answer: t("faq.a1") },
    { id: "faq-2", question: t("faq.q2"), answer: t("faq.a2") },
    { id: "faq-3", question: t("faq.q3"), answer: t("faq.a3") },
    { id: "faq-4", question: t("faq.q4"), answer: t("faq.a4") },
    { id: "faq-5", question: t("faq.q5"), answer: t("faq.a5") },
  ]

  return (
    <div className="rounded-3xl bg-gray-900 p-6">
      <div className="mb-5 flex items-start gap-4">
        <div className="rounded-full bg-gray-800 p-2 text-gray-400">
          <IconHelpCircle className="h-5 w-5" stroke={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-100">{t("faqTitle")}</h2>
          <p className="text-sm text-gray-500">{t("faqSubtitle")}</p>
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
