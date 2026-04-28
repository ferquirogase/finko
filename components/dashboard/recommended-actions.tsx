import { Link } from "@/i18n/navigation"
import { IconBulb, IconMessageCircle, IconCash, IconFileText, IconTruck, IconEye, IconSparkles } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import type { RecommendedAction } from "@/lib/mock-dashboard-data"
import { cn } from "@/lib/utils"

interface RecommendedActionsProps {
  actions: RecommendedAction[]
}

export default function RecommendedActions({ actions }: RecommendedActionsProps) {
  const t = useTranslations("dashboard.recommendedActions")

  const isEmpty = actions.length === 0

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20">
          <IconSparkles className="h-4 w-4 text-brand-400" stroke={2} />
        </div>
        <h2 className="text-lg font-semibold text-gray-100">{t("title")}</h2>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm font-medium text-gray-300">{t("empty")}</p>
          <p className="mt-1 text-xs text-gray-500">{t("emptyDescription")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {actions.map((action) => (
            <ActionCard key={action.id} action={action} />
          ))}
        </div>
      )}
    </div>
  )
}

function ActionCard({ action }: { action: RecommendedAction }) {
  const t = useTranslations("dashboard.recommendedActions")
  
  const iconMap = {
    followup: IconMessageCircle,
    cobro: IconCash,
    propuesta: IconFileText,
    entrega: IconTruck,
    revision: IconEye,
  }

  const Icon = iconMap[action.type]

  const content = (
    <div className="flex items-start gap-3 rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 transition-colors hover:border-brand-500/30 hover:bg-gray-800/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10">
        <Icon className="h-5 w-5 text-brand-400" stroke={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-gray-100">{action.title}</p>
            <p className="mt-0.5 text-sm text-gray-400">{action.description}</p>
          </div>
          {action.suggestedDate && (
            <span className="shrink-0 rounded-md bg-gray-700/50 px-2 py-1 text-xs text-gray-400">
              {action.suggestedDate}
            </span>
          )}
        </div>
        
        {/* AI Reasoning */}
        <div className="mt-2 flex items-start gap-2 rounded-lg bg-brand-500/5 p-2">
          <IconSparkles className="h-3.5 w-3.5 shrink-0 text-brand-400 mt-0.5" stroke={2} />
          <p className="text-xs text-brand-300/80">
            {action.reason}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          {action.clientName && (
            <span className="text-xs text-gray-500">{action.clientName}</span>
          )}
          <span className="inline-flex items-center rounded-lg bg-brand-600/20 px-3 py-1.5 text-xs font-medium text-brand-400 transition-colors hover:bg-brand-600/30">
            {action.actionLabel}
          </span>
        </div>
      </div>
    </div>
  )

  if (action.actionHref) {
    return <Link href={action.actionHref}>{content}</Link>
  }

  return <button className="w-full text-left">{content}</button>
}
