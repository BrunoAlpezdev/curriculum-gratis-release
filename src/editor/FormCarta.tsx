"use client"

import { EnvelopeIcon } from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { CamposCarta, CONSEJOS_CARTA } from "@/editor/campos/CamposCarta"

export function FormCarta() {
  return (
    <SeccionFormulario
      titulo="Carta de Presentacion"
      icono={<EnvelopeIcon size={18} />}
      tip={CONSEJOS_CARTA}
    >
      <CamposCarta />
    </SeccionFormulario>
  )
}
