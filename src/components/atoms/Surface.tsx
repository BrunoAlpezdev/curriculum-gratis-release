import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentPropsWithoutRef, ElementType } from "react"
import { cn } from "@/components/ui/cn"

const surfaceVariants = cva("", {
  variants: {
    variant: {
      page: "bg-app-bg text-text-main",
      panel: "border border-border-subtle bg-panel",
      panelMuted: "border border-border-subtle bg-panel-muted",
      card: "border border-border-subtle bg-panel",
      cardStrong: "border-2 border-border-strong bg-panel",
      cardOnPage: "border-2 border-border-strong bg-app-bg",
      interactiveCard: "border border-border-subtle bg-panel transition hover:border-action-primary hover:bg-action-soft",
      toolbar: "border-b border-border-subtle bg-panel",
      strip: "border-b border-border-subtle bg-panel",
      stripMuted: "border-b border-border-subtle bg-panel-muted",
      stripAccent: "border-b-4 border-action-primary bg-app-bg",
      hero: "border-b-4 border-action-primary bg-app-bg bg-[radial-gradient(circle_at_top_right,var(--color-action-soft),transparent_34rem)]",
      heroCard: "border-2 border-border-strong bg-panel shadow-[8px_8px_0_var(--color-border-strong)]",
      metricCard: "border border-border-subtle bg-panel-muted",
      notice: "border border-action-primary bg-action-soft text-text-main shadow-sm",
      popover: "border border-border-subtle bg-panel shadow-lg",
      overlay: "bg-text-main/65 backdrop-blur-sm",
      preview: "bg-panel-muted",
    },
  },
  defaultVariants: {
    variant: "panel",
  },
})

type SurfaceProps<T extends ElementType> = {
  as?: T
  className?: string
} & VariantProps<typeof surfaceVariants> &
  Omit<ComponentPropsWithoutRef<T>, "as" | "className">

export function Surface<T extends ElementType = "div">({
  as,
  variant,
  className,
  ...props
}: SurfaceProps<T>) {
  const Component = as ?? "div"
  return <Component className={cn(surfaceVariants({ variant }), className)} {...props} />
}

export { surfaceVariants }
