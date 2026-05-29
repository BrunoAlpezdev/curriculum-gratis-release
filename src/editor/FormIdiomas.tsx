"use client"

import { TranslateIcon } from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { CamposIdiomas, CONSEJOS_IDIOMAS } from "@/editor/campos/CamposIdiomas"

export function FormIdiomas() {
  return (
    <SeccionFormulario
      titulo="Idiomas"
      icono={<TranslateIcon size={18} />}
      tip={CONSEJOS_IDIOMAS}
    >
      <CamposIdiomas />
    </SeccionFormulario>
  )
}
