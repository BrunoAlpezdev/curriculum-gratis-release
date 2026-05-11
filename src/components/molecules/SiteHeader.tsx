import Link from "next/link"
import { SparkleIcon } from "@phosphor-icons/react/dist/ssr"
import { Badge } from "@/components/atoms/Badge"
import { buttonVariants } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { AuthActions } from "@/components/molecules/AuthActions"
import { cn } from "@/components/ui/cn"

const NAV_LINKS = [
  { href: "/crear-cv-gratis", label: "Crear CV" },
  { href: "/plantillas-cv-gratis", label: "Plantillas" },
  { href: "/formato-cv-harvard", label: "Formato Harvard" },
  { href: "/cv-chile", label: "CV Chile" },
]

export function SiteHeader() {
  return (
    <Surface as="header" variant="toolbar" className="sticky top-0 z-40 border-b-2 border-border-strong">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-2" aria-label="Curriculum Gratis, inicio">
          <span className="flex size-9 shrink-0 items-center justify-center border-2 border-border-strong bg-action-primary text-action-primary-fg shadow-[3px_3px_0_var(--color-border-strong)] transition-transform group-hover:-translate-y-0.5">
            <SparkleIcon size={18} weight="fill" />
          </span>
          <span className="min-w-0">
            <Text as="span" variant="strong" className="block truncate text-sm font-extrabold leading-4 md:text-base">
              Curriculum Gratis
            </Text>
            <Text as="span" variant="caption" className="hidden leading-4 sm:block">
              CV, carta, ATS e IA opcional
            </Text>
          </span>
        </Link>

        <nav aria-label="Navegacion principal" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-semibold text-text-muted transition-colors hover:bg-panel-muted hover:text-text-main"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="neutral" className="hidden md:inline-flex">
            Sin registro
          </Badge>
          <div className="block">
            <AuthActions compact />
          </div>
          <Link href="/editor" className={cn(buttonVariants({ variant: "primary", size: "sm" }), "min-h-10") }>
            Crear CV
          </Link>
        </div>
      </div>
    </Surface>
  )
}
