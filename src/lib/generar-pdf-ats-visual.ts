import { jsPDF } from "jspdf"
import type { DatosCurriculum, Personalizacion, SeccionOrdenable } from "@/types"
import { getColorHex } from "@/lib/colores"
import { formatearRangoFechas, formatearFechaEducacion, formatearFecha, limpiarParaPdf, urlAbsoluta } from "@/lib/formato"
import { ORDEN_SECCIONES_INICIAL } from "@/lib/constantes"
import { etiquetaNivelIdioma, etiquetasCv } from "@/lib/etiquetas-cv"
import { registrarFuentePdf } from "@/lib/fuentes-pdf"
import { sinEntradasVacias } from "@/lib/entradas-vacias"
import {
  CONTENT_WIDTH,
  MARGIN,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  hexToRgb,
  renderSeccion,
  escribirTituloConFecha,
  escribirTextoRico,
} from "@/lib/generar-pdf-ats-helpers"

function escribirEncabezadoVisual(
  pdf: jsPDF,
  datos: DatosCurriculum,
  fuenteBase: string,
  color: { r: number; g: number; b: number },
  tuNombre: string,
): number {
  const dp = datos.datosPersonales
  pdf.setFont(fuenteBase, "bold")
  pdf.setFontSize(21)
  const nombre = pdf.splitTextToSize(limpiarParaPdf(dp.nombreCompleto) || tuNombre, CONTENT_WIDTH)
  pdf.setFont(fuenteBase, "normal")
  pdf.setFontSize(11)
  const titulo = dp.titulo ? pdf.splitTextToSize(limpiarParaPdf(dp.titulo), CONTENT_WIDTH) : []
  const contactos = [
    dp.email,
    dp.telefono,
    dp.rut ? `RUT ${dp.rut}` : "",
    dp.ubicacion,
    dp.linkedin,
    dp.github,
    dp.sitioWeb,
  ].filter(Boolean).map(limpiarParaPdf)
  pdf.setFontSize(8.5)
  const lineasContacto = contactos.flatMap((contacto) => pdf.splitTextToSize(contacto, CONTENT_WIDTH))
  const altura = Math.max(38, 10 + nombre.length * 8 + titulo.length * 5 + lineasContacto.length * 3.8 + 6)

  pdf.setFillColor(color.r, color.g, color.b)
  pdf.rect(0, 0, PAGE_WIDTH, altura, "F")
  let y = 10
  pdf.setTextColor(255, 255, 255)
  pdf.setFont(fuenteBase, "bold")
  pdf.setFontSize(21)
  for (const linea of nombre) {
    pdf.text(linea, MARGIN, y)
    y += 8
  }
  if (titulo.length > 0) {
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(11)
    for (const linea of titulo) {
      pdf.text(linea, MARGIN, y)
      y += 5
    }
  }
  if (lineasContacto.length > 0) {
    pdf.setFontSize(8.5)
    for (const linea of lineasContacto) {
      pdf.text(linea, MARGIN, y)
      y += 3.8
    }
  }
  return altura + 12
}

