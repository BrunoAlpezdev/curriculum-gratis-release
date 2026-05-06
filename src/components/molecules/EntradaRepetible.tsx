import { TrashIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"

interface EntradaRepetibleProps {
  onEliminar: () => void
  children: React.ReactNode
}

export function EntradaRepetible({
  onEliminar,
  children,
}: EntradaRepetibleProps) {
  return (
    <div className="relative border border-ds-line bg-ds-surface-muted p-4 flex flex-col gap-3">
      <div className="absolute top-3 right-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEliminar}
          aria-label="Eliminar entrada"
          className="h-7 w-7 text-ds-ink-muted hover:text-red-700"
        >
          <TrashIcon size={16} />
        </Button>
      </div>
      {children}
    </div>
  )
}
