import type { jsPDF } from "jspdf"
import { parsearTextoRico } from "@/lib/texto-rico"

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
  urlFecha?: string,
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
      if (urlFecha) {
        const xFecha = PAGE_WIDTH - MARGIN - pdf.getTextWidth(fecha)
        pdf.textWithLink(fecha, xFecha, y, { url: urlFecha })
      } else {
        pdf.text(fecha, PAGE_WIDTH - MARGIN, y, { align: "right" })
      }
    }
    pdf.setFont(fuenteBase, "bold")
    pdf.setFontSize(10)
    pdf.setTextColor(24, 24, 27)
    pdf.text(linea, MARGIN, y)
    y += 4
  })

  return y
}

/* Dibuja segmentos centrados horizontalmente, donde los segmentos con `url` se
   renderizan como enlaces clickeables (textWithLink) y el resto como texto plano.
   Si todos caben en CONTENT_WIDTH van en una sola linea centrada; si no, se
   agrupan en filas (sin partir cada segmento) y cada fila se centra por separado.
   Devuelve la nueva `y`. Usa la fuente/tamano/color ya activos en el pdf. */
export function escribirLineaEnlacesCentrada(
  pdf: jsPDF,
  segmentos: { texto: string; url?: string }[],
  y: number,
  altoLinea = 4,
): number {
  const visibles = segmentos.filter((s) => s.texto)
  if (visibles.length === 0) return y
  const SEP = "  |  "
  const anchoSep = pdf.getTextWidth(SEP)
  const anchos = visibles.map((s) => pdf.getTextWidth(s.texto))
  const total =
    anchos.reduce((a, b) => a + b, 0) + anchoSep * (visibles.length - 1)

  /* Agrupamos en filas: acumulamos mientras el ancho de la fila no exceda
     CONTENT_WIDTH. Un segmento que por si solo no cabe va en su propia fila. */
  const filas: { seg: { texto: string; url?: string }; ancho: number }[][] = []
  if (total <= CONTENT_WIDTH) {
    filas.push(visibles.map((seg, i) => ({ seg, ancho: anchos[i]! })))
  } else {
    let filaActual: { seg: { texto: string; url?: string }; ancho: number }[] = []
    let anchoFila = 0
    for (let i = 0; i < visibles.length; i++) {
      const ancho = anchos[i]!
      const extra = filaActual.length === 0 ? ancho : anchoSep + ancho
      if (filaActual.length > 0 && anchoFila + extra > CONTENT_WIDTH) {
        filas.push(filaActual)
        filaActual = []
        anchoFila = 0
      }
      filaActual.push({ seg: visibles[i]!, ancho })
      anchoFila += filaActual.length === 1 ? ancho : anchoSep + ancho
    }
    if (filaActual.length > 0) filas.push(filaActual)
  }

  for (const fila of filas) {
    const anchoFila =
      fila.reduce((a, f) => a + f.ancho, 0) + anchoSep * (fila.length - 1)
    let x = PAGE_WIDTH / 2 - anchoFila / 2
    fila.forEach(({ seg, ancho }, i) => {
      if (seg.url) {
        pdf.textWithLink(seg.texto, x, y, { url: seg.url })
      } else {
        pdf.text(seg.texto, x, y)
      }
      x += ancho
      if (i < fila.length - 1) {
        pdf.text(SEP, x, y)
        x += anchoSep
      }
    })
    y += altoLinea
  }
  return y
}

/* Sangria colgante (mm) de las viñetas en el PDF: el glifo va en MARGIN y el
   texto (incluidos los wraps) en MARGIN + SANGRIA_VINETA. */
const SANGRIA_VINETA = 4

/* Escribe texto multilinea con viñetas respetando los saltos del usuario, usando
   el MISMO parseo que el preview. Recibe y, devuelve la nueva y, y aplica
   checkPage por cada linea dibujada (checkPage devuelve la y posiblemente
   reiniciada tras un salto de pagina). */
export function escribirTextoRico(
  pdf: jsPDF,
  texto: string,
  y: number,
  altoLinea: number,
  checkPage: (y: number, needed: number) => number,
): number {
  for (const linea of parsearTextoRico(texto)) {
    if (linea.tipo === "parrafo") {
      if (linea.contenido === "") {
        y += altoLinea / 2
        continue
      }
      const wrap: string[] = pdf.splitTextToSize(linea.contenido, CONTENT_WIDTH)
      for (const l of wrap) {
        y = checkPage(y, altoLinea)
        pdf.text(l, MARGIN, y)
        y += altoLinea
      }
    } else {
      const wrap: string[] = pdf.splitTextToSize(linea.contenido, CONTENT_WIDTH - SANGRIA_VINETA)
      wrap.forEach((l, i) => {
        y = checkPage(y, altoLinea)
        if (i === 0) pdf.text("•", MARGIN, y)
        pdf.text(l, MARGIN + SANGRIA_VINETA, y)
        y += altoLinea
      })
    }
  }
  return y
}

export function hexToRgb(hex: string): PdfColor {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}
