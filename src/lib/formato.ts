export const MESES: Record<string, string> = {
  "01": "Ene",
  "02": "Feb",
  "03": "Mar",
  "04": "Abr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Ago",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dic",
}

export function formatearFecha(fecha: string | null): string {
  if (!fecha) return "Presente"

  const partes = fecha.split("-")
  const anio = partes[0]
  const mes = partes[1]

  if (!anio) return ""
  if (!mes) return anio

  return `${MESES[mes] ?? mes} ${anio}`
}

/** Rango para experiencia laboral: siempre muestra inicio - fin */
export function formatearRangoFechas(
  inicio: string,
  fin: string | null,
): string {
  if (!inicio) return ""
  return `${formatearFecha(inicio)} - ${formatearFecha(fin)}`
}

/** Para educacion/certificaciones: solo muestra rango si hay fecha fin */
export function formatearFechaEducacion(
  inicio: string,
  fin: string | null,
): string {
  if (!inicio) return ""
  if (!fin) return formatearFecha(inicio)
  return `${formatearFecha(inicio)} - ${formatearFecha(fin)}`
}
