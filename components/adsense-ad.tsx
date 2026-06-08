"use client"

import { useEffect, useId } from "react"

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

type AdSenseAdProps = {
  slot?: string
  format?: "auto" | "rectangle" | "horizontal" | "vertical"
  className?: string
}

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-4132066770991120"

export default function AdSenseAd({ slot, format = "auto", className }: AdSenseAdProps) {
  const adId = useId()

  useEffect(() => {
    if (!adsenseClient || !slot) {
      return
    }

    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      // Ignore duplicate initialization errors from route transitions.
    }
  }, [slot])

  if (!adsenseClient || !slot) {
    return null
  }

  return (
    <section aria-label="Advertisement" className={className}>
      <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.24em] text-gray-500">
        Advertisement
      </p>
      <ins
        key={adId}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={adsenseClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </section>
  )
}
