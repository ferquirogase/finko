import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BottomNav from "@/components/bottom-nav"
import ParticlesBackground from "@/components/particles-background"
import Link from "next/link"
import { IconCalculator, IconFileText, IconCreditCard, IconCurrencyDollar } from "@tabler/icons-react"

export default function Home() {
  return (
    <>
      <ParticlesBackground />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Navbar />
        <main className="space-y-8 pb-20">
          <div className="rounded-3xl bg-gradient-to-br from-purple-500 to-purple-700 p-8 text-white">
            <h1 className="mb-4 text-3xl font-bold">Herramientas para freelancers</h1>
            <p className="mb-6 text-lg text-white/90">
              Calcula cuánto cobrar, genera presupuestos y crea facturas profesionales en minutos.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Calculadora de Tarifas",
                description:
                  "Determina cuánto cobrar por tus servicios basado en tu experiencia, ubicación y tipo de proyecto.",
                icon: IconCalculator,
                href: "/calculadora",
                color: "blue",
              },
              {
                title: "Generador de Presupuestos",
                description:
                  "Crea presupuestos profesionales con plantillas personalizables que impresionarán a tus clientes.",
                icon: IconFileText,
                href: "/presupuestos",
                color: "green",
              },
              {
                title: "Generador de Recibos",
                description: "Genera facturas legales y profesionales en segundos, listas para enviar a tus clientes.",
                icon: IconCreditCard,
                href: "/recibos",
                color: "purple",
              },
              {
                title: "Cobros del Exterior",
                description:
                  "Compara las mejores plataformas para recibir pagos internacionales y maximiza tus ingresos.",
                icon: IconCurrencyDollar,
                href: "/pagos-exterior",
                color: "amber",
              },
            ].map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className={`flex flex-col rounded-xl border p-5 transition-colors ${
                  tool.color === "blue"
                    ? "bg-blue-50 border-blue-100 hover:border-blue-200 hover:bg-blue-100/50"
                    : tool.color === "green"
                      ? "bg-green-50 border-green-100 hover:border-green-200 hover:bg-green-100/50"
                      : tool.color === "purple"
                        ? "bg-purple-50 border-purple-100 hover:border-purple-200 hover:bg-purple-100/50"
                        : "bg-amber-50 border-amber-100 hover:border-amber-200 hover:bg-amber-100/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      tool.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : tool.color === "green"
                          ? "bg-green-100 text-green-600"
                          : tool.color === "purple"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    <tool.icon className="h-5 w-5" stroke={1.5} />
                  </div>
                  <h3 className="font-semibold text-gray-800">{tool.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </Link>
            ))}
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
        </main>
        <Footer />
        <BottomNav />
      </div>
    </>
  )
}
