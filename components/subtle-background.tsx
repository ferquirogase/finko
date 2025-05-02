"use client"

import { useEffect, useRef } from "react"

export default function SubtleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar el canvas para que ocupe toda la pantalla
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Crear el degradado de fondo
    const createGradient = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "rgba(250, 250, 255, 1)") // Casi blanco en la parte superior
      gradient.addColorStop(0.7, "rgba(243, 238, 255, 1)") // Tono muy suave de violeta
      gradient.addColorStop(1, "rgba(237, 233, 254, 1)") // brand-100 en la parte inferior
      return gradient
    }

    // Configuración de las ondas
    const waves = [
      {
        y: canvas.height * 0.5,
        length: 0.01,
        amplitude: 20,
        frequency: 0.01,
        color: "rgba(124, 58, 237, 0.03)", // brand-600 con baja opacidad
        speed: 0.005,
      },
      {
        y: canvas.height * 0.7,
        length: 0.008,
        amplitude: 25,
        frequency: 0.015,
        color: "rgba(109, 40, 217, 0.025)", // brand-700 con baja opacidad
        speed: 0.003,
      },
      {
        y: canvas.height * 0.9,
        length: 0.015,
        amplitude: 15,
        frequency: 0.02,
        color: "rgba(139, 92, 246, 0.02)", // brand-500 con baja opacidad
        speed: 0.007,
      },
    ]

    let animationFrameId: number
    let time = 0

    // Función para dibujar el fondo y las ondas
    const draw = () => {
      // Dibujar el fondo con degradado
      ctx.fillStyle = createGradient()
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dibujar las ondas
      waves.forEach((wave) => {
        ctx.fillStyle = wave.color
        ctx.beginPath()

        // Dibujar la onda
        ctx.moveTo(0, wave.y)

        for (let x = 0; x < canvas.width; x++) {
          const dx = x * wave.length
          const dy = Math.sin(dx + time * wave.speed) * wave.amplitude * Math.sin(time * wave.frequency)
          ctx.lineTo(x, wave.y + dy)
        }

        // Completar el path para rellenar
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()
        ctx.fill()
      })

      time += 0.05
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    // Limpieza al desmontar
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 h-full w-full pointer-events-none" />
}
