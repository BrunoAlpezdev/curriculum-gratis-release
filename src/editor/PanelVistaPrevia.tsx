"use client"

import { useRef, useEffect, useState } from "react"
import { WarningIcon } from "@phosphor-icons/react"
import { CurriculumVista, A4_WIDTH_PX, A4_HEIGHT_PX } from "@/cv/CurriculumVista"
import { useCurriculumStore } from "@/lib/store"

const TOLERANCIA_PX = 8

export function PanelVistaPrevia() {
  const datos = useCurriculumStore((s) => s.datos)
  const personalizacion = useCurriculumStore((s) => s.personalizacion)
  const contenedorRef = useRef<HTMLDivElement>(null)
  const cvRef = useRef<HTMLDivElement>(null)
  const [escala, setEscala] = useState(1)
  const [alturaCv, setAlturaCv] = useState(A4_HEIGHT_PX)

  useEffect(() => {
    const el = contenedorRef.current
    if (!el) return

    const observer = new ResizeObserver(() => {
      const anchoDisponible = el.clientWidth - 32 // padding
      if (anchoDisponible > 0) {
        setEscala(Math.min(1, anchoDisponible / A4_WIDTH_PX))
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = cvRef.current
    if (!el) return

    const observer = new ResizeObserver(() => {
      setAlturaCv(el.offsetHeight)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const paginas = Math.max(1, Math.ceil(alturaCv / A4_HEIGHT_PX))
  const excede = alturaCv > A4_HEIGHT_PX + TOLERANCIA_PX

  return (
    <div
      ref={contenedorRef}
      className="h-full overflow-y-auto bg-ds-surface-muted p-3 sm:p-4 relative"
    >
      {excede && (
        <div
          data-no-print
          className="sticky top-0 z-10 mb-3 mx-auto max-w-md flex items-start gap-2 border border-ds-accent bg-ds-accent-soft px-3 py-2 text-[12px] text-ds-ink shadow-sm"
        >
          <WarningIcon size={16} weight="fill" className="shrink-0 mt-0.5 text-ds-accent" />
          <div className="flex-1">
            <p className="font-semibold">Tu CV ocupa {paginas} páginas</p>
            <p className="text-ds-ink-muted leading-snug">
              Lo ideal es 1 página. Acorta el perfil, consolida experiencias antiguas o quita habilidades irrelevantes.
            </p>
          </div>
        </div>
      )}
      <div
        className="mx-auto"
        style={{
          width: A4_WIDTH_PX * escala,
          height: alturaCv * escala,
        }}
      >
        <div
          ref={cvRef}
          className="shadow-lg origin-top-left"
          style={{
            transform: `scale(${escala})`,
            width: A4_WIDTH_PX,
            minHeight: A4_HEIGHT_PX,
          }}
        >
          <CurriculumVista datos={datos} personalizacion={personalizacion} />
        </div>
      </div>
    </div>
  )
}
