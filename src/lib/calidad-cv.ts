import type { DatosCurriculum } from "@/types"

export type NivelRevision = "ok" | "advertencia" | "error"

export interface RevisionCalidad {
  id: string
  nivel: NivelRevision
  titulo: string
  descripcion: string
}

export interface ResultadoCalidadCv {
  puntaje: number
  completadas: number
  total: number
  revisiones: RevisionCalidad[]
}

function limpio(valor: string | null | undefined): string {
  return (valor ?? "").trim()
}

function contarPalabras(texto: string): number {
  return limpio(texto).split(/\s+/).filter(Boolean).length
}

function tieneNumero(texto: string): boolean {
  return /\d/.test(texto)
}

function valorFecha(fecha: string | null): number | null {
  if (!fecha) return null
  const [anio, mes = "01"] = fecha.split("-")
  const anioNumero = Number(anio)
  const mesNumero = Number(mes)
  if (!Number.isFinite(anioNumero) || !Number.isFinite(mesNumero)) return null
  return anioNumero * 12 + mesNumero
}

function fechaInvertida(inicio: string, fin: string | null): boolean {
  const valorInicio = valorFecha(inicio)
  const valorFin = valorFecha(fin)
  return valorInicio !== null && valorFin !== null && valorInicio > valorFin
}

function crearRevision(
  condicionOk: boolean,
  revision: Omit<RevisionCalidad, "nivel">,
  nivelFallo: Exclude<NivelRevision, "ok"> = "advertencia",
): RevisionCalidad {
  return {
    ...revision,
    nivel: condicionOk ? "ok" : nivelFallo,
  }
}

export function analizarCalidadCv(datos: DatosCurriculum): ResultadoCalidadCv {
  const dp = datos.datosPersonales
  const perfilPalabras = contarPalabras(datos.perfil)
  const experienciasCompletas = datos.experiencia.filter((exp) =>
    limpio(exp.empresa) &&
    limpio(exp.cargo) &&
    limpio(exp.fechaInicio) &&
    (limpio(exp.descripcion) || limpio(exp.logros)),
  ).length
  const experienciasConLogros = datos.experiencia.filter((exp) =>
    limpio(exp.logros) && tieneNumero(exp.logros),
  ).length
  const fechasInvalidas = [
    ...datos.experiencia.map((exp) => fechaInvertida(exp.fechaInicio, exp.fechaFin)),
    ...datos.educacion.map((edu) => fechaInvertida(edu.fechaInicio, edu.fechaFin)),
  ].some(Boolean)
  const tieneTrayectoria = datos.experiencia.length > 0 || datos.proyectos.length > 0

  const revisiones: RevisionCalidad[] = [
    crearRevision(
      !!limpio(dp.nombreCompleto) && !!limpio(dp.titulo),
      {
        id: "identidad",
        titulo: "Nombre y titulo profesional",
        descripcion: "Agrega tu nombre completo y un titulo claro del cargo o perfil al que postulas.",
      },
      "error",
    ),
    crearRevision(
      !!limpio(dp.email) || !!limpio(dp.telefono),
      {
        id: "contacto",
        titulo: "Contacto disponible",
        descripcion: "Incluye al menos email o telefono para que puedan contactarte.",
      },
      "error",
    ),
    crearRevision(
      perfilPalabras >= 20 && perfilPalabras <= 80,
      {
        id: "perfil",
        titulo: "Perfil profesional breve",
        descripcion: "El perfil funciona mejor entre 20 y 80 palabras, enfocado en experiencia, foco profesional y valor.",
      },
    ),
    crearRevision(
      tieneTrayectoria,
      {
        id: "trayectoria",
        titulo: "Experiencia o proyectos",
        descripcion: "Agrega experiencia laboral o proyectos relevantes para demostrar trayectoria aplicada.",
      },
      "error",
    ),
    crearRevision(
      datos.experiencia.length === 0 || experienciasCompletas === datos.experiencia.length,
      {
        id: "experiencia-completa",
        titulo: "Experiencias completas",
        descripcion: "Cada experiencia deberia tener empresa, cargo, fecha de inicio y descripcion o logros.",
      },
    ),
    crearRevision(
      datos.experiencia.length === 0 || experienciasConLogros > 0,
      {
        id: "logros-medibles",
        titulo: "Logros medibles",
        descripcion: "Incluye al menos un logro con numeros: porcentajes, volumen, tiempos, ahorro o impacto.",
      },
    ),
    crearRevision(
      !fechasInvalidas,
      {
        id: "fechas",
        titulo: "Fechas coherentes",
        descripcion: "Revisa que las fechas de inicio no sean posteriores a las fechas de termino.",
      },
      "error",
    ),
    crearRevision(
      datos.habilidades.length >= 4 && datos.habilidades.length <= 12,
      {
        id: "habilidades",
        titulo: "Competencias enfocadas",
        descripcion: "Usa entre 4 y 12 habilidades relevantes. Demasiadas habilidades diluyen el foco del CV.",
      },
    ),
    crearRevision(
      datos.educacion.length > 0 || datos.cursos.length > 0,
      {
        id: "formacion",
        titulo: "Formacion visible",
        descripcion: "Agrega educacion formal o cursos/certificaciones relevantes para respaldar tu perfil.",
      },
    ),
    crearRevision(
      !!limpio(dp.linkedin) || !!limpio(dp.github) || !!limpio(dp.sitioWeb),
      {
        id: "enlaces",
        titulo: "Enlaces profesionales",
        descripcion: "LinkedIn, GitHub o portafolio ayudan a validar tu experiencia, especialmente en cargos tecnicos o creativos.",
      },
    ),
  ]

  const completadas = revisiones.filter((revision) => revision.nivel === "ok").length
  const puntaje = Math.round((completadas / revisiones.length) * 100)

  return {
    puntaje,
    completadas,
    total: revisiones.length,
    revisiones,
  }
}
