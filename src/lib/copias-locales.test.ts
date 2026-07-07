import { describe, it, expect, beforeEach } from "vitest"
import {
  guardarCopiaLocal,
  intentarGuardarCopiaLocal,
  obtenerCopiasLocales,
  ErrorCopiaLocal,
} from "@/lib/copias-locales"
import { DATOS_INICIALES, PERSONALIZACION_INICIAL, CARTA_INICIAL } from "@/lib/constantes"

/**
 * localStorage falso que simula QuotaExceededError: si el arreglo guardado
 * supera `maxItems` copias, setItem lanza como lo haria el navegador sin espacio.
 */
class LocalStorageFalso {
  private datos = new Map<string, string>()
  maxItems = Number.POSITIVE_INFINITY

  getItem(clave: string): string | null {
    return this.datos.get(clave) ?? null
  }

  setItem(clave: string, valor: string): void {
    const parsed: unknown = JSON.parse(valor)
    if (Array.isArray(parsed) && parsed.length > this.maxItems) {
      const error = new Error("QuotaExceededError")
      error.name = "QuotaExceededError"
      throw error
    }
    this.datos.set(clave, valor)
  }

  removeItem(clave: string): void {
    this.datos.delete(clave)
  }

  clear(): void {
    this.datos.clear()
  }
}

let almacen: LocalStorageFalso

beforeEach(() => {
  almacen = new LocalStorageFalso()
  ;(globalThis as { localStorage?: unknown }).localStorage = almacen
})

function guardar(nombre: string) {
  return guardarCopiaLocal(nombre, DATOS_INICIALES, PERSONALIZACION_INICIAL, CARTA_INICIAL)
}

describe("copias-locales", () => {
  it("guarda y recupera una copia normalmente", () => {
    const copia = guardar("Mi CV")
    const copias = obtenerCopiasLocales()
    expect(copias).toHaveLength(1)
    expect(copias[0]!.id).toBe(copia.id)
    expect(copias[0]!.nombre).toBe("Mi CV")
  })

  it("descarta las copias mas antiguas cuando no hay espacio", () => {
    for (let i = 1; i <= 5; i++) guardar(`Copia ${i}`)
    expect(obtenerCopiasLocales()).toHaveLength(5)

    almacen.maxItems = 3
    guardar("Nueva")

    const copias = obtenerCopiasLocales()
    expect(copias).toHaveLength(3)
    // la recien guardada sobrevive y queda primera
    expect(copias[0]!.nombre).toBe("Nueva")
    // se descartaron las mas antiguas (Copia 1 y Copia 2)
    expect(copias.map((c) => c.nombre)).toEqual(["Nueva", "Copia 5", "Copia 4"])
  })

  it("lanza ErrorCopiaLocal cuando ni una sola copia entra", () => {
    almacen.maxItems = 0
    expect(() => guardar("Imposible")).toThrow(ErrorCopiaLocal)
  })

  it("intentarGuardarCopiaLocal devuelve null en vez de lanzar", () => {
    almacen.maxItems = 0
    const resultado = intentarGuardarCopiaLocal("No critica", DATOS_INICIALES, PERSONALIZACION_INICIAL, CARTA_INICIAL)
    expect(resultado).toBeNull()
    expect(obtenerCopiasLocales()).toHaveLength(0)
  })

  it("normaliza una carta corrupta al recuperar copias", () => {
    almacen.setItem(
      "curriculum-gratis:copias-locales",
      JSON.stringify([
        {
          id: "c1",
          nombre: "Con carta corrupta",
          creadoEn: new Date().toISOString(),
          datos: DATOS_INICIALES,
          personalizacion: PERSONALIZACION_INICIAL,
          carta: { cuerpo: 123, despedida: null },
        },
      ]),
    )
    const copias = obtenerCopiasLocales()
    expect(copias).toHaveLength(1)
    expect(copias[0]!.carta.cuerpo).toBe("")
    expect(copias[0]!.carta.despedida).toBe(CARTA_INICIAL.despedida)
  })

  it("respeta el tope de 20 copias", () => {
    for (let i = 1; i <= 25; i++) guardar(`Copia ${i}`)
    const copias = obtenerCopiasLocales()
    expect(copias).toHaveLength(20)
    // la mas nueva (Copia 25) queda primera
    expect(copias[0]!.nombre).toBe("Copia 25")
  })
})
