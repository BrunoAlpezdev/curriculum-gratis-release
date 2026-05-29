"use client"

import { LightningIcon } from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { CamposHabilidades, CONSEJOS_HABILIDADES } from "@/editor/campos/CamposHabilidades"

export function FormHabilidades() {
  return (
    <SeccionFormulario
      titulo="Competencias Clave"
      icono={<LightningIcon size={18} />}
      tip={CONSEJOS_HABILIDADES}
    >
      <CamposHabilidades />
    </SeccionFormulario>
  )
}
