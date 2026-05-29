"use client"

import { XIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { StepperIndice } from "@/editor/wizard/StepperIndice"
import type { Paso } from "@/editor/wizard/useEditorPasos"

interface SheetIndiceProps {
  abierto: boolean
  pasos: Paso[]
  actual: number
  onIr: (indice: number) => void
  onCerrar: () => void
}

/** Índice como hoja inferior para mobile: tocar un paso salta y cierra la hoja. */
export function SheetIndice({ abierto, pasos, actual, onIr, onCerrar }: SheetIndiceProps) {
  if (!abierto) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
      <Surface
        variant="overlay"
        className="absolute inset-0"
        onClick={onCerrar}
        aria-hidden
      />
      <Surface
        variant="popover"
        role="dialog"
        aria-label="Ir a un paso"
        className="relative max-h-[80dvh] overflow-y-auto rounded-t-2xl p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <Text as="h2" variant="strong" className="text-base font-extrabold">Ir a un paso</Text>
          <Button variant="ghost" size="icon" onClick={onCerrar} aria-label="Cerrar">
            <XIcon size={18} />
          </Button>
        </div>
        <StepperIndice
          pasos={pasos}
          actual={actual}
          onIr={(i) => {
            onIr(i)
            onCerrar()
          }}
        />
      </Surface>
    </div>
  )
}
