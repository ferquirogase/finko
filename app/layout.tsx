import type React from "react"
import { Outfit } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const outfit = Outfit({
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
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-WJQ2C9VR70" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WJQ2C9VR70');
          `}
        </Script>

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
      <body className={outfit.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
