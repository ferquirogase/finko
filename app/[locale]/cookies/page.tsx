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
  const path = isEnglish ? "/en/cookies" : "/cookies"

  return {
    title: isEnglish ? "Cookie policy" : "Política de cookies",
    description: isEnglish
      ? "How Finko uses cookies and similar technologies with analytics and advertising tools."
      : "Cómo usa Finko las cookies y tecnologías similares con herramientas de analítica y publicidad.",
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: { es: `${baseUrl}/cookies`, en: `${baseUrl}/en/cookies` },
    },
  }
}

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
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
              {isEnglish ? "Cookie policy" : "Política de cookies"}
            </h1>
            <p className="text-sm text-gray-500">
              {isEnglish ? "Last updated: June 8, 2026." : "Última actualización: 8 de junio de 2026."}
            </p>
          </div>

          <div className="space-y-8 text-sm leading-7 text-gray-300">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-100">
                {isEnglish ? "1. What cookies are" : "1. Qué son las cookies"}
              </h2>
              <p>
                {isEnglish
                  ? "Cookies are small text files stored on your device when you visit a website. They help remember preferences, measure activity, and support analytics and advertising services."
                  : "Las cookies son pequeños archivos de texto que se guardan en tu dispositivo cuando visitás un sitio web. Sirven para recordar preferencias, medir actividad y sostener servicios de analítica y publicidad."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-100">
                {isEnglish ? "2. How Finko uses them" : "2. Cómo las usa Finko"}
              </h2>
              <p>
                {isEnglish
                  ? "Finko may use cookies or similar technologies to keep the site working, understand traffic, improve performance, remember certain preferences, and support ad delivery."
                  : "Finko puede usar cookies o tecnologías similares para mantener el sitio funcionando, entender el tráfico, mejorar el rendimiento, recordar ciertas preferencias y sostener la entrega de anuncios."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-100">
                {isEnglish ? "3. Cookie categories" : "3. Categorías de cookies"}
              </h2>
              <p>
                {isEnglish
                  ? "The site may rely on strictly necessary cookies, analytics cookies, browser storage for preferences, and advertising cookies managed by third-party providers."
                  : "El sitio puede apoyarse en cookies estrictamente necesarias, cookies de analítica, almacenamiento del navegador para preferencias y cookies publicitarias gestionadas por proveedores externos."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-100">
                {isEnglish ? "4. Third-party cookies" : "4. Cookies de terceros"}
              </h2>
              <p>
                {isEnglish
                  ? "Google Analytics and Google AdSense may set or read cookies according to their own documentation and policies. External services linked from Finko may also create cookies independently."
                  : "Google Analytics y Google AdSense pueden establecer o leer cookies según su propia documentación y políticas. Los servicios externos enlazados desde Finko también pueden crear cookies de forma independiente."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-100">
                {isEnglish ? "5. Managing cookies" : "5. Gestión de cookies"}
              </h2>
              <p>
                {isEnglish
                  ? "You can restrict, block, or delete cookies from your browser settings. If available in your region, you may also adjust Google’s ad personalization settings."
                  : "Podés restringir, bloquear o eliminar cookies desde la configuración de tu navegador. Si está disponible en tu región, también podés ajustar la personalización de anuncios de Google."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-100">
                {isEnglish ? "6. Effects of disabling them" : "6. Efectos de desactivarlas"}
              </h2>
              <p>
                {isEnglish
                  ? "Disabling cookies may affect analytics, saved preferences, or ad-related features, and some parts of the site may behave differently."
                  : "Desactivar cookies puede afectar la analítica, las preferencias guardadas o funciones relacionadas con anuncios, y algunas partes del sitio pueden comportarse de forma diferente."}
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
