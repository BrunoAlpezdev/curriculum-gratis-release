"use client"

import { IdentificationCardIcon } from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { CamposPerfil, CONSEJOS_PERFIL } from "@/editor/campos/CamposPerfil"

export function FormPerfil() {
  return (
    <SeccionFormulario
      titulo="Perfil Profesional"
      icono={<IdentificationCardIcon size={18} />}
      tip={CONSEJOS_PERFIL}
    >
      <CamposPerfil />
    </SeccionFormulario>
  )
}
