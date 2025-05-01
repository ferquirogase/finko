import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import InvoiceTemplates from "@/components/invoice-templates"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BottomNav from "@/components/bottom-nav"
import ParticlesBackground from "@/components/particles-background"
import { ThemeProvider } from "@/components/theme-provider"

export default function RecibosPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <ParticlesBackground />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Navbar />
        <div className="space-y-6 pb-20">
          <div className="mb-6 flex items-center">
            <Link href="/">
              <Button variant="ghost" className="gap-2 text-purple-600 hover:bg-purple-50 hover:text-purple-700">
                <IconArrowLeft className="h-4 w-4" stroke={1.5} />
                Volver a herramientas
              </Button>
            </Link>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-purple-500 to-purple-700 p-8 text-white">
            <h1 className="mb-4 text-3xl font-bold">Generador de Recibos</h1>
            <p className="mb-6 text-lg text-white/90">Crea recibos profesionales para tus clientes</p>
          </div>

          <InvoiceTemplates />
        </div>
        <Footer />
        <BottomNav />
      </div>
    </ThemeProvider>
  )
}
