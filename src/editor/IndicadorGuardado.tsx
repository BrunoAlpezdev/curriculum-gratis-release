"use client"

import { useEffect, useRef, useState } from "react"
import { Text } from "@/components/atoms/Text"
import { useCurriculumStore } from "@/lib/store"

type EstadoGuardado = "inicial" | "guardando" | "guardado"

const TEXTO_GUARDADO: Record<EstadoGuardado, string> = {
  inicial: "Guardado en este navegador",
  guardando: "Guardando…",
  guardado: "Guardado ✓",
}

/**
 * Indicador discreto de autosave. Nos suscribimos al store (Zustand `persist`
 * escribe en localStorage en cada cambio) y reflejamos "Guardando…" y luego
 * "Guardado ✓" tras un debounce. El timer es sincronizacion externa legitima.
 */
export function IndicadorGuardado({ className }: { className?: string }) {
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>("inicial")
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const desuscribir = useCurriculumStore.subscribe(() => {
      setEstadoGuardado("guardando")
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setEstadoGuardado("guardado"), 800)
    })
    return () => {
      clearTimeout(timerRef.current)
      desuscribir()
    }
  }, [])

  return (
    <Text as="span" variant="caption" aria-live="polite" className={className}>
      {TEXTO_GUARDADO[estadoGuardado]}
    </Text>
  )
}
