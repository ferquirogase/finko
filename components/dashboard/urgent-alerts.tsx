import { IconAlertCircle, IconClock, IconMessageCircle, IconReceipt, IconCircleCheck } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import type { UrgentAlert } from "@/lib/mock-dashboard-data"
import { cn } from "@/lib/utils"

interface UrgentAlertsProps {
  alerts: UrgentAlert[]
}

export default function UrgentAlerts({ alerts }: UrgentAlertsProps) {
  const t = useTranslations("dashboard.urgentAlerts")

  const isEmpty = alerts.length === 0

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          isEmpty ? "bg-green-500/20" : "bg-red-500/20"
        )}>
          {isEmpty ? (
            <IconCircleCheck className="h-4 w-4 text-green-400" stroke={2} />
          ) : (
            <IconAlertCircle className="h-4 w-4 text-red-400" stroke={2} />
          )}
        </div>
        <h2 className="text-lg font-semibold text-gray-100">{t("title")}</h2>
        {!isEmpty && (
          <span className="ml-auto rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
            {alerts.length}
          </span>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm font-medium text-gray-300">{t("empty")}</p>
          <p className="mt-1 text-xs text-gray-500">{t("emptyDescription")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  )
}

function AlertCard({ alert }: { alert: UrgentAlert }) {
  const t = useTranslations("dashboard.urgentAlerts")

  const iconMap = {
    pago_vencido: IconReceipt,
    deadline_proximo: IconClock,
    cliente_sin_respuesta: IconMessageCircle,
    factura_pendiente: IconReceipt,
  }

  const colorMap = {
    high: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      icon: "text-red-400",
      badge: "bg-red-500/20 text-red-400",
    },
    medium: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      icon: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-400",
    },
    low: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      icon: "text-blue-400",
      badge: "bg-blue-500/20 text-blue-400",
    },
  }

  const Icon = iconMap[alert.type]
  const colors = colorMap[alert.priority]

  return (
    <div className={cn(
      "flex items-start gap-3 rounded-xl border p-3",
      colors.bg,
      colors.border
    )}>
      <div className={cn("mt-0.5", colors.icon)}>
        <Icon className="h-5 w-5" stroke={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-gray-100">{alert.title}</p>
            <p className="mt-0.5 text-sm text-gray-400">{alert.description}</p>
            {alert.clientName && (
              <p className="mt-1 text-xs text-gray-500">{alert.clientName}</p>
            )}
          </div>
          {alert.amount && (
            <span className="shrink-0 text-sm font-semibold text-gray-100">
              ${alert.amount.toLocaleString()} {alert.currency}
            </span>
          )}
        </div>
        <button 
          className={cn(
            "mt-3 inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            colors.badge,
            "hover:opacity-80"
          )}
        >
          {alert.actionLabel}
        </button>
      </div>
    </div>
  )
}
