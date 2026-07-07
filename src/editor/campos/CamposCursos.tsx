"use client"

import { PlusIcon } from "@phosphor-icons/react"
import { Input } from "@/components/atoms/Input"
import { SelectorFecha } from "@/components/atoms/SelectorFecha"
import { Button } from "@/components/atoms/Button"
import { EntradaRepetible } from "@/components/molecules/EntradaRepetible"
import { useCurriculumStore } from "@/lib/store"

export const CONSEJOS_CURSOS = [
  "En Chile los cursos SENCE, OTEC y bootcamps pesan harto. Si es relevante para el puesto, póngalo — no importa que sea corto.",
  "Las certificaciones con logo reconocible (AWS, Google, Scrum Alliance, Microsoft) son oro: ponlas primero.",
  "Incluye el enlace del certificado si lo tienes — los reclutadores curiosos lo van a abrir.",
  "Ordena por relevancia, no por fecha. Una certificación AWS de 2022 pesa más que un curso genérico de 2024.",
]

export function CamposCursos() {
  const cursos = useCurriculumStore((s) => s.datos.cursos)
  const agregar = useCurriculumStore((s) => s.agregarCurso)
  const actualizar = useCurriculumStore((s) => s.actualizarCurso)
  const eliminar = useCurriculumStore((s) => s.eliminarCurso)
  const idiomaCv = useCurriculumStore((s) => s.personalizacion.idiomaCv)

  return (
    <>
      {cursos.map((curso) => (
        <EntradaRepetible
          key={curso.id}
          onEliminar={() => eliminar(curso.id)}
        >
          <Input
            label="Nombre del curso"
            placeholder="AWS Certified Solutions Architect"
            value={curso.nombre}
            onChange={(e) => actualizar(curso.id, { nombre: e.target.value })}
          />
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
            <Input
              label="Institución"
              placeholder="Amazon Web Services"
              value={curso.institucion}
              onChange={(e) =>
                actualizar(curso.id, { institucion: e.target.value })
              }
            />
            <SelectorFecha
              label="Fecha de obtención"
              valor={curso.fecha || null}
              onChange={(v) => actualizar(curso.id, { fecha: v ?? "" })}
              idiomaCv={idiomaCv}
            />
          </div>
          <Input
            label="Enlace (opcional)"
            placeholder="credly.com/badges/..."
            value={curso.url}
            onChange={(e) => actualizar(curso.id, { url: e.target.value })}
          />
        </EntradaRepetible>
      ))}
      <Button variant="secondary" size="sm" onClick={agregar}>
        <PlusIcon size={16} />
        Agregar curso
      </Button>
    </>
  )
}
