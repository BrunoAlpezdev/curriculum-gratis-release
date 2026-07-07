import { describe, it, expect } from "vitest"
import { parsearTextoRico, esTextoSimple } from "@/lib/texto-rico"

describe("parsearTextoRico", () => {
  it("texto plano en una linea es un parrafo", () => {
    expect(parsearTextoRico("hola mundo")).toEqual([
      { tipo: "parrafo", contenido: "hola mundo" },
    ])
  })

  it("mezcla parrafos y viñetas conservando el orden", () => {
    expect(parsearTextoRico("Resumen\n- uno\n* dos\nCierre")).toEqual([
      { tipo: "parrafo", contenido: "Resumen" },
      { tipo: "vineta", contenido: "uno" },
      { tipo: "vineta", contenido: "dos" },
      { tipo: "parrafo", contenido: "Cierre" },
    ])
  })

  it("'-sin-espacio' NO es viñeta", () => {
    expect(parsearTextoRico("-5% churn")).toEqual([
      { tipo: "parrafo", contenido: "-5% churn" },
    ])
  })

  it("reconoce el glifo • como viñeta", () => {
    expect(parsearTextoRico("• punto")).toEqual([
      { tipo: "vineta", contenido: "punto" },
    ])
  })

  it("mantiene 1 o 2 vacias pero colapsa 3+ a una", () => {
    expect(parsearTextoRico("a\n\nb")).toEqual([
      { tipo: "parrafo", contenido: "a" },
      { tipo: "parrafo", contenido: "" },
      { tipo: "parrafo", contenido: "b" },
    ])
    expect(parsearTextoRico("a\n\n\n\nb")).toEqual([
      { tipo: "parrafo", contenido: "a" },
      { tipo: "parrafo", contenido: "" },
      { tipo: "parrafo", contenido: "b" },
    ])
  })

  it("maneja saltos CRLF", () => {
    expect(parsearTextoRico("uno\r\ndos")).toEqual([
      { tipo: "parrafo", contenido: "uno" },
      { tipo: "parrafo", contenido: "dos" },
    ])
  })
})

describe("esTextoSimple", () => {
  it("una linea sin viñeta es simple", () => {
    expect(esTextoSimple("Reduje costos 15%")).toBe(true)
    expect(esTextoSimple("Reduje costos 15%\n")).toBe(true)
  })

  it("multilinea o con viñetas no es simple", () => {
    expect(esTextoSimple("uno\ndos")).toBe(false)
    expect(esTextoSimple("- uno")).toBe(false)
  })
})
