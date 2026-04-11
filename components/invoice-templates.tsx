"use client"

import { useState, useRef, useEffect } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CreditCard,
  Plus,
  Trash2,
  FileDown,
  Palette,
  Eye,
  ImagePlus,
  X,
} from "lucide-react"

// ── Colores ────────────────────────────────────────────────────────────────
const colorOptions = [
  { id: "purple", name: "Púrpura", primary: "text-purple-700", secondary: "text-purple-600", border: "border-purple-100", bg: "bg-purple-50", hex: "#8b5cf6" },
  { id: "blue",   name: "Azul",    primary: "text-blue-700",   secondary: "text-blue-600",   border: "border-blue-100",   bg: "bg-blue-50",   hex: "#3b82f6" },
  { id: "green",  name: "Verde",   primary: "text-green-700",  secondary: "text-green-600",  border: "border-green-100",  bg: "bg-green-50",  hex: "#10b981" },
  { id: "amber",  name: "Ámbar",   primary: "text-amber-700",  secondary: "text-amber-600",  border: "border-amber-100",  bg: "bg-amber-50",  hex: "#f59e0b" },
  { id: "red",    name: "Rojo",    primary: "text-red-700",    secondary: "text-red-600",    border: "border-red-100",    bg: "bg-red-50",    hex: "#ef4444" },
  { id: "gray",   name: "Gris",    primary: "text-gray-700",   secondary: "text-gray-600",   border: "border-gray-200",   bg: "bg-gray-50",   hex: "#6b7280" },
]

type Color = typeof colorOptions[number]
type Item  = { description: string; quantity: number; price: number }

// ── Toggle compacto para visibilidad de campos ─────────────────────────────
function FieldToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onChange}
      className="h-[18px] w-[34px] scale-90 data-[state=checked]:bg-brand-600"
    />
  )
}

