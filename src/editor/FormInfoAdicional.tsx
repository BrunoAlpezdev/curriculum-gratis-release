"use client"

import { InfoIcon } from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { CamposInfoAdicional, CONSEJOS_INFO_ADICIONAL } from "@/editor/campos/CamposInfoAdicional"

export function FormInfoAdicional() {
  return (
    <SeccionFormulario
      titulo="Información Adicional"
      icono={<InfoIcon size={18} />}
      defaultAbierta={false}
      tip={CONSEJOS_INFO_ADICIONAL}
    >
      <CamposInfoAdicional />
    </SeccionFormulario>
  )
}
