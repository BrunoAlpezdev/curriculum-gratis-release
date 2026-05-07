import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/components/ui/cn"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-action-primary text-action-primary-fg hover:bg-action-primary-hover focus-visible:outline-action-primary",
        secondary: "border border-border-subtle bg-panel text-text-main hover:bg-panel-muted focus-visible:outline-border-strong",
        ghost: "text-text-muted hover:bg-panel-muted hover:text-text-main focus-visible:outline-border-strong",
        danger: "bg-danger text-action-primary-fg hover:bg-danger-hover focus-visible:outline-danger",
        menu: "w-full justify-start text-text-muted hover:bg-panel-muted hover:text-text-main focus-visible:outline-border-strong",
        segmented: "text-text-muted hover:bg-panel hover:text-text-main focus-visible:outline-border-strong",
        segmentedActive: "bg-action-primary text-action-primary-fg focus-visible:outline-action-primary",
        tab: "text-text-muted hover:text-text-main focus-visible:outline-border-strong",
        tabActive: "border-b-2 border-action-primary text-action-strong focus-visible:outline-action-primary",
        choice: "border border-border-subtle bg-panel text-left text-text-main hover:border-border-strong focus-visible:outline-border-strong",
        choiceActive: "border border-action-primary bg-action-soft text-left text-text-main ring-1 ring-action-primary focus-visible:outline-action-primary",
        iconSubtle: "text-text-muted hover:bg-panel-muted hover:text-text-main focus-visible:outline-border-strong",
        plain: "focus-visible:outline-border-strong",
      },
      size: {
        none: "",
        xs: "h-8 px-2 text-xs",
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-13 px-6 text-base",
        icon: "h-9 w-9",
        iconSm: "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  ref?: React.Ref<HTMLButtonElement>
}

export function Button({ className, variant, size, ref, ...props }: ButtonProps) {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
