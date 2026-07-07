"use client"

import { useState } from "react"
import { DownloadSimpleIcon, SpinnerIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { cn } from "@/components/ui/cn"
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
  const [error, setError] = useState("")

  async function descargar() {
    setDescargando(true)
    setError("")
    try {
      if (modo === "carta") {
        const { generarPdfCarta } = await import("@/lib/generar-pdf-carta")
        generarPdfCarta(datos, carta, personalizacion)
      } else {
        const { generarPdf } = await import("@/lib/generar-pdf")
        await generarPdf(datos, personalizacion)
      }
    } catch (err) {
      const detalle = err instanceof Error && err.message ? ` ${err.message}` : ""
      setError(`No se pudo generar el PDF. Intenta de nuevo.${detalle}`)
    } finally {
      setDescargando(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Button size={size} onClick={descargar} disabled={descargando} className="w-full">
        {descargando ? (
          <SpinnerIcon size={18} className="animate-spin" />
        ) : (
          <DownloadSimpleIcon size={18} />
        )}
        {descargando ? "Descargando..." : modo === "carta" ? "Descargar carta en PDF" : "Descargar CV en PDF"}
      </Button>
      {error && (
        <Surface variant="panelMuted" className="border-danger-line bg-danger-soft px-3 py-2">
          <Text variant="small" className="text-danger-text">
            {error}
          </Text>
        </Surface>
      )}
    </div>
  )
}
