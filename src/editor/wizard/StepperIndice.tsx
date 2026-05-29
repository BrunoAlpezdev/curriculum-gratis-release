"use client"

import { CheckIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Text } from "@/components/atoms/Text"
import { cn } from "@/components/ui/cn"
import type { Paso } from "@/editor/wizard/useEditorPasos"

interface StepperIndiceProps {
  pasos: Paso[]
  actual: number
  onIr: (indice: number) => void
}

/**
 * Índice vertical para escritorio: salta a cualquier paso y muestra el progreso
 * (check en los completados, resaltado en el actual).
 */
export function StepperIndice({ pasos, actual, onIr }: StepperIndiceProps) {
  return (
    <nav aria-label="Pasos del editor" className="flex flex-col gap-1">
      {pasos.map((paso, i) => {
        const activo = i === actual
        const completo = paso.completo && !activo
        return (
          <Button
            key={paso.id}
            type="button"
            variant="plain"
            size="none"
            onClick={() => onIr(i)}
            aria-current={activo ? "step" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
              activo ? "bg-action-soft" : "hover:bg-panel-muted",
            )}
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                activo
                  ? "border-action-primary bg-action-primary text-action-primary-fg"
                  : completo
                    ? "border-success bg-success-soft text-success"
                    : "border-border-strong text-text-muted",
              )}
            >
              {completo ? <CheckIcon size={14} weight="bold" /> : i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <Text
                as="span"
                variant="strong"
                className={cn("block text-sm", activo ? "text-action-strong" : "text-text-main")}
              >
                {paso.titulo}
              </Text>
              {paso.opcional && (
                <Text as="span" variant="caption">Opcional</Text>
              )}
            </span>
          </Button>
        )
      })}
    </nav>
  )
}
