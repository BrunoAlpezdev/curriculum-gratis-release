"use client"

import { useState } from "react"
import { TrashIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { DialogoConfirmar } from "@/components/molecules/DialogoConfirmar"

interface EntradaRepetibleProps {
  onEliminar: () => void
  /** Si la entrada tiene contenido, pide confirmar antes de eliminar. */
  confirmarEliminar?: boolean
  children: React.ReactNode
}

export function EntradaRepetible({
  onEliminar,
  confirmarEliminar = false,
  children,
}: EntradaRepetibleProps) {
  const [confirmando, setConfirmando] = useState(false)

  return (
    <Surface variant="panelMuted" className="relative flex flex-col gap-3 p-4">
      <div className="absolute top-3 right-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (confirmarEliminar ? setConfirmando(true) : onEliminar())}
          aria-label="Eliminar entrada"
          className="size-7 text-text-muted hover:text-danger"
        >
          <TrashIcon size={16} />
        </Button>
      </div>
      {children}
      <DialogoConfirmar
        abierto={confirmando}
        titulo="Eliminar entrada"
        descripcion="Esta entrada tiene contenido y se eliminará definitivamente. ¿Continuar?"
        textoConfirmar="Eliminar"
        variante="peligro"
        onConfirmar={() => {
          onEliminar()
          setConfirmando(false)
        }}
        onCerrar={() => setConfirmando(false)}
      />
    </Surface>
  )
}
