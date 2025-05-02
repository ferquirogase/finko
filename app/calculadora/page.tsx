import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import PricingCalculator from "@/components/pricing-calculator"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BottomNav from "@/components/bottom-nav"
import SubtleBackground from "@/components/subtle-background"
import { ThemeProvider } from "@/components/theme-provider"

export default function CalculadoraPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SubtleBackground />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Navbar />
        <div className="space-y-6 pb-20">
          <div className="mb-6 flex items-center">
            <Link href="/">
              <Button variant="ghost" className="gap-2 text-brand-600 hover:bg-brand-50 hover:text-brand-700">
                <IconArrowLeft className="h-4 w-4" stroke={1.5} />
                Volver a herramientas
              </Button>
            </Link>
          </div>

          <PricingCalculator />
        </div>
        <Footer />
        <BottomNav />
      </div>
    </ThemeProvider>
  )
}
