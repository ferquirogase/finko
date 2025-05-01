import type React from "react"
import { Inclusive_Sans } from "next/font/google"
import "./globals.css"
import ClientLayout from "./clientLayout"
import Script from "next/script"

const inclusiveSans = Inclusive_Sans({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export const metadata = {
  title: "finko - Herramientas para freelancers",
  description: "Calcula tarifas, genera presupuestos y crea facturas profesionales fácilmente",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://finko.app",
    title: "finko - Herramientas para freelancers",
    description: "Calcula tarifas, genera presupuestos y crea facturas profesionales fácilmente",
    siteName: "finko",
    images: [
      {
        url: "https://finko.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "finko - Herramientas para freelancers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "finko - Herramientas para freelancers",
    description: "Calcula tarifas, genera presupuestos y crea facturas profesionales fácilmente",
    images: ["https://finko.app/og-image.png"],
    creator: "@finkoapp",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5FVQXSR8');`}
        </Script>
        {/* End Google Tag Manager */}

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

        {/* Schema.org - Organization */}
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "finko",
              url: "https://finko.app",
              logo: "https://finko.app/finko.png",
              sameAs: ["https://www.linkedin.com/in/ferquirogase/", "https://cafecito.app/ferquirogaux"],
              description: "Herramientas gratuitas para freelancers que simplifican la gestión de tu negocio.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "Argentina",
              },
            }),
          }}
        />

        {/* Schema.org - SoftwareApplication para Calculadora de Tarifas */}
        <Script
          id="schema-calculator"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Calculadora de Tarifas para Freelancers",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              description:
                "Calcula cuánto deberías cobrar por tus servicios como freelancer basado en tu experiencia, ubicación y tipo de proyecto.",
            }),
          }}
        />

        {/* Schema.org - SoftwareApplication para Generador de Presupuestos */}
        <Script
          id="schema-proposal"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Generador de Presupuestos para Freelancers",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              description:
                "Crea presupuestos profesionales con plantillas personalizables que impresionarán a tus clientes.",
            }),
          }}
        />

        {/* Schema.org - SoftwareApplication para Generador de Facturas */}
        <Script
          id="schema-invoice"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Generador de Facturas para Freelancers",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              description: "Genera facturas legales y profesionales en segundos, listas para enviar a tus clientes.",
            }),
          }}
        />
      </head>
      <body className={`${inclusiveSans.className} bg-gradient-to-br from-[#f5f7fa] to-[#f0f2f8]`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5FVQXSR8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
