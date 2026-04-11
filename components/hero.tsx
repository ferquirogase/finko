import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

export default function Hero() {
  return (
    <div className="py-6 md:py-10">
      {/* Badge */}
      <div className="mb-6 flex justify-center md:justify-start">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-400">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
          100% gratis · Sin registro requerido
        </span>
      </div>

      {/* Headline */}
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl md:text-left text-center">
        Gestioná tu carrera{" "}
        <span className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
          freelance
        </span>
        <br />
        con confianza
      </h1>

      {/* Subtitle */}
      <p className="mb-8 max-w-xl text-base text-gray-500 md:text-left text-center md:text-lg">
        Calculá tarifas justas, generá presupuestos profesionales y administrá tus cobros del exterior. Todo en un solo lugar.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 md:justify-start justify-center">
        <Link
          href="/calculadora"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
        >
          Calcular mi tarifa
          <IconArrowRight className="h-4 w-4" stroke={2} />
        </Link>
        <Link
          href="/presupuestos"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-5 py-2.5 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-700 hover:text-gray-100"
        >
          Generar presupuesto
        </Link>
      </div>
    </div>
  )
}
