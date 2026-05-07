"use client"

import { Surface } from "@/components/atoms/Surface"
import { FormDatosPersonales } from "@/editor/FormDatosPersonales"
import { FormCarta } from "@/editor/FormCarta"

export function PanelFormularioCarta() {
  return (
    <Surface variant="page" className="flex flex-col gap-4 overflow-y-auto p-3 sm:p-4">
      <FormDatosPersonales />
      <FormCarta />
    </Surface>
  )
}
