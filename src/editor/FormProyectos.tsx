"use client"

import { CodeIcon } from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { CamposProyectos, CONSEJOS_PROYECTOS } from "@/editor/campos/CamposProyectos"

export function FormProyectos() {
  return (
    <SeccionFormulario
      titulo="Proyectos"
      icono={<CodeIcon size={18} />}
      defaultAbierta={false}
      tip={CONSEJOS_PROYECTOS}
    >
      <CamposProyectos />
    </SeccionFormulario>
  )
}
