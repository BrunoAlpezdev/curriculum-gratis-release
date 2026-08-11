"use client"

import { PlusIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { Textarea } from "@/components/atoms/Textarea"
import { EntradaRepetible } from "@/components/molecules/EntradaRepetible"
import { useCurriculumStore } from "@/lib/store"

export const CONSEJOS_SECCIONES_DESTACADAS = [
  "Usa esta sección para información que quieras destacar sin encajarla en una categoría fija: licencias, maquinaria, certificaciones, logros u otros datos relevantes.",
  "Escribe un ítem por línea. Mantén cada línea breve y concreta para que sea fácil de escanear.",
  "El título es obligatorio. Si una sección ya no aplica, elimínala para que no aparezca en el CV.",
]

export function CamposSeccionesDestacadas() {
  const secciones = useCurriculumStore((s) => s.datos.seccionesDestacadas)
  const agregar = useCurriculumStore((s) => s.agregarSeccionDestacada)
  const actualizar = useCurriculumStore((s) => s.actualizarSeccionDestacada)
  const eliminar = useCurriculumStore((s) => s.eliminarSeccionDestacada)

  return (
    <div className="flex flex-col gap-4">
      {secciones.length === 0 ? (
        <Surface variant="notice" className="flex flex-col gap-1.5 p-3">
          <Text variant="strong" className="text-sm">Todavía no tienes secciones destacadas</Text>
          <Text variant="small">
            Agrega una para mostrar información adicional con un título y una lista de ítems.
          </Text>
        </Surface>
      ) : (
        <div className="flex flex-col gap-3">
          {secciones.map((seccion, index) => {
            const tituloVacio = seccion.titulo.trim().length === 0
            const tieneContenido = !tituloVacio || seccion.items.some((item) => item.trim().length > 0)

            return (
              <EntradaRepetible
                key={seccion.id}
                confirmarEliminar={tieneContenido}
                onEliminar={() => eliminar(seccion.id)}
              >
                <Text as="h4" variant="strong" className="pr-8 text-sm">
                  Sección {index + 1}
                </Text>
                <Input
                  label="Título de la sección"
                  value={seccion.titulo}
                  required
                  error={tituloVacio ? "El título es obligatorio." : undefined}
                  onChange={(e) => actualizar(seccion.id, { titulo: e.target.value })}
                />
                <Textarea
                  label="Ítems"
                  value={seccion.items.join("\n")}
                  hint="Un ítem por línea. Las líneas vacías no se muestran en el CV."
                  rows={5}
                  onChange={(e) => actualizar(seccion.id, { items: e.target.value.split(/\r?\n/) })}
                />
              </EntradaRepetible>
            )
          })}
        </div>
      )}
      <Button type="button" variant="secondary" size="sm" onClick={agregar} className="self-start">
        <PlusIcon size={16} />
        Agregar sección destacada
      </Button>
    </div>
  )
}
