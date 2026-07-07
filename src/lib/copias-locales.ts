import type { Carta, DatosCurriculum, Personalizacion } from "@/types"
import { normalizarCarta, normalizarDatosCurriculum, normalizarPersonalizacion } from "@/lib/importar-exportar"

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
    carta: normalizarCarta(valor.carta),
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

export class ErrorCopiaLocal extends Error {
  constructor(mensaje = "No hay espacio para guardar la copia local.") {
    super(mensaje)
    this.name = "ErrorCopiaLocal"
  }
}

/**
 * Guarda la lista de copias (mas nuevas primero). Si localStorage se queda sin
 * espacio, descarta progresivamente la copia mas antigua y reintenta hasta
 * guardar o quedar solo con la mas nueva. Nunca deja escapar QuotaExceededError.
 */
function guardarLista(copias: CopiaLocalCv[]) {
  let candidatas = copias.slice(0, MAX_COPIAS)
  while (true) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(candidatas))
      return
    } catch {
      if (candidatas.length <= 1) {
        throw new ErrorCopiaLocal()
      }
      // Descarta la mas antigua (al final) y reintenta con las mas nuevas.
      candidatas = candidatas.slice(0, candidatas.length - 1)
    }
  }
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

/**
 * Igual que guardarCopiaLocal pero no lanza: devuelve null si no se pudo
 * guardar (ej. sin espacio). Para respaldos automaticos no criticos.
 */
export function intentarGuardarCopiaLocal(
  nombre: string,
  datos: DatosCurriculum,
  personalizacion: Personalizacion,
  carta: Carta,
): CopiaLocalCv | null {
  try {
    return guardarCopiaLocal(nombre, datos, personalizacion, carta)
  } catch {
    return null
  }
}

export function eliminarCopiaLocal(id: string) {
  guardarLista(obtenerCopiasLocales().filter((copia) => copia.id !== id))
}

export function formatearFechaCopia(fecha: string): string {
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return "Fecha desconocida"
  return FORMATO_FECHA_COPIA.format(date)
}
