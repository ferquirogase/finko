import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import PricingCalculator from "@/components/pricing-calculator"

export default function CalculadoraPage() {
  return (
    <div className="space-y-6 pb-20">
      <div className="mb-6 flex items-center">
        <Link href="/">
          <Button variant="ghost" className="gap-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />
            Volver a herramientas
          </Button>
        </Link>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white">
        <h1 className="mb-4 text-3xl font-bold">Calculadora de Tarifas</h1>
        <p className="mb-6 text-lg text-white/90">Calcula cuánto deberías cobrar por tus servicios como freelancer</p>
      </div>

      <PricingCalculator />
    </div>
  )
}
