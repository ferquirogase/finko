"use client"

import { useState } from "react"
import { IconCash, IconAlertTriangle, IconClock, IconLoader2, IconSparkles, IconCircleCheck } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import type { PaymentReminder } from "@/lib/mock-dashboard-data"
import { cn } from "@/lib/utils"
import { generateMessageWithAI } from "@/lib/ai/client"
import SuggestedMessage from "@/components/suggested-message"
import type { MessageDraft, MessageTone, MessageChannel } from "@/lib/mock-messages"

interface PaymentRemindersProps {
  reminders: PaymentReminder[]
}

export default function PaymentReminders({ reminders }: PaymentRemindersProps) {
  const t = useTranslations("dashboard.paymentReminders")

  const isEmpty = reminders.length === 0

  const overdueAmount = reminders
    .filter(r => r.status === "vencido" || r.status === "muy_vencido")
    .reduce((acc, r) => acc + r.amount, 0)

  const upcomingAmount = reminders
    .filter(r => r.status === "por_vencer")
    .reduce((acc, r) => acc + r.amount, 0)

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          isEmpty ? "bg-green-500/20" : "bg-green-500/20"
        )}>
          {isEmpty ? (
            <IconCircleCheck className="h-4 w-4 text-green-400" stroke={2} />
          ) : (
            <IconCash className="h-4 w-4 text-green-400" stroke={2} />
          )}
        </div>
        <h2 className="text-lg font-semibold text-gray-100">{t("title")}</h2>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm font-medium text-gray-300">{t("empty")}</p>
          <p className="mt-1 text-xs text-gray-500">{t("emptyDescription")}</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}

function PaymentCard({ reminder }: { reminder: PaymentReminder }) {
  const t = useTranslations("dashboard.paymentReminders")
  const [showMessage, setShowMessage] = useState(false)
  const [messageDraft, setMessageDraft] = useState<MessageDraft | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentChannel, setCurrentChannel] = useState<MessageChannel>("whatsapp")
  const [currentTone, setCurrentTone] = useState<MessageTone>("professional")

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

  const daysOverdue = reminder.daysUntilDue < 0 ? Math.abs(reminder.daysUntilDue) : 0
  const daysText = reminder.daysUntilDue < 0 
    ? `${daysOverdue} ${t("daysOverdue")}`
    : `${reminder.daysUntilDue} ${t("daysLeft")}`

  // Determine available tones based on overdue status
  const availableTones: MessageTone[] = daysOverdue > 14 
    ? ["firm", "professional"] 
    : ["friendly", "professional"]

  const generateMessage = async (channel: MessageChannel, tone: MessageTone) => {
    setIsGenerating(true)
    try {
      const scenario = tone === "firm" || daysOverdue > 14 
        ? "payment_reminder_firm" 
        : "payment_reminder_friendly"
      
      const response = await generateMessageWithAI(
        scenario,
        {
          clientName: reminder.clientName,
          projectName: reminder.projectName,
          amount: reminder.amount,
          currency: reminder.currency,
          daysOverdue,
          dueDate: reminder.dueDate,
          invoiceNumber: reminder.invoiceNumber,
        },
        channel,
        tone
      )
      
      setMessageDraft({
        scenario,
        channel,
        tone,
        subject: response.subject || undefined,
        body: response.body,
        placeholders: response.placeholders || [],
      })
      setShowMessage(true)
    } catch (error) {
      console.error("[Finko] Error generating payment reminder:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDraftMessage = () => {
    const defaultTone = daysOverdue > 14 ? "firm" : "professional"
    setCurrentTone(defaultTone)
    generateMessage(currentChannel, defaultTone)
  }

  const handleToneChange = (tone: MessageTone) => {
    setCurrentTone(tone)
    generateMessage(currentChannel, tone)
  }

  const handleChannelChange = (channel: MessageChannel) => {
    setCurrentChannel(channel)
    generateMessage(channel, currentTone)
  }

  return (
    <div className="space-y-2">
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

        <button 
          onClick={handleDraftMessage}
          disabled={isGenerating}
          className="shrink-0 flex items-center gap-1.5 rounded-lg bg-brand-500/20 px-3 py-1.5 text-xs font-medium text-brand-400 transition-colors hover:bg-brand-500/30 disabled:opacity-50"
        >
          {isGenerating ? (
            <IconLoader2 className="h-3.5 w-3.5 animate-spin" stroke={2} />
          ) : (
            <IconSparkles className="h-3.5 w-3.5" stroke={2} />
          )}
          {isGenerating ? "Generando..." : t("draftReminder")}
        </button>
      </div>

      {/* AI Generated message */}
      {showMessage && messageDraft && (
        <div className="ml-8 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-brand-400">
            <IconSparkles className="h-3 w-3" stroke={2} />
            <span>Generado con IA</span>
          </div>
          <SuggestedMessage
            draft={messageDraft}
            onToneChange={handleToneChange}
            onChannelChange={handleChannelChange}
            availableTones={availableTones}
            availableChannels={["whatsapp", "email"]}
          />
        </div>
      )}
    </div>
  )
}
