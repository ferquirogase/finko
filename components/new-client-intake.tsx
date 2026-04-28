"use client"

import { useState } from "react"
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
} from "@tabler/icons-react"
import type { ClientAnalysis, ClientMessage } from "@/types/new-client"
import { analyzeClientMessage } from "@/lib/mock-client-analysis"

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

  const handleAnalyze = async () => {
    if (!message.trim()) return
    setIsAnalyzing(true)
    try {
      const result = await analyzeClientMessage(message, source)
      setAnalysis(result)
      setActiveTab("overview")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCopyReply = () => {
    if (!analysis) return
    const fullReply = `${analysis.suggestedReply.body}\n\n${analysis.suggestedReply.callToAction}`
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
            {activeTab === "overview" && <OverviewTab analysis={analysis} t={t} />}
            {activeTab === "project" && <ProjectTab analysis={analysis} t={t} />}
            {activeTab === "financials" && <FinancialsTab analysis={analysis} t={t} />}
            {activeTab === "flags" && <FlagsTab analysis={analysis} t={t} />}
            {activeTab === "reply" && (
              <ReplyTab
                analysis={analysis}
                t={t}
                onCopy={handleCopyReply}
                copied={copiedReply}
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
function OverviewTab({
  analysis,
  t,
}: {
  analysis: ClientAnalysis
  t: ReturnType<typeof useTranslations>
}) {
  const urgencyColors = {
    urgent: "bg-red-500/20 text-red-400 border-red-500/30",
    normal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    flexible: "bg-green-500/20 text-green-400 border-green-500/30",
  }

  return (
    <div className="space-y-6">
      {/* Client info if detected */}
      {(analysis.clientName || analysis.clientCompany) && (
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
            {analysis.clientName?.[0] || analysis.clientCompany?.[0] || "?"}
          </div>
          <div>
            {analysis.clientName && (
              <p className="font-medium text-white">{analysis.clientName}</p>
            )}
            {analysis.clientCompany && (
              <p className="text-sm text-gray-400">{analysis.clientCompany}</p>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      <div>
        <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-500">
          {t("overview.summary")}
        </h3>
        <p className="text-gray-300">{analysis.scope.summary}</p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <p className="mb-1 text-xs text-gray-500">{t("overview.projectType")}</p>
          <p className="font-medium text-white">{analysis.scope.projectType}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <p className="mb-1 text-xs text-gray-500">{t("overview.complexity")}</p>
          <p className="font-medium capitalize text-white">
            {t(`complexity.${analysis.scope.estimatedComplexity}`)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <p className="mb-1 text-xs text-gray-500">{t("overview.urgency")}</p>
          <span
            className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${
              urgencyColors[analysis.urgency.level]
            }`}
          >
            {t(`urgency.${analysis.urgency.level}`)}
          </span>
        </div>
      </div>

      {/* Confidence */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full bg-brand-500 transition-all"
            style={{ width: `${analysis.confidenceScore}%` }}
          />
        </div>
        <span className="text-sm text-gray-400">
          {analysis.confidenceScore}% {t("overview.confidence")}
        </span>
      </div>

      {analysis.analysisNotes && (
        <p className="text-sm italic text-gray-500">{analysis.analysisNotes}</p>
      )}
    </div>
  )
}

function ProjectTab({
  analysis,
  t,
}: {
  analysis: ClientAnalysis
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <div className="space-y-6">
      {/* Deliverables */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
          {t("project.deliverables")}
        </h3>
        <ul className="space-y-2">
          {analysis.scope.suggestedDeliverables.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <IconCheck size={16} className="mt-1 shrink-0 text-brand-400" />
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
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

      {/* Urgency details */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
          {t("project.urgencyDetails")}
        </h3>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <p className="text-gray-300">{analysis.urgency.reasoning}</p>
          {analysis.urgency.deadline && (
            <p className="mt-2 text-sm text-brand-400">
              {t("project.deadline")}: {analysis.urgency.deadline}
            </p>
          )}
          {analysis.urgency.flexibilityNotes && (
            <p className="mt-2 text-sm text-gray-500">{analysis.urgency.flexibilityNotes}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function FinancialsTab({
  analysis,
  t,
}: {
  analysis: ClientAnalysis
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <div className="space-y-6">
      {/* Pricing guidance */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
          {t("financials.pricingGuidance")}
        </h3>
        <p className="text-gray-300">{analysis.budget.pricingGuidance}</p>
      </div>

      {/* Suggested rates */}
      <div className="grid gap-4 sm:grid-cols-2">
        {analysis.budget.suggestedHourlyRate && (
          <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
            <p className="mb-1 text-xs text-gray-500">{t("financials.hourlyRate")}</p>
            <p className="text-2xl font-bold text-brand-400">
              ${analysis.budget.suggestedHourlyRate}
              <span className="text-sm font-normal text-gray-500"> /hr</span>
            </p>
          </div>
        )}
        {analysis.budget.suggestedProjectRate && (
          <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
            <p className="mb-1 text-xs text-gray-500">{t("financials.projectRate")}</p>
            <p className="text-2xl font-bold text-brand-400">
              ${analysis.budget.suggestedProjectRate}
              <span className="text-sm font-normal text-gray-500"> USD</span>
            </p>
          </div>
        )}
      </div>

      {/* Payment method recommendation */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
          {t("financials.paymentMethod")}
        </h3>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-brand-500/20 px-3 py-1 text-sm font-medium text-brand-400">
              {t(`paymentMethods.${analysis.paymentMethod.primary}`)}
            </span>
            {analysis.paymentMethod.alternatives.map((alt) => (
              <span
                key={alt}
                className="rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300"
              >
                {t(`paymentMethods.${alt}`)}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-400">{analysis.paymentMethod.reasoning}</p>
          {analysis.paymentMethod.riskNotes && (
            <p className="mt-2 text-sm text-yellow-500">{analysis.paymentMethod.riskNotes}</p>
          )}
        </div>
      </div>

      {/* Link to calculator */}
      <Link
        href="/calculadora"
        className="flex items-center justify-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-brand-400 transition-colors hover:bg-brand-500/20"
      >
        <IconCoin size={20} />
        {t("financials.goToCalculator")}
      </Link>
    </div>
  )
}

function FlagsTab({
  analysis,
  t,
}: {
  analysis: ClientAnalysis
  t: ReturnType<typeof useTranslations>
}) {
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
          <p className="text-sm text-gray-400">
            <strong className="text-gray-300">{t("flags.recommendation")}:</strong>{" "}
            {flag.recommendation}
          </p>
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
}: {
  analysis: ClientAnalysis
  t: ReturnType<typeof useTranslations>
  onCopy: () => void
  copied: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">
          {t("reply.suggested")}
        </h3>
        <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
          {t(`reply.tone.${analysis.suggestedReply.tone}`)}
        </span>
      </div>

      {analysis.suggestedReply.subject && (
        <div className="rounded-lg border border-gray-800 bg-gray-800/50 px-4 py-2">
          <span className="text-xs text-gray-500">{t("reply.subject")}:</span>
          <p className="text-white">{analysis.suggestedReply.subject}</p>
        </div>
      )}

      <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
        <p className="whitespace-pre-wrap text-gray-300">{analysis.suggestedReply.body}</p>
        <p className="mt-4 text-brand-400">{analysis.suggestedReply.callToAction}</p>
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

function NextStepsTab({
  analysis,
  t,
}: {
  analysis: ClientAnalysis
  t: ReturnType<typeof useTranslations>
}) {
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
          {step.linkHref && (
            <Link
              href={step.linkHref}
              className="shrink-0 rounded-lg border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-sm text-brand-400 transition-colors hover:bg-brand-500/20"
            >
              {t("nextSteps.go")}
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}

export default NewClientIntake
