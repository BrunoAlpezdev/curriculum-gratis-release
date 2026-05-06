"use client"

import { useState, useRef, useEffect, useId } from "react"
import {
  DownloadSimpleIcon,
  ArrowCounterClockwiseIcon,
  SpinnerIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  EyeIcon,
  DotsThreeVerticalIcon,
  FileArrowDownIcon,
  FileArrowUpIcon,
} from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { useCurriculumStore } from "@/lib/store"
import { useTema, type Tema } from "@/lib/useTema"
import { exportarJson, importarJson } from "@/lib/importar-exportar"
import { DialogEjemploCv } from "@/editor/DialogEjemploCv"
import { generarDatosMock } from "@/editor/datos-ejemplo"
import type { Modo } from "@/editor/Editor"

const CICLO_TEMA: Record<Tema, Tema> = {
  sistema: "claro",
  claro: "oscuro",
  oscuro: "sistema",
}

const ICONO_TEMA: Record<Tema, React.ReactNode> = {
  claro: <SunIcon size={16} />,
  oscuro: <MoonIcon size={16} />,
  sistema: <MonitorIcon size={16} />,
}

const ETIQUETA_TEMA: Record<Tema, string> = {
  claro: "Claro",
  oscuro: "Oscuro",
  sistema: "Sistema",
}

const TAPS_REQUERIDOS = 5
const VENTANA_MS = 2000

interface BarraAccionesProps {
  modo: Modo
}

