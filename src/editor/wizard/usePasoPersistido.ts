"use client"

import { useState } from "react"
import type { Modo } from "@/editor/Editor"

const CLAVE = "curriculum-gratis:wizard:v2"

interface EstadoWizard {
  modo: Modo
  pasoCv: number
  pasoCarta: number
}

const INICIAL: EstadoWizard = { modo: "cv", pasoCv: 0, pasoCarta: 0 }

function indiceValido(valor: unknown): number {
  return typeof valor === "number" && Number.isInteger(valor) && valor >= 0 ? valor : 0
}

function leer(): EstadoWizard {
  if (typeof window === "undefined") return INICIAL
  try {
    window.localStorage.removeItem("curriculum-gratis:wizard")
    const crudo = window.localStorage.getItem(CLAVE)
    if (!crudo) return INICIAL
    const dato = JSON.parse(crudo) as Partial<EstadoWizard>
    return {
      modo: dato.modo === "carta" ? "carta" : "cv",
      pasoCv: indiceValido(dato.pasoCv),
      pasoCarta: indiceValido(dato.pasoCarta),
    }
  } catch {
    return INICIAL
  }
}

function guardar(estado: EstadoWizard) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(estado))
  } catch {
    // Sin espacio o almacenamiento bloqueado: la persistencia es best-effort.
  }
}

/**
 * Persiste modo y paso actual del wizard en localStorage. Conserva el paso de
 * cada modo por separado, de modo que volver de carta a CV mantiene la posicion.
 * La lectura es lazy en el initializer; el wizard ya esta gated por useHidratado.
 */
export function usePasoPersistido() {
  const [estado, setEstado] = useState<EstadoWizard>(leer)
  const actual = estado.modo === "carta" ? estado.pasoCarta : estado.pasoCv

  function persistir(siguiente: EstadoWizard) {
    setEstado(siguiente)
    guardar(siguiente)
  }

  function setActual(indice: number) {
    const limpio = Math.max(0, indice)
    persistir(
      estado.modo === "carta"
        ? { ...estado, pasoCarta: limpio }
        : { ...estado, pasoCv: limpio },
    )
  }

  function cambiarModo(nuevo: Modo) {
    if (nuevo === estado.modo) return
    persistir({ ...estado, modo: nuevo })
  }

  return { modo: estado.modo, actual, setActual, cambiarModo }
}
