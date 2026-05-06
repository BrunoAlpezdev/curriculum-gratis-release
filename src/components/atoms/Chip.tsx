import { XIcon } from "@phosphor-icons/react"
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
        "inline-flex items-center gap-1 border border-ds-line bg-ds-surface-muted px-3 py-1 text-sm text-ds-ink",
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 p-0.5 text-ds-ink-muted hover:bg-ds-surface hover:text-ds-ink transition-colors cursor-pointer"
          aria-label="Eliminar"
        >
          <XIcon size={14} weight="bold" />
        </button>
      )}
    </span>
  )
}
