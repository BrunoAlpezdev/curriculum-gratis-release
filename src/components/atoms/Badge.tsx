import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentPropsWithoutRef } from "react"
import { cn } from "@/components/ui/cn"

const badgeVariants = cva("inline-flex items-center gap-1 font-bold leading-none", {
  variants: {
    variant: {
      accent: "border border-action-primary bg-panel text-action-strong",
      neutral: "bg-panel-muted text-action-strong",
      danger: "border border-danger-line bg-danger-soft text-danger-text",
      success: "border border-success-line bg-success-soft text-success-text",
      solid: "bg-action-primary text-action-primary-fg",
    },
    size: {
      sm: "px-2 py-0.5 text-[11px]",
      md: "px-3 py-1 text-sm",
      square: "h-10 w-10 justify-center text-lg",
    },
  },
  defaultVariants: {
    variant: "neutral",
    size: "sm",
  },
})

interface BadgeProps
  extends ComponentPropsWithoutRef<"span">,
    VariantProps<typeof badgeVariants> {}

export function Badge({ variant, size, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { badgeVariants }
