import { jsPDF } from "jspdf"
import type { Carta, DatosCurriculum, Personalizacion } from "@/types"
import { getColorHex } from "@/lib/colores"
import { FUENTES } from "@/lib/constantes"

const MARGIN = 25
const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

export function generarPdfCarta(
  datos: DatosCurriculum,
  carta: Carta,
  personalizacion: Personalizacion,
) {
  const color = hexToRgb(getColorHex(personalizacion.color))
  const fuenteBase =
    FUENTES.find((f) => f.valor === personalizacion.fuente)?.jsPdf ?? "helvetica"
  const pdf = new jsPDF("p", "mm", "a4")
  let y = MARGIN

  const dp = datos.datosPersonales

  function setColor(r: number, g: number, b: number) {
    pdf.setTextColor(r, g, b)
  }

  function checkPage(needed: number) {
    if (y + needed > PAGE_HEIGHT - MARGIN) {
      pdf.addPage()
      y = MARGIN
    }
  }

  // --- Header remitente ---
  pdf.setFont(fuenteBase, "bold")
  pdf.setFontSize(14)
  setColor(24, 24, 27)
  pdf.text(dp.nombreCompleto || "Tu Nombre", MARGIN, y)
  y += 5

  if (dp.titulo) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(10)
    setColor(113, 113, 122)
    pdf.text(dp.titulo, MARGIN, y)
    y += 4
  }

  const contacto = [dp.email, dp.telefono, dp.ubicacion, dp.linkedin]
    .filter(Boolean)
    .join("  ·  ")
  if (contacto) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(9)
    setColor(113, 113, 122)
    const lineas = pdf.splitTextToSize(contacto, CONTENT_WIDTH)
    pdf.text(lineas, MARGIN, y)
    y += lineas.length * 4
  }

  y += 3
  pdf.setDrawColor(color.r, color.g, color.b)
  pdf.setLineWidth(0.3)
  pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
  y += 8

  // --- Ciudad y fecha (alineada a la derecha) ---
  if (carta.ciudadFecha) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(10)
    setColor(82, 82, 91)
    pdf.text(carta.ciudadFecha, PAGE_WIDTH - MARGIN, y, { align: "right" })
    y += 8
  }

  // --- Destinatario ---
  if (carta.destinatario) {
    pdf.setFont(fuenteBase, "bold")
    pdf.setFontSize(10)
    setColor(24, 24, 27)
    pdf.text(carta.destinatario, MARGIN, y)
    y += 4
  }
  if (carta.empresaDestino) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(10)
    setColor(82, 82, 91)
    pdf.text(carta.empresaDestino, MARGIN, y)
    y += 4
  }
  if (carta.cargoPostulado) {
    pdf.setFont(fuenteBase, "oblique")
    pdf.setFontSize(9)
    setColor(113, 113, 122)
    pdf.text(`Postulacion: ${carta.cargoPostulado}`, MARGIN, y)
    y += 6
  } else if (carta.destinatario || carta.empresaDestino) {
    y += 4
  }

  // --- Cuerpo ---
  if (carta.cuerpo) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(11)
    setColor(55, 55, 60)
    const parrafos = carta.cuerpo.split(/\n\n+/)
    for (const parrafo of parrafos) {
      const lineas = pdf.splitTextToSize(parrafo, CONTENT_WIDTH)
      checkPage(lineas.length * 5)
      pdf.text(lineas, MARGIN, y, { lineHeightFactor: 1.5 })
      y += lineas.length * 5 + 3
    }
  }

  // --- Despedida y firma ---
  checkPage(18)
  y += 6
  if (carta.despedida) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(11)
    setColor(55, 55, 60)
    pdf.text(carta.despedida, MARGIN, y)
    y += 10
  }
  pdf.setFont(fuenteBase, "bold")
  pdf.setFontSize(11)
  setColor(24, 24, 27)
  pdf.text(dp.nombreCompleto || "Tu Nombre", MARGIN, y)

  const nombre = dp.nombreCompleto.trim().replace(/\s+/g, "_") || "carta"
  pdf.save(`${nombre}_carta.pdf`)
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}
