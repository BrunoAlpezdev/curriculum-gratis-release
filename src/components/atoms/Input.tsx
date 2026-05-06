import { useId } from "react"
import { cn } from "@/components/ui/cn"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-semibold text-ds-ink-muted">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "h-11 border border-ds-line bg-ds-surface px-3 text-base text-ds-ink placeholder:text-ds-ink-muted/70 transition-colors focus:border-ds-accent focus:ring-1 focus:ring-ds-accent focus:outline-none",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
