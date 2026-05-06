"use client"

import { useState, useRef, useEffect, useId } from "react"
import { CaretLeftIcon, CaretRightIcon, CalendarBlankIcon } from "@phosphor-icons/react"
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
        <button
          type="button"
          onClick={onAnioAnterior}
          className="p-1.5 hover:bg-ds-surface-muted transition-colors cursor-pointer"
        >
          <CaretLeftIcon size={16} className="text-ds-ink-muted" />
        </button>
        <button
          type="button"
          onClick={onClickAnio}
          className="text-sm font-semibold text-ds-ink hover:text-ds-accent-strong transition-colors cursor-pointer px-2 py-0.5 hover:bg-ds-surface-muted"
        >
          {anioVisible}
        </button>
        <button
          type="button"
          onClick={onAnioSiguiente}
          className="p-1.5 hover:bg-ds-surface-muted transition-colors cursor-pointer"
        >
          <CaretRightIcon size={16} className="text-ds-ink-muted" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {MESES_LISTA.map((m) => {
          const seleccionado =
            mesSeleccionado === m.valor && anioSeleccionado === anioVisible
          return (
            <button
              key={m.valor}
              type="button"
              onClick={() => onSeleccionarMes(m.valor)}
              className={cn(
                "py-2 text-sm font-semibold transition-colors cursor-pointer",
                seleccionado
                  ? "bg-ds-accent text-ds-surface"
                  : "text-ds-ink-muted hover:bg-ds-surface-muted hover:text-ds-ink",
              )}
            >
              {m.etiqueta}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={onSoloAnio}
        className={cn(
          "w-full py-1.5 text-xs font-semibold transition-colors cursor-pointer border",
          anioEsSeleccionado
            ? "bg-ds-accent text-ds-surface border-ds-accent"
            : "text-ds-ink-muted border-ds-line hover:bg-ds-surface-muted hover:text-ds-ink",
        )}
      >
        Solo {anioVisible}
      </button>
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

  useEffect(() => {
    setPaginaInicio(anioVisible - (anioVisible % ANIOS_POR_PAGINA))
  }, [anioVisible])

  const aniosPagina = Array.from({ length: ANIOS_POR_PAGINA }, (_, i) => paginaInicio + i)

  return (
    <>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPaginaInicio((p) => Math.max(ANIO_MIN - (ANIO_MIN % ANIOS_POR_PAGINA), p - ANIOS_POR_PAGINA))}
          className="p-1.5 hover:bg-ds-surface-muted transition-colors cursor-pointer"
        >
          <CaretLeftIcon size={16} className="text-ds-ink-muted" />
        </button>
        <span className="text-sm font-semibold text-ds-ink">
          {paginaInicio} - {paginaInicio + ANIOS_POR_PAGINA - 1}
        </span>
        <button
          type="button"
          onClick={() => setPaginaInicio((p) => Math.min(ANIO_MAX - (ANIO_MAX % ANIOS_POR_PAGINA), p + ANIOS_POR_PAGINA))}
          className="p-1.5 hover:bg-ds-surface-muted transition-colors cursor-pointer"
        >
          <CaretRightIcon size={16} className="text-ds-ink-muted" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {aniosPagina.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => onSeleccionar(a)}
            className={cn(
              "py-2 text-sm font-semibold transition-colors cursor-pointer",
              a === anioSeleccionado
                ? "bg-ds-accent text-ds-surface"
                : a === anioVisible
                  ? "bg-ds-surface-muted text-ds-ink"
                  : "text-ds-ink-muted hover:bg-ds-surface-muted hover:text-ds-ink",
            )}
          >
            {a}
          </button>
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
      <label id={autoId} className="text-sm font-semibold text-ds-ink-muted">
        {label}
      </label>
      <button
        type="button"
        aria-labelledby={autoId}
        onClick={toggleAbierto}
        className={cn(
          "h-11 border border-ds-line bg-ds-surface px-3 text-base text-left transition-colors focus:border-ds-accent focus:ring-1 focus:ring-ds-accent focus:outline-none cursor-pointer flex items-center gap-2",
          tieneValor || esPresente ? "text-ds-ink" : "text-ds-ink-muted/70",
        )}
      >
        <CalendarBlankIcon size={16} className="text-ds-ink-muted shrink-0" />
        {textoMostrado}
      </button>

      {abierto && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 border border-ds-line bg-ds-surface shadow-lg p-3 flex flex-col gap-2">
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
            <button
              type="button"
              onClick={seleccionarPresente}
              className={cn(
                "w-full py-2 text-sm font-semibold transition-colors cursor-pointer border",
                esPresente
                  ? "bg-ds-accent text-ds-surface border-ds-accent"
                  : "text-ds-ink-muted border-ds-line hover:bg-ds-surface-muted hover:text-ds-ink",
              )}
            >
              Presente
            </button>
          )}
        </div>
      )}
    </div>
  )
}
