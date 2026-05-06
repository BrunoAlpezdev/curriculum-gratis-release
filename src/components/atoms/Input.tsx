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
      <label htmlFor={inputId} className="text-sm font-semibold text-text-muted">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "h-11 border border-border-subtle bg-panel px-3 text-base text-text-main placeholder:text-text-muted/70 transition-colors focus:border-action-primary focus:ring-1 focus:ring-action-primary focus:outline-none",
          error && "border-danger focus:border-danger focus:ring-danger",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
