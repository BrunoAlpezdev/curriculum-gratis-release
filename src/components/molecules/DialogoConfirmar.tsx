"use client"

import { useState } from "react"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { DialogoModal } from "@/components/molecules/DialogoModal"

type Variante = "normal" | "peligro" | "aviso"

interface DialogoConfirmarProps {
  abierto: boolean
  titulo: string
  descripcion?: string
  textoConfirmar?: string
  /** "peligro" usa el boton destructivo; "aviso" muestra solo cerrar (errores). */
  variante?: Variante
  onConfirmar?: () => void
  onCerrar: () => void
}

export function DialogoConfirmar({
  abierto,
  titulo,
  descripcion,
  textoConfirmar = "Continuar",
  variante = "normal",
  onConfirmar,
  onCerrar,
}: DialogoConfirmarProps) {
  return (
    <DialogoModal abierto={abierto} onCerrar={onCerrar} ariaLabel={titulo}>
      <Surface
        variant="panel"
        className="w-full border-0 shadow-2xl md:max-w-md"
      >
        <div className="flex flex-col gap-2 p-5">
          <Text as="h2" variant="strong" className="text-base font-extrabold">
            {titulo}
          </Text>
          {descripcion && (
            <Text variant="small" className="leading-relaxed text-text-muted">
              {descripcion}
            </Text>
          )}
          <div className="mt-3 flex justify-end gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onCerrar}>
              {variante === "aviso" ? "Entendido" : "Cancelar"}
            </Button>
            {variante !== "aviso" && (
              <Button
                type="button"
                variant={variante === "peligro" ? "danger" : "primary"}
                size="sm"
                onClick={() => {
                  onConfirmar?.()
                }}
              >
                {textoConfirmar}
              </Button>
            )}
          </div>
        </div>
      </Surface>
    </DialogoModal>
  )
}

interface DialogoNombrarCopiaProps {
  abierto: boolean
  nombreSugerido: string
  onConfirmar: (nombre: string) => void
  onCerrar: () => void
  titulo?: string
  descripcion?: string
  etiquetaCampo?: string
  textoConfirmar?: string
}

/** Reemplaza el prompt nativo para nombrar una copia local, con Input del DS. */
export function DialogoNombrarCopia({
  abierto,
  nombreSugerido,
  onConfirmar,
  onCerrar,
  titulo = "Guardar copia local",
  descripcion = "Se guarda solo en este navegador.",
  etiquetaCampo = "Nombre de la copia",
  textoConfirmar = "Guardar",
}: DialogoNombrarCopiaProps) {
  return (
    <DialogoModal abierto={abierto} onCerrar={onCerrar} ariaLabel={titulo}>
      {/* El formulario vive como hijo del DialogoModal, que solo monta children
          cuando esta abierto: asi su useState toma el nombreSugerido VIGENTE en
          cada apertura (si viviera en el componente externo, siempre montado,
          quedaria pegado al valor del primer render). */}
      <FormularioNombrar
        nombreSugerido={nombreSugerido}
        onConfirmar={onConfirmar}
        onCerrar={onCerrar}
        titulo={titulo}
        descripcion={descripcion}
        etiquetaCampo={etiquetaCampo}
        textoConfirmar={textoConfirmar}
      />
    </DialogoModal>
  )
}

function FormularioNombrar({
  nombreSugerido,
  onConfirmar,
  onCerrar,
  titulo,
  descripcion,
  etiquetaCampo,
  textoConfirmar,
}: Required<Omit<DialogoNombrarCopiaProps, "abierto">>) {
  const [nombre, setNombre] = useState(nombreSugerido)

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const limpio = nombre.trim()
    if (!limpio) return
    onConfirmar(limpio)
  }

  return (
    <Surface variant="panel" className="w-full border-0 shadow-2xl md:max-w-md">
      <form onSubmit={enviar} className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <Text as="h2" variant="strong" className="text-base font-extrabold">
            {titulo}
          </Text>
          <Text variant="small" className="text-text-muted">
            {descripcion}
          </Text>
        </div>
        <Input
          label={etiquetaCampo}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit" size="sm">
            {textoConfirmar}
          </Button>
        </div>
      </form>
    </Surface>
  )
}
