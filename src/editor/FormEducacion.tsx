"use client"

import { GraduationCapIcon } from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { CamposEducacion, CONSEJOS_EDUCACION } from "@/editor/campos/CamposEducacion"

export function FormEducacion() {
  return (
    <SeccionFormulario
      titulo="Educación y Certificaciones"
      icono={<GraduationCapIcon size={18} />}
      tip={CONSEJOS_EDUCACION}
    >
      <CamposEducacion />
    </SeccionFormulario>
  )
}
