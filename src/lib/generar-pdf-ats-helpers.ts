import type { jsPDF } from "jspdf"
import type { DatosPersonales, PlantillaId } from "@/types"
import { parsearTextoRico } from "@/lib/texto-rico"
import { limpiarParaPdf, urlAbsoluta } from "@/lib/formato"

export const MARGIN = 20
export const PAGE_WIDTH = 210
export const PAGE_HEIGHT = 297
export const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

export interface PdfColor {
  r: number
  g: number
  b: number
}

/* Estilo del PDF ATS por plantilla: ambas plantillas ATS comparten el pipeline
   (fuentes, paginacion, secciones) pero difieren en el encabezado y algunos
   detalles para que el PDF descargado coincida con el preview elegido. */
export interface EstiloAts {
  header: "centro" | "izquierda"
  nombreBold: boolean
  nombreSize: number
  tituloSize: number
  contactoSize: number
  seccionSize: number
  seccionGapBefore: number
  seccionGapAfter: number
  tituloAcento: boolean
  separadorTitulo: string
  mostrarUbicacion: boolean
  etiquetaLogros: boolean
  seccionConLinea: boolean
}

export function estiloPdfAts(plantilla: PlantillaId): EstiloAts {
  if (plantilla === "minimalista") {
    return {
      header: "izquierda",
      nombreBold: false,
      nombreSize: 22,
      tituloSize: 11,
      contactoSize: 9,
      seccionSize: 10,
      seccionGapBefore: 0,
      seccionGapAfter: 5,
      tituloAcento: true,
      separadorTitulo: " — ",
      mostrarUbicacion: false,
      etiquetaLogros: false,
      seccionConLinea: false,
    }
  }
  return {
    header: "centro",
    nombreBold: true,
    nombreSize: 22,
    tituloSize: 13,
    contactoSize: 11,
    seccionSize: 11,
    seccionGapBefore: 2,
    seccionGapAfter: 4,
    tituloAcento: false,
    separadorTitulo: ", ",
    mostrarUbicacion: true,
    etiquetaLogros: true,
    seccionConLinea: true,
  }
}

const GRIS_TITULO: PdfColor = { r: 161, g: 161, b: 170 }

export function renderSeccion(
  pdf: jsPDF,
  titulo: string,
  y: number,
  color: PdfColor,
  fuenteBase: string,
  conLinea = true,
  fontSize = 10,
  gapAfter = 5,
): number {
  if (y + 10 > PAGE_HEIGHT - MARGIN) {
    pdf.addPage()
    y = MARGIN
  }

  pdf.setFont(fuenteBase, "bold")
  pdf.setFontSize(fontSize)
  pdf.setTextColor(color.r, color.g, color.b)
  const lineasTitulo = pdf.splitTextToSize(titulo, CONTENT_WIDTH)
  for (const linea of lineasTitulo) {
    if (y + 4 > PAGE_HEIGHT - MARGIN) {
      pdf.addPage()
      y = MARGIN
    }
    pdf.text(linea, MARGIN, y)
    y += 4
  }
  if (conLinea) {
    y += 1
    pdf.setDrawColor(color.r, color.g, color.b)
    pdf.setLineWidth(0.3)
    pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
    y += gapAfter
  } else {
    y += gapAfter
  }
  return y
}

/* Encabezado del PDF ATS (nombre, titulo, contactos, filete). Devuelve la nueva
   y. Harvard: centrado, nombre bold, filete de acento. Minimalista: alineado a
   la izquierda, nombre liviano, titulo en color de acento, filete gris fino. */
export function escribirEncabezadoAts(
  pdf: jsPDF,
  dp: DatosPersonales,
  tuNombre: string,
  fuenteBase: string,
  color: PdfColor,
  estilo: EstiloAts,
): number {
  let y = MARGIN
  const centrado = estilo.header === "centro"
  const x = centrado ? PAGE_WIDTH / 2 : MARGIN
  const opts = centrado ? ({ align: "center" } as const) : undefined

  pdf.setFont(fuenteBase, estilo.nombreBold ? "bold" : "normal")
  pdf.setFontSize(estilo.nombreSize)
  pdf.setTextColor(24, 24, 27)
  const lineasNombre = pdf.splitTextToSize(limpiarParaPdf(dp.nombreCompleto) || tuNombre, CONTENT_WIDTH)
  for (const linea of lineasNombre) {
    pdf.text(linea, x, y, opts)
    y += centrado ? 7.5 : 7
  }

  if (dp.titulo) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(estilo.tituloSize)
    if (estilo.tituloAcento) pdf.setTextColor(color.r, color.g, color.b)
    else pdf.setTextColor(82, 82, 91)
    const lineasTitulo = pdf.splitTextToSize(limpiarParaPdf(dp.titulo), CONTENT_WIDTH)
    for (const linea of lineasTitulo) {
      pdf.text(linea, x, y, opts)
      y += centrado ? 5.5 : 5
    }
  }

  const contacto = [
    { texto: limpiarParaPdf(dp.email), url: dp.email ? urlAbsoluta(dp.email) : undefined },
    { texto: limpiarParaPdf(dp.telefono) },
    { texto: dp.rut ? `RUT ${limpiarParaPdf(dp.rut)}` : "" },
    { texto: limpiarParaPdf(dp.ubicacion) },
  ]
  const enlaces = [dp.linkedin, dp.github, dp.sitioWeb]
    .filter(Boolean)
    .map((v) => ({ texto: limpiarParaPdf(v), url: urlAbsoluta(v) }))

  pdf.setFont(fuenteBase, "normal")
  pdf.setFontSize(estilo.contactoSize)
  pdf.setTextColor(113, 113, 122)
  if (centrado) {
    y = escribirLineaEnlacesCentrada(pdf, contacto, y, 4.5)
    if (enlaces.length > 0) y = escribirLineaEnlacesCentrada(pdf, enlaces, y, 4.5)
  } else {
    y = escribirLineaEnlacesCentrada(pdf, [...contacto, ...enlaces], y, 4, "izquierda")
  }

  if (centrado) {
    pdf.setDrawColor(color.r, color.g, color.b)
    pdf.setLineWidth(0.5)
    pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
    y += 6
  } else {
    pdf.setDrawColor(228, 228, 231)
    pdf.setLineWidth(0.2)
    pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
    y += 5
  }
  return y
}

export { GRIS_TITULO }

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
  const lineas: string[] = pdf.splitTextToSize(titulo, Math.max(30, CONTENT_WIDTH - anchoFecha))

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
  alinear: "centro" | "izquierda" = "centro",
): number {
  const visibles = segmentos.filter((s) => s.texto)
  if (visibles.length === 0) return y
  if (visibles.some((segmento) => pdf.getTextWidth(segmento.texto) > CONTENT_WIDTH)) {
    for (const segmento of visibles) {
      const lineas = pdf.splitTextToSize(segmento.texto, CONTENT_WIDTH)
      for (const linea of lineas) {
        if (segmento.url && lineas.length === 1) {
          pdf.textWithLink(linea, MARGIN, y, { url: segmento.url })
        } else {
          pdf.text(linea, MARGIN, y)
        }
        y += altoLinea
      }
    }
    return y
  }
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
    let x = alinear === "izquierda" ? MARGIN : PAGE_WIDTH / 2 - anchoFila / 2
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
