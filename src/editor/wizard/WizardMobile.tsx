"use client"

import { useState } from "react"
import { ListNumbersIcon, EyeIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { BarraProgreso } from "@/editor/wizard/BarraProgreso"
import { BarraNavegacionPasos } from "@/editor/wizard/BarraNavegacionPasos"
import { PasoLayout } from "@/editor/wizard/PasoLayout"
import { PasoRevision } from "@/editor/wizard/PasoRevision"
import { SheetIndice } from "@/editor/wizard/SheetIndice"
import { PreviewOverlay } from "@/editor/wizard/PreviewOverlay"
import type { Paso } from "@/editor/wizard/useEditorPasos"
import type { Modo } from "@/editor/Editor"

interface WizardMobileProps {
  pasos: Paso[]
  actual: number
  modo: Modo
  onIr: (indice: number) => void
  onAnterior: () => void
  onSiguiente: () => void
}

export function WizardMobile({ pasos, actual, modo, onIr, onAnterior, onSiguiente }: WizardMobileProps) {
  const [indiceAbierto, setIndiceAbierto] = useState(false)
  const [previewAbierto, setPreviewAbierto] = useState(false)
  const paso = pasos[actual]
  if (!paso) return null

  return (
    <div className="flex h-full flex-col md:hidden">
      {/* Encabezado fijo: progreso + accesos rápidos */}
      <Surface variant="strip" className="flex flex-col gap-3 px-4 py-3">
        <BarraProgreso actual={actual} total={pasos.length} />
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => setIndiceAbierto(true)}>
            <ListNumbersIcon size={16} />
            Ir a un paso
          </Button>
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => setPreviewAbierto(true)}>
            <EyeIcon size={16} />
            {modo === "carta" ? "Ver carta" : "Ver CV"}
          </Button>
        </div>
      </Surface>

      {/* Contenido del paso */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {paso.esRevision ? (
          <PasoRevision modo={modo} />
        ) : (
          <PasoLayout paso={paso}>{paso.Contenido && <paso.Contenido />}</PasoLayout>
        )}
      </div>

      {/* Navegación fija inferior */}
      <Surface variant="toolbar" className="border-t border-b-0 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <BarraNavegacionPasos
          esPrimero={actual === 0}
          esUltimo={actual === pasos.length - 1}
          opcional={paso.opcional}
          onAnterior={onAnterior}
          onSiguiente={onSiguiente}
        />
      </Surface>

      <SheetIndice
        abierto={indiceAbierto}
        pasos={pasos}
        actual={actual}
        onIr={onIr}
        onCerrar={() => setIndiceAbierto(false)}
      />
      <PreviewOverlay abierto={previewAbierto} modo={modo} onCerrar={() => setPreviewAbierto(false)} />
    </div>
  )
}
