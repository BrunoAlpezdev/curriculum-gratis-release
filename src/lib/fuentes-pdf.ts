import type { jsPDF } from "jspdf"
import type { FuenteId } from "@/types"
import { FUENTES } from "@/lib/constantes"

type EstiloFuente = "normal" | "bold" | "italic"

/* Rutas publicas de los TTF por familia y estilo (servidos desde /public/fuentes).
   Solo se descargan por fetch en el momento de generar el PDF, nunca van al bundle JS. */
export const ARCHIVOS_FUENTE: Record<FuenteId, Record<EstiloFuente, string>> = {
  inter: {
    normal: "/fuentes/inter-regular.ttf",
    bold: "/fuentes/inter-bold.ttf",
    italic: "/fuentes/inter-italic.ttf",
  },
  roboto: {
    normal: "/fuentes/roboto-regular.ttf",
    bold: "/fuentes/roboto-bold.ttf",
    italic: "/fuentes/roboto-italic.ttf",
  },
  lato: {
    normal: "/fuentes/lato-regular.ttf",
    bold: "/fuentes/lato-bold.ttf",
    italic: "/fuentes/lato-italic.ttf",
  },
  merriweather: {
    normal: "/fuentes/merriweather-regular.ttf",
    bold: "/fuentes/merriweather-bold.ttf",
    italic: "/fuentes/merriweather-italic.ttf",
  },
  "libre-baskerville": {
    normal: "/fuentes/librebaskerville-regular.ttf",
    bold: "/fuentes/librebaskerville-bold.ttf",
    italic: "/fuentes/librebaskerville-italic.ttf",
  },
}

/* Cache de base64 por ruta de archivo, a nivel modulo, para no re-fetchear
   ni re-codificar en descargas sucesivas dentro de la misma sesion. */
const cacheBase64 = new Map<string, Promise<string>>()

function fuenteFallback(fuente: FuenteId): string {
  return FUENTES.find((f) => f.valor === fuente)?.jsPdf ?? "helvetica"
}

/* ArrayBuffer -> base64 por bloques. String.fromCharCode(...bytes) revienta el
   stack con TTF grandes (cientos de KB), asi que acumulamos por chunks. */
function bufferABase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  const CHUNK = 0x2000 // 8 KB
  let binario = ""
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binario += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  return btoa(binario)
}

async function cargarBase64(ruta: string): Promise<string> {
  const enCache = cacheBase64.get(ruta)
  if (enCache) return enCache
  const promesa = fetch(ruta)
    .then((res) => {
      if (!res.ok) throw new Error(`No se pudo cargar ${ruta}: ${res.status}`)
      return res.arrayBuffer()
    })
    .then(bufferABase64)
  cacheBase64.set(ruta, promesa)
  // No cachear un rechazo permanente: si falla, permitir reintento futuro.
  promesa.catch(() => cacheBase64.delete(ruta))
  return promesa
}

/* Registra los 3 estilos (normal/bold/italic) de la familia elegida en el jsPDF
   y devuelve el nombre de familia para usar en setFont. Si algo falla (offline,
   404), NO lanza: devuelve el fallback estandar de jsPDF (helvetica/times). */
export async function registrarFuentePdf(
  pdf: jsPDF,
  fuente: FuenteId,
): Promise<string> {
  const familia = fuente
  const estilos: EstiloFuente[] = ["normal", "bold", "italic"]
  try {
    const archivos = ARCHIVOS_FUENTE[fuente]
    const base64PorEstilo = await Promise.all(
      estilos.map((estilo) => cargarBase64(archivos[estilo])),
    )
    estilos.forEach((estilo, i) => {
      const nombreArchivo = archivos[estilo].split("/").pop() ?? `${familia}-${estilo}.ttf`
      pdf.addFileToVFS(nombreArchivo, base64PorEstilo[i]!)
      pdf.addFont(nombreArchivo, familia, estilo)
    })
    return familia
  } catch {
    return fuenteFallback(fuente)
  }
}
