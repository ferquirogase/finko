"use client"

import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"

const CONSENT_KEY = "finko-cookie-consent"

type ConsentState = "accepted" | "rejected" | null

export default function CookieConsentBanner() {
  const locale = useLocale()
  const isEnglish = locale === "en"
  const [consent, setConsent] = useState<ConsentState>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY) as ConsentState
    setConsent(saved)
    setHydrated(true)
  }, [])

  const updateConsent = (value: Exclude<ConsentState, null>) => {
    window.localStorage.setItem(CONSENT_KEY, value)
    window.dispatchEvent(new Event("finko-consent-updated"))
    setConsent(value)
  }

  if (!hydrated || consent) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="mx-auto max-w-3xl rounded-3xl border border-gray-800 bg-gray-950/95 p-4 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-400">
              {isEnglish ? "Cookies" : "Cookies"}
            </p>
            <p className="text-sm leading-6 text-gray-200">
              {isEnglish
                ? "Finko uses cookies and similar technologies for analytics and ads. You can accept or reject optional tracking."
                : "Finko usa cookies y tecnologias similares para analitica y anuncios. Podes aceptar o rechazar el seguimiento opcional."}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <Link href="/privacidad" className="transition-colors hover:text-brand-400">
                {isEnglish ? "Privacy policy" : "Politica de privacidad"}
              </Link>
              <Link href="/cookies" className="transition-colors hover:text-brand-400">
                {isEnglish ? "Cookie policy" : "Politica de cookies"}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => updateConsent("rejected")}
              className="rounded-full border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-gray-600 hover:bg-gray-900"
            >
              {isEnglish ? "Reject" : "Rechazar"}
            </button>
            <button
              type="button"
              onClick={() => updateConsent("accepted")}
              className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-400"
            >
              {isEnglish ? "Accept" : "Aceptar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
