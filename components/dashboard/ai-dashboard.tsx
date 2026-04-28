"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations } from "next-intl"
import { IconSparkles, IconLoader2, IconRefresh } from "@tabler/icons-react"
import { generateDashboardInsights, type DashboardInsights, type DashboardContext } from "@/lib/ai/client"
import TodayPriorities from "./today-priorities"
import UrgentAlerts from "./urgent-alerts"
import RecommendedActions from "./recommended-actions"
import {
  mockTodayPriorities,
  mockUrgentAlerts,
  mockRecommendedActions,
  mockActiveProjects,
  mockPaymentReminders,
  mockFollowUpQueue,
} from "@/lib/mock-dashboard-data"

interface AIDashboardProps {
  section: "today" | "week"
}

// Transform mock data to the context format expected by AI
function buildContext(): DashboardContext {
  return {
    projects: mockActiveProjects.map(p => ({
      id: p.id,
      name: p.name,
      clientName: p.clientName,
      status: p.status,
      progress: p.progress,
      daysLeft: p.daysLeft,
      totalValue: p.totalValue,
    })),
    payments: mockPaymentReminders.map(p => ({
      id: p.id,
      clientName: p.clientName,
      projectName: p.projectName,
      amount: p.amount,
      currency: p.currency,
      daysUntilDue: p.daysUntilDue,
      status: p.status,
    })),
    followUps: mockFollowUpQueue.map(f => ({
      id: f.id,
      clientName: f.clientName,
      projectName: f.projectName,
      daysSinceContact: f.daysSinceContact,
      suggestedAction: f.suggestedAction,
    })),
  }
}

export function AIDashboardToday() {
  const t = useTranslations("dashboard")
  const [insights, setInsights] = useState<DashboardInsights | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadInsights = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const context = buildContext()
      const result = await generateDashboardInsights(context)
      setInsights(result)
    } catch (err) {
      console.error("[Finko] Error loading AI insights:", err)
      setError(err instanceof Error ? err.message : "Error al cargar insights")
      // Keep showing mock data on error
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInsights()
  }, [loadInsights])

  // Transform AI insights to component format
  const priorities = insights?.todayPriorities.map(p => ({
    id: p.id,
    type: p.type,
    title: p.title,
    description: p.description,
    clientName: p.clientName || undefined,
    projectName: p.projectName || undefined,
    dueTime: p.dueTime || undefined,
    urgencyLevel: p.urgencyLevel,
    whyNow: p.whyNow,
    impact: p.impact || undefined,
    completed: false,
  })) || mockTodayPriorities

  return (
    <div className="space-y-4">
      {/* AI Status indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-xs text-brand-400">
              <IconLoader2 className="h-3.5 w-3.5 animate-spin" stroke={2} />
              <span>Finko esta analizando...</span>
            </div>
          ) : insights ? (
            <div className="flex items-center gap-2 text-xs text-brand-400">
              <IconSparkles className="h-3.5 w-3.5" stroke={2} />
              <span>Generado con IA</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <span>Usando datos de ejemplo</span>
            </div>
          ) : null}
        </div>
        
        {!isLoading && (
          <button
            onClick={loadInsights}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
          >
            <IconRefresh className="h-3.5 w-3.5" stroke={2} />
            Actualizar
          </button>
        )}
      </div>

      {/* Today's Priorities */}
      <TodayPriorities priorities={priorities} />

      {/* Weekly insight from AI */}
      {insights?.weeklyInsight && (
        <div className="flex items-start gap-3 rounded-xl border border-brand-500/20 bg-brand-500/5 p-4">
          <IconSparkles className="h-5 w-5 shrink-0 text-brand-400 mt-0.5" stroke={2} />
          <div>
            <p className="text-sm font-medium text-gray-200">Insight de la semana</p>
            <p className="mt-1 text-sm text-gray-400">{insights.weeklyInsight}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function AIDashboardAlerts() {
  const [insights, setInsights] = useState<DashboardInsights | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const context = buildContext()
        const result = await generateDashboardInsights(context)
        setInsights(result)
      } catch (err) {
        console.error("[Finko] Error loading AI alerts:", err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // Transform AI insights to component format
  const alerts = insights?.urgentAlerts.map(a => ({
    id: a.id,
    type: a.type.replace('_', '') as any, // Convert underscore format
    title: a.title,
    description: a.description,
    severity: a.severity,
    clientName: a.clientName || undefined,
    projectName: a.projectName || undefined,
    amount: a.amount || undefined,
    daysOverdue: a.daysOverdue || undefined,
  })) || mockUrgentAlerts

  const actions = insights?.recommendedActions.map(a => ({
    id: a.id,
    type: a.type,
    title: a.title,
    description: a.description,
    reason: a.reason,
    clientName: a.clientName || undefined,
    suggestedDate: a.suggestedDate || undefined,
    actionLabel: a.actionLabel,
    linkedTool: a.linkedTool || undefined,
  })) || mockRecommendedActions

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
          <div className="flex items-center justify-center py-8">
            <IconLoader2 className="h-6 w-6 animate-spin text-brand-400" stroke={2} />
          </div>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
          <div className="flex items-center justify-center py-8">
            <IconLoader2 className="h-6 w-6 animate-spin text-brand-400" stroke={2} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <UrgentAlerts alerts={alerts} />
      <RecommendedActions actions={actions} />
    </div>
  )
}
