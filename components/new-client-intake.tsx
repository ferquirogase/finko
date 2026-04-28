"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
  IconSparkles,
  IconLoader2,
  IconClipboardText,
  IconCoin,
  IconAlertTriangle,
  IconMessage,
  IconListCheck,
  IconChevronRight,
  IconCopy,
  IconCheck,
  IconBrandWhatsapp,
  IconMail,
  IconFileText,
  IconCalculator,
  IconReceipt,
} from "@tabler/icons-react"
import type { ClientAnalysis, ClientMessage, EditableValue } from "@/types/new-client"
import { analyzeClientWithAI } from "@/lib/ai/client"
import {
  DecisionBadge,
  EditableField,
  EditableList,
  ActionButton,
  ConfidenceMeter,
} from "./decision-layer"

type TabId = "overview" | "project" | "financials" | "flags" | "reply" | "next"

interface Tab {
  id: TabId
  labelKey: string
  icon: React.ReactNode
}

const TABS: Tab[] = [
  { id: "overview", labelKey: "tabs.overview", icon: <IconClipboardText size={18} /> },
  { id: "project", labelKey: "tabs.project", icon: <IconListCheck size={18} /> },
  { id: "financials", labelKey: "tabs.financials", icon: <IconCoin size={18} /> },
  { id: "flags", labelKey: "tabs.flags", icon: <IconAlertTriangle size={18} /> },
  { id: "reply", labelKey: "tabs.reply", icon: <IconMessage size={18} /> },
  { id: "next", labelKey: "tabs.next", icon: <IconChevronRight size={18} /> },
]

