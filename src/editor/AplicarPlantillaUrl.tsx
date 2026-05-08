"use client"

import { useEffect, useRef } from "react"
import { PLANTILLAS } from "@/lib/constantes"
import { useCurriculumStore } from "@/lib/store"
import type { PlantillaId } from "@/types"

const PLANTILLAS_VALIDAS = new Set<PlantillaId>(PLANTILLAS.map((p) => p.valor))

export function AplicarPlantillaUrl() {
  const aplicadaRef = useRef<string | null>(null)
  const setPersonalizacion = useCurriculumStore((s) => s.setPersonalizacion)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const plantilla = params.get("plantilla")
    if (!plantilla || aplicadaRef.current === plantilla) return
    if (!PLANTILLAS_VALIDAS.has(plantilla as PlantillaId)) return

    aplicadaRef.current = plantilla
    setPersonalizacion({ plantilla: plantilla as PlantillaId })
  }, [setPersonalizacion])

  return null
}
