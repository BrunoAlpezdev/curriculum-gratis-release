"use client"

import { useEffect, useState } from "react"

const CONSULTA = "(min-width: 768px)" // breakpoint md de Tailwind

/**
 * Indica si el viewport es de escritorio (>= md). El inicializador lazy lee
 * matchMedia en el primer render del cliente para evitar el flash de layout
 * mobile en escritorio. No causa mismatch de hidratacion: el arbol que consume
 * este hook esta gated por useHidratado (muestra "Cargando..." en SSR y en la
 * hidratacion), asi que este componente solo monta despues, ya en el cliente.
 */
export function useEsEscritorio(): boolean {
  const [esEscritorio, setEsEscritorio] = useState(
    () => typeof window !== "undefined" && window.matchMedia(CONSULTA).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(CONSULTA)
    const sincronizar = () => setEsEscritorio(mql.matches)
    sincronizar()
    mql.addEventListener("change", sincronizar)
    return () => mql.removeEventListener("change", sincronizar)
  }, [])

  return esEscritorio
}
