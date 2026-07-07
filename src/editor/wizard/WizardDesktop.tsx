"use client"

import { Surface } from "@/components/atoms/Surface"
import { BarraProgreso } from "@/editor/wizard/BarraProgreso"
import { BarraNavegacionPasos } from "@/editor/wizard/BarraNavegacionPasos"
import { StepperIndice } from "@/editor/wizard/StepperIndice"
import { PasoLayout } from "@/editor/wizard/PasoLayout"
import { PasoRevision } from "@/editor/wizard/PasoRevision"
import { PanelVistaPrevia } from "@/editor/PanelVistaPrevia"
import { PanelVistaCarta } from "@/editor/PanelVistaCarta"
import type { Paso } from "@/editor/wizard/useEditorPasos"
import type { Modo } from "@/editor/Editor"

interface WizardDesktopProps {
  pasos: Paso[]
  actual: number
  modo: Modo
  onIr: (indice: number) => void
  onAnterior: () => void
  onSiguiente: () => void
}

export function WizardDesktop({ pasos, actual, modo, onIr, onAnterior, onSiguiente }: WizardDesktopProps) {
  const paso = pasos[actual]
  if (!paso) return null

  return (
    <div className="hidden h-full md:flex">
      {/* Índice lateral */}
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-border-subtle p-4">
        <div className="mb-4">
          <BarraProgreso actual={actual} total={pasos.length} />
        </div>
        <StepperIndice pasos={pasos} actual={actual} onIr={onIr} />
      </aside>

      {/* Formulario del paso */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* key remonta el contenedor al cambiar de paso, reseteando el scroll arriba */}
        <div key={paso.id} className="flex-1 overflow-y-auto px-8 py-6">
          <div className="mx-auto max-w-2xl">
            {paso.esRevision ? (
              <PasoRevision modo={modo} />
            ) : (
              <PasoLayout paso={paso}>{paso.Contenido && <paso.Contenido />}</PasoLayout>
            )}
          </div>
        </div>
        <Surface variant="toolbar" className="border-t border-b-0 px-8 py-4">
          <div className="mx-auto max-w-2xl">
            <BarraNavegacionPasos
              esPrimero={actual === 0}
              esUltimo={actual === pasos.length - 1}
              opcional={paso.opcional}
              onAnterior={onAnterior}
              onSiguiente={onSiguiente}
            />
          </div>
        </Surface>
      </main>

      {/* Vista previa en vivo */}
      <aside className="w-[42%] shrink-0 overflow-hidden border-l border-border-subtle">
        {modo === "carta" ? <PanelVistaCarta /> : <PanelVistaPrevia />}
      </aside>
    </div>
  )
}
