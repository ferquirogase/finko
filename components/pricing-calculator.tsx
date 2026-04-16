"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Check, Search, Calculator, Copy, ChevronDown, ChevronUp, Settings2, FileText } from "lucide-react"
import { HelpTooltip } from "@/components/help-tooltip"

const projectCategories = [
  {
    id: "development",
    name: "Desarrollo",
    subcategories: [
      { id: "web", name: "Desarrollo Web", multiplier: 1 },
      { id: "mobile", name: "Desarrollo Móvil", multiplier: 1.2 },
      { id: "software", name: "Desarrollo de Software", multiplier: 1.1 },
      { id: "game", name: "Desarrollo de Videojuegos", multiplier: 1.3 },
      { id: "blockchain", name: "Blockchain / Web3", multiplier: 1.4 },
    ],
  },
  {
    id: "design",
    name: "Diseño",
    subcategories: [
      { id: "ui", name: "Diseño UI/UX", multiplier: 1.05 },
      { id: "graphic", name: "Diseño Gráfico", multiplier: 0.9 },
      { id: "brand", name: "Branding", multiplier: 0.95 },
      { id: "illustration", name: "Ilustración", multiplier: 0.85 },
      { id: "animation", name: "Animación", multiplier: 1.1 },
    ],
  },
  {
    id: "content",
    name: "Contenido",
    subcategories: [
      { id: "writing", name: "Redacción", multiplier: 0.7 },
      { id: "translation", name: "Traducción", multiplier: 0.65 },
      { id: "editing", name: "Edición", multiplier: 0.75 },
      { id: "audiovisual", name: "Contenido Audiovisual", multiplier: 1.1 },
      { id: "social", name: "Redes Sociales", multiplier: 0.8 },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    subcategories: [
      { id: "digital", name: "Marketing Digital", multiplier: 0.85 },
      { id: "seo", name: "SEO", multiplier: 0.9 },
      { id: "sem", name: "SEM / Ads", multiplier: 0.95 },
      { id: "email", name: "Email Marketing", multiplier: 0.8 },
      { id: "strategy", name: "Estrategia de Marketing", multiplier: 1.1 },
    ],
  },
  {
    id: "business",
    name: "Negocios",
    subcategories: [
      { id: "consulting", name: "Consultoría", multiplier: 1.3 },
      { id: "analysis", name: "Análisis de Datos", multiplier: 1.2 },
      { id: "finance", name: "Finanzas", multiplier: 1.25 },
      { id: "legal", name: "Legal", multiplier: 1.35 },
      { id: "project", name: "Gestión de Proyectos", multiplier: 1.15 },
    ],
  },
]

const allSubcategories = projectCategories.flatMap((cat) =>
  cat.subcategories.map((sub) => ({ ...sub, categoryName: cat.name }))
)

function getProjectMultiplier(projectId: string) {
  return allSubcategories.find((s) => s.id === projectId)?.multiplier ?? 1
}

function getProjectName(projectId: string) {
  return allSubcategories.find((s) => s.id === projectId)?.name ?? "Selecciona el tipo de trabajo"
}

const baseRates = { latam: 15, europe: 35, usa: 50, asia: 20 }
const defaultTaxRates = { latam: 20, europe: 35, usa: 30, asia: 15 }

function NumericInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
}: {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  prefix?: string
  suffix?: string
}) {
  const [local, setLocal] = useState(value.toString())

  useEffect(() => {
    setLocal(value.toString())
  }, [value])

  const commit = () => {
    const n = local === "" ? min : Number(local)
    const clamped = Math.min(Math.max(isNaN(n) ? min : n, min), max)
    onChange(clamped)
    setLocal(clamped.toString())
  }

  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-sm text-gray-500 pointer-events-none">{prefix}</span>
      )}
      <Input
        type="text"
        inputMode="numeric"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        className={`rounded-lg text-center ${prefix ? "pl-7" : ""} ${suffix ? "pr-14" : ""}`}
      />
      {suffix && (
        <span className="absolute right-3 text-sm text-gray-500 pointer-events-none">{suffix}</span>
      )}
    </div>
  )
}

