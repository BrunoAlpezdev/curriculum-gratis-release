"use client"

import { BriefcaseIcon, PlusIcon } from "@phosphor-icons/react"
import { Input } from "@/components/atoms/Input"
import { SelectorFecha } from "@/components/atoms/SelectorFecha"
import { Textarea } from "@/components/atoms/Textarea"
import { Button } from "@/components/atoms/Button"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { EntradaRepetible } from "@/components/molecules/EntradaRepetible"
import { useCurriculumStore } from "@/lib/store"

export function FormExperiencia() {
  const experiencia = useCurriculumStore((s) => s.datos.experiencia)
  const agregar = useCurriculumStore((s) => s.agregarExperiencia)
  const actualizar = useCurriculumStore((s) => s.actualizarExperiencia)
  const eliminar = useCurriculumStore((s) => s.eliminarExperiencia)

  return (
    <SeccionFormulario
      titulo="Experiencia Laboral"
      icono={<BriefcaseIcon size={18} />}
      tip={[
        "Empieza cada logro con un verbo de acción: 'Implementé', 'Reduje', 'Lideré', 'Optimicé'.",
        "Cuantifica siempre que puedas: 'Reduje el tiempo de carga un 40%' es infinitamente mejor que 'Mejoré el rendimiento'.",
        "Ordena de más reciente a más antiguo — el reclutador lee de arriba para abajo.",
        "Describe el impacto, no solo las tareas. 'Atendí clientes' vs 'Atendí 80+ clientes diarios manteniendo 95% de satisfacción'.",
      ]}
    >
      {experiencia.map((exp) => (
        <EntradaRepetible key={exp.id} onEliminar={() => eliminar(exp.id)}>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Empresa"
              placeholder="Empresa S.A."
              value={exp.empresa}
              onChange={(e) =>
                actualizar(exp.id, { empresa: e.target.value })
              }
            />
            <Input
              label="Cargo"
              placeholder="Analista de datos"
              value={exp.cargo}
              onChange={(e) =>
                actualizar(exp.id, { cargo: e.target.value })
              }
            />
          </div>
          <Input
            label="Ubicacion"
            placeholder="Santiago, Chile"
            value={exp.ubicacion}
            onChange={(e) =>
              actualizar(exp.id, { ubicacion: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <SelectorFecha
              label="Fecha inicio"
              valor={exp.fechaInicio || null}
              onChange={(v) => actualizar(exp.id, { fechaInicio: v ?? "" })}
            />
            <SelectorFecha
              label="Fecha fin"
              valor={exp.fechaFin}
              onChange={(v) => actualizar(exp.id, { fechaFin: v })}
              permitirPresente
              placeholder="Presente"
            />
          </div>
          <Textarea
            label="Descripcion"
            placeholder="Responsabilidades principales..."
            value={exp.descripcion}
            onChange={(e) =>
              actualizar(exp.id, { descripcion: e.target.value })
            }
            rows={3}
          />
          <Textarea
            label="Logros"
            placeholder="Reduccion de costos en un 15%..."
            value={exp.logros}
            onChange={(e) =>
              actualizar(exp.id, { logros: e.target.value })
            }
            rows={2}
          />
        </EntradaRepetible>
      ))}
      <Button variant="secondary" size="sm" onClick={agregar}>
        <PlusIcon size={16} />
        Agregar experiencia
      </Button>
    </SeccionFormulario>
  )
}
