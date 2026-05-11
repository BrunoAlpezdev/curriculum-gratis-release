"use client"

import { useEffect, useEffectEvent, useState } from "react"
import { EnvelopeIcon, SpinnerIcon, XIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { useUsageLimits } from "@/lib/use-usage-limits"
import type { DatosCurriculum, Personalizacion } from "@/types"

interface Props {
  abierto: boolean
  datos: DatosCurriculum
  personalizacion: Personalizacion
  onCerrar: () => void
}

function arrayBufferABase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  const chunkSize = 0x8000
  let binario = ""
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binario += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binario)
}

export function DialogEnviarCv({ abierto, datos, personalizacion, onCerrar }: Props) {
  const [email, setEmail] = useState(datos.datosPersonales.email)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState("")
  const [enviado, setEnviado] = useState(false)
  const { usage, refresh: refreshUsage } = useUsageLimits()
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

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setEnviado(false)
    setEnviando(true)
    try {
      const { generarPdfBlob } = await import("@/lib/generar-pdf")
      const { blob, nombreArchivo } = await generarPdfBlob(datos, personalizacion)
      const pdfBase64 = arrayBufferABase64(await blob.arrayBuffer())
      const respuesta = await fetch("/api/send-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          nombre: datos.datosPersonales.nombreCompleto,
          nombreArchivo,
          pdfBase64,
        }),
      })
      const body = await respuesta.json().catch(() => ({})) as { error?: string }
      if (!respuesta.ok) throw new Error(body.error ?? "No se pudo enviar el correo.")
      setEnviado(true)
      void refreshUsage()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar el correo.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Surface
      variant="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Enviar CV por correo"
      className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6"
      onClick={onCerrar}
    >
      <Surface
        variant="panel"
        className="w-full border-0 shadow-2xl md:max-w-md"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border-subtle px-4 py-3">
          <div>
            <Text as="h2" variant="strong" className="text-base font-extrabold">
              Enviar CV por correo
            </Text>
            <Text variant="caption" className="mt-1 leading-relaxed">
              Generamos el PDF en tu navegador y lo enviamos como adjunto mediante nuestro servidor y proveedor de email. Nada se guarda.
            </Text>
            {usage && (
              <Text variant="caption" className="mt-1 font-semibold text-action-strong">
                {usage.limits.email.remaining > 0
                  ? `Te quedan ${usage.limits.email.remaining} de ${usage.limits.email.limit} envios hoy${usage.tier === "free" ? " en tu cuenta Free" : " sin cuenta"}.`
                  : usage.tier === "anonymous"
                    ? "Se acabaron tus envios sin cuenta. Inicia sesion gratis para mas envios hoy."
                    : "Alcanzaste tu limite diario Free de envios. Vuelve manana."}
              </Text>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onCerrar} title="Cerrar">
            <XIcon size={18} />
          </Button>
        </div>

        <form onSubmit={enviar} className="flex flex-col gap-4 p-4">
          <Input
            label="Email de destino"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && (
            <Surface variant="panelMuted" className="border-danger-line bg-danger-soft px-3 py-2">
              <Text variant="small" className="text-danger-text">
                {error}
              </Text>
            </Surface>
          )}
          {enviado && (
            <Surface variant="notice" className="px-3 py-2">
              <Text variant="small" className="font-semibold text-action-strong">
                CV enviado correctamente.
              </Text>
            </Surface>
          )}
          <Button type="submit" disabled={enviando || !email.trim()}>
            {enviando ? <SpinnerIcon size={16} className="animate-spin" /> : <EnvelopeIcon size={16} />}
            {enviando ? "Enviando..." : "Enviar CV"}
          </Button>
        </form>
      </Surface>
    </Surface>
  )
}
