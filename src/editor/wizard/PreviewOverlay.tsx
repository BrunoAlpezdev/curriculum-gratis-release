"use client"

import { XIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
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
  if (!abierto) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-app-bg md:hidden">
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
