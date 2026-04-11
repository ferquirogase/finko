import dynamic from "next/dynamic"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { IconArrowLeft } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BottomNav from "@/components/bottom-nav"
import { ThemeProvider } from "@/components/theme-provider"

const SubtleBackground = dynamic(() => import("@/components/subtle-background"))
const PaymentMethods = dynamic(() => import("@/components/payment-methods"))
const PaymentFAQ = dynamic(() => import("@/components/payment-faq"))

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.pagos" })
  const baseUrl = "https://finkoapp.online"
  const path = locale === "en" ? "/en/pagos-exterior" : "/pagos-exterior"
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: { es: `${baseUrl}/pagos-exterior`, en: `${baseUrl}/en/pagos-exterior` },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}${path}`,
    },
  }
}

export default async function PagosExteriorPage() {
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

          <PaymentMethods />
          <PaymentFAQ />
        </div>
        <Footer />
        <BottomNav />
      </div>
    </ThemeProvider>
  )
}
