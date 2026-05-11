"use client"

import { useEffect, useEffectEvent, useState } from "react"
import {
  XIcon,
  ArrowSquareOutIcon,
  DownloadSimpleIcon,
  MinusIcon,
  PlusIcon,
} from "@phosphor-icons/react"
import { Button, buttonVariants } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { cn } from "@/components/ui/cn"

const URL_PDF = "/Bruno_Alexis_Perez_Valenzuela_CV.pdf"
const ZOOM_MIN = 75
const ZOOM_MAX = 150
const ZOOM_STEP = 25

interface Props {
  abierto: boolean
  onCerrar: () => void
}

export function DialogEjemploCv({ abierto, onCerrar }: Props) {
  const [zoom, setZoom] = useState(100)
  const cerrarDialogo = useEffectEvent(onCerrar)

  useEffect(() => {
    if (!abierto) return
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") cerrarDialogo()
    }
    document.addEventListener("keydown", handleEscape)
    /* Bloquear scroll del body mientras el dialog esta abierto.
       En mobile el iframe del PDF puede tener su propio scroll y queremos
       que el body no se mueva detras. */
    const overflowPrev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = overflowPrev
    }
  }, [abierto])

  if (!abierto) return null

  const urlPdfEmbebido = `${URL_PDF}#navpanes=0&pagemode=none&zoom=${zoom}`

  function reducirZoom() {
    setZoom((valor) => Math.max(ZOOM_MIN, valor - ZOOM_STEP))
  }

  function aumentarZoom() {
    setZoom((valor) => Math.min(ZOOM_MAX, valor + ZOOM_STEP))
  }

  return (
    <Surface
      variant="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="CV de ejemplo"
      className="fixed inset-0 z-50 flex items-stretch justify-center md:items-center md:p-6"
      onClick={onCerrar}
    >
      <Surface
        variant="panel"
        className="flex h-dvh w-full flex-col border-0 shadow-2xl md:h-[calc(100dvh-3rem)] md:max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <div className="min-w-0">
            <Text as="h2" variant="strong" className="text-sm">
              CV de ejemplo
            </Text>
            <Text variant="caption" className="truncate text-[11px]">
              Inspirate con este modelo. Tus datos no se modificaran.
            </Text>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={URL_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "ghost", size: "xs" }), "h-9")}
              title="Abrir en pestaña nueva"
            >
              <ArrowSquareOutIcon size={16} />
              <span className="hidden sm:inline">Abrir</span>
            </a>
            <a
              href={URL_PDF}
              download
              className={cn(buttonVariants({ variant: "ghost", size: "xs" }), "h-9 md:hidden")}
              title="Descargar PDF"
            >
              <DownloadSimpleIcon size={16} />
              <span className="hidden sm:inline">Descargar</span>
            </a>
            <Button variant="ghost" size="icon" onClick={onCerrar} title="Cerrar">
              <XIcon size={18} />
            </Button>
          </div>
        </div>

        <Surface variant="preview" className="relative flex-1 min-h-0">
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center md:hidden">
            <Surface variant="panel" className="max-w-xs p-5">
              <Text as="h3" variant="strong" className="text-base font-extrabold">Ver CV de ejemplo</Text>
              <Text variant="small" className="mt-2 leading-6">
                En celular el visor PDF del navegador puede fallar o verse cortado. Es mejor abrirlo en una pestaña nueva o descargarlo.
              </Text>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={URL_PDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "primary", size: "md" }), "min-h-11")}
                >
                  <ArrowSquareOutIcon size={16} />
                  Abrir PDF
                </a>
                <a
                  href={URL_PDF}
                  download
                  className={cn(buttonVariants({ variant: "secondary", size: "md" }), "min-h-11 bg-app-bg")}
                >
                  <DownloadSimpleIcon size={16} />
                  Descargar PDF
                </a>
              </div>
            </Surface>
          </div>
          <iframe
            src={urlPdfEmbebido}
            title="CV de ejemplo"
            className="hidden h-full w-full border-0 md:block"
          />
          <Surface variant="popover" className="absolute bottom-3 right-3 z-10 hidden items-center md:flex">
            <Button
              type="button"
              onClick={reducirZoom}
              disabled={zoom <= ZOOM_MIN}
              variant="iconSubtle"
              size="icon"
              className="size-10 disabled:hover:bg-transparent disabled:hover:text-text-muted"
              aria-label="Reducir zoom"
            >
              <MinusIcon size={15} />
            </Button>
            <Text as="span" variant="caption" className="min-w-14 border-x border-border-subtle px-2 text-center font-semibold">
              {zoom}%
            </Text>
            <Button
              type="button"
              onClick={aumentarZoom}
              disabled={zoom >= ZOOM_MAX}
              variant="iconSubtle"
              size="icon"
              className="size-10 disabled:hover:bg-transparent disabled:hover:text-text-muted"
              aria-label="Aumentar zoom"
            >
              <PlusIcon size={15} />
            </Button>
          </Surface>
          {/* Fallback para navegadores mobile que no embeben PDF.
              Se ve solo si el iframe queda en blanco — el usuario puede tocar
              el boton "Abrir" del header para verlo en pestaña nueva. */}
        </Surface>
      </Surface>
    </Surface>
  )
}
