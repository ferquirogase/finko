"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Plus, Trash2, HelpCircle, Printer, FileDown, Palette } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export default function InvoiceTemplates() {
  // Datos del cliente y recibo
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("001")
  const [issueDate, setIssueDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [items, setItems] = useState([{ description: "", quantity: 1, price: 0 }])
  const [isExporting, setIsExporting] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")

  // Datos bancarios
  const [bankName, setBankName] = useState("")
  const [accountIdentifier, setAccountIdentifier] = useState("") // CBU/CVU/Alias
  const [accountHolder, setAccountHolder] = useState("")

  // Datos del emisor
  const [issuerName, setIssuerName] = useState("")
  const [issuerEmail, setIssuerEmail] = useState("")
  const [issuerTaxId, setIssuerTaxId] = useState("")

  // Estados para controlar qué campos mostrar
  const [showIssuerEmail, setShowIssuerEmail] = useState(true)
  const [showIssuerTaxId, setShowIssuerTaxId] = useState(true)
  const [showClientEmail, setShowClientEmail] = useState(true)
  const [showDueDate, setShowDueDate] = useState(true)
  const [showTax, setShowTax] = useState(true)

  // Estado para el color del recibo
  const [receiptColor, setReceiptColor] = useState("purple")

  const receiptRef = useRef<HTMLDivElement>(null)

  // Colores predefinidos para el recibo
  const colorOptions = [
    {
      id: "purple",
      name: "Púrpura",
      primary: "text-purple-700",
      secondary: "text-purple-600",
      border: "border-purple-100",
      bg: "bg-purple-50",
    },
    {
      id: "blue",
      name: "Azul",
      primary: "text-blue-700",
      secondary: "text-blue-600",
      border: "border-blue-100",
      bg: "bg-blue-50",
    },
    {
      id: "green",
      name: "Verde",
      primary: "text-green-700",
      secondary: "text-green-600",
      border: "border-green-100",
      bg: "bg-green-50",
    },
    {
      id: "amber",
      name: "Ámbar",
      primary: "text-amber-700",
      secondary: "text-amber-600",
      border: "border-amber-100",
      bg: "bg-amber-50",
    },
    {
      id: "red",
      name: "Rojo",
      primary: "text-red-700",
      secondary: "text-red-600",
      border: "border-red-100",
      bg: "bg-red-50",
    },
    {
      id: "gray",
      name: "Gris",
      primary: "text-gray-700",
      secondary: "text-gray-600",
      border: "border-gray-200",
      bg: "bg-gray-50",
    },
  ]

  // Obtener el objeto de color seleccionado
  const selectedColor = colorOptions.find((color) => color.id === receiptColor) || colorOptions[0]

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0 }])
  }

  const removeItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0)
  }

  const calculateTax = () => {
    return showTax ? calculateSubtotal() * 0.21 : 0 // 21% IVA solo si está activado
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  // Función actualizada para exportar a PDF
  const exportToPDF = async () => {
    if (typeof window === "undefined" || !receiptRef.current) {
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
      const element = receiptRef.current.cloneNode(true) as HTMLElement

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
      pdf.save(`recibo-${invoiceNumber || "001"}.pdf`)

      setIsExporting(false)
    } catch (error) {
      console.error("Error al exportar PDF:", error)
      setIsExporting(false)
    }
  }

  // Buscar y modificar la función printReceipt para verificar window
  const printReceipt = () => {
    if (typeof window === "undefined" || !receiptRef.current) return

    const printContent = receiptRef.current.innerHTML
    const originalContent = document.body.innerHTML

    document.body.innerHTML = printContent
    window.print()
    document.body.innerHTML = originalContent
    window.location.reload()
  }

  // Componente para el switch de visibilidad
  const VisibilitySwitch = ({
    checked,
    onChange,
    label,
  }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-gray-100 rounded-full p-0.5">
            <Switch
              id={`show-${label.toLowerCase().replace(/\s/g, "-")}`}
              checked={checked}
              onCheckedChange={onChange}
              className="h-[18px] w-[34px] data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-300"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {checked ? "Campo visible en el recibo" : "Campo oculto en el recibo"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-purple-100 p-2 text-purple-600">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Generador de Recibos</h2>
            <p className="text-sm text-gray-500">Crea recibos profesionales para tus clientes</p>
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
            {/* Nueva sección: Tus datos (emisor del recibo) */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-base font-medium text-gray-700">Tus datos (emisor)</h3>
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
                        Introduce tus datos personales como emisor del recibo. Esta información aparecerá en la parte
                        superior derecha del recibo.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium">Tu nombre o empresa</label>
                  <Input
                    placeholder="Ej: Juan Pérez o Diseños JP"
                    value={issuerName}
                    onChange={(e) => setIssuerName(e.target.value)}
                    className="mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Tu email</label>
                    <VisibilitySwitch checked={showIssuerEmail} onChange={setShowIssuerEmail} label="Email" />
                  </div>
                  <Input
                    placeholder="Ej: tu@email.com"
                    type="email"
                    value={issuerEmail}
                    onChange={(e) => setIssuerEmail(e.target.value)}
                    className={`mt-1 rounded-xl ${!showIssuerEmail ? "opacity-50" : ""}`}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">CUIT/CUIL</label>
                    <VisibilitySwitch checked={showIssuerTaxId} onChange={setShowIssuerTaxId} label="CUIT" />
                  </div>
                  <Input
                    placeholder="Ej: 20-12345678-9"
                    value={issuerTaxId}
                    onChange={(e) => setIssuerTaxId(e.target.value)}
                    className={`mt-1 rounded-xl ${!showIssuerTaxId ? "opacity-50" : ""}`}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Sección de información del cliente y detalles del recibo */}
            <div>
              <h3 className="mb-4 text-base font-medium text-gray-700">Información del cliente</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Nombre del cliente</label>
                  <Input
                    placeholder="Empresa ABC"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Email del cliente</label>
                    <VisibilitySwitch checked={showClientEmail} onChange={setShowClientEmail} label="ClientEmail" />
                  </div>
                  <Input
                    placeholder="cliente@empresa.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className={`mt-1 rounded-xl ${!showClientEmail ? "opacity-50" : ""}`}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium">Número de recibo</label>
                  <Input
                    placeholder="001"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha de emisión</label>
                  <Input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Fecha de vencimiento</label>
                    <VisibilitySwitch checked={showDueDate} onChange={setShowDueDate} label="DueDate" />
                  </div>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`mt-1 rounded-xl ${!showDueDate ? "opacity-50" : ""}`}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Sección de conceptos */}
            <div>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-medium text-gray-700">Conceptos</h3>
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
                            Añade los servicios o productos que estás cobrando. Cada concepto debe incluir una
                            descripción, cantidad y precio unitario.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1 rounded-xl text-purple-600" onClick={addItem}>
                    <Plus className="h-4 w-4" /> Añadir
                  </Button>
                </div>

                {/* Encabezados de columnas */}
                <div className="mt-3 mb-2 grid grid-cols-12 gap-2 px-2">
                  <div className="col-span-6">
                    <span className="text-xs font-medium text-gray-500">Descripción del servicio</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-xs font-medium text-gray-500">Cantidad</span>
                  </div>
                  <div className="col-span-3 text-center">
                    <span className="text-xs font-medium text-gray-500">Precio unitario ($)</span>
                  </div>
                  <div className="col-span-1"></div>
                </div>
              </div>

              {items.map((item, index) => (
                <div key={index} className="mb-2 grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    <Input
                      placeholder="Ej: Diseño de logotipo"
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 0)}
                      className="rounded-xl"
                      min="1"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={item.price}
                      onChange={(e) => updateItem(index, "price", Number.parseFloat(e.target.value) || 0)}
                      className="rounded-xl"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => removeItem(index)}
                      title="Eliminar concepto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
                  No hay conceptos añadidos. Haz clic en "Añadir" para incluir servicios o productos.
                </div>
              )}

              {items.length > 0 && (
                <div className="mt-2 flex justify-end">
                  <div className="w-64 space-y-1 rounded-xl bg-gray-50 p-3 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>IVA (21%):</span>
                        <VisibilitySwitch checked={showTax} onChange={setShowTax} label="Tax" />
                      </div>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-1 font-medium">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Sección de datos bancarios adaptada para Argentina */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-base font-medium text-gray-700">Datos para recibir el pago</h3>
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
                        Introduce tus datos bancarios o de billetera virtual para que tus clientes sepan cómo realizar
                        el pago. Puedes usar CBU (para cuentas bancarias), CVU (para billeteras virtuales) o Alias
                        (nombre simplificado de tu cuenta).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium">Banco o billetera</label>
                  <Input
                    placeholder="Ej: Mercado Pago, Banco Nación"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">N° de la cuenta</label>
                  <Input
                    placeholder="Ej: 0000000000000000000000 o mi.alias.simple"
                    value={accountIdentifier}
                    onChange={(e) => setAccountIdentifier(e.target.value)}
                    className="mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Titular de la cuenta</label>
                  <Input
                    placeholder="Ej: Juan Pérez"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="mt-1 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setActiveTab("preview")}
                className="rounded-xl bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
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
            {/* Selector de colores para el recibo */}
            <div className="mb-4 rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="h-5 w-5 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-700">Personalizar colores del recibo</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setReceiptColor(color.id)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                      receiptColor === color.id
                        ? `border-${color.id}-600 ring-2 ring-${color.id}-200`
                        : "border-gray-200"
                    }`}
                    title={color.name}
                  >
                    <div
                      className={`h-6 w-6 rounded-full`}
                      style={{
                        backgroundColor:
                          color.id === "purple"
                            ? "#8b5cf6"
                            : color.id === "blue"
                              ? "#3b82f6"
                              : color.id === "green"
                                ? "#10b981"
                                : color.id === "amber"
                                  ? "#f59e0b"
                                  : color.id === "red"
                                    ? "#ef4444"
                                    : color.id === "gray"
                                      ? "#6b7280"
                                      : "#8b5cf6",
                      }}
                    ></div>
                  </button>
                ))}
              </div>
            </div>

            <div ref={receiptRef} className={`rounded-3xl border ${selectedColor.border} bg-white p-6`}>
              {/* Datos del emisor */}
              <div className="mb-8 flex justify-between">
                <div>
                  <h1 className={`text-2xl font-bold ${selectedColor.primary}`}>
                    {issuerName || "Tu Nombre o Empresa"}
                  </h1>
                  {showIssuerEmail && <p className="text-gray-600">{issuerEmail || "tu@email.com"}</p>}
                </div>
                <div className="text-right">
                  <p className={`font-bold ${selectedColor.primary}`}>Recibo N°: {invoiceNumber || "001"}</p>
                  <p>Fecha de emisión: {issueDate || new Date().toLocaleDateString()}</p>
                  {showDueDate && <p>Fecha de vencimiento: {dueDate || "No especificada"}</p>}
                  {showIssuerTaxId && <p>CUIT/CUIL: {issuerTaxId || "20-XXXXXXXX-X"}</p>}
                </div>
              </div>

              {/* Datos del cliente */}
              <div className="mb-8">
                <h2 className={`text-xl font-semibold ${selectedColor.primary}`}>Cliente</h2>
                <p>Nombre: {clientName || "Nombre del cliente"}</p>
                {showClientEmail && <p>Email: {clientEmail || "cliente@email.com"}</p>}
              </div>

              {/* Tabla de conceptos */}
              <table className="w-full mb-8">
                <thead>
                  <tr className={selectedColor.secondary}>
                    <th className="text-left font-semibold">Descripción</th>
                    <th className="text-center font-semibold">Cantidad</th>
                    <th className="text-right font-semibold">Precio Unitario</th>
                    <th className="text-right font-semibold">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description || "Descripción del servicio"}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-right">${item.price?.toFixed(2) || "0.00"}</td>
                      <td className="text-right">${(item.quantity * item.price)?.toFixed(2) || "0.00"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totales */}
              <div className="flex justify-end">
                <div className={`w-64 ${selectedColor.bg} p-4 rounded-lg`}>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  {showTax && (
                    <div className="flex justify-between">
                      <span>IVA (21%):</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                  )}
                  <div
                    className={`flex justify-between border-t border-${selectedColor.id}-200 pt-2 font-bold ${selectedColor.primary}`}
                  >
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Datos bancarios */}
              <div className="mt-8">
                <h2 className={`text-xl font-semibold ${selectedColor.primary}`}>Datos bancarios</h2>
                <p>Banco: {bankName || "No especificado"}</p>
                <p>Cuenta: {accountIdentifier || "No especificado"}</p>
                <p>Titular: {accountHolder || "No especificado"}</p>
              </div>

              {/* Footer */}
              <div className={`mt-12 text-center ${selectedColor.secondary}`}>
                <p>Gracias por tu preferencia!</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" className="gap-2 rounded-xl" onClick={printReceipt}>
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Imprimir</span>
                <span className="sm:hidden">Imprimir</span>
              </Button>
              <Button
                className="gap-2 rounded-xl"
                style={{
                  backgroundColor:
                    receiptColor === "purple"
                      ? "#8b5cf6"
                      : receiptColor === "blue"
                        ? "#3b82f6"
                        : receiptColor === "green"
                          ? "#10b981"
                          : receiptColor === "amber"
                            ? "#f59e0b"
                            : receiptColor === "red"
                              ? "#ef4444"
                              : receiptColor === "gray"
                                ? "#6b7280"
                                : "#8b5cf6",
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
