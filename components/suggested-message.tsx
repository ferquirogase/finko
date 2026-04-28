"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  IconBrandWhatsapp,
  IconMail,
  IconCopy,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconX,
} from "@tabler/icons-react"
import type { MessageDraft, MessageTone, MessageChannel } from "@/lib/mock-messages"

interface SuggestedMessageProps {
  draft: MessageDraft
  onToneChange?: (tone: MessageTone) => void
  onChannelChange?: (channel: MessageChannel) => void
  availableTones?: MessageTone[]
  availableChannels?: MessageChannel[]
  compact?: boolean
  className?: string
}

export default function SuggestedMessage({
  draft,
  onToneChange,
  onChannelChange,
  availableTones = ["professional", "friendly"],
  availableChannels = ["whatsapp", "email"],
  compact = false,
  className = "",
}: SuggestedMessageProps) {
  const t = useTranslations("messages")
  const [isExpanded, setIsExpanded] = useState(!compact)
  const [isCopied, setIsCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedBody, setEditedBody] = useState(draft.body)

  const handleCopy = async () => {
    const textToCopy = draft.subject 
      ? `${draft.subject}\n\n${editedBody}` 
      : editedBody
    
    await navigator.clipboard.writeText(textToCopy)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const channelIcon = draft.channel === "whatsapp" 
    ? <IconBrandWhatsapp className="h-4 w-4" stroke={1.5} />
    : <IconMail className="h-4 w-4" stroke={1.5} />

  const channelColor = draft.channel === "whatsapp"
    ? "text-green-400"
    : "text-blue-400"

  if (compact && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`flex items-center gap-2 rounded-lg border border-gray-700/50 bg-gray-800/30 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-brand-500/30 hover:bg-gray-800/50 ${className}`}
      >
        <IconMail className="h-4 w-4 text-brand-400" stroke={1.5} />
        <span>{t("suggestDraft")}</span>
        <IconChevronDown className="h-3 w-3 text-gray-500" stroke={2} />
      </button>
    )
  }

  return (
    <div className={`rounded-xl border border-gray-700/50 bg-gray-800/40 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 ${channelColor}`}>
            {channelIcon}
            <span className="text-sm font-medium">
              {t(`channels.${draft.channel}`)}
            </span>
          </div>
          
          {/* Channel toggle */}
          {availableChannels.length > 1 && onChannelChange && (
            <div className="flex items-center rounded-lg bg-gray-900/50 p-0.5">
              {availableChannels.map((ch) => (
                <button
                  key={ch}
                  onClick={() => onChannelChange(ch)}
                  className={`rounded-md px-2 py-1 text-xs transition-colors ${
                    draft.channel === ch
                      ? "bg-gray-700 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {ch === "whatsapp" ? "WA" : "Email"}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Tone selector */}
          {availableTones.length > 1 && onToneChange && (
            <div className="flex items-center rounded-lg bg-gray-900/50 p-0.5">
              {availableTones.map((tone) => (
                <button
                  key={tone}
                  onClick={() => onToneChange(tone)}
                  className={`rounded-md px-2 py-1 text-xs transition-colors ${
                    draft.tone === tone
                      ? "bg-brand-500/20 text-brand-400"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {t(`tones.${tone}`)}
                </button>
              ))}
            </div>
          )}

          {compact && (
            <button
              onClick={() => setIsExpanded(false)}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-700/50 hover:text-gray-300"
            >
              <IconX className="h-4 w-4" stroke={2} />
            </button>
          )}
        </div>
      </div>

      {/* Subject (for emails) */}
      {draft.subject && (
        <div className="border-b border-gray-700/30 px-4 py-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">{t("subject")}:</span>
            <span className="text-gray-300">{draft.subject}</span>
          </div>
        </div>
      )}

      {/* Message body */}
      <div className="p-4">
        {isEditing ? (
          <textarea
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
            className="w-full min-h-[200px] rounded-lg border border-gray-600 bg-gray-900/50 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
          />
        ) : (
          <div className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
            {editedBody}
          </div>
        )}

        {/* Placeholders warning */}
        {draft.placeholders.length > 0 && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
            <span className="font-medium">{t("fillPlaceholders")}:</span>
            <span className="text-amber-300/80">
              {draft.placeholders.map(p => `{${p}}`).join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-gray-700/50 px-4 py-3">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-gray-200"
        >
          <IconEdit className="h-4 w-4" stroke={1.5} />
          {isEditing ? t("done") : t("edit")}
        </button>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
            isCopied
              ? "bg-green-500/20 text-green-400"
              : "bg-brand-500/20 text-brand-400 hover:bg-brand-500/30"
          }`}
        >
          {isCopied ? (
            <>
              <IconCheck className="h-4 w-4" stroke={2} />
              {t("copied")}
            </>
          ) : (
            <>
              <IconCopy className="h-4 w-4" stroke={1.5} />
              {t("copy")}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// Compact inline version for cards
export function InlineMessageTrigger({
  label,
  onClick,
  className = "",
}: {
  label?: string
  onClick: () => void
  className?: string
}) {
  const t = useTranslations("messages")
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg border border-gray-700/50 bg-gray-800/30 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-brand-500/30 hover:bg-gray-800/50 hover:text-brand-400 ${className}`}
    >
      <IconMail className="h-3.5 w-3.5" stroke={1.5} />
      {label || t("draftMessage")}
    </button>
  )
}
