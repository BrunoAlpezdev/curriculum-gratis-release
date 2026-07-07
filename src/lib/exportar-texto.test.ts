import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { exportarTexto } from "@/lib/exportar-texto"
import { DATOS_INICIALES, PERSONALIZACION_INICIAL, CARTA_INICIAL } from "@/lib/constantes"
import type { DatosCurriculum } from "@/types"

/* exportarTexto no retorna el texto: crea un Blob y lo baja via <a>. En el entorno
   node no hay DOM, asi que capturamos el contenido subclaseando el Blob global
   (existe en node) y stubeamos las APIs de descarga que toca la funcion. */
let contenidoDescargado = ""
const BlobOriginal = globalThis.Blob

beforeEach(() => {
  contenidoDescargado = ""
  class BlobEspia extends BlobOriginal {
    constructor(partes?: BlobPart[], opciones?: BlobPropertyBag) {
      super(partes, opciones)
      contenidoDescargado = typeof partes?.[0] === "string" ? partes[0] : ""
    }
  }
  vi.stubGlobal("Blob", BlobEspia)
  vi.stubGlobal("URL", {
    createObjectURL: () => "blob:mock",
    revokeObjectURL: () => {},
  })
  vi.stubGlobal("document", {
    createElement: () => ({ href: "", download: "", click: () => {} }),
    body: { appendChild: () => {}, removeChild: () => {} },
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function cvCon(parcial: Partial<DatosCurriculum>): DatosCurriculum {
  return { ...DATOS_INICIALES, ...parcial }
}

describe("exportarTexto (TXT)", () => {
  it("conserva lineas en blanco separadoras entre secciones e items", () => {
    const datos = cvCon({
      datosPersonales: { ...DATOS_INICIALES.datosPersonales, nombreCompleto: "Camila Gavilán", titulo: "Ingeniera" },
      perfil: "Perfil profesional de ejemplo.",
      experiencia: [
        {
          id: "1",
          empresa: "Acme",
          cargo: "Ingeniera Senior",
          ubicacion: "Santiago",
          fechaInicio: "2021",
          fechaFin: null,
          descripcion: "Lidere el equipo de frontend.",
          logros: "",
        },
        {
          id: "2",
          empresa: "Globex",
          cargo: "Ingeniera",
          ubicacion: "Santiago",
          fechaInicio: "2018",
          fechaFin: "2021",
          descripcion: "Construi el panel de control.",
          logros: "",
        },
      ],
    })

    exportarTexto("cv", "txt", datos, PERSONALIZACION_INICIAL, CARTA_INICIAL)
    const texto = contenidoDescargado

    // Debe haber al menos una linea en blanco (doble salto) como separador.
    expect(texto).toContain("\n\n")
    // Separador entre el perfil y la seccion de experiencia.
    expect(texto).toMatch(/Perfil profesional de ejemplo\.\n\n/)
    // Separador entre las dos experiencias.
    expect(texto).toMatch(/Lidere el equipo de frontend\.\n\nIngeniera - Globex/)
    // No debe empezar ni terminar con lineas en blanco.
    expect(texto.startsWith("\n")).toBe(false)
    expect(texto.endsWith("\n\n")).toBe(false)
  })
})
