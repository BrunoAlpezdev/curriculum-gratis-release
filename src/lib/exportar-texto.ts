import type { Carta, DatosCurriculum, Personalizacion, SeccionOrdenable } from "@/types"
import { etiquetaNivelIdioma, etiquetasCv, type EtiquetasCv } from "@/lib/etiquetas-cv"
import { formatearFecha, formatearRangoFechas } from "@/lib/formato"
import { sinEntradasVacias } from "@/lib/entradas-vacias"

function tituloSeccion(seccion: SeccionOrdenable, et: EtiquetasCv): string {
  switch (seccion) {
    case "experiencia":
      return et.experienciaLaboral
    case "educacion":
      return et.educacion
    case "cursos":
      return et.cursosCertificaciones
    case "proyectos":
      return et.proyectos
    case "habilidades":
      return et.competencias
    case "idiomas":
      return et.idiomas
    case "referencias":
      return et.referencias
    case "destacadas":
      return "Secciones destacadas"
  }
}

type FormatoTexto = "txt" | "md"
type DocumentoTexto = "cv" | "carta"

function limpiar(partes: Array<string | null | undefined>): string[] {
  return partes.flatMap((parte) => {
    const limpia = parte?.trim()
    return limpia ? [limpia] : []
  })
}

/** Join final que conserva UNA linea en blanco como separador entre secciones e
 *  items: descarta null/undefined, colapsa blancos consecutivos y recorta los
 *  blancos de los extremos. Sustituye al doble `limpiar` que borraba todos los
 *  separadores. */
function unirLineas(lineas: Array<string | null | undefined>): string {
  const salida: string[] = []
  for (const linea of lineas) {
    if (linea == null) continue
    const esBlanco = linea.trim() === ""
    if (esBlanco && (salida.length === 0 || salida.at(-1) === "")) continue
    salida.push(esBlanco ? "" : linea)
  }
  while (salida.at(-1) === "") salida.pop()
  return salida.join("\n") + "\n"
}

function nombreArchivoBase(datos: DatosCurriculum, documento: DocumentoTexto): string {
  const nombre = datos.datosPersonales.nombreCompleto.trim().replace(/\s+/g, "_")
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
  const et = etiquetasCv(personalizacion.idiomaCv)
  switch (seccion) {
    case "experiencia":
      return bloqueTxt(tituloSeccion(seccion, et), datos.experiencia.flatMap((exp) => [
        ...limpiar([
          `${exp.cargo}${exp.empresa ? ` - ${exp.empresa}` : ""}`,
          limpiar([exp.ubicacion, formatearRangoFechas(exp.fechaInicio, exp.fechaFin, personalizacion.idiomaCv)]).join(" | "),
          exp.descripcion,
          exp.logros,
        ]),
        "",
      ]))
    case "educacion":
      return bloqueTxt(tituloSeccion(seccion, et), datos.educacion.flatMap((edu) => [
        ...limpiar([
          `${edu.titulo}${edu.institucion ? ` - ${edu.institucion}` : ""}`,
          formatearRangoFechas(edu.fechaInicio, edu.fechaFin, personalizacion.idiomaCv),
          edu.descripcion,
        ]),
        "",
      ]))
    case "cursos":
      return bloqueTxt(tituloSeccion(seccion, et), datos.cursos.map((curso) => limpiar([
        curso.nombre,
        curso.institucion,
        curso.fecha ? formatearFecha(curso.fecha, personalizacion.idiomaCv) : "",
        curso.url,
      ]).join(" | ")))
    case "proyectos":
      return bloqueTxt(tituloSeccion(seccion, et), datos.proyectos.flatMap((proyecto) => [
        ...limpiar([
          proyecto.nombre,
          proyecto.descripcion,
          proyecto.tecnologias ? `${et.tecnologias}: ${proyecto.tecnologias}` : "",
          proyecto.url,
        ]),
        "",
      ]))
    case "habilidades":
      return bloqueTxt(tituloSeccion(seccion, et), datos.habilidades)
    case "idiomas":
      return bloqueTxt(tituloSeccion(seccion, et), datos.idiomas.map((idioma) => `${idioma.nombre} - ${etiquetaNivelIdioma(idioma.nivel, personalizacion.idiomaCv)}`))
    case "referencias":
      return bloqueTxt(tituloSeccion(seccion, et), datos.referencias.map((ref) => limpiar([
        ref.nombre,
        ref.cargo,
        ref.empresa,
        ref.relacion,
        ref.email,
        ref.telefono,
      ]).join(" | ")))
    case "destacadas":
      return datos.seccionesDestacadas.flatMap((destacada) =>
        bloqueTxt(destacada.titulo, limpiar(destacada.items)),
      )
  }
}

