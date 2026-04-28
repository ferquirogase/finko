"use client"

import { useState } from "react"
import { IconUsers, IconMail, IconBrandWhatsapp, IconPhone, IconCheck, IconClock, IconMessage } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import type { FollowUpItem } from "@/lib/mock-dashboard-data"
import { cn } from "@/lib/utils"
import { generateFollowUpMessage, type MessageDraft, type MessageTone, type MessageChannel } from "@/lib/mock-messages"
import SuggestedMessage from "@/components/suggested-message"

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
  const [showMessage, setShowMessage] = useState(false)
  const [messageDraft, setMessageDraft] = useState<MessageDraft | null>(null)
  const [currentTone, setCurrentTone] = useState<MessageTone>("professional")
  const [currentChannel, setCurrentChannel] = useState<MessageChannel>(
    item.channel === "whatsapp" ? "whatsapp" : "email"
  )

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

  const handleDraftMessage = () => {
    const draft = generateFollowUpMessage(
      item.clientName,
      item.projectName || "tu proyecto",
      currentChannel,
      currentTone
    )
    setMessageDraft(draft)
    setShowMessage(true)
  }

  const handleToneChange = (tone: MessageTone) => {
    setCurrentTone(tone)
    const draft = generateFollowUpMessage(
      item.clientName,
      item.projectName || "tu proyecto",
      currentChannel,
      tone
    )
    setMessageDraft(draft)
  }

  const handleChannelChange = (channel: MessageChannel) => {
    setCurrentChannel(channel)
    const draft = generateFollowUpMessage(
      item.clientName,
      item.projectName || "tu proyecto",
      channel,
      currentTone
    )
    setMessageDraft(draft)
  }

  return (
    <div className="space-y-2">
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
          <button 
            onClick={handleDraftMessage}
            className="shrink-0 flex items-center gap-1.5 rounded-lg bg-brand-500/20 px-3 py-1.5 text-xs font-medium text-brand-400 transition-colors hover:bg-brand-500/30"
          >
            <IconMessage className="h-3.5 w-3.5" stroke={2} />
            {t("draftMessage")}
          </button>
        )}
      </div>

      {/* Suggested message */}
      {showMessage && messageDraft && (
        <SuggestedMessage
          draft={messageDraft}
          onToneChange={handleToneChange}
          onChannelChange={handleChannelChange}
          availableTones={["professional", "friendly"]}
          availableChannels={["whatsapp", "email"]}
          className="ml-8"
        />
      )}
    </div>
  )
}
