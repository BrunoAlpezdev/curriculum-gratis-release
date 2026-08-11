"use client"

import { StarIcon } from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import {
  CamposSeccionesDestacadas,
  CONSEJOS_SECCIONES_DESTACADAS,
} from "@/editor/campos/CamposSeccionesDestacadas"

export function FormSeccionesDestacadas() {
  return (
    <SeccionFormulario
      titulo="Secciones destacadas"
      icono={<StarIcon size={18} />}
      defaultAbierta={false}
      tip={CONSEJOS_SECCIONES_DESTACADAS}
    >
      <CamposSeccionesDestacadas />
    </SeccionFormulario>
  )
}
