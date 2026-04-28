import { 
  IconBriefcase,
  IconClock,
  IconAlertTriangle,
  IconCircleCheck,
  IconArrowRight
} from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import type { ActiveProject } from "@/lib/mock-dashboard-data"
import { cn } from "@/lib/utils"

interface ActiveProjectsProps {
  projects: ActiveProject[]
}

export default function ActiveProjects({ projects }: ActiveProjectsProps) {
  const t = useTranslations("dashboard.activeProjects")

  const totalValue = projects.reduce((sum, p) => sum + p.totalValue, 0)

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20">
            <IconBriefcase className="h-4 w-4 text-brand-400" stroke={2} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-100">{t("title")}</h2>
            <p className="text-xs text-gray-500">
              {projects.length} {t("projects")} — ${totalValue.toLocaleString()} USD {t("total")}
            </p>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

interface ProjectCardProps {
  project: ActiveProject
}

function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations("dashboard.activeProjects")

  const statusStyles = {
    en_progreso: "bg-blue-500/20 text-blue-400",
    esperando_feedback: "bg-amber-500/20 text-amber-400",
    por_entregar: "bg-green-500/20 text-green-400",
    en_revision: "bg-purple-500/20 text-purple-400",
  }[project.status]

  const healthIcon = {
    on_track: IconCircleCheck,
    at_risk: IconAlertTriangle,
    delayed: IconAlertTriangle,
  }[project.healthStatus]

  const HealthIcon = healthIcon

  const healthStyles = {
    on_track: "text-green-400",
    at_risk: "text-amber-400",
    delayed: "text-red-400",
  }[project.healthStatus]

  const progressBarColor = {
    on_track: "bg-green-500",
    at_risk: "bg-amber-500",
    delayed: "bg-red-500",
  }[project.healthStatus]

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-800/30 p-4">
      {/* Top Row: Client, Status, Health */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h3 className="font-medium text-gray-100 truncate">{project.projectName}</h3>
          <p className="text-sm text-gray-400">{project.clientName}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", statusStyles)}>
            {t(`status.${project.status}`)}
          </span>
          <HealthIcon className={cn("h-4 w-4", healthStyles)} stroke={2} />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">{t("progress")}</span>
          <span className="text-xs font-medium text-gray-300">{project.progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-700">
          <div 
            className={cn("h-full rounded-full transition-all duration-300", progressBarColor)}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Info Row: Days, Value */}
      <div className="flex items-center gap-4 mb-3 text-xs">
        <div className="flex items-center gap-1 text-gray-400">
          <IconClock className="h-3.5 w-3.5" stroke={2} />
          {project.daysRemaining > 0 ? (
            <span>{project.daysRemaining} {t("daysLeft")}</span>
          ) : (
            <span className="text-amber-400">{t("delivered")}</span>
          )}
        </div>
        <span className="text-gray-500">|</span>
        <span className="text-gray-300 font-medium">
          ${project.totalValue.toLocaleString()} {project.currency}
        </span>
      </div>

      {/* Health Warning */}
      {project.healthReason && project.healthStatus !== "on_track" && (
        <div className={cn(
          "rounded-lg px-3 py-2 mb-3 text-xs",
          project.healthStatus === "at_risk" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
        )}>
          {project.healthReason}
        </div>
      )}

      {/* Next Milestone */}
      {project.nextMilestone && (
        <div className="rounded-lg bg-gray-800/50 px-3 py-2 mb-3">
          <p className="text-xs text-gray-500 mb-0.5">{t("nextMilestone")}</p>
          <p className="text-sm text-gray-200 font-medium">{project.nextMilestone.name}</p>
          <p className="text-xs text-gray-400">
            {project.nextMilestone.daysUntilDue > 0 
              ? `${t("in")} ${project.nextMilestone.daysUntilDue} ${t("days")}`
              : t("today")
            }
          </p>
        </div>
      )}

      {/* Next Action Button */}
      {project.nextAction.actionHref ? (
        <Link
          href={project.nextAction.actionHref}
          className="flex items-center justify-between w-full rounded-lg bg-brand-500/10 px-3 py-2 text-sm transition-colors hover:bg-brand-500/20 group"
        >
          <span className="text-gray-300">{project.nextAction.description}</span>
          <IconArrowRight className="h-4 w-4 text-brand-400 transition-transform group-hover:translate-x-0.5" stroke={2} />
        </Link>
      ) : (
        <button className="flex items-center justify-between w-full rounded-lg bg-brand-500/10 px-3 py-2 text-sm transition-colors hover:bg-brand-500/20 group text-left">
          <span className="text-gray-300">{project.nextAction.description}</span>
          <span className="text-brand-400 font-medium shrink-0">{project.nextAction.actionLabel}</span>
        </button>
      )}
    </div>
  )
}
