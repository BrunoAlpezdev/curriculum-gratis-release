import { jsPDF } from "jspdf"
import type { DatosCurriculum, Personalizacion, SeccionOrdenable } from "@/types"
import { getColorHex } from "@/lib/colores"
import { formatearRangoFechas, formatearFechaEducacion, formatearFecha, urlAbsoluta, limpiarParaPdf } from "@/lib/formato"
import { ORDEN_SECCIONES_INICIAL } from "@/lib/constantes"
import { etiquetaNivelIdioma, etiquetasCv } from "@/lib/etiquetas-cv"
import { registrarFuentePdf } from "@/lib/fuentes-pdf"
import { esTextoSimple } from "@/lib/texto-rico"
import { sinEntradasVacias } from "@/lib/entradas-vacias"
import {
  CONTENT_WIDTH,
  MARGIN,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  hexToRgb,
  renderSeccion,
  escribirTituloConFecha,
  escribirLineaEnlacesCentrada,
  escribirTextoRico,
} from "@/lib/generar-pdf-ats-helpers"

export async function generarPdfAts(
  datos: DatosCurriculum,
  personalizacion: Personalizacion,
) {
  const { pdf, nombreArchivo } = await crearPdfAts(datos, personalizacion)
  pdf.save(nombreArchivo)
}

