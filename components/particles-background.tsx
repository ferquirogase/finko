"use client"

import { useEffect, useState } from "react"

export default function ParticlesBackground() {
  const [particles, setParticles] = useState<
    Array<{
      x: number
      y: number
      size: number
      opacity: number
      color: string
      speed: number
      blur: number
    }>
  >([])

  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === "undefined") return

    // Crear partículas solo en el cliente
    const particlesCount = window.innerWidth < 768 ? 40 : 70

    // Colores en tema púrpura
    const colors = [
      "rgba(139, 92, 246, 0.7)", // purple-500
      "rgba(124, 58, 237, 0.7)", // purple-600
      "rgba(109, 40, 217, 0.7)", // purple-700
      "rgba(91, 33, 182, 0.7)", // purple-800
      "rgba(76, 29, 149, 0.7)", // purple-900
    ]

    const newParticles = Array.from({ length: particlesCount }, () => {
      const size = Math.random() * 8 + 2 // Partículas más grandes (2-10px)
      const colorIndex = Math.floor(Math.random() * colors.length)

      return {
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        opacity: Math.random() * 0.6 + 0.2, // Mayor opacidad (0.2-0.8)
        color: colors[colorIndex],
        speed: Math.random() * 20 + 10, // Velocidad de animación (10-30s)
        blur: Math.random() > 0.7 ? Math.random() * 3 : 0, // Algunas partículas con efecto blur
      }
    })

    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute rounded-full animate-float-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            filter: particle.blur > 0 ? `blur(${particle.blur}px)` : "none",
            animationDuration: `${particle.speed}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  )
}
