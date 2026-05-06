"use client"

import { useRef, useEffect, useState } from "react"
import { VistaCarta } from "@/cv/VistaCarta"
import { A4_WIDTH_PX, A4_HEIGHT_PX } from "@/cv/CurriculumVista"
import { useCurriculumStore } from "@/lib/store"

export function PanelVistaCarta() {
  const datos = useCurriculumStore((s) => s.datos)
  const carta = useCurriculumStore((s) => s.carta)
  const personalizacion = useCurriculumStore((s) => s.personalizacion)
  const contenedorRef = useRef<HTMLDivElement>(null)
  const cartaRef = useRef<HTMLDivElement>(null)
  const [escala, setEscala] = useState(1)
  const [alturaCarta, setAlturaCarta] = useState(A4_HEIGHT_PX)

  useEffect(() => {
    const el = contenedorRef.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      const anchoDisponible = el.clientWidth - 32
      if (anchoDisponible > 0) {
        setEscala(Math.min(1, anchoDisponible / A4_WIDTH_PX))
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = cartaRef.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      setAlturaCarta(el.offsetHeight)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={contenedorRef}
      className="h-full overflow-y-auto bg-panel-muted p-3 sm:p-4"
    >
      <div
        className="mx-auto"
        style={{
          width: A4_WIDTH_PX * escala,
          height: alturaCarta * escala,
        }}
      >
        <div
          ref={cartaRef}
          className="shadow-lg origin-top-left"
          style={{
            transform: `scale(${escala})`,
            width: A4_WIDTH_PX,
            minHeight: A4_HEIGHT_PX,
          }}
        >
          <VistaCarta
            datos={datos}
            carta={carta}
            personalizacion={personalizacion}
          />
        </div>
      </div>
    </div>
  )
}
