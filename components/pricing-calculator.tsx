"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Check, Search, Calculator, Copy, ChevronDown, ChevronUp, Settings2, FileText } from "lucide-react"
import { HelpTooltip } from "@/components/help-tooltip"
import { useTranslations } from "next-intl"

// ── Static category structure (IDs + multipliers — no translation) ────────────
const CATEGORY_STRUCTURE = [
  { id: "development", subs: [
    { id: "web",        multiplier: 1 },
    { id: "mobile",     multiplier: 1.2 },
    { id: "software",   multiplier: 1.1 },
    { id: "game",       multiplier: 1.3 },
    { id: "blockchain", multiplier: 1.4 },
  ]},
  { id: "design", subs: [
    { id: "ui",           multiplier: 1.05 },
    { id: "graphic",      multiplier: 0.9 },
    { id: "brand",        multiplier: 0.95 },
    { id: "illustration", multiplier: 0.85 },
    { id: "animation",    multiplier: 1.1 },
  ]},
  { id: "content", subs: [
    { id: "writing",     multiplier: 0.7 },
    { id: "translation", multiplier: 0.65 },
    { id: "editing",     multiplier: 0.75 },
    { id: "audiovisual", multiplier: 1.1 },
    { id: "social",      multiplier: 0.8 },
  ]},
  { id: "marketing", subs: [
    { id: "digital",  multiplier: 0.85 },
    { id: "seo",      multiplier: 0.9 },
    { id: "sem",      multiplier: 0.95 },
    { id: "email",    multiplier: 0.8 },
    { id: "strategy", multiplier: 1.1 },
  ]},
  { id: "business", subs: [
    { id: "consulting", multiplier: 1.3 },
    { id: "analysis",   multiplier: 1.2 },
    { id: "finance",    multiplier: 1.25 },
    { id: "legal",      multiplier: 1.35 },
    { id: "project",    multiplier: 1.15 },
  ]},
]

const baseRates = { latam: 15, europe: 35, usa: 50, asia: 20 }
const defaultTaxRates = { latam: 20, europe: 35, usa: 30, asia: 15 }

function NumericInput({
  value, onChange, min, max, step = 1, prefix, suffix,
}: {
  value: number; onChange: (v: number) => void
  min: number; max: number; step?: number; prefix?: string; suffix?: string
}) {
  const [local, setLocal] = useState(value.toString())

  useEffect(() => { setLocal(value.toString()) }, [value])

  const commit = () => {
    const n = local === "" ? min : Number(local)
    const clamped = Math.min(Math.max(isNaN(n) ? min : n, min), max)
    onChange(clamped)
    setLocal(clamped.toString())
  }

  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-sm text-gray-500 pointer-events-none">{prefix}</span>}
      <Input
        type="text"
        inputMode="numeric"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        className={`rounded-lg text-center ${prefix ? "pl-7" : ""} ${suffix ? "pr-14" : ""}`}
      />
      {suffix && <span className="absolute right-3 text-sm text-gray-500 pointer-events-none">{suffix}</span>}
    </div>
  )
}

