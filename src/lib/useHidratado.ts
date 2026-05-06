"use client"

import { useEffect, useState } from "react"

/**
 * Retorna true una vez que el store de Zustand termino de rehidratar
 * desde localStorage. Usar para evitar flash de contenido vacio en SSR.
 */
export function useHidratado() {
  const [hidratado, setHidratado] = useState(false)

  useEffect(() => {
    setHidratado(true)
  }, [])

  return hidratado
}
