"use client"

import { useState, useEffect } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Función para verificar si es un dispositivo móvil
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

      // Verificar si es un dispositivo móvil basado en el user agent
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

      // También verificar el ancho de la pantalla (típicamente móviles < 768px)
      const isMobileDevice = mobileRegex.test(userAgent) || window.innerWidth < 768

      setIsMobile(isMobileDevice)
    }

    // Verificar inicialmente
    checkMobile()

    // Verificar cuando cambie el tamaño de la ventana
    window.addEventListener("resize", checkMobile)

    // Limpiar el evento
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}
