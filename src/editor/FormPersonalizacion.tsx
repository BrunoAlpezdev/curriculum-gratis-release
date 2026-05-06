"use client"

import { useState } from "react"
import {
  PaletteIcon,
  DotsSixVerticalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@phosphor-icons/react"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { useCurriculumStore } from "@/lib/store"
import {
  COLORES_TEMA,
  PLANTILLAS,
  FUENTES,
  FUENTE_CSS,
  ETIQUETAS_SECCION_ORDENABLE,
  ORDEN_SECCIONES_INICIAL,
} from "@/lib/constantes"
import { Button } from "@/components/atoms/Button"
import { cn } from "@/components/ui/cn"
import type { ColorTema, PlantillaId, FuenteId, IdiomaCv, SeccionOrdenable } from "@/types"

function reordenar<T>(arr: T[], desde: number, hacia: number): T[] {
  const copia = [...arr]
  const [movido] = copia.splice(desde, 1)
  if (movido !== undefined) copia.splice(hacia, 0, movido)
  return copia
}

const IDIOMAS_CV: { valor: IdiomaCv; etiqueta: string; descripcion: string }[] = [
  { valor: "es", etiqueta: "Español", descripcion: "CV en español" },
  { valor: "en", etiqueta: "English", descripcion: "CV in English" },
]

export function FormPersonalizacion() {
  const personalizacion = useCurriculumStore((s) => s.personalizacion)
  const set = useCurriculumStore((s) => s.setPersonalizacion)
  const [arrastrando, setArrastrando] = useState<number | null>(null)
  const [sobreIndex, setSobreIndex] = useState<number | null>(null)
  const ordenSecciones = personalizacion.ordenSecciones ?? ORDEN_SECCIONES_INICIAL

  function actualizarOrden(nuevo: SeccionOrdenable[]) {
    set({ ordenSecciones: nuevo })
  }

  function moverArriba(i: number) {
    if (i === 0) return
    actualizarOrden(reordenar(ordenSecciones, i, i - 1))
  }

  function moverAbajo(i: number) {
    if (i === ordenSecciones.length - 1) return
    actualizarOrden(reordenar(ordenSecciones, i, i + 1))
  }

  return (
    <SeccionFormulario
      titulo="Personalizar"
      icono={<PaletteIcon size={18} />}
      tip={[
        "Plantilla: las marcadas con ATS pasan los filtros automáticos de las empresas grandes. Si envías tu CV por un portal de empleo, usa una de esas.",
        "Color: azul o negro para roles corporativos, finanzas, derecho. Colores más fuertes si postulas a diseño o creatividad.",
        "Fuente: las Serif (con remates) van bien para roles clásicos. Las Sans-serif son más modernas y van mejor para tech.",
        "Menos es más — un CV recargado visualmente distrae. El contenido tiene que ser la estrella, no el diseño.",
        "Idioma: cambia solo los títulos de las secciones. Tus datos los tienes que escribir tú en el idioma del país al que postulas.",
      ]}
    >
      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-sm font-semibold text-text-muted">Idioma del CV</legend>
        <div className="grid grid-cols-2 gap-2">
          {IDIOMAS_CV.map((i) => (
            <Button
              key={i.valor}
              type="button"
              onClick={() => set({ idiomaCv: i.valor })}
              aria-pressed={(personalizacion.idiomaCv ?? "es") === i.valor}
              variant={(personalizacion.idiomaCv ?? "es") === i.valor ? "choiceActive" : "choice"}
              size="none"
              className="block p-2.5"
            >
              <p className="text-sm font-semibold text-text-main">{i.etiqueta}</p>
              <p className="text-xs text-text-muted mt-0.5">{i.descripcion}</p>
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-sm font-semibold text-text-muted">Plantilla</legend>
        <div className="grid grid-cols-2 gap-2">
          {PLANTILLAS.map((p) => (
            <Button
              key={p.valor}
              type="button"
              onClick={() => set({ plantilla: p.valor as PlantillaId })}
              aria-pressed={personalizacion.plantilla === p.valor}
              variant={personalizacion.plantilla === p.valor ? "choiceActive" : "choice"}
              size="none"
              className="block p-3"
            >
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-text-main">{p.etiqueta}</p>
                {p.ats && (
                  <span className="bg-panel-muted text-action-strong px-1.5 py-0.5 text-[10px] font-bold leading-none">
                    ATS
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted mt-0.5">{p.descripcion}</p>
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-sm font-semibold text-text-muted">Color</legend>
        <div className="flex gap-2 flex-wrap">
          {COLORES_TEMA.map((c) => (
            <Button
              key={c.valor}
              type="button"
              onClick={() => set({ color: c.valor as ColorTema })}
              aria-label={`Color ${c.etiqueta}`}
              aria-pressed={personalizacion.color === c.valor}
              variant="plain"
              size="none"
              className={cn(
                "h-8 w-8 rounded-full transition-all cursor-pointer",
                personalizacion.color === c.valor
                  ? "ring-2 ring-offset-2 ring-border-strong ring-offset-app-bg scale-110"
                  : "hover:scale-105",
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-sm font-semibold text-text-muted">Fuente</legend>
        <div className="grid grid-cols-1 gap-2">
          {FUENTES.map((f) => (
            <Button
              key={f.valor}
              type="button"
              onClick={() => set({ fuente: f.valor as FuenteId })}
              aria-pressed={(personalizacion.fuente ?? "inter") === f.valor}
              variant={(personalizacion.fuente ?? "inter") === f.valor ? "choiceActive" : "choice"}
              size="none"
              className="flex items-baseline gap-2 px-3 py-2"
            >
              <span
                className="text-sm font-semibold text-text-main"
                style={{ fontFamily: FUENTE_CSS[f.valor] }}
              >
                {f.etiqueta}
              </span>
              <span className="text-xs text-text-muted">{f.tipo}</span>
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-sm font-semibold text-text-muted">
          Orden de secciones
        </legend>
        <p className="text-xs text-text-muted -mt-1">
          Arrastra o usa las flechas. En Moderno, competencias e idiomas se muestran en el sidebar.
        </p>
        <div className="flex flex-col gap-1.5 mt-1" role="list">
          {ordenSecciones.map((id, i) => (
            <div
              key={id}
              role="listitem"
              draggable
              onDragStart={() => setArrastrando(i)}
              onDragEnter={() => setSobreIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (arrastrando !== null && arrastrando !== i) {
                  actualizarOrden(reordenar(ordenSecciones, arrastrando, i))
                }
                setArrastrando(null)
                setSobreIndex(null)
              }}
              onDragEnd={() => {
                setArrastrando(null)
                setSobreIndex(null)
              }}
              className={cn(
                "flex items-center gap-2 border px-2.5 py-2 bg-panel transition-colors",
                arrastrando === i
                  ? "opacity-40 border-action-primary"
                  : sobreIndex === i && arrastrando !== null
                    ? "border-action-primary bg-action-soft"
                    : "border-border-subtle",
              )}
            >
              <DotsSixVerticalIcon
                size={16}
                className="text-text-muted cursor-grab active:cursor-grabbing shrink-0"
              />
              <span className="flex-1 text-sm text-text-muted">
                {ETIQUETAS_SECCION_ORDENABLE[id]}
              </span>
              <Button
                type="button"
                onClick={() => moverArriba(i)}
                disabled={i === 0}
                variant="iconSubtle"
                size="none"
                className="p-1 disabled:cursor-not-allowed"
                aria-label="Subir"
              >
                <ArrowUpIcon size={14} />
              </Button>
              <Button
                type="button"
                onClick={() => moverAbajo(i)}
                disabled={i === ordenSecciones.length - 1}
                variant="iconSubtle"
                size="none"
                className="p-1 disabled:cursor-not-allowed"
                aria-label="Bajar"
              >
                <ArrowDownIcon size={14} />
              </Button>
            </div>
          ))}
        </div>
      </fieldset>
    </SeccionFormulario>
  )
}
