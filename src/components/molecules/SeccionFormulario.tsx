"use client"

import { useState, useEffect } from "react"
import { CaretDownIcon, CaretUpIcon, LightbulbIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { cn } from "@/components/ui/cn"

const PEEK_KEY = "curriculum-gratis:tip-peek"
const PEEK_EXPIRY_DIAS = 7
let peekGlobalDisparado = false

function debeHacerPeek(): boolean {
  try {
    const guardado = localStorage.getItem(PEEK_KEY)
    if (!guardado) return true
    const diasTranscurridos = (Date.now() - parseInt(guardado, 10)) / 86_400_000
    return diasTranscurridos >= PEEK_EXPIRY_DIAS
  } catch {
    return false
  }
}

function marcarPeekVisto() {
  try {
    localStorage.setItem(PEEK_KEY, Date.now().toString())
  } catch {
    // ignore
  }
}

interface SeccionFormularioProps {
  titulo: string
  icono: React.ReactNode
  children: React.ReactNode
  defaultAbierta?: boolean
  tip?: string[]
}

export function SeccionFormulario({
  titulo,
  icono,
  children,
  defaultAbierta = true,
  tip,
}: SeccionFormularioProps) {
  const [abierta, setAbierta] = useState(defaultAbierta)
  const [overflowVisible, setOverflowVisible] = useState(defaultAbierta)
  const [tipAbierto, setTipAbierto] = useState(false)
  const [lightbulbAnimado, setLightbulbAnimado] = useState(false)

  useEffect(() => {
    if (!tip || !defaultAbierta) return
    if (peekGlobalDisparado) return
    if (!debeHacerPeek()) return

    peekGlobalDisparado = true
    marcarPeekVisto()

    const animar = setTimeout(() => setLightbulbAnimado(true), 300)
    const abrir = setTimeout(() => setTipAbierto(true), 500)
    const cerrar = setTimeout(() => setTipAbierto(false), 3000)

    return () => {
      clearTimeout(animar)
      clearTimeout(abrir)
      clearTimeout(cerrar)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggle() {
    const siguiente = !abierta
    setAbierta(siguiente)
    if (!siguiente) setOverflowVisible(false)
  }

  return (
    <Surface variant="panel">
      <Button
        type="button"
        onClick={toggle}
        variant="plain"
        size="none"
        className="flex w-full items-center justify-between px-4 py-4"
      >
        <div className="flex items-center gap-2">
          <span className="text-action-strong">{icono}</span>
          <Text as="h3" variant="strong" className="text-base font-extrabold">{titulo}</Text>
        </div>
        {abierta ? (
          <CaretUpIcon size={16} className="text-text-muted" />
        ) : (
          <CaretDownIcon size={16} className="text-text-muted" />
        )}
      </Button>
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
          abierta ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
        onTransitionEnd={() => {
          if (abierta) setOverflowVisible(true)
        }}
      >
        <div className={cn("min-h-0", overflowVisible ? "overflow-visible" : "overflow-hidden")}>
          <div className="border-t border-border-subtle px-4 py-4 flex flex-col gap-4">
            {tip && (
              <div className="flex flex-col gap-0">
                <Button
                  type="button"
                  onClick={() => setTipAbierto((v) => !v)}
                  variant="plain"
                  size="none"
                  className="flex w-fit items-center gap-1.5 text-action-strong"
                >
                  <LightbulbIcon
                    size={14}
                    weight="fill"
                    className={lightbulbAnimado ? "tip-wiggle" : ""}
                    onAnimationEnd={() => setLightbulbAnimado(false)}
                  />
                  <Text as="span" variant="caption" className="font-medium text-action-strong">Consejos</Text>
                  <CaretDownIcon
                    size={12}
                     className={cn(
                       "transition-transform duration-200 text-action-primary",
                      tipAbierto && "rotate-180",
                    )}
                  />
                </Button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
                    tipAbierto ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <Surface as="ul" variant="notice" className="mt-2 flex flex-col gap-1.5 px-3 py-2.5 shadow-none">
                      {tip.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-text-main leading-relaxed">
                          <span className="mt-0.5 shrink-0 text-action-primary">•</span>
                          {t}
                        </li>
                      ))}
                    </Surface>
                  </div>
                </div>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </Surface>
  )
}
