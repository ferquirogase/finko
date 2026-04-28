import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BottomNav from "@/components/bottom-nav"
import NewClientIntake from "@/components/new-client-intake"
import { IconArrowLeft, IconSparkles } from "@tabler/icons-react"

export default function NuevoClientePage() {
  const t = useTranslations("newClient")

  return (
    <main className="relative flex min-h-screen flex-col bg-gray-950 pb-20 md:pb-0">
      <Navbar />

      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {/* Breadcrumb / Back */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <IconArrowLeft size={16} />
          {t("backToDashboard")}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20">
              <IconSparkles size={20} className="text-brand-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
          </div>
          <p className="text-gray-400">{t("subtitle")}</p>
        </div>

        {/* Main intake component */}
        <NewClientIntake />
      </div>

      <Footer />
      <BottomNav />
    </main>
  )
}
