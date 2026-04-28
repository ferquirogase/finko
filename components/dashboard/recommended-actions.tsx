import { Link } from "@/i18n/navigation"
import { IconBulb, IconMessageCircle, IconCash, IconFileText, IconTruck, IconEye } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import type { RecommendedAction } from "@/lib/mock-dashboard-data"
import { cn } from "@/lib/utils"

interface RecommendedActionsProps {
  actions: RecommendedAction[]
}

export default function RecommendedActions({ actions }: RecommendedActionsProps) {
  const t = useTranslations("dashboard.recommendedActions")

  if (actions.length === 0) return null

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20">
          <IconBulb className="h-4 w-4 text-brand-400" stroke={2} />
        </div>
        <h2 className="text-lg font-semibold text-gray-100">{t("title")}</h2>
      </div>

      <div className="space-y-3">
        {actions.map((action) => (
          <ActionCard key={action.id} action={action} />
        ))}
      </div>
    </div>
  )
}

function ActionCard({ action }: { action: RecommendedAction }) {
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
        <div className="mt-2 rounded-lg bg-brand-500/5 p-2">
          <p className="text-xs text-brand-300/80">
            <span className="font-medium text-brand-400">Sugerencia: </span>
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
