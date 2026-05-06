import type { ColorTema } from "@/types"
import { COLORES_TEMA } from "@/lib/constantes"

export function getColorHex(color: ColorTema): string {
  return COLORES_TEMA.find((c) => c.valor === color)?.hex ?? "#2563eb"
}

export function getColorClaro(hex: string): string {
  // Convierte hex a RGB y genera version con 10% opacidad
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, 0.1)`
}
