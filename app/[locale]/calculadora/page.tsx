import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { IconArrowLeft } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import PricingCalculator from "@/components/pricing-calculator"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BottomNav from "@/components/bottom-nav"
import SubtleBackground from "@/components/subtle-background"
import { ThemeProvider } from "@/components/theme-provider"

export default async function CalculadoraPage() {
  const t = await getTranslations("common")

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <SubtleBackground />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Navbar />
        <div className="space-y-6 pb-20">
          <div className="mb-6 flex items-center">
            <Link href="/">
              <Button variant="ghost" className="gap-2 text-brand-400 hover:bg-brand-500/10 hover:text-brand-300">
                <IconArrowLeft className="h-4 w-4" stroke={1.5} />
                {t("backToTools")}
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
