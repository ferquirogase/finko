"use client"

import { useState, useMemo } from "react"
import { IconCurrencyDollar, IconCheck, IconX, IconTrophy, IconClock, IconArrowUpRight } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"

// ── Datos de plataformas ───────────────────────────────────────────────────
const platforms = [
  {
    id: "wise",
    name: "Wise",
    tagline: "La más barata para transferencias",
    color: "#10b981",
    fee: 0.01,
    fixedFee: 0,
    exchangeRate: 0.995,
    withdrawalFee: 1.5,
    minWithdrawal: 20,
    processingTime: "1-2 días hábiles",
    pros: [
      "Comisiones más bajas del mercado",
      "Tipo de cambio muy cercano al oficial",
      "Transparencia total en costos",
    ],
    cons: [
      "Menos conocida que PayPal",
      "Sin protección al comprador",
      "Verificación más estricta",
    ],
    url: "https://wise.com",
  },
  {
    id: "payoneer",
    name: "Payoneer",
    tagline: "Ideal para marketplaces y freelancers",
    color: "#f97316",
    fee: 0.03,
    fixedFee: 0,
    exchangeRate: 0.985,
    withdrawalFee: 3,
    minWithdrawal: 30,
    processingTime: "2-5 días hábiles",
    pros: [
      "Tarjeta de débito disponible",
      "Muy usada en marketplaces globales",
      "Cubre más de 200 países",
    ],
    cons: [
      "Comisiones moderadas",
      "Atención al cliente variable",
      "Cargos por inactividad",
    ],
    url: "https://payoneer.com",
  },
  {
    id: "skrill",
    name: "Skrill",
    tagline: "Buena relación comisión / velocidad",
    color: "#8b5cf6",
    fee: 0.025,
    fixedFee: 0.25,
    exchangeRate: 0.982,
    withdrawalFee: 4,
    minWithdrawal: 10,
    processingTime: "1-3 días hábiles",
    pros: [
      "Transferencias rápidas",
      "Tarjeta prepagada disponible",
      "Amplia aceptación global",
    ],
    cons: [
      "Comisiones por inactividad",
      "Verificación de identidad estricta",
      "Soporte al cliente limitado",
    ],
    url: "https://skrill.com",
  },
  {
    id: "paypal",
    name: "PayPal",
    tagline: "El más conocido, pero el más caro",
    color: "#0070ba",
    fee: 0.055,
    fixedFee: 0.3,
    exchangeRate: 0.98,
    withdrawalFee: 5,
    minWithdrawal: 50,
    processingTime: "2-3 días hábiles",
    pros: [
      "Ampliamente aceptado globalmente",
      "Fácil de usar",
      "Reconocimiento de marca",
    ],
    cons: [
      "Las comisiones más altas",
      "Retención de fondos ocasional",
      "Tipo de cambio desfavorable",
    ],
    url: "https://paypal.com",
  },
]

type Platform = typeof platforms[number] & { final: number; pctLost: number }

function calcFinal(p: typeof platforms[number], amount: number) {
  const fee    = amount * p.fee + p.fixedFee
  const after  = (amount - fee) * p.exchangeRate - p.withdrawalFee
  return Math.max(after, 0)
}

// ── Componente principal ───────────────────────────────────────────────────
export default function PaymentMethods() {
  const [amount, setAmount] = useState(1000)

  const ranked = useMemo<Platform[]>(() => {
    return platforms
      .map((p) => {
        const final   = calcFinal(p, amount)
        const pctLost = amount > 0 ? ((amount - final) / amount) * 100 : 0
        return { ...p, final, pctLost }
      })
      .sort((a, b) => b.final - a.final)
  }, [amount])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gray-900 p-6">

        {/* Header */}
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-full bg-amber-500/15 p-2 text-amber-400">
            <IconCurrencyDollar className="h-5 w-5" stroke={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-100">Cómo cobrar del exterior</h2>
            <p className="text-sm text-gray-500">
              Ingresá el monto a cobrar y te mostramos cuánto te llega con cada plataforma, ordenado de mejor a peor
            </p>
          </div>
        </div>

        {/* Calculadora */}
        <div className="mb-8 rounded-2xl bg-amber-500/10 p-5">
          <label className="mb-3 block text-sm font-semibold text-amber-300">
            ¿Cuánto vas a cobrar?
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-medium text-gray-500">$</span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              min={1}
              className="rounded-xl pl-8 pr-14 text-lg font-semibold"
              placeholder="1000"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
              USD
            </span>
          </div>
          <p className="mt-2 text-xs text-amber-500/80">
            El resultado incluye comisión de transacción, tipo de cambio y costo de retiro
          </p>
        </div>

        {/* Tarjetas de plataformas ordenadas */}
        <div className="space-y-4">
          {ranked.map((platform, i) => {
            const isBest = i === 0

            return (
              <div
                key={platform.id}
                className={`relative rounded-2xl border-2 p-5 transition-all ${
                  isBest ? "shadow-md shadow-black/20" : "border-gray-800"
                }`}
                style={isBest ? { borderColor: platform.color } : {}}
              >
                {/* Badge "mejor opción" */}
                {isBest && (
                  <div
                    className="absolute -top-3 left-5 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: platform.color }}
                  >
                    <IconTrophy className="h-3.5 w-3.5" stroke={1.5} />
                    Mejor opción para este monto
                  </div>
                )}

                {/* Fila superior: nombre + monto */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    {/* Nombre y tagline */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-lg px-3 py-1 text-sm font-bold text-white"
                        style={{ backgroundColor: platform.color }}
                      >
                        {platform.name}
                      </span>
                      <span className="text-xs text-gray-500">{platform.tagline}</span>
                    </div>

                    {/* Fees y detalles */}
                    <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>
                        Comisión:{" "}
                        <span className="font-medium text-gray-300">
                          {platform.fee * 100}%
                          {platform.fixedFee > 0 && ` + $${platform.fixedFee}`}
                        </span>
                      </span>
                      <span>
                        Retiro:{" "}
                        <span className="font-medium text-gray-300">${platform.withdrawalFee} USD</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <IconClock className="h-3.5 w-3.5" stroke={1.5} />
                        <span className="font-medium text-gray-300">{platform.processingTime}</span>
                      </span>
                    </div>
                  </div>

                  {/* Monto que recibís */}
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Recibís</p>
                    <p className="text-3xl font-bold tabular-nums" style={{ color: platform.color }}>
                      ${platform.final.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600">
                      perdés {platform.pctLost.toFixed(1)}% ({((amount - platform.final)).toFixed(2)} USD)
                    </p>
                  </div>
                </div>

                {/* Pros / Cons */}
                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-800 pt-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    {platform.pros.map((pro, j) => (
                      <div key={j} className="flex items-start gap-2 text-xs text-gray-400">
                        <IconCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-500" stroke={2.5} />
                        {pro}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    {platform.cons.map((con, j) => (
                      <div key={j} className="flex items-start gap-2 text-xs text-gray-400">
                        <IconX className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-red-400" stroke={2.5} />
                        {con}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Link a la plataforma */}
                <div className="mt-3 flex justify-end">
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium transition-colors hover:underline"
                    style={{ color: platform.color }}
                  >
                    Ir a {platform.name}
                    <IconArrowUpRight className="h-3.5 w-3.5" stroke={2} />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          Las comisiones son aproximadas y pueden variar según el país, el método de retiro y el volumen de transacciones.
        </p>
      </div>
    </div>
  )
}
