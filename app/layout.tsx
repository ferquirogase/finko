import type React from "react"
import { Geist } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import GoogleServices from "@/components/google-services"
import CookieConsentBanner from "@/components/cookie-consent-banner"

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-4132066770991120"

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="dark" suppressHydrationWarning>
      <head>
        <Script
          id="google-adsense"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Schema.org markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Finko - Herramientas para freelancers",
              url: "https://finkoapp.online/",
              description: "Calcula tarifas, genera presupuestos y crea facturas profesionales fácilmente",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              author: { "@type": "Person", name: "Fernando Quiroga" },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Finko",
              url: "https://finkoapp.online/",
              logo: "https://finkoapp.online/finko.png",
              sameAs: ["https://www.linkedin.com/in/ferquirogase/"],
            }),
          }}
        />
      </head>
      <body className={geist.className} suppressHydrationWarning>
        <GoogleServices />
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  )
}
