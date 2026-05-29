"use client"

import { ListChecksIcon } from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { CamposCalidadCv, CONSEJOS_CALIDAD_CV } from "@/editor/campos/CamposCalidadCv"

export function FormCalidadCv() {
  return (
    <SeccionFormulario
      titulo="Checklist de calidad"
      icono={<ListChecksIcon size={18} />}
      tip={CONSEJOS_CALIDAD_CV}
    >
      <CamposCalidadCv />
    </SeccionFormulario>
  )
}
