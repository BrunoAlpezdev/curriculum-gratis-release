import type {
  ColorTema,
  Curso,
  DatosCurriculum,
  Educacion,
  Experiencia,
  FuenteId,
  Idioma,
  IdiomaCv,
  NivelIdioma,
  Personalizacion,
  PlantillaId,
  Proyecto,
  Referencia,
  SeccionOrdenable,
} from "@/types"
import { DATOS_INICIALES, ORDEN_SECCIONES_INICIAL, PERSONALIZACION_INICIAL } from "@/lib/constantes"

const VERSION_FORMATO = 1

interface ArchivoCurriculum {
  version: number
  datos: DatosCurriculum
  personalizacion: Personalizacion
}

const COLORES_VALIDOS = new Set<ColorTema>(["azul", "verde", "rojo", "morado", "teal", "naranja", "gris"])
const PLANTILLAS_VALIDAS = new Set<PlantillaId>(["clasico", "moderno", "colorido", "minimalista"])
const FUENTES_VALIDAS = new Set<FuenteId>(["inter", "roboto", "lato", "merriweather", "libre-baskerville"])
const IDIOMAS_CV_VALIDOS = new Set<IdiomaCv>(["es", "en"])
const NIVELES_IDIOMA_VALIDOS = new Set<NivelIdioma>(["basico", "intermedio", "avanzado", "nativo"])
const SECCIONES_VALIDAS = new Set<SeccionOrdenable>(ORDEN_SECCIONES_INICIAL)

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return !!valor && typeof valor === "object" && !Array.isArray(valor)
}

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor : ""
}

function textoNullable(valor: unknown): string | null {
  return typeof valor === "string" ? valor : null
}

function lista(valor: unknown): Record<string, unknown>[] {
  return Array.isArray(valor) ? valor.filter(esRegistro) : []
}

