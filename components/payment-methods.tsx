"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Info, Check, X, CreditCard, ArrowRightLeft } from "lucide-react"
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
          <DollarSign className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Cómo cobrar del exterior</h2>
          <p className="text-sm text-gray-500">
            Compara plataformas de pago y aprende a convertir tus ingresos a moneda local
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-3 text-amber-800">
        <Info className="h-5 w-5 flex-shrink-0" />
        <p className="text-xs">
          Elige la mejor forma de recibir pagos internacionales y convertirlos a tu moneda local con las mejores tasas.
        </p>
      </div>

      <Tabs defaultValue="platforms" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl">
          <TabsTrigger value="platforms" className="rounded-l-xl">
            <CreditCard className="mr-2 h-4 w-4" />
            Plataformas de pago
          </TabsTrigger>
          <TabsTrigger value="saldoar" className="rounded-r-xl">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
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
                                  <Check className="h-4 w-4 text-green-500" />
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </TabsContent>
                          <TabsContent value="cons" className="mt-2">
                            <ul className="space-y-1 text-sm">
                              {platform.cons.map((con, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <X className="h-4 w-4 text-red-500" />
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

        {/* Contenido de la pestaña de Saldoar */}
        <TabsContent value="saldoar" className="mt-6 space-y-6">
          <div className="overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white shadow-md">
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-md">
                <ArrowRightLeft className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <h3 className="mb-2 text-2xl font-bold">Saldoar</h3>
                <p className="text-lg font-medium text-white/90">
                  Convierte tus pagos internacionales a moneda local con las mejores tasas
                </p>
                <p className="mt-2 text-white/80">
                  Saldoar es una plataforma que te permite convertir tus ingresos en USD de PayPal, Wise, Payoneer,
                  Skrill y otros servicios a moneda local en varios países de Latinoamérica.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-amber-100">
              <CardContent className="p-6">
                <h4 className="mb-4 text-lg font-semibold text-amber-800">¿Cómo funciona Saldoar?</h4>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
                      1
                    </div>
                    <span>
                      <span className="font-medium">Cotizas y haces tu pedido:</span> Indicas el monto y la plataforma
                      desde donde enviarás el dinero.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
                      2
                    </div>
                    <span>
                      <span className="font-medium">Recibes las instrucciones para hacer tu envío:</span> Te indicamos
                      los datos para realizar la transferencia.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
                      3
                    </div>
                    <span>
                      <span className="font-medium">Te enviamos el saldo cotizado:</span> Recibes el dinero en tu cuenta
                      bancaria local.
                    </span>
                  </li>
                </ol>
                <div className="mt-6 text-center">
                  <a
                    href="https://saldoar.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
                  >
                    Visitar Saldoar
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardContent className="p-6">
                <h4 className="mb-4 text-lg font-semibold text-amber-800">Países disponibles</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-amber-50 p-3">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">Argentina</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">Pesos argentinos (ARS)</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">México</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">Pesos mexicanos (MXN)</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">Colombia</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">Pesos colombianos (COP)</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">Bolivia</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">Bolivianos (BOB)</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">Venezuela</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">Bolívares (VES)</p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Ventaja competitiva</span>
                  </div>
                  <p className="mt-1">
                    Saldoar ofrece tasas de cambio hasta un 10-15% mejores que las oficiales, dependiendo del país y el
                    método de pago utilizado.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-amber-100">
              <CardContent className="p-6">
                <h4 className="mb-4 text-lg font-semibold text-amber-800">Ventajas de usar Saldoar</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-green-500" />
                    <span>
                      <span className="font-medium">Mejores tasas de cambio</span> que las oficiales y que las ofrecidas
                      por bancos tradicionales
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-green-500" />
                    <span>
                      <span className="font-medium">Transferencia directa</span> a tu cuenta bancaria local sin
                      intermediarios
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-green-500" />
                    <span>
                      <span className="font-medium">Proceso rápido y seguro</span> con confirmaciones en minutos y
                      transferencias en horas
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-green-500" />
                    <span>
                      <span className="font-medium">Evita comisiones bancarias</span> internacionales y tasas ocultas
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-green-500" />
                    <span>
                      <span className="font-medium">Soporte en español</span> con atención personalizada
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-green-500" />
                    <span>
                      <span className="font-medium">Sin montos mínimos</span> para realizar operaciones
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-100">
              <CardContent className="p-6">
                <h4 className="mb-4 text-lg font-semibold text-amber-800">Plataformas compatibles</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 rounded-lg border border-gray-100 p-3">
                    <div className="h-8 w-8 flex-shrink-0 rounded-md bg-gray-50 p-1">
                      <Image
                        src="/paypal-logo.png"
                        alt="PayPal"
                        width={30}
                        height={30}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="font-medium">PayPal</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-100 p-3">
                    <div className="h-8 w-8 flex-shrink-0 rounded-md bg-gray-50 p-1">
                      <Image
                        src="/wise-logo.png"
                        alt="Wise"
                        width={30}
                        height={30}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="font-medium">Wise</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-100 p-3">
                    <div className="h-8 w-8 flex-shrink-0 rounded-md bg-gray-50 p-1">
                      <Image
                        src="/payoneer-logo.png"
                        alt="Payoneer"
                        width={30}
                        height={30}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="font-medium">Payoneer</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-100 p-3">
                    <div className="h-8 w-8 flex-shrink-0 rounded-md bg-gray-50 p-1">
                      <Image
                        src="/skrill-logo.png"
                        alt="Skrill"
                        width={30}
                        height={30}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="font-medium">Skrill</span>
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm">
                  <p>
                    <span className="font-medium">Nota:</span> Saldoar también es compatible con otras plataformas y
                    métodos de pago. Consulta su sitio web para ver la lista completa de servicios disponibles.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preguntas frecuentes (visible desde ambas pestañas) */}
      <div className="mt-8 rounded-xl bg-amber-50 p-4 text-sm">
        <h4 className="mb-2 font-bold text-amber-800">Preguntas frecuentes sobre cobros internacionales</h4>
        <ul className="space-y-3 text-gray-700">
          <li className="rounded-lg bg-white/60 p-3 shadow-sm">
            <h5 className="font-medium text-amber-900">
              ¿Qué documentación necesito para recibir pagos internacionales?
            </h5>
            <p className="mt-1 text-sm text-gray-600">
              Generalmente necesitarás identificación oficial (pasaporte o DNI), comprobante de domicilio y, dependiendo
              del país, documentación fiscal como número de identificación tributaria. Algunas plataformas pueden
              solicitar información adicional para cumplir con regulaciones contra el lavado de dinero.
            </p>
          </li>
          <li className="rounded-lg bg-white/60 p-3 shadow-sm">
            <h5 className="font-medium text-amber-900">¿Cómo afectan los impuestos a mis cobros internacionales?</h5>
            <p className="mt-1 text-sm text-gray-600">
              Los pagos internacionales pueden estar sujetos a impuestos tanto en el país de origen como en tu país de
              residencia. Es importante consultar con un contador especializado en tu país para entender tus
              obligaciones fiscales y posibles tratados de doble imposición que puedan aplicar.
            </p>
          </li>
          <li className="rounded-lg bg-white/60 p-3 shadow-sm">
            <h5 className="font-medium text-amber-900">
              ¿Cuál es la forma más rápida de recibir pagos internacionales?
            </h5>
            <p className="mt-1 text-sm text-gray-600">
              PayPal suele ofrecer transferencias instantáneas, pero con comisiones más altas. Wise y Payoneer tienen
              tiempos de procesamiento de 1-3 días hábiles. Para necesidades urgentes, algunas plataformas ofrecen
              tarjetas de débito que te permiten acceder a tus fondos inmediatamente después de recibirlos.
            </p>
          </li>
          <li className="rounded-lg bg-white/60 p-3 shadow-sm">
            <h5 className="font-medium text-amber-900">
              ¿Cómo puedo reducir las comisiones por pagos internacionales?
            </h5>
            <p className="mt-1 text-sm text-gray-600">
              Para reducir comisiones: negocia con tus clientes para que cubran las tarifas de transacción, consolida
              pagos pequeños en transferencias más grandes, considera plataformas con menores comisiones como Wise para
              montos grandes, y mantén tus fondos en la divisa original si planeas usarlos para gastos en esa moneda.
            </p>
          </li>
          <li className="rounded-lg bg-white/60 p-3 shadow-sm">
            <h5 className="font-medium text-amber-900">
              ¿Es seguro usar servicios como Saldoar para convertir divisas?
            </h5>
            <p className="mt-1 text-sm text-gray-600">
              Sí, servicios como Saldoar son seguros cuando están debidamente registrados y cumplen con las regulaciones
              financieras locales. Verifica siempre las reseñas de otros usuarios, los años de operación de la
              plataforma y sus políticas de seguridad antes de realizar transacciones importantes.
            </p>
          </li>
        </ul>
      </div>
    </div>
  )
}
