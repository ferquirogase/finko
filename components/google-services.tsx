"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

const CONSENT_KEY = "finko-cookie-consent"
const GA_ID = "G-WJQ2C9VR70"

export default function GoogleServices() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const syncConsent = () => {
      setEnabled(window.localStorage.getItem(CONSENT_KEY) === "accepted")
    }

    syncConsent()
    window.addEventListener("storage", syncConsent)
    window.addEventListener("finko-consent-updated", syncConsent as EventListener)

    return () => {
      window.removeEventListener("storage", syncConsent)
      window.removeEventListener("finko-consent-updated", syncConsent as EventListener)
    }
  }, [])

  if (!enabled) {
    return null
  }

  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
