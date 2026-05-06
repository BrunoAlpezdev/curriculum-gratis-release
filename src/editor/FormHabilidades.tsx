"use client"

import { useState } from "react"
import { LightningIcon, PlusIcon } from "@phosphor-icons/react"
import { Input } from "@/components/atoms/Input"
import { Button } from "@/components/atoms/Button"
import { Chip } from "@/components/atoms/Chip"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { useCurriculumStore } from "@/lib/store"

export function FormHabilidades() {
  const habilidades = useCurriculumStore((s) => s.datos.habilidades)
  const agregar = useCurriculumStore((s) => s.agregarHabilidad)
  const eliminar = useCurriculumStore((s) => s.eliminarHabilidad)
  const [valor, setValor] = useState("")

  function agregarHabilidad() {
    const trimmed = valor.trim()
    if (trimmed) {
      agregar(trimmed)
      setValor("")
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      agregarHabilidad()
    }
  }

  return (
    <SeccionFormulario
      titulo="Competencias Clave"
      icono={<LightningIcon size={18} />}
      tip={[
        "Evita habilidades genéricas que todos tienen: 'trabajo en equipo', 'comunicación efectiva', 'Microsoft Office'.",
        "Prioriza habilidades técnicas concretas y verificables: lenguajes, frameworks, herramientas, metodologías.",
        "No pongas cosas obvias para el rol — si postulas como developer, poner 'HTML' no suma nada.",
        "10-12 habilidades es el punto justo. Más de eso parece que inflaste el CV.",
      ]}
    >
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            label="Agregar habilidad"
            placeholder="Escribe y presiona Enter"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          variant="secondary"
          size="icon"
          onClick={agregarHabilidad}
          className="mt-[26px] shrink-0"
          aria-label="Agregar habilidad"
        >
          <PlusIcon size={18} />
        </Button>
      </div>
      {habilidades.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {habilidades.map((h) => (
            <Chip key={h} onRemove={() => eliminar(h)}>
              {h}
            </Chip>
          ))}
        </div>
      )}
    </SeccionFormulario>
  )
}
