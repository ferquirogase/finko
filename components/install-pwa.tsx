"use client"

import { useState, useEffect } from "react"
import { Download, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    // Si no es un dispositivo móvil, no hacer nada
    if (!isMobile) return

    // Detectar si ya está instalada como PWA
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true) {
      setIsStandalone(true)
      return
    }

    // Detectar si es iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Capturar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que Chrome muestre el prompt automáticamente
      e.preventDefault()
      // Guardar el evento para usarlo después
      setDeferredPrompt(e)
      console.log("La app es instalable, se ha capturado el evento beforeinstallprompt")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Limpiar los eventos cuando el componente se desmonte
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [isMobile])

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(!showIOSInstructions)
      return
    }

    if (!deferredPrompt) {
      console.log("No hay prompt disponible para instalar")
      return
    }

    try {
      // Mostrar el prompt de instalación
      deferredPrompt.prompt()

      // Esperar a que el usuario responda al prompt
      const { outcome } = await deferredPrompt.userChoice

      // Si el usuario aceptó, limpiar el prompt
      if (outcome === "accepted") {
        setDeferredPrompt(null)
      }
    } catch (error) {
      console.error("Error al mostrar el prompt de instalación:", error)
    }
  }

  // Si no es móvil o ya está instalada, no mostrar nada
  if (!isMobile || isStandalone) {
    return null
  }

  return (
    <div className="relative">
      <Button
        onClick={handleInstallClick}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
      >
        {isIOS ? <Smartphone className="h-4 w-4" /> : <Download className="h-4 w-4" />}
        {isIOS ? "Instalar en iOS" : "Instalar app"}
      </Button>

      {isIOS && showIOSInstructions && (
        <div className="absolute bottom-full mb-2 w-64 rounded-lg bg-white p-3 text-xs shadow-lg z-50">
          <p className="mb-2 font-medium">Para instalar en iOS:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>
              Toca el botón "Compartir" <span className="inline-block px-1">⎙</span> en Safari
            </li>
            <li>Desplázate y selecciona "Añadir a pantalla de inicio"</li>
            <li>Toca "Añadir" en la esquina superior derecha</li>
          </ol>
        </div>
      )}
    </div>
  )
}
