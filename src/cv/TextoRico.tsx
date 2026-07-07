import { parsearTextoRico, type LineaRica } from "@/lib/texto-rico"

interface Bloque {
  tipo: LineaRica["tipo"]
  items: string[]
}

/* Agrupa corridas consecutivas del mismo tipo para renderizar cada corrida de
   parrafos como un <p> (con los saltos como \n) y cada corrida de viñetas como
   un <ul>. */
function agruparRuns(lineas: LineaRica[]): Bloque[] {
  const bloques: Bloque[] = []
  for (const linea of lineas) {
    const ultimo = bloques[bloques.length - 1]
    if (ultimo && ultimo.tipo === linea.tipo) {
      ultimo.items.push(linea.contenido)
    } else {
      bloques.push({ tipo: linea.tipo, items: [linea.contenido] })
    }
  }
  return bloques
}

export function TextoRico({ texto, className }: { texto: string; className?: string }) {
  const bloques = agruparRuns(parsearTextoRico(texto))
  return (
    <div className={className}>
      {bloques.map((bloque, i) =>
        bloque.tipo === "vineta" ? (
          <ul key={i} className="list-disc pl-4 space-y-0.5">
            {bloque.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={i} className="whitespace-pre-line">
            {bloque.items.join("\n")}
          </p>
        ),
      )}
    </div>
  )
}
