/* Parseo compartido de texto multilinea con viñetas, usado tanto por el preview
   HTML como por el PDF ATS para que ambos rendericen exactamente igual. */

export interface LineaRica {
  tipo: "vineta" | "parrafo"
  contenido: string
}

/* Una linea es viñeta si empieza (tras espacios) con -, * o • SEGUIDO de un
   espacio. La exigencia del espacio evita que "-5% churn" se lea como viñeta. */
const MARCADOR_VINETA = /^\s*[-*•]\s+/

export function parsearTextoRico(texto: string): LineaRica[] {
  const lineas = texto.split(/\r?\n/).map((linea): LineaRica => {
    if (MARCADOR_VINETA.test(linea)) {
      return { tipo: "vineta", contenido: linea.replace(MARCADOR_VINETA, "").trimEnd() }
    }
    return { tipo: "parrafo", contenido: linea.trimEnd() }
  })
  return colapsarVacias(lineas)
}

/* No colapsamos las lineas vacias (respetan el espaciado del usuario), pero una
   corrida de 3 o mas vacias consecutivas se reduce a una sola. */
function colapsarVacias(lineas: LineaRica[]): LineaRica[] {
  const resultado: LineaRica[] = []
  let i = 0
  while (i < lineas.length) {
    const actual = lineas[i]!
    if (!esVacia(actual)) {
      resultado.push(actual)
      i++
      continue
    }
    let j = i
    while (j < lineas.length && esVacia(lineas[j]!)) j++
    const cantidad = j - i
    const aMantener = cantidad >= 3 ? 1 : cantidad
    for (let k = 0; k < aMantener; k++) resultado.push({ tipo: "parrafo", contenido: "" })
    i = j
  }
  return resultado
}

function esVacia(linea: LineaRica): boolean {
  return linea.tipo === "parrafo" && linea.contenido === ""
}

/* True si el texto es una sola linea de parrafo (sin viñetas ni saltos). Se usa
   para decidir si la etiqueta de "Logros" va inline o en su propia linea, con la
   MISMA regla en preview y PDF. */
export function esTextoSimple(texto: string): boolean {
  const noVacias = parsearTextoRico(texto).filter((l) => l.contenido !== "")
  return noVacias.length <= 1 && noVacias.every((l) => l.tipo === "parrafo")
}
