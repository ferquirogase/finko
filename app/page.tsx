"use client"

import { useState } from "react"
import ToolSelector from "@/components/tool-selector"
import PricingCalculator from "@/components/pricing-calculator"
import ProposalGenerator from "@/components/proposal-generator"
import InvoiceTemplates from "@/components/invoice-templates"

export default function Home() {
  const [activeTab, setActiveTab] = useState("pricing")

  const renderActiveTool = () => {
    switch (activeTab) {
      case "pricing":
        return <PricingCalculator />
      case "proposals":
        return <ProposalGenerator />
      case "invoices":
        return <InvoiceTemplates /> // Mantenemos el mismo componente, solo cambiamos el nombre mostrado
      default:
        return <PricingCalculator />
    }
  }

  return (
    <main className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-br from-purple-500 to-purple-700 p-8 text-white">
        <h1 className="mb-4 text-3xl font-bold">Herramientas para freelancers</h1>
        <p className="mb-6 text-lg text-white/90">
          Calcula cuánto cobrar, genera presupuestos y crea facturas profesionales en minutos.
        </p>
      </div>

      <ToolSelector activeTab={activeTab} setActiveTab={setActiveTab} />

      {renderActiveTool()}
    </main>
  )
}
