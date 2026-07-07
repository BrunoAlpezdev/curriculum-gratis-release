"use client"

import { useEffect, useEffectEvent, useRef } from "react"
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
  const cerrar = useEffectEvent(onCerrar)
  const botonCerrarRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<Element | null>(null)

  /* NO usamos <dialog> aqui a proposito: crearPdfVisual (generar-pdf.ts) busca
     #curriculum-pdf en el DOM y lo mide, asi que el contenedor debe seguir
     montado y medible aunque el overlay este cerrado (por eso el truco
     "invisible"). Un <dialog> cerrado es display:none y romperia la descarga
     multipagina en mobile. Reponemos a mano ESC + foco de entrada/salida. */
  useEffect(() => {
    if (!abierto) return
    triggerRef.current = document.activeElement
    botonCerrarRef.current?.focus()
    function alTecla(e: KeyboardEvent) {
      if (e.key === "Escape") cerrar()
    }
    document.addEventListener("keydown", alTecla)
    return () => {
      document.removeEventListener("keydown", alTecla)
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus()
    }
  }, [abierto])

  return (
    <div
      role={abierto ? "dialog" : undefined}
      aria-modal={abierto ? true : undefined}
      aria-label={modo === "carta" ? "Vista previa de la carta" : "Vista previa del CV"}
      className={cn("fixed inset-0 z-50 flex flex-col bg-app-bg md:hidden", !abierto && "invisible pointer-events-none")}
    >
      <Surface variant="toolbar" className="flex items-center justify-between px-4 py-3">
        <Text as="h2" variant="strong" className="text-base font-extrabold">
          {modo === "carta" ? "Vista previa de la carta" : "Vista previa del CV"}
        </Text>
        <Button ref={botonCerrarRef} variant="ghost" size="icon" onClick={onCerrar} aria-label="Cerrar vista previa">
          <XIcon size={18} />
        </Button>
      </Surface>
      <div className="flex-1 overflow-hidden">
        {modo === "carta" ? <PanelVistaCarta /> : <PanelVistaPrevia />}
      </div>
    </div>
  )
}
