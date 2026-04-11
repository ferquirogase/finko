"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  FileText, Copy, Check, FileDown, Palette, Plus, Trash2, Eye, ImagePlus, X,
} from "lucide-react"
import { useTranslations } from "next-intl"

// ── Lista dinámica de ítems ────────────────────────────────────────────────
function ListInput({
  items, onChange, placeholder,
}: {
  items: string[]; onChange: (items: string[]) => void; placeholder: string
}) {
  const t = useTranslations("common")
  const add = () => onChange([...items, ""])
  const remove = (i: number) => { if (items.length === 1) return; onChange(items.filter((_, j) => j !== i)) }
  const update = (i: number, value: string) => {
    const next = [...items]; next[i] = value; onChange(next)
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input value={item} onChange={(e) => update(i, e.target.value)} placeholder={placeholder} className="rounded-xl" />
          <button
            type="button"
            onClick={() => remove(i)}
            disabled={items.length === 1}
            className="flex-shrink-0 rounded-xl border border-gray-700 p-2 text-gray-500 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300"
      >
        <Plus className="h-4 w-4" />
        {t("addItem")}
      </button>
    </div>
  )
}

// ── Documento renderizado ─────────────────────────────────────────────────
function ProposalDocument({
  innerRef, clientName, projectTitle, projectScope, deliverables, timeline, budget, terms, selectedColor, logo, t,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>
  clientName: string; projectTitle: string; projectScope: string
  deliverables: string[]; timeline: string[]; budget: string[]; terms: string[]
  selectedColor: { primary: string; secondary: string; border: string; bg: string; hex: string }
  logo: string | null
  t: (key: string) => string
}) {
  const sections = [
    { label: t("docDeliverables"), items: deliverables },
    { label: t("docTimeline"),     items: timeline },
    { label: t("docBudget"),       items: budget },
  ]

  return (
    <div ref={innerRef} className={`rounded-3xl border ${selectedColor.border} bg-white p-8`}>
      {/* Encabezado */}
      <div className={`mb-8 border-b ${selectedColor.border} pb-5`}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className={`text-2xl font-bold ${selectedColor.primary}`}>{t("docTitle")}</h3>
          {logo ? (
            <img src={logo} alt="Logo" className="h-12 max-w-[120px] object-contain" />
          ) : (
            <FileText className={`h-8 w-8 ${selectedColor.secondary}`} />
          )}
        </div>
        <p className="text-sm text-gray-500">{t("docFor")} {clientName || t("docClientPlaceholder")}</p>
        <p className={`text-lg font-medium ${selectedColor.secondary}`}>
          {projectTitle || t("docProjectPlaceholder")}
        </p>
      </div>

      {/* Cuerpo */}
      <div className="mb-6 space-y-5">
        <div>
          <h4 className={`mb-2 font-bold uppercase tracking-wide ${selectedColor.secondary}`}>
            {t("docScopeTitle")}
          </h4>
          <p className="text-sm leading-relaxed text-gray-700">
            {projectScope || t("docScopePlaceholder")}
          </p>
        </div>

        {sections.map(({ label, items }) => (
          <div key={label}>
            <h4 className={`mb-2 font-bold uppercase tracking-wide ${selectedColor.secondary}`}>{label}</h4>
            {items.filter((i) => i.trim()).length > 0 ? (
              <ul className="list-disc space-y-1 pl-5">
                {items.filter((i) => i.trim()).map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">{t("docEmpty")}</p>
            )}
          </div>
        ))}
      </div>

      {/* Términos */}
      <div className={`rounded-xl ${selectedColor.bg} p-4`}>
        <h4 className={`mb-2 font-bold uppercase tracking-wide ${selectedColor.secondary}`}>
          {t("docTerms")}
        </h4>
        <ul className="list-disc space-y-1 pl-5">
          {terms.filter((term) => term.trim()).map((term, i) => (
            <li key={i} className="text-sm text-gray-700">{term}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
export default function ProposalGenerator() {
  const t = useTranslations("proposals")

  const [clientName,    setClientName]    = useState("")
  const [projectTitle,  setProjectTitle]  = useState("")
  const [projectScope,  setProjectScope]  = useState("")
  const [deliverables,  setDeliverables]  = useState<string[]>([""])
  const [timeline,      setTimeline]      = useState<string[]>([""])
  const [budget,        setBudget]        = useState<string[]>([""])
  const [terms,         setTerms]         = useState<string[]>([
    t("defaultTerms.t1"),
    t("defaultTerms.t2"),
    t("defaultTerms.t3"),
    t("defaultTerms.t4"),
  ])

  const [logo,          setLogo]          = useState<string | null>(null)
  const [copied,        setCopied]        = useState(false)
  const [isExporting,   setIsExporting]   = useState(false)
  const [previewOpen,   setPreviewOpen]   = useState(false)
  const [proposalColor, setProposalColor] = useState("green")

  const logoInputRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const saved = localStorage.getItem("finko_proposal_logo")
    if (saved) setLogo(saved)
  }, [])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setLogo(base64)
      localStorage.setItem("finko_proposal_logo", base64)
    }
    reader.readAsDataURL(file)
  }

  const handleLogoRemove = () => {
    setLogo(null)
    localStorage.removeItem("finko_proposal_logo")
    if (logoInputRef.current) logoInputRef.current.value = ""
  }

  // Pre-rellenar desde calculadora
  useEffect(() => {
    const rate  = searchParams.get("rate")
    const hours = searchParams.get("hours")
    const total = searchParams.get("total")
    const type  = searchParams.get("type")

    if (rate && total) {
      const prefilled: string[] = []
      if (type)  prefilled.push(t("prefillType",  { type }))
      prefilled.push(t("prefillRate",  { rate }))
      if (hours) prefilled.push(t("prefillHours", { hours }))
      prefilled.push(t("prefillTotal", { total: Number(total).toLocaleString() }))
      setBudget(prefilled)
    }
  }, [searchParams, t])

  const colorOptions = [
    { id: "green",  name: t("colors.green"),  primary: "text-green-800",  secondary: "text-green-700",  border: "border-green-100",  bg: "bg-green-50",  hex: "#10b981" },
    { id: "blue",   name: t("colors.blue"),   primary: "text-blue-800",   secondary: "text-blue-700",   border: "border-blue-100",   bg: "bg-blue-50",   hex: "#3b82f6" },
    { id: "purple", name: t("colors.purple"), primary: "text-purple-800", secondary: "text-purple-700", border: "border-purple-100", bg: "bg-purple-50", hex: "#8b5cf6" },
    { id: "amber",  name: t("colors.amber"),  primary: "text-amber-800",  secondary: "text-amber-700",  border: "border-amber-100",  bg: "bg-amber-50",  hex: "#f59e0b" },
    { id: "red",    name: t("colors.red"),    primary: "text-red-800",    secondary: "text-red-700",    border: "border-red-100",    bg: "bg-red-50",    hex: "#ef4444" },
    { id: "gray",   name: t("colors.gray"),   primary: "text-gray-800",   secondary: "text-gray-700",   border: "border-gray-200",   bg: "bg-gray-50",   hex: "#6b7280" },
  ]
  const selectedColor = colorOptions.find((c) => c.id === proposalColor) ?? colorOptions[0]

  const pdfRef = useRef<HTMLDivElement>(null)

  const filledFields = [
    clientName.trim(), projectTitle.trim(), projectScope.trim(),
    deliverables.some((d) => d.trim()),
    timeline.some((t) => t.trim()),
    budget.some((b) => b.trim()),
  ].filter(Boolean).length
  const progressPercent = Math.round((filledFields / 6) * 100)

  const handleCopy = () => {
    if (typeof window === "undefined") return
    const text = [
      t("docTitle"), "",
      `${t("docFor")} ${clientName}`,
      `${t("projectTitle")}: ${projectTitle}`,
      "", t("docScopeTitle"), projectScope, "",
      t("docDeliverables"),
      ...deliverables.filter((d) => d.trim()).map((d) => `- ${d}`),
      "", t("docTimeline"),
      ...timeline.filter((ti) => ti.trim()).map((ti) => `- ${ti}`),
      "", t("docBudget"),
      ...budget.filter((b) => b.trim()).map((b) => `- ${b}`),
      "", t("docTerms"),
      ...terms.filter((te) => te.trim()).map((te) => `- ${te}`),
    ].join("\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exportToPDF = async () => {
    if (typeof window === "undefined" || !pdfRef.current) return
    setIsExporting(true)
    try {
      const [jsPDFModule, html2canvasModule] = await Promise.all([
        import("jspdf"), import("html2canvas"),
      ])
      const jsPDF       = jsPDFModule.default
      const html2canvas = html2canvasModule.default

      const element = pdfRef.current.cloneNode(true) as HTMLElement
      element.style.width = "210mm"; element.style.padding = "20mm 15mm"
      element.style.backgroundColor = "white"; element.style.position = "absolute"
      element.style.left = "-9999px"
      document.body.appendChild(element)

      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false, windowWidth: 1200 })
      document.body.removeChild(element)

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
      const imgWidth = 210, pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const imgData = canvas.toDataURL("image/png")

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      if (imgHeight > pageHeight) {
        let remaining = imgHeight - pageHeight, pos = -pageHeight
        while (remaining > 0) {
          pdf.addPage()
          pdf.addImage(imgData, "PNG", 0, pos, imgWidth, imgHeight)
          pdf.setTextColor(150, 150, 150); pdf.setFontSize(8)
          pdf.text("Hecho con finkoapp.online", imgWidth / 2, pageHeight - 5, { align: "center" })
          pos -= pageHeight; remaining -= pageHeight
        }
      }

      pdf.setTextColor(150, 150, 150); pdf.setFontSize(8)
      pdf.text("Hecho con finkoapp.online", imgWidth / 2, pageHeight - 5, { align: "center" })
      pdf.save(`propuesta-${clientName || "proyecto"}.pdf`)
    } catch (error) {
      console.error("Error al exportar PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const docProps = { clientName, projectTitle, projectScope, deliverables, timeline, budget, terms, selectedColor, logo, t: t as any }

  return (
    <div className="space-y-6">
      <div className="sr-only" aria-hidden>
        <ProposalDocument innerRef={pdfRef} {...docProps} />
      </div>

      <div className="rounded-3xl bg-gray-900 p-6">
        {/* Encabezado */}
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-full bg-green-500/15 p-2 text-green-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-100">{t("title")}</h2>
            <p className="text-sm text-gray-500">{t("subtitle")}</p>
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
                  onClick={() => setProposalColor(color.id)}
                  title={color.name}
                  className="h-6 w-6 flex-shrink-0 rounded-full transition-transform"
                  style={{
                    backgroundColor: color.hex,
                    outline: proposalColor === color.id ? `3px solid ${color.hex}` : "none",
                    outlineOffset: "2px",
                    transform: proposalColor === color.id ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-700">
                <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%`, backgroundColor: selectedColor.hex }} />
              </div>
              <span className="w-8 text-right text-xs font-medium text-gray-500">{progressPercent}%</span>
            </div>
          </div>

          {/* Progreso (mobile) */}
          <div className="sm:hidden">
            <div className="mb-1 flex justify-between text-xs text-gray-500">
              <span>{t("fieldsOf6", { filled: filledFields })}</span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
              <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%`, backgroundColor: selectedColor.hex }} />
            </div>
          </div>

          {/* Logo */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">{t("logo")}</label>
            <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            {logo ? (
              <div className="flex items-center gap-3 rounded-xl border border-gray-700 px-4 py-3">
                <img src={logo} alt="Logo" className="h-10 max-w-[100px] object-contain" />
                <span className="flex-1 text-sm text-gray-500">{t("logoLoaded")}</span>
                <button type="button" onClick={handleLogoRemove} className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => logoInputRef.current?.click()} className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-gray-700 px-4 py-4 text-left transition-colors hover:border-brand-400 hover:bg-brand-500/10">
                <ImagePlus className="h-5 w-5 flex-shrink-0 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-400">{t("uploadLogo")}</p>
                  <p className="text-xs text-gray-600">{t("uploadLogoDesc")}</p>
                </div>
              </button>
            )}
          </div>

          {/* Cliente + Título */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">{t("clientName")}</label>
              <Input placeholder={t("clientNameEx")} value={clientName} onChange={(e) => setClientName(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">{t("projectTitle")}</label>
              <Input placeholder={t("projectTitleEx")} value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="rounded-xl" />
            </div>
          </div>

          {/* Alcance */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">{t("scope")}</label>
            <Textarea placeholder={t("scopeDesc")} className="min-h-[80px] rounded-xl" value={projectScope} onChange={(e) => setProjectScope(e.target.value)} />
          </div>

          {/* Entregables + Cronograma */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">{t("deliverables")}</label>
              <ListInput items={deliverables} onChange={setDeliverables} placeholder={t("deliverablesEx")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">{t("timeline")}</label>
              <ListInput items={timeline} onChange={setTimeline} placeholder={t("timelineEx")} />
            </div>
          </div>

          {/* Presupuesto + Términos */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">{t("budget")}</label>
              <ListInput items={budget} onChange={setBudget} placeholder={t("budgetEx")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">{t("terms")}</label>
              <ListInput items={terms} onChange={setTerms} placeholder={t("termsEx")} />
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button onClick={() => setPreviewOpen(true)} className="flex-1 gap-2 rounded-xl py-5 text-base font-semibold" style={{ backgroundColor: selectedColor.hex, color: "white" }}>
              <Eye className="h-5 w-5" />
              {t("previewBtn")}
            </Button>
            <Button variant="outline" onClick={handleCopy} className="gap-2 rounded-xl">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? t("copiedText") : t("copyText")}
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de vista previa */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="flex max-h-[95dvh] w-[95vw] max-w-3xl flex-col overflow-hidden rounded-3xl bg-gray-900 p-0">
          <DialogHeader className="flex-shrink-0 border-b border-gray-800 bg-gray-800 px-6 py-4">
            <div className="flex items-center justify-between pr-8">
              <div>
                <DialogTitle className="text-base font-semibold text-gray-100">{t("previewTitle")}</DialogTitle>
                <p className="mt-0.5 text-xs text-gray-500">{t("previewSubtitle")}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 rounded-xl">
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? t("copied") : t("copy")}
                </Button>
                <Button size="sm" onClick={exportToPDF} disabled={isExporting} className="gap-1.5 rounded-xl" style={{ backgroundColor: selectedColor.hex, color: "white" }}>
                  <FileDown className="h-3.5 w-3.5" />
                  {isExporting ? t("exporting" as any) : t("exportPDF" as any)}
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <ProposalDocument {...docProps} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
