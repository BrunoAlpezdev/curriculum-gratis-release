import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentPropsWithoutRef, ElementType } from "react"
import { cn } from "@/components/ui/cn"

const textVariants = cva("", {
  variants: {
    variant: {
      hero: "text-4xl font-extrabold leading-[1.04] tracking-tight text-text-main md:text-6xl",
      pageTitle: "text-4xl font-extrabold leading-[1.06] tracking-tight text-text-main md:text-6xl",
      sectionTitle: "text-3xl font-extrabold tracking-tight text-text-main md:text-4xl",
      panelTitle: "text-2xl font-extrabold text-text-main",
      cardTitle: "text-lg font-extrabold text-text-main",
      body: "text-base leading-7 text-text-muted",
      bodyLarge: "text-lg leading-8 text-text-muted",
      label: "text-sm font-semibold text-text-muted",
      eyebrow: "text-sm font-bold uppercase tracking-[0.08em] text-action-strong",
      caption: "text-xs text-text-muted",
      small: "text-sm text-text-muted",
      strong: "font-semibold text-text-main",
    },
  },
  defaultVariants: {
    variant: "body",
  },
})

type TextProps<T extends ElementType> = {
  as?: T
  className?: string
} & VariantProps<typeof textVariants> &
  Omit<ComponentPropsWithoutRef<T>, "as" | "className">

export function Text<T extends ElementType = "p">({
  as,
  variant,
  className,
  ...props
}: TextProps<T>) {
  const Component = as ?? "p"
  return <Component className={cn(textVariants({ variant }), className)} {...props} />
}

export { textVariants }
