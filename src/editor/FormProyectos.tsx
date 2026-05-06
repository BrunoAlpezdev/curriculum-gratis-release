"use client"

import { CodeIcon, PlusIcon } from "@phosphor-icons/react"
import { Input } from "@/components/atoms/Input"
import { Textarea } from "@/components/atoms/Textarea"
import { Button } from "@/components/atoms/Button"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { EntradaRepetible } from "@/components/molecules/EntradaRepetible"
import { useCurriculumStore } from "@/lib/store"

export function FormProyectos() {
  const proyectos = useCurriculumStore((s) => s.datos.proyectos)
  const agregar = useCurriculumStore((s) => s.agregarProyecto)
  const actualizar = useCurriculumStore((s) => s.actualizarProyecto)
  const eliminar = useCurriculumStore((s) => s.eliminarProyecto)

  return (
    <SeccionFormulario
      titulo="Proyectos"
      icono={<CodeIcon size={18} />}
      defaultAbierta={false}
      tip={[
        "Perfectos si tienes poca experiencia laboral — proyectos personales, de bootcamp o freelance muestran lo que puedes hacer.",
        "Incluye siempre el enlace: GitHub, Vercel, tienda de apps, o el sitio en vivo. Un proyecto sin link pierde la mitad del impacto.",
        "Tecnologías separadas por coma (ej: 'React, Node.js, PostgreSQL'). Pon primero las más relevantes al puesto.",
        "2-4 proyectos bien descritos rinden más que 10 proyectos genéricos tipo 'TODO list'.",
      ]}
    >
      {proyectos.map((proyecto) => (
        <EntradaRepetible
          key={proyecto.id}
          onEliminar={() => eliminar(proyecto.id)}
        >
          <Input
            label="Nombre del proyecto"
            placeholder="App de gestion de inventario"
            value={proyecto.nombre}
            onChange={(e) => actualizar(proyecto.id, { nombre: e.target.value })}
          />
          <Input
            label="Enlace"
            placeholder="github.com/usuario/proyecto"
            value={proyecto.url}
            onChange={(e) => actualizar(proyecto.id, { url: e.target.value })}
          />
          <Input
            label="Tecnologias"
            placeholder="React, Node.js, PostgreSQL"
            value={proyecto.tecnologias}
            onChange={(e) =>
              actualizar(proyecto.id, { tecnologias: e.target.value })
            }
          />
          <Textarea
            label="Descripcion"
            placeholder="Que hace, que problema resuelve, tu rol..."
            value={proyecto.descripcion}
            onChange={(e) =>
              actualizar(proyecto.id, { descripcion: e.target.value })
            }
            rows={2}
          />
        </EntradaRepetible>
      ))}
      <Button variant="secondary" size="sm" onClick={agregar}>
        <PlusIcon size={16} />
        Agregar proyecto
      </Button>
    </SeccionFormulario>
  )
}
