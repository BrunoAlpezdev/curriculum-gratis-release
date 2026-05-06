"use client"

import { useEffect, useState } from "react"
import {
  XIcon,
  ArrowSquareOutIcon,
  DownloadSimpleIcon,
  MinusIcon,
  PlusIcon,
} from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"

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

  useEffect(() => {
    if (!abierto) return
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar()
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
  }, [abierto, onCerrar])

  if (!abierto) return null

  const urlPdfEmbebido = `${URL_PDF}#navpanes=0&pagemode=none&zoom=${zoom}`

  function reducirZoom() {
    setZoom((valor) => Math.max(ZOOM_MIN, valor - ZOOM_STEP))
  }

  function aumentarZoom() {
    setZoom((valor) => Math.min(ZOOM_MAX, valor + ZOOM_STEP))
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="CV de ejemplo"
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-ds-ink/65 backdrop-blur-sm md:items-center md:p-6"
      onClick={onCerrar}
    >
      <div
        className="flex h-dvh w-full flex-col bg-ds-surface shadow-2xl md:h-[calc(100dvh-3rem)] md:max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ds-line px-4 py-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-ds-ink">
              CV de ejemplo
            </h2>
            <p className="text-[11px] text-ds-ink-muted truncate">
              Inspirate con este modelo. Tus datos no se modificaran.
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={URL_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 px-2.5 text-xs font-semibold text-ds-ink-muted hover:bg-ds-surface-muted hover:text-ds-ink"
              title="Abrir en pestaña nueva"
            >
              <ArrowSquareOutIcon size={16} />
              <span className="hidden sm:inline">Abrir</span>
            </a>
            <a
              href={URL_PDF}
              download
              className="inline-flex h-9 items-center gap-1.5 px-2.5 text-xs font-semibold text-ds-ink-muted hover:bg-ds-surface-muted hover:text-ds-ink md:hidden"
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

        <div className="relative flex-1 bg-ds-surface-muted min-h-0">
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center md:hidden">
            <div className="max-w-xs border border-ds-line bg-ds-surface p-5">
              <h3 className="text-base font-extrabold text-ds-ink">Ver CV de ejemplo</h3>
              <p className="mt-2 text-sm leading-6 text-ds-ink-muted">
                En celular el visor PDF del navegador puede fallar o verse cortado. Es mejor abrirlo en una pestaña nueva o descargarlo.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={URL_PDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 bg-ds-accent px-4 text-sm font-bold text-ds-surface"
                >
                  <ArrowSquareOutIcon size={16} />
                  Abrir PDF
                </a>
                <a
                  href={URL_PDF}
                  download
                  className="inline-flex min-h-11 items-center justify-center gap-2 border border-ds-line bg-ds-paper px-4 text-sm font-bold text-ds-ink"
                >
                  <DownloadSimpleIcon size={16} />
                  Descargar PDF
                </a>
              </div>
            </div>
          </div>
          <iframe
            src={urlPdfEmbebido}
            title="CV de ejemplo"
            className="hidden h-full w-full border-0 md:block"
          />
          <div className="absolute bottom-3 right-3 z-10 hidden items-center border border-ds-line bg-ds-surface shadow-lg md:flex">
            <button
              type="button"
              onClick={reducirZoom}
              disabled={zoom <= ZOOM_MIN}
              className="inline-flex h-10 w-10 items-center justify-center text-ds-ink-muted hover:bg-ds-surface-muted hover:text-ds-ink disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ds-ink-muted"
              aria-label="Reducir zoom"
            >
              <MinusIcon size={15} />
            </button>
            <span className="min-w-14 border-x border-ds-line px-2 text-center text-xs font-semibold text-ds-ink-muted">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={aumentarZoom}
              disabled={zoom >= ZOOM_MAX}
              className="inline-flex h-10 w-10 items-center justify-center text-ds-ink-muted hover:bg-ds-surface-muted hover:text-ds-ink disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ds-ink-muted"
              aria-label="Aumentar zoom"
            >
              <PlusIcon size={15} />
            </button>
          </div>
          {/* Fallback para navegadores mobile que no embeben PDF.
              Se ve solo si el iframe queda en blanco — el usuario puede tocar
              el boton "Abrir" del header para verlo en pestaña nueva. */}
        </div>
      </div>
    </div>
  )
}
