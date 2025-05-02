"use client"

import { FileText, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calculator } from "lucide-react"

interface ToolSelectorProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function ToolSelector({ activeTab, setActiveTab }: ToolSelectorProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Selecciona una herramienta</h2>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setActiveTab("pricing")}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl p-4 transition-all",
            activeTab === "pricing" ? "bg-brand-100 text-brand-600" : "bg-gray-50 text-gray-600 hover:bg-gray-100",
          )}
        >
          <Calculator className="mb-2 h-8 w-8" />
          <span className="text-sm font-medium">Calculadora</span>
        </button>
        <button
          onClick={() => setActiveTab("proposals")}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl p-4 transition-all",
            activeTab === "proposals" ? "bg-brand-100 text-brand-600" : "bg-gray-50 text-gray-600 hover:bg-gray-100",
          )}
        >
          <FileText className="mb-2 h-8 w-8" />
          <span className="text-sm font-medium">Presupuestos</span>
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl p-4 transition-all",
            activeTab === "invoices" ? "bg-brand-100 text-brand-600" : "bg-gray-50 text-gray-600 hover:bg-gray-100",
          )}
        >
          <CreditCard className="mb-2 h-8 w-8" />
          <span className="text-sm font-medium">Recibos</span>
        </button>
      </div>
    </div>
  )
}
