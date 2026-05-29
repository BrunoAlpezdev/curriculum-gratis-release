"use client"

import { useEffect, useState } from "react"

const CONSULTA = "(min-width: 768px)" // breakpoint md de Tailwind

/**
 * Indica si el viewport es de escritorio (>= md). Se resuelve tras montar para
 * evitar mismatch de hidratacion; el editor ya muestra "Cargando..." antes de
 * estar hidratado, asi que el primer valor real llega despues del primer paint.
 */
export function useEsEscritorio(): boolean {
  const [esEscritorio, setEsEscritorio] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(CONSULTA)
    const sincronizar = () => setEsEscritorio(mql.matches)
    sincronizar()
    mql.addEventListener("change", sincronizar)
    return () => mql.removeEventListener("change", sincronizar)
  }, [])

  return esEscritorio
}
