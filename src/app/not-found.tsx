import Link from "next/link"
import {
  ArrowRightIcon,
  CompassIcon,
  HouseIcon,
} from "@phosphor-icons/react/dist/ssr"
import { Badge } from "@/components/atoms/Badge"
import { buttonVariants } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { SiteFooter } from "@/components/molecules/SiteFooter"
import { SiteHeader } from "@/components/molecules/SiteHeader"
import { cn } from "@/components/ui/cn"

const ENLACES_UTILES = [
  {
    href: "/crear-cv-gratis",
    title: "Crear CV gratis",
    text: "Completa tus datos y descarga tu curriculum en PDF sin registro.",
  },
  {
    href: "/plantillas-cv-gratis",
    title: "Plantillas de CV",
    text: "Clasica, moderna, colorida o minimalista — todas personalizables.",
  },
  {
    href: "/formato-cv-harvard",
    title: "Formato Harvard",
    text: "Un curriculum sobrio y claro, ideal para procesos exigentes.",
  },
  {
    href: "/cv-chile",
    title: "CV para Chile 2026",
    text: "Arma un CV pensado para postulaciones laborales en Chile.",
  },
]

export default function NotFound() {
  return (
    <Surface variant="page" className="flex min-h-screen flex-col">
      <SiteHeader />

      <Surface
        as="main"
        variant="hero"
        className="flex flex-1 items-center px-4 py-16 md:px-6 md:py-24"
      >
        <div className="mx-auto w-full max-w-4xl">
          <div className="flex flex-col items-center text-center">
            <Badge variant="accent" size="md" className="mb-6">
              Error 404
            </Badge>

            <div className="inline-flex items-center justify-center border-2 border-border-strong bg-panel px-8 py-4 shadow-[8px_8px_0_var(--color-border-strong)]">
              <span className="text-7xl font-extrabold leading-none tracking-tight text-action-strong md:text-8xl">
                404
              </span>
            </div>

            <Text as="h1" variant="sectionTitle" className="mt-10">
              Esta pagina no existe
            </Text>
            <Text variant="bodyLarge" className="mt-4 max-w-xl">
              Puede que el enlace este roto o que la pagina se haya movido. Pero
              tu CV te espera: parte gratis, sin registro y descarga en PDF.
            </Text>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "min-h-14 text-base")}
              >
                <HouseIcon size={18} weight="fill" />
                Volver al inicio
              </Link>
              <Link
                href="/editor"
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "min-h-14 border-2 text-base")}
              >
                Crear mi CV gratis
              </Link>
            </div>
          </div>

          <div className="mt-14">
            <div className="flex items-center gap-2">
              <CompassIcon size={18} weight="fill" className="text-action-primary" />
              <Text as="h2" variant="eyebrow">
                Quizas buscabas
              </Text>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {ENLACES_UTILES.map((enlace) => (
                <Surface
                  as={Link}
                  key={enlace.href}
                  href={enlace.href}
                  variant="interactiveCard"
                  className="group block p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Text as="h3" variant="cardTitle">
                      {enlace.title}
                    </Text>
                    <ArrowRightIcon
                      size={16}
                      className="shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-action-primary"
                    />
                  </div>
                  <Text variant="small" className="mt-2 leading-6">
                    {enlace.text}
                  </Text>
                </Surface>
              ))}
            </div>
          </div>
        </div>
      </Surface>

      <SiteFooter />
    </Surface>
  )
}
