import { describe, it, expect } from "vitest"
import { analizar, textoCv } from "@/lib/analisis-ats"
import { DATOS_INICIALES } from "@/lib/constantes"
import type { DatosCurriculum } from "@/types"

function cvCon(parcial: Partial<DatosCurriculum>): DatosCurriculum {
  return { ...DATOS_INICIALES, ...parcial }
}

describe("textoCv", () => {
  it("incluye perfil, experiencia y habilidades en un solo string", () => {
    const datos = cvCon({
      perfil: "Desarrollador frontend",
      habilidades: ["React", "TypeScript"],
      experiencia: [
        {
          id: "1",
          empresa: "Acme",
          cargo: "Ingeniero",
          ubicacion: "Santiago",
          fechaInicio: "2020",
          fechaFin: null,
          descripcion: "Construi interfaces",
          logros: "",
        },
      ],
    })
    const texto = textoCv(datos)
    expect(texto).toContain("Desarrollador frontend")
    expect(texto).toContain("React")
    expect(texto).toContain("Acme")
  })
})

describe("analizar", () => {
  it("devuelve resultado vacio cuando la oferta no tiene tokens utiles", () => {
    const resultado = analizar("", DATOS_INICIALES)
    expect(resultado.totalClaves).toBe(0)
    expect(resultado.palabras).toHaveLength(0)
    expect(resultado.recomendaciones).toHaveLength(0)
  })

  it("marca como presentes las keywords que ya estan en el CV e ignora acentos", () => {
    const datos = cvCon({ perfil: "Experto en React y gestión de proyectos" })
    const resultado = analizar("Buscamos experiencia en React y gestion de proyectos", datos)

    const react = resultado.palabras.find((p) => p.palabra === "react")
    const gestion = resultado.palabras.find((p) => p.palabra === "gestion")
    expect(react?.enCv).toBe(true)
    // "gestión" en el CV debe matchear "gestion" de la oferta pese al acento
    expect(gestion?.enCv).toBe(true)
  })

  it("detecta keywords faltantes y genera recomendaciones", () => {
    const datos = cvCon({ perfil: "Experto en React" })
    const resultado = analizar("Necesitamos liderazgo y experiencia en Kubernetes", datos)

    const kubernetes = resultado.palabras.find((p) => p.palabra === "kubernetes")
    expect(kubernetes?.enCv).toBe(false)
    expect(resultado.encontradas).toBeLessThan(resultado.totalClaves)
    expect(resultado.recomendaciones.length).toBeGreaterThan(0)
    expect(resultado.recomendaciones[0]!.id).toBe("perfil")
  })

  it("no marca 'java' como presente cuando el CV solo dice 'javascript'", () => {
    const datos = cvCon({ perfil: "Experto en javascript y frontend" })
    const resultado = analizar("Buscamos experiencia en Java", datos)

    const java = resultado.palabras.find((p) => p.palabra === "java")
    expect(java?.enCv).toBe(false)
  })

  it("detecta siglas de 2 letras como QA y Go, pero descarta conectores cortos", () => {
    const resultado = analizar("Buscamos QA y Go, con foco en QA y Go automatizado", DATOS_INICIALES)
    const palabras = resultado.palabras.map((p) => p.palabra)
    expect(palabras).toContain("qa")
    expect(palabras).toContain("go")
    expect(palabras).not.toContain("en") // stopword de 2 letras
    expect(palabras).not.toContain("y") // conector de 1 letra
  })

  it("descarta stopwords y numeros sueltos como keywords", () => {
    const resultado = analizar("para los 2024 con the and Kubernetes", DATOS_INICIALES)
    const palabras = resultado.palabras.map((p) => p.palabra)
    expect(palabras).not.toContain("para") // stopword es
    expect(palabras).not.toContain("the") // stopword en
    expect(palabras).not.toContain("2024") // numero suelto
    expect(palabras).toContain("kubernetes") // keyword real si sobrevive
  })
})
