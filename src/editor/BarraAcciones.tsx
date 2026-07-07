"use client"

import Link from "next/link"
import { useState, useRef, useEffect, useId } from "react"
import {
  ArrowLeftIcon,
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
  CopyIcon,
  ClockCounterClockwiseIcon,
  EnvelopeIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react"
import { Button, buttonVariants } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { AuthActions } from "@/components/molecules/AuthActions"
import { cn } from "@/components/ui/cn"
import { useCurriculumStore } from "@/lib/store"
import { useTema, type Tema } from "@/lib/useTema"
import { exportarJson, importarJson } from "@/lib/importar-exportar"
import { exportarTexto } from "@/lib/exportar-texto"
import { guardarCopiaLocal, intentarGuardarCopiaLocal, ErrorCopiaLocal, type CopiaLocalCv } from "@/lib/copias-locales"
import { descargarDocumento } from "@/lib/descargar-documento"
import { DialogCopiasLocales } from "@/editor/DialogCopiasLocales"
import { DialogEnviarCv } from "@/editor/DialogEnviarCv"
import { DialogEjemploCv } from "@/editor/DialogEjemploCv"
import { DialogoConfirmar, DialogoNombrarCopia } from "@/components/molecules/DialogoConfirmar"
import { IndicadorGuardado } from "@/editor/IndicadorGuardado"
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

type Confirmacion = {
  titulo: string
  descripcion: string
  textoConfirmar?: string
  accion: () => void
}

type Aviso = {
  titulo: string
  descripcion: string
}

export function BarraAcciones({ modo }: BarraAccionesProps) {
  const [descargando, setDescargando] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [ejemploAbierto, setEjemploAbierto] = useState(false)
  const [copiasAbierto, setCopiasAbierto] = useState(false)
  const [enviarAbierto, setEnviarAbierto] = useState(false)
  const [confirmacionPendiente, setConfirmacionPendiente] = useState<Confirmacion | null>(null)
  const [nombrarCopiaAbierto, setNombrarCopiaAbierto] = useState(false)
  const [duplicarAbierto, setDuplicarAbierto] = useState(false)
  const [renombrarAbierto, setRenombrarAbierto] = useState(false)
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const menuId = useId()
  const datos = useCurriculumStore((s) => s.datos)
  const carta = useCurriculumStore((s) => s.carta)
  const personalizacion = useCurriculumStore((s) => s.personalizacion)
  const nombreDocumento = useCurriculumStore((s) => s.nombreDocumento)
  const reiniciarStore = useCurriculumStore((s) => s.reiniciar)
  const setDatos = useCurriculumStore((s) => s.setDatos)
  const setPersonalizacion = useCurriculumStore((s) => s.setPersonalizacion)
  const setCarta = useCurriculumStore((s) => s.setCarta)
  const setNombreDocumento = useCurriculumStore((s) => s.setNombreDocumento)
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
    exportarJson(datos, personalizacion, carta, nombreDocumento)
    setMenuAbierto(false)
  }

  function exportarFormatoTexto(formato: "txt" | "md") {
    exportarTexto(modo, formato, datos, personalizacion, carta)
    setMenuAbierto(false)
  }

  function pedirImportar() {
    inputArchivoRef.current?.click()
    setMenuAbierto(false)
  }

  const nombreActivo = nombreDocumento.trim() || "Mi CV"
  const nombreSugeridoCopia = `${nombreDocumento.trim() || datos.datosPersonales.nombreCompleto.trim() || "Curriculum"} - copia`

  function abrirNombrarCopia() {
    setNombrarCopiaAbierto(true)
    setMenuAbierto(false)
  }

  function abrirRenombrar() {
    setRenombrarAbierto(true)
    setMenuAbierto(false)
  }

  function confirmarRenombrar(nombre: string) {
    setNombreDocumento(nombre)
    setRenombrarAbierto(false)
  }

  function duplicarParaOferta() {
    /* Respaldo del estado actual con su nombre vigente antes de renombrar. */
    intentarGuardarCopiaLocal(nombreActivo, datos, personalizacion, carta)
    setDuplicarAbierto(true)
    setMenuAbierto(false)
  }

  function confirmarDuplicar(nombre: string) {
    /* Solo cambia el nombre: los datos quedan idénticos, listos para adaptar. */
    setNombreDocumento(nombre)
    setDuplicarAbierto(false)
  }

  function confirmarGuardarCopia(nombre: string) {
    try {
      guardarCopiaLocal(nombre, datos, personalizacion, carta)
    } catch (err) {
      if (err instanceof ErrorCopiaLocal) {
        setAviso({
          titulo: "No se pudo guardar la copia",
          descripcion: "No hay espacio en este navegador. Elimina copias antiguas e intenta de nuevo.",
        })
      } else {
        throw err
      }
    }
    setNombrarCopiaAbierto(false)
  }

  function abrirCopias() {
    setCopiasAbierto(true)
    setMenuAbierto(false)
  }

  function abrirEnviar() {
    setEnviarAbierto(true)
    setMenuAbierto(false)
  }

  function restaurarCopia(copia: CopiaLocalCv) {
    setConfirmacionPendiente({
      titulo: "Restaurar copia",
      descripcion: "Esto reemplazará el CV y la carta actuales. ¿Continuar?",
      textoConfirmar: "Restaurar",
      accion: () => {
        intentarGuardarCopiaLocal("Respaldo antes de restaurar", datos, personalizacion, carta)
        setDatos(copia.datos)
        setPersonalizacion(copia.personalizacion)
        setCarta(copia.carta)
        setNombreDocumento(copia.nombre)
        setCopiasAbierto(false)
      },
    })
  }

  async function handleArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    e.target.value = ""
    if (!archivo) return
    const resultado = await importarJson(archivo)
    if (!resultado.ok) {
      setAviso({ titulo: "No se pudo importar", descripcion: resultado.error })
      return
    }
    setConfirmacionPendiente({
      titulo: "Importar datos",
      descripcion: "Esto reemplazará los datos actuales. ¿Continuar?",
      textoConfirmar: "Importar",
      accion: () => {
        intentarGuardarCopiaLocal("Respaldo antes de importar", datos, personalizacion, carta)
        setDatos(resultado.datos)
        setPersonalizacion(resultado.personalizacion)
        setCarta(resultado.carta)
        setNombreDocumento(resultado.nombreDocumento)
      },
    })
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
    setMenuAbierto(false)
    setConfirmacionPendiente({
      titulo: "Reiniciar todo",
      descripcion: "Se borrarán el curriculum, la personalización y la carta. ¿Continuar?",
      textoConfirmar: "Reiniciar",
      accion: () => {
        intentarGuardarCopiaLocal("Respaldo antes de reiniciar", datos, personalizacion, carta)
        reiniciarStore()
      },
    })
  }
  const { tema, setTema } = useTema()

  async function descargar() {
    setDescargando(true)
    try {
      await descargarDocumento(modo, datos, carta, personalizacion)
    } catch (err) {
      const detalle = err instanceof Error && err.message ? ` ${err.message}` : ""
      setAviso({ titulo: "No se pudo generar el PDF", descripcion: `Intenta de nuevo.${detalle}` })
    } finally {
      setDescargando(false)
    }
  }

  const opcionesMenu: { icono: React.ReactNode; etiqueta: string; onClick: () => void }[] = [
    { icono: <FileArrowDownIcon size={16} />, etiqueta: "Exportar JSON", onClick: exportar },
    { icono: <FileArrowDownIcon size={16} />, etiqueta: "Exportar TXT", onClick: () => exportarFormatoTexto("txt") },
    { icono: <FileArrowDownIcon size={16} />, etiqueta: "Exportar Markdown", onClick: () => exportarFormatoTexto("md") },
    { icono: <FileArrowUpIcon size={16} />, etiqueta: "Importar JSON", onClick: pedirImportar },
    { icono: <CopyIcon size={16} />, etiqueta: "Guardar copia local", onClick: abrirNombrarCopia },
    { icono: <CopyIcon size={16} />, etiqueta: "Duplicar para otra oferta", onClick: duplicarParaOferta },
    { icono: <ClockCounterClockwiseIcon size={16} />, etiqueta: "Ver copias locales", onClick: abrirCopias },
    { icono: <ArrowCounterClockwiseIcon size={16} />, etiqueta: "Reiniciar", onClick: reiniciar },
    ...(modo === "cv"
      ? [{ icono: <EnvelopeIcon size={16} />, etiqueta: "Enviar CV por correo", onClick: abrirEnviar }]
      : []),
  ]

  return (
    <Surface data-no-print variant="toolbar" className="flex items-center justify-between px-3 py-2.5 md:px-4">
      <div className="flex items-center gap-1.5 min-w-0">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "min-h-10 shrink-0")}
        >
          <ArrowLeftIcon size={16} />
          <span className="hidden sm:inline">Volver</span>
        </Link>
        <Text
          as="h1"
          variant="strong"
          className="text-base font-extrabold truncate cursor-default select-none"
          onClick={handleTapTitulo}
        >
          <span className="md:hidden">CV Gratis</span>
          <span className="hidden md:inline">Generador de Curriculum</span>
        </Text>
        <Text as="span" variant="caption" className="hidden md:inline">·</Text>
        <button
          type="button"
          onClick={abrirRenombrar}
          title="Renombrar documento"
          className="hidden md:inline-flex items-center gap-1 min-w-0 max-w-[220px] rounded px-1 py-0.5 text-xs text-text-muted transition-colors hover:text-text-strong"
        >
          <span className="truncate">{nombreActivo}</span>
          <PencilSimpleIcon size={12} className="shrink-0" />
        </button>
        <Text as="span" variant="caption" className="hidden md:inline">·</Text>
        <IndicadorGuardado className="hidden md:inline shrink-0" />
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
          onClick={() => setTema(CICLO_TEMA[tema])}
          title={ETIQUETA_TEMA[tema]}
        >
          {ICONO_TEMA[tema]}
        </Button>
        <Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={reiniciar}>
          <ArrowCounterClockwiseIcon size={16} />
          Reiniciar
        </Button>
        <AuthActions compact />

        <div ref={menuRef} className="relative">
          <Button
            ref={botonMenuRef}
            variant="ghost"
            size="icon"
            onClick={() => setMenuAbierto((v) => !v)}
            title="Más opciones"
            aria-haspopup="menu"
            aria-expanded={menuAbierto}
            aria-controls={menuAbierto ? menuId : undefined}
          >
            <DotsThreeVerticalIcon size={18} />
          </Button>
          {menuAbierto && (
            <Surface
              variant="popover"
              id={menuId}
              role="menu"
              onKeyDown={handleTeclaMenu}
              className="absolute right-0 top-full mt-1 z-50 min-w-[260px] py-1"
            >
              {opcionesMenu.map((opcion, i) => (
                <Button
                  key={opcion.etiqueta}
                  ref={(el) => {
                    opcionesMenuRef.current[i] = el
                  }}
                  type="button"
                  role="menuitem"
                  onClick={opcion.onClick}
                  variant="menu"
                  size="none"
                  className="whitespace-nowrap px-3 py-2 text-sm"
                >
                  {opcion.icono}
                  {opcion.etiqueta}
                </Button>
              ))}
            </Surface>
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
          <span className="hidden min-[360px]:inline">
            {descargando ? "Descargando..." : "Descargar PDF"}
          </span>
        </Button>
      </div>
      <DialogEjemploCv abierto={ejemploAbierto} onCerrar={() => setEjemploAbierto(false)} />
      <DialogCopiasLocales abierto={copiasAbierto} onCerrar={() => setCopiasAbierto(false)} onRestaurar={restaurarCopia} />
      <DialogEnviarCv abierto={enviarAbierto} datos={datos} personalizacion={personalizacion} onCerrar={() => setEnviarAbierto(false)} />
      <DialogoConfirmar
        abierto={confirmacionPendiente !== null}
        titulo={confirmacionPendiente?.titulo ?? ""}
        descripcion={confirmacionPendiente?.descripcion}
        textoConfirmar={confirmacionPendiente?.textoConfirmar}
        variante="peligro"
        onConfirmar={() => {
          confirmacionPendiente?.accion()
          setConfirmacionPendiente(null)
        }}
        onCerrar={() => setConfirmacionPendiente(null)}
      />
      <DialogoNombrarCopia
        abierto={nombrarCopiaAbierto}
        nombreSugerido={nombreSugeridoCopia}
        onConfirmar={confirmarGuardarCopia}
        onCerrar={() => setNombrarCopiaAbierto(false)}
      />
      <DialogoNombrarCopia
        abierto={duplicarAbierto}
        nombreSugerido={`${nombreActivo} - copia`}
        titulo="Duplicar para otra oferta"
        descripcion="Se guardó una copia local del CV actual. Nombra la nueva versión para adaptarla a la oferta."
        etiquetaCampo="Nombre del nuevo documento"
        textoConfirmar="Duplicar"
        onConfirmar={confirmarDuplicar}
        onCerrar={() => setDuplicarAbierto(false)}
      />
      <DialogoNombrarCopia
        abierto={renombrarAbierto}
        nombreSugerido={nombreDocumento.trim()}
        titulo="Renombrar documento"
        descripcion="Este nombre te ayuda a saber qué CV estás editando."
        etiquetaCampo="Nombre del documento"
        textoConfirmar="Guardar"
        onConfirmar={confirmarRenombrar}
        onCerrar={() => setRenombrarAbierto(false)}
      />
      <DialogoConfirmar
        abierto={aviso !== null}
        variante="aviso"
        titulo={aviso?.titulo ?? ""}
        descripcion={aviso?.descripcion}
        onCerrar={() => setAviso(null)}
      />
    </Surface>
  )
}
