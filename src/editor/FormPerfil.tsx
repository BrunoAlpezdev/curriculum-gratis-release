"use client"

import { IdentificationCardIcon } from "@phosphor-icons/react"
import { Textarea } from "@/components/atoms/Textarea"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { useCurriculumStore } from "@/lib/store"

export function FormPerfil() {
  const perfil = useCurriculumStore((s) => s.datos.perfil)
  const setPerfil = useCurriculumStore((s) => s.setPerfil)

  return (
    <SeccionFormulario
      titulo="Perfil Profesional"
      icono={<IdentificationCardIcon size={18} />}
      tip={[
        "Máximo 3-4 líneas: quién eres, cuántos años de experiencia tienes y cuál es tu especialidad.",
        "Nada de 'soy una persona proactiva con ganas de aprender' — eso lo escribe todo el mundo y no dice nada.",
        "Personalízalo para cada oferta laboral. Uno genérico para todos los trabajos no funciona.",
        "Empieza con tu título + años de experiencia: 'Desarrollador fullstack con 5 años de experiencia en...'",
      ]}
    >
      <Textarea
        label="Resumen profesional"
        placeholder="Profesional con experiencia en..."
        value={perfil}
        onChange={(e) => setPerfil(e.target.value)}
        rows={4}
      />
    </SeccionFormulario>
  )
}
