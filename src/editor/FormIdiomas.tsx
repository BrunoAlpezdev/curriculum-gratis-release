"use client"

import { TranslateIcon, PlusIcon } from "@phosphor-icons/react"
import { Input } from "@/components/atoms/Input"
import { Select } from "@/components/atoms/Select"
import { Button } from "@/components/atoms/Button"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { EntradaRepetible } from "@/components/molecules/EntradaRepetible"
import { useCurriculumStore } from "@/lib/store"
import { NIVELES_IDIOMA } from "@/lib/constantes"
import type { NivelIdioma } from "@/types"

export function FormIdiomas() {
  const idiomas = useCurriculumStore((s) => s.datos.idiomas)
  const agregar = useCurriculumStore((s) => s.agregarIdioma)
  const actualizar = useCurriculumStore((s) => s.actualizarIdioma)
  const eliminar = useCurriculumStore((s) => s.eliminarIdioma)

  return (
    <SeccionFormulario
      titulo="Idiomas"
      icono={<TranslateIcon size={18} />}
      tip={[
        "Usa niveles claros: Nativo, Avanzado (C1/C2), Intermedio (B1/B2), Básico (A1/A2). Nada de 'bueno' o 'regular'.",
        "No sobreestimes tu nivel — en muchas entrevistas te van a hablar directo en el idioma.",
        "El inglés es casi obligatorio hoy aunque no lo pidan explícitamente. Si lo tienes, ponlo.",
        "Solo lista idiomas en los que realmente puedes desenvolverte — no infles con idiomas que estudiaste 3 meses.",
      ]}
    >
      {idiomas.map((idioma) => (
        <EntradaRepetible
          key={idioma.id}
          onEliminar={() => eliminar(idioma.id)}
        >
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Idioma"
              placeholder="Ingles"
              value={idioma.nombre}
              onChange={(e) =>
                actualizar(idioma.id, { nombre: e.target.value })
              }
            />
            <Select
              label="Nivel"
              opciones={NIVELES_IDIOMA.map((n) => ({
                valor: n.valor,
                etiqueta: n.etiqueta,
              }))}
              value={idioma.nivel}
              onChange={(e) =>
                actualizar(idioma.id, {
                  nivel: e.target.value as NivelIdioma,
                })
              }
            />
          </div>
        </EntradaRepetible>
      ))}
      <Button variant="secondary" size="sm" onClick={agregar}>
        <PlusIcon size={16} />
        Agregar idioma
      </Button>
    </SeccionFormulario>
  )
}