export function NewClientIntake() {
  const t = useTranslations("newClient")
  const [message, setMessage] = useState("")
  const [source, setSource] = useState<ClientMessage["source"]>("whatsapp")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ClientAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>("overview")
  const [copiedReply, setCopiedReply] = useState(false)

  // Handler to update editable values in analysis
  const updateAnalysis = useCallback((
    path: string,
    value: unknown
  ) => {
    setAnalysis((prev) => {
      if (!prev) return prev
      const updated = { ...prev }
      const keys = path.split(".")
      let current: Record<string, unknown> = updated as Record<string, unknown>
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] && typeof current[keys[i]] === "object") {
          current[keys[i]] = { ...(current[keys[i]] as object) }
          current = current[keys[i]] as Record<string, unknown>
        }
      }
      
      const lastKey = keys[keys.length - 1]
      const existingValue = current[lastKey]
      
      // If it's an EditableValue, update the value property
      if (existingValue && typeof existingValue === "object" && "isEditable" in existingValue) {
        current[lastKey] = {
          ...(existingValue as object),
          value,
          confidence: {
            ...((existingValue as EditableValue<unknown>).confidence || {}),
            source: "detected", // User edited = now detected
            reason: "Editado manualmente",
            level: 100,
          },
        }
      } else {
        current[lastKey] = value
      }
      
      return updated
    })
  }, [])

  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!message.trim()) return
    setIsAnalyzing(true)
    setError(null)
    try {
      const result = await analyzeClientWithAI(message, source)
      setAnalysis(result)
      setActiveTab("overview")
    } catch (err) {
      console.error("[Finko] Error analyzing client:", err)
      setError(err instanceof Error ? err.message : "Error al analizar el mensaje")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCopyReply = () => {
    if (!analysis) return
    const fullReply = `${analysis.suggestedReply.body.value}\n\n${analysis.suggestedReply.callToAction}`
    navigator.clipboard.writeText(fullReply)
    setCopiedReply(true)
    setTimeout(() => setCopiedReply(false), 2000)
  }

  const handleReset = () => {
    setMessage("")
    setAnalysis(null)
    setActiveTab("overview")
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">{t("inputTitle")}</h2>
          <p className="text-sm text-gray-400">{t("inputDescription")}</p>
        </div>

        {/* Source selector */}
        <div className="mb-4 flex gap-2">
          {(["whatsapp", "email", "brief"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                source === s
                  ? "bg-brand-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {s === "whatsapp" && <IconBrandWhatsapp size={16} />}
              {s === "email" && <IconMail size={16} />}
              {s === "brief" && <IconFileText size={16} />}
              {t(`source.${s}`)}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("placeholder")}
          rows={6}
          className="w-full resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {message.length} {t("characters")}
          </span>
          <div className="flex gap-2">
            {analysis && (
              <button
                onClick={handleReset}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800"
              >
                {t("reset")}
              </button>
            )}
            <button
              onClick={handleAnalyze}
              disabled={!message.trim() || isAnalyzing}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <IconLoader2 size={18} className="animate-spin" />
                  {t("analyzing")}
                </>
              ) : (
                <>
                  <IconSparkles size={18} />
                  {t("analyze")}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-2">
                <IconAlertTriangle size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">{t("error.title")}</p>
                  <p className="mt-1 text-red-400/80">{error}</p>
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="shrink-0 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
              >
                {t("error.retry")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {analysis && (
        <div className="rounded-2xl border border-gray-800 bg-gray-900">
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto border-b border-gray-800 p-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-brand-500/20 text-brand-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{t(tab.labelKey)}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <OverviewTab analysis={analysis} t={t} onUpdate={updateAnalysis} />
            )}
            {activeTab === "project" && (
              <ProjectTab analysis={analysis} t={t} onUpdate={updateAnalysis} />
            )}
            {activeTab === "financials" && (
              <FinancialsTab analysis={analysis} t={t} onUpdate={updateAnalysis} />
            )}
            {activeTab === "flags" && <FlagsTab analysis={analysis} t={t} />}
            {activeTab === "reply" && (
              <ReplyTab
                analysis={analysis}
                t={t}
                onCopy={handleCopyReply}
                copied={copiedReply}
                onUpdate={updateAnalysis}
              />
            )}
            {activeTab === "next" && <NextStepsTab analysis={analysis} t={t} />}
          </div>
        </div>
      )}
    </div>
  )
}

// Tab Components
interface TabProps {
  analysis: ClientAnalysis
  t: ReturnType<typeof useTranslations>
  onUpdate?: (path: string, value: unknown) => void
}

function OverviewTab({ analysis, t, onUpdate }: TabProps) {
  const urgencyColors = {
    urgent: "bg-red-500/20 text-red-400 border-red-500/30",
    normal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    flexible: "bg-green-500/20 text-green-400 border-green-500/30",
  }

  return (
    <div className="space-y-6">
      {/* Client info - editable */}
      <div className="flex items-start gap-4 rounded-xl border border-gray-800 bg-gray-800/50 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
          {analysis.clientName?.value?.[0] || analysis.clientCompany?.value?.[0] || "?"}
        </div>
        <div className="flex-1 space-y-2">
          <EditableField
            value={analysis.clientName?.value}
            onChange={(v) => onUpdate?.("clientName", v)}
            confidence={analysis.clientName?.confidence}
            placeholder={t("overview.addName")}
            className="font-medium"
          />
          <EditableField
            value={analysis.clientCompany?.value}
            onChange={(v) => onUpdate?.("clientCompany", v)}
            confidence={analysis.clientCompany?.confidence}
            placeholder={t("overview.addCompany")}
            className="text-sm"
          />
          <EditableField
            value={analysis.clientEmail?.value}
            onChange={(v) => onUpdate?.("clientEmail", v)}
            confidence={analysis.clientEmail?.confidence}
            placeholder={t("overview.addEmail")}
            className="text-sm text-gray-400"
          />
        </div>
      </div>

      {/* Summary - editable */}
      <div>
        <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-500">
          {t("overview.summary")}
        </h3>
        <EditableField
          value={analysis.scope.summary.value}
          onChange={(v) => onUpdate?.("scope.summary", v)}
          confidence={analysis.scope.summary.confidence}
          multiline
          showBadge
        />
      </div>

      {/* Quick stats - editable */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">{t("overview.projectType")}</p>
            <DecisionBadge
              source={analysis.scope.projectType.confidence.source}
              confidence={analysis.scope.projectType.confidence.level}
              reason={analysis.scope.projectType.confidence.reason}
              size="sm"
            />
          </div>
          <EditableField
            value={analysis.scope.projectType.value}
            onChange={(v) => onUpdate?.("scope.projectType", v)}
            showBadge={false}
            className="font-medium"
          />
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">{t("overview.complexity")}</p>
            <DecisionBadge
              source={analysis.scope.estimatedComplexity.confidence.source}
              size="sm"
            />
          </div>
          <p className="font-medium capitalize text-white">
            {t(`complexity.${analysis.scope.estimatedComplexity.value}`)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">{t("overview.urgency")}</p>
            <DecisionBadge
              source={analysis.urgency.level.confidence.source}
              size="sm"
            />
          </div>
          <span
            className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${
              urgencyColors[analysis.urgency.level.value]
            }`}
          >
            {t(`urgency.${analysis.urgency.level.value}`)}
          </span>
        </div>
      </div>

      {/* Confidence meter */}
      <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-300">{t("overview.analysisConfidence")}</p>
        </div>
        <ConfidenceMeter score={analysis.confidenceScore} />
        {analysis.analysisNotes && (
          <p className="mt-3 text-sm italic text-gray-500">{analysis.analysisNotes}</p>
        )}
      </div>

      {/* Quick action */}
      <div className="flex justify-end">
        <Link
          href="/calculadora"
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
        >
          {t("overview.nextAction")}
          <IconChevronRight size={16} />
        </Link>
      </div>
    </div>
  )
}

function ProjectTab({ analysis, t, onUpdate }: TabProps) {
  return (
    <div className="space-y-6">
      {/* Deliverables - editable list */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
          {t("project.deliverables")}
        </h3>
        <EditableList
          items={analysis.scope.suggestedDeliverables.value}
          onChange={(items) => onUpdate?.("scope.suggestedDeliverables", items)}
          confidence={analysis.scope.suggestedDeliverables.confidence}
          addLabel={t("project.addDeliverable")}
        />
      </div>

      {/* Uncertain areas */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
          {t("project.uncertainAreas")}
        </h3>
        <ul className="space-y-2">
          {analysis.scope.uncertainAreas.map((area, i) => (
            <li key={i} className="flex items-start gap-2">
              <IconAlertTriangle size={16} className="mt-1 shrink-0 text-yellow-500" />
              <span className="text-gray-400">{area}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Urgency details - editable */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
          {t("project.urgencyDetails")}
        </h3>
        <div className="space-y-3 rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <p className="text-gray-300">{analysis.urgency.reasoning}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{t("project.deadline")}:</span>
            <EditableField
              value={analysis.urgency.deadline?.value}
              onChange={(v) => onUpdate?.("urgency.deadline", v)}
              confidence={analysis.urgency.deadline?.confidence}
              placeholder={t("project.noDeadline")}
              className="text-brand-400"
            />
          </div>
          {analysis.urgency.flexibilityNotes && (
            <p className="text-sm text-gray-500">{analysis.urgency.flexibilityNotes}</p>
          )}
        </div>
      </div>

      {/* Action */}
      <Link
        href="/presupuestos"
        className="flex items-center justify-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-brand-400 transition-colors hover:bg-brand-500/20"
      >
        <IconReceipt size={20} />
        {t("project.createProposal")}
      </Link>
    </div>
  )
}

function FinancialsTab({ analysis, t, onUpdate }: TabProps) {
  return (
    <div className="space-y-6">
      {/* Pricing guidance */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
          {t("financials.pricingGuidance")}
        </h3>
        <p className="text-gray-300">{analysis.budget.pricingGuidance}</p>
      </div>

      {/* Suggested rates - editable */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">{t("financials.hourlyRate")}</p>
            <DecisionBadge
              source={analysis.budget.suggestedHourlyRate.confidence.source}
              confidence={analysis.budget.suggestedHourlyRate.confidence.level}
              reason={analysis.budget.suggestedHourlyRate.confidence.reason}
              size="sm"
            />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-gray-400">$</span>
            <EditableField
              value={analysis.budget.suggestedHourlyRate.value}
              onChange={(v) => onUpdate?.("budget.suggestedHourlyRate", Number(v))}
              showBadge={false}
              className="text-2xl font-bold text-brand-400"
            />
            <span className="text-sm text-gray-500">/hr</span>
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">{t("financials.projectRate")}</p>
            <DecisionBadge
              source={analysis.budget.suggestedProjectRate.confidence.source}
              confidence={analysis.budget.suggestedProjectRate.confidence.level}
              reason={analysis.budget.suggestedProjectRate.confidence.reason}
              size="sm"
            />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-gray-400">$</span>
            <EditableField
              value={analysis.budget.suggestedProjectRate.value}
              onChange={(v) => onUpdate?.("budget.suggestedProjectRate", Number(v))}
              showBadge={false}
              className="text-2xl font-bold text-brand-400"
            />
            <span className="text-sm text-gray-500">USD</span>
          </div>
        </div>
      </div>

      {/* Payment method recommendation */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
          {t("financials.paymentMethod")}
        </h3>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-brand-500/20 px-3 py-1 text-sm font-medium text-brand-400">
              {t(`paymentMethods.${analysis.paymentMethod.primary.value}`)}
            </span>
            {analysis.paymentMethod.alternatives.map((alt) => (
              <span
                key={alt}
                className="rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300"
              >
                {t(`paymentMethods.${alt}`)}
              </span>
            ))}
            <DecisionBadge
              source={analysis.paymentMethod.primary.confidence.source}
              size="sm"
            />
          </div>
          <p className="text-sm text-gray-400">{analysis.paymentMethod.reasoning}</p>
          {analysis.paymentMethod.riskNotes && (
            <p className="mt-2 text-sm text-yellow-500">{analysis.paymentMethod.riskNotes}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href="/calculadora"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-brand-400 transition-colors hover:bg-brand-500/20"
        >
          <IconCalculator size={20} />
          {t("financials.goToCalculator")}
        </Link>
        <Link
          href="/presupuestos"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-white transition-colors hover:bg-brand-600"
        >
          <IconReceipt size={20} />
          {t("financials.createProposal")}
        </Link>
      </div>
    </div>
  )
}

function FlagsTab({ analysis, t }: Omit<TabProps, "onUpdate">) {
  const severityColors = {
    high: "border-red-500/30 bg-red-500/10",
    medium: "border-yellow-500/30 bg-yellow-500/10",
    low: "border-blue-500/30 bg-blue-500/10",
  }

  const severityTextColors = {
    high: "text-red-400",
    medium: "text-yellow-400",
    low: "text-blue-400",
  }

  if (analysis.redFlags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <IconCheck size={32} className="text-green-400" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-white">{t("flags.noFlags")}</h3>
        <p className="text-gray-400">{t("flags.noFlagsDescription")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        {t("flags.found", { count: analysis.redFlags.length })}
      </p>
      {analysis.redFlags.map((flag) => (
        <div
          key={flag.id}
          className={`rounded-xl border p-4 ${severityColors[flag.severity]}`}
        >
          <div className="mb-2 flex items-center gap-2">
            <IconAlertTriangle
              size={18}
              className={severityTextColors[flag.severity]}
            />
            <h4 className="font-medium text-white">{flag.title}</h4>
            <span
              className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${severityTextColors[flag.severity]}`}
            >
              {t(`severity.${flag.severity}`)}
            </span>
          </div>
          <p className="mb-3 text-sm text-gray-300">{flag.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              <strong className="text-gray-300">{t("flags.recommendation")}:</strong>{" "}
              {flag.recommendation}
            </p>
            {flag.action && (
              <ActionButton
                action={flag.action}
                variant="ghost"
                size="sm"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function ReplyTab({
  analysis,
  t,
  onCopy,
  copied,
  onUpdate,
}: TabProps & { onCopy: () => void; copied: boolean }) {
  const tones: Array<"formal" | "friendly" | "professional"> = ["professional", "formal", "friendly"]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">
          {t("reply.suggested")}
        </h3>
        <div className="flex gap-1">
          {tones.map((tone) => (
            <button
              key={tone}
              onClick={() => onUpdate?.("suggestedReply.tone", tone)}
              className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                analysis.suggestedReply.tone.value === tone
                  ? "bg-brand-500/20 text-brand-400"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {t(`reply.tone.${tone}`)}
            </button>
          ))}
        </div>
      </div>

      {analysis.suggestedReply.subject?.value && (
        <div className="rounded-lg border border-gray-800 bg-gray-800/50 px-4 py-2">
          <span className="text-xs text-gray-500">{t("reply.subject")}:</span>
          <EditableField
            value={analysis.suggestedReply.subject.value}
            onChange={(v) => onUpdate?.("suggestedReply.subject", v)}
            confidence={analysis.suggestedReply.subject.confidence}
            showBadge={false}
          />
        </div>
      )}

      <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
        <EditableField
          value={analysis.suggestedReply.body.value}
          onChange={(v) => onUpdate?.("suggestedReply.body", v)}
          multiline
          showBadge={false}
          className="whitespace-pre-wrap text-gray-300"
        />
        <p className="mt-4 border-t border-gray-700 pt-4 text-brand-400">
          {analysis.suggestedReply.callToAction}
        </p>
      </div>

      <button
        onClick={onCopy}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white transition-colors hover:bg-gray-700"
      >
        {copied ? (
          <>
            <IconCheck size={18} className="text-green-400" />
            {t("reply.copied")}
          </>
        ) : (
          <>
            <IconCopy size={18} />
            {t("reply.copy")}
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-500">{t("reply.editNote")}</p>
    </div>
  )
}

function NextStepsTab({ analysis, t }: Omit<TabProps, "onUpdate">) {
  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-blue-500",
  }

  return (
    <div className="space-y-4">
      {analysis.nextSteps.map((step, index) => (
        <div
          key={step.id}
          className="flex items-start gap-4 rounded-xl border border-gray-800 bg-gray-800/50 p-4"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-700 text-sm font-medium text-white">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h4 className="font-medium text-white">{step.action}</h4>
              <span
                className={`h-2 w-2 rounded-full ${priorityColors[step.priority]}`}
              />
            </div>
            <p className="text-sm text-gray-400">{step.description}</p>
          </div>
          {step.linkedAction ? (
            <ActionButton
              action={step.linkedAction}
              variant="secondary"
              size="sm"
            />
          ) : step.linkHref ? (
            <Link
              href={step.linkHref}
              className="shrink-0 rounded-lg border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-sm text-brand-400 transition-colors hover:bg-brand-500/20"
            >
              {t("nextSteps.go")}
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default NewClientIntake
