import { jsPDF } from "jspdf"
import type { Carta, DatosCurriculum, Personalizacion } from "@/types"
import { getColorHex } from "@/lib/colores"
import { etiquetasCv } from "@/lib/etiquetas-cv"
import { urlAbsoluta, limpiarParaPdf } from "@/lib/formato"
import { registrarFuentePdf } from "@/lib/fuentes-pdf"
import { hexToRgb } from "@/lib/generar-pdf-ats-helpers"

const MARGIN = 25
const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

export async function generarPdfCarta(
  datos: DatosCurriculum,
  carta: Carta,
  personalizacion: Personalizacion,
) {
  const color = hexToRgb(getColorHex(personalizacion.color))
  const et = etiquetasCv(personalizacion.idiomaCv)
  const pdf = new jsPDF("p", "mm", "a4")
  const fuenteBase = await registrarFuentePdf(pdf, personalizacion.fuente)
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
  pdf.text(limpiarParaPdf(dp.nombreCompleto) || et.tuNombre, MARGIN, y)
  y += 5

  if (dp.titulo) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(10)
    setColor(113, 113, 122)
    pdf.text(limpiarParaPdf(dp.titulo), MARGIN, y)
    y += 4
  }

  const segmentos = [
    { texto: dp.email, url: dp.email ? urlAbsoluta(dp.email) : undefined },
    { texto: dp.telefono },
    { texto: limpiarParaPdf(dp.ubicacion) },
    { texto: dp.linkedin, url: dp.linkedin ? urlAbsoluta(dp.linkedin) : undefined },
  ].filter((s) => s.texto)
  if (segmentos.length > 0) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(9)
    setColor(113, 113, 122)
    const SEP = "  ·  "
    const anchoSep = pdf.getTextWidth(SEP)
    let x = MARGIN
    segmentos.forEach((seg, i) => {
      const ancho = pdf.getTextWidth(seg.texto)
      if (x + ancho > PAGE_WIDTH - MARGIN && x > MARGIN) {
        x = MARGIN
        y += 4
      }
      if (seg.url) pdf.textWithLink(seg.texto, x, y, { url: seg.url })
      else pdf.text(seg.texto, x, y)
      x += ancho
      if (i < segmentos.length - 1) {
        pdf.text(SEP, x, y)
        x += anchoSep
      }
    })
    y += 4
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
    pdf.text(limpiarParaPdf(carta.ciudadFecha), PAGE_WIDTH - MARGIN, y, { align: "right" })
    y += 8
  }

  // --- Destinatario ---
  if (carta.destinatario) {
    pdf.setFont(fuenteBase, "bold")
    pdf.setFontSize(10)
    setColor(24, 24, 27)
    pdf.text(limpiarParaPdf(carta.destinatario), MARGIN, y)
    y += 4
  }
  if (carta.empresaDestino) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(10)
    setColor(82, 82, 91)
    pdf.text(limpiarParaPdf(carta.empresaDestino), MARGIN, y)
    y += 4
  }
  if (carta.cargoPostulado) {
    pdf.setFont(fuenteBase, "italic")
    pdf.setFontSize(9)
    setColor(113, 113, 122)
    pdf.text(`${et.postulacion}: ${limpiarParaPdf(carta.cargoPostulado)}`, MARGIN, y)
    y += 6
  } else if (carta.destinatario || carta.empresaDestino) {
    y += 4
  }

  // --- Cuerpo ---
  const ALTO_LINEA = 5.5
  if (carta.cuerpo) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(11)
    setColor(55, 55, 60)
    const parrafos = limpiarParaPdf(carta.cuerpo).split(/\n\n+/)
    for (const parrafo of parrafos) {
      const lineas = pdf.splitTextToSize(parrafo, CONTENT_WIDTH)
      for (const linea of lineas) {
        checkPage(ALTO_LINEA)
        pdf.text(linea, MARGIN, y)
        y += ALTO_LINEA
      }
      y += 3
    }
  }

  // --- Despedida y firma ---
  checkPage(18)
  y += 6
  if (carta.despedida) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(11)
    setColor(55, 55, 60)
    pdf.text(limpiarParaPdf(carta.despedida), MARGIN, y)
    y += 10
  }
  pdf.setFont(fuenteBase, "bold")
  pdf.setFontSize(11)
  setColor(24, 24, 27)
  pdf.text(limpiarParaPdf(dp.nombreCompleto) || et.tuNombre, MARGIN, y)

  const nombreDoc = dp.nombreCompleto || et.tuNombre
  pdf.setProperties({
    title: `${nombreDoc} - ${et.cartaPresentacion}`,
    author: nombreDoc,
    subject: carta.cargoPostulado ?? "",
    creator: "curriculum-gratis",
  })
  pdf.setLanguage(personalizacion.idiomaCv ?? "es")

  const nombre = dp.nombreCompleto.trim().replace(/\s+/g, "_") || "carta"
  pdf.save(`${nombre}_carta.pdf`)
}