function id(valor: unknown): string {
  if (typeof valor === "string" && valor.trim()) return valor
  return globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function opcion<T extends string>(valor: unknown, validos: Set<T>, fallback: T): T {
  return typeof valor === "string" && validos.has(valor as T) ? (valor as T) : fallback
}

function normalizarExperiencia(item: Record<string, unknown>): Experiencia {
  return {
    id: id(item.id),
    empresa: texto(item.empresa),
    cargo: texto(item.cargo),
    ubicacion: texto(item.ubicacion),
    fechaInicio: texto(item.fechaInicio),
    fechaFin: textoNullable(item.fechaFin),
    descripcion: texto(item.descripcion),
    logros: texto(item.logros),
  }
}

function normalizarEducacion(item: Record<string, unknown>): Educacion {
  return {
    id: id(item.id),
    institucion: texto(item.institucion),
    titulo: texto(item.titulo),
    fechaInicio: texto(item.fechaInicio),
    fechaFin: textoNullable(item.fechaFin),
    descripcion: texto(item.descripcion),
  }
}

function normalizarCurso(item: Record<string, unknown>): Curso {
  return {
    id: id(item.id),
    nombre: texto(item.nombre),
    institucion: texto(item.institucion),
    fecha: texto(item.fecha),
    url: texto(item.url),
  }
}

function normalizarProyecto(item: Record<string, unknown>): Proyecto {
  return {
    id: id(item.id),
    nombre: texto(item.nombre),
    descripcion: texto(item.descripcion),
    url: texto(item.url),
    tecnologias: texto(item.tecnologias),
  }
}

function normalizarIdioma(item: Record<string, unknown>): Idioma {
  return {
    id: id(item.id),
    nombre: texto(item.nombre),
    nivel: opcion(item.nivel, NIVELES_IDIOMA_VALIDOS, "basico"),
  }
}

function normalizarReferencia(item: Record<string, unknown>): Referencia {
  return {
    id: id(item.id),
    nombre: texto(item.nombre),
    cargo: texto(item.cargo),
    empresa: texto(item.empresa),
    email: texto(item.email),
    telefono: texto(item.telefono),
    relacion: texto(item.relacion),
  }
}

export function normalizarDatosCurriculum(valor: unknown): DatosCurriculum {
  const datosCrudo = esRegistro(valor) ? valor : {}
  const datosPersonales = esRegistro(datosCrudo.datosPersonales) ? datosCrudo.datosPersonales : {}

  return {
    ...DATOS_INICIALES,
    datosPersonales: {
      ...DATOS_INICIALES.datosPersonales,
      nombreCompleto: texto(datosPersonales.nombreCompleto),
      titulo: texto(datosPersonales.titulo),
      email: texto(datosPersonales.email),
      telefono: texto(datosPersonales.telefono),
      ubicacion: texto(datosPersonales.ubicacion),
      linkedin: texto(datosPersonales.linkedin),
      github: texto(datosPersonales.github),
      sitioWeb: texto(datosPersonales.sitioWeb),
      foto: texto(datosPersonales.foto),
    },
    perfil: texto(datosCrudo.perfil),
    experiencia: lista(datosCrudo.experiencia).map(normalizarExperiencia),
    educacion: lista(datosCrudo.educacion).map(normalizarEducacion),
    cursos: lista(datosCrudo.cursos).map(normalizarCurso),
    proyectos: lista(datosCrudo.proyectos).map(normalizarProyecto),
    habilidades: Array.isArray(datosCrudo.habilidades)
      ? datosCrudo.habilidades.filter((h): h is string => typeof h === "string")
      : [],
    idiomas: lista(datosCrudo.idiomas).map(normalizarIdioma),
    referencias: lista(datosCrudo.referencias).map(normalizarReferencia),
    disponibilidad: texto(datosCrudo.disponibilidad),
    pretensionesRenta: texto(datosCrudo.pretensionesRenta),
  }
}

export function normalizarPersonalizacion(valor: unknown): Personalizacion {
  const crudo = esRegistro(valor) ? valor : {}
  const secciones = Array.isArray(crudo.ordenSecciones)
    ? crudo.ordenSecciones.filter((s): s is SeccionOrdenable => typeof s === "string" && SECCIONES_VALIDAS.has(s as SeccionOrdenable))
    : ORDEN_SECCIONES_INICIAL
  const ordenCompleto = [...secciones, ...ORDEN_SECCIONES_INICIAL.filter((s) => !secciones.includes(s))]

  return {
    color: opcion(crudo.color, COLORES_VALIDOS, PERSONALIZACION_INICIAL.color),
    plantilla: opcion(crudo.plantilla, PLANTILLAS_VALIDAS, PERSONALIZACION_INICIAL.plantilla),
    fuente: opcion(crudo.fuente, FUENTES_VALIDAS, PERSONALIZACION_INICIAL.fuente),
    idiomaCv: opcion(crudo.idiomaCv, IDIOMAS_CV_VALIDOS, PERSONALIZACION_INICIAL.idiomaCv),
    ordenSecciones: ordenCompleto,
  }
}

export function exportarJson(
  datos: DatosCurriculum,
  personalizacion: Personalizacion,
) {
  const payload: ArchivoCurriculum = {
    version: VERSION_FORMATO,
    datos,
    personalizacion,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  const nombreBase =
    datos.datosPersonales.nombreCompleto.trim().replace(/\s+/g, "_") ||
    "curriculum"
  const enlace = document.createElement("a")
  enlace.href = url
  enlace.download = `${nombreBase}_curriculum.json`
  document.body.appendChild(enlace)
  enlace.click()
  document.body.removeChild(enlace)
  URL.revokeObjectURL(url)
}

export type ResultadoImport =
  | { ok: true; datos: DatosCurriculum; personalizacion: Personalizacion }
  | { ok: false; error: string }

export async function importarJson(archivo: File): Promise<ResultadoImport> {
  try {
    const texto = await archivo.text()
    const parsed = JSON.parse(texto) as unknown

    if (!esRegistro(parsed)) {
      return { ok: false, error: "El archivo no tiene un formato válido." }
    }

    const raiz = parsed

    if (!esRegistro(raiz.datos)) {
      return { ok: false, error: "Faltan los datos del curriculum." }
    }

    if (!esRegistro(raiz.datos.datosPersonales)) {
      return { ok: false, error: "Faltan los datos personales." }
    }

    const datos = normalizarDatosCurriculum(raiz.datos)
    const personalizacion = normalizarPersonalizacion(raiz.personalizacion)

    return { ok: true, datos, personalizacion }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido"
    return { ok: false, error: `No se pudo leer el archivo: ${msg}` }
  }
}
