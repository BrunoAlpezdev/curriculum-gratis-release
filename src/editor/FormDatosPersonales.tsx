"use client"

import { UserIcon } from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { CamposDatosPersonales, CONSEJOS_DATOS_PERSONALES } from "@/editor/campos/CamposDatosPersonales"

export function FormDatosPersonales() {
  return (
    <SeccionFormulario
      titulo="Datos Personales"
      icono={<UserIcon size={18} />}
      tip={CONSEJOS_DATOS_PERSONALES}
    >
      <CamposDatosPersonales />
    </SeccionFormulario>
  )
}