export function BarraAcciones({ modo }: BarraAccionesProps) {
  const [descargando, setDescargando] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [ejemploAbierto, setEjemploAbierto] = useState(false)
  const menuId = useId()
  const datos = useCurriculumStore((s) => s.datos)
  const carta = useCurriculumStore((s) => s.carta)
  const personalizacion = useCurriculumStore((s) => s.personalizacion)
  const reiniciarStore = useCurriculumStore((s) => s.reiniciar)
  const setDatos = useCurriculumStore((s) => s.setDatos)
  const setPersonalizacion = useCurriculumStore((s) => s.setPersonalizacion)
  const tapsRef = useRef<number[]>([])
  const menuRef = useRef<HTMLDivElement>(null)
  const botonMenuRef = useRef<HTMLButtonElement>(null)
  const opcionesMenuRef = useRef<Array<HTMLButtonElement | null>>([])
  const inputArchivoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!menuAbierto) return
    opcionesMenuRef.current[0]?.focus()

    function handleClickFuera(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbierto(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuAbierto(false)
        botonMenuRef.current?.focus()
      }
    }
    document.addEventListener("mousedown", handleClickFuera)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickFuera)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [menuAbierto])

  function handleTeclaMenu(e: React.KeyboardEvent<HTMLDivElement>) {
    const opciones = opcionesMenuRef.current.filter((opcion): opcion is HTMLButtonElement => !!opcion)
    const actual = document.activeElement
    const indexActual = opciones.findIndex((opcion) => opcion === actual)

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      const direccion = e.key === "ArrowDown" ? 1 : -1
      const siguiente = indexActual === -1
        ? 0
        : (indexActual + direccion + opciones.length) % opciones.length
      opciones[siguiente]?.focus()
    }

    if (e.key === "Home") {
      e.preventDefault()
      opciones[0]?.focus()
    }

    if (e.key === "End") {
      e.preventDefault()
      opciones.at(-1)?.focus()
    }
  }

  function exportar() {
    exportarJson(datos, personalizacion)
    setMenuAbierto(false)
  }

  function pedirImportar() {
    inputArchivoRef.current?.click()
    setMenuAbierto(false)
  }

  async function handleArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    e.target.value = ""
    if (!archivo) return
    const resultado = await importarJson(archivo)
    if (!resultado.ok) {
      window.alert(`No se pudo importar: ${resultado.error}`)
      return
    }
    if (!window.confirm("Esto reemplazará los datos actuales. ¿Continuar?")) return
    setDatos(resultado.datos)
    setPersonalizacion(resultado.personalizacion)
  }

  function handleTapTitulo() {
    const ahora = Date.now()
    tapsRef.current = tapsRef.current.filter((t) => ahora - t < VENTANA_MS)
    tapsRef.current.push(ahora)
    if (tapsRef.current.length >= TAPS_REQUERIDOS) {
      tapsRef.current = []
      useCurriculumStore.setState({ datos: generarDatosMock() })
    }
  }

  function reiniciar() {
    if (window.confirm("¿Seguro que quieres reiniciar? Se borrarán todos los datos del curriculum.")) {
      reiniciarStore()
    }
  }
  const { tema, setTema } = useTema()

  async function descargar() {
    setDescargando(true)
    try {
      if (modo === "carta") {
        const { generarPdfCarta } = await import("@/lib/generar-pdf-carta")
        generarPdfCarta(datos, carta, personalizacion)
      } else {
        const { generarPdf } = await import("@/lib/generar-pdf")
        await generarPdf(datos, personalizacion)
      }
    } finally {
      setDescargando(false)
    }
  }

  return (
    <div data-no-print className="flex items-center justify-between border-b border-ds-line bg-ds-surface px-3 py-2.5 md:px-4">
      <div className="flex items-center gap-1.5 min-w-0">
        <h1
          className="text-base font-extrabold text-ds-ink truncate cursor-default select-none"
          onClick={handleTapTitulo}
        >
          <span className="md:hidden">CV Gratis</span>
          <span className="hidden md:inline">Generador de Curriculum</span>
        </h1>
        <span className="hidden md:inline text-xs text-ds-ink-muted">·</span>
        <span className="hidden md:inline text-xs text-ds-ink-muted shrink-0">100% gratuito</span>
      </div>
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        <Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={() => setEjemploAbierto(true)}>
          <EyeIcon size={16} />
          Ver ejemplo
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setEjemploAbierto(true)} title="Ver ejemplo">
          <EyeIcon size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          onClick={() => setTema(CICLO_TEMA[tema])}
          title={ETIQUETA_TEMA[tema]}
        >
          {ICONO_TEMA[tema]}
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={reiniciar} title="Reiniciar">
          <ArrowCounterClockwiseIcon size={16} />
        </Button>
        <Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={reiniciar}>
          <ArrowCounterClockwiseIcon size={16} />
          Reiniciar
        </Button>

        <div ref={menuRef} className="relative">
          <Button
            ref={botonMenuRef}
            variant="ghost"
            size="icon"
            onClick={() => setMenuAbierto((v) => !v)}
            title="Mas opciones"
            aria-haspopup="menu"
            aria-expanded={menuAbierto}
            aria-controls={menuAbierto ? menuId : undefined}
          >
            <DotsThreeVerticalIcon size={18} />
          </Button>
          {menuAbierto && (
            <div
              id={menuId}
              role="menu"
              onKeyDown={handleTeclaMenu}
              className="absolute right-0 top-full mt-1 z-50 min-w-[180px] border border-ds-line bg-ds-surface py-1 shadow-lg"
            >
              <button
                ref={(el) => {
                  opcionesMenuRef.current[0] = el
                }}
                type="button"
                role="menuitem"
                onClick={exportar}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-ds-ink-muted hover:bg-ds-surface-muted hover:text-ds-ink cursor-pointer"
              >
                <FileArrowDownIcon size={16} />
                Exportar JSON
              </button>
              <button
                ref={(el) => {
                  opcionesMenuRef.current[1] = el
                }}
                type="button"
                role="menuitem"
                onClick={pedirImportar}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-ds-ink-muted hover:bg-ds-surface-muted hover:text-ds-ink cursor-pointer"
              >
                <FileArrowUpIcon size={16} />
                Importar JSON
              </button>
            </div>
          )}
          <input
            ref={inputArchivoRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleArchivo}
          />
        </div>

        <Button size="sm" className="whitespace-nowrap" onClick={descargar} disabled={descargando}>
          {descargando ? (
            <SpinnerIcon size={16} className="animate-spin" />
          ) : (
            <DownloadSimpleIcon size={16} />
          )}
          {descargando ? "Descargando..." : "Descargar PDF"}
        </Button>
      </div>
      <DialogEjemploCv abierto={ejemploAbierto} onCerrar={() => setEjemploAbierto(false)} />
    </div>
  )
}
