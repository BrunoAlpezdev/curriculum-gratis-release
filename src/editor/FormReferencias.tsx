"use client"

import { UsersIcon } from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { CamposReferencias, CONSEJOS_REFERENCIAS } from "@/editor/campos/CamposReferencias"

export function FormReferencias() {
  return (
    <SeccionFormulario
      titulo="Referencias"
      icono={<UsersIcon size={18} />}
      defaultAbierta={false}
      tip={CONSEJOS_REFERENCIAS}
    >
      <CamposReferencias />
    </SeccionFormulario>
  )
}
