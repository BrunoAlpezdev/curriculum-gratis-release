"use client"

import { useState } from "react"
import { PencilSimpleIcon, EyeIcon, FileTextIcon, EnvelopeIcon } from "@phosphor-icons/react"
import { BarraAcciones } from "@/editor/BarraAcciones"
import { PanelFormulario } from "@/editor/PanelFormulario"
import { PanelFormularioCarta } from "@/editor/PanelFormularioCarta"
import { PanelVistaPrevia } from "@/editor/PanelVistaPrevia"
import { PanelVistaCarta } from "@/editor/PanelVistaCarta"
import { cn } from "@/components/ui/cn"
import { useHidratado } from "@/lib/useHidratado"

type Tab = "editar" | "preview"
export type Modo = "cv" | "carta"

export function Editor() {
  const [tab, setTab] = useState<Tab>("editar")
  const [modo, setModo] = useState<Modo>("cv")
  const hidratado = useHidratado()

  if (!hidratado) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-ds-ink-muted">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-ds-paper text-ds-ink">
      <BarraAcciones modo={modo} />

      {/* Toggle CV / Carta */}
      <div data-no-print className="flex items-center justify-center gap-1 border-b border-ds-line bg-ds-surface-muted px-2 py-2">
        <button
          type="button"
          onClick={() => setModo("cv")}
          className={cn(
            "flex min-h-10 items-center gap-1.5 px-4 text-sm font-semibold transition-colors cursor-pointer",
            modo === "cv"
              ? "bg-ds-accent text-ds-surface"
              : "text-ds-ink-muted hover:bg-ds-surface hover:text-ds-ink",
          )}
        >
          <FileTextIcon size={14} />
          Curriculum
        </button>
        <button
          type="button"
          onClick={() => setModo("carta")}
          className={cn(
            "flex min-h-10 items-center gap-1.5 px-4 text-sm font-semibold transition-colors cursor-pointer",
            modo === "carta"
              ? "bg-ds-accent text-ds-surface"
              : "text-ds-ink-muted hover:bg-ds-surface hover:text-ds-ink",
          )}
        >
          <EnvelopeIcon size={14} />
          Carta de presentacion
        </button>
      </div>

      {/* Tabs mobile */}
      <div data-no-print className="flex md:hidden border-b border-ds-line bg-ds-surface">
        <button
          type="button"
          onClick={() => setTab("editar")}
          className={cn(
            "flex-1 flex min-h-12 items-center justify-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer",
            tab === "editar"
              ? "text-ds-accent-strong border-b-2 border-ds-accent"
              : "text-ds-ink-muted",
          )}
        >
          <PencilSimpleIcon size={16} />
          Editar
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={cn(
            "flex-1 flex min-h-12 items-center justify-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer",
            tab === "preview"
              ? "text-ds-accent-strong border-b-2 border-ds-accent"
              : "text-ds-ink-muted",
          )}
        >
          <EyeIcon size={16} />
          Vista Previa
        </button>
      </div>

      {/* Layout principal */}
      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            "w-full bg-ds-paper md:w-[45%] md:block md:border-r md:border-ds-line overflow-y-auto",
            tab === "editar" ? "block" : "hidden",
          )}
        >
          {modo === "cv" ? <PanelFormulario /> : <PanelFormularioCarta />}
        </div>
        <div
          className={cn(
            "w-full md:w-[55%] md:block overflow-hidden",
            tab === "preview" ? "block" : "hidden",
          )}
        >
          {modo === "cv" ? <PanelVistaPrevia /> : <PanelVistaCarta />}
        </div>
      </div>
    </div>
  )
}
