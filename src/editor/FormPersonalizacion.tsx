"use client"

import { PaletteIcon } from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { CamposPersonalizacion, CONSEJOS_PERSONALIZACION } from "@/editor/campos/CamposPersonalizacion"

export function FormPersonalizacion() {
  return (
    <SeccionFormulario
      titulo="Personalizar"
      icono={<PaletteIcon size={18} />}
      defaultAbierta
      tip={CONSEJOS_PERSONALIZACION}
    >
      <CamposPersonalizacion />
    </SeccionFormulario>
  )
}
