import { IconCash, IconAlertTriangle, IconClock } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import type { PaymentReminder } from "@/lib/mock-dashboard-data"
import { cn } from "@/lib/utils"

interface PaymentRemindersProps {
  reminders: PaymentReminder[]
}

export default function PaymentReminders({ reminders }: PaymentRemindersProps) {
  const t = useTranslations("dashboard.paymentReminders")

  if (reminders.length === 0) return null

  const overdueAmount = reminders
    .filter(r => r.status === "vencido" || r.status === "muy_vencido")
    .reduce((acc, r) => acc + r.amount, 0)

  const upcomingAmount = reminders
    .filter(r => r.status === "por_vencer")
    .reduce((acc, r) => acc + r.amount, 0)

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20">
          <IconCash className="h-4 w-4 text-green-400" stroke={2} />
        </div>
        <h2 className="text-lg font-semibold text-gray-100">{t("title")}</h2>
      </div>

      {/* Summary */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {overdueAmount > 0 && (
          <div className="rounded-lg bg-red-500/10 p-3">
            <p className="text-xs text-red-400">{t("overdue")}</p>
            <p className="mt-1 text-lg font-bold text-red-400">${overdueAmount.toLocaleString()}</p>
          </div>
        )}
        {upcomingAmount > 0 && (
          <div className="rounded-lg bg-amber-500/10 p-3">
            <p className="text-xs text-amber-400">{t("upcoming")}</p>
            <p className="mt-1 text-lg font-bold text-amber-400">${upcomingAmount.toLocaleString()}</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {reminders.map((reminder) => (
          <PaymentCard key={reminder.id} reminder={reminder} />
        ))}
      </div>
    </div>
  )
}

function PaymentCard({ reminder }: { reminder: PaymentReminder }) {
  const t = useTranslations("dashboard.paymentReminders")

  const statusStyles = {
    por_vencer: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/5",
      badge: "bg-amber-500/20 text-amber-400",
      icon: IconClock,
      iconColor: "text-amber-400",
    },
    vencido: {
      border: "border-red-500/30",
      bg: "bg-red-500/5",
      badge: "bg-red-500/20 text-red-400",
      icon: IconAlertTriangle,
      iconColor: "text-red-400",
    },
    muy_vencido: {
      border: "border-red-600/30",
      bg: "bg-red-600/5",
      badge: "bg-red-600/20 text-red-500",
      icon: IconAlertTriangle,
      iconColor: "text-red-500",
    },
  }

  const styles = statusStyles[reminder.status]
  const Icon = styles.icon

  const daysText = reminder.daysUntilDue < 0 
    ? `${Math.abs(reminder.daysUntilDue)} ${t("daysOverdue")}`
    : `${reminder.daysUntilDue} ${t("daysLeft")}`

  return (
    <div className={cn(
      "flex items-center gap-3 rounded-xl border p-3",
      styles.border,
      styles.bg
    )}>
      <div className={cn("shrink-0", styles.iconColor)}>
        <Icon className="h-5 w-5" stroke={1.5} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-gray-100 truncate">{reminder.clientName}</p>
          <span className="shrink-0 text-sm font-semibold text-gray-100">
            ${reminder.amount.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-gray-400 truncate">{reminder.projectName}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", styles.badge)}>
            {daysText}
          </span>
          {reminder.invoiceNumber && (
            <span className="text-xs text-gray-500">{reminder.invoiceNumber}</span>
          )}
        </div>
      </div>

      <button className="shrink-0 rounded-lg bg-gray-700/50 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-gray-100">
        {t("sendReminder")}
      </button>
    </div>
  )
}
