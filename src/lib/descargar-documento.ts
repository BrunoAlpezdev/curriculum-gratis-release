import type { Carta, DatosCurriculum, Personalizacion } from "@/types"
import type { Modo } from "@/editor/Editor"

/**
 * Genera y descarga el PDF del CV o de la carta segun el modo. Carga el generador
 * de forma diferida para no inflar el bundle inicial del editor. Los consumidores
 * (BarraAcciones, BotonDescargar) manejan el error a su manera.
 */
export async function descargarDocumento(
  modo: Modo,
  datos: DatosCurriculum,
  carta: Carta,
  personalizacion: Personalizacion,
): Promise<void> {
  if (modo === "carta") {
    const { generarPdfCarta } = await import("@/lib/generar-pdf-carta")
    await generarPdfCarta(datos, carta, personalizacion)
  } else {
    const { generarPdf } = await import("@/lib/generar-pdf")
    await generarPdf(datos, personalizacion)
  }
}
