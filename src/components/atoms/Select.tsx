import { useId } from "react"
import { cn } from "@/components/ui/cn"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  opciones: { valor: string; etiqueta: string }[]
}

export function Select({
  label,
  opciones,
  className,
  id,
  ...props
}: SelectProps) {
  const autoId = useId()
  const selectId = id ?? autoId

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-semibold text-ds-ink-muted">
        {label}
      </label>
      <select
        id={selectId}
        className={cn(
          "h-11 border border-ds-line bg-ds-surface px-3 text-base text-ds-ink transition-colors focus:border-ds-accent focus:ring-1 focus:ring-ds-accent focus:outline-none",
          className,
        )}
        {...props}
      >
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.etiqueta}
          </option>
        ))}
      </select>
    </div>
  )
}
