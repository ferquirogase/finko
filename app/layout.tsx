import type React from "react"
import { Inclusive_Sans } from "next/font/google"
import "./globals.css"

const inclusiveSans = Inclusive_Sans({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export const metadata = {
  title: "finko - Herramientas para freelancers",
  description: "Calcula tarifas, genera presupuestos y crea facturas profesionales fácilmente",
  icons: {
    icon: [{ url: "/finko-fav.png" }, { url: "/icon.png" }],
    apple: [{ url: "/pwa/apple-icon-180.png" }],
  },
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        {/* Schema.org markup para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Finko - Herramientas para freelancers",
              url: "https://finko.app/",
              description: "Calcula tarifas, genera presupuestos y crea facturas profesionales fácilmente",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Person",
                name: "Fernando Quiroga",
              },
            }),
          }}
        />

        {/* Schema.org markup para Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Finko",
              url: "https://finko.app/",
              logo: "https://finko.app/finko.png",
              sameAs: ["https://www.linkedin.com/in/ferquirogase/"],
            }),
          }}
        />
      </head>
      <body className={inclusiveSans.className}>{children}</body>
    </html>
  )
}
