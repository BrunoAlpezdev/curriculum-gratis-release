import Link from "next/link"
import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react/dist/ssr"
import { Badge } from "@/components/atoms/Badge"
import { buttonVariants } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { cn } from "@/components/ui/cn"
import type { PlantillaId } from "@/types"

const TEMPLATE_DETAILS: Record<
  PlantillaId,
  {
    uso: string
    tono: string
    lineas: string[]
    preview: "classic" | "minimal" | "modern" | "color"
  }
> = {
  clasico: {
    uso: "Procesos tradicionales, postulaciones corporativas y formato Harvard.",
    tono: "Sobria y directa",
    lineas: ["Encabezado centrado", "Secciones limpias", "Texto nativo en PDF"],
    preview: "classic",
  },
  minimalista: {
    uso: "CVs claros, elegantes y compatibles con filtros ATS.",
    tono: "Ligera y ordenada",
    lineas: ["Mucho aire", "Jerarquia simple", "Texto nativo en PDF"],
    preview: "minimal",
  },
  moderno: {
    uso: "Perfiles tech, operaciones, ventas o roles donde conviene destacar competencias.",
    tono: "Visual con sidebar",
    lineas: ["Barra lateral", "Iconos de contacto", "Color protagonista"],
    preview: "modern",
  },
  colorido: {
    uso: "Perfiles creativos, comerciales o postulaciones donde importa diferenciarse.",
    tono: "Expresiva y memorable",
    lineas: ["Header fuerte", "Formas visuales", "Impacto rapido"],
    preview: "color",
  },
}

function TemplatePreview({ variant }: { variant: "classic" | "minimal" | "modern" | "color" }) {
  if (variant === "modern") {
    return (
      <div className="flex h-44 overflow-hidden border-2 border-border-strong bg-white">
        <div className="w-1/3 bg-action-primary p-3">
          <div className="h-9 w-9 rounded-full bg-white/90" />
          <div className="mt-5 space-y-1.5">
            <div className="h-1.5 w-16 bg-white/80" />
            <div className="h-1.5 w-12 bg-white/60" />
            <div className="h-1.5 w-14 bg-white/60" />
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="h-3 w-28 bg-zinc-800" />
          <div className="mt-2 h-1.5 w-20 bg-zinc-300" />
          <div className="mt-5 space-y-2">
            <div className="h-2 w-full bg-zinc-200" />
            <div className="h-2 w-10/12 bg-zinc-200" />
            <div className="h-2 w-11/12 bg-zinc-200" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === "color") {
    return (
      <div className="h-44 overflow-hidden border-2 border-border-strong bg-white p-4">
        <div className="-mx-4 -mt-4 h-16 bg-action-primary" />
        <div className="relative -mt-7 h-12 w-12 rounded-full border-4 border-white bg-action-soft" />
        <div className="mt-3 h-3 w-32 bg-zinc-800" />
        <div className="mt-2 h-1.5 w-24 bg-zinc-300" />
        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="h-2 bg-zinc-200" />
          <div className="h-2 bg-zinc-200" />
          <div className="h-2 bg-zinc-200" />
          <div className="h-2 bg-zinc-200" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-44 border-2 border-border-strong bg-white p-4">
      <div className={cn("mx-auto h-3 bg-zinc-800", variant === "classic" ? "w-36" : "w-28")} />
      <div className="mx-auto mt-2 h-1.5 w-24 bg-zinc-300" />
      <div className="mt-5 border-t-2 border-action-primary pt-3" />
      <div className="space-y-2">
        <div className="h-2 w-full bg-zinc-200" />
        <div className="h-2 w-11/12 bg-zinc-200" />
        <div className="h-2 w-9/12 bg-zinc-200" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-2 w-full bg-zinc-200" />
        <div className="h-2 w-10/12 bg-zinc-200" />
      </div>
    </div>
  )
}

interface TemplateOptionCardProps {
  id: PlantillaId
  nombre: string
  descripcion: string
  ats: boolean
}

export function TemplateOptionCard({ id, nombre, descripcion, ats }: TemplateOptionCardProps) {
  const details = TEMPLATE_DETAILS[id]

  return (
    <Surface as="article" variant="heroCard" className="grid gap-4 p-4 md:grid-cols-[220px_1fr]">
      <TemplatePreview variant={details.preview} />
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Text as="h2" variant="panelTitle" className="text-2xl">
              {nombre}
            </Text>
            {ats && <Badge variant="success">ATS</Badge>}
          </div>
          <Text variant="small" className="mt-1 font-semibold text-action-strong">
            {details.tono}
          </Text>
          <Text className="mt-3 leading-7">
            {details.uso}
          </Text>
          <Text variant="small" className="mt-2 leading-6">
            {descripcion}
          </Text>
        </div>

        <ul className="grid gap-1.5 text-sm text-text-muted sm:grid-cols-3">
          {details.lineas.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <CheckCircleIcon size={14} weight="fill" className="shrink-0 text-success" />
              {item}
            </li>
          ))}
        </ul>

        <Link
          href={`/editor?plantilla=${id}`}
          className={cn(buttonVariants({ variant: "primary", size: "sm" }), "mt-auto w-fit min-h-10")}
        >
          Usar esta plantilla
          <ArrowRightIcon size={15} />
        </Link>
      </div>
    </Surface>
  )
}
