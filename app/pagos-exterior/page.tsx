import PaymentMethods from "@/components/payment-methods"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BottomNav from "@/components/bottom-nav"
import SubtleBackground from "@/components/subtle-background"
import { ThemeProvider } from "@/components/theme-provider"

export default function PagosExteriorPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SubtleBackground />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Navbar />
        <div className="space-y-6">
          <div className="mb-6 flex items-center">
            <Link href="/">
              <Button variant="ghost" className="gap-2 text-brand-600 hover:bg-brand-50 hover:text-brand-700">
                <IconArrowLeft className="h-4 w-4" stroke={1.5} />
                Volver a herramientas
              </Button>
            </Link>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-8 text-white">
            <h1 className="mb-4 text-3xl font-bold">Cómo cobrar del exterior</h1>
            <p className="mb-6 text-lg text-white/90">
              Compara las mejores plataformas para recibir pagos internacionales y maximiza tus ingresos como
              freelancer.
            </p>
          </div>

          <PaymentMethods />

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Preguntas frecuentes sobre cobros internacionales
            </h2>

            <div className="space-y-4">
              <div className="rounded-lg border border-gray-100 p-4">
                <h3 className="mb-2 font-medium text-purple-900">
                  ¿Qué documentación necesito para recibir pagos internacionales?
                </h3>
                <p className="text-sm text-gray-600">
                  Generalmente necesitarás identificación oficial (pasaporte o DNI), comprobante de domicilio y,
                  dependiendo del país, documentación fiscal como número de identificación tributaria. Algunas
                  plataformas pueden solicitar información adicional para cumplir con regulaciones contra el lavado de
                  dinero.
                </p>
              </div>

              <div className="rounded-lg border border-gray-100 p-4">
                <h3 className="mb-2 font-medium text-purple-900">
                  ¿Cómo afectan los impuestos a mis cobros internacionales?
                </h3>
                <p className="text-sm text-gray-600">
                  Los pagos internacionales pueden estar sujetos a impuestos tanto en el país de origen como en tu país
                  de residencia. Es importante consultar con un contador especializado en tu país para entender tus
                  obligaciones fiscales y posibles tratados de doble imposición que puedan aplicar.
                </p>
              </div>

              <div className="rounded-lg border border-gray-100 p-4">
                <h3 className="mb-2 font-medium text-purple-900">
                  ¿Cuál es la forma más rápida de recibir pagos internacionales?
                </h3>
                <p className="text-sm text-gray-600">
                  PayPal suele ofrecer transferencias instantáneas, pero con comisiones más altas. Wise y Payoneer
                  tienen tiempos de procesamiento de 1-3 días hábiles. Para necesidades urgentes, algunas plataformas
                  ofrecen tarjetas de débito que te permiten acceder a tus fondos inmediatamente después de recibirlos.
                </p>
              </div>

              <div className="rounded-lg border border-gray-100 p-4">
                <h3 className="mb-2 font-medium text-purple-900">
                  ¿Cómo puedo reducir las comisiones por pagos internacionales?
                </h3>
                <p className="text-sm text-gray-600">
                  Para reducir comisiones: negocia con tus clientes para que cubran las tarifas de transacción,
                  consolida pagos pequeños en transferencias más grandes, considera plataformas con menores comisiones
                  como Wise para montos grandes, y mantén tus fondos en la divisa original si planeas usarlos para
                  gastos en esa moneda.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <BottomNav />
      </div>
    </ThemeProvider>
  )
}
