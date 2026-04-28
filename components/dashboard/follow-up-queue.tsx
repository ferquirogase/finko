import { IconUsers, IconMail, IconBrandWhatsapp, IconPhone, IconCheck, IconClock } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import type { FollowUpItem } from "@/lib/mock-dashboard-data"
import { cn } from "@/lib/utils"

interface FollowUpQueueProps {
  items: FollowUpItem[]
}

export default function FollowUpQueue({ items }: FollowUpQueueProps) {
  const t = useTranslations("dashboard.followUpQueue")

  if (items.length === 0) return null

  const pendingCount = items.filter(i => i.status === "pending").length

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
          <IconUsers className="h-4 w-4 text-blue-400" stroke={2} />
        </div>
        <h2 className="text-lg font-semibold text-gray-100">{t("title")}</h2>
        {pendingCount > 0 && (
          <span className="ml-auto rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
            {pendingCount} {t("pending")}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <FollowUpCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

function FollowUpCard({ item }: { item: FollowUpItem }) {
  const t = useTranslations("dashboard.followUpQueue")

  const channelIcons = {
    email: IconMail,
    whatsapp: IconBrandWhatsapp,
    llamada: IconPhone,
  }

  const channelColors = {
    email: "text-blue-400",
    whatsapp: "text-green-400",
    llamada: "text-amber-400",
  }

  const statusStyles = {
    pending: "border-gray-700/50 bg-gray-800/30",
    scheduled: "border-blue-500/30 bg-blue-500/5",
    completed: "border-green-500/30 bg-green-500/5 opacity-60",
  }

  const ChannelIcon = channelIcons[item.channel]

  return (
    <div className={cn(
      "flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-gray-600",
      statusStyles[item.status]
    )}>
      <div className={cn("shrink-0", channelColors[item.channel])}>
        <ChannelIcon className="h-5 w-5" stroke={1.5} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-100 truncate">{item.clientName}</p>
          {item.status === "scheduled" && (
            <IconClock className="h-3.5 w-3.5 text-blue-400" stroke={2} />
          )}
          {item.status === "completed" && (
            <IconCheck className="h-3.5 w-3.5 text-green-400" stroke={2} />
          )}
        </div>
        <p className="text-sm text-gray-400 truncate">{item.suggestedAction}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
          {item.projectName && (
            <>
              <span>{item.projectName}</span>
              <span>•</span>
            </>
          )}
          <span>{item.daysSinceContact} {t("daysAgo")}</span>
        </div>
      </div>

      {item.status === "pending" && (
        <button className="shrink-0 rounded-lg bg-gray-700/50 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-gray-100">
          {t("contact")}
        </button>
      )}
    </div>
  )
}
