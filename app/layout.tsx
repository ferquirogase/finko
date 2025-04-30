import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BottomNav from "@/components/bottom-nav"
import ParticlesBackground from "@/components/particles-background"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

// Reemplazar el título y descripción
export const metadata = {
  title: "finko - Herramientas para freelancers",
  description: "Calcula tarifas, genera presupuestos y crea facturas profesionales fácilmente",
  // Metadatos Open Graph para compartir en redes sociales
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
  // Metadatos para Twitter
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
        {/* Favicon */}
        <link rel="icon" href="/finko-fav.png" />

        {/* PWA meta tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Finko" />
        <link rel="apple-touch-icon" href="/pwa-icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/pwa-icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/pwa-icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/pwa-icons/icon-152x152.png" />

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

        {/* Service Worker Registration */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  },
                  function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  }
                );
              });
            }
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
      <body className={`${inter.className} bg-gradient-to-br from-[#f5f7fa] to-[#f0f2f8]`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <ParticlesBackground />
          <div className="mx-auto max-w-3xl px-4 py-8">
            <Navbar />
            {children}
          </div>
          <Footer />
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  )
}
