import type { jsPDF } from "jspdf"

export const MARGIN = 20
export const PAGE_WIDTH = 210
export const PAGE_HEIGHT = 297
export const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

export interface PdfColor {
  r: number
  g: number
  b: number
}

export function renderSeccion(
  pdf: jsPDF,
  titulo: string,
  y: number,
  color: PdfColor,
  fuenteBase: string,
): number {
  if (y + 10 > PAGE_HEIGHT - MARGIN) {
    pdf.addPage()
    y = MARGIN
  }

  pdf.setFont(fuenteBase, "bold")
  pdf.setFontSize(10)
  pdf.setTextColor(color.r, color.g, color.b)
  pdf.text(titulo, MARGIN, y)
  y += 1
  pdf.setDrawColor(color.r, color.g, color.b)
  pdf.setLineWidth(0.3)
  pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
  y += 5
  return y
}

/* Escribe un título (bold 10) con una fecha opcional alineada a la derecha,
   envolviendo el título en varias líneas cuando es largo para que nunca cruce
   el margen derecho ni se superponga con la fecha. Devuelve la nueva y. */
export function escribirTituloConFecha(
  pdf: jsPDF,
  titulo: string,
  fecha: string,
  y: number,
  fuenteBase: string,
): number {
  pdf.setFont(fuenteBase, "normal")
  pdf.setFontSize(9)
  const anchoFecha = fecha ? pdf.getTextWidth(fecha) + 3 : 0

  pdf.setFont(fuenteBase, "bold")
  pdf.setFontSize(10)
  const lineas: string[] = pdf.splitTextToSize(titulo, CONTENT_WIDTH - anchoFecha)

  lineas.forEach((linea, i) => {
    if (y + 4 > PAGE_HEIGHT - MARGIN) {
      pdf.addPage()
      y = MARGIN
    }
    if (i === 0 && fecha) {
      pdf.setFont(fuenteBase, "normal")
      pdf.setFontSize(9)
      pdf.setTextColor(113, 113, 122)
      pdf.text(fecha, PAGE_WIDTH - MARGIN, y, { align: "right" })
    }
    pdf.setFont(fuenteBase, "bold")
    pdf.setFontSize(10)
    pdf.setTextColor(24, 24, 27)
    pdf.text(linea, MARGIN, y)
    y += 4
  })

  return y
}

export function hexToRgb(hex: string): PdfColor {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}
