"use client"

import { useState } from "react"
import { IdentificationCardIcon, SparkleIcon, SpinnerIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/Button"
import { Surface } from "@/components/atoms/Surface"
import { Text } from "@/components/atoms/Text"
import { Textarea } from "@/components/atoms/Textarea"
import { AiSuggestionPanel } from "@/components/molecules/AiSuggestionPanel"
import { SeccionFormulario } from "@/components/molecules/SeccionFormulario"
import { guardarCopiaLocal } from "@/lib/copias-locales"
import { useCurriculumStore } from "@/lib/store"

export function FormPerfil() {
  const perfil = useCurriculumStore((s) => s.datos.perfil)
  const datos = useCurriculumStore((s) => s.datos)
  const personalizacion = useCurriculumStore((s) => s.personalizacion)
  const carta = useCurriculumStore((s) => s.carta)
  const titulo = useCurriculumStore((s) => s.datos.datosPersonales.titulo)
  const setPerfil = useCurriculumStore((s) => s.setPerfil)
  const [generando, setGenerando] = useState(false)
  const [sugerencia, setSugerencia] = useState("")
  const [error, setError] = useState("")

  async function mejorarPerfil() {
    setGenerando(true)
    setSugerencia("")
    setError("")
    try {
      const respuesta = await fetch("/api/ai/improve-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perfil, titulo }),
      })
      const body = await respuesta.json().catch(() => ({})) as { texto?: string; error?: string }
      if (!respuesta.ok) throw new Error(body.error ?? "No se pudo mejorar el perfil.")
      setSugerencia(body.texto ?? "")
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo mejorar el perfil.")
    } finally {
      setGenerando(false)
    }
  }

  function aplicarSugerencia() {
    guardarCopiaLocal("Respaldo antes de aplicar IA en perfil", datos, personalizacion, carta)
    setPerfil(sugerencia)
    setSugerencia("")
  }

  return (
    <SeccionFormulario
      titulo="Perfil Profesional"
      icono={<IdentificationCardIcon size={18} />}
      tip={[
        "Máximo 3-4 líneas: quién eres, cuántos años de experiencia tienes y cuál es tu especialidad.",
        "Nada de 'soy una persona proactiva con ganas de aprender' — eso lo escribe todo el mundo y no dice nada.",
        "Personalízalo para cada oferta laboral. Uno genérico para todos los trabajos no funciona.",
        "Empieza con tu título + años de experiencia: 'Desarrollador fullstack con 5 años de experiencia en...'",
      ]}
    >
      <Textarea
        label="Resumen profesional"
        placeholder="Profesional con experiencia en..."
        value={perfil}
        onChange={(e) => setPerfil(e.target.value)}
        rows={4}
      />
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={mejorarPerfil}
          disabled={generando || perfil.trim().length < 20}
          className="w-fit"
        >
          {generando ? <SpinnerIcon size={16} className="animate-spin" /> : <SparkleIcon size={16} />}
          {generando ? "Mejorando..." : "Mejorar redaccion con IA"}
        </Button>
        <Text variant="caption">
          Opcional: envia este perfil a Gemini para reescribirlo. Tienes 2 usos diarios sin cuenta y 10 con cuenta gratis; antes de aplicar una sugerencia se guarda una copia local.
        </Text>
      </div>
      {error && (
        <Surface variant="panelMuted" className="border-danger-line bg-danger-soft px-3 py-2">
          <Text variant="small" className="text-danger-text">
            {error}
          </Text>
        </Surface>
      )}
      {sugerencia && (
        <AiSuggestionPanel
          title="Sugerencia editable"
          text={sugerencia}
          applyLabel="Usar sugerencia"
          onApply={aplicarSugerencia}
          onRegenerate={mejorarPerfil}
          onDismiss={() => setSugerencia("")}
          loading={generando}
        />
      )}
    </SeccionFormulario>
  )
}
