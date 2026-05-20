import type { Carta, DatosCurriculum, Personalizacion, SeccionOrdenable } from "@/types"
import { ETIQUETAS_SECCION_ORDENABLE } from "@/lib/constantes"
import { etiquetaNivelIdioma } from "@/lib/etiquetas-cv"
import { formatearFecha, formatearRangoFechas } from "@/lib/formato"

type FormatoTexto = "txt" | "md"
type DocumentoTexto = "cv" | "carta"

function limpiar(partes: Array<string | null | undefined>): string[] {
  return partes.flatMap((parte) => {
    const limpia = parte?.trim()
    return limpia ? [limpia] : []
  })
}

function nombreArchivoBase(datos: DatosCurriculum, documento: DocumentoTexto): string {
  const nombre = datos.datosPersonales.nombreCompleto.trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "_")
  const base = nombre || (documento === "carta" ? "carta_presentacion" : "curriculum")
  return documento === "carta" ? `${base}_carta` : `${base}_curriculum`
}

function descargarArchivo(nombre: string, contenido: string, tipo: string) {
  const blob = new Blob([contenido], { type: tipo })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement("a")
  enlace.href = url
  enlace.download = nombre
  document.body.appendChild(enlace)
  enlace.click()
  document.body.removeChild(enlace)
  URL.revokeObjectURL(url)
}

function bloqueTxt(titulo: string, lineas: string[]): string[] {
  if (lineas.length === 0) return []
  return [titulo.toUpperCase(), ...lineas, ""]
}

function bloqueMd(titulo: string, lineas: string[]): string[] {
  if (lineas.length === 0) return []
  return [`## ${titulo}`, ...lineas, ""]
}

function seccionTxt(seccion: SeccionOrdenable, datos: DatosCurriculum, personalizacion: Personalizacion): string[] {
  switch (seccion) {
    case "experiencia":
      return bloqueTxt(ETIQUETAS_SECCION_ORDENABLE.experiencia, datos.experiencia.flatMap((exp) => limpiar([
        `${exp.cargo}${exp.empresa ? ` - ${exp.empresa}` : ""}`,
        limpiar([exp.ubicacion, formatearRangoFechas(exp.fechaInicio, exp.fechaFin, personalizacion.idiomaCv)]).join(" | "),
        exp.descripcion,
        exp.logros,
        "",
      ])))
    case "educacion":
      return bloqueTxt(ETIQUETAS_SECCION_ORDENABLE.educacion, datos.educacion.flatMap((edu) => limpiar([
        `${edu.titulo}${edu.institucion ? ` - ${edu.institucion}` : ""}`,
        formatearRangoFechas(edu.fechaInicio, edu.fechaFin, personalizacion.idiomaCv),
        edu.descripcion,
        "",
      ])))
    case "cursos":
      return bloqueTxt(ETIQUETAS_SECCION_ORDENABLE.cursos, datos.cursos.map((curso) => limpiar([
        curso.nombre,
        curso.institucion,
        curso.fecha ? formatearFecha(curso.fecha, personalizacion.idiomaCv) : "",
        curso.url,
      ]).join(" | ")))
    case "proyectos":
      return bloqueTxt(ETIQUETAS_SECCION_ORDENABLE.proyectos, datos.proyectos.flatMap((proyecto) => limpiar([
        proyecto.nombre,
        proyecto.descripcion,
        proyecto.tecnologias ? `Tecnologias: ${proyecto.tecnologias}` : "",
        proyecto.url,
        "",
      ])))
    case "habilidades":
      return bloqueTxt(ETIQUETAS_SECCION_ORDENABLE.habilidades, datos.habilidades)
    case "idiomas":
      return bloqueTxt(ETIQUETAS_SECCION_ORDENABLE.idiomas, datos.idiomas.map((idioma) => `${idioma.nombre} - ${etiquetaNivelIdioma(idioma.nivel, personalizacion.idiomaCv)}`))
    case "referencias":
      return bloqueTxt(ETIQUETAS_SECCION_ORDENABLE.referencias, datos.referencias.map((ref) => limpiar([
        ref.nombre,
        ref.cargo,
        ref.empresa,
        ref.relacion,
        ref.email,
        ref.telefono,
      ]).join(" | ")))
  }
}

