"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import { Check, Info, Calculator, HelpCircle, ArrowRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { HelpTooltip } from "@/components/help-tooltip"

// Añadir este objeto de categorías y subcategorías al inicio del componente, justo después de las importaciones
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

// Función para obtener todas las subcategorías en un array plano
const getAllSubcategories = () => {
  return projectCategories.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      ...subcategory,
      categoryName: category.name,
    })),
  )
}

export default function PricingCalculator() {
  // Estado para la calculadora
  const [experience, setExperience] = useState(3)
  const [projectType, setProjectType] = useState("web")
  const [region, setRegion] = useState("latam")
  const [hours, setHours] = useState(40)
  const [complexity, setComplexity] = useState(1) // 0.8 - 1.5
  const [urgency, setUrgency] = useState(1) // 1 - 1.5
  const [urgencyFee, setUrgencyFee] = useState(50) // Porcentaje de urgencia

  // Estado para el selector de proyecto con búsqueda
  const [openProjectSelector, setOpenProjectSelector] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Obtener todas las subcategorías para la búsqueda
  const allSubcategories = getAllSubcategories()

  // Obtener el nombre del proyecto seleccionado
  const getSelectedProjectName = () => {
    const subcategory = allSubcategories.find((sub) => sub.id === projectType)
    return subcategory ? subcategory.name : "Selecciona el tipo de proyecto"
  }

  // Estado para factores de sostenibilidad
  const [monthlyExpenses, setMonthlyExpenses] = useState(1000)
  const [desiredSalary, setDesiredSalary] = useState(2000)
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState(20)
  const [vacationWeeks, setVacationWeeks] = useState(4)
  const [taxRate, setTaxRate] = useState(20)
  const [profitMargin, setProfitMargin] = useState(20)
  const [includeExpenses, setIncludeExpenses] = useState(true)

  // Eliminar estos estados:

  const [copied, setCopied] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  // Por:
  const [activeTab, setActiveTab] = useState("calculator")

  useEffect(() => {
    // Asegurarse de que activeStep esté dentro de los límites válidos
    if (activeStep < 0) {
      setActiveStep(0)
    } else if (activeStep >= basicSteps.length) {
      setActiveStep(basicSteps.length - 1)
    }
  }, [activeStep])

  // Tarifas base por región (USD por hora)
  const baseRates = {
    latam: 15,
    europe: 35,
    usa: 50,
    asia: 20,
  }

  // Ahora, reemplazamos el objeto projectMultipliers existente con una función que busque el multiplicador
  const getProjectMultiplier = (projectId: string) => {
    for (const category of projectCategories) {
      for (const subcategory of category.subcategories) {
        if (subcategory.id === projectId) {
          return subcategory.multiplier
        }
      }
    }
    return 1 // Valor por defecto si no se encuentra
  }

  // Cálculo de tarifa basada en el mercado
  const calculateMarketRate = () => {
    // Tarifa base por región
    const baseRate = baseRates[region as keyof typeof baseRates]

    // Multiplicador por experiencia (0.7 a 2.0)
    const experienceMultiplier = 0.7 + (experience / 10) * 1.3

    // Luego, en la función calculateMarketRate, reemplazamos:
    // const projectMultiplier = projectMultipliers[projectType as keyof typeof projectMultipliers]
    // por:
    const projectMultiplier = getProjectMultiplier(projectType)

    // Multiplicadores adicionales
    const complexityMultiplier = 0.8 + complexity * 0.35 // 0.8 - 1.5
    const urgencyMultiplier = urgency // 1 - 1.5

    // Tarifa por hora calculada
    const hourlyRate = Math.round(
      baseRate * experienceMultiplier * projectMultiplier * complexityMultiplier * urgencyMultiplier,
    )

    // Total del proyecto
    const projectTotal = hourlyRate * hours

    return {
      hourlyRate,
      projectTotal,
      baseRate,
      experienceMultiplier,
      projectMultiplier,
      complexityMultiplier,
      urgencyMultiplier,
    }
  }

  // Cálculo de tarifa sostenible
  const calculateSustainableRate = () => {
    // Calcular gastos anuales
    const annualExpenses = includeExpenses ? monthlyExpenses * 12 : 0
    const annualSalary = desiredSalary * 12
    const annualTotal = annualExpenses + annualSalary

    // Añadir margen de beneficio
    const withProfit = annualTotal * (1 + profitMargin / 100)

    // Añadir impuestos
    const withTaxes = withProfit * (1 + taxRate / 100)

    // Calcular horas facturables al año
    const weeksPerYear = 52 - vacationWeeks
    const billableHoursPerYear = weeksPerYear * billableHoursPerWeek

    // Calcular tarifa por hora
    const hourlyRate = Math.round(withTaxes / billableHoursPerYear)

    return {
      hourlyRate,
      annualRevenue: withTaxes,
      billableHoursPerYear,
      effectiveTaxAmount: withTaxes - withProfit,
      effectiveProfitAmount: withProfit - annualTotal,
      annualExpenses,
      annualSalary,
    }
  }

  // Eliminar esta función:

  const marketRate = calculateMarketRate()
  const sustainableRate = calculateSustainableRate()

  // Calcular la tarifa recomendada (promedio ponderado entre mercado y sostenibilidad)
  const calculateRecommendedRate = () => {
    // Damos más peso a la tarifa sostenible (60%) que a la de mercado (40%)
    return Math.round(marketRate.hourlyRate * 0.4 + sustainableRate.hourlyRate * 0.6)
  }

  const recommendedRate = calculateRecommendedRate()
  const recommendedTotal = recommendedRate * hours

  const handleCopy = () => {
    const text = `Tarifa recomendada: $${recommendedRate} USD por hora
Total del proyecto: $${recommendedTotal} USD (${hours} horas)
Basado en:
- Tarifa de mercado: $${marketRate.hourlyRate} USD
- Tarifa sostenible: $${sustainableRate.hourlyRate} USD`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    // Enviar evento al dataLayer cuando se copian los resultados
    // if (typeof window !== "undefined" && window.dataLayer) {
    //   window.dataLayer.push({
    //     event: "calculator_result_copied",
    //     hourly_rate: recommendedRate,
    //     project_total: recommendedTotal,
    //     hours: hours,
    //     experience_level: experience,
    //     project_type: projectType,
    //   })
    // }
  }

  // Componente de control numérico mejorado
  const EnhancedNumericInput = ({
    value,
    onChange,
    min,
    max,
    step = 1,
    label,
    suffix,
    prefix,
    tooltip,
    className = "",
  }: {
    value: number
    onChange: (value: number) => void
    min: number
    max: number
    step?: number
    label?: string
    suffix?: string
    prefix?: string
    tooltip?: string
    className?: string
  }) => {
    // Estado interno para manejar el valor durante la edición
    const [inputValue, setInputValue] = useState(value.toString())

    // Actualizar el estado interno cuando cambia el valor externo
    useEffect(() => {
      setInputValue(value.toString())
    }, [value])

    // Manejar cambios en el input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue) // Actualizar el estado interno sin restricciones
    }

    // Cuando el input pierde el foco, actualizar el valor externo
    const handleBlur = () => {
      const numValue = inputValue === "" ? min : Number(inputValue)
      const validValue = Math.min(Math.max(numValue, min), max)
      onChange(validValue)
      setInputValue(validValue.toString()) // Sincronizar con el valor validado
    }

    // Cuando se presiona Enter, actualizar el valor externo
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const numValue = inputValue === "" ? min : Number(inputValue)
        const validValue = Math.min(Math.max(numValue, min), max)
        onChange(validValue)
        setInputValue(validValue.toString())
        e.currentTarget.blur() // Quitar el foco del input
      }
    }

    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-medium">{label}</label>
            {tooltip && <HelpTooltip content={<p>{tooltip}</p>} />}
          </div>
        )}
        <div className="relative">
          {prefix && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500">{prefix}</span>
            </div>
          )}
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`rounded-lg text-center transition-all focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 ${
              prefix ? "pl-7" : ""
            } ${suffix ? "pr-10" : ""}`}
            step={step}
          />
          {suffix && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500">{suffix}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Componente de slider personalizado desde cero

  // Pasos para la calculadora básica
  const basicSteps = [
    {
      title: "Perfil Profesional",
      description: "Información sobre tu experiencia y especialidad",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <label className="text-sm font-medium">Años de experiencia</label>
                {false && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0 text-gray-400">
                          <HelpCircle className="h-3.5 w-3.5" />
                          <span className="sr-only">Ayuda</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-xs">
                        <p>
                          Indica cuántos años de experiencia tienes en tu campo. Esto afecta directamente a tu tarifa
                          recomendada.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <span className="text-sm font-medium">{experience}</span>
            </div>
            <Slider
              value={[experience]}
              onValueChange={(values) => setExperience(values[0])}
              min={0}
              max={10}
              step={1}
            />
            <div className="flex justify-between px-1 text-xs text-gray-500">
              <span>Principiante</span>
              <span>Intermedio</span>
              <span>Experto</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <label className="text-sm font-medium">Tipo de proyecto</label>
              <HelpTooltip
                content={
                  <p>
                    Cada tipo de proyecto tiene un multiplicador diferente basado en la complejidad y demanda del
                    mercado.
                  </p>
                }
              />
            </div>

            <div className="relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar o seleccionar tipo de proyecto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-lg pr-10"
                  onFocus={() => setOpenProjectSelector(true)}
                  onClick={() => setOpenProjectSelector(true)}
                />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              {openProjectSelector && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                  {projectCategories.map((category) => {
                    // Filtrar subcategorías que coincidan con la búsqueda
                    const filteredSubcategories = category.subcategories.filter(
                      (subcategory) =>
                        searchTerm === "" ||
                        subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
                    )

                    // Solo mostrar categorías que tengan subcategorías que coincidan con la búsqueda
                    if (filteredSubcategories.length === 0) return null

                    return (
                      <div key={category.id}>
                        <div className="sticky top-0 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                          {category.name}
                        </div>
                        {filteredSubcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            type="button"
                            className={`flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-brand-50 ${
                              projectType === subcategory.id ? "bg-brand-50 font-medium text-brand-600" : ""
                            }`}
                            onClick={() => {
                              setProjectType(subcategory.id)
                              setSearchTerm(subcategory.name)
                              setOpenProjectSelector(false)
                            }}
                          >
                            <div className="flex items-center">
                              {projectType === subcategory.id && <Check className="mr-2 h-4 w-4 text-brand-600" />}
                              <span>{subcategory.name}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 mr-1">Multiplicador:</span>
                              <span className="flex items-center">
                                <span className="font-medium text-brand-600">{subcategory.multiplier.toFixed(2)}x</span>
                                <HelpTooltip
                                  content={
                                    <p>
                                      Este multiplicador afecta el cálculo de tu tarifa base según el tipo de proyecto.
                                      Un valor mayor indica un tipo de proyecto que generalmente se cobra a una tarifa
                                      más alta en el mercado.
                                    </p>
                                  }
                                  className="ml-1"
                                />
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )
                  })}
                  {!projectCategories.some((category) =>
                    category.subcategories.some(
                      (subcategory) =>
                        searchTerm === "" ||
                        subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
                    ),
                  ) && <div className="px-3 py-2 text-center text-sm text-gray-500">No se encontraron resultados.</div>}
                </div>
              )}
            </div>

            <div className="mt-1 flex items-center text-xs text-gray-500">
              {projectType ? (
                <>
                  <span>Multiplicador seleccionado: </span>
                  <span className="flex items-center ml-1">
                    <span className="font-medium text-brand-600">{getProjectMultiplier(projectType).toFixed(2)}x</span>
                    <HelpTooltip
                      content={
                        <p>
                          Este multiplicador afecta el cálculo de tu tarifa base según el tipo de proyecto seleccionado.
                          Se aplica como un porcentaje sobre la tarifa base para reflejar el valor de mercado de este
                          tipo de trabajo.
                        </p>
                      }
                      className="ml-1"
                    />
                  </span>
                </>
              ) : (
                "Selecciona un tipo de proyecto para ver su multiplicador"
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <label className="text-sm font-medium">Región</label>
              <HelpTooltip
                content={
                  <p>
                    Las tarifas varían significativamente según la región. Selecciona la región donde ofreces tus
                    servicios.
                  </p>
                }
              />
            </div>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Selecciona tu región" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="latam">Latinoamérica</SelectItem>
                  <SelectItem value="europe">Europa</SelectItem>
                  <SelectItem value="usa">Estados Unidos</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="mt-1 text-xs text-gray-500">
              Tarifa base para esta región: ${baseRates[region as keyof typeof baseRates]} USD/hora
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Detalles del Proyecto",
      description: "Información sobre el proyecto actual",
      content: (
        <div className="space-y-6">
          <EnhancedNumericInput
            label="Horas estimadas"
            value={hours}
            onChange={setHours}
            min={1}
            max={500}
            step={1}
            tooltip="Número total de horas que estimas que te llevará completar el proyecto."
          />

          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <label className="text-sm font-medium">Complejidad</label>
              <HelpTooltip
                content={
                  <p>
                    La complejidad técnica del proyecto afecta directamente a tu tarifa. Proyectos más complejos
                    justifican tarifas más altas.
                  </p>
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 0, label: "Baja", desc: "Simple" },
                { value: 1, label: "Media", desc: "Estándar" },
                { value: 2, label: "Alta", desc: "Avanzado" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setComplexity(option.value)}
                  className={`flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 transition-all hover:bg-gray-50 ${
                    complexity === option.value
                      ? "border-brand-500 bg-brand-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-base font-medium">{option.label}</span>
                  <span className="text-xs text-gray-500">{option.desc}</span>
                  <span className="mt-2 text-xs font-medium text-brand-600">
                    {Math.round((0.8 + option.value * 0.35) * 100)}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <label className="text-sm font-medium">Urgencia</label>
              <HelpTooltip
                content={
                  <p>
                    Proyectos con plazos ajustados o que requieren trabajo en horarios no habituales justifican una
                    tarifa de urgencia.
                  </p>
                }
              />
            </div>
            <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-urgency"
                    checked={urgency > 1}
                    onCheckedChange={(checked) => setUrgency(checked ? 1 + urgencyFee / 100 : 1)}
                  />
                  <Label htmlFor="include-urgency" className="font-medium">
                    Aplicar tarifa de urgencia
                  </Label>
                </div>
                <Badge variant="outline" className="bg-white">
                  +{urgencyFee}%
                </Badge>
              </div>

              {urgency > 1 && (
                <div className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <label className="text-sm font-medium">Tarifa de urgencia</label>
                        {false && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0 text-gray-400">
                                  <HelpCircle className="h-3.5 w-3.5" />
                                  <span className="sr-only">Ayuda</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs text-xs">
                                <p></p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <span className="text-sm font-medium">{urgencyFee}%</span>
                    </div>
                    <Slider
                      value={[urgencyFee]}
                      onValueChange={(values) => {
                        setUrgencyFee(values[0])
                        setUrgency(1 + values[0] / 100)
                      }}
                      min={5}
                      max={100}
                      step={5}
                    />
                    <div className="flex justify-between px-1 text-xs text-gray-500">
                      <span>5%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Factores de Sostenibilidad",
      description: "Información para calcular una tarifa sostenible a largo plazo",
      content: (
        <div className="space-y-6">
          <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-medium text-brand-800">Gastos mensuales</h3>
                <HelpTooltip
                  content={
                    <p>
                      Incluye todos tus gastos mensuales relacionados con tu negocio: software, hardware, oficina,
                      servicios, etc.
                    </p>
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="include-expenses" checked={includeExpenses} onCheckedChange={setIncludeExpenses} />
                <Label htmlFor="include-expenses" className="text-sm text-brand-800">
                  Incluir en cálculo
                </Label>
              </div>
            </div>

            <EnhancedNumericInput
              value={monthlyExpenses}
              onChange={setMonthlyExpenses}
              min={0}
              max={10000}
              step={100}
              prefix="$"
              suffix="USD"
              className={includeExpenses ? "" : "opacity-50"}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <EnhancedNumericInput
              label="Salario mensual deseado"
              value={desiredSalary}
              onChange={setDesiredSalary}
              min={0}
              max={20000}
              step={100}
              prefix="$"
              suffix="USD"
              tooltip="El salario mensual que deseas obtener después de cubrir todos tus gastos."
            />

            <EnhancedNumericInput
              label="Horas facturables por semana"
              value={billableHoursPerWeek}
              onChange={setBillableHoursPerWeek}
              min={5}
              max={40}
              step={1}
              suffix="horas"
              tooltip="Horas que realmente puedes facturar cada semana. Considera que no todo tu tiempo es facturable."
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm font-medium">Semanas de vacaciones</label>
                  {false && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0 text-gray-400">
                            <HelpCircle className="h-3.5 w-3.5" />
                            <span className="sr-only">Ayuda</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-xs">
                          <p>Número de semanas al año que planeas tomar como vacaciones (sin ingresos).</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <span className="text-sm font-medium">{vacationWeeks} semanas</span>
              </div>
              <Slider
                value={[vacationWeeks]}
                onValueChange={(values) => setVacationWeeks(values[0])}
                min={0}
                max={8}
                step={1}
              />
              <div className="flex justify-between px-1 text-xs text-gray-500">
                <span>0</span>
                <span>4</span>
                <span>8</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm font-medium">Tasa de impuestos</label>
                  {false && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0 text-gray-400">
                            <HelpCircle className="h-3.5 w-3.5" />
                            <span className="sr-only">Ayuda</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-xs">
                          <p>Porcentaje aproximado que pagas en impuestos sobre tus ingresos.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <span className="text-sm font-medium">{taxRate}%</span>
              </div>
              <Slider value={[taxRate]} onValueChange={(values) => setTaxRate(values[0])} min={0} max={50} step={5} />
              <div className="flex justify-between px-1 text-xs text-gray-500">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm font-medium">Margen de beneficio</label>
                  {false && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0 text-gray-400">
                            <HelpCircle className="h-3.5 w-3.5" />
                            <span className="sr-only">Ayuda</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-xs">
                          <p>Margen adicional para crecimiento, inversiones y contingencias.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <span className="text-sm font-medium">{profitMargin}%</span>
              </div>
              <Slider
                value={[profitMargin]}
                onValueChange={(values) => setProfitMargin(values[0])}
                min={0}
                max={50}
                step={5}
              />
              <div className="flex justify-between px-1 text-xs text-gray-500">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Resultados",
      description: "Tu tarifa recomendada basada en todos los factores",
      content: (
        <div className="space-y-4 rounded-3xl bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-brand-100">Tarifa recomendada por hora</h3>
              <div className="my-2 flex items-baseline">
                <span className="text-xl font-medium">$</span>
                <span className="text-5xl font-bold">{recommendedRate}</span>
                <span className="ml-1 text-xl font-medium">USD</span>
              </div>
              <p className="text-xs text-brand-200">Basado en factores de mercado y sostenibilidad</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-brand-100">Total del proyecto</h3>
              <div className="my-2 flex items-baseline">
                <span className="text-xl font-medium">$</span>
                <span className="text-5xl font-bold">{recommendedTotal.toLocaleString()}</span>
                <span className="ml-1 text-xl font-medium">USD</span>
              </div>
              <p className="text-xs text-brand-200">Basado en {hours} horas totales</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-white/10 p-4 text-sm backdrop-blur-sm">
              <h4 className="mb-2 font-medium text-brand-100">Factores de mercado</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tarifa base:</span>
                  <span>${marketRate.baseRate} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Experiencia:</span>
                  <span>{Math.round(marketRate.experienceMultiplier * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tipo de proyecto:</span>
                  <span>{Math.round(marketRate.projectMultiplier * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Complejidad:</span>
                  <span>{Math.round(marketRate.complexityMultiplier * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Urgencia:</span>
                  <span>{Math.round(marketRate.urgencyMultiplier * 100)}%</span>
                </div>
                <div className="flex justify-between border-t border-white/20 pt-1 font-medium">
                  <span>Tarifa de mercado:</span>
                  <span>${marketRate.hourlyRate} USD/hora</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white/10 p-4 text-sm backdrop-blur-sm">
              <h4 className="mb-2 font-medium text-brand-100">Factores de sostenibilidad</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gastos anuales:</span>
                  <span>${sustainableRate.annualExpenses.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Salario anual:</span>
                  <span>${sustainableRate.annualSalary.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Margen de beneficio:</span>
                  <span>{profitMargin}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos:</span>
                  <span>{taxRate}%</span>
                </div>
                <div className="flex justify-between border-t border-white/20 pt-1 font-medium">
                  <span>Tarifa sostenible:</span>
                  <span>${sustainableRate.hourlyRate} USD/hora</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/10 p-4 text-sm backdrop-blur-sm">
            <h4 className="mb-2 font-medium text-brand-100">Recomendaciones para establecer tarifas</h4>
            <ul className="list-inside list-disc space-y-1">
              <li>Comunica claramente el valor que aportas, no solo el tiempo que dedicas</li>
              <li>Considera diferentes estructuras de precios según el tipo de cliente</li>
              <li>Revisa y ajusta tus tarifas periódicamente (cada 6-12 meses)</li>
              <li>Incluye cláusulas de cambio de alcance en tus contratos</li>
              <li>No tengas miedo de negociar: las tarifas bajas pueden transmitir baja calidad</li>
            </ul>
          </div>
        </div>
      ),
    },
  ]

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const searchInput = document.querySelector('input[placeholder="Buscar o seleccionar tipo de proyecto..."]')
      const dropdown = document.querySelector(".absolute.z-50.mt-1")

      // Solo cerrar si el clic no fue en el input ni en el dropdown
      if (
        searchInput &&
        dropdown &&
        !searchInput.contains(target) &&
        !dropdown.contains(target) &&
        openProjectSelector
      ) {
        setOpenProjectSelector(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openProjectSelector])

  return (
    <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-brand-100 p-2 text-brand-600">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Calculadora de Tarifas</h2>
          <p className="text-sm text-gray-500">Calcula cuánto deberías cobrar por tus servicios</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 rounded-xl bg-brand-50 p-3 text-brand-800">
          <Info className="h-5 w-5 flex-shrink-0" />
          <p className="text-xs">
            Esta calculadora combina factores de mercado y sostenibilidad para ayudarte a establecer una tarifa justa
            que cubra tus necesidades y sea competitiva.
          </p>
        </div>

        {/* Pasos de la calculadora */}
        <div className="mb-4 flex flex-wrap gap-2">
          {basicSteps.map((step, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-all ${
                activeStep === index
                  ? "bg-brand-100 text-brand-800 font-medium"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-medium">
                {index + 1}
              </span>
              <span>{step.title}</span>
            </button>
          ))}
        </div>

        <Card className="border-brand-100">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                {basicSteps[activeStep] ? basicSteps[activeStep].title : "Cargando..."}
              </h3>
              <p className="text-sm text-gray-500">
                {basicSteps[activeStep] ? basicSteps[activeStep].description : ""}
              </p>
            </div>

            {basicSteps[activeStep] && basicSteps[activeStep].content}

            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className="rounded-xl"
              >
                Anterior
              </Button>
              {activeStep === basicSteps.length - 1 ? (
                <Button onClick={handleCopy} className="rounded-xl bg-brand-600 hover:bg-brand-700">
                  {copied ? <Check className="mr-2 h-4 w-4" /> : null}
                  {copied ? "¡Copiado!" : "Copiar resultados"}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setActiveStep(Math.min(basicSteps.length - 1, activeStep + 1))

                    // Enviar evento al dataLayer cuando se avanza al siguiente paso
                    // if (typeof window !== "undefined" && window.dataLayer) {
                    //   window.dataLayer.push({
                    //     event: "calculator_step_completed",
                    //     step_number: activeStep + 1,
                    //     step_name: basicSteps[activeStep].title,
                    //   })
                    // }
                  }}
                  className="rounded-xl bg-brand-600 hover:bg-brand-700"
                >
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
