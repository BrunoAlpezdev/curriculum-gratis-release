"use client"

import { CertificateIcon } from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { CamposCursos, CONSEJOS_CURSOS } from "@/editor/campos/CamposCursos"

export function FormCursos() {
  return (
    <SeccionFormulario
      titulo="Cursos y Certificaciones"
      icono={<CertificateIcon size={18} />}
      defaultAbierta={false}
      tip={CONSEJOS_CURSOS}
    >
      <CamposCursos />
    </SeccionFormulario>
  )
}
