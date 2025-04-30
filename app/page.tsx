import ToolCard from "@/components/tool-card"
import { Calculator, FileText, CreditCard, DollarSign } from "lucide-react"
import InstallPWA from "@/components/install-pwa"

export default function Home() {
  return (
    <main className="space-y-8 pb-20">
      <div className="rounded-3xl bg-gradient-to-br from-purple-500 to-purple-700 p-8 text-white">
        <h1 className="mb-4 text-3xl font-bold">Herramientas para freelancers</h1>
        <p className="mb-6 text-lg text-white/90">
          Calcula cuánto cobrar, genera presupuestos y crea facturas profesionales en minutos.
        </p>
        <div className="flex justify-start">
          <InstallPWA />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ToolCard
          title="Calculadora de Tarifas"
          description="Determina cuánto cobrar por tus servicios basado en tu experiencia, ubicación y tipo de proyecto."
          icon={Calculator}
          href="/calculadora"
          color="blue"
        />
        <ToolCard
          title="Generador de Presupuestos"
          description="Crea presupuestos profesionales con plantillas personalizables que impresionarán a tus clientes."
          icon={FileText}
          href="/presupuestos"
          color="green"
        />
        <ToolCard
          title="Generador de Recibos"
          description="Genera facturas legales y profesionales en segundos, listas para enviar a tus clientes."
          icon={CreditCard}
          href="/recibos"
          color="purple"
        />
        <ToolCard
          title="Cobros del Exterior"
          description="Compara las mejores plataformas para recibir pagos internacionales y maximiza tus ingresos."
          icon={DollarSign}
          href="/pagos-exterior"
          color="amber"
        />
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">¿Por qué usar nuestras herramientas?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-purple-100 p-4">
            <h3 className="mb-2 font-medium text-purple-900">Ahorra tiempo</h3>
            <p className="text-sm text-gray-600">
              Automatiza tareas administrativas para enfocarte en lo que realmente importa: tu trabajo.
            </p>
          </div>
          <div className="rounded-lg border border-purple-100 p-4">
            <h3 className="mb-2 font-medium text-purple-900">Aumenta tus ingresos</h3>
            <p className="text-sm text-gray-600">
              Establece tarifas justas y crea documentos profesionales que justifiquen tu valor.
            </p>
          </div>
          <div className="rounded-lg border border-purple-100 p-4">
            <h3 className="mb-2 font-medium text-purple-900">Profesionaliza tu negocio</h3>
            <p className="text-sm text-gray-600">
              Impresiona a tus clientes con documentos bien diseñados y procesos eficientes.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white shadow-md">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-md">
            <DollarSign className="h-8 w-8 text-amber-500" />
          </div>
          <div>
            <h3 className="mb-2 text-2xl font-bold">¿Cobras del exterior?</h3>
            <p className="text-lg font-medium text-white/90">
              Compara las mejores plataformas para recibir pagos internacionales
            </p>
            <p className="mt-2 text-white/80">
              Descubre cómo maximizar tus ingresos al recibir pagos de clientes internacionales con las menores
              comisiones.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
