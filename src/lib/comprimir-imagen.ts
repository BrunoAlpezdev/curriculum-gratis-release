const LADO_MAXIMO = 512
const CALIDAD_JPEG = 0.85

/**
 * Comprime una foto: la redimensiona para que el lado mayor sea <= 512 px
 * y la reencoda como JPEG (~30-60 KB tipico). Devuelve un data URL.
 * Comprime siempre, aunque el archivo ya sea pequeno, para uniformar el formato.
 */
export async function comprimirFoto(archivo: File): Promise<string> {
  const url = URL.createObjectURL(archivo)
  try {
    const imagen = await cargarImagen(url)
    const { width, height } = imagen
    if (!width || !height) {
      throw new Error("La imagen no tiene dimensiones validas.")
    }

    const escala = Math.min(1, LADO_MAXIMO / Math.max(width, height))
    const anchoDestino = Math.round(width * escala)
    const altoDestino = Math.round(height * escala)

    const canvas = document.createElement("canvas")
    canvas.width = anchoDestino
    canvas.height = altoDestino
    const contexto = canvas.getContext("2d")
    if (!contexto) {
      throw new Error("No se pudo procesar la imagen en este navegador.")
    }
    // Fondo blanco: el JPEG no tiene canal alfa, sin esto un PNG transparente
    // queda con fondo negro.
    contexto.fillStyle = "#ffffff"
    contexto.fillRect(0, 0, anchoDestino, altoDestino)
    contexto.drawImage(imagen, 0, 0, anchoDestino, altoDestino)

    return canvas.toDataURL("image/jpeg", CALIDAD_JPEG)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function cargarImagen(url: string): Promise<HTMLImageElement> {
  return new Promise((resolver, rechazar) => {
    const imagen = new Image()
    imagen.onload = () => resolver(imagen)
    imagen.onerror = () => rechazar(new Error("No se pudo leer la imagen. Prueba con otro archivo."))
    imagen.src = url
  })
}
