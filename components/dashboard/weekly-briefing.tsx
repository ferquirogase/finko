"use client"

import { IconTrendingUp, IconTrendingDown, IconMinus, IconAlertTriangle } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import type { WeeklyBriefing as WeeklyBriefingType } from "@/lib/mock-dashboard-data"
import { cn } from "@/lib/utils"

interface WeeklyBriefingProps {
  data: WeeklyBriefingType
}

export default function WeeklyBriefing({ data }: WeeklyBriefingProps) {
  const t = useTranslations("dashboard.weeklyBriefing")

  const TrendIcon = data.tendencia === "up" 
    ? IconTrendingUp 
    : data.tendencia === "down" 
      ? IconTrendingDown 
      : IconMinus

  const trendColor = data.tendencia === "up" 
    ? "text-green-400" 
    : data.tendencia === "down" 
      ? "text-red-400" 
      : "text-gray-400"

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20">
            <TrendIcon className={cn("h-4 w-4", trendColor)} stroke={2} />
          </div>
          <h2 className="text-lg font-semibold text-gray-100">{t("title")}</h2>
        </div>
        {data.alertasCriticas > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-1 text-xs font-medium text-red-400">
            <IconAlertTriangle className="h-3.5 w-3.5" stroke={2} />
            {data.alertasCriticas} {t("criticalAlerts")}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label={t("income")}
          value={`$${data.totalIngresos.toLocaleString()}`}
          trend={data.comparacionSemanaAnterior}
          trendLabel={t("vsLastWeek")}
        />
        <StatCard
          label={t("activeProjects")}
          value={data.proyectosActivos.toString()}
        />
        <StatCard
          label={t("proposalsSent")}
          value={data.propuestasEnviadas.toString()}
          subValue={`${data.tasaConversion}% ${t("conversionRate")}`}
        />
        <StatCard
          label={t("hoursLogged")}
          value={data.horasRegistradas.toString()}
        />
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  trend?: number
  trendLabel?: string
  subValue?: string
}

function StatCard({ label, value, trend, trendLabel, subValue }: StatCardProps) {
  return (
    <div className="rounded-xl bg-gray-800/50 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-100">{value}</p>
      {trend !== undefined && (
        <p className={cn(
          "mt-0.5 text-xs",
          trend >= 0 ? "text-green-400" : "text-red-400"
        )}>
          {trend >= 0 ? "+" : ""}{trend}% {trendLabel}
        </p>
      )}
      {subValue && (
        <p className="mt-0.5 text-xs text-gray-500">{subValue}</p>
      )}
    </div>
  )
}