export default function PricingCalculator() {
  const t = useTranslations("calculator")
  const router = useRouter()

  // ── Build translated categories ───────────────────────────────────────────
  const projectCategories = CATEGORY_STRUCTURE.map((cat) => ({
    id: cat.id,
    name: t(`categories.${cat.id}.name` as any),
    subcategories: cat.subs.map((sub) => ({
      id: sub.id,
      name: t(`categories.${cat.id}.${sub.id}` as any),
      multiplier: sub.multiplier,
    })),
  }))

  const allSubcategories = projectCategories.flatMap((cat) =>
    cat.subcategories.map((sub) => ({ ...sub, categoryName: cat.name }))
  )

  const getProjectMultiplier = (id: string) => allSubcategories.find((s) => s.id === id)?.multiplier ?? 1
  const getProjectName = (id: string) => allSubcategories.find((s) => s.id === id)?.name ?? t("selectWork")

  // ── State ────────────────────────────────────────────────────────────────
  const [experience,     setExperience]     = useState(3)
  const [projectType,    setProjectType]    = useState("web")
  const [region,         setRegion]         = useState("latam")
  const [hours,          setHours]          = useState(40)
  const [complexity,     setComplexity]     = useState(1)
  const [urgent,         setUrgent]         = useState(false)
  const [monthlyTarget,  setMonthlyTarget]  = useState(3000)
  const [billableHours,  setBillableHours]  = useState(20)
  const [workWeeks,      setWorkWeeks]      = useState(48)
  const [taxRate,        setTaxRate]        = useState(20)
  const [profitMargin,   setProfitMargin]   = useState(15)
  const [searchTerm,     setSearchTerm]     = useState("")
  const [isTyping,       setIsTyping]       = useState(false)
  const [dropdownOpen,   setDropdownOpen]   = useState(false)
  const [advancedOpen,   setAdvancedOpen]   = useState(false)
  const [copied,         setCopied]         = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Initialize search term with translated default
  useEffect(() => {
    setSearchTerm(t("categories.development.web" as any))
  }, [t])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleRegionChange = (r: string) => {
    setRegion(r)
    setTaxRate(defaultTaxRates[r as keyof typeof defaultTaxRates])
  }

  // ── Calculations ──────────────────────────────────────────────────────────
  const baseRate = baseRates[region as keyof typeof baseRates]
  const expMultiplier = 0.7 + (experience / 10) * 1.3
  const projMultiplier = getProjectMultiplier(projectType)
  const complexMultiplier = 0.8 + complexity * 0.35
  const urgencyMultiplier = urgent ? 1.3 : 1

  const marketRate = Math.round(baseRate * expMultiplier * projMultiplier * complexMultiplier * urgencyMultiplier)

  const annualTarget = monthlyTarget * 12
  const withProfit = annualTarget * (1 + profitMargin / 100)
  const withTaxes = withProfit * (1 + taxRate / 100)
  const annualBillableHours = workWeeks * billableHours
  const sustainableRate = annualBillableHours > 0 ? Math.round(withTaxes / annualBillableHours) : 0
  const recommendedRate = Math.round(marketRate * 0.4 + sustainableRate * 0.6)
  const projectTotal = recommendedRate * hours

  const handleSendToProposal = () => {
    const params = new URLSearchParams({
      rate: recommendedRate.toString(),
      hours: hours.toString(),
      total: projectTotal.toString(),
      type: getProjectName(projectType),
    })
    router.push(`/presupuestos?${params.toString()}`)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${t("recommendedRate")}: $${recommendedRate} USD/h\n${t("projectTotal")}: $${projectTotal.toLocaleString()} USD (${hours} ${t("hoursUnit")})\n${t("marketRate")}: $${marketRate} USD/h\n${t("sustainableRate")}: $${sustainableRate} USD/h`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filtered = isTyping
    ? projectCategories
        .map((cat) => ({
          ...cat,
          subcategories: cat.subcategories.filter(
            (s) =>
              searchTerm === "" ||
              s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              cat.name.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((cat) => cat.subcategories.length > 0)
    : projectCategories

  const experienceLabel =
    experience <= 2 ? t("expLabels.junior") :
    experience <= 5 ? t("expLabels.semiSenior") :
    experience <= 8 ? t("expLabels.senior") :
    t("expLabels.expert")

  const regions = [
    { id: "latam",  label: t("regions.latam") },
    { id: "usa",    label: t("regions.usa") },
    { id: "europe", label: t("regions.europe") },
    { id: "asia",   label: t("regions.asia") },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gray-900 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-brand-500/15 p-2 text-brand-400">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-100">{t("title")}</h2>
            <p className="text-sm text-gray-500">{t("subtitle")}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* ── Columna de inputs ── */}
          <div className="space-y-8 lg:col-span-3">

            {/* Tu perfil */}
            <section className="space-y-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">{t("sectionProfile")}</h3>

              {/* Tipo de trabajo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">{t("workType")}</label>
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setIsTyping(true); setDropdownOpen(true) }}
                      onFocus={(e) => { e.target.select(); setIsTyping(false); setDropdownOpen(true) }}
                      placeholder={t("searchPlaceholder")}
                      className="rounded-lg pl-9 pr-9 cursor-pointer focus:cursor-text"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>

                  {dropdownOpen && (
                    <div className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-gray-700 bg-gray-800 py-1 shadow-lg shadow-black/40">
                      {filtered.length === 0 && (
                        <p className="px-3 py-2 text-center text-sm text-gray-500">{t("noResults" as any)}</p>
                      )}
                      {filtered.map((cat) => (
                        <div key={cat.id}>
                          <div className="sticky top-0 bg-gray-700 px-3 py-1 text-xs font-semibold text-gray-400">
                            {cat.name}
                          </div>
                          {cat.subcategories.map((sub) => (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => {
                                setProjectType(sub.id)
                                setSearchTerm(sub.name)
                                setIsTyping(false)
                                setDropdownOpen(false)
                              }}
                              className={`flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-brand-500/10 ${
                                projectType === sub.id ? "bg-brand-500/10 font-medium text-brand-400" : "text-gray-300"
                              }`}
                            >
                              <span>{sub.name}</span>
                              {projectType === sub.id && <Check className="h-4 w-4 text-brand-400" />}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Experiencia */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">{t("experience")}</label>
                  <span className="text-sm font-semibold text-brand-400">
                    {experience} {experience === 1 ? t("year") : t("years")} · {experienceLabel}
                  </span>
                </div>
                <Slider value={[experience]} onValueChange={(v) => setExperience(v[0])} min={0} max={10} step={1} />
                <div className="flex justify-between px-0.5 text-xs text-gray-600">
                  <span>{t("noExperience")}</span>
                  <span>{t("expertLabel")}</span>
                </div>
              </div>

              {/* Región */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">{t("marketLabel")}</label>
                <div className="grid grid-cols-2 gap-2">
                  {regions.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleRegionChange(r.id)}
                      className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium text-center leading-tight whitespace-normal transition-all ${
                        region === r.id
                          ? "border-brand-400 bg-brand-500/10 text-brand-300"
                          : "border-gray-800 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Este proyecto */}
            <section className="space-y-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">{t("sectionProject")}</h3>

              {/* Horas estimadas */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm font-medium text-gray-300">{t("estimatedHours")}</label>
                  <HelpTooltip content={<p>{t("estimatedHoursHelp")}</p>} />
                </div>
                <NumericInput value={hours} onChange={setHours} min={1} max={2000} suffix={t("hoursUnit")} />
              </div>

              {/* Complejidad */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">{t("complexity")}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 0, label: t("complexityLow"),  desc: t("complexityLowDesc") },
                    { value: 1, label: t("complexityMid"),  desc: t("complexityMidDesc") },
                    { value: 2, label: t("complexityHigh"), desc: t("complexityHighDesc") },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setComplexity(opt.value)}
                      className={`flex flex-col items-center rounded-xl border-2 px-3 py-3 text-sm transition-all ${
                        complexity === opt.value
                          ? "border-brand-400 bg-brand-500/10 text-brand-300"
                          : "border-gray-800 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      <span className="font-semibold">{opt.label}</span>
                      <span className="mt-0.5 text-xs opacity-70">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgencia */}
              <div className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 transition-all ${
                urgent ? "border-amber-500/50 bg-amber-500/10" : "border-gray-800"
              }`}>
                <div>
                  <p className="text-sm font-medium text-gray-300">{t("urgent")}</p>
                  <p className="text-xs text-gray-500">{t("urgentDesc")}</p>
                </div>
                <Switch checked={urgent} onCheckedChange={setUrgent} id="urgency" />
              </div>
            </section>

            {/* Mis números */}
            <section className="space-y-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">{t("sectionNumbers")}</h3>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm font-medium text-gray-300">{t("monthlyTarget")}</label>
                  <HelpTooltip content={<p>{t("monthlyTargetHelp")}</p>} />
                </div>
                <NumericInput value={monthlyTarget} onChange={setMonthlyTarget} min={0} max={50000} step={100} prefix="$" suffix={t("usdMonth")} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm font-medium text-gray-300">{t("billableHours")}</label>
                  <HelpTooltip content={<p>{t("billableHoursHelp")}</p>} />
                </div>
                <NumericInput value={billableHours} onChange={setBillableHours} min={1} max={60} suffix={t("hsSem")} />
              </div>

              {/* Configuración avanzada */}
              <div className="rounded-xl border border-gray-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setAdvancedOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Settings2 className="h-4 w-4 text-gray-600" />
                    {t("advanced")}
                  </span>
                  {advancedOpen ? <ChevronUp className="h-4 w-4 text-gray-600" /> : <ChevronDown className="h-4 w-4 text-gray-600" />}
                </button>

                {advancedOpen && (
                  <div className="border-t border-gray-800 px-4 py-4 space-y-4 bg-gray-800/50">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <label className="text-sm font-medium text-gray-300">{t("weeksYear")}</label>
                          <HelpTooltip content={<p>{t("weeksHelp")}</p>} />
                        </div>
                        <NumericInput value={workWeeks} onChange={setWorkWeeks} min={1} max={52} suffix={t("weekUnit")} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <label className="text-sm font-medium text-gray-300">{t("taxes")}</label>
                          <HelpTooltip content={<p>{t("taxesHelp")}</p>} />
                        </div>
                        <NumericInput value={taxRate} onChange={setTaxRate} min={0} max={60} suffix="%" />
                        <p className="text-xs text-gray-600">{t("suggestedRegion")}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <label className="text-sm font-medium text-gray-300">{t("margin")}</label>
                          <HelpTooltip content={<p>{t("marginHelp")}</p>} />
                        </div>
                        <NumericInput value={profitMargin} onChange={setProfitMargin} min={0} max={100} suffix="%" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ── Panel de resultados ── */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 space-y-4">
              {/* Tarifa recomendada */}
              <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white">
                <p className="text-sm font-medium text-brand-100 mb-1">{t("recommendedRate")}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-lg font-medium">$</span>
                  <span className="text-6xl font-bold">{recommendedRate}</span>
                  <span className="text-lg font-medium">USD/h</span>
                </div>
                <p className="text-xs text-brand-200">{t("combination")}</p>

                <div className="mt-5 border-t border-white/20 pt-4">
                  <p className="text-sm font-medium text-brand-100 mb-1">{t("projectTotal")}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-medium">$</span>
                    <span className="text-3xl font-bold">{projectTotal.toLocaleString()}</span>
                    <span className="text-sm font-medium">USD</span>
                  </div>
                  <p className="text-xs text-brand-200 mt-0.5">
                    {hours === 1 ? t("forHours", { hours }) : t("forHoursPlural", { hours })}
                  </p>
                </div>
              </div>

              {/* Desglose */}
              <div className="rounded-2xl border border-gray-800 bg-gray-800/50 p-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">{t("breakdown")}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t("marketRate")}</span>
                    <span className="font-semibold text-gray-200">${marketRate} {t("perHour")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t("sustainableRate")}</span>
                    <span className="font-semibold text-gray-200">${sustainableRate} {t("perHour")}</span>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-3 space-y-1.5 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>{t("billableHoursYear")}</span>
                    <span className="font-medium text-gray-400">{annualBillableHours.toLocaleString()} hs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("annualIncome")}</span>
                    <span className="font-medium text-gray-400">${Math.round(withTaxes).toLocaleString()} USD</span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <Button onClick={handleSendToProposal} className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 gap-2">
                <FileText className="h-4 w-4" />
                {t("makeProposal")}
              </Button>

              <Button onClick={handleCopy} variant="outline" className="w-full rounded-xl">
                {copied ? (
                  <><Check className="mr-2 h-4 w-4 text-green-500" /> {t("copied" as any)}</>
                ) : (
                  <><Copy className="mr-2 h-4 w-4" /> {t("copyResults")}</>
                )}
              </Button>

              <p className="text-center text-xs text-gray-600">{t("rateNote")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
