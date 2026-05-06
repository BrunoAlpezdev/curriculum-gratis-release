"use client"

import { useState } from "react"
import { PencilSimpleIcon, EyeIcon, FileTextIcon, EnvelopeIcon } from "@phosphor-icons/react"
import { BarraAcciones } from "@/editor/BarraAcciones"
import { PanelFormulario } from "@/editor/PanelFormulario"
import { PanelFormularioCarta } from "@/editor/PanelFormularioCarta"
import { PanelVistaPrevia } from "@/editor/PanelVistaPrevia"
import { PanelVistaCarta } from "@/editor/PanelVistaCarta"
import { Button } from "@/components/atoms/Button"
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
        <p className="text-sm text-text-muted">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-app-bg text-text-main">
      <BarraAcciones modo={modo} />

      {/* Toggle CV / Carta */}
      <div
        data-no-print
        className="flex items-center justify-center gap-1 border-b border-border-subtle bg-panel-muted px-2 py-2"
        aria-label="Tipo de documento"
      >
        <Button
          type="button"
          onClick={() => setModo("cv")}
          aria-pressed={modo === "cv"}
          variant={modo === "cv" ? "segmentedActive" : "segmented"}
          size="sm"
          className="min-h-10"
        >
          <FileTextIcon size={14} />
          Curriculum
        </Button>
        <Button
          type="button"
          onClick={() => setModo("carta")}
          aria-pressed={modo === "carta"}
          variant={modo === "carta" ? "segmentedActive" : "segmented"}
          size="sm"
          className="min-h-10"
        >
          <EnvelopeIcon size={14} />
          Carta de presentacion
        </Button>
      </div>

      {/* Tabs mobile */}
      <div
        data-no-print
        role="tablist"
        aria-label="Vista del editor"
        className="flex md:hidden border-b border-border-subtle bg-panel"
      >
        <Button
          type="button"
          role="tab"
          aria-selected={tab === "editar"}
          aria-controls="panel-editar"
          onClick={() => setTab("editar")}
          variant={tab === "editar" ? "tabActive" : "tab"}
          size="none"
          className="flex-1 min-h-12"
        >
          <PencilSimpleIcon size={16} />
          Editar
        </Button>
        <Button
          type="button"
          role="tab"
          aria-selected={tab === "preview"}
          aria-controls="panel-preview"
          onClick={() => setTab("preview")}
          variant={tab === "preview" ? "tabActive" : "tab"}
          size="none"
          className="flex-1 min-h-12"
        >
          <EyeIcon size={16} />
          Vista Previa
        </Button>
      </div>

      {/* Layout principal */}
      <div className="flex flex-1 overflow-hidden">
        <div
          id="panel-editar"
          role="tabpanel"
          className={cn(
            "w-full bg-app-bg md:w-[45%] md:block md:border-r md:border-border-subtle overflow-y-auto",
            tab === "editar" ? "block" : "hidden",
          )}
        >
          {modo === "cv" ? <PanelFormulario /> : <PanelFormularioCarta />}
        </div>
        <div
          id="panel-preview"
          role="tabpanel"
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
