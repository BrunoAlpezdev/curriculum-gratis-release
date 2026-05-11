"use client"

import { useState, useRef, useEffect, useId } from "react"
import { CaretLeftIcon, CaretRightIcon, CalendarBlankIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { cn } from "@/components/ui/cn"
import { MESES } from "@/lib/formato"

const MESES_LISTA = Object.entries(MESES).map(([valor, etiqueta]) => ({
  valor,
  etiqueta,
}))

interface SelectorFechaProps {
  label: string
  valor: string | null
  onChange: (valor: string | null) => void
  permitirPresente?: boolean
  placeholder?: string
}

const ANIO_ACTUAL = new Date().getFullYear()
const ANIO_MIN = 1950
const ANIO_MAX = ANIO_ACTUAL + 1

function clampAnio(anio: number): number {
  if (anio < ANIO_MIN || anio > ANIO_MAX) return ANIO_ACTUAL
  return anio
}

function parsearAnio(valor: string | null): number {
  if (!valor) return ANIO_ACTUAL
  const anio = parseInt(valor.split("-")[0] ?? "", 10)
  return isNaN(anio) ? ANIO_ACTUAL : clampAnio(anio)
}

function parsearMes(valor: string | null): string | null {
  if (!valor) return null
  return valor.split("-")[1] ?? null
}

function formatearTexto(valor: string | null, placeholder: string): string {
  if (valor === null || valor === "") return placeholder
  const mes = parsearMes(valor)
  const anio = valor.split("-")[0]
  if (!anio) return placeholder
  if (!mes) return anio
  return `${MESES[mes] ?? mes} ${anio}`
}

const ANIOS_POR_PAGINA = 12

function VistaMeses({
  anioVisible,
  anioSeleccionado,
  mesSeleccionado,
  onAnioAnterior,
  onAnioSiguiente,
  onClickAnio,
  onSeleccionarMes,
  onSoloAnio,
}: {
  anioVisible: number
  anioSeleccionado: number | null
  mesSeleccionado: string | null
  onAnioAnterior: () => void
  onAnioSiguiente: () => void
  onClickAnio: () => void
  onSeleccionarMes: (mes: string) => void
  onSoloAnio: () => void
}) {
  const anioEsSeleccionado = anioSeleccionado === anioVisible && !mesSeleccionado

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          type="button"
          onClick={onAnioAnterior}
          variant="iconSubtle"
          size="none"
          className="p-1.5"
        >
          <CaretLeftIcon size={16} className="text-text-muted" />
        </Button>
        <Button
          type="button"
          onClick={onClickAnio}
          variant="ghost"
          size="none"
          className="px-2 py-0.5 text-sm text-text-main hover:text-action-strong"
        >
          {anioVisible}
        </Button>
        <Button
          type="button"
          onClick={onAnioSiguiente}
          variant="iconSubtle"
          size="none"
          className="p-1.5"
        >
          <CaretRightIcon size={16} className="text-text-muted" />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {MESES_LISTA.map((m) => {
          const seleccionado =
            mesSeleccionado === m.valor && anioSeleccionado === anioVisible
          return (
            <Button
              key={m.valor}
              type="button"
              onClick={() => onSeleccionarMes(m.valor)}
              variant={seleccionado ? "segmentedActive" : "ghost"}
              size="none"
              className="py-2 text-sm"
            >
              {m.etiqueta}
            </Button>
          )
        })}
      </div>
      <Button
        type="button"
        onClick={onSoloAnio}
        variant={anioEsSeleccionado ? "segmentedActive" : "secondary"}
        size="none"
        className="w-full border py-1.5 text-xs"
      >
        Solo {anioVisible}
      </Button>
    </>
  )
}

function VistaAnios({
  anioVisible,
  anioSeleccionado,
  onSeleccionar,
}: {
  anioVisible: number
  anioSeleccionado: number | null
  onSeleccionar: (anio: number) => void
}) {
  const inicio = anioVisible - (anioVisible % ANIOS_POR_PAGINA)
  const [paginaInicio, setPaginaInicio] = useState(inicio)

  const aniosPagina = Array.from({ length: ANIOS_POR_PAGINA }, (_, i) => paginaInicio + i)

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          type="button"
          onClick={() => setPaginaInicio((p) => Math.max(ANIO_MIN - (ANIO_MIN % ANIOS_POR_PAGINA), p - ANIOS_POR_PAGINA))}
          variant="iconSubtle"
          size="none"
          className="p-1.5"
        >
          <CaretLeftIcon size={16} className="text-text-muted" />
        </Button>
        <Text as="span" variant="strong" className="text-sm">
          {paginaInicio} - {paginaInicio + ANIOS_POR_PAGINA - 1}
        </Text>
        <Button
          type="button"
          onClick={() => setPaginaInicio((p) => Math.min(ANIO_MAX - (ANIO_MAX % ANIOS_POR_PAGINA), p + ANIOS_POR_PAGINA))}
          variant="iconSubtle"
          size="none"
          className="p-1.5"
        >
          <CaretRightIcon size={16} className="text-text-muted" />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {aniosPagina.map((a) => (
          <Button
            key={a}
            type="button"
            onClick={() => onSeleccionar(a)}
            variant={a === anioSeleccionado ? "segmentedActive" : "ghost"}
            size="none"
            className={cn("py-2 text-sm", a === anioVisible && a !== anioSeleccionado && "bg-panel-muted text-text-main")}
          >
            {a}
          </Button>
        ))}
      </div>
    </>
  )
}

