import { IconCalendarWeek, IconCircle, IconCircleCheck, IconAlertTriangle } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import type { WeeklyDelivery } from "@/lib/mock-dashboard-data"
import { cn } from "@/lib/utils"

interface WeeklyTimelineProps {
  deliveries: WeeklyDelivery[]
}

const DAYS_ORDER = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] as const

export default function WeeklyTimeline({ deliveries }: WeeklyTimelineProps) {
  const t = useTranslations("dashboard.weeklyTimeline")

  // Group deliveries by day
  const deliveriesByDay = DAYS_ORDER.reduce((acc, day) => {
    acc[day] = deliveries.filter(d => d.dayOfWeek === day)
    return acc
  }, {} as Record<string, WeeklyDelivery[]>)

  // Only show days that have deliveries or are close to days with deliveries
  const daysWithDeliveries = DAYS_ORDER.filter(day => deliveriesByDay[day].length > 0)

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20">
          <IconCalendarWeek className="h-4 w-4 text-brand-400" stroke={2} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-100">{t("title")}</h2>
          <p className="text-xs text-gray-500">
            {deliveries.length} {t("deliveriesThisWeek")}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-700" />

        <div className="space-y-4">
          {daysWithDeliveries.map((day) => (
            <div key={day} className="relative pl-8">
              {/* Day marker */}
              <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 border border-gray-700">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {t(`days.${day}`).slice(0, 2)}
                </span>
              </div>

              {/* Day label */}
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                {t(`days.${day}`)}
              </p>

              {/* Deliveries for this day */}
              <div className="space-y-2">
                {deliveriesByDay[day].map((delivery) => (
                  <DeliveryCard key={delivery.id} delivery={delivery} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {daysWithDeliveries.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-4">{t("noDeliveries")}</p>
      )}
    </div>
  )
}

interface DeliveryCardProps {
  delivery: WeeklyDelivery
}

function DeliveryCard({ delivery }: DeliveryCardProps) {
  const t = useTranslations("dashboard.weeklyTimeline")

  const statusIcon = {
    pending: IconCircle,
    in_progress: IconCircle,
    completed: IconCircleCheck,
    at_risk: IconAlertTriangle,
  }[delivery.status]

  const StatusIcon = statusIcon

  const statusStyles = {
    pending: "text-gray-500",
    in_progress: "text-blue-400",
    completed: "text-green-400",
    at_risk: "text-amber-400",
  }[delivery.status]

  const cardBorder = {
    pending: "border-gray-700",
    in_progress: "border-blue-500/30",
    completed: "border-green-500/30",
    at_risk: "border-amber-500/30",
  }[delivery.status]

  return (
    <div className={cn("rounded-lg border bg-gray-800/30 p-3", cardBorder)}>
      <div className="flex items-start gap-2">
        <StatusIcon className={cn("h-4 w-4 mt-0.5 shrink-0", statusStyles)} stroke={2} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-100 truncate">{delivery.milestoneName}</p>
          <p className="text-xs text-gray-400 truncate">
            {delivery.projectName} — {delivery.clientName}
          </p>
          
          {/* Progress */}
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 flex-1 rounded-full bg-gray-700">
              <div 
                className={cn(
                  "h-full rounded-full",
                  delivery.status === "at_risk" ? "bg-amber-500" : 
                  delivery.status === "completed" ? "bg-green-500" : "bg-blue-500"
                )}
                style={{ width: `${delivery.progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{delivery.progress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
