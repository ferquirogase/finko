"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import type { DataSource, ConfidenceInfo, LinkedAction } from "@/types/new-client"
import {
  IconCheck,
  IconSearch,
  IconQuestionMark,
  IconPencil,
  IconX,
  IconExternalLink,
  IconCopy,
  IconChevronRight,
} from "@tabler/icons-react"

// DecisionBadge - Visual indicator for data source confidence
interface DecisionBadgeProps {
  source: DataSource
  confidence?: number
  reason?: string
  showTooltip?: boolean
  size?: "sm" | "md"
}

export function DecisionBadge({
  source,
  confidence,
  reason,
  showTooltip = true,
  size = "sm",
}: DecisionBadgeProps) {
  const t = useTranslations("decision")
  const [showReason, setShowReason] = useState(false)

  const config: Record<DataSource, { icon: typeof IconCheck; color: string; label: string }> = {
    detected: {
      icon: IconCheck,
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      label: t("detected"),
    },
    inferred: {
      icon: IconSearch,
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      label: t("inferred"),
    },
    assumption: {
      icon: IconQuestionMark,
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      label: t("assumption"),
    },
  }

  const { icon: Icon, color, label } = config[source]
  const sizeClasses = size === "sm" ? "text-[10px] px-1.5 py-0.5 gap-0.5" : "text-xs px-2 py-1 gap-1"
  const iconSize = size === "sm" ? 10 : 12

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => showTooltip && setShowReason(!showReason)}
        className={`inline-flex items-center rounded border ${color} ${sizeClasses} font-medium transition-opacity hover:opacity-80`}
      >
        <Icon size={iconSize} stroke={2} />
        <span>{label}</span>
        {confidence !== undefined && (
          <span className="opacity-70">{confidence}%</span>
        )}
      </button>
      
      {showReason && reason && (
        <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-gray-700 bg-gray-800 p-2 text-xs text-gray-300 shadow-lg">
          {reason}
          <button
            type="button"
            onClick={() => setShowReason(false)}
            className="absolute right-1 top-1 text-gray-500 hover:text-gray-300"
          >
            <IconX size={12} />
          </button>
        </div>
      )}
    </div>
  )
}

// EditableField - Inline editable field with confidence badge
interface EditableFieldProps {
  value: string | number | undefined
  onChange: (value: string) => void
  confidence?: ConfidenceInfo
  placeholder?: string
  multiline?: boolean
  className?: string
  inputClassName?: string
  showBadge?: boolean
  prefix?: string
  suffix?: string
}

