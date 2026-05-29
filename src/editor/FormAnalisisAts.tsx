"use client"

import { TargetIcon } from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { CamposAnalisisAts, CONSEJOS_ANALISIS_ATS } from "@/editor/campos/CamposAnalisisAts"

export function FormAnalisisAts() {
  return (
    <SeccionFormulario
      titulo="Analisis ATS vs Oferta"
      icono={<TargetIcon size={18} />}
      defaultAbierta={false}
      tip={CONSEJOS_ANALISIS_ATS}
    >
      <CamposAnalisisAts />
    </SeccionFormulario>
  )
}
