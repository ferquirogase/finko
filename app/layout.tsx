import type React from "react"
import { Outfit } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      <body className={outfit.className}>{children}</body>
    </html>
  )
}
