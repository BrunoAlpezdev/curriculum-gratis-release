import { describe, it, expect } from "vitest"
import {
  importarJson,
  normalizarDatosCurriculum,
  normalizarPersonalizacion,
} from "@/lib/importar-exportar"
import { PERSONALIZACION_INICIAL, ORDEN_SECCIONES_INICIAL } from "@/lib/constantes"

describe("normalizarDatosCurriculum", () => {
  it("devuelve la estructura base ante entradas no validas", () => {
    const datos = normalizarDatosCurriculum(undefined)
    expect(datos.perfil).toBe("")
    expect(datos.experiencia).toEqual([])
    expect(datos.habilidades).toEqual([])
    expect(datos.datosPersonales.nombreCompleto).toBe("")
  })

  it("conserva campos validos y descarta basura", () => {
    const datos = normalizarDatosCurriculum({
      perfil: "Hola",
      datosPersonales: { nombreCompleto: "Ana", email: 123, foo: "bar" },
      habilidades: ["React", 42, null, "TypeScript"],
      experiencia: [{ empresa: "Acme" }, "no-es-objeto"],
    })
    expect(datos.perfil).toBe("Hola")
    expect(datos.datosPersonales.nombreCompleto).toBe("Ana")
    expect(datos.datosPersonales.email).toBe("") // 123 no es string -> fallback
    expect(datos.habilidades).toEqual(["React", "TypeScript"])
    // solo el objeto valido sobrevive y recibe un id generado
    expect(datos.experiencia).toHaveLength(1)
    expect(datos.experiencia[0]!.empresa).toBe("Acme")
    expect(typeof datos.experiencia[0]!.id).toBe("string")
    expect(datos.experiencia[0]!.id.length).toBeGreaterThan(0)
  })

  it("preserva ids existentes en las entradas", () => {
    const datos = normalizarDatosCurriculum({
      idiomas: [{ id: "fijo-123", nombre: "Ingles", nivel: "avanzado" }],
    })
    expect(datos.idiomas[0]!.id).toBe("fijo-123")
    expect(datos.idiomas[0]!.nivel).toBe("avanzado")
  })

  it("aplica fallback a niveles de idioma invalidos", () => {
    const datos = normalizarDatosCurriculum({
      idiomas: [{ nombre: "Frances", nivel: "experto-supremo" }],
    })
    expect(datos.idiomas[0]!.nivel).toBe("basico")
  })
})

describe("normalizarPersonalizacion", () => {
  it("usa valores iniciales ante opciones invalidas", () => {
    const p = normalizarPersonalizacion({
      color: "fucsia",
      plantilla: "ultra",
      fuente: "comic-sans",
      idiomaCv: "fr",
    })
    expect(p.color).toBe(PERSONALIZACION_INICIAL.color)
    expect(p.plantilla).toBe(PERSONALIZACION_INICIAL.plantilla)
    expect(p.fuente).toBe(PERSONALIZACION_INICIAL.fuente)
    expect(p.idiomaCv).toBe(PERSONALIZACION_INICIAL.idiomaCv)
  })

  it("respeta el orden de secciones y completa las faltantes", () => {
    const p = normalizarPersonalizacion({ ordenSecciones: ["idiomas", "experiencia", "fantasma"] })
    // las dos validas van primero, en orden, y se completan las restantes
    expect(p.ordenSecciones.slice(0, 2)).toEqual(["idiomas", "experiencia"])
    expect(p.ordenSecciones).toHaveLength(ORDEN_SECCIONES_INICIAL.length)
    expect(new Set(p.ordenSecciones)).toEqual(new Set(ORDEN_SECCIONES_INICIAL))
    expect(p.ordenSecciones).not.toContain("fantasma")
  })
})

describe("importarJson", () => {
  function archivo(contenido: string): File {
    return new File([contenido], "cv.json", { type: "application/json" })
  }

  it("importa un archivo valido", async () => {
    const payload = {
      version: 1,
      datos: { datosPersonales: { nombreCompleto: "Ana" }, perfil: "Dev" },
      personalizacion: { color: "azul" },
    }
    const resultado = await importarJson(archivo(JSON.stringify(payload)))
    expect(resultado.ok).toBe(true)
    if (resultado.ok) {
      expect(resultado.datos.datosPersonales.nombreCompleto).toBe("Ana")
      expect(resultado.personalizacion.color).toBe("azul")
    }
  })

  it("rechaza JSON malformado", async () => {
    const resultado = await importarJson(archivo("{ no es json"))
    expect(resultado.ok).toBe(false)
  })

  it("rechaza un archivo sin datos del curriculum", async () => {
    const resultado = await importarJson(archivo(JSON.stringify({ version: 1 })))
    expect(resultado.ok).toBe(false)
    if (!resultado.ok) expect(resultado.error).toMatch(/datos/i)
  })

  it("rechaza un archivo sin datos personales", async () => {
    const resultado = await importarJson(archivo(JSON.stringify({ datos: { perfil: "x" } })))
    expect(resultado.ok).toBe(false)
  })
})