function seccionMd(seccion: SeccionOrdenable, datos: DatosCurriculum, personalizacion: Personalizacion): string[] {
  const et = etiquetasCv(personalizacion.idiomaCv)
  switch (seccion) {
    case "experiencia":
      return bloqueMd(tituloSeccion(seccion, et), datos.experiencia.flatMap((exp) => [
        ...limpiar([
          exp.cargo || exp.empresa ? `### ${exp.cargo || exp.empresa}` : "",
          limpiar([exp.empresa, exp.ubicacion, formatearRangoFechas(exp.fechaInicio, exp.fechaFin, personalizacion.idiomaCv)]).join(" | "),
          exp.descripcion,
          exp.logros,
        ]),
        "",
      ]))
    case "educacion":
      return bloqueMd(tituloSeccion(seccion, et), datos.educacion.flatMap((edu) => [
        ...limpiar([
          edu.titulo || edu.institucion ? `### ${edu.titulo || edu.institucion}` : "",
          limpiar([edu.institucion, formatearRangoFechas(edu.fechaInicio, edu.fechaFin, personalizacion.idiomaCv)]).join(" | "),
          edu.descripcion,
        ]),
        "",
      ]))
    case "cursos":
      return bloqueMd(tituloSeccion(seccion, et), datos.cursos.map((curso) => `- ${limpiar([
        curso.nombre,
        curso.institucion,
        curso.fecha ? formatearFecha(curso.fecha, personalizacion.idiomaCv) : "",
        curso.url,
      ]).join(" | ")}`))
    case "proyectos":
      return bloqueMd(tituloSeccion(seccion, et), datos.proyectos.flatMap((proyecto) => [
        ...limpiar([
          `### ${proyecto.nombre}`,
          proyecto.descripcion,
          proyecto.tecnologias ? `${et.tecnologias}: ${proyecto.tecnologias}` : "",
          proyecto.url,
        ]),
        "",
      ]))
    case "habilidades":
      return bloqueMd(tituloSeccion(seccion, et), datos.habilidades.map((habilidad) => `- ${habilidad}`))
    case "idiomas":
      return bloqueMd(tituloSeccion(seccion, et), datos.idiomas.map((idioma) => `- ${idioma.nombre}: ${etiquetaNivelIdioma(idioma.nivel, personalizacion.idiomaCv)}`))
    case "referencias":
      return bloqueMd(tituloSeccion(seccion, et), datos.referencias.map((ref) => `- ${limpiar([
        ref.nombre,
        ref.cargo,
        ref.empresa,
        ref.relacion,
        ref.email,
        ref.telefono,
      ]).join(" | ")}`))
    case "destacadas":
      return datos.seccionesDestacadas.flatMap((destacada) =>
        bloqueMd(destacada.titulo, destacada.items.filter((item) => item.trim()).map((item) => `- ${item}`)),
      )
  }
}

function cvTxt(datos: DatosCurriculum, personalizacion: Personalizacion): string {
  const et = etiquetasCv(personalizacion.idiomaCv)
  const dp = datos.datosPersonales
  return unirLineas([
    ...limpiar([
      dp.nombreCompleto || "Curriculum Vitae",
      dp.titulo,
      limpiar([dp.email, dp.telefono, dp.rut ? `RUT ${dp.rut}` : "", dp.ubicacion]).join(" | "),
      dp.linkedin,
      dp.github,
      dp.sitioWeb,
    ]),
    "",
    ...bloqueTxt(et.perfilProfesional, limpiar([datos.perfil])),
    ...personalizacion.ordenSecciones.flatMap((seccion) => seccionTxt(seccion, datos, personalizacion)),
    ...bloqueTxt(et.infoAdicional, limpiar([datos.disponibilidad, datos.pretensionesRenta])),
  ])
}

function cvMd(datos: DatosCurriculum, personalizacion: Personalizacion): string {
  const et = etiquetasCv(personalizacion.idiomaCv)
  const dp = datos.datosPersonales
  return unirLineas([
    `# ${dp.nombreCompleto || "Curriculum Vitae"}`,
    ...limpiar([
      dp.titulo,
      limpiar([dp.email, dp.telefono, dp.rut ? `RUT ${dp.rut}` : "", dp.ubicacion]).join(" | "),
      dp.linkedin,
      dp.github,
      dp.sitioWeb,
    ]),
    "",
    ...bloqueMd(et.perfilProfesional, limpiar([datos.perfil])),
    ...personalizacion.ordenSecciones.flatMap((seccion) => seccionMd(seccion, datos, personalizacion)),
    ...bloqueMd(et.infoAdicional, limpiar([datos.disponibilidad, datos.pretensionesRenta])),
  ])
}

function cartaTxt(datos: DatosCurriculum, carta: Carta): string {
  return unirLineas([
    ...limpiar([carta.ciudadFecha]),
    "",
    ...limpiar([
      carta.destinatario,
      limpiar([carta.cargoPostulado, carta.empresaDestino]).join(" | "),
    ]),
    "",
    ...limpiar([carta.cuerpo]),
    "",
    ...limpiar([carta.despedida, datos.datosPersonales.nombreCompleto]),
  ])
}

function cartaMd(datos: DatosCurriculum, carta: Carta, personalizacion: Personalizacion): string {
  const et = etiquetasCv(personalizacion.idiomaCv)
  return unirLineas([
    `# ${et.cartaPresentacion}${carta.cargoPostulado ? ` - ${carta.cargoPostulado}` : ""}`,
    ...limpiar([
      carta.ciudadFecha,
      carta.destinatario ? `**${et.destinatario}:** ${carta.destinatario}` : "",
      carta.empresaDestino ? `**${et.empresa}:** ${carta.empresaDestino}` : "",
    ]),
    "",
    ...limpiar([carta.cuerpo]),
    "",
    ...limpiar([carta.despedida, datos.datosPersonales.nombreCompleto]),
  ])
}

export function exportarTexto(
  documento: DocumentoTexto,
  formato: FormatoTexto,
  datos: DatosCurriculum,
  personalizacion: Personalizacion,
  carta: Carta,
) {
  const datosCv = sinEntradasVacias(datos)
  const contenido = documento === "carta"
    ? (formato === "md" ? cartaMd(datos, carta, personalizacion) : cartaTxt(datos, carta))
    : (formato === "md" ? cvMd(datosCv, personalizacion) : cvTxt(datosCv, personalizacion))

  descargarArchivo(
    `${nombreArchivoBase(datos, documento)}.${formato}`,
    contenido,
    formato === "md" ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8",
  )
}
