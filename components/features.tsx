import { IconCalculator, IconFileText, IconCreditCard, IconClock, IconChartPie, IconUsers } from "@tabler/icons-react"

export default function Features() {
  return (
    <section className="bg-white py-20" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-800">
              Características
            </div>
            <h2 className="text-3xl font-bold tracking-tighter text-purple-900 sm:text-4xl md:text-5xl">
              Todo lo que necesitas para gestionar tu negocio freelance
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Herramientas diseñadas específicamente para resolver los problemas más comunes de los freelancers.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-purple-100 p-4 text-center">
            <div className="rounded-full bg-purple-100 p-2 text-purple-600">
              <IconCalculator className="h-6 w-6" stroke={1.5} />
            </div>
            <h3 className="text-xl font-bold text-purple-900">Calculadora de Tarifas</h3>
            <p className="text-sm text-gray-600">
              Determina cuánto cobrar por tus servicios basado en tu experiencia, ubicación y tipo de proyecto.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-purple-100 p-4 text-center">
            <div className="rounded-full bg-purple-100 p-2 text-purple-600">
              <IconFileText className="h-6 w-6" stroke={1.5} />
            </div>
            <h3 className="text-xl font-bold text-purple-900">Generador de Presupuestos</h3>
            <p className="text-sm text-gray-600">
              Crea presupuestos profesionales con plantillas personalizables que impresionarán a tus clientes.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-purple-100 p-4 text-center">
            <div className="rounded-full bg-purple-100 p-2 text-purple-600">
              <IconCreditCard className="h-6 w-6" stroke={1.5} />
            </div>
            <h3 className="text-xl font-bold text-purple-900">Plantillas de Facturas</h3>
            <p className="text-sm text-gray-600">
              Genera facturas legales y profesionales en segundos, listas para enviar a tus clientes.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-purple-100 p-4 text-center">
            <div className="rounded-full bg-purple-100 p-2 text-purple-600">
              <IconClock className="h-6 w-6" stroke={1.5} />
            </div>
            <h3 className="text-xl font-bold text-purple-900">Seguimiento de Tiempo</h3>
            <p className="text-sm text-gray-600">
              Registra el tiempo dedicado a cada proyecto para facturar con precisión y mejorar tu productividad.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-purple-100 p-4 text-center">
            <div className="rounded-full bg-purple-100 p-2 text-purple-600">
              <IconChartPie className="h-6 w-6" stroke={1.5} />
            </div>
            <h3 className="text-xl font-bold text-purple-900">Análisis de Ingresos</h3>
            <p className="text-sm text-gray-600">
              Visualiza tus ingresos y gastos para tomar mejores decisiones financieras para tu negocio.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-purple-100 p-4 text-center">
            <div className="rounded-full bg-purple-100 p-2 text-purple-600">
              <IconUsers className="h-6 w-6" stroke={1.5} />
            </div>
            <h3 className="text-xl font-bold text-purple-900">Gestión de Clientes</h3>
            <p className="text-sm text-gray-600">
              Mantén organizada la información de tus clientes y su historial de proyectos en un solo lugar.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
