"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Plus, Trash2, FileDown, HelpCircle, Printer } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

export default function InvoiceTemplates() {
  // Datos del cliente y recibo
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("001")
  const [issueDate, setIssueDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [items, setItems] = useState([{ description: "", quantity: 1, price: 0 }])
  const [isExporting, setIsExporting] = useState(false)

  // Datos bancarios
  const [bankName, setBankName] = useState("")
  const [accountIdentifier, setAccountIdentifier] = useState("") // CBU/CVU/Alias
  const [accountHolder, setAccountHolder] = useState("")

  // Datos del emisor
  const [issuerName, setIssuerName] = useState("")
  const [issuerEmail, setIssuerEmail] = useState("")
  const [issuerTaxId, setIssuerTaxId] = useState("")

  const receiptRef = useRef<HTMLDivElement>(null)

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
    return calculateSubtotal() * 0.21 // 21% IVA
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const exportToPDF = async () => {
    if (!receiptRef.current) {
      console.error("No se puede exportar: falta el elemento de referencia")
      return
    }

    setIsExporting(true)

    try {
      // Importar las bibliotecas necesarias
      const [jsPDFModule, html2canvasModule] = await Promise.all([import("jspdf"), import("html2canvas")])

      const jsPDF = jsPDFModule.default
      const html2canvas = html2canvasModule.default

      // Crear el canvas a partir del elemento HTML
      const canvas = await html2canvas(receiptRef.current, {
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
      pdf.save(`recibo-${invoiceNumber || "001"}.pdf`)

      // Enviar evento al dataLayer cuando se exporta un recibo a PDF
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "invoice_exported",
          invoice_number: invoiceNumber || "001",
          client_name: clientName || "sin_nombre",
          invoice_amount: calculateTotal().toFixed(2),
        })
      }

      setIsExporting(false)
    } catch (error) {
      console.error("Error al exportar PDF:", error)
      setIsExporting(false)
    }
  }

  const printReceipt = () => {
    if (!receiptRef.current) return

    const printContent = receiptRef.current.innerHTML
    const originalContent = document.body.innerHTML

    // Enviar evento al dataLayer cuando se imprime un recibo
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "invoice_printed",
        invoice_number: invoiceNumber || "001",
        client_name: clientName || "sin_nombre",
        invoice_amount: calculateTotal().toFixed(2),
      })
    }

    document.body.innerHTML = printContent
    window.print()
    document.body.innerHTML = originalContent
    window.location.reload()
  }

  return (
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
                <label className="text-sm font-medium">Tu email</label>
                <Input
                  placeholder="Ej: tu@email.com"
                  type="email"
                  value={issuerEmail}
                  onChange={(e) => setIssuerEmail(e.target.value)}
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium">CUIT/CUIL</label>
                <Input
                  placeholder="Ej: 20-12345678-9"
                  value={issuerTaxId}
                  onChange={(e) => setIssuerTaxId(e.target.value)}
                  className="mt-1 rounded-xl"
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
                <label className="text-sm font-medium">Email del cliente</label>
                <Input
                  placeholder="cliente@empresa.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="mt-1 rounded-xl"
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
                <label className="text-sm font-medium">Fecha de vencimiento</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 rounded-xl"
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
                  <div className="flex justify-between">
                    <span>IVA (21%):</span>
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
                      Introduce tus datos bancarios o de billetera virtual para que tus clientes sepan cómo realizar el
                      pago. Puedes usar CBU (para cuentas bancarias), CVU (para billeteras virtuales) o Alias (nombre
                      simplificado de tu cuenta).
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
                <label className="text-sm font-medium">CBU/CVU/Alias</label>
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
        </TabsContent>
        <TabsContent value="preview" className="mt-6">
          <div ref={receiptRef} className="rounded-3xl border border-purple-100 bg-white p-6">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-purple-900">RECIBO</h3>
                <p className="text-sm text-gray-500">Nº {invoiceNumber || "001"}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-800">{issuerName || "Tu Nombre"}</p>
                <p className="text-sm text-gray-500">{issuerEmail || "tu@email.com"}</p>
                <p className="text-sm text-gray-500">CUIT/CUIL: {issuerTaxId || "XX-XXXXXXXX-X"}</p>
              </div>
            </div>

            <div className="mb-8 grid gap-8 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-bold uppercase text-purple-800">Cliente</h4>
                <p className="font-medium">{clientName || "Nombre del cliente"}</p>
                <p className="text-sm text-gray-500">{clientEmail || "Email del cliente"}</p>
              </div>
              <div className="text-right">
                <h4 className="mb-2 font-bold uppercase text-purple-800">Detalles</h4>
                <p className="text-sm">
                  <span className="font-medium">Fecha de emisión:</span> {issueDate || "DD/MM/AAAA"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Fecha de vencimiento:</span> {dueDate || "DD/MM/AAAA"}
                </p>
              </div>
            </div>

            <div className="mb-8 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-purple-200 text-left">
                    <th className="pb-2 text-sm font-bold uppercase text-purple-800">Descripción</th>
                    <th className="pb-2 text-right text-sm font-bold uppercase text-purple-800">Cantidad</th>
                    <th className="pb-2 text-right text-sm font-bold uppercase text-purple-800">Precio</th>
                    <th className="pb-2 text-right text-sm font-bold uppercase text-purple-800">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b border-purple-100">
                      <td className="py-3 text-sm">{item.description || "Descripción del servicio"}</td>
                      <td className="py-3 text-right text-sm">{item.quantity}</td>
                      <td className="py-3 text-right text-sm">${item.price.toFixed(2)}</td>
                      <td className="py-3 text-right text-sm">${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-8 flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between border-b border-purple-100 py-1 text-sm">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-purple-100 py-1 text-sm">
                  <span>IVA (21%):</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-lg font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-purple-50 p-4 text-sm">
              <h4 className="mb-2 font-bold uppercase text-purple-800">Instrucciones de pago</h4>
              <p className="mb-2">Por favor, realiza el pago a la siguiente cuenta:</p>
              <p>
                <span className="font-medium">Banco/Billetera:</span> {bankName || "Nombre del Banco/Billetera"}
              </p>
              <p>
                <span className="font-medium">CBU/CVU/Alias:</span>{" "}
                {accountIdentifier || "0000000000000000000000 o alias.ejemplo"}
              </p>
              <p>
                <span className="font-medium">Titular:</span> {accountHolder || "Tu Nombre"}
              </p>
              <p className="mt-2">
                <span className="font-medium">Referencia:</span> Recibo #{invoiceNumber || "001"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" className="gap-2 rounded-xl" onClick={printReceipt}>
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button
              className="gap-2 rounded-xl bg-purple-600 hover:bg-purple-700"
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
