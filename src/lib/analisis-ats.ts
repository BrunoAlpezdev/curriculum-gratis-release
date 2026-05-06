import type { DatosCurriculum } from "@/types"

const STOPWORDS = new Set([
  // Español
  "para", "con", "por", "sin", "que", "como", "los", "las", "del", "una",
  "uno", "sus", "son", "ser", "sera", "era", "muy", "mas", "este", "esta",
  "estos", "estas", "ese", "esa", "esos", "esas", "qué", "cual", "donde",
  "cuando", "entre", "sobre", "hacia", "hasta", "desde", "tras", "tambien",
  "solo", "pero", "aunque", "mientras", "ademas", "todo", "todos", "toda",
  "todas", "cada", "quien", "cuyo", "cuya", "año", "años", "mes", "meses",
  "dia", "dias", "actualmente", "actual", "actualidad", "empresa", "puesto",
  "cargo", "nivel", "tipo", "uso", "usos", "base", "bases",
  // Inglés
  "the", "and", "with", "for", "from", "this", "that", "these", "those",
  "into", "your", "our", "their", "they", "you", "we", "are", "were",
  "been", "have", "has", "had", "will", "would", "could", "should", "can",
  "may", "might", "must", "some", "any", "all", "most", "more", "than",
  "per", "via", "who", "what", "when", "where", "why", "how", "also",
  "about", "within", "across", "each", "other", "using", "role", "team",
  "work", "working", "job", "position", "candidate", "company", "company's",
  "year", "years", "month", "months", "day", "days",
])

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s+#.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function tokenizar(texto: string): string[] {
  return normalizar(texto)
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t) && !/^\d+$/.test(t))
}

export interface PalabraClave {
  palabra: string
  frecuencia: number
  enCv: boolean
}

export interface ResultadoAnalisis {
  totalClaves: number
  encontradas: number
  palabras: PalabraClave[]
}

export function textoCv(datos: DatosCurriculum): string {
  const partes: string[] = []
  const dp = datos.datosPersonales
  partes.push(dp.nombreCompleto, dp.titulo, dp.ubicacion)
  partes.push(datos.perfil)

  for (const exp of datos.experiencia) {
    partes.push(exp.empresa, exp.cargo, exp.ubicacion, exp.descripcion, exp.logros)
  }
  for (const edu of datos.educacion) {
    partes.push(edu.institucion, edu.titulo, edu.descripcion)
  }
  for (const c of datos.cursos) {
    partes.push(c.nombre, c.institucion)
  }
  for (const p of datos.proyectos) {
    partes.push(p.nombre, p.descripcion, p.tecnologias)
  }
  partes.push(...datos.habilidades)
  for (const i of datos.idiomas) {
    partes.push(i.nombre)
  }
  for (const r of datos.referencias) {
    partes.push(r.nombre, r.cargo, r.empresa, r.relacion)
  }
  partes.push(datos.disponibilidad, datos.pretensionesRenta)

  return partes.filter(Boolean).join(" ")
}

export function analizar(jobDescription: string, datos: DatosCurriculum): ResultadoAnalisis {
  const tokens = tokenizar(jobDescription)
  if (tokens.length === 0) {
    return { totalClaves: 0, encontradas: 0, palabras: [] }
  }

  const frecuencias = new Map<string, number>()
  for (const t of tokens) {
    frecuencias.set(t, (frecuencias.get(t) ?? 0) + 1)
  }

  const cvNormalizado = normalizar(textoCv(datos))
  const cvTokens = new Set(tokenizar(textoCv(datos)))

  const palabras: PalabraClave[] = Array.from(frecuencias.entries())
    .map(([palabra, frecuencia]) => ({
      palabra,
      frecuencia,
      enCv: cvTokens.has(palabra) || cvNormalizado.includes(palabra),
    }))
    .sort((a, b) => b.frecuencia - a.frecuencia)
    .slice(0, 30)

  const encontradas = palabras.filter((p) => p.enCv).length
  return { totalClaves: palabras.length, encontradas, palabras }
}
