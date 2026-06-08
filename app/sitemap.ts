import type { MetadataRoute } from "next"

const baseUrl = "https://finkoapp.online"

const routes = [
  { path: "", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/calculadora", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/presupuestos", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/recibos", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/pagos-exterior", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/privacidad", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return routes.flatMap(({ path, priority, changeFrequency }) => [
    {
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          es: `${baseUrl}${path}`,
          en: `${baseUrl}/en${path}`,
        },
      },
    },
  ])
}
