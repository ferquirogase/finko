import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BottomNav from "@/components/bottom-nav"
import SubtleBackground from "@/components/subtle-background"
import Hero from "@/components/hero"
import Image from "next/image"
import {
  IconCalculator,
  IconFileText,
  IconCreditCard,
  IconCurrencyDollar,
  IconArrowRight,
  IconClock,
  IconTrendingUp,
  IconStar,
} from "@tabler/icons-react"

export default function Home() {
  const t = useTranslations()

  const tools = [
    {
      number: "01",
      titleKey: "home.tools.calculator.title",
      descKey: "home.tools.calculator.description",
      icon: IconCalculator,
      href: "/calculadora",
      accent: "text-brand-400",
      accentBg: "bg-brand-500/10",
    },
    {
      number: "02",
      titleKey: "home.tools.proposals.title",
      descKey: "home.tools.proposals.description",
      icon: IconFileText,
      href: "/presupuestos",
      accent: "text-green-400",
      accentBg: "bg-green-500/10",
    },
    {
      number: "03",
      titleKey: "home.tools.receipts.title",
      descKey: "home.tools.receipts.description",
      icon: IconCreditCard,
      href: "/recibos",
      accent: "text-purple-400",
      accentBg: "bg-purple-500/10",
    },
    {
      number: "04",
      titleKey: "home.tools.payments.title",
      descKey: "home.tools.payments.description",
      icon: IconCurrencyDollar,
      href: "/pagos-exterior",
      accent: "text-amber-400",
      accentBg: "bg-amber-500/10",
    },
  ]

  const benefits = [
    {
      icon: IconClock,
      titleKey: "home.benefits.time.title",
      descKey: "home.benefits.time.description",
    },
    {
      icon: IconTrendingUp,
      titleKey: "home.benefits.income.title",
      descKey: "home.benefits.income.description",
    },
    {
      icon: IconStar,
      titleKey: "home.benefits.professional.title",
      descKey: "home.benefits.professional.description",
    },
  ]

  return (
    <>
      <SubtleBackground />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Navbar />
        <main className="space-y-16 pb-24">

          {/* ── Hero ── */}
          <Hero />

          {/* ── Herramientas ── */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-600">
                {t("home.toolsTitle")}
              </h2>
              <div className="h-px flex-1 ml-4 bg-gray-800" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {tools.map((tool) => (
                <Link
                  key={tool.titleKey}
                  href={tool.href}
                  className="group relative flex flex-col rounded-2xl border border-gray-800 bg-gray-900 p-5 transition-all duration-200 hover:border-gray-700 hover:bg-gray-800"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className={`rounded-xl ${tool.accentBg} p-2.5`}>
                      <tool.icon className={`h-5 w-5 ${tool.accent}`} stroke={1.5} />
                    </div>
                    <span className="text-xs font-mono font-semibold text-gray-700">{tool.number}</span>
                  </div>

                  <h3 className="mb-1.5 font-semibold text-gray-100">{t(tool.titleKey as any)}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-gray-500">{t(tool.descKey as any)}</p>

                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-gray-600 transition-all duration-200 group-hover:gap-2 group-hover:text-gray-400">
                    {t("common.open")}
                    <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" stroke={2} />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Banner Saldo ── */}
          <a
            href="https://saldo.com.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl overflow-hidden relative transition-all duration-200 hover:scale-[1.01] hover:shadow-xl hover:shadow-black/30"
            style={{ minHeight: "150px" }}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-teal-600">
              <Image
                src="/green-gradient-texture.png"
                alt={t("home.saldo.bgAlt")}
                fill
                style={{ objectFit: "cover", opacity: 0.8 }}
                priority
              />
            </div>
            <div className="relative z-10 py-6 px-5 sm:py-8 flex flex-col items-center justify-center text-center">
              <div className="mb-3">
                <Image
                  src="/logo-saldo.png"
                  alt="Logo Saldo"
                  width={100}
                  height={50}
                  className="sm:w-[120px] h-auto"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="max-w-[280px] sm:max-w-md">
                <h3 className="text-lg sm:text-xl font-bold text-white break-words sm:whitespace-nowrap">
                  {t("home.saldo.title")}
                </h3>
                <p className="mt-1 text-sm sm:text-base text-white/90">
                  {t("home.saldo.subtitle")}
                </p>
              </div>
            </div>
          </a>

          {/* ── Por qué usarlas ── */}
          <section>
            <div className="mb-6 flex items-center">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-600">
                {t("home.whyTitle")}
              </h2>
              <div className="h-px flex-1 ml-4 bg-gray-800" />
            </div>

            <div className="grid gap-px rounded-2xl overflow-hidden border border-gray-800 sm:grid-cols-3">
              {benefits.map((b) => (
                <div key={b.titleKey} className="flex flex-col gap-3 bg-gray-900 p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-800 text-gray-400">
                    <b.icon className="h-4.5 w-4.5" stroke={1.5} />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-100">{t(b.titleKey as any)}</h3>
                    <p className="text-sm leading-relaxed text-gray-500">{t(b.descKey as any)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
        <Footer />
        <BottomNav />
      </div>
    </>
  )
}
