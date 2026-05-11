import type { Carta, DatosCurriculum, Personalizacion } from "@/types"
import { CARTA_INICIAL } from "@/lib/constantes"
import { normalizarDatosCurriculum, normalizarPersonalizacion } from "@/lib/importar-exportar"

const STORAGE_KEY = "curriculum-gratis:copias-locales"
const MAX_COPIAS = 20
const FORMATO_FECHA_COPIA = new Intl.DateTimeFormat("es-CL", {
  dateStyle: "medium",
  timeStyle: "short",
})

export interface CopiaLocalCv {
  id: string
  nombre: string
  creadoEn: string
  datos: DatosCurriculum
  personalizacion: Personalizacion
  carta: Carta
}

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return !!valor && typeof valor === "object" && !Array.isArray(valor)
}

function clonar<T>(valor: T): T {
  if (typeof structuredClone === "function") return structuredClone(valor)
  return JSON.parse(JSON.stringify(valor)) as T
}

function crearId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `copia-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function normalizarCopia(valor: unknown): CopiaLocalCv | null {
  if (!esRegistro(valor)) return null
  if (!esRegistro(valor.datos)) return null
  return {
    id: typeof valor.id === "string" && valor.id ? valor.id : crearId(),
    nombre: typeof valor.nombre === "string" && valor.nombre.trim() ? valor.nombre : "Copia sin nombre",
    creadoEn: typeof valor.creadoEn === "string" ? valor.creadoEn : new Date().toISOString(),
    datos: normalizarDatosCurriculum(valor.datos),
    personalizacion: normalizarPersonalizacion(valor.personalizacion),
    carta: {
      ...CARTA_INICIAL,
      ...(esRegistro(valor.carta) ? valor.carta : {}),
    },
  }
}

export function obtenerCopiasLocales(): CopiaLocalCv[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((valor) => {
      const copia = normalizarCopia(valor)
      return copia ? [copia] : []
    })
  } catch {
    return []
  }
}

function guardarLista(copias: CopiaLocalCv[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(copias.slice(0, MAX_COPIAS)))
}

export function guardarCopiaLocal(
  nombre: string,
  datos: DatosCurriculum,
  personalizacion: Personalizacion,
  carta: Carta,
): CopiaLocalCv {
  const copia: CopiaLocalCv = {
    id: crearId(),
    nombre: nombre.trim() || "Copia sin nombre",
    creadoEn: new Date().toISOString(),
    datos: clonar(datos),
    personalizacion: clonar(personalizacion),
    carta: clonar(carta),
  }
  guardarLista([copia, ...obtenerCopiasLocales()])
  return copia
}

export function eliminarCopiaLocal(id: string) {
  guardarLista(obtenerCopiasLocales().filter((copia) => copia.id !== id))
}

export function formatearFechaCopia(fecha: string): string {
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return "Fecha desconocida"
  return FORMATO_FECHA_COPIA.format(date)
}
