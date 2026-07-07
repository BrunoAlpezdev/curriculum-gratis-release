"use client"

import { XIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { cn } from "@/components/ui/cn"
import { PanelVistaPrevia } from "@/editor/PanelVistaPrevia"
import { PanelVistaCarta } from "@/editor/PanelVistaCarta"
import type { Modo } from "@/editor/Editor"

interface PreviewOverlayProps {
  abierto: boolean
  modo: Modo
  onCerrar: () => void
}

/** Vista previa a pantalla completa para mobile, donde no hay panel lateral. */
export function PreviewOverlay({ abierto, modo, onCerrar }: PreviewOverlayProps) {
  /* Siempre montado en mobile (solo alterna visibilidad) para que #curriculum-pdf
     exista aunque el overlay esté cerrado: crearPdfVisual lo busca por id y sin
     esto la descarga de plantillas visuales fallaría en mobile. */
  return (
    <div className={cn("fixed inset-0 z-50 flex flex-col bg-app-bg md:hidden", !abierto && "invisible pointer-events-none")}>
      <Surface variant="toolbar" className="flex items-center justify-between px-4 py-3">
        <Text as="h2" variant="strong" className="text-base font-extrabold">
          {modo === "carta" ? "Vista previa de la carta" : "Vista previa del CV"}
        </Text>
        <Button variant="ghost" size="icon" onClick={onCerrar} aria-label="Cerrar vista previa">
          <XIcon size={18} />
        </Button>
      </Surface>
      <div className="flex-1 overflow-hidden">
        {modo === "carta" ? <PanelVistaCarta /> : <PanelVistaPrevia />}
      </div>
    </div>
  )
}