export function SelectorFecha({
  label,
  valor,
  onChange,
  permitirPresente = false,
  placeholder = "Seleccionar",
}: SelectorFechaProps) {
  const autoId = useId()
  const [abierto, setAbierto] = useState(false)
  const [anioVisible, setAnioVisible] = useState(() => parsearAnio(valor))
  const [vistaAnios, setVistaAnios] = useState(() => !parsearMes(valor))
  const contenedorRef = useRef<HTMLDivElement>(null)

  const mesSeleccionado = parsearMes(valor)
  const anioSeleccionado = valor ? parsearAnio(valor) : null
  const esPresente = valor === null && permitirPresente

  useEffect(() => {
    function handleClickFuera(e: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false)
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setAbierto(false)
    }

    if (abierto) {
      document.addEventListener("mousedown", handleClickFuera)
      document.addEventListener("keydown", handleEscape)
      return () => {
        document.removeEventListener("mousedown", handleClickFuera)
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [abierto])

  function toggleAbierto() {
    if (!abierto) {
      setAnioVisible(parsearAnio(valor))
      setVistaAnios(!parsearMes(valor))
    }
    setAbierto((actual) => !actual)
  }


  function seleccionarMes(mes: string) {
    onChange(`${anioVisible}-${mes}`)
    setAbierto(false)
  }

  function soloAnio() {
    onChange(`${anioVisible}`)
    setAbierto(false)
  }

  function seleccionarPresente() {
    onChange(null)
    setAbierto(false)
  }

  const textoMostrado = esPresente ? "Presente" : formatearTexto(valor, placeholder)
  const tieneValor = valor !== null && valor !== ""

  return (
    <div ref={contenedorRef} className="relative flex flex-col gap-1.5">
      <Text as="label" id={autoId} variant="label">
        {label}
      </Text>
      <Button
        type="button"
        aria-labelledby={autoId}
        onClick={toggleAbierto}
        variant="plain"
        size="none"
        className={cn(
          "h-11 border border-border-subtle bg-panel px-3 text-base text-left transition-colors focus:border-action-primary focus:ring-1 focus:ring-action-primary focus:outline-none cursor-pointer flex items-center gap-2",
          tieneValor || esPresente ? "text-text-main" : "text-text-muted/70",
        )}
      >
        <CalendarBlankIcon size={16} className="text-text-muted shrink-0" />
        {textoMostrado}
      </Button>

      {abierto && (
        <Surface variant="popover" className="absolute top-full left-0 right-0 mt-1 z-50 flex flex-col gap-2 p-3">
          {vistaAnios ? (
            <VistaAnios
              anioVisible={anioVisible}
              anioSeleccionado={anioSeleccionado}
              onSeleccionar={(a) => { setAnioVisible(a); setVistaAnios(false) }}
            />
          ) : (
            <VistaMeses
              anioVisible={anioVisible}
              anioSeleccionado={anioSeleccionado}
              mesSeleccionado={mesSeleccionado}
              onAnioAnterior={() => setAnioVisible((a) => Math.max(ANIO_MIN, a - 1))}
              onAnioSiguiente={() => setAnioVisible((a) => Math.min(ANIO_MAX, a + 1))}
              onClickAnio={() => setVistaAnios(true)}
              onSeleccionarMes={seleccionarMes}
              onSoloAnio={soloAnio}
            />
          )}

          {/* Boton Presente */}
          {permitirPresente && (
            <Button
              type="button"
              onClick={seleccionarPresente}
              variant={esPresente ? "segmentedActive" : "secondary"}
              size="none"
              className="w-full border py-2 text-sm"
            >
              Presente
            </Button>
          )}
        </Surface>
      )}
    </div>
  )
}