// ── Documento del recibo (siempre blanco — para PDF) ──────────────────────
function ReceiptDocument({
  innerRef,
  issuerName, issuerEmail, issuerTaxId,
  showIssuerEmail, showIssuerTaxId,
  clientName, clientEmail, showClientEmail,
  invoiceNumber, issueDate, dueDate, showDueDate,
  items, taxRate, showTax,
  bankName, accountIdentifier, accountHolder,
  selectedColor, logo,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>
  issuerName: string;   issuerEmail: string;  issuerTaxId: string
  showIssuerEmail: boolean; showIssuerTaxId: boolean
  clientName: string;   clientEmail: string;  showClientEmail: boolean
  invoiceNumber: string; issueDate: string;   dueDate: string; showDueDate: boolean
  items: Item[];        taxRate: number;      showTax: boolean
  bankName: string;     accountIdentifier: string; accountHolder: string
  selectedColor: Color; logo: string | null
}) {
  const subtotal = items.reduce((t, i) => t + i.quantity * i.price, 0)
  const tax      = showTax ? subtotal * (taxRate / 100) : 0
  const total    = subtotal + tax

  const formatDate = (d: string) =>
    d ? new Date(d + "T00:00:00").toLocaleDateString("es-AR") : new Date().toLocaleDateString("es-AR")

  return (
    <div ref={innerRef} className={`rounded-3xl border ${selectedColor.border} bg-white p-8`}>

      {/* Encabezado */}
      <div className={`mb-8 flex items-start justify-between border-b ${selectedColor.border} pb-6`}>
        <div>
          {logo && (
            <img src={logo} alt="Logo" className="mb-3 h-12 max-w-[140px] object-contain" />
          )}
          <h1 className={`text-2xl font-bold ${selectedColor.primary}`}>
            {issuerName || "Tu Nombre o Empresa"}
          </h1>
          {showIssuerEmail && (
            <p className="text-sm text-gray-500">{issuerEmail || "tu@email.com"}</p>
          )}
          {showIssuerTaxId && (
            <p className="text-sm text-gray-500">CUIT/CUIL: {issuerTaxId || "20-XXXXXXXX-X"}</p>
          )}
        </div>

        <div className="text-right">
          <p className={`text-xs font-semibold uppercase tracking-wider ${selectedColor.secondary}`}>Recibo</p>
          <p className={`text-3xl font-bold ${selectedColor.primary}`}>N° {invoiceNumber || "001"}</p>
          <p className="mt-2 text-sm text-gray-500">Emisión: {formatDate(issueDate)}</p>
          {showDueDate && dueDate && (
            <p className="text-sm text-gray-500">Vencimiento: {formatDate(dueDate)}</p>
          )}
        </div>
      </div>

      {/* Cliente */}
      <div className={`mb-6 inline-block rounded-xl ${selectedColor.bg} px-4 py-3`}>
        <p className={`text-xs font-semibold uppercase tracking-wider ${selectedColor.secondary}`}>
          Facturado a
        </p>
        <p className="mt-0.5 font-semibold text-gray-800">{clientName || "Nombre del cliente"}</p>
        {showClientEmail && (
          <p className="text-sm text-gray-500">{clientEmail || "cliente@email.com"}</p>
        )}
      </div>

      {/* Tabla de conceptos */}
      <table className="mb-6 w-full text-sm">
        <thead>
          <tr className={`border-b-2 ${selectedColor.border}`}>
            <th className={`pb-2 text-left text-xs font-semibold uppercase tracking-wider ${selectedColor.secondary}`}>
              Descripción
            </th>
            <th className={`pb-2 text-center text-xs font-semibold uppercase tracking-wider ${selectedColor.secondary}`}>
              Cant.
            </th>
            <th className={`pb-2 text-right text-xs font-semibold uppercase tracking-wider ${selectedColor.secondary}`}>
              Precio unit.
            </th>
            <th className={`pb-2 text-right text-xs font-semibold uppercase tracking-wider ${selectedColor.secondary}`}>
              Importe
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className={`border-b ${selectedColor.border}`}>
              <td className="py-3 text-gray-700">{item.description || "Descripción del servicio"}</td>
              <td className="py-3 text-center text-gray-500">{item.quantity}</td>
              <td className="py-3 text-right text-gray-500">${item.price.toFixed(2)}</td>
              <td className="py-3 text-right font-medium text-gray-800">
                ${(item.quantity * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totales */}
      <div className="flex justify-end">
        <div className={`w-56 space-y-2 rounded-xl ${selectedColor.bg} p-4 text-sm`}>
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {showTax && (
            <div className="flex justify-between text-gray-600">
              <span>IVA ({taxRate}%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          )}
          <div className={`flex justify-between border-t ${selectedColor.border} pt-2 font-bold ${selectedColor.primary}`}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Datos bancarios */}
      {(bankName || accountIdentifier || accountHolder) && (
        <div className={`mt-8 border-t ${selectedColor.border} pt-6`}>
          <p className={`mb-2 text-xs font-semibold uppercase tracking-wider ${selectedColor.secondary}`}>
            Datos para el pago
          </p>
          <div className="space-y-0.5 text-sm text-gray-600">
            {bankName          && <p><span className="font-medium">Banco / Billetera:</span> {bankName}</p>}
            {accountIdentifier && <p><span className="font-medium">Cuenta:</span> {accountIdentifier}</p>}
            {accountHolder     && <p><span className="font-medium">Titular:</span> {accountHolder}</p>}
          </div>
        </div>
      )}

      {/* Footer */}
      <p className={`mt-10 text-center text-sm ${selectedColor.secondary}`}>
        ¡Gracias por tu preferencia!
      </p>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
export default function InvoiceTemplates() {

  // Emisor
  const [issuerName,  setIssuerName]  = useState("")
  const [issuerEmail, setIssuerEmail] = useState("")
  const [issuerTaxId, setIssuerTaxId] = useState("")

  // Cliente
  const [clientName,  setClientName]  = useState("")
  const [clientEmail, setClientEmail] = useState("")

  // Recibo
  const [invoiceNumber, setInvoiceNumber] = useState("001")
  const [issueDate,     setIssueDate]     = useState("")
  const [dueDate,       setDueDate]       = useState("")

  // Conceptos
  const [items,   setItems]   = useState<Item[]>([{ description: "", quantity: 1, price: 0 }])
  const [taxRate, setTaxRate] = useState(21)

  // Banco
  const [bankName,           setBankName]           = useState("")
  const [accountIdentifier,  setAccountIdentifier]  = useState("")
  const [accountHolder,      setAccountHolder]      = useState("")

  // Visibilidad
  const [showIssuerEmail, setShowIssuerEmail] = useState(true)
  const [showIssuerTaxId, setShowIssuerTaxId] = useState(true)
  const [showClientEmail, setShowClientEmail] = useState(true)
  const [showDueDate,     setShowDueDate]     = useState(true)
  const [showTax,         setShowTax]         = useState(true)

  // UI
  const [receiptColor, setReceiptColor] = useState("purple")
  const [previewOpen,  setPreviewOpen]  = useState(false)
  const [isExporting,  setIsExporting]  = useState(false)
  const [logo,         setLogo]         = useState<string | null>(null)

  const pdfRef      = useRef<HTMLDivElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const selectedColor = colorOptions.find((c) => c.id === receiptColor) ?? colorOptions[0]

  // ── Cargar datos persistidos desde localStorage ──────────────────────────
  useEffect(() => {
    const g = (k: string) => localStorage.getItem(k) ?? ""
    if (g("finko_issuer_name"))        setIssuerName(g("finko_issuer_name"))
    if (g("finko_issuer_email"))       setIssuerEmail(g("finko_issuer_email"))
    if (g("finko_issuer_taxid"))       setIssuerTaxId(g("finko_issuer_taxid"))
    if (g("finko_bank_name"))          setBankName(g("finko_bank_name"))
    if (g("finko_account_identifier")) setAccountIdentifier(g("finko_account_identifier"))
    if (g("finko_account_holder"))     setAccountHolder(g("finko_account_holder"))
    if (g("finko_receipt_logo"))       setLogo(g("finko_receipt_logo"))
  }, [])

  // ── Logo ──────────────────────────────────────────────────────────────────
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setLogo(base64)
      localStorage.setItem("finko_receipt_logo", base64)
    }
    reader.readAsDataURL(file)
  }

  const handleLogoRemove = () => {
    setLogo(null)
    localStorage.removeItem("finko_receipt_logo")
    if (logoInputRef.current) logoInputRef.current.value = ""
  }

  // ── Persistir datos del emisor y banco ───────────────────────────────────
  const persist = (key: string, value: string) => localStorage.setItem(key, value)

  // ── Conceptos ─────────────────────────────────────────────────────────────
  const addItem    = () => setItems([...items, { description: "", quantity: 1, price: 0 }])
  const removeItem = (i: number) => {
    if (items.length === 1) return
    setItems(items.filter((_, j) => j !== i))
  }
  const updateItem = (i: number, field: keyof Item, value: string | number) => {
    const next = [...items]
    next[i] = { ...next[i], [field]: value }
    setItems(next)
  }

  const subtotal = items.reduce((t, i) => t + i.quantity * i.price, 0)
  const tax      = showTax ? subtotal * (taxRate / 100) : 0
  const total    = subtotal + tax

  // ── Progreso ──────────────────────────────────────────────────────────────
  const filledFields = [
    issuerName.trim(),
    clientName.trim(),
    items.some((i) => i.description.trim()),
    items.some((i) => i.price > 0),
    bankName.trim() || accountIdentifier.trim(),
  ].filter(Boolean).length
  const progressPercent = Math.round((filledFields / 5) * 100)

  // ── Exportar PDF ──────────────────────────────────────────────────────────
  const exportToPDF = async () => {
    if (typeof window === "undefined" || !pdfRef.current) return
    setIsExporting(true)
    try {
      const [jsPDFModule, html2canvasModule] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ])
      const jsPDF       = jsPDFModule.default
      const html2canvas = html2canvasModule.default

      const element = pdfRef.current.cloneNode(true) as HTMLElement
      element.style.width           = "210mm"
      element.style.padding         = "20mm 15mm"
      element.style.backgroundColor = "white"
      element.style.position        = "absolute"
      element.style.left            = "-9999px"
      document.body.appendChild(element)

      const canvas = await html2canvas(element, {
        scale: 2, useCORS: true, logging: false, windowWidth: 1200,
      })
      document.body.removeChild(element)

      const pdf        = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
      const imgWidth   = 210
      const pageHeight = 297
      const imgHeight  = (canvas.height * imgWidth) / canvas.width
      const imgData    = canvas.toDataURL("image/png")

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      if (imgHeight > pageHeight) {
        let remaining = imgHeight - pageHeight
        let pos = -pageHeight
        while (remaining > 0) {
          pdf.addPage()
          pdf.addImage(imgData, "PNG", 0, pos, imgWidth, imgHeight)
          pdf.setTextColor(150, 150, 150)
          pdf.setFontSize(8)
          pdf.text("Hecho con finkoapp.online", imgWidth / 2, pageHeight - 5, { align: "center" })
          pos -= pageHeight
          remaining -= pageHeight
        }
      }

      pdf.setTextColor(150, 150, 150)
      pdf.setFontSize(8)
      pdf.text("Hecho con finkoapp.online", imgWidth / 2, pageHeight - 5, { align: "center" })
      pdf.save(`recibo-${invoiceNumber || "001"}.pdf`)
    } catch (error) {
      console.error("Error al exportar PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const docProps = {
    issuerName, issuerEmail, issuerTaxId,
    showIssuerEmail, showIssuerTaxId,
    clientName, clientEmail, showClientEmail,
    invoiceNumber, issueDate, dueDate, showDueDate,
    items, taxRate, showTax,
    bankName, accountIdentifier, accountHolder,
    selectedColor, logo,
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Div invisible — siempre en el DOM para el PDF export */}
      <div className="sr-only" aria-hidden>
        <ReceiptDocument innerRef={pdfRef} {...docProps} />
      </div>

      <div className="rounded-3xl bg-gray-900 p-6">

        {/* Header */}
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-full bg-purple-500/15 p-2 text-purple-400">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-100">Generador de Recibos</h2>
            <p className="text-sm text-gray-500">Completá los datos y descargá tu recibo en PDF</p>
          </div>
        </div>

        <div className="space-y-6">

          {/* Color + progreso */}
          <div className="flex items-center gap-4 rounded-xl border border-gray-800 px-4 py-3">
            <Palette className="h-4 w-4 flex-shrink-0 text-gray-600" />
            <div className="flex flex-1 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setReceiptColor(color.id)}
                  title={color.name}
                  className="h-6 w-6 flex-shrink-0 rounded-full transition-transform"
                  style={{
                    backgroundColor: color.hex,
                    outline: receiptColor === color.id ? `3px solid ${color.hex}` : "none",
                    outlineOffset: "2px",
                    transform: receiptColor === color.id ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-700">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%`, backgroundColor: selectedColor.hex }}
                />
              </div>
              <span className="w-8 text-right text-xs font-medium text-gray-500">{progressPercent}%</span>
            </div>
          </div>

          {/* Logo */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Logo de tu empresa</label>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            {logo ? (
              <div className="flex items-center gap-3 rounded-xl border border-gray-700 px-4 py-3">
                <img src={logo} alt="Logo" className="h-10 max-w-[100px] object-contain" />
                <span className="flex-1 text-sm text-gray-500">
                  Logo cargado · se guarda automáticamente
                </span>
                <button
                  type="button"
                  onClick={handleLogoRemove}
                  className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-gray-700 px-4 py-4 text-left transition-colors hover:border-purple-400 hover:bg-purple-500/10"
              >
                <ImagePlus className="h-5 w-5 flex-shrink-0 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-400">Subir logo</p>
                  <p className="text-xs text-gray-600">PNG, JPG o SVG · Se guarda en tu navegador</p>
                </div>
              </button>
            )}
          </div>

          {/* ── Tus datos ─────────────────────────────────────────────── */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Tus datos</h3>
              <p className="mt-0.5 text-xs text-gray-600">Se guardan automáticamente para la próxima vez</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Nombre o empresa</label>
                <Input
                  placeholder="Ej: Juan Pérez"
                  value={issuerName}
                  onChange={(e) => { setIssuerName(e.target.value); persist("finko_issuer_name", e.target.value) }}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Tu email</label>
                  <FieldToggle checked={showIssuerEmail} onChange={setShowIssuerEmail} />
                </div>
                <Input
                  placeholder="tu@email.com"
                  type="email"
                  value={issuerEmail}
                  onChange={(e) => { setIssuerEmail(e.target.value); persist("finko_issuer_email", e.target.value) }}
                  className={`rounded-xl transition-opacity ${!showIssuerEmail ? "opacity-40" : ""}`}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">CUIT/CUIL</label>
                  <FieldToggle checked={showIssuerTaxId} onChange={setShowIssuerTaxId} />
                </div>
                <Input
                  placeholder="20-12345678-9"
                  value={issuerTaxId}
                  onChange={(e) => { setIssuerTaxId(e.target.value); persist("finko_issuer_taxid", e.target.value) }}
                  className={`rounded-xl transition-opacity ${!showIssuerTaxId ? "opacity-40" : ""}`}
                />
              </div>
            </div>
          </div>

          {/* ── Cliente ───────────────────────────────────────────────── */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Cliente</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Nombre del cliente</label>
                <Input
                  placeholder="Empresa ABC"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Email del cliente</label>
                  <FieldToggle checked={showClientEmail} onChange={setShowClientEmail} />
                </div>
                <Input
                  placeholder="cliente@empresa.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className={`rounded-xl transition-opacity ${!showClientEmail ? "opacity-40" : ""}`}
                />
              </div>
            </div>
          </div>

          {/* ── Detalle del recibo ────────────────────────────────────── */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Detalle del recibo</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Número de recibo</label>
                <Input
                  placeholder="001"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Fecha de emisión</label>
                <Input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Fecha de vencimiento</label>
                  <FieldToggle checked={showDueDate} onChange={setShowDueDate} />
                </div>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`rounded-xl transition-opacity ${!showDueDate ? "opacity-40" : ""}`}
                />
              </div>
            </div>
          </div>

          {/* ── Conceptos ─────────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Conceptos</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 text-sm font-medium text-purple-400 transition-colors hover:text-purple-300"
              >
                <Plus className="h-4 w-4" />
                Agregar concepto
              </button>
            </div>

            {/* Cabeceras */}
            <div className="grid grid-cols-12 gap-2 px-1">
              <div className="col-span-6 text-xs font-medium text-gray-500">Descripción</div>
              <div className="col-span-2 text-center text-xs font-medium text-gray-500">Cant.</div>
              <div className="col-span-3 text-center text-xs font-medium text-gray-500">Precio unit.</div>
              <div className="col-span-1" />
            </div>

            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    <Input
                      placeholder="Ej: Diseño de logotipo"
                      value={item.description}
                      onChange={(e) => updateItem(i, "description", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", parseInt(e.target.value) || 1)}
                      className="rounded-xl text-center"
                      min="1"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={item.price || ""}
                      onChange={(e) => updateItem(i, "price", parseFloat(e.target.value) || 0)}
                      className="rounded-xl"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      disabled={items.length === 1}
                      className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2 rounded-xl border border-gray-800 bg-gray-800 p-4 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <div className="flex items-center gap-2">
                    <FieldToggle checked={showTax} onChange={setShowTax} />
                    <span>IVA</span>
                    {showTax && (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={taxRate}
                          onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                          className="w-12 rounded-lg border border-gray-700 bg-gray-700 px-1.5 py-0.5 text-center text-xs text-gray-200"
                          min="0"
                          max="100"
                        />
                        <span className="text-xs">%</span>
                      </div>
                    )}
                  </div>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-2 font-semibold text-gray-100">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Datos para el pago ────────────────────────────────────── */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Datos para el pago</h3>
              <p className="mt-0.5 text-xs text-gray-600">Se guardan automáticamente para la próxima vez</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Banco o billetera</label>
                <Input
                  placeholder="Ej: Mercado Pago"
                  value={bankName}
                  onChange={(e) => { setBankName(e.target.value); persist("finko_bank_name", e.target.value) }}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">N° de cuenta / Alias</label>
                <Input
                  placeholder="CBU, CVU o Alias"
                  value={accountIdentifier}
                  onChange={(e) => { setAccountIdentifier(e.target.value); persist("finko_account_identifier", e.target.value) }}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Titular de la cuenta</label>
                <Input
                  placeholder="Ej: Juan Pérez"
                  value={accountHolder}
                  onChange={(e) => { setAccountHolder(e.target.value); persist("finko_account_holder", e.target.value) }}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* ── CTA ───────────────────────────────────────────────────── */}
          <div className="pt-2">
            <Button
              onClick={() => setPreviewOpen(true)}
              className="w-full gap-2 rounded-xl py-5 text-base font-semibold"
              style={{ backgroundColor: selectedColor.hex, color: "white" }}
            >
              <Eye className="h-5 w-5" />
              Ver vista previa del recibo
            </Button>
          </div>
        </div>
      </div>

      {/* ── Modal de vista previa ── */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="flex max-h-[95dvh] w-[95vw] max-w-3xl flex-col overflow-hidden rounded-3xl bg-gray-900 p-0">
          <DialogHeader className="flex-shrink-0 border-b border-gray-800 bg-gray-800 px-6 py-4">
            <div className="flex items-center justify-between pr-8">
              <div>
                <DialogTitle className="text-base font-semibold text-gray-100">
                  Vista previa del recibo
                </DialogTitle>
                <p className="mt-0.5 text-xs text-gray-500">Así se verá tu PDF al exportarlo</p>
              </div>
              <Button
                size="sm"
                onClick={exportToPDF}
                disabled={isExporting}
                className="gap-1.5 rounded-xl"
                style={{ backgroundColor: selectedColor.hex, color: "white" }}
              >
                <FileDown className="h-3.5 w-3.5" />
                {isExporting ? "Exportando..." : "Exportar PDF"}
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <ReceiptDocument {...docProps} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
