"use client"

import { useEffect, useEffectEvent, useState } from "react"
import { ClockCounterClockwiseIcon, TrashIcon, XIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import {
  eliminarCopiaLocal,
  formatearFechaCopia,
  obtenerCopiasLocales,
  type CopiaLocalCv,
} from "@/lib/copias-locales"

interface Props {
  abierto: boolean
  onCerrar: () => void
  onRestaurar: (copia: CopiaLocalCv) => void
}

export function DialogCopiasLocales({ abierto, onCerrar, onRestaurar }: Props) {
  const [, refrescar] = useState(0)
  const copias = abierto ? obtenerCopiasLocales() : []
  const cerrarDialogo = useEffectEvent(onCerrar)

  useEffect(() => {
    if (!abierto) return
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") cerrarDialogo()
    }
    document.addEventListener("keydown", handleEscape)
    const overflowPrev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = overflowPrev
    }
  }, [abierto])

  if (!abierto) return null

  function eliminar(id: string) {
    if (!window.confirm("¿Eliminar esta copia local?")) return
    eliminarCopiaLocal(id)
    refrescar((valor) => valor + 1)
  }

  return (
    <Surface
      variant="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Copias locales"
      className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6"
      onClick={onCerrar}
    >
      <Surface
        variant="panel"
        className="flex max-h-[85dvh] w-full flex-col border-0 shadow-2xl md:max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border-subtle px-4 py-3">
          <div className="min-w-0">
            <Text as="h2" variant="strong" className="text-base font-extrabold">
              Copias locales
            </Text>
            <Text variant="caption" className="mt-1 leading-relaxed">
              Se guardan solo en este navegador. Restaurar una copia reemplaza el CV y la carta actuales.
            </Text>
          </div>
          <Button variant="ghost" size="icon" onClick={onCerrar} title="Cerrar">
            <XIcon size={18} />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {copias.length === 0 ? (
            <Surface variant="panelMuted" className="p-4 text-center">
              <ClockCounterClockwiseIcon size={24} className="mx-auto text-text-muted" />
              <Text variant="small" className="mt-2">
                Todavia no tienes copias locales guardadas.
              </Text>
            </Surface>
          ) : (
            <div className="flex flex-col gap-2">
              {copias.map((copia) => (
                <Surface key={copia.id} variant="panelMuted" className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Text as="p" variant="strong" className="truncate text-sm">
                        {copia.nombre}
                      </Text>
                      <Text variant="caption" className="mt-1">
                        {formatearFechaCopia(copia.creadoEn)}
                      </Text>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        onClick={() => onRestaurar(copia)}
                      >
                        Restaurar
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="iconSm"
                        onClick={() => eliminar(copia.id)}
                        title="Eliminar copia"
                      >
                        <TrashIcon size={15} />
                      </Button>
                    </div>
                  </div>
                </Surface>
              ))}
            </div>
          )}
        </div>
      </Surface>
    </Surface>
  )
}
