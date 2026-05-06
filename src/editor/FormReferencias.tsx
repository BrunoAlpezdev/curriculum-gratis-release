"use client"

import { UsersIcon, PlusIcon } from "@phosphor-icons/react"
import { Input } from "@/components/atoms/Input"
import { Button } from "@/components/atoms/Button"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { EntradaRepetible } from "@/components/molecules/EntradaRepetible"
import { useCurriculumStore } from "@/lib/store"

export function FormReferencias() {
  const referencias = useCurriculumStore((s) => s.datos.referencias)
  const agregar = useCurriculumStore((s) => s.agregarReferencia)
  const actualizar = useCurriculumStore((s) => s.actualizarReferencia)
  const eliminar = useCurriculumStore((s) => s.eliminarReferencia)

  return (
    <SeccionFormulario
      titulo="Referencias"
      icono={<UsersIcon size={18} />}
      defaultAbierta={false}
      tip={[
        "Siempre pide permiso antes de poner a alguien como referencia — nada peor que un ex jefe sorprendido por una llamada.",
        "Indica la relación ('Jefe directo', 'Cliente', 'Profesor guía'). Sin contexto una referencia pierde peso.",
        "Ideal: 2 o 3 referencias. Una sola puede verse justa; más de cuatro ocupa espacio valioso.",
        "Si postulas a algo muy público, considera omitir el teléfono y dejar solo el email — tu referencia te lo va a agradecer.",
      ]}
    >
      {referencias.map((ref) => (
        <EntradaRepetible
          key={ref.id}
          onEliminar={() => eliminar(ref.id)}
        >
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nombre"
              placeholder="Nombre de la referencia"
              value={ref.nombre}
              onChange={(e) =>
                actualizar(ref.id, { nombre: e.target.value })
              }
            />
            <Input
              label="Cargo"
              placeholder="Gerente de operaciones"
              value={ref.cargo}
              onChange={(e) =>
                actualizar(ref.id, { cargo: e.target.value })
              }
            />
          </div>
          <Input
            label="Empresa"
            placeholder="Empresa S.A."
            value={ref.empresa}
            onChange={(e) =>
              actualizar(ref.id, { empresa: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email"
              type="email"
              placeholder="referencia@example.com"
              value={ref.email}
              onChange={(e) =>
                actualizar(ref.id, { email: e.target.value })
              }
            />
            <Input
              label="Telefono"
              type="tel"
              placeholder="+56 9 0000 0000"
              value={ref.telefono}
              onChange={(e) =>
                actualizar(ref.id, { telefono: e.target.value })
              }
            />
          </div>
          <Input
            label="Relacion"
            placeholder="Jefe directo, cliente, profesor guia..."
            value={ref.relacion}
            onChange={(e) =>
              actualizar(ref.id, { relacion: e.target.value })
            }
          />
        </EntradaRepetible>
      ))}
      <Button variant="secondary" size="sm" onClick={agregar}>
        <PlusIcon size={16} />
        Agregar referencia
      </Button>
    </SeccionFormulario>
  )
}
