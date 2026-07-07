"use client"

import { useState } from "react"
import { CaretDownIcon, PaletteIcon, ListChecksIcon, TargetIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { cn } from "@/components/ui/cn"
import { CamposPersonalizacion } from "@/editor/campos/CamposPersonalizacion"
import { CamposCalidadCv } from "@/editor/campos/CamposCalidadCv"
import { CamposAnalisisAts } from "@/editor/campos/CamposAnalisisAts"
import { BotonDescargar } from "@/editor/wizard/BotonDescargar"
import type { Modo } from "@/editor/Editor"

function BloqueColapsable({
  titulo,
  icono,
  children,
  defaultAbierto = false,
}: {
  titulo: string
  icono: React.ReactNode
  children: React.ReactNode
  defaultAbierto?: boolean
}) {
  const [abierto, setAbierto] = useState(defaultAbierto)
  return (
    <Surface variant="panel" className="overflow-hidden">
      <Button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        variant="plain"
        size="none"
        className="flex w-full items-center justify-between p-4"
        aria-expanded={abierto}
      >
        <div className="flex items-center gap-2">
          <span className="text-action-strong">{icono}</span>
          <Text as="h3" variant="strong" className="text-base font-extrabold">{titulo}</Text>
        </div>
        <CaretDownIcon
          size={16}
          className={cn("text-text-muted transition-transform duration-200", abierto && "rotate-180")}
        />
      </Button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-in-out",
          abierto ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-4 border-t border-border-subtle p-4">{children}</div>
        </div>
      </div>
    </Surface>
  )
}

export function PasoRevision({ modo }: { modo: Modo }) {
  return (
    <div className="flex flex-col gap-4">
      <Surface variant="notice" className="px-4 py-3">
        <Text variant="small" className="leading-relaxed">
          Último paso. Elige el diseño, revisa que esté todo en orden y descarga tu{" "}
          {modo === "carta" ? "carta" : "CV"} en PDF.
        </Text>
      </Surface>

      <BloqueColapsable titulo="Diseño" icono={<PaletteIcon size={18} />} defaultAbierto>
        <CamposPersonalizacion modo={modo} />
      </BloqueColapsable>

      {modo === "cv" && (
        <>
          <BloqueColapsable titulo="¿Está listo?" icono={<ListChecksIcon size={18} />}>
            <CamposCalidadCv />
          </BloqueColapsable>

          <BloqueColapsable titulo="Análisis ATS vs oferta (opcional)" icono={<TargetIcon size={18} />}>
            <CamposAnalisisAts />
          </BloqueColapsable>
        </>
      )}

      <div className="flex flex-col items-center gap-2 pt-2">
        <BotonDescargar modo={modo} className="w-full max-w-sm" />
        <Text variant="caption" className="text-center">
          Se genera en tu navegador. Gratis y sin marca de agua.
        </Text>
      </div>
    </div>
  )
}
