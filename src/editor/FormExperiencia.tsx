"use client"

import { BriefcaseIcon } from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { CamposExperiencia, CONSEJOS_EXPERIENCIA } from "@/editor/campos/CamposExperiencia"

export function FormExperiencia() {
  return (
    <SeccionFormulario
      titulo="Experiencia Laboral"
      icono={<BriefcaseIcon size={18} />}
      tip={CONSEJOS_EXPERIENCIA}
    >
      <CamposExperiencia />
    </SeccionFormulario>
  )
}
