"use client"

import { useSyncExternalStore } from "react"

/**
 * Retorna true una vez que el store de Zustand termino de rehidratar
 * desde localStorage. Usar para evitar flash de contenido vacio en SSR.
 */
export function useHidratado() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}