export async function crearPdfAts(
  datosCrudos: DatosCurriculum,
  personalizacion: Personalizacion,
) {
  const datos = sinEntradasVacias(datosCrudos)
  const color = hexToRgb(getColorHex(personalizacion.color))
  const e = etiquetasCv(personalizacion.idiomaCv)
  const pdf = new jsPDF("p", "mm", "a4")
  const fuenteBase = await registrarFuentePdf(pdf, personalizacion.fuente)
  let y = MARGIN

  function checkPage(needed: number) {
    if (y + needed > PAGE_HEIGHT - MARGIN) {
      pdf.addPage()
      y = MARGIN
    }
  }

  /* Version pura de checkPage para escribirTextoRico, que gestiona su propia y:
     recibe y devuelve la y (reiniciada a MARGIN si hubo salto de pagina). */
  function checkPagePura(yy: number, needed: number): number {
    if (yy + needed > PAGE_HEIGHT - MARGIN) {
      pdf.addPage()
      return MARGIN
    }
    return yy
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

  function escribirLineas(lineas: string[], altoLinea: number) {
    for (const linea of lineas) {
      checkPage(altoLinea)
      pdf.text(linea, MARGIN, y)
      y += altoLinea
    }
  }

  const dp = datos.datosPersonales

  pdf.setFont(fuenteBase, "bold")
  pdf.setFontSize(20)
  setBlack()
  pdf.text(limpiarParaPdf(dp.nombreCompleto) || e.tuNombre, PAGE_WIDTH / 2, y, { align: "center" })
  y += 7

  if (dp.titulo) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(11)
    setColor(82, 82, 91)
    pdf.text(limpiarParaPdf(dp.titulo), PAGE_WIDTH / 2, y, { align: "center" })
    y += 5
  }

  const contacto = [
    { texto: limpiarParaPdf(dp.email), url: dp.email ? urlAbsoluta(dp.email) : undefined },
    { texto: limpiarParaPdf(dp.telefono) },
    { texto: dp.rut ? `RUT ${limpiarParaPdf(dp.rut)}` : "" },
    { texto: limpiarParaPdf(dp.ubicacion) },
  ].filter((s) => s.texto)
  if (contacto.length > 0) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(9)
    setMuted()
    y = escribirLineaEnlacesCentrada(pdf, contacto, y)
  }

  const enlaces = [dp.linkedin, dp.github, dp.sitioWeb]
    .filter(Boolean)
    .map((v) => ({ texto: limpiarParaPdf(v), url: urlAbsoluta(v) }))
  if (enlaces.length > 0) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(9)
    setMuted()
    y = escribirLineaEnlacesCentrada(pdf, enlaces, y)
  }

  setAccent()
  pdf.setLineWidth(0.5)
  pdf.setDrawColor(color.r, color.g, color.b)
  pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
  y += 6

  if (datos.perfil) {
    y = renderSeccion(pdf, e.perfilProfesional.toUpperCase(), y, color, fuenteBase)
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(10)
    setMuted()
    y = escribirTextoRico(pdf, limpiarParaPdf(datos.perfil), y, 4, checkPagePura)
    y += 4
  }

  const renderers: Record<SeccionOrdenable, () => void> = {
    experiencia: () => {
      if (datos.experiencia.length === 0) return
      y = renderSeccion(pdf, e.experienciaLaboral.toUpperCase(), y, color, fuenteBase)
      for (const exp of datos.experiencia) {
        checkPage(20)

        const cargo = limpiarParaPdf(exp.cargo) || e.cargo
        const empresa = limpiarParaPdf(exp.empresa)
        const tituloLinea = empresa ? `${cargo}, ${empresa}` : cargo
        const fecha = formatearRangoFechas(exp.fechaInicio, exp.fechaFin, personalizacion.idiomaCv)
        y = escribirTituloConFecha(pdf, tituloLinea, fecha, y, fuenteBase)

        if (exp.ubicacion) {
          pdf.setFont(fuenteBase, "italic")
          pdf.setFontSize(9)
          setMuted()
          pdf.text(limpiarParaPdf(exp.ubicacion), MARGIN, y)
          y += 4
        }

        if (exp.descripcion) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          setColor(82, 82, 91)
          y = escribirTextoRico(pdf, limpiarParaPdf(exp.descripcion), y, 3.5, checkPagePura)
          y += 1
        }

        if (exp.logros) {
          pdf.setFontSize(9)
          setColor(63, 63, 70)
          if (esTextoSimple(exp.logros)) {
            pdf.setFont(fuenteBase, "italic")
            const lines = pdf.splitTextToSize(`${e.logros}: ${limpiarParaPdf(exp.logros)}`, CONTENT_WIDTH)
            escribirLineas(lines, 3.5)
          } else {
            pdf.setFont(fuenteBase, "bold")
            y = checkPagePura(y, 3.5)
            pdf.text(`${e.logros}:`, MARGIN, y)
            y += 3.5
            pdf.setFont(fuenteBase, "italic")
            y = escribirTextoRico(pdf, limpiarParaPdf(exp.logros), y, 3.5, checkPagePura)
          }
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

        const titulo = limpiarParaPdf(edu.titulo) || e.titulo
        const institucion = limpiarParaPdf(edu.institucion)
        const tituloLinea = institucion ? `${titulo}, ${institucion}` : titulo
        const fecha = formatearFechaEducacion(edu.fechaInicio, edu.fechaFin, personalizacion.idiomaCv)
        y = escribirTituloConFecha(pdf, tituloLinea, fecha, y, fuenteBase)

        if (edu.descripcion) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          setColor(82, 82, 91)
          y = escribirTextoRico(pdf, limpiarParaPdf(edu.descripcion), y, 3.5, checkPagePura)
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

        const nombre = limpiarParaPdf(curso.nombre) || e.curso
        const institucionCurso = limpiarParaPdf(curso.institucion)
        const tituloCurso = institucionCurso ? `${nombre}, ${institucionCurso}` : nombre
        const fecha = curso.fecha ? formatearFecha(curso.fecha, personalizacion.idiomaCv) : ""
        y = escribirTituloConFecha(pdf, tituloCurso, fecha, y, fuenteBase)

        if (curso.url) {
          pdf.setFont(fuenteBase, "italic")
          pdf.setFontSize(9)
          setMuted()
          pdf.textWithLink(curso.url, MARGIN, y, { url: urlAbsoluta(curso.url) })
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

        y = escribirTituloConFecha(
          pdf,
          limpiarParaPdf(p.nombre) || e.proyecto,
          p.url ?? "",
          y,
          fuenteBase,
          p.url ? urlAbsoluta(p.url) : undefined,
        )

        if (p.tecnologias) {
          pdf.setFont(fuenteBase, "italic")
          pdf.setFontSize(9)
          setMuted()
          pdf.text(limpiarParaPdf(p.tecnologias), MARGIN, y)
          y += 4
        }

        if (p.descripcion) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          setColor(82, 82, 91)
          y = escribirTextoRico(pdf, limpiarParaPdf(p.descripcion), y, 3.5, checkPagePura)
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
      for (const habilidad of datos.habilidades) {
        const h = limpiarParaPdf(habilidad)
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
        .map((i) => `${limpiarParaPdf(i.nombre) || e.idioma} (${etiquetaNivelIdioma(i.nivel, personalizacion.idiomaCv)})`)
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
        pdf.text(limpiarParaPdf(ref.nombre) || e.nombre, MARGIN, y)
        y += 4

        const cargoEmpresa = [ref.cargo, ref.empresa].filter(Boolean).map(limpiarParaPdf).join(" · ")
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
          pdf.text(limpiarParaPdf(ref.relacion), MARGIN, y)
          y += 4
        }

        const contactoRef = [ref.email, ref.telefono].filter(Boolean).map(limpiarParaPdf).join("  ·  ")
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
      pdf.text(limpiarParaPdf(datos.disponibilidad), MARGIN + w, y)
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
      pdf.text(limpiarParaPdf(datos.pretensionesRenta), MARGIN + w, y)
      y += 4
    }
  }

  pdf.setProperties({
    title: `${dp.nombreCompleto || e.tuNombre} - CV`,
    author: dp.nombreCompleto || e.tuNombre,
    subject: dp.titulo ?? "",
    creator: "curriculum-gratis",
  })
  pdf.setLanguage(personalizacion.idiomaCv ?? "es")

  const nombre = dp.nombreCompleto.trim().replace(/\s+/g, "_") || "curriculum"
  return { pdf, nombreArchivo: `${nombre}_CV.pdf` }
}
