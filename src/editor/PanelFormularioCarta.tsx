"use client"

import { FormDatosPersonales } from "@/editor/FormDatosPersonales"
import { FormCarta } from "@/editor/FormCarta"

export function PanelFormularioCarta() {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto bg-ds-paper p-3 sm:p-4">
      <FormDatosPersonales />
      <FormCarta />
    </div>
  )
}
