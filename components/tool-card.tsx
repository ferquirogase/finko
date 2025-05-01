"use client"

import type React from "react"
import Link from "next/link"
import type { TablerIconsProps } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  title: string
  description: string
  icon: React.FC<TablerIconsProps>
  href: string
  color: "purple" | "blue" | "green" | "amber"
  className?: string
}

export default function ToolCard({ title, description, icon: Icon, href, color, className }: ToolCardProps) {
  const colorClasses = {
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      icon: "bg-purple-100 text-purple-600",
      hover: "hover:border-purple-200 hover:bg-purple-100/50",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: "bg-blue-100 text-blue-600",
      hover: "hover:border-blue-200 hover:bg-blue-100/50",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      icon: "bg-green-100 text-green-600",
      hover: "hover:border-green-200 hover:bg-green-100/50",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      icon: "bg-amber-100 text-amber-600",
      hover: "hover:border-amber-200 hover:bg-amber-100/50",
    },
  }

  // Función para enviar evento al dataLayer cuando se hace clic en una herramienta
  const handleToolClick = () => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "tool_selection",
        tool_name: title,
        tool_path: href,
      })
    }
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col rounded-xl border p-5 transition-colors",
        colorClasses[color].bg,
        colorClasses[color].border,
        colorClasses[color].hover,
        className,
      )}
      onClick={handleToolClick}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", colorClasses[color].icon)}>
          <Icon className="h-5 w-5" stroke={1.5} />
        </div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  )
}
