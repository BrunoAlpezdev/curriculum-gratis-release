"use client"

import { Badge } from "@/components/atoms/Badge"
import { Text } from "@/components/atoms/Text"
import { Consejos } from "@/editor/wizard/Consejos"
import type { Paso } from "@/editor/wizard/useEditorPasos"

/**
 * Encabezado y contenedor de un paso. Reemplaza el chrome de acordeón: título
 * grande, una sola línea de ayuda y consejos opcionales bajo demanda.
 */
export function PasoLayout({ paso, children }: { paso: Paso; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-action-soft text-action-strong">
            {paso.icono}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Text as="h2" variant="strong" className="text-xl font-extrabold">
                {paso.titulo}
              </Text>
              {paso.opcional && <Badge variant="neutral">Opcional</Badge>}
            </div>
            <Text variant="small" className="leading-snug">{paso.descripcion}</Text>
          </div>
        </div>
        {paso.consejos.length > 0 && <Consejos consejos={paso.consejos} />}
      </header>

      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}
