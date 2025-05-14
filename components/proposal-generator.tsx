"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Copy, Check, HelpCircle, FileDown, Palette } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ProposalGenerator() {
  const [clientName, setClientName] = useState("")
  const [projectTitle, setProjectTitle] = useState("")
  const [projectScope, setProjectScope] = useState("")
  const [deliverables, setDeliverables] = useState("")
  const [timeline, setTimeline] = useState("")
  const [budget, setBudget] = useState("")
  const [copied, setCopied] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const [proposalColor, setProposalColor] = useState("green")

  // Colores predefinidos para el presupuesto
  const colorOptions = [
    {
      id: "green",
      name: "Verde",
      primary: "text-green-800",
      secondary: "text-green-700",
      border: "border-green-100",
      bg: "bg-green-50",
    },
    {
      id: "blue",
      name: "Azul",
      primary: "text-blue-800",
      secondary: "text-blue-700",
      border: "border-blue-100",
      bg: "bg-blue-50",
    },
    {
      id: "purple",
      name: "Púrpura",
      primary: "text-purple-800",
      secondary: "text-purple-700",
      border: "border-purple-100",
      bg: "bg-purple-50",
    },
    {
      id: "amber",
      name: "Ámbar",
      primary: "text-amber-800",
      secondary: "text-amber-700",
      border: "border-amber-100",
      bg: "bg-amber-50",
    },
    {
      id: "red",
      name: "Rojo",
      primary: "text-red-800",
      secondary: "text-red-700",
      border: "border-red-100",
      bg: "bg-red-50",
    },
    {
      id: "gray",
      name: "Gris",
      primary: "text-gray-800",
      secondary: "text-gray-700",
      border: "border-gray-200",
      bg: "bg-gray-50",
    },
  ]

  // Obtener el objeto de color seleccionado
  const selectedColor = colorOptions.find((color) => color.id === proposalColor) || colorOptions[0]

  const proposalRef = useRef<HTMLDivElement>(null)

  // Función para convertir texto con guiones o líneas nuevas en elementos de lista HTML
  const formatListItems = (text: string) => {
    if (!text) return <p className="text-sm text-gray-500">No se ha especificado información.</p>

    // Dividir por líneas nuevas
    const lines = text.split("\n").filter((line) => line.trim() !== "")

    // Si no hay líneas, devolver el texto original
    if (lines.length <= 1 && !text.includes("-")) {
      return <p className="text-sm text-gray-700">{text}</p>
    }

    // Procesar cada línea para ver si tiene guiones
    const listItems = lines.map((line, index) => {
      // Si la línea comienza con un guión, quitarlo para el elemento de lista
      if (line.trim().startsWith("-")) {
        return (
          <li key={index} className="text-sm text-gray-700">
            {line.trim().substring(1).trim()}
          </li>
        )
      }
      // Si no tiene guión pero es una línea separada, tratarla como elemento de lista
      return (
        <li key={index} className="text-sm text-gray-700">
          {line.trim()}
        </li>
      )
    })

    return <ul className="list-disc pl-5 space-y-1">{listItems}</ul>
  }

  // Buscar y modificar la función handleCopy para verificar window
  const handleCopy = () => {
    if (typeof window === "undefined") return

    const proposalText = `
PROPUESTA DE PROYECTO

Para: ${clientName}
Proyecto: ${projectTitle}

ALCANCE DEL PROYECTO
${projectScope}

ENTREGABLES
${deliverables}

CRONOGRAMA
${timeline}

PRESUPUESTO
${budget}

TÉRMINOS Y CONDICIONES
- 50% de pago inicial para comenzar el proyecto
- 50% al finalizar y entregar el proyecto
- Incluye 2 rondas de revisiones
- Cambios adicionales se facturarán por hora
    `

    navigator.clipboard.writeText(proposalText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Buscar y modificar la función exportToPDF para verificar window
  const exportToPDF = async () => {
    if (typeof window === "undefined" || !proposalRef.current) {
      console.error("No se puede exportar: falta el elemento de referencia o estamos en el servidor")
      return
    }

    setIsExporting(true)

    try {
      // Importar las bibliotecas necesarias
      const [jsPDFModule, html2canvasModule] = await Promise.all([import("jspdf"), import("html2canvas")])

      const jsPDF = jsPDFModule.default
      const html2canvas = html2canvasModule.default

      // Crear una copia del elemento para manipularlo sin afectar la UI
      const element = proposalRef.current.cloneNode(true) as HTMLElement

      // Aplicar estilos específicos para la exportación
      element.style.width = "210mm" // Ancho A4
      element.style.padding = "20mm 15mm" // Márgenes
      element.style.backgroundColor = "white"
      element.style.position = "absolute"
      element.style.left = "-9999px"
      document.body.appendChild(element)

      // Crear el canvas a partir del elemento HTML con escala fija
      const canvas = await html2canvas(element, {
        scale: 2, // Escala fija para mejor calidad
        useCORS: true,
        logging: false,
        windowWidth: 1200, // Ancho fijo para renderizado consistente
      })

      // Eliminar el elemento temporal
      document.body.removeChild(element)

      // Crear el PDF en formato A4
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Dimensiones del PDF A4 en mm
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm

      // Calcular la altura proporcional de la imagen
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Añadir la imagen del canvas al PDF
      const imgData = canvas.toDataURL("image/png")
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      // Si el contenido es más largo que una página, añadir páginas adicionales
      if (imgHeight > pageHeight) {
        let remainingHeight = imgHeight
        let position = -pageHeight
        let pageCount = 1

        while (remainingHeight > pageHeight) {
          pageCount++
          position -= pageHeight
          remainingHeight -= pageHeight
          pdf.addPage()
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)

          // Añadir marca de agua en cada página adicional
          pdf.setTextColor(150, 150, 150) // Color gris claro
          pdf.setFontSize(8)
          pdf.text("Hecho con finkoapp.online", imgWidth / 2, pageHeight - 5, { align: "center" })
        }
      }

      // Añadir marca de agua en la primera página
      pdf.setTextColor(150, 150, 150) // Color gris claro
      pdf.setFontSize(8)
      pdf.text("Hecho con finkoapp.online", imgWidth / 2, pageHeight - 5, { align: "center" })

      // Guardar el PDF
      pdf.save(`propuesta-${clientName || "proyecto"}.pdf`)

      setIsExporting(false)
    } catch (error) {
      console.error("Error al exportar PDF:", error)
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-green-100 p-2 text-green-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Generador de Presupuestos</h2>
            <p className="text-sm text-gray-500">Crea propuestas profesionales para tus clientes</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl">
            <TabsTrigger value="editor" className="rounded-l-xl">
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="rounded-r-xl">
              Vista previa
            </TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Nombre del cliente</label>
                <Input
                  placeholder="Ej: Empresa ABC, Juan Pérez"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="mt-1 rounded-xl"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Nombre de la empresa o persona a quien diriges el presupuesto
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Título del proyecto</label>
                <Input
                  placeholder="Ej: Diseño de sitio web para e-commerce"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="mt-1 rounded-xl"
                />
                <p className="mt-1 text-xs text-gray-500">Nombre descriptivo y conciso del proyecto</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Alcance del proyecto</label>
              <Textarea
                placeholder="Ej: Diseño y desarrollo de un sitio web responsive con 5 páginas principales (inicio, nosotros, servicios, portfolio y contacto). Incluye optimización SEO básica y formulario de contacto funcional."
                className="mt-1 min-h-[100px] rounded-xl"
                value={projectScope}
                onChange={(e) => setProjectScope(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Describe en detalle qué incluye el proyecto y qué no. Sé específico sobre los límites del trabajo.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Entregables (lista de elementos a entregar)</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0 text-gray-400">
                        <HelpCircle className="h-4 w-4" />
                        <span className="sr-only">Ayuda</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        Escribe cada entregable en una línea nueva o precedido por un guión (-). Se mostrará como una
                        lista en la vista previa.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                placeholder="Escribe cada elemento en una línea nueva o con guiones:

- Archivos de diseño en formato PSD y XD
- Sitio web responsive completamente funcional
- Manual de usuario básico
- 1 hora de capacitación por videollamada"
                className="mt-1 min-h-[150px] rounded-xl font-mono text-sm"
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Lista específica de todos los productos o servicios que entregarás al cliente.
                <span className="font-medium"> Escribe cada elemento en una línea nueva o con guiones.</span>
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Cronograma (fechas y plazos)</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0 text-gray-400">
                          <HelpCircle className="h-4 w-4" />
                          <span className="sr-only">Ayuda</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          Escribe cada fecha o plazo en una línea nueva o precedido por un guión (-). Se mostrará como
                          una lista en la vista previa.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  placeholder="Escribe cada fecha en una línea nueva o con guiones:

- Inicio del proyecto: 15 de mayo, 2023
- Entrega de diseños iniciales: 30 de mayo
- Primera revisión: 5 de junio
- Entrega final: 20 de junio"
                  className="mt-1 min-h-[150px] rounded-xl font-mono text-sm"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Define fechas clave y plazos de entrega.
                  <span className="font-medium"> Escribe cada fecha en una línea nueva o con guiones.</span>
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Presupuesto (costos y condiciones de pago)</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0 text-gray-400">
                          <HelpCircle className="h-4 w-4" />
                          <span className="sr-only">Ayuda</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          Escribe cada concepto o condición en una línea nueva o precedido por un guión (-). Se mostrará
                          como una lista en la vista previa.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  placeholder="Escribe cada concepto en una línea nueva o con guiones:

- Costo total: $2,500 USD
- 50% de anticipo: $1,250 USD
- 50% al finalizar: $1,250 USD
- Métodos de pago aceptados: Transferencia bancaria, PayPal"
                  className="mt-1 min-h-[150px] rounded-xl font-mono text-sm"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Detalla los costos y estructura de pagos.
                  <span className="font-medium"> Escribe cada concepto en una línea nueva o con guiones.</span>
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setActiveTab("preview")}
                className="rounded-xl bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                Ir a vista previa
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="preview" className="mt-6">
            {/* Selector de colores para el presupuesto */}
            <div className="mb-4 rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="h-5 w-5 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-700">Personalizar colores del presupuesto</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setProposalColor(color.id)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                      proposalColor === color.id
                        ? `border-${color.id}-600 ring-2 ring-${color.id}-200`
                        : "border-gray-200"
                    }`}
                    title={color.name}
                  >
                    <div
                      className={`h-6 w-6 rounded-full`}
                      style={{
                        backgroundColor:
                          color.id === "green"
                            ? "#10b981"
                            : color.id === "blue"
                              ? "#3b82f6"
                              : color.id === "purple"
                                ? "#8b5cf6"
                                : color.id === "amber"
                                  ? "#f59e0b"
                                  : color.id === "red"
                                    ? "#ef4444"
                                    : color.id === "gray"
                                      ? "#6b7280"
                                      : "#10b981",
                      }}
                    ></div>
                  </button>
                ))}
              </div>
            </div>
            <div ref={proposalRef} className={`rounded-3xl border ${selectedColor.border} bg-white p-6`}>
              <div className={`mb-8 border-b ${selectedColor.border} pb-4`}>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className={`text-2xl font-bold ${selectedColor.primary}`}>PROPUESTA DE PROYECTO</h3>
                  <FileText className={`h-8 w-8 ${selectedColor.secondary}`} />
                </div>
                <p className="text-sm text-gray-500">Para: {clientName || "Nombre del cliente"}</p>
                <p className={`text-lg font-medium ${selectedColor.secondary}`}>
                  {projectTitle || "Título del proyecto"}
                </p>
              </div>

              <div className="mb-6 space-y-4">
                <div>
                  <h4 className={`mb-2 font-bold uppercase ${selectedColor.secondary}`}>Alcance del proyecto</h4>
                  <p className="text-sm text-gray-700">
                    {projectScope || "Descripción detallada del proyecto y sus objetivos..."}
                  </p>
                </div>

                <div>
                  <h4 className={`mb-2 font-bold uppercase ${selectedColor.secondary}`}>Entregables</h4>
                  {formatListItems(deliverables)}
                </div>

                <div>
                  <h4 className={`mb-2 font-bold uppercase ${selectedColor.secondary}`}>Cronograma</h4>
                  {formatListItems(timeline)}
                </div>

                <div>
                  <h4 className={`mb-2 font-bold uppercase ${selectedColor.secondary}`}>Presupuesto</h4>
                  {formatListItems(budget)}
                </div>
              </div>

              <div className={`rounded-xl ${selectedColor.bg} p-4`}>
                <h4 className={`mb-2 font-bold uppercase ${selectedColor.secondary}`}>Términos y condiciones</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li>50% de pago inicial para comenzar el proyecto</li>
                  <li>50% al finalizar y entregar el proyecto</li>
                  <li>Incluye 2 rondas de revisiones</li>
                  <li>Cambios adicionales se facturarán por hora</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" className="gap-2 rounded-xl" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "¡Copiado!" : "Copiar texto"}</span>
              </Button>
              <Button
                className="gap-2 rounded-xl"
                style={{
                  backgroundColor:
                    proposalColor === "green"
                      ? "#10b981"
                      : proposalColor === "blue"
                        ? "#3b82f6"
                        : proposalColor === "purple"
                          ? "#8b5cf6"
                          : proposalColor === "amber"
                            ? "#f59e0b"
                            : proposalColor === "red"
                              ? "#ef4444"
                              : proposalColor === "gray"
                                ? "#6b7280"
                                : "#10b981",
                  color: "white",
                }}
                onClick={exportToPDF}
                disabled={isExporting}
              >
                <FileDown className="h-4 w-4" />
                <span>{isExporting ? "Exportando..." : "Exportar PDF"}</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
