"use client"

import { useEffect, useState, useCallback } from "react"

export type Tema = "claro" | "oscuro" | "sistema"

const CLAVE_STORAGE = "tema"

function obtenerTemaGuardado(): Tema {
  if (typeof window === "undefined") return "sistema"
  const guardado = localStorage.getItem(CLAVE_STORAGE)
  if (guardado === "claro" || guardado === "oscuro" || guardado === "sistema") return guardado
  return "sistema"
}

function aplicarClaseDark(oscuro: boolean) {
  document.documentElement.classList.toggle("dark", oscuro)
}

export function useTema() {
  const [tema, setTemaState] = useState<Tema>("sistema")

  useEffect(() => {
    setTemaState(obtenerTemaGuardado())
  }, [])

  useEffect(() => {
    function actualizar() {
      if (tema === "oscuro") {
        aplicarClaseDark(true)
      } else if (tema === "claro") {
        aplicarClaseDark(false)
      } else {
        const prefOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches
        aplicarClaseDark(prefOscuro)
      }
    }

    actualizar()

    if (tema === "sistema") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      mq.addEventListener("change", actualizar)
      return () => mq.removeEventListener("change", actualizar)
    }
  }, [tema])

  const setTema = useCallback((nuevoTema: Tema) => {
    localStorage.setItem(CLAVE_STORAGE, nuevoTema)
    setTemaState(nuevoTema)
  }, [])

  return { tema, setTema } as const
}
