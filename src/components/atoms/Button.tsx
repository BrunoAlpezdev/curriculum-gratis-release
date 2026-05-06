import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/components/ui/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-ds-accent text-ds-surface hover:bg-ds-accent-strong focus-visible:outline-ds-accent",
        secondary: "border border-ds-line bg-ds-surface text-ds-ink hover:bg-ds-surface-muted focus-visible:outline-ds-line-strong",
        ghost: "text-ds-ink-muted hover:bg-ds-surface-muted hover:text-ds-ink focus-visible:outline-ds-line-strong",
        danger: "bg-red-700 text-ds-surface hover:bg-red-800 focus-visible:outline-red-700",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-13 px-6 text-base",
        icon: "h-9 w-9",
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
