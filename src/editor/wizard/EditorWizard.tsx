"use client"

import { FileTextIcon, EnvelopeIcon } from "@phosphor-icons/react"
import { BarraAcciones } from "@/editor/BarraAcciones"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { useHidratado } from "@/lib/useHidratado"
import { useEsEscritorio } from "@/editor/wizard/useEsEscritorio"
import { useEditorPasos } from "@/editor/wizard/useEditorPasos"
import { usePasoPersistido } from "@/editor/wizard/usePasoPersistido"
import { WizardMobile } from "@/editor/wizard/WizardMobile"
import { WizardDesktop } from "@/editor/wizard/WizardDesktop"

export function EditorWizard() {
  const { modo, actual: actualCrudo, setActual, cambiarModo } = usePasoPersistido()
  const hidratado = useHidratado()
  const esEscritorio = useEsEscritorio()
  const pasos = useEditorPasos(modo)
  const maxIndice = Math.max(0, pasos.length - 1)
  const actual = Math.min(actualCrudo, maxIndice)

  function irA(indice: number) {
    setActual(Math.max(0, Math.min(indice, maxIndice)))
  }
  function siguiente() {
    setActual(Math.min(actual + 1, maxIndice))
  }
  function anterior() {
    setActual(Math.max(actual - 1, 0))
  }

  if (!hidratado) {
    return (
      <Surface variant="page" className="flex h-screen items-center justify-center">
        <Text variant="small">Cargando...</Text>
      </Surface>
    )
  }

  return (
    <Surface variant="page" className="flex h-dvh flex-col">
      <BarraAcciones modo={modo} />

      {/* Toggle CV / Carta */}
      <Surface
        variant="stripMuted"
        data-no-print
        className="flex items-center justify-center gap-1 p-2"
        aria-label="Tipo de documento"
      >
        <Button
          type="button"
          onClick={() => cambiarModo("cv")}
          aria-pressed={modo === "cv"}
          variant={modo === "cv" ? "segmentedActive" : "segmented"}
          size="sm"
          className="min-h-10"
        >
          <FileTextIcon size={14} />
          Curriculum
        </Button>
        <Button
          type="button"
          onClick={() => cambiarModo("carta")}
          aria-pressed={modo === "carta"}
          variant={modo === "carta" ? "segmentedActive" : "segmented"}
          size="sm"
          className="min-h-10"
        >
          <EnvelopeIcon size={14} />
          Carta de presentación
        </Button>
      </Surface>

      {/* Recorrido: shell dedicado según viewport */}
      <div className="flex-1 overflow-hidden">
        {esEscritorio ? (
          <WizardDesktop
            pasos={pasos}
            actual={actual}
            modo={modo}
            onIr={irA}
            onAnterior={anterior}
            onSiguiente={siguiente}
          />
        ) : (
          <WizardMobile
            pasos={pasos}
            actual={actual}
            modo={modo}
            onIr={irA}
            onAnterior={anterior}
            onSiguiente={siguiente}
          />
        )}
      </div>
    </Surface>
  )
}
