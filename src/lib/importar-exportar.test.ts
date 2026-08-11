import { describe, it, expect } from "vitest"
import {
  importarJson,
  normalizarCarta,
  normalizarDatosCurriculum,
  normalizarNombreDocumento,
  normalizarPersonalizacion,
} from "@/lib/importar-exportar"
import { CARTA_INICIAL, PERSONALIZACION_INICIAL, ORDEN_SECCIONES_INICIAL } from "@/lib/constantes"

describe("normalizarDatosCurriculum", () => {
  it("devuelve la estructura base ante entradas no validas", () => {
    const datos = normalizarDatosCurriculum(undefined)
    expect(datos.perfil).toBe("")
    expect(datos.experiencia).toEqual([])
    expect(datos.habilidades).toEqual([])
    expect(datos.seccionesDestacadas).toEqual([])
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

  it("normaliza secciones destacadas y conserva sus ids", () => {
    const datos = normalizarDatosCurriculum({
      seccionesDestacadas: [
        { id: "licencias-1", titulo: "  Licencias  ", items: ["Clase B", "", 42] },
        { titulo: "Certificaciones", items: "ISO 9001\n Scrum" },
      ],
    })
    expect(datos.seccionesDestacadas).toEqual([
      { id: "licencias-1", titulo: "Licencias", items: ["Clase B"] },
      expect.objectContaining({ titulo: "Certificaciones", items: ["ISO 9001", "Scrum"] }),
    ])
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

  it("deduplica secciones repetidas en el orden importado", () => {
    const p = normalizarPersonalizacion({ ordenSecciones: ["experiencia", "experiencia", "idiomas"] })
    expect(p.ordenSecciones).toHaveLength(ORDEN_SECCIONES_INICIAL.length)
    expect(new Set(p.ordenSecciones)).toEqual(new Set(ORDEN_SECCIONES_INICIAL))
    // sin duplicados: cada seccion aparece exactamente una vez
    expect(p.ordenSecciones.filter((s) => s === "experiencia")).toHaveLength(1)
    expect(p.ordenSecciones.slice(0, 2)).toEqual(["experiencia", "idiomas"])
  })

  it("agrega destacadas al final sin alterar el orden valido importado", () => {
    const p = normalizarPersonalizacion({ ordenSecciones: ["idiomas", "destacadas", "experiencia"] })
    expect(p.ordenSecciones.slice(0, 3)).toEqual(["idiomas", "destacadas", "experiencia"])
    expect(p.ordenSecciones).toEqual(expect.arrayContaining(ORDEN_SECCIONES_INICIAL))
  })
})

describe("normalizarCarta", () => {
  it("devuelve la carta inicial ante entradas no validas", () => {
    expect(normalizarCarta(undefined)).toEqual(CARTA_INICIAL)
    expect(normalizarCarta(42)).toEqual(CARTA_INICIAL)
  })

  it("normaliza campos con tipos corruptos y conserva la despedida por defecto", () => {
    const carta = normalizarCarta({ cuerpo: 123, destinatario: null, despedida: false })
    expect(carta.cuerpo).toBe("")
    expect(carta.destinatario).toBe("")
    expect(carta.despedida).toBe(CARTA_INICIAL.despedida)
  })

  it("conserva strings validos", () => {
    const carta = normalizarCarta({ cuerpo: "Hola", despedida: "Saludos," })
    expect(carta.cuerpo).toBe("Hola")
    expect(carta.despedida).toBe("Saludos,")
  })
})

describe("normalizarNombreDocumento", () => {
  it("devuelve '' cuando el valor esta ausente", () => {
    expect(normalizarNombreDocumento(undefined)).toBe("")
  })

  it("devuelve '' cuando el valor no es string", () => {
    expect(normalizarNombreDocumento(42)).toBe("")
    expect(normalizarNombreDocumento(null)).toBe("")
    expect(normalizarNombreDocumento({})).toBe("")
  })

  it("recorta espacios al inicio y al final", () => {
    expect(normalizarNombreDocumento("  Mi CV para Acme  ")).toBe("Mi CV para Acme")
  })

  it("limita a 80 caracteres", () => {
    const largo = "a".repeat(100)
    expect(normalizarNombreDocumento(largo)).toHaveLength(80)
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

  it("cae a la carta inicial cuando el archivo no trae carta", async () => {
    const payload = { version: 1, datos: { datosPersonales: { nombreCompleto: "Ana" } } }
    const resultado = await importarJson(archivo(JSON.stringify(payload)))
    expect(resultado.ok).toBe(true)
    if (resultado.ok) expect(resultado.carta).toEqual(CARTA_INICIAL)
  })

  it("normaliza una carta con tipos corruptos", async () => {
    const payload = {
      datos: { datosPersonales: { nombreCompleto: "Ana" } },
      carta: { cuerpo: 123, despedida: null },
    }
    const resultado = await importarJson(archivo(JSON.stringify(payload)))
    expect(resultado.ok).toBe(true)
    if (resultado.ok) {
      expect(resultado.carta.cuerpo).toBe("")
      expect(resultado.carta.despedida).toBe(CARTA_INICIAL.despedida)
    }
  })

  it("roundtrip conserva la carta", async () => {
    const carta = { ...CARTA_INICIAL, cuerpo: "Estimado equipo", despedida: "Saludos," }
    const payload = { datos: { datosPersonales: { nombreCompleto: "Ana" } }, carta }
    const resultado = await importarJson(archivo(JSON.stringify(payload)))
    expect(resultado.ok).toBe(true)
    if (resultado.ok) expect(resultado.carta).toEqual(carta)
  })

  it("lee el nombre del documento y lo normaliza", async () => {
    const payload = {
      datos: { datosPersonales: { nombreCompleto: "Ana" } },
      nombreDocumento: "  CV para Acme  ",
    }
    const resultado = await importarJson(archivo(JSON.stringify(payload)))
    expect(resultado.ok).toBe(true)
    if (resultado.ok) expect(resultado.nombreDocumento).toBe("CV para Acme")
  })

  it("cae a '' cuando el archivo no trae nombre del documento (retrocompatible)", async () => {
    const payload = { version: 1, datos: { datosPersonales: { nombreCompleto: "Ana" } } }
    const resultado = await importarJson(archivo(JSON.stringify(payload)))
    expect(resultado.ok).toBe(true)
    if (resultado.ok) expect(resultado.nombreDocumento).toBe("")
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
