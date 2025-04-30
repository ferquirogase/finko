"use client"

import { useState, useEffect } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Detectar si la app ya está instalada
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Capturar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que Chrome muestre el prompt automáticamente
      e.preventDefault()
      // Guardar el evento para usarlo después
      setDeferredPrompt(e)
      setIsInstallable(true)
      console.log("La app es instalable, se ha capturado el evento beforeinstallprompt")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Detectar cuando la app se instala
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      console.log("La app ha sido instalada")
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", () => {})
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log("No hay prompt disponible para instalar")
      return
    }

    // Mostrar el prompt de instalación
    deferredPrompt.prompt()

    // Esperar a que el usuario responda al prompt
    const { outcome } = await deferredPrompt.userChoice

    console.log(`El usuario ${outcome === "accepted" ? "aceptó" : "rechazó"} la instalación`)

    // Limpiar el prompt guardado, solo se puede usar una vez
    setDeferredPrompt(null)

    if (outcome === "accepted") {
      setIsInstalled(true)
    }
  }

  // No mostrar nada si no es instalable o ya está instalada
  if (!isInstallable || isInstalled) return null

  return (
    <Button
      onClick={handleInstallClick}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
      data-install-pwa
    >
      <Download className="h-4 w-4" />
      Instalar app
    </Button>
  )
}
