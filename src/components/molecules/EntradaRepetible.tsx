import { TrashIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"

interface EntradaRepetibleProps {
  onEliminar: () => void
  children: React.ReactNode
}

export function EntradaRepetible({
  onEliminar,
  children,
}: EntradaRepetibleProps) {
  return (
    <Surface variant="panelMuted" className="relative flex flex-col gap-3 p-4">
      <div className="absolute top-3 right-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEliminar}
          aria-label="Eliminar entrada"
          className="size-7 text-text-muted hover:text-danger"
        >
          <TrashIcon size={16} />
        </Button>
      </div>
      {children}
    </Surface>
  )
}