function seccionMd(seccion: SeccionOrdenable, datos: DatosCurriculum, personalizacion: Personalizacion): string[] {
  switch (seccion) {
    case "experiencia":
      return bloqueMd(ETIQUETAS_SECCION_ORDENABLE.experiencia, datos.experiencia.flatMap((exp) => limpiar([
        `### ${exp.cargo || exp.empresa}`,
        limpiar([exp.empresa, exp.ubicacion, formatearRangoFechas(exp.fechaInicio, exp.fechaFin, personalizacion.idiomaCv)]).join(" | "),
        exp.descripcion,
        exp.logros,
        "",
      ])))
    case "educacion":
      return bloqueMd(ETIQUETAS_SECCION_ORDENABLE.educacion, datos.educacion.flatMap((edu) => limpiar([
        `### ${edu.titulo || edu.institucion}`,
        limpiar([edu.institucion, formatearRangoFechas(edu.fechaInicio, edu.fechaFin, personalizacion.idiomaCv)]).join(" | "),
        edu.descripcion,
        "",
      ])))
    case "cursos":
      return bloqueMd(ETIQUETAS_SECCION_ORDENABLE.cursos, datos.cursos.map((curso) => `- ${limpiar([
        curso.nombre,
        curso.institucion,
        curso.fecha ? formatearFecha(curso.fecha, personalizacion.idiomaCv) : "",
        curso.url,
      ]).join(" | ")}`))
    case "proyectos":
      return bloqueMd(ETIQUETAS_SECCION_ORDENABLE.proyectos, datos.proyectos.flatMap((proyecto) => limpiar([
        `### ${proyecto.nombre}`,
        proyecto.descripcion,
        proyecto.tecnologias ? `Tecnologias: ${proyecto.tecnologias}` : "",
        proyecto.url,
        "",
      ])))
    case "habilidades":
      return bloqueMd(ETIQUETAS_SECCION_ORDENABLE.habilidades, datos.habilidades.map((habilidad) => `- ${habilidad}`))
    case "idiomas":
      return bloqueMd(ETIQUETAS_SECCION_ORDENABLE.idiomas, datos.idiomas.map((idioma) => `- ${idioma.nombre}: ${etiquetaNivelIdioma(idioma.nivel, personalizacion.idiomaCv)}`))
    case "referencias":
      return bloqueMd(ETIQUETAS_SECCION_ORDENABLE.referencias, datos.referencias.map((ref) => `- ${limpiar([
        ref.nombre,
        ref.cargo,
        ref.empresa,
        ref.relacion,
        ref.email,
        ref.telefono,
      ]).join(" | ")}`))
  }
}

function cvTxt(datos: DatosCurriculum, personalizacion: Personalizacion): string {
  const dp = datos.datosPersonales
  const lineas = [
    dp.nombreCompleto || "Curriculum Vitae",
    dp.titulo,
    limpiar([dp.email, dp.telefono, dp.ubicacion]).join(" | "),
    dp.linkedin,
    dp.github,
    dp.sitioWeb,
    "",
    ...bloqueTxt("Perfil profesional", limpiar([datos.perfil])),
    ...personalizacion.ordenSecciones.flatMap((seccion) => seccionTxt(seccion, datos, personalizacion)),
    ...bloqueTxt("Informacion adicional", limpiar([datos.disponibilidad, datos.pretensionesRenta])),
  ]
  return limpiar(lineas).join("\n") + "\n"
}

function cvMd(datos: DatosCurriculum, personalizacion: Personalizacion): string {
  const dp = datos.datosPersonales
  const lineas = [
    `# ${dp.nombreCompleto || "Curriculum Vitae"}`,
    dp.titulo,
    limpiar([dp.email, dp.telefono, dp.ubicacion]).join(" | "),
    dp.linkedin,
    dp.github,
    dp.sitioWeb,
    "",
    ...bloqueMd("Perfil profesional", limpiar([datos.perfil])),
    ...personalizacion.ordenSecciones.flatMap((seccion) => seccionMd(seccion, datos, personalizacion)),
    ...bloqueMd("Informacion adicional", limpiar([datos.disponibilidad, datos.pretensionesRenta])),
  ]
  return limpiar(lineas).join("\n") + "\n"
}

function cartaTxt(datos: DatosCurriculum, carta: Carta): string {
  return limpiar([
    carta.ciudadFecha,
    "",
    carta.destinatario,
    limpiar([carta.cargoPostulado, carta.empresaDestino]).join(" | "),
    "",
    carta.cuerpo,
    "",
    carta.despedida,
    datos.datosPersonales.nombreCompleto,
  ]).join("\n") + "\n"
}

function cartaMd(datos: DatosCurriculum, carta: Carta): string {
  return limpiar([
    `# Carta de presentacion${carta.cargoPostulado ? ` - ${carta.cargoPostulado}` : ""}`,
    carta.ciudadFecha,
    carta.destinatario ? `**Destinatario:** ${carta.destinatario}` : "",
    carta.empresaDestino ? `**Empresa:** ${carta.empresaDestino}` : "",
    "",
    carta.cuerpo,
    "",
    carta.despedida,
    datos.datosPersonales.nombreCompleto,
  ]).join("\n") + "\n"
}

export function exportarTexto(
  documento: DocumentoTexto,
  formato: FormatoTexto,
  datos: DatosCurriculum,
  personalizacion: Personalizacion,
  carta: Carta,
) {
  const contenido = documento === "carta"
    ? (formato === "md" ? cartaMd(datos, carta) : cartaTxt(datos, carta))
    : (formato === "md" ? cvMd(datos, personalizacion) : cvTxt(datos, personalizacion))

  descargarArchivo(
    `${nombreArchivoBase(datos, documento)}.${formato}`,
    contenido,
    formato === "md" ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8",
  )
}
