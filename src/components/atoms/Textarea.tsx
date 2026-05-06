import { useId } from "react"
import { cn } from "@/components/ui/cn"

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const autoId = useId()
  const textareaId = id ?? autoId

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={textareaId}
        className="text-sm font-semibold text-ds-ink-muted"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        className={cn(
          "min-h-[96px] border border-ds-line bg-ds-surface px-3 py-2 text-base text-ds-ink placeholder:text-ds-ink-muted/70 transition-colors focus:border-ds-accent focus:ring-1 focus:ring-ds-accent focus:outline-none resize-y",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