export default function PricingCalculator() {
  // Perfil
  const [experience, setExperience] = useState(3)
  const [projectType, setProjectType] = useState("web")
  const [region, setRegion] = useState("latam")

  // Proyecto
  const [hours, setHours] = useState(40)
  const [complexity, setComplexity] = useState(1)
  const [urgent, setUrgent] = useState(false)

  // Mis números
  const [monthlyTarget, setMonthlyTarget] = useState(3000)
  const [billableHours, setBillableHours] = useState(20)
  const [workWeeks, setWorkWeeks] = useState(48)
  const [taxRate, setTaxRate] = useState(20)
  const [profitMargin, setProfitMargin] = useState(15)

  // UI
  const [searchTerm, setSearchTerm] = useState("Desarrollo Web")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  // Cálculos
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

  const router = useRouter()

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
      `Tarifa recomendada: $${recommendedRate} USD/hora\nTotal del proyecto: $${projectTotal.toLocaleString()} USD (${hours} horas)\nTarifa de mercado: $${marketRate} USD/hora\nTarifa sostenible: $${sustainableRate} USD/hora`
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
    experience <= 2 ? "Junior" : experience <= 5 ? "Semi-senior" : experience <= 8 ? "Senior" : "Experto"

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gray-900 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-brand-500/15 p-2 text-brand-400">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-100">Calculadora de Tarifas</h2>
            <p className="text-sm text-gray-500">Calculá cuánto cobrar por tus servicios freelance</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* ── Columna de inputs ── */}
          <div className="space-y-8 lg:col-span-3">

            {/* Sección: Tu perfil */}
            <section className="space-y-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Tu perfil</h3>

              {/* Tipo de trabajo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Tipo de trabajo</label>
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setIsTyping(true)
                        setDropdownOpen(true)
                      }}
                      onFocus={(e) => {
                        e.target.select()
                        setIsTyping(false)
                        setDropdownOpen(true)
                      }}
                      placeholder="Buscar tipo de trabajo..."
                      className="rounded-lg pl-9 pr-9 cursor-pointer focus:cursor-text"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>

                  {dropdownOpen && (
                    <div className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-gray-700 bg-gray-800 py-1 shadow-lg shadow-black/40">
                      {filtered.length === 0 && (
                        <p className="px-3 py-2 text-center text-sm text-gray-500">Sin resultados</p>
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
                  <label className="text-sm font-medium text-gray-300">Experiencia</label>
                  <span className="text-sm font-semibold text-brand-400">
                    {experience} {experience === 1 ? "año" : "años"} · {experienceLabel}
                  </span>
                </div>
                <Slider
                  value={[experience]}
                  onValueChange={(v) => setExperience(v[0])}
                  min={0}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between px-0.5 text-xs text-gray-600">
                  <span>Sin experiencia</span>
                  <span>Experto</span>
                </div>
              </div>

              {/* Región */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Mercado donde ofrecés tus servicios</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "latam", label: "Latinoamérica" },
                    { id: "usa", label: "Estados Unidos" },
                    { id: "europe", label: "Europa" },
                    { id: "asia", label: "Asia" },
                  ].map((r) => (
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

            {/* Sección: Este proyecto */}
            <section className="space-y-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Este proyecto</h3>

              {/* Horas estimadas */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm font-medium text-gray-300">Horas estimadas</label>
                  <HelpTooltip content={<p>Total de horas que dedicarás al proyecto.</p>} />
                </div>
                <NumericInput
                  value={hours}
                  onChange={setHours}
                  min={1}
                  max={2000}
                  suffix="horas"
                />
              </div>

              {/* Complejidad */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Complejidad</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 0, label: "Baja", desc: "Tarea simple" },
                    { value: 1, label: "Media", desc: "Estándar" },
                    { value: 2, label: "Alta", desc: "Técnicamente complejo" },
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
                  <p className="text-sm font-medium text-gray-300">Entrega urgente</p>
                  <p className="text-xs text-gray-500">Suma un 30% a la tarifa de mercado</p>
                </div>
                <Switch
                  checked={urgent}
                  onCheckedChange={setUrgent}
                  id="urgency"
                />
              </div>
            </section>

            {/* Sección: Mis números */}
            <section className="space-y-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Mis números</h3>

              {/* Ingreso mensual deseado */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm font-medium text-gray-300">Ingreso mensual que necesitás</label>
                  <HelpTooltip content={<p>Incluí tu sueldo deseado más tus gastos fijos (herramientas, servicios, etc.).</p>} />
                </div>
                <NumericInput
                  value={monthlyTarget}
                  onChange={setMonthlyTarget}
                  min={0}
                  max={50000}
                  step={100}
                  prefix="$"
                  suffix="USD/mes"
                />
              </div>

              {/* Horas facturables por semana */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm font-medium text-gray-300">Horas facturables por semana</label>
                  <HelpTooltip content={<p>Horas reales que podés cobrar. No todo tu tiempo de trabajo es facturable.</p>} />
                </div>
                <NumericInput
                  value={billableHours}
                  onChange={setBillableHours}
                  min={1}
                  max={60}
                  suffix="hs/sem"
                />
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
                    Configuración avanzada
                  </span>
                  {advancedOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  )}
                </button>

                {advancedOpen && (
                  <div className="border-t border-gray-800 px-4 py-4 space-y-4 bg-gray-800/50">
                    <div className="grid gap-4 sm:grid-cols-3">
                      {/* Semanas trabajadas */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <label className="text-sm font-medium text-gray-300">Semanas/año</label>
                          <HelpTooltip content={<p>Semanas que trabajás al año. 52 menos tus vacaciones.</p>} />
                        </div>
                        <NumericInput
                          value={workWeeks}
                          onChange={setWorkWeeks}
                          min={1}
                          max={52}
                          suffix="sem"
                        />
                      </div>

                      {/* Impuestos */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <label className="text-sm font-medium text-gray-300">Impuestos</label>
                          <HelpTooltip content={<p>Estimación según tu región. Podés ajustarlo a tu situación real.</p>} />
                        </div>
                        <NumericInput
                          value={taxRate}
                          onChange={setTaxRate}
                          min={0}
                          max={60}
                          suffix="%"
                        />
                        <p className="text-xs text-gray-600">Sugerido para tu región</p>
                      </div>

                      {/* Margen */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <label className="text-sm font-medium text-gray-300">Margen</label>
                          <HelpTooltip content={<p>Porcentaje extra para ahorro, inversión o imprevistos.</p>} />
                        </div>
                        <NumericInput
                          value={profitMargin}
                          onChange={setProfitMargin}
                          min={0}
                          max={100}
                          suffix="%"
                        />
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
                <p className="text-sm font-medium text-brand-100 mb-1">Tarifa recomendada</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-lg font-medium">$</span>
                  <span className="text-6xl font-bold">{recommendedRate}</span>
                  <span className="text-lg font-medium">USD/h</span>
                </div>
                <p className="text-xs text-brand-200">Combinación de tarifa de mercado y sostenible</p>

                <div className="mt-5 border-t border-white/20 pt-4">
                  <p className="text-sm font-medium text-brand-100 mb-1">Total del proyecto</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-medium">$</span>
                    <span className="text-3xl font-bold">{projectTotal.toLocaleString()}</span>
                    <span className="text-sm font-medium">USD</span>
                  </div>
                  <p className="text-xs text-brand-200 mt-0.5">Por {hours} {hours === 1 ? "hora" : "horas"} de trabajo</p>
                </div>
              </div>

              {/* Desglose */}
              <div className="rounded-2xl border border-gray-800 bg-gray-800/50 p-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Desglose</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Tarifa de mercado</span>
                    <span className="font-semibold text-gray-200">${marketRate} / hora</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Tarifa sostenible</span>
                    <span className="font-semibold text-gray-200">${sustainableRate} / hora</span>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-3 space-y-1.5 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Horas facturables/año</span>
                    <span className="font-medium text-gray-400">{annualBillableHours.toLocaleString()} hs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ingreso anual necesario</span>
                    <span className="font-medium text-gray-400">${Math.round(withTaxes).toLocaleString()} USD</span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <Button
                onClick={handleSendToProposal}
                className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 gap-2"
              >
                <FileText className="h-4 w-4" />
                Armar presupuesto con esta tarifa
              </Button>

              <Button
                onClick={handleCopy}
                variant="outline"
                className="w-full rounded-xl"
              >
                {copied ? (
                  <><Check className="mr-2 h-4 w-4 text-green-500" /> Copiado</>
                ) : (
                  <><Copy className="mr-2 h-4 w-4" /> Copiar resultados</>
                )}
              </Button>

              <p className="text-center text-xs text-gray-600">
                La tarifa recomendada pondera 40% mercado + 60% sostenibilidad
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
