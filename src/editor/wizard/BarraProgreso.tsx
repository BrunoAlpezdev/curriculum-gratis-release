"use client"

import { Text } from "@/components/atoms/Text"

interface BarraProgresoProps {
  actual: number // índice base 0
  total: number
}

export function BarraProgreso({ actual, total }: BarraProgresoProps) {
  const porcentaje = Math.round(((actual + 1) / total) * 100)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Text as="span" variant="caption" className="font-semibold text-action-strong">
          Paso {actual + 1} de {total}
        </Text>
        <Text as="span" variant="caption">{porcentaje}%</Text>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-border-subtle"
        role="progressbar"
        aria-valuenow={actual + 1}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div
          className="h-full rounded-full bg-action-primary transition-all duration-300"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  )
}
