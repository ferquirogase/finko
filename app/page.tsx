import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BottomNav from "@/components/bottom-nav"
import SubtleBackground from "@/components/subtle-background"
import Link from "next/link"
import { IconCalculator, IconFileText, IconCreditCard, IconCurrencyDollar } from "@tabler/icons-react"
import Hero from "@/components/hero"

export default function Home() {
  return (
    <>
      <SubtleBackground />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Navbar />
        <main className="space-y-8 pb-20">
          <Hero />

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Calculadora de Tarifas",
                description:
                  "Determina cuánto cobrar por tus servicios basado en tu experiencia, ubicación y tipo de proyecto.",
                icon: IconCalculator,
                href: "/calculadora",
              },
              {
                title: "Generador de Presupuestos",
                description:
                  "Crea presupuestos profesionales con plantillas personalizables que impresionarán a tus clientes.",
                icon: IconFileText,
                href: "/presupuestos",
              },
              {
                title: "Generador de Recibos",
                description: "Genera facturas legales y profesionales en segundos, listas para enviar a tus clientes.",
                icon: IconCreditCard,
                href: "/recibos",
              },
              {
                title: "Cobros del Exterior",
                description:
                  "Compara las mejores plataformas para recibir pagos internacionales y maximiza tus ingresos.",
                icon: IconCurrencyDollar,
                href: "/pagos-exterior",
              },
            ].map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-brand-200 hover:bg-gray-50"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <tool.icon className="h-5 w-5" stroke={1.5} />
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <h3 className="font-semibold text-gray-800">{tool.title}</h3>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </Link>
            ))}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">¿Por qué usar nuestras herramientas?</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 font-medium text-gray-900">Ahorra tiempo</h3>
                <p className="text-sm text-gray-600">
                  Automatiza tareas administrativas para enfocarte en lo que realmente importa: tu trabajo.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 font-medium text-gray-900">Aumenta tus ingresos</h3>
                <p className="text-sm text-gray-600">
                  Establece tarifas justas y crea documentos profesionales que justifiquen tu valor.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 font-medium text-gray-900">Profesionaliza tu negocio</h3>
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
