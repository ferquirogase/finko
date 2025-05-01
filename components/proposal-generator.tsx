"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Copy, Check, HelpCircle, FileDown } from "lucide-react"
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

      // Crear el canvas a partir del elemento HTML
      const canvas = await html2canvas(proposalRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      // Crear el PDF
      const pdf = new jsPDF("p", "mm", "a4")

      // Dimensiones del PDF
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Añadir la imagen del canvas al PDF
      const imgData = canvas.toDataURL("image/png")
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      // Guardar el PDF
      pdf.save(`propuesta-${clientName || "proyecto"}.pdf`)

      setIsExporting(false)
    } catch (error) {
      console.error("Error al exportar PDF:", error)
      setIsExporting(false)
    }
  }

  return (
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

      <Tabs defaultValue="editor" className="w-full">
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
                        Escribe cada fecha o plazo en una línea nueva o precedido por un guión (-). Se mostrará como una
                        lista en la vista previa.
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
        </TabsContent>
        <TabsContent value="preview" className="mt-6">
          <div ref={proposalRef} className="rounded-3xl border border-green-100 bg-white p-6">
            <div className="mb-8 border-b border-green-100 pb-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-green-800">PROPUESTA DE PROYECTO</h3>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">Para: {clientName || "Nombre del cliente"}</p>
              <p className="text-lg font-medium text-green-700">{projectTitle || "Título del proyecto"}</p>
            </div>

            <div className="mb-6 space-y-4">
              <div>
                <h4 className="mb-2 font-bold uppercase text-green-700">Alcance del proyecto</h4>
                <p className="text-sm text-gray-700">
                  {projectScope || "Descripción detallada del proyecto y sus objetivos..."}
                </p>
              </div>

              <div>
                <h4 className="mb-2 font-bold uppercase text-green-700">Entregables</h4>
                {formatListItems(deliverables)}
              </div>

              <div>
                <h4 className="mb-2 font-bold uppercase text-green-700">Cronograma</h4>
                {formatListItems(timeline)}
              </div>

              <div>
                <h4 className="mb-2 font-bold uppercase text-green-700">Presupuesto</h4>
                {formatListItems(budget)}
              </div>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <h4 className="mb-2 font-bold uppercase text-green-700">Términos y condiciones</h4>
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
              {copied ? "¡Copiado!" : "Copiar texto"}
            </Button>
            <Button
              className="gap-2 rounded-xl bg-green-600 hover:bg-green-700"
              onClick={exportToPDF}
              disabled={isExporting}
            >
              <FileDown className="h-4 w-4" />
              {isExporting ? "Exportando..." : "Exportar PDF"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