export async function crearPdfAtsVisual(
  datosCrudos: DatosCurriculum,
  personalizacion: Personalizacion,
) {
  const datos = sinEntradasVacias(datosCrudos)
  const dp = datos.datosPersonales
  const color = hexToRgb(getColorHex(personalizacion.color))
  const e = etiquetasCv(personalizacion.idiomaCv)
  const pdf = new jsPDF("p", "mm", "a4")
  const fuenteBase = await registrarFuentePdf(pdf, personalizacion.fuente)
  let y = escribirEncabezadoVisual(pdf, datos, fuenteBase, color, e.tuNombre)

  function checkPage(needed: number) {
    if (y + needed > PAGE_HEIGHT - MARGIN) {
      pdf.addPage()
      y = MARGIN
    }
  }

  function checkPagePura(yy: number, needed: number): number {
    if (yy + needed > PAGE_HEIGHT - MARGIN) {
      pdf.addPage()
      return MARGIN
    }
    return yy
  }

  function textoPlano(texto: string, altoLinea = 3.8) {
    const lineas = pdf.splitTextToSize(limpiarParaPdf(texto), CONTENT_WIDTH)
    for (const linea of lineas) {
      checkPage(altoLinea)
      pdf.text(linea, MARGIN, y)
      y += altoLinea
    }
  }

  function viñetas(items: string[]) {
    for (const item of items.filter((valor) => valor.trim())) {
      const lineas = pdf.splitTextToSize(limpiarParaPdf(item), CONTENT_WIDTH - 6)
      for (const [index, linea] of lineas.entries()) {
        checkPage(3.8)
        if (index === 0) pdf.text("•", MARGIN, y)
        pdf.text(linea, MARGIN + 5, y)
        y += 3.8
      }
    }
  }

  function seccion(titulo: string) {
    y = renderSeccion(pdf, limpiarParaPdf(titulo), y, color, fuenteBase, true)
  }

  if (datos.perfil) {
    seccion(e.perfilProfesional)
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(9.5)
    pdf.setTextColor(63, 63, 70)
    y = escribirTextoRico(pdf, limpiarParaPdf(datos.perfil), y, 3.8, checkPagePura)
    y += 3
  }

  const renderers: Record<SeccionOrdenable, () => void> = {
    experiencia: () => {
      if (datos.experiencia.length === 0) return
      seccion(e.experienciaLaboral)
      for (const experiencia of datos.experiencia) {
        checkPage(16)
        const titulo = [experiencia.cargo || e.cargo, experiencia.empresa].filter(Boolean).join(" — ")
        y = escribirTituloConFecha(
          pdf,
          limpiarParaPdf(titulo),
          formatearRangoFechas(experiencia.fechaInicio, experiencia.fechaFin, personalizacion.idiomaCv),
          y,
          fuenteBase,
        )
        if (experiencia.ubicacion) {
          pdf.setFont(fuenteBase, "italic")
          pdf.setFontSize(9)
          pdf.setTextColor(113, 113, 122)
          textoPlano(experiencia.ubicacion, 3.5)
        }
        if (experiencia.descripcion) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          pdf.setTextColor(63, 63, 70)
          y = escribirTextoRico(pdf, limpiarParaPdf(experiencia.descripcion), y, 3.5, checkPagePura)
        }
        if (experiencia.logros) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          pdf.setTextColor(63, 63, 70)
          y = escribirTextoRico(pdf, limpiarParaPdf(experiencia.logros), y, 3.5, checkPagePura)
        }
        y += 2
      }
    },
    educacion: () => {
      if (datos.educacion.length === 0) return
      seccion(e.educacion)
      for (const educacion of datos.educacion) {
        checkPage(12)
        const titulo = [educacion.titulo || e.titulo, educacion.institucion].filter(Boolean).join(" — ")
        y = escribirTituloConFecha(
          pdf,
          limpiarParaPdf(titulo),
          formatearFechaEducacion(educacion.fechaInicio, educacion.fechaFin, personalizacion.idiomaCv),
          y,
          fuenteBase,
        )
        if (educacion.descripcion) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          pdf.setTextColor(63, 63, 70)
          y = escribirTextoRico(pdf, limpiarParaPdf(educacion.descripcion), y, 3.5, checkPagePura)
        }
        y += 2
      }
    },
    cursos: () => {
      if (datos.cursos.length === 0) return
      seccion(e.cursosCertificaciones)
      for (const curso of datos.cursos) {
        checkPage(9)
        y = escribirTituloConFecha(
          pdf,
          limpiarParaPdf([curso.nombre || e.curso, curso.institucion].filter(Boolean).join(" — ")),
          curso.fecha ? formatearFecha(curso.fecha, personalizacion.idiomaCv) : "",
          y,
          fuenteBase,
        )
        if (curso.url) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          pdf.setTextColor(63, 63, 70)
          textoPlano(curso.url, 3.5)
        }
      }
    },
    proyectos: () => {
      if (datos.proyectos.length === 0) return
      seccion(e.proyectos)
      for (const proyecto of datos.proyectos) {
        checkPage(12)
        y = escribirTituloConFecha(pdf, limpiarParaPdf(proyecto.nombre || e.proyecto), "", y, fuenteBase)
        if (proyecto.tecnologias) {
          pdf.setFont(fuenteBase, "italic")
          pdf.setFontSize(9)
          pdf.setTextColor(113, 113, 122)
          textoPlano(proyecto.tecnologias, 3.5)
        }
        if (proyecto.url) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          pdf.setTextColor(63, 63, 70)
          const lineasUrl = pdf.splitTextToSize(limpiarParaPdf(proyecto.url), CONTENT_WIDTH)
          for (const linea of lineasUrl) {
            checkPage(3.5)
            if (lineasUrl.length === 1) {
              pdf.textWithLink(linea, MARGIN, y, { url: urlAbsoluta(proyecto.url) })
            } else {
              pdf.text(linea, MARGIN, y)
            }
            y += 3.5
          }
        }
        if (proyecto.descripcion) {
          pdf.setFont(fuenteBase, "normal")
          pdf.setFontSize(9)
          pdf.setTextColor(63, 63, 70)
          y = escribirTextoRico(pdf, limpiarParaPdf(proyecto.descripcion), y, 3.5, checkPagePura)
        }
        y += 2
      }
    },
    habilidades: () => {
      if (datos.habilidades.length === 0) return
      seccion(e.competencias)
      pdf.setFont(fuenteBase, "normal")
      pdf.setFontSize(9)
      pdf.setTextColor(63, 63, 70)
      viñetas(datos.habilidades)
      y += 2
    },
    idiomas: () => {
      if (datos.idiomas.length === 0) return
      seccion(e.idiomas)
      pdf.setFont(fuenteBase, "normal")
      pdf.setFontSize(9)
      pdf.setTextColor(63, 63, 70)
      viñetas(datos.idiomas.map((idioma) => `${idioma.nombre || e.idioma} — ${etiquetaNivelIdioma(idioma.nivel, personalizacion.idiomaCv)}`))
      y += 2
    },
    referencias: () => {
      if (datos.referencias.length === 0) return
      seccion(e.referencias)
      for (const referencia of datos.referencias) {
        checkPage(12)
        pdf.setFont(fuenteBase, "bold")
        pdf.setFontSize(9.5)
        pdf.setTextColor(24, 24, 27)
        textoPlano(referencia.nombre || e.nombre, 3.8)
        pdf.setFont(fuenteBase, "normal")
        pdf.setFontSize(9)
        pdf.setTextColor(63, 63, 70)
        textoPlano([referencia.cargo, referencia.empresa, referencia.relacion, referencia.email, referencia.telefono].filter(Boolean).join(" · "), 3.5)
        y += 2
      }
    },
    destacadas: () => {
      for (const destacada of datos.seccionesDestacadas) {
        if (!destacada.titulo.trim() || !destacada.items.some((item) => item.trim())) continue
        seccion(destacada.titulo)
        pdf.setFont(fuenteBase, "normal")
        pdf.setFontSize(9)
        pdf.setTextColor(63, 63, 70)
        viñetas(destacada.items)
        y += 2
      }
    },
  }

  const orden = personalizacion.ordenSecciones ?? ORDEN_SECCIONES_INICIAL
  for (const id of orden) renderers[id]()

  if (datos.disponibilidad || datos.pretensionesRenta) {
    seccion(e.infoAdicional)
    pdf.setFont(fuenteBase, "normal")
    pdf.setFontSize(9)
    pdf.setTextColor(63, 63, 70)
    if (datos.disponibilidad) textoPlano(`${e.disponibilidad}: ${datos.disponibilidad}`)
    if (datos.pretensionesRenta) textoPlano(`${e.pretensionRenta}: ${datos.pretensionesRenta}`)
  }

  const nombre = dp.nombreCompleto.trim().replace(/\s+/g, "_") || "curriculum"
  pdf.setProperties({
    title: `${dp.nombreCompleto || e.tuNombre} - CV`,
    author: dp.nombreCompleto || e.tuNombre,
    subject: dp.titulo ?? "",
    creator: "curriculum-gratis",
  })
  pdf.setLanguage(personalizacion.idiomaCv ?? "es")
  return { pdf, nombreArchivo: `${nombre}_CV.pdf` }
}
