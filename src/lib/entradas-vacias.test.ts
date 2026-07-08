import { describe, it, expect } from "vitest"
import { sinEntradasVacias } from "@/lib/entradas-vacias"
import { DATOS_INICIALES } from "@/lib/constantes"
import type { DatosCurriculum } from "@/types"

function base(): DatosCurriculum {
  return structuredClone(DATOS_INICIALES)
}

describe("sinEntradasVacias", () => {
  it("elimina una experiencia totalmente vacía", () => {
    const datos = base()
    datos.experiencia = [
      { id: "1", empresa: "", cargo: "", ubicacion: "", fechaInicio: "", fechaFin: null, descripcion: "", logros: "" },
      { id: "2", empresa: "ACME", cargo: "", ubicacion: "", fechaInicio: "", fechaFin: null, descripcion: "", logros: "" },
    ]
    const r = sinEntradasVacias(datos)
    expect(r.experiencia.map((e) => e.id)).toEqual(["2"])
  })

  it("conserva una entrada con un solo campo lleno (solo espacios no cuenta)", () => {
    const datos = base()
    datos.educacion = [
      { id: "a", institucion: "   ", titulo: "", fechaInicio: "", fechaFin: null, descripcion: "" },
      { id: "b", institucion: "", titulo: "Ingeniería", fechaInicio: "", fechaFin: null, descripcion: "" },
    ]
    const r = sinEntradasVacias(datos)
    expect(r.educacion.map((e) => e.id)).toEqual(["b"])
  })

  it("elimina un idioma sin nombre aunque tenga nivel", () => {
    const datos = base()
    datos.idiomas = [
      { id: "x", nombre: "", nivel: "avanzado" },
      { id: "y", nombre: "Inglés", nivel: "intermedio" },
    ]
    const r = sinEntradasVacias(datos)
    expect(r.idiomas.map((i) => i.id)).toEqual(["y"])
  })

  it("no altera datos personales ni habilidades", () => {
    const datos = base()
    datos.habilidades = ["React", "TypeScript"]
    datos.datosPersonales.nombreCompleto = "Ada Lovelace"
    const r = sinEntradasVacias(datos)
    expect(r.habilidades).toEqual(["React", "TypeScript"])
    expect(r.datosPersonales.nombreCompleto).toBe("Ada Lovelace")
  })
})
