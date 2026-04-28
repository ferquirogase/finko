import { 
  IconCircleCheck, 
  IconCircle, 
  IconTruck, 
  IconMessageCircle, 
  IconCash, 
  IconCalendarEvent,
  IconSubtask,
  IconSparkles
} from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import type { TodayPriority } from "@/lib/mock-dashboard-data"
import { cn } from "@/lib/utils"

interface TodayPrioritiesProps {
  priorities: TodayPriority[]
}

export default function TodayPriorities({ priorities }: TodayPrioritiesProps) {
  const t = useTranslations("dashboard.todayPriorities")

  const completedCount = priorities.filter(p => p.completed).length

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20">
            <IconSparkles className="h-4 w-4 text-brand-400" stroke={2} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-100">{t("title")}</h2>
            <p className="text-xs text-gray-500">
              {completedCount}/{priorities.length} {t("completed")}
            </p>
          </div>
        </div>
      </div>

      {/* Priority List */}
      <div className="space-y-3">
        {priorities.map((priority) => (
          <PriorityCard key={priority.id} priority={priority} />
        ))}
      </div>
    </div>
  )
}

interface PriorityCardProps {
  priority: TodayPriority
}

function PriorityCard({ priority }: PriorityCardProps) {
  const t = useTranslations("dashboard.todayPriorities")

  const typeIcon = {
    delivery: IconTruck,
    followup: IconMessageCircle,
    payment: IconCash,
    meeting: IconCalendarEvent,
    task: IconSubtask,
  }[priority.type]

  const TypeIcon = typeIcon

  const urgencyStyles = {
    critical: "border-red-500/30 bg-red-500/5",
    high: "border-amber-500/30 bg-amber-500/5",
    medium: "border-gray-700 bg-gray-800/30",
  }[priority.urgency]

  const urgencyBadge = {
    critical: "bg-red-500/20 text-red-400",
    high: "bg-amber-500/20 text-amber-400",
    medium: "bg-gray-700 text-gray-400",
  }[priority.urgency]

  const CheckIcon = priority.completed ? IconCircleCheck : IconCircle

  return (
    <div className={cn(
      "rounded-xl border p-4 transition-all duration-200",
      urgencyStyles,
      priority.completed && "opacity-60"
    )}>
      <div className="flex gap-3">
        {/* Checkbox */}
        <button className="mt-0.5 shrink-0">
          <CheckIcon 
            className={cn(
              "h-5 w-5 transition-colors",
              priority.completed ? "text-green-400" : "text-gray-600 hover:text-gray-400"
            )} 
            stroke={2} 
          />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", urgencyBadge)}>
              <TypeIcon className="h-3 w-3" stroke={2} />
              {t(`types.${priority.type}`)}
            </span>
            {priority.dueTime && (
              <span className="text-xs text-gray-500">{priority.dueTime}</span>
            )}
          </div>

          <h3 className={cn(
            "font-medium text-gray-100 mb-1",
            priority.completed && "line-through"
          )}>
            {priority.title}
          </h3>

          {priority.clientName && (
            <p className="text-sm text-gray-400 mb-2">
              {priority.clientName}
              {priority.projectName && ` — ${priority.projectName}`}
            </p>
          )}

          {/* Why Now - AI insight */}
          <div className="rounded-lg bg-gray-800/50 px-3 py-2 mb-3">
            <p className="text-xs text-gray-400">
              <span className="font-medium text-brand-400">{t("whyNow")}</span> {priority.whyNow}
            </p>
            {priority.impact && (
              <p className="text-xs text-green-400 mt-1">
                {t("impact")}: {priority.impact}
              </p>
            )}
          </div>

          {/* Action Button */}
          {priority.actionHref ? (
            <Link
              href={priority.actionHref}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500/20 px-3 py-1.5 text-sm font-medium text-brand-400 transition-colors hover:bg-brand-500/30"
            >
              {priority.actionLabel}
            </Link>
          ) : (
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500/20 px-3 py-1.5 text-sm font-medium text-brand-400 transition-colors hover:bg-brand-500/30">
              {priority.actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
