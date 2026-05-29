"use client"

import { useState } from "react"
import { DownloadSimpleIcon, SpinnerIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { useCurriculumStore } from "@/lib/store"
import type { Modo } from "@/editor/Editor"

interface BotonDescargarProps {
  modo: Modo
  className?: string
  size?: "sm" | "md" | "lg"
}

/**
 * CTA de descarga reutilizable. Carga el generador de PDF de forma diferida (igual
 * que BarraAcciones) para no inflar el bundle inicial del editor.
 */
export function BotonDescargar({ modo, className, size = "lg" }: BotonDescargarProps) {
  const datos = useCurriculumStore((s) => s.datos)
  const carta = useCurriculumStore((s) => s.carta)
  const personalizacion = useCurriculumStore((s) => s.personalizacion)
  const [descargando, setDescargando] = useState(false)

  async function descargar() {
    setDescargando(true)
    try {
      if (modo === "carta") {
        const { generarPdfCarta } = await import("@/lib/generar-pdf-carta")
        generarPdfCarta(datos, carta, personalizacion)
      } else {
        const { generarPdf } = await import("@/lib/generar-pdf")
        await generarPdf(datos, personalizacion)
      }
    } finally {
      setDescargando(false)
    }
  }

  return (
    <Button size={size} onClick={descargar} disabled={descargando} className={className}>
      {descargando ? (
        <SpinnerIcon size={18} className="animate-spin" />
      ) : (
        <DownloadSimpleIcon size={18} />
      )}
      {descargando ? "Descargando..." : modo === "carta" ? "Descargar carta en PDF" : "Descargar CV en PDF"}
    </Button>
  )
}
