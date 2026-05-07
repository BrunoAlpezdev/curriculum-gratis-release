import { useId } from "react"
import { Text } from "@/components/atoms/Text"
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
      <Text as="label" htmlFor={selectId} variant="label">
        {label}
      </Text>
      <select
        id={selectId}
        className={cn(
          "h-11 border border-border-subtle bg-panel px-3 text-base text-text-main transition-colors focus:border-action-primary focus:ring-1 focus:ring-action-primary focus:outline-none",
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
