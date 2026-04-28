import { Link } from "@/i18n/navigation"
import { IconArrowRight, IconSparkles } from "@tabler/icons-react"
import { useTranslations } from "next-intl"

export default function Hero() {
  const t = useTranslations("hero")

  return (
    <div className="py-6 md:py-10">
      {/* Badge */}
      <div className="mb-6 flex justify-center md:justify-start">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-400">
          <IconSparkles className="h-3.5 w-3.5" stroke={2} />
          {t("badge")}
        </span>
      </div>

      {/* Headline */}
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl md:text-left text-center">
        {t("title1")}{" "}
        <span className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
          {t("titleHighlight")}
        </span>
        <br />
        {t("title2")}
      </h1>

      {/* Subtitle */}
      <p className="mb-8 max-w-xl text-base text-gray-500 md:text-left text-center md:text-lg">
        {t("subtitle")}
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 md:justify-start justify-center">
        <Link
          href="/calculadora"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
        >
          {t("ctaCalculate")}
          <IconArrowRight className="h-4 w-4" stroke={2} />
        </Link>
        <Link
          href="/presupuestos"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-5 py-2.5 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-700 hover:text-gray-100"
        >
          {t("ctaBudget")}
        </Link>
      </div>
    </div>
  )
}