export function EditableField({
  value,
  onChange,
  confidence,
  placeholder,
  multiline = false,
  className = "",
  inputClassName = "",
  showBadge = true,
  prefix,
  suffix,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(String(value ?? ""))
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setLocalValue(String(value ?? ""))
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleBlur = () => {
    setIsEditing(false)
    if (localValue !== String(value ?? "")) {
      onChange(localValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleBlur()
    }
    if (e.key === "Escape") {
      setLocalValue(String(value ?? ""))
      setIsEditing(false)
    }
  }

  if (isEditing) {
    const inputClasses = `w-full rounded-lg border border-brand-500/50 bg-gray-800 px-3 py-2 text-white outline-none focus:border-brand-400 ${inputClassName}`
    
    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`${inputClasses} min-h-[100px] resize-y`}
        rows={4}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputClasses}
      />
    )
  }

  return (
    <div className={`group flex items-start gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="flex-1 text-left transition-colors hover:text-brand-300"
      >
        <span className={value ? "text-white" : "text-gray-500"}>
          {prefix}
          {value ?? placeholder}
          {suffix}
        </span>
        <IconPencil
          size={14}
          className="ml-1.5 inline-block text-gray-600 opacity-0 transition-opacity group-hover:opacity-100"
        />
      </button>
      {showBadge && confidence && (
        <DecisionBadge
          source={confidence.source}
          confidence={confidence.level}
          reason={confidence.reason}
        />
      )}
    </div>
  )
}

// EditableList - For editing arrays like deliverables
interface EditableListProps {
  items: string[]
  onChange: (items: string[]) => void
  confidence?: ConfidenceInfo
  addLabel?: string
}

export function EditableList({ items, onChange, confidence, addLabel = "Agregar" }: EditableListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newItem, setNewItem] = useState("")

  const handleEdit = (index: number, value: string) => {
    const updated = [...items]
    updated[index] = value
    onChange(updated)
    setEditingIndex(null)
  }

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const handleAdd = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()])
      setNewItem("")
    }
  }

  return (
    <div className="space-y-2">
      {confidence && (
        <DecisionBadge
          source={confidence.source}
          confidence={confidence.level}
          reason={confidence.reason}
        />
      )}
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li key={index} className="group flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
            {editingIndex === index ? (
              <input
                type="text"
                defaultValue={item}
                autoFocus
                onBlur={(e) => handleEdit(index, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEdit(index, e.currentTarget.value)
                  if (e.key === "Escape") setEditingIndex(null)
                }}
                className="flex-1 rounded border border-brand-500/50 bg-gray-800 px-2 py-1 text-sm text-white outline-none"
              />
            ) : (
              <>
                <span className="flex-1 text-sm text-gray-300">{item}</span>
                <button
                  type="button"
                  onClick={() => setEditingIndex(index)}
                  className="text-gray-600 opacity-0 transition-opacity hover:text-brand-400 group-hover:opacity-100"
                >
                  <IconPencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-gray-600 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                >
                  <IconX size={14} />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="flex gap-2 pt-1">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={addLabel}
          className="flex-1 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:border-brand-500/50"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newItem.trim()}
          className="rounded-lg bg-brand-500/20 px-3 py-1.5 text-sm font-medium text-brand-400 transition-colors hover:bg-brand-500/30 disabled:opacity-50"
        >
          {addLabel}
        </button>
      </div>
    </div>
  )
}

// ActionButton - Contextual action with linked tool
interface ActionButtonProps {
  action: LinkedAction
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md"
  onCopy?: () => void
}

export function ActionButton({ action, variant = "secondary", size = "md", onCopy }: ActionButtonProps) {
  const [copied, setCopied] = useState(false)

  const baseClasses = "inline-flex items-center gap-1.5 font-medium transition-all rounded-lg"
  const sizeClasses = size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-4 py-2 text-sm"
  const variantClasses = {
    primary: "bg-brand-500 text-white hover:bg-brand-600",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    ghost: "text-brand-400 hover:bg-brand-500/10",
  }

  const handleClick = () => {
    if (action.tool === "whatsapp" || action.tool === "email") {
      // Copy action
      if (onCopy) {
        onCopy()
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
      return
    }
  }

  if (action.href) {
    return (
      <Link
        href={action.href}
        className={`${baseClasses} ${sizeClasses} ${variantClasses[variant]}`}
      >
        {action.label}
        <IconChevronRight size={size === "sm" ? 14 : 16} />
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseClasses} ${sizeClasses} ${variantClasses[variant]}`}
    >
      {copied ? (
        <>
          <IconCheck size={size === "sm" ? 14 : 16} />
          Copiado
        </>
      ) : (
        <>
          {action.tool === "whatsapp" || action.tool === "email" ? (
            <IconCopy size={size === "sm" ? 14 : 16} />
          ) : (
            <IconExternalLink size={size === "sm" ? 14 : 16} />
          )}
          {action.label}
        </>
      )}
    </button>
  )
}

// ConfidenceMeter - Visual confidence indicator
interface ConfidenceMeterProps {
  score: number
  showLabel?: boolean
}

export function ConfidenceMeter({ score, showLabel = true }: ConfidenceMeterProps) {
  const t = useTranslations("decision")
  
  const getColor = () => {
    if (score >= 80) return "bg-emerald-500"
    if (score >= 60) return "bg-blue-500"
    if (score >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getLabel = () => {
    if (score >= 80) return t("confidenceHigh")
    if (score >= 60) return t("confidenceMedium")
    if (score >= 40) return t("confidenceLow")
    return t("confidenceVeryLow")
  }

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-700">
        <div
          className={`h-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-gray-400">
        {score}%
        {showLabel && <span className="ml-1 text-gray-500">({getLabel()})</span>}
      </span>
    </div>
  )
}
