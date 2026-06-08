import dynamic from "next/dynamic"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BottomNav from "@/components/bottom-nav"
import { ThemeProvider } from "@/components/theme-provider"

const SubtleBackground = dynamic(() => import("@/components/subtle-background"))

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEnglish = locale === "en"
  const baseUrl = "https://finkoapp.online"
  const path = isEnglish ? "/en/privacidad" : "/privacidad"

  return {
    title: isEnglish ? "Privacy policy" : "Política de privacidad",
    description: isEnglish
      ? "How Finko handles analytics, advertising, and site usage data."
      : "Cómo maneja Finko la analítica, la publicidad y los datos de uso del sitio.",
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: { es: `${baseUrl}/privacidad`, en: `${baseUrl}/en/privacidad` },
    },
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isEnglish = locale === "en"
  const t = await getTranslations("common")

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <SubtleBackground />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Navbar />
        <main className="rounded-3xl border border-gray-800 bg-gray-900/95 p-6 sm:p-8">
          <div className="mb-8 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-400">Legal</p>
            <h1 className="text-3xl font-semibold text-gray-100">
              {isEnglish ? "Privacy policy" : "Política de privacidad"}
            </h1>
            <p className="text-sm text-gray-500">
              {isEnglish ? "Last updated: June 8, 2026." : "Última actualización: 8 de junio de 2026."}
            </p>
          </div>

          <div className="space-y-8 text-sm leading-7 text-gray-300">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-100">
                {isEnglish ? "1. Scope" : "1. Alcance"}
              </h2>
              <p>
                {isEnglish
                  ? "This policy explains how Finko may collect, use, and protect information when you browse the site, use its tools, or interact with analytics and advertising services."
                  : "Esta política explica cómo Finko puede recopilar, usar y proteger información cuando navegás el sitio, usás sus herramientas o interactuás con servicios de analítica y publicidad."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-100">
                {isEnglish ? "2. Information collected" : "2. Información recopilada"}
              </h2>
              <p>
                {isEnglish
                  ? "Finko may collect technical data such as browser type, device characteristics, approximate location, visited pages, referral source, and general interaction events needed to operate and improve the site."
                  : "Finko puede recopilar datos técnicos como tipo de navegador, características del dispositivo, ubicación aproximada, páginas visitadas, fuente de referencia y eventos generales de interacción necesarios para operar y mejorar el sitio."}
              </p>
              <p>
                {isEnglish
                  ? "Content you generate with the tools is primarily processed in your browser. If you voluntarily contact Finko, the information shared in that communication may be used to respond to your message."
                  : "El contenido que generás con las herramientas se procesa principalmente en tu navegador. Si contactás voluntariamente a Finko, la información compartida en esa comunicación puede usarse para responder tu mensaje."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-100">
                {isEnglish ? "3. Analytics and ads" : "3. Analítica y anuncios"}
              </h2>
              <p>
                {isEnglish
                  ? "Finko uses Google Analytics and may use Google AdSense. These services can use cookies or similar technologies to measure traffic, understand user behavior, personalize ads, and report campaign performance."
                  : "Finko utiliza Google Analytics y puede utilizar Google AdSense. Estos servicios pueden usar cookies o tecnologías similares para medir tráfico, entender el comportamiento de uso, personalizar anuncios y reportar rendimiento."}
              </p>
              <p>
                {isEnglish
                  ? "Google and its partners may process data according to their own policies. You should review Google’s privacy terms for more detail."
                  : "Google y sus socios pueden procesar datos según sus propias políticas. Conviene revisar los términos de privacidad de Google para más detalle."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-100">
                {isEnglish ? "4. Purpose of use" : "4. Finalidad de uso"}
              </h2>
              <p>
                {isEnglish
                  ? "Information may be used to operate the site, improve performance, analyze demand, diagnose incidents, maintain security, and support monetization through advertising."
                  : "La información puede usarse para operar el sitio, mejorar el rendimiento, analizar demanda, diagnosticar incidentes, mantener la seguridad y sostener la monetización mediante publicidad."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-100">
                {isEnglish ? "5. Third parties" : "5. Terceros"}
              </h2>
              <p>
                {isEnglish
                  ? "The site may include links or services from third parties such as Google, LinkedIn, Cafecito, and payment platforms. Each third party applies its own privacy practices."
                  : "El sitio puede incluir enlaces o servicios de terceros como Google, LinkedIn, Cafecito y plataformas de pago. Cada tercero aplica sus propias prácticas de privacidad."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-100">
                {isEnglish ? "6. Your choices" : "6. Tus opciones"}
              </h2>
              <p>
                {isEnglish
                  ? "You can delete or block cookies from your browser settings and manage ad personalization settings where Google makes those controls available."
                  : "Podés eliminar o bloquear cookies desde la configuración de tu navegador y gestionar la personalización de anuncios cuando Google ofrezca esos controles."}
              </p>
            </section>
          </div>
        </main>
        <div className="py-6">
          <Link href="/" className="text-sm text-brand-400 transition-colors hover:text-brand-300">
            {t("backToTools")}
          </Link>
        </div>
        <Footer />
        <BottomNav />
      </div>
    </ThemeProvider>
  )
}
