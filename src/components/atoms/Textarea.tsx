import { useId } from "react"
import { Text } from "@/components/atoms/Text"
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
      <Text
        as="label"
        htmlFor={textareaId}
        variant="label"
      >
        {label}
      </Text>
      <textarea
        id={textareaId}
        className={cn(
          "min-h-[96px] border border-border-subtle bg-panel px-3 py-2 text-base text-text-main placeholder:text-text-muted/70 transition-colors focus:border-action-primary focus:ring-1 focus:ring-action-primary focus:outline-none resize-y",
          error && "border-danger focus:border-danger focus:ring-danger",
          className,
        )}
        {...props}
      />
      {error && <Text variant="caption" className="text-danger">{error}</Text>}
    </div>
  )
}
