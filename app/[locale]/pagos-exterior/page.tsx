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
const PaymentMethods = dynamic(() => import("@/components/payment-methods"), {
  loading: () => <div className="h-[500px] animate-pulse rounded-xl bg-white/5" />,
})
const PaymentFAQ = dynamic(() => import("@/components/payment-faq"), {
  loading: () => <div className="h-[300px] animate-pulse rounded-xl bg-white/5" />,
})

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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué documentación necesito para recibir pagos del exterior?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Generalmente necesitás identificación oficial (DNI o pasaporte), comprobante de domicilio y, según la plataforma, tu número de CUIT/CUIL. Algunas plataformas pueden pedir documentación adicional para cumplir con regulaciones contra el lavado de dinero (KYC).",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo afectan los impuestos a mis cobros internacionales?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los pagos del exterior pueden estar sujetos a impuestos en Argentina. Si sos monotributista o responsable inscripto, debés declarar estos ingresos. Te recomendamos consultar con un contador para entender tus obligaciones según tu situación fiscal.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuál es la forma más rápida de recibir pagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wise y Skrill suelen procesar en 1-2 días hábiles. PayPal puede ser más rápido para la acreditación inicial, pero los retiros a cuenta bancaria demoran más. Si necesitás el dinero rápido, Payoneer y Skrill ofrecen tarjetas de débito para usar los fondos de inmediato.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo puedo reducir las comisiones?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Algunas estrategias: usá Wise para transferencias grandes (la comisión porcentual es la más baja), consolidá pagos chicos en transferencias más grandes para que el costo fijo de retiro impacte menos, y hablá con tus clientes para que usen plataformas con menores costos de envío.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo tener cuentas en varias plataformas a la vez?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, y es lo recomendable. Muchos freelancers usan Wise para clientes europeos (por el tipo de cambio), Payoneer para marketplaces como Upwork o Fiverr, y PayPal como opción de respaldo para clientes que no usan otras plataformas.",
      },
    },
  ],
}

export default async function PagosExteriorPage() {
  const t = await getTranslations("common")

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
