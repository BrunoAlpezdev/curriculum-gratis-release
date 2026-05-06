import { jsPDF } from "jspdf"
import type { DatosCurriculum, Personalizacion, SeccionOrdenable } from "@/types"
import { getColorHex } from "@/lib/colores"
import { formatearRangoFechas, formatearFechaEducacion, formatearFecha } from "@/lib/formato"
import { FUENTES, ORDEN_SECCIONES_INICIAL } from "@/lib/constantes"
import { etiquetasCv } from "@/lib/etiquetas-cv"

const MARGIN = 20
const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

/**
 * Genera un PDF con texto nativo (ATS-friendly).
 * Usado para las plantillas Clasico y Minimalista.
 */
export function generarPdfAts(
  datos: DatosCurriculum,
  personalizacion: Personalizacion,
) {
  const color = hexToRgb(getColorHex(personalizacion.color))
  const fuenteBase = FUENTES.find((f) => f.valor === personalizacion.fuente)?.jsPdf ?? "helvetica"
  const e = etiquetasCv(personalizacion.idiomaCv)
  const pdf = new jsPDF("p", "mm", "a4")
  let y = MARGIN

  function checkPage(needed: number) {
    if (y + needed > PAGE_HEIGHT - MARGIN) {
      pdf.addPage()
      y = MARGIN
    }
  }

  function setColor(r: number, g: number, b: number) {
    pdf.setTextColor(r, g, b)
  }

  function setAccent() {
    setColor(color.r, color.g, color.b)
  }

  function setBlack() {
    setColor(24, 24, 27)
  }

  function setMuted() {
    setColor(113, 113, 122)
  }

  /* Escribe cada linea con un checkPage entre medio para que
     bloques largos (perfil, descripciones) salten correctamente
     de pagina en vez de overflowear al borde inferior. */
  function escribirLineas(lineas: string[], altoLinea: number) {
    for (const linea of lineas) {
      checkPage(altoLinea)
      pdf.text(linea, MARGIN, y)
      y += altoLinea
    }
  }

  // --- Header ---
  const dp = datos.datosPersonales

  pdf.setFont(fuenteBase, "bold")
  pdf.setFontSize(20)
  setBlack()
  pdf.text(dp.nombreCompleto || e.tuNombre, PAGE_WIDTH / 2, y, { align: "center" })
  y += 7

  if (dp.titulo) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(11)
    setColor(82, 82, 91)
    pdf.text(dp.titulo, PAGE_WIDTH / 2, y, { align: "center" })
    y += 5
  }

  const contacto = [dp.email, dp.telefono, dp.ubicacion].filter(Boolean).join("  |  ")
  if (contacto) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(9)
    setMuted()
    pdf.text(contacto, PAGE_WIDTH / 2, y, { align: "center" })
    y += 4
  }

  const enlaces = [dp.linkedin, dp.github, dp.sitioWeb].filter(Boolean).join("  |  ")
  if (enlaces) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(9)
    setMuted()
    pdf.text(enlaces, PAGE_WIDTH / 2, y, { align: "center" })
    y += 4
  }

  // Linea separadora
  setAccent()
  pdf.setLineWidth(0.5)
  pdf.setDrawColor(color.r, color.g, color.b)
  pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
  y += 6

  // --- Perfil ---
  if (datos.perfil) {
    y = renderSeccion(pdf, e.perfilProfesional.toUpperCase(), y, color, fuenteBase)
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(10)
    setMuted()
    const lines = pdf.splitTextToSize(datos.perfil, CONTENT_WIDTH)
    escribirLineas(lines, 4)
    y += 4
  }

  const renderers: Record<SeccionOrdenable, () => void> = {
    experiencia: () => {
      if (datos.experiencia.length === 0) return
      y = renderSeccion(pdf, e.experienciaLaboral.toUpperCase(), y, color, fuenteBase)
      for (const exp of datos.experiencia) {
        checkPage(20)

        pdf.setFont(fuenteBase, "bold")
        pdf.setFontSize(10)
        setBlack()
        const cargo = exp.cargo || e.cargo
        const tituloLinea = exp.empresa ? `${cargo}, ${exp.empresa}` : cargo
        pdf.text(tituloLinea, MARGIN, y)

        const fecha = formatearRangoFechas(exp.fechaInicio, exp.fechaFin)
        if (fecha) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          setMuted()
          pdf.text(fecha, PAGE_WIDTH - MARGIN, y, { align: "right" })
        }
        y += 4

        if (exp.ubicacion) {
          pdf.setFont(fuenteBase, "italic")
          pdf.setFontSize(9)
          setMuted()
          pdf.text(exp.ubicacion, MARGIN, y)
          y += 4
        }

        if (exp.descripcion) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          setColor(82, 82, 91)
          const lines = pdf.splitTextToSize(exp.descripcion, CONTENT_WIDTH)
          escribirLineas(lines, 3.5)
          y += 1
        }

        if (exp.logros) {
          pdf.setFont(fuenteBase, "italic")
          pdf.setFontSize(9)
          setColor(63, 63, 70)
          const lines = pdf.splitTextToSize(`${e.logros}: ${exp.logros}`, CONTENT_WIDTH)
          escribirLineas(lines, 3.5)
          y += 1
        }

        y += 2
      }
    },
    educacion: () => {
      if (datos.educacion.length === 0) return
      y = renderSeccion(pdf, e.educacion.toUpperCase(), y, color, fuenteBase)
      for (const edu of datos.educacion) {
        checkPage(12)

        pdf.setFont(fuenteBase, "bold")
        pdf.setFontSize(10)
        setBlack()
        const titulo = edu.titulo || e.titulo
        const tituloLinea = edu.institucion ? `${titulo}, ${edu.institucion}` : titulo
        pdf.text(tituloLinea, MARGIN, y)

        const fecha = formatearFechaEducacion(edu.fechaInicio, edu.fechaFin)
        if (fecha) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          setMuted()
          pdf.text(fecha, PAGE_WIDTH - MARGIN, y, { align: "right" })
        }
        y += 4

        if (edu.descripcion) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          setColor(82, 82, 91)
          const lines = pdf.splitTextToSize(edu.descripcion, CONTENT_WIDTH)
          escribirLineas(lines, 3.5)
          y += 1
        }

        y += 2
      }
    },
    cursos: () => {
      if (datos.cursos.length === 0) return
      y = renderSeccion(pdf, e.cursosCertificaciones.toUpperCase(), y, color, fuenteBase)
      for (const curso of datos.cursos) {
        checkPage(10)

        const nombre = curso.nombre || e.curso
        pdf.setFont(fuenteBase, "bold")
        pdf.setFontSize(10)
        setBlack()
        pdf.text(nombre, MARGIN, y)

        if (curso.institucion) {
          /* "nombre, institucion" — institucion en peso normal, en linea con el nombre */
          const offsetX = MARGIN + pdf.getTextWidth(nombre)
          pdf.setFont(fuenteBase, "normal")
          setColor(82, 82, 91)
          pdf.text(`, ${curso.institucion}`, offsetX, y)
        }

        if (curso.fecha) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          setMuted()
          pdf.text(formatearFecha(curso.fecha), PAGE_WIDTH - MARGIN, y, { align: "right" })
        }
        y += 4

        if (curso.url) {
          pdf.setFont(fuenteBase, "italic")
          pdf.setFontSize(9)
          setMuted()
          pdf.text(curso.url, MARGIN, y)
          y += 4
        }

        y += 1
      }
      y += 2
    },
    proyectos: () => {
      if (datos.proyectos.length === 0) return
      y = renderSeccion(pdf, e.proyectos.toUpperCase(), y, color, fuenteBase)
      for (const p of datos.proyectos) {
        checkPage(14)

        pdf.setFont(fuenteBase, "bold")
        pdf.setFontSize(10)
        setBlack()
        pdf.text(p.nombre || e.proyecto, MARGIN, y)

        if (p.url) {
          pdf.setFont(fuenteBase, "italic")
          pdf.setFontSize(9)
          setMuted()
          pdf.text(p.url, PAGE_WIDTH - MARGIN, y, { align: "right" })
        }
        y += 4

        if (p.tecnologias) {
          pdf.setFont(fuenteBase, "italic")
          pdf.setFontSize(9)
          setMuted()
          pdf.text(p.tecnologias, MARGIN, y)
          y += 4
        }

        if (p.descripcion) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          setColor(82, 82, 91)
          const lines = pdf.splitTextToSize(p.descripcion, CONTENT_WIDTH)
          escribirLineas(lines, 3.5)
          y += 1
        }

        y += 2
      }
    },
    habilidades: () => {
      if (datos.habilidades.length === 0) return
      y = renderSeccion(pdf, e.competencias.toUpperCase(), y, color, fuenteBase)
      /* Chips con borde redondeado para imitar el preview.
         Medimos cada texto, dibujamos un rect con padding y wrappeamos
         a la siguiente fila si no cabe. */
      pdf.setFont(fuenteBase, "normal")
      pdf.setFontSize(9)
      const padX = 2.2
      const padY = 1.2
      const altoChip = 4.6
      const gapX = 1.8
      const gapY = 1.6
      let x = MARGIN
      for (const h of datos.habilidades) {
        const ancho = pdf.getTextWidth(h) + padX * 2
        if (x + ancho > PAGE_WIDTH - MARGIN) {
          x = MARGIN
          y += altoChip + gapY
          checkPage(altoChip)
        }
        pdf.setDrawColor(212, 212, 216)
        pdf.setLineWidth(0.2)
        pdf.roundedRect(x, y - altoChip + padY + 0.4, ancho, altoChip, 1.2, 1.2)
        setColor(63, 63, 70)
        pdf.text(h, x + padX, y)
        x += ancho + gapX
      }
      y += altoChip + 1
    },
    idiomas: () => {
      if (datos.idiomas.length === 0) return
      y = renderSeccion(pdf, e.idiomas.toUpperCase(), y, color, fuenteBase)
      pdf.setFont(fuenteBase, "normal")
      pdf.setFontSize(10)
      setColor(63, 63, 70)
      const texto = datos.idiomas
        .map((i) => `${i.nombre || e.idioma} (${i.nivel})`)
        .join("     ")
      const lines = pdf.splitTextToSize(texto, CONTENT_WIDTH)
      escribirLineas(lines, 4)
      y += 4
    },
    referencias: () => {
      if (datos.referencias.length === 0) return
      y = renderSeccion(pdf, e.referencias.toUpperCase(), y, color, fuenteBase)
      for (const ref of datos.referencias) {
        checkPage(16)

        pdf.setFont(fuenteBase, "bold")
        pdf.setFontSize(10)
        setBlack()
        pdf.text(ref.nombre || e.nombre, MARGIN, y)
        y += 4

        const cargoEmpresa = [ref.cargo, ref.empresa].filter(Boolean).join(" · ")
        if (cargoEmpresa) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          setColor(82, 82, 91)
          pdf.text(cargoEmpresa, MARGIN, y)
          y += 4
        }

        if (ref.relacion) {
          pdf.setFont(fuenteBase, "italic")
          pdf.setFontSize(9)
          setMuted()
          pdf.text(ref.relacion, MARGIN, y)
          y += 4
        }

        const contactoRef = [ref.email, ref.telefono].filter(Boolean).join("  ·  ")
        if (contactoRef) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          setMuted()
          pdf.text(contactoRef, MARGIN, y)
          y += 4
        }

        y += 2
      }
    },
  }

  const orden = personalizacion.ordenSecciones ?? ORDEN_SECCIONES_INICIAL
  for (const id of orden) {
    renderers[id]()
  }

  // --- Informacion adicional (disponibilidad / pretensiones) ---
  if (datos.disponibilidad || datos.pretensionesRenta) {
    checkPage(12)
    y += 3
    pdf.setDrawColor(220, 220, 220)
    pdf.setLineWidth(0.2)
    pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
    y += 4

    pdf.setFontSize(9)
    if (datos.disponibilidad) {
      const etiquetaDisp = `${e.disponibilidad}:`
      pdf.setFont(fuenteBase, "bold")
      setAccent()
      pdf.text(etiquetaDisp, MARGIN, y)
      const w = pdf.getTextWidth(`${etiquetaDisp} `)
      pdf.setFont(fuenteBase, "normal")
      setColor(82, 82, 91)
      pdf.text(datos.disponibilidad, MARGIN + w, y)
      y += 4
    }
    if (datos.pretensionesRenta) {
      const etiquetaPret = `${e.pretensionRenta}:`
      pdf.setFont(fuenteBase, "bold")
      setAccent()
      pdf.text(etiquetaPret, MARGIN, y)
      const w = pdf.getTextWidth(`${etiquetaPret} `)
      pdf.setFont(fuenteBase, "normal")
      setColor(82, 82, 91)
      pdf.text(datos.pretensionesRenta, MARGIN + w, y)
      y += 4
    }
  }

  const nombre = dp.nombreCompleto.trim().replace(/\s+/g, "_") || "curriculum"
  pdf.save(`${nombre}_CV.pdf`)
}

function renderSeccion(
  pdf: jsPDF,
  titulo: string,
  y: number,
  color: { r: number; g: number; b: number },
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

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}
