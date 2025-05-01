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
        {/* Favicon */}
        <link rel="icon" href="/finko-fav.png" />

        {/* PWA meta tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6d28d9" />
        <meta name="application-name" content="Finko" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Finko" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#6d28d9" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

        {/* Apple touch icons */}
        <link rel="apple-touch-icon" href="/pwa/apple-icon-180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/pwa/apple-icon-152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/pwa/apple-icon-180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/pwa/apple-icon-167.png" />

        {/* Apple splash screens */}
        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-2048-2732.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-1668-2388.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-1536-2048.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-1125-2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-1242-2688.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-828-1792.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-1242-2208.png"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-750-1334.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-640-1136.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />

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

        {/* Service Worker Registration - Optimizado para móviles */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('Service Worker registrado con éxito:', registration.scope);
                    
                    // Verificar si hay actualizaciones del service worker
                    registration.addEventListener('updatefound', function() {
                      // Si hay una actualización, obtener el nuevo service worker
                      const newWorker = registration.installing;
                      
                      console.log('Se encontró una actualización del Service Worker');
                      
                      // Escuchar cambios de estado en el nuevo service worker
                      newWorker.addEventListener('statechange', function() {
                        console.log('Estado del nuevo Service Worker:', newWorker.state);
                      });
                    });
                    
                    // Verificar actualizaciones cada hora
                    setInterval(function() {
                      registration.update();
                      console.log('Verificando actualizaciones del Service Worker');
                    }, 3600000); // 1 hora
                  })
                  .catch(function(error) {
                    console.error('Error al registrar el Service Worker:', error);
                  });
              });
              
              // Manejar actualizaciones del service worker
              let refreshing = false;
              navigator.serviceWorker.addEventListener('controllerchange', function() {
                if (!refreshing) {
                  refreshing = true;
                  console.log('Service Worker actualizado, recargando la página');
                  window.location.reload();
                }
              });

              // Registrar cuando la app se instala
              window.addEventListener('appinstalled', (event) => {
                console.log('La aplicación fue instalada', event);
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
