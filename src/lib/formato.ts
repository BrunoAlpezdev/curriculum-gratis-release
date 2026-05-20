import type { IdiomaCv } from "@/types"

type MesFecha = {
  valor: string
  etiquetas: Record<IdiomaCv, string>
}

export const MESES_ORDENADOS: MesFecha[] = [
  { valor: "01", etiquetas: { es: "Ene", en: "Jan" } },
  { valor: "02", etiquetas: { es: "Feb", en: "Feb" } },
  { valor: "03", etiquetas: { es: "Mar", en: "Mar" } },
  { valor: "04", etiquetas: { es: "Abr", en: "Apr" } },
  { valor: "05", etiquetas: { es: "May", en: "May" } },
  { valor: "06", etiquetas: { es: "Jun", en: "Jun" } },
  { valor: "07", etiquetas: { es: "Jul", en: "Jul" } },
  { valor: "08", etiquetas: { es: "Ago", en: "Aug" } },
  { valor: "09", etiquetas: { es: "Sep", en: "Sep" } },
  { valor: "10", etiquetas: { es: "Oct", en: "Oct" } },
  { valor: "11", etiquetas: { es: "Nov", en: "Nov" } },
  { valor: "12", etiquetas: { es: "Dic", en: "Dec" } },
]

export const MESES: Record<string, string> = Object.fromEntries(
  MESES_ORDENADOS.map((mes) => [mes.valor, mes.etiquetas.es]),
)

export function mesesFecha(idioma: IdiomaCv | undefined): { valor: string; etiqueta: string }[] {
  const idiomaSeguro = idioma ?? "es"
  return MESES_ORDENADOS.map((mes) => ({
    valor: mes.valor,
    etiqueta: mes.etiquetas[idiomaSeguro],
  }))
}

export function etiquetaPresente(idioma: IdiomaCv | undefined): string {
  return idioma === "en" ? "Present" : "Presente"
}

export function etiquetaSoloAnio(idioma: IdiomaCv | undefined): string {
  return idioma === "en" ? "Year only" : "Solo"
}

export function nombreMes(mes: string, idioma: IdiomaCv | undefined): string {
  const encontrado = MESES_ORDENADOS.find((item) => item.valor === mes)
  return encontrado?.etiquetas[idioma ?? "es"] ?? mes
}

export function formatearFecha(fecha: string | null, idioma?: IdiomaCv): string {
  if (!fecha) return etiquetaPresente(idioma)

  const partes = fecha.split("-")
  const anio = partes[0]
  const mes = partes[1]

  if (!anio) return ""
  if (!mes) return anio

  return `${nombreMes(mes, idioma)} ${anio}`
}

/** Rango para experiencia laboral: siempre muestra inicio - fin */
export function formatearRangoFechas(
  inicio: string,
  fin: string | null,
  idioma?: IdiomaCv,
): string {
  if (!inicio) return ""
  return `${formatearFecha(inicio, idioma)} - ${formatearFecha(fin, idioma)}`
}

/** Para educacion/certificaciones: solo muestra rango si hay fecha fin */
export function formatearFechaEducacion(
  inicio: string,
  fin: string | null,
  idioma?: IdiomaCv,
): string {
  if (!inicio) return ""
  if (!fin) return formatearFecha(inicio, idioma)
  return `${formatearFecha(inicio, idioma)} - ${formatearFecha(fin, idioma)}`
}
