"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { useTransition } from "react"

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const toggle = () => {
    const nextLocale = locale === "es" ? "en" : "es"
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="text-xs font-semibold text-gray-500 hover:text-gray-200 transition-colors px-2.5 py-1 rounded-lg border border-gray-800 hover:border-gray-600 disabled:opacity-50"
    >
      {locale === "es" ? "EN" : "ES"}
    </button>
  )
}
