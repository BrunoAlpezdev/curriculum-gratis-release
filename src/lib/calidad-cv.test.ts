import { describe, it, expect } from "vitest"
import { analizarCalidadCv } from "@/lib/calidad-cv"
import { DATOS_INICIALES } from "@/lib/constantes"
import type { DatosCurriculum, Experiencia } from "@/types"

function experienciaCon(fechaInicio: string, fechaFin: string | null): Experiencia {
  return {
    id: "1",
    empresa: "Acme",
    cargo: "Ingeniera",
    ubicacion: "Santiago",
    fechaInicio,
    fechaFin,
    descripcion: "Descripcion",
    logros: "",
  }
}

function cvCon(experiencia: Experiencia[]): DatosCurriculum {
  return { ...DATOS_INICIALES, experiencia }
}

function nivelFechas(datos: DatosCurriculum): string {
  const revision = analizarCalidadCv(datos).revisiones.find((r) => r.id === "fechas")
  if (!revision) throw new Error("Falta la revision de fechas")
  return revision.nivel
}

describe("analizarCalidadCv — coherencia de fechas", () => {
  it("inicio con mes y fin solo ano del mismo ano NO se marca como invertida", () => {
    expect(nivelFechas(cvCon([experienciaCon("2023-06", "2023")]))).toBe("ok")
  })

  it("inicio ano posterior al fin se marca como invertida", () => {
    expect(nivelFechas(cvCon([experienciaCon("2024", "2023")]))).toBe("error")
  })

  it("inicio con mes posterior al fin con mes se marca como invertida", () => {
    expect(nivelFechas(cvCon([experienciaCon("2023-06", "2023-02")]))).toBe("error")
  })
})
