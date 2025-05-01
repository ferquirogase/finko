"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HelpTooltipProps {
  content: React.ReactNode
  className?: string
}

export function HelpTooltip({ content, className = "" }: HelpTooltipProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Detectar si es un dispositivo táctil
  useEffect(() => {
    const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
    setIsTouchDevice(touchDevice)
  }, [])

  // Cerrar el tooltip cuando se hace clic fuera de él
  useEffect(() => {
    if (!isTouchDevice) return

    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [isOpen, isTouchDevice])

  // Manejar el clic para dispositivos táctiles
  const handleClick = () => {
    if (isTouchDevice) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div ref={tooltipRef}>
      <TooltipProvider>
        <Tooltip open={isTouchDevice ? isOpen : undefined}>
          <TooltipTrigger asChild onClick={handleClick}>
            <Button variant="ghost" size="icon" className={`h-5 w-5 rounded-full p-0 text-gray-400 ${className}`}>
              <HelpCircle className="h-3.5 w-3.5" />
              <span className="sr-only">Ayuda</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">{content}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
