"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  IconCurrencyDollar,
  IconInfoCircle,
  IconCheck,
  IconX,
  IconCreditCard,
  IconArrowsExchange,
} from "@tabler/icons-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"

export default function PaymentMethods() {
  const [selectedAmount, setSelectedAmount] = useState(1000)

  // Datos de comisiones y tasas de cambio (simulados)
  const paymentPlatforms = [
    {
      id: "paypal",
      name: "PayPal",
      logo: "/paypal-logo.png",
      fee: 0.055, // 5.5%
      fixedFee: 0.3, // $0.30 USD
      exchangeRate: 0.98, // 2% menos que el oficial
      withdrawalFee: 5, // $5 USD
      minWithdrawal: 50, // $50 USD
      processingTime: "2-3 días hábiles",
      countries: "Casi todos los países",
      pros: ["Ampliamente aceptado", "Fácil de usar", "Protección al comprador"],
      cons: ["Comisiones altas", "Retención de fondos ocasional", "Tipo de cambio desfavorable"],
    },
    {
      id: "wise",
      name: "Wise (Transferwise)",
      logo: "/wise-logo.png",
      fee: 0.01, // 1%
      fixedFee: 0,
      exchangeRate: 0.995, // 0.5% menos que el oficial
      withdrawalFee: 1.5, // $1.50 USD
      minWithdrawal: 20, // $20 USD
      processingTime: "1-2 días hábiles",
      countries: "Más de 80 países",
      pros: ["Bajas comisiones", "Tipo de cambio favorable", "Transparencia en costos"],
      cons: ["Menos conocido que PayPal", "Sin protección al comprador", "Verificación más estricta"],
    },
    {
      id: "payoneer",
      name: "Payoneer",
      logo: "/payoneer-logo.png",
      fee: 0.03, // 3%
      fixedFee: 0,
      exchangeRate: 0.985, // 1.5% menos que el oficial
      withdrawalFee: 3, // $3 USD
      minWithdrawal: 30, // $30 USD
      processingTime: "2-5 días hábiles",
      countries: "Más de 200 países",
      pros: ["Tarjeta de débito disponible", "Buena para marketplaces", "Pagos masivos"],
      cons: ["Comisiones moderadas", "Atención al cliente variable", "Cargos por inactividad"],
    },
    {
      id: "skrill",
      name: "Skrill",
      logo: "/skrill-logo.png",
      fee: 0.025, // 2.5%
      fixedFee: 0.25, // $0.25 USD
      exchangeRate: 0.982, // 1.8% menos que el oficial
      withdrawalFee: 4, // $4 USD
      minWithdrawal: 10, // $10 USD
      processingTime: "1-3 días hábiles",
      countries: "Más de 120 países",
      pros: ["Transferencias rápidas", "Tarjeta prepagada disponible", "Amplia aceptación global"],
      cons: ["Comisiones por inactividad", "Verificación de identidad estricta", "Soporte al cliente limitado"],
    },
  ]

  // Calcular el monto final después de comisiones
  const calculateFinalAmount = (platform: any, amount: number) => {
    const feeAmount = amount * platform.fee
    const totalFee = feeAmount + platform.fixedFee
    const amountAfterFee = amount - totalFee
    const amountAfterExchange = amountAfterFee * platform.exchangeRate
    const finalAmount = amountAfterExchange - platform.withdrawalFee
    return finalAmount > 0 ? finalAmount : 0
  }

  return (
    <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-amber-100 p-2 text-amber-600">
          <IconCurrencyDollar className="h-5 w-5" stroke={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Cómo cobrar del exterior</h2>
          <p className="text-sm text-gray-500">
            Compara plataformas de pago y aprende a convertir tus ingresos a moneda local
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-3 text-amber-800">
        <IconInfoCircle className="h-5 w-5 flex-shrink-0" stroke={1.5} />
        <p className="text-xs">
          Elige la mejor forma de recibir pagos internacionales y convertirlos a tu moneda local con las mejores tasas.
        </p>
      </div>

      <Tabs defaultValue="platforms" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl">
          <TabsTrigger value="platforms" className="rounded-l-xl">
            <IconCreditCard className="mr-2 h-4 w-4" stroke={1.5} />
            Plataformas de pago
          </TabsTrigger>
          <TabsTrigger value="saldoar" className="rounded-r-xl">
            <IconArrowsExchange className="mr-2 h-4 w-4" stroke={1.5} />
            Moneda local
          </TabsTrigger>
        </TabsList>

        {/* Contenido de la pestaña de plataformas de pago */}
        <TabsContent value="platforms" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Monto a recibir (USD)</label>
              <Input
                className="mt-1 w-full rounded-xl border border-gray-300 p-2"
                type="number"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(Number(e.target.value))}
                min={1}
                placeholder="Ingresa el monto"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Moneda de destino</label>
              <div className="mt-1 flex h-10 w-full items-center rounded-xl border border-gray-300 bg-gray-50 px-3 text-gray-500">
                Dólar Estadounidense (USD)
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Comparativa de plataformas</h3>

            <div className="grid gap-4">
              {paymentPlatforms.map((platform) => (
                <Card key={platform.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex items-center justify-center border-b border-gray-100 bg-gray-50 p-4 md:w-1/4 md:border-b-0 md:border-r">
                        <div className="text-center">
                          <div className="mb-2 flex justify-center">
                            <Image
                              src={platform.logo || "/placeholder.svg"}
                              alt={`${platform.name} logo`}
                              width={120}
                              height={40}
                              className="h-10 w-auto object-contain"
                            />
                          </div>
                          <div className="rounded-full bg-amber-100 px-3 py-1 text-center text-xs font-medium text-amber-800">
                            Comisión: {platform.fee * 100}%
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 p-4">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-lg font-bold">{platform.name}</h4>
                          <div className="rounded-xl bg-amber-500 px-4 py-1 text-lg font-bold text-white">
                            ${calculateFinalAmount(platform, selectedAmount).toFixed(2)}
                          </div>
                        </div>

                        <div className="mb-4 grid gap-2 text-sm md:grid-cols-2">
                          <div>
                            <span className="font-medium">Comisión:</span> {platform.fee * 100}% + $
                            {platform.fixedFee.toFixed(2)}
                          </div>
                          <div>
                            <span className="font-medium">Tipo de cambio:</span>{" "}
                            {((1 - platform.exchangeRate) * 100).toFixed(1)}% debajo del oficial
                          </div>
                          <div>
                            <span className="font-medium">Comisión de retiro:</span> ${platform.withdrawalFee}
                          </div>
                          <div>
                            <span className="font-medium">Tiempo de procesamiento:</span> {platform.processingTime}
                          </div>
                        </div>

                        <Tabs defaultValue="pros" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 rounded-xl">
                            <TabsTrigger value="pros" className="rounded-l-xl">
                              Ventajas
                            </TabsTrigger>
                            <TabsTrigger value="cons" className="rounded-r-xl">
                              Desventajas
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="pros" className="mt-2">
                            <ul className="space-y-1 text-sm">
                              {platform.pros.map((pro, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <IconCheck className="h-4 w-4 text-green-500" stroke={1.5} />
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </TabsContent>
                          <TabsContent value="cons" className="mt-2">
                            <ul className="space-y-1 text-sm">
                              {platform.cons.map((con, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <IconX className="h-4 w-4 text-red-500" stroke={1.5} />
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
