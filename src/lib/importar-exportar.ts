import type { DatosCurriculum, Personalizacion } from "@/types"
import { DATOS_INICIALES, PERSONALIZACION_INICIAL } from "@/lib/constantes"

const VERSION_FORMATO = 1

interface ArchivoCurriculum {
  version: number
  datos: DatosCurriculum
  personalizacion: Personalizacion
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

    if (!parsed || typeof parsed !== "object") {
      return { ok: false, error: "El archivo no tiene un formato válido." }
    }

    const raiz = parsed as Record<string, unknown>
    const datosCrudo = raiz.datos as Record<string, unknown> | undefined
    const personalizacionCruda = raiz.personalizacion as
      | Record<string, unknown>
      | undefined

    if (!datosCrudo || typeof datosCrudo !== "object") {
      return { ok: false, error: "Faltan los datos del curriculum." }
    }

    const datosPersonales = datosCrudo.datosPersonales as
      | Record<string, unknown>
      | undefined

    if (!datosPersonales || typeof datosPersonales !== "object") {
      return { ok: false, error: "Faltan los datos personales." }
    }

    /* Merge con defaults para compatibilidad con formatos anteriores
       que puedan faltar campos nuevos (cursos, referencias, enlaces, etc.) */
    const datos: DatosCurriculum = {
      ...DATOS_INICIALES,
      ...(datosCrudo as Partial<DatosCurriculum>),
      datosPersonales: {
        ...DATOS_INICIALES.datosPersonales,
        ...(datosPersonales as Partial<DatosCurriculum["datosPersonales"]>),
      },
    }

    const personalizacion: Personalizacion = {
      ...PERSONALIZACION_INICIAL,
      ...((personalizacionCruda as Partial<Personalizacion>) ?? {}),
    }

    return { ok: true, datos, personalizacion }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido"
    return { ok: false, error: `No se pudo leer el archivo: ${msg}` }
  }
}
