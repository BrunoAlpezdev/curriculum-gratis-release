"use client"

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"

interface BarraNavegacionPasosProps {
  esPrimero: boolean
  esUltimo: boolean
  opcional?: boolean
  onAnterior: () => void
  onSiguiente: () => void
}

/**
 * Atrás / Siguiente. En el último paso no muestra "Siguiente" (la descarga vive
 * dentro del paso de revisión). En pasos opcionales el avance se rotula "Saltar".
 */
export function BarraNavegacionPasos({
  esPrimero,
  esUltimo,
  opcional = false,
  onAnterior,
  onSiguiente,
}: BarraNavegacionPasosProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button
        variant="secondary"
        size="md"
        onClick={onAnterior}
        disabled={esPrimero}
        className="min-w-24"
      >
        <ArrowLeftIcon size={16} />
        Atrás
      </Button>
      {!esUltimo && (
        <Button variant="primary" size="md" onClick={onSiguiente} className="min-w-24">
          {opcional ? "Saltar" : "Siguiente"}
          <ArrowRightIcon size={16} />
        </Button>
      )}
    </div>
  )
}
