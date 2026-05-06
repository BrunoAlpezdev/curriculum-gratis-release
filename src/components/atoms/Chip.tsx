import { XIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { cn } from "@/components/ui/cn"

interface ChipProps {
  children: React.ReactNode
  onRemove?: () => void
  className?: string
}

export function Chip({ children, onRemove, className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border border-border-subtle bg-panel-muted px-3 py-1 text-sm text-text-main",
        className,
      )}
    >
      {children}
      {onRemove && (
        <Button
          type="button"
          onClick={onRemove}
          variant="iconSubtle"
          size="none"
          className="ml-0.5 p-0.5"
          aria-label="Eliminar"
        >
          <XIcon size={14} weight="bold" />
        </Button>
      )}
    </span>
  )
}
